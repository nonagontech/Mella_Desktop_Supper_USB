import React, { useState, useEffect } from 'react'
import { useHistory } from "react-router-dom";
import {
  Menu,
  Popover,
  Button,
  Modal
} from 'antd';
import PropTypes from 'prop-types';
import { SyncOutlined, createFromIconfontCN, LoadingOutlined } from '@ant-design/icons';
import { SearchOutlined } from '@ant-design/icons';
import moment from 'moment'
import MyModal from './../myModal/MyModal'
import { connect } from 'react-redux'
import { setMenuNum } from '../../store/actions';

//import 'antd/dist/antd.css';
import './heard.less'
import help from './../../assets/images/help.png'
import message from './../../assets/images/message.png'
import triangle from './../../assets/img/triangle.png'
import { mTop, px, MTop } from '../px';
import electronStore from '../electronStore';
import dog from './../../assets/images/reddog.png'
import cat from './../../assets/images/redcat.png'
import other from './../../assets/images/redother.png'
import menu from './../../assets/img/menu.png'
import heardLeft from './../../assets/img/heardLeft.png'
import blueSearchPng from './../../assets/img/blueSearch.png'
import close from './../../assets/img/close.png'
import MinClose from '../../utils/minClose/MinClose';
import jinggao from './../../assets/img/jinggao.png'
import redclose from './../../assets/img/redclose.png'

import rMin_red from './../../assets/img/min-red.png'
import rClose_red from './../../assets/img/close-red.png'

import rMin_white from './../../assets/img/min-white.png'
import rClose_white from './../../assets/img/close-white.png'
import mellaLogo from './../../assets/images/mellaLogo.png'
import { version, updateTime } from './../appversion'
import { fetchRequest4 } from '../FetchUtil4';
import Button1 from '../button/Button';

const { SubMenu } = Menu;
const MyIcon = createFromIconfontCN({
  scriptUrl: '//at.alicdn.com/t/font_2326495_7b2bscbhvvt.js'
})

const allPetList = electronStore.get('doctorExam')
let storage = window.localStorage
let ipcRenderer = window.electron.ipcRenderer

let mouseoutTimer = null
let matchingTimer = null

/**
 * 
 * @param {function} onReturn  点击返回按钮后调用的函数
 * @param {function} onSearch  点击搜索到的宠物后把宠物信息传回去
 * @returns 
 */


const Heard = ({
  onReturn,
  onSearch,
  menu1Click,
  menu2Click,
  menu3Click,
  menu4Click,
  menu5Click,
  menu6Click,
  menu7Click,
  menu8Click,
  menu9Click,
  blueSearch,
  setMenuNum
}) => {
  const [minbgc, setMinbgc] = useState('')        //最小化的背景颜色
  const [closebgc, setClosebgc] = useState('')    //关闭按钮的背景色
  const [rMin, setRMin] = useState(rMin_red)      //最小化的图标
  const [rClose, setRClose] = useState(rClose_red) //关闭按钮图标
  const [value, setValue] = useState('')          //搜索框输入的内容
  const [visible, setVisible] = useState(false)   //搜索框下面的搜索model
  const [loading, setLoading] = useState(false)     //搜索宠物过程中的加载图标
  const [petList, setPetList] = useState([])        //搜索到的宠物列表
  const [menuVisible, setMenuVisible] = useState(false)//菜单图标下面的菜单内容图标
  const [menuMouseOverIndex, setMenuMouseOverIndex] = useState('')//用来定位鼠标滑到哪个菜单选项


  const [modalvisible, setModalVisible] = useState(false)       //关于的弹窗
  const [modalVis, setModalVis] = useState(false)               //RFID搜索是否有宠物的弹窗
  const [isNotFound, setIsNotFound] = useState(false)           //是否找到RFID对应的图标
  const [deviceModel, setDeviceModel] = useState(false)         //我的设备弹窗

  const [noUSB, setNoUSB] = useState(false)                 //没有底座设备
  const [searchMac, setSearchMac] = useState(false)         //是否展示狗牌mac搜索图标下面的Modal框
  const [bluDevice, setBluDevice] = useState([])            //搜索到的狗牌设备mac地址

  const [isShowBlePetList, setIsShowBlePetList] = useState(false)  //是否展示狗牌对应宠物
  const [isMatchPet, setIsMatchPet] = useState(false)      //正在匹配狗牌对应的宠物
  const [macMatchPetList, setMacMatchPetList] = useState([])
  const [updateStatus, setUpdateStatus] = useState('init')
  const [lastVersion, setLastVersion] = useState(version)
  const [downLoadNum, setDownLoadingNum] = useState(0)
  const [selectDeviceMac, setSelectDeviceMac] = useState('')

  //这里是为了模拟数据所做出来的,后期要改成接口
  const testPetList = [

    { macId: "E0:7C:62:30:08:08", petName: 'Mella', petId: "b9de0868-9202-4fc9-9f1b-325220ceeccf" },
    { macId: "E0:7C:62:03:75:32", petName: 'Possum', petId: "e4b11580-1277-4b10-bd64-46b097f6f882" },
    { macId: "E0:7D:EA:A8:8D:7E", petName: 'Charlie', petId: "b4e7a185-1c7e-4885-ab95-4a7d2d2ada83" },
    { macId: "E0:7C:62:32:76:8C", petName: 'Noah', petId: "01b34bf2-47e6-4036-884f-47299447cb6a" },

    { macId: "84:C2:E4:03:C3:06", petName: "Whitey", petId: "f713a238-f5df-4c85-8c4f-5766b0770c07" },
  ]





  useEffect(() => {
    console.log('mac列表为空,初始化');
    mouseoutTimer && clearTimeout(mouseoutTimer)
    setBluDevice([])
    return () => {
      matchingTimer && clearTimeout(matchingTimer)
    }
  }, [])
  useEffect(() => {
    ipcRenderer.on('uploadMessage', uploadMessage)
    return () => {
      ipcRenderer.removeListener('uploadMessage', uploadMessage)
    }
  }, [])

  const uploadMessage = (e, data) => {
    switch (data.payload.status) {
      case -1:
        console.log('查询异常');
        break;

      case 0:
        console.log('正在检查应用程序更新');
        setUpdateStatus('check')
        break;

      case 2:
        console.log('正在检查应用程序更新');
        setUpdateStatus('lastVersion')
        break;

      case 1:
        console.log('检测到新版本');
        let version = data.output.version
        setLastVersion(version)

        setUpdateStatus('newVersion')
        break;

      case 3:
        console.log('下载新版成功');
      case 4:
        console.log('取消背景下载');
      case 5:
        console.log('取消安装');
        setUpdateStatus('init')
        break;
      case 6:
        console.log('正在下载');
        setUpdateStatus('downLoading')
        let loadNum = data.output.percent ? (data.output.percent / 100).toFixed(1) : 0
        setDownLoadingNum(loadNum)

      default:
        break;
    }
  }


  useEffect(() => {
    if (blueSearch) {
      console.log('---渲染时执行----??????');
      ipcRenderer.on('sned', _send)
      ipcRenderer.on('noUSB', _noUSB)
      return () => {
        console.log('----卸载----?????????/');
        ipcRenderer.removeListener('sned', _send)
        ipcRenderer.removeListener('noUSB', _noUSB)
      }
    }

  }, [])

  const _noUSB = (e, data) => {
    console.log('没有USB设备：', data);
    if (data === false) {
      setNoUSB(false)
    } else {
      if (!noUSB) {
        setNoUSB(true)
      }
    }
  }
  const _send = (event, data) => {

    command(data)()
  }
  // newArr 指的是十进制数字数组，   dataArr1:指的是16进制字符串数组
  const command = (newArr) => {
    let dataArr1 = newArr.map(item => {
      if (item.toString(16).length < 2) {
        return '0' + item.toString(16)
      } else {
        return item.toString(16)
      }
    })
    console.log(dataArr1);
    const instruction = [255]
    const commandArr = {

      255: () => {
        // console.log(dataArr1);
        // console.log(bluDevice);
        let length = newArr.length
        let frameLength = newArr[1]   //帧长
        let itemLength = newArr[3] + 1  //数据位的长度   13
        let dataIndex = 0

        let MAC = ''
        let bluData = []
        let UUID = ''
        while (itemLength < length && (itemLength + 3 <= frameLength)) {
          let itemData = []
          for (let i = 0; i < newArr[dataIndex + 3] - 1; i++) {
            itemData.push(dataArr1[i + dataIndex + 5])
          }
          // console.log('循环得到的数据', itemData);
          switch (newArr[dataIndex + 4]) {
            case 9:
            case 8:
              break;
            case 255:
              break;
            case 3: break;
            case 239:
              // console.log('---mac地址');
              let str = itemData[0]
              for (let i = 1; i < itemData.length; i++) {
                str += `:${itemData[i]}`
              }
              MAC = str.toUpperCase()

              break;
            case 7:
              console.log('uuid');
              let uuid = ''
              for (let i = 0; i < itemData.length; i++) {
                uuid += `${itemData[i]}`
              }
              UUID = uuid
              break
            default: return;
          }
          dataIndex = itemLength
          itemLength = itemLength + newArr[dataIndex + 3] + 1

          // console.log(itemLength, itemLength < length && (itemLength + 3 <= frameLength));
        }
        console.log('----mac', MAC, '-----uuid', UUID);
        if (UUID === 'd7895ab1acc74de3b9919e825c24c809') {
          // console.log('uuid相等', bluDevice, bluDevice.indexOf(MAC) === -1,);
          if (bluDevice.indexOf(MAC) === -1) {
            let dataArr = [].concat(bluDevice)
            dataArr.push(MAC)
            setBluDevice(dataArr)
          }

        }
      }




    }
    if (instruction.indexOf(newArr[2]) !== -1) {
      return commandArr[newArr[2]]
    } else {
      return () => {
        console.log('没有控制命令', commandArr);
      }
    }
  }






  let history = useHistory();
  //最小化，关闭的
  const MINCOLOSE = {
    minMouseEnter: () => {
      setMinbgc('rgba(70, 70, 70, 0.5)')
      setRMin(rMin_white)
    },
    minMouseLeave: () => {
      setMinbgc('')
      setRMin(rMin_red)
    },
    minClock: () => {
      setMinbgc('')
      setRMin(rMin_red)
      let ipcRenderer = window.electron.ipcRenderer
      ipcRenderer.send('window-min')

    },
    closeMouseEnter: () => {
      setClosebgc('rgba(232,17,35)')
      setRClose(rClose_white)
    },
    closeMouseLeave: () => {
      setClosebgc('')
      setRClose(rClose_red)
    },
    closeClock: () => {
      let ipcRenderer = window.electron.ipcRenderer
      ipcRenderer.send('window-close')
    },
  }





  //搜索框内容
  const searchPetBody = () => {


    if (loading) {
      //加载中
      return (
        <div className='searchPetLoading' style={{ padding: `${20}px 0` }}>
          <div className="loadIcon" style={{ paddingTop: MTop(15) }}>
            <LoadingOutlined style={{ fontSize: 30, color: '#e1206d', marginTop: mTop(-30), }} />
          </div>
          <p style={{ color: '#e1206d', marginTop: px(5) }}>
            loading...
          </p>
        </div>
      )
    } else {
      // console.log('-----展示', petList.length);
      if (petList.length > 0) {
        //找到了宠物，展示出来

        // let petList = electronStore.get('doctorExam')
        // console.log(petList);

        let option = petList.map((item, index) => {
          let { speciesId, url } = item

          let images = `url(${url}?download=0&width=150)`
          if (!url) {
            switch (speciesId) {
              case 1: images = `url(${cat})`

                break;
              case 2: images = `url(${dog})`
                break
              default: images = `url(${other})`
                break;
            }
          }
          return (
            <li
              key={`${index}`}
              style={{ margin: `${px(20)}px 0` }}
              onClick={() => {
                // console.log(item);
                setValue('')
                setVisible(false)
                setPetList([])

                onSearch(item)
              }}
            >
              <div className='item' style={{ paddingLeft: px(40) }}>
                <div
                  className='img'
                  style={{
                    width: px(50),
                    height: px(50),
                    marginRight: px(40),
                    borderRadius: px(60),
                    backgroundImage: images,
                    // backgroundColor: 'hotpink',

                  }}>
                  {/* <img src={images} style={{ width: px(40) }} /> */}
                </div>

                <div className='petInfo'>
                  <p style={{ color: '#141414', fontWeight: 600, fontSize: px(20) }}>{item.petName}</p>
                  <p style={{ color: '#797979', fontSize: px(18) }}>{`Patient ID: ${item.patientId}`}</p>
                  <p style={{ color: '#797979', fontSize: px(18) }}>{`Owner: ${item.owner}`}</p>
                </div>
              </div>
            </li >
          )

        })
        let liStyle = { backgroundColor: '#fff', }
        if (petList.length > 4) {
          liStyle = { height: px(500), overflowY: 'auto' }
        }


        return (
          <div className='searchPetList'>
            <ul style={liStyle}>
              {option}
            </ul>
          </div>
        )
      } else {
        //没有发现这个宠物
        return (
          <div className='searchPetLoading' style={{ padding: `${10}px 0` }}>

            <p style={{ width: '80%', fontSize: px(18) }}>
              Pet not found. Would you like
              to add a new patient?
            </p>

            <div
              className='searchPetBtn'
              style={{ fontSize: px(18) }}
              onClick={() => {
                history.push('/pet/doctorAddPet')
              }}
            >
              <p style={{ padding: `${px(8)}px 0` }}>+ New Patient</p>
            </div>
          </div>
        )
      }

    }

  }

  const inputChange = (text) => {

    function isNumber(val) {
      var regPos = /^\d+(\.\d+)?$/; //非负浮点数
      var regNeg = /^(-(([0-9]+\.[0-9]*[1-9][0-9]*)|([0-9]*[1-9][0-9]*\.[0-9]+)|([0-9]*[1-9][0-9]*)))$/; //负浮点数
      if (regPos.test(val) || regNeg.test(val)) {
        return true;
      } else {
        return false;
      }
    }
    //去除前后空格
    let search = text.target.value.replace(/(^\s*)|(\s*$)/g, "")
    setValue(search)
    if (search.length > 0) {
      setVisible(true)
      setLoading(true)

      //搜索分成两种，一种是通过手输入数据搜索，一种是通过RFID扫描过后搜索

      if (search.length === 15 && isNumber(search)) {
        //这是RFID扫描后的搜索
        fetchRequest4(`/pet/getPetInfoByRFID/${search}/${storage.lastOrganization}`, 'GET')
          .then(res => {
            console.log('----RFID搜索结果', res);

            if (res.flag === true && res.data) {
              let { createTime, patientId, petName, firstName, lastName, url, speciesId, breedName, gender, birthday, petId, rfid, weight } = res.data
              patientId = patientId || 'unknown'
              petName = petName || 'unknown'
              breedName = breedName || 'unknown'
              weight = weight || 'unknown'
              let owner = ''
              if (!firstName) {
                firstName = ''
              }
              if (!lastName) {
                lastName = ''
              }
              if (lastName === '' && firstName === '') {
                owner = 'unknown'
              } else {
                owner = `${lastName} ${firstName}`
              }
              createTime = moment(createTime).format('X')
              let petGender = ''
              switch (`${gender}`) {
                case '1': petGender = 'F'

                  break;
                case '0': petGender = "M"
                  break;
                default: petGender = 'unknown'
                  break;
              }
              let petAge = 'unknown'
              if (birthday) {
                petAge = moment(new Date()).diff(moment(birthday), 'years')
                // console.log('petAge', petAge);
              }
              let json = {
                insertedAt: createTime,
                patientId,
                petName,
                owner,
                breed: breedName,
                gender: petGender,
                age: petAge,
                petId,
                id: 0,
                weight,
                rfid,
                url,
                speciesId
              }
              let searchData = []
              searchData.push(json)
              setLoading(false)
              setPetList(searchData)



            } else if (res.flag === true && res.msg === '该组织下无此宠物信息') {
              console.log('找到了但是不是在这个组织下');
              setLoading(false)
              setModalVis(true)
              setIsNotFound(false)
              setValue('')
              setVisible(false)


              // this.setState({
              //   loading: false,
              //   modalVis: true,
              //   isNotFound: false,
              //   heardSearchText: ''
              // })
            } else {
              console.log('没有找到');
              setLoading(false)
              setModalVis(true)
              setIsNotFound(true)
              setValue('')
              setVisible(false)


              // this.setState({
              //   loading: false,
              //   modalVis: true,
              //   isNotFound: true,
              //   heardSearchText: ''
              // })
            }
          })
          .catch(err => {

            console.log('抛出异常:', err);
            setLoading(false)
          })
        return
      }

      /**
       * 使用indexof方法实现模糊查询
       *     语法：stringObject.indexOf(searchvalue, fromindex)
       *   参数：searchvalue 必需。规定需检索的字符串值。 fromindex 可选的整数参数。规定在字符串中开始检索的位置。它的合法取值是 0 到 stringObject.length - 1。如省略该参数，则将从字符串的首字符开始检索。
       *    说明：该方法将从头到尾地检索字符串 stringObject，看它是否含有子串 searchvalue。开始检索的位置在字符串的 fromindex 处或字符串的开头（没有指定 fromindex 时）。如果找到一个 searchvalue，则返回 searchvalue 的第一次出现的位置。stringObject 中的字符位置是从 0 开始的。如果没有找到，将返回 -1。
       *  
       * list         原数组
       * keyWord      查询关键词
       * searchData   查询的结果
       * 
       * toLowerCase（）方法：将字符串统一转成小写
       * toUpperCase（）方法：将字符串统一转成大写
       * 
       */
      // let list = allPetList 
      let list = electronStore.get('doctorExam') || []

      let searchData = []
      let keyWord = search
      for (let i = 0; i < list.length; i++) {
        let petName = list[i].petName.toLowerCase() || ''
        let patientId = list[i].patientId.toLowerCase() || ''
        let rfid = list[i].rfid || ''
        if (`${petName}`.indexOf(keyWord.toLowerCase()) !== -1
          || `${patientId}`.indexOf(keyWord.toLowerCase()) !== -1
          || `${rfid}`.indexOf(keyWord) !== -1
        ) {
          searchData.push(list[i])
        }
      }
      // console.log('找到的宠物', searchData);
      console.log('---搜索词：', search, '---搜索数组：', list, '----搜索结果：', searchData);
      setLoading(false)
      setPetList(searchData)

    } else {
      setVisible(false)
    }



  }

  //左侧菜单栏
  const menuList = () => {
    let menulistArr = [
      { name: 'Home', index: '1' },
      { name: 'All Patients', index: '2' },
      { name: 'Scheduled Patients', index: '3' },
      { name: 'My Account', index: '4' },
      { name: 'Settings', index: '5' },
      { name: 'Enter Clinical Study Mode', index: '6' },
      { name: `Billing & Subscriptions`, index: '7' },
      { name: 'About Mella', index: '8' },
      { name: 'Log Out', index: '9' },

    ]
    let menuOption = menulistArr.map((item, index) => {

      let pColor = menuMouseOverIndex === item.index ? '#e1206d' : '#1a1a1a'
      return (
        <li
          key={item.index}
          style={{ padding: `${px(15)}px ${px(20)}px` }}
          onClick={() => {
            menulistClick(item)

          }}
          onMouseOver={(e) => {
            setMenuMouseOverIndex(item.index)
            e.stopPropagation();
            e.nativeEvent.stopImmediatePropagation();
            menuMouseOver()
          }}
          onMouseOut={(e) => {
            setMenuMouseOverIndex('')
            e.stopPropagation();
            e.nativeEvent.stopImmediatePropagation();
            menuMouseOut()
          }}
        >
          <div className='item'>
            <p style={{ color: pColor }}>{item.name}</p>
          </div>
        </li >
      )

    })

    return (
      <ul>
        {menuOption}
      </ul>
    )


  }
  const menulistClick = e => {
    mouseoutTimer && clearTimeout(mouseoutTimer)
    setMenuVisible(false)
    setMenuMouseOverIndex('')
    console.log('click ', e);

    switch (e.index) {
      case "1":
        history.push('/MainBody')
        setMenuNum(e.index)
        break;
      case "2":
        history.push('/MainBody')
        console.log('全部的宠物');
        setMenuNum(e.index)
        break;
      case "3":
        history.push('/MainBody')
        console.log('预约宠物');
        setMenuNum(e.index)
        break;
      case "4":
        console.log('我的账号');
        break;
      case "5":
        //跳转到设置
        // menu5Click()
        history.push('/menuOptions/settings');
        setMenuNum(e.index)
        break;
      case "6":
        history.push('/MainBody')
        console.log('临床测试');
        setMenuNum(e.index)
        break;
      case "7":
        console.log('billing');
        break;

      case "8":
        setModalVisible(true)
        console.log('关于');
        break;
      case "9":
        console.log('退出登录');
        storage.userId = ''
        storage.roleId = ''
        storage.userWorkplace = ''
        storage.lastOrganization = ''
        storage.lastWorkplaceId = ''
        storage.connectionKey = ''
        storage.isClinical = 'false'
        setMenuNum('1')
        history.push('/')
        break;


      default:
        break;
    }
  }
  const menuMouseOut = () => {
    mouseoutTimer && clearTimeout(mouseoutTimer)
    mouseoutTimer = setTimeout(() => {

      setMenuVisible(false)
      mouseoutTimer && clearTimeout(mouseoutTimer)
    }, 1000);


  }
  const menuMouseOver = () => {
    mouseoutTimer && clearTimeout(mouseoutTimer)
    setMenuVisible(true)
  }
  const updatePage = () => {
    switch (updateStatus) {
      case 'init':
        return (
          <div className='updateBtn' style={{ height: px(40), }}
            onClick={() => {
              setDownLoadingNum(0)
              setUpdateStatus('check')

              ipcRenderer.send('clickUpdateBtn')
            }}
          >
            Check for Updates
          </div>
        )
      case 'check':
        return (
          <div className='updateLoading flex' >
            <div className="loadIcon1" >
              <LoadingOutlined style={{ fontSize: 30, color: '#e1206d', marginRight: px(20) }} />
            </div>
            <p style={{ color: '#e1206d', }}>Checking for updates</p>
          </div>
        )
      case 'lastVersion':
        return (
          <div style={{ fontSize: px(22), }}>
            already the latest version
          </div>
        )

      case 'newVersion':
        return (
          <div style={{ fontSize: px(22), }}>
            {`Found new version V${lastVersion}`}

          </div>
        )
      case 'downLoading':
        return (
          <div style={{ fontSize: px(22), }}>
            {`Download progress: ${downLoadNum}%`}

          </div>
        )

      default:
        break;
    }




  }
  //关于界面
  const modal = () => {
    return (
      <div className='settingModal' style={{ height: `${document.documentElement.clientHeight}px` }} >
        <div className='writeBox' style={{ borderRadius: px(25) }} >
          <div className='modalHeadr'>
            <div className='close'>
              <div className='imgBox'
                style={{ padding: `0 ${px(30)}px` }}
                onClick={() => {
                  setModalVisible(false)
                  setUpdateStatus('init')
                }}
              >
                <img src={close} style={{ width: px(23), }} />
              </div>

            </div>
            <div className='heaerCenter'>
              <div className='heaerCenterL'>
                <img src={mellaLogo} style={{ width: '80%' }} />

              </div>
              <div className='heaerCenterR'>
                <h1 style={{ fontSize: px(45), marginBottom: px(10) }}>About the System</h1>
                <div className='version'>
                  <div className='versionL' style={{ fontSize: px(22), width: px(180) }}>Version</div>
                  <div className='versionR' style={{ fontSize: px(24) }}>{version}</div>
                </div>
                <div className='version'>
                  <div className='versionL' style={{ fontSize: px(22), width: px(180) }}>Last Checked</div>
                  <div className='versionR' style={{ fontSize: px(24) }}>{updateTime}</div>
                </div>

                <div className='check' style={{ marginTop: px(20) }}>
                  {updatePage()}






                </div>

              </div>
            </div>

          </div>
          <div className='modalfoot'>
            <div className='about' style={{ marginTop: px(40), fontSize: px(18) }}>
              Nanjing Jiubian Technology Co., Ltd. was founded in 2019, located in Nanjing Yuhuatai Software Valley Branch City, the company brings together medical sensors, mobile Internet and other industry's top professionals, business areas covering artificial intelligence, smart medical, pet health, sleep monitoring, etc., is a design, research and development, production, sales, service in one of the high-tech companies. The nine-sided science and technology to "the number of heavens and earths, starting from one, finally nine" as the cultural concept, adhering to the essence of Chinese artisans, with an international vision, always standing in the forefront of bio-intelligent medical monitoring technology.
            </div>

            <div className='aLable'>
              <a href="#"
                style={{ fontSize: px(18), marginRight: px(50) }}
                onClick={(e) => {
                  e.preventDefault();
                }}
              >Terms and Agreements</a>
              <a
                href="#"
                style={{ fontSize: px(18), }}
                onClick={(e) => {
                  e.preventDefault();
                }}
              >Privacy Policy</a>
            </div>

            <div className='foot' style={{ marginBottom: px(40) }}>© 2021 Mella Pet Care All RIghts Reserved</div>

          </div>

        </div>

      </div>
    )
  }

  //设备列表界面
  const devices = () => {

    let userId = storage.userId
    // electronStore.delete(`${userId}-deviceList`)
    let deviceList = electronStore.get(`${userId}-deviceList`)
    console.log('---', deviceList);
    if (!deviceList) {
      let str = `${getRamNumber()}`
      for (let i = 0; i < 5; i++) {
        str += `:${getRamNumber()}`
      }
      console.log('随机生成的mac地址:', str);
      deviceList = [{ name: 'MellaPro', deviceType: 'mellaPro', macId: str }]
      electronStore.set(`${userId}-deviceList`, deviceList)
    }


    function getRamNumber() {
      var result = '';
      for (var i = 0; i < 2; i++) {
        result += Math.floor(Math.random() * 16).toString(16);//获取0-15并通过toString转16进制
      }
      //默认字母小写，手动转大写
      return result.toLowerCase();//另toLowerCase()转小写
    }


    // deviceList = [
    //   // { name: 'Add Device', deviceType: 'add', macId: '0' },
    //   { name: 'malla001', deviceType: 'mellaHome', macId: '11:22:33:44:55:66' },
    //   { name: 'malla002', deviceType: 'mellaPro', macId: '11:22:33:44:51:66' },
    //   { name: 'malla003', deviceType: 'mellaHome', macId: '11:22:33:44:35:66' },
    //   { name: 'biggie00222222222222221', deviceType: 'biggie', macId: '11:24:33:44:55:66' },
    //   { name: 'malla001', deviceType: 'biggie', macId: '11:22:33:44:25:66' },
    //   { name: 'Charlie001', deviceType: 'rfid', macId: '11:22:33:44:56:66' },
    // ]

    let options = deviceList.map((item, index) => {
      return <li
        className='flex'
        key={`${index}`}
        style={{ marginBottom: px(15), marginTop: px(5), }}
        onClick={() => {
          console.log(item.macId);
          setSelectDeviceMac(item.macId)
        }}
      >
        <div className='liLeft' style={{ fontSize: px(16) }}>{item.name}</div>
        <div className='liCenter' style={{ fontSize: px(16) }}>{item.macId}</div>
        <div className='liRight'>
          <div className='circle flex' style={{ width: px(18), height: px(18) }}>
            {selectDeviceMac === item.macId && <div className='redCircle' />}
          </div>
        </div>
      </li>
    })

    return (
      <div className='settingModal' style={{ height: `${document.documentElement.clientHeight}px` }} >
        <div className='writeBox devices' style={{ borderRadius: px(25), width: px(400) }} >
          <div className='deviceHeadr'>
            <div className='close'>
              <div className='imgBox'
                style={{ padding: `0 ${px(30)}px` }}
                onClick={() => setDeviceModel(false)}
              >
                <img src={close} style={{ width: px(23), }} />
              </div>

            </div>
            <div className='logo flex'>
              <img src={mellaLogo} style={{ width: px(60) }} />
              <div style={{ fontSize: px(22), marginTop: px(30) }}>Devices</div>
              <div className='bodyText' style={{ fontSize: px(18), marginTop: px(40) }}>Select the device you would<br />
                like to use or add a new device.</div>
            </div>

          </div>

          <div className='deviceCenter'>
            <ul>
              {options}
            </ul>
          </div>
          <div className='deviceFooter flex' style={{ borderBottomLeftRadius: px(25), borderBottomRightRadius: px(25) }}>
            <div className='btn' style={{ height: px(40) }}
              onMouseDown={() => {
                let button = document.querySelectorAll('#heard .deviceFooter .btn')
                button[0].style.opacity = "0.5"
              }}
              onMouseUp={() => {
                let button = document.querySelectorAll('#heard .deviceFooter .btn')
                button[0].style.opacity = "1"
              }}
              onClick={() => {
                setDeviceModel(false)
                history.push('/menuOptions/AddDevice');

              }}

            >
              <p className='btnText' style={{ fontSize: px(18) }}>New Device</p>
            </div>
            <div className='btn' style={{ height: px(40) }}

              onMouseDown={() => {
                let button = document.querySelectorAll('#heard .deviceFooter .btn')
                button[1].style.opacity = "0.5"
              }}
              onMouseUp={() => {
                let button = document.querySelectorAll('#heard .deviceFooter .btn')
                button[1].style.opacity = "1"
              }}
              onClick={() => {
                electronStore.set(`${storage.userId}-selectDevice`, selectDeviceMac)
                setDeviceModel(false)
              }}
            >
              <p className='btnText' style={{ fontSize: px(18) }}>Connect</p>
            </div>
          </div>


        </div>

      </div>
    )
  }

  //点击蓝牙搜索图标
  const blueClick = () => {
    console.log('点击了蓝牙图标');
    setIsShowBlePetList(false)
    setSearchMac(true)


  }
  //点击取消链接
  const cencleClick = (e) => {
    console.log('mac列表为空,点击取消');
    setBluDevice([])
    setSearchMac(false)
    setIsShowBlePetList(false)
    setIsMatchPet(false)
    setMacMatchPetList([])
    if (e) {
      e.preventDefault()
    }
    matchingTimer && clearTimeout(matchingTimer)


  }
  //搜索狗牌的蓝牙
  const blusearchBody = () => {
    console.log('搜索狗牌的蓝牙', searchMac, bluDevice);
    if (isShowBlePetList) {
      if (isMatchPet) {
        return (
          <div className='searchPetLoading' style={{ padding: `${20}px 0`, width: '100%' }}>
            <div className="loadIcon" style={{ paddingTop: MTop(15) }}>
              <LoadingOutlined style={{ fontSize: 30, color: '#e1206d', marginTop: mTop(-30), }} />
            </div>
            <p style={{ color: '#e1206d', marginTop: px(5), width: '80%' }}>matching...</p>

            <a href="#" style={{ color: '#e1206d', marginTop: px(30) }}
              onClick={cencleClick}
            >Cencle</a>
          </div>
        )
      } else {
        if (macMatchPetList.length > 0) {

          let option = macMatchPetList.map((item, index) => {
            let { speciesId, url } = item

            let images = `url(${url}?download=0&width=150)`
            if (!url) {
              switch (speciesId) {
                case 1: images = `url(${cat})`
                  break;
                case 2: images = `url(${dog})`
                  break
                default: images = `url(${other})`
                  break;
              }
            }
            return (
              <li
                key={`${index}`}
                style={{ margin: `${px(20)}px 0` }}
                onClick={() => {
                  cencleClick()
                  onSearch(item)
                }}
              >
                <div className='item' style={{ paddingLeft: px(40) }}>
                  <div
                    className='img'
                    style={{
                      width: px(50),
                      height: px(50),
                      marginRight: px(40),
                      borderRadius: px(60),
                      backgroundImage: images,
                    }}>
                    {/* <img src={images} style={{ width: px(40) }} /> */}
                  </div>

                  <div className='petInfo'>
                    <p style={{ color: '#141414', fontWeight: 600, fontSize: px(20), textAlign: 'start' }}>{item.petName}</p>
                    <p style={{ color: '#797979', fontSize: px(18) }}>{`Patient ID: ${item.patientId}`}</p>
                    <p style={{ color: '#797979', fontSize: px(18) }}>{`Owner: ${item.owner}`}</p>
                  </div>
                </div>
              </li >
            )

          })
          let liStyle = { backgroundColor: '#fff', }
          if (petList.length > 4) {
            liStyle = { height: px(500), overflowY: 'auto' }
          }


          return (
            <div className='searchPetList flex' >
              <ul style={liStyle}>
                {option}
              </ul>
              <a href="#" style={{ color: '#e1206d', marginTop: px(10), marginBottom: px(21) }}
                onClick={cencleClick}
              >Cencle</a>
            </div>
          )
        }
      }
    } else {
      if (noUSB) {
        return (
          <div className='searchPetLoading' style={{ padding: `${10}px 0` }}>

            <p style={{ width: '80%', fontSize: px(18) }}>
              Please insert address and scan
            </p>

            <a href="#" style={{ color: '#e1206d' }}
              onClick={cencleClick}
            >Cencle</a>
          </div>
        )
      } else {
        if (bluDevice.length > 0) {
          let option = bluDevice.map((item, index) => {
            return (
              <li
                key={`${index}`}
                style={{ margin: `${px(20)}px 0` }}
                onClick={() => {
                  console.log('mac列表为空,点击列表内容');
                  setBluDevice([])
                  // setSearchMac(false)
                  setIsShowBlePetList(true)
                  setIsMatchPet(true)
                  matchingTimer && clearTimeout(matchingTimer)
                  matchingTimer = setTimeout(() => {
                    let haveFlog = false, index = -1
                    for (let i = 0; i < testPetList.length; i++) {
                      if (testPetList[i].macId === item) {
                        haveFlog = true
                        index = i
                        break;
                      }
                    }
                    if (haveFlog) {
                      if (storage.lastOrganization === '1') {
                        matchPet(testPetList[index].petId)
                      } else {
                        setModalVis(true)
                        setIsNotFound(false)
                        cencleClick()

                      }
                    } else {
                      setModalVis(true)
                      setIsNotFound(true)
                      cencleClick()
                    }


                    setIsMatchPet(false)
                    matchingTimer && clearTimeout(matchingTimer)
                  }, 2000);


                }}
              >
                <div className='item' style={{ paddingLeft: px(40) }}>
                  <div className='petInfo'>
                    <p style={{ color: '#141414', fontWeight: 600, fontSize: px(20) }}>mac:{item}</p>
                  </div>
                </div>
              </li >
            )
          })
          let liStyle = { backgroundColor: '#fff', }
          if (bluDevice.length > 4) {
            liStyle = { height: px(500), overflowY: 'auto' }
          }
          return (
            <div className='searchPetList' style={{ flexDirection: 'column' }}>
              <ul style={liStyle}>
                {option}
              </ul>
              <a href="#" style={{ color: '#e1206d', marginTop: px(10), marginBottom: px(21) }}
                onClick={cencleClick}
              >Cencle</a>
            </div>
          )
        } else {
          return (
            <div className='searchPetLoading' style={{ padding: `${20}px 0`, width: '100%' }}>
              <div className="loadIcon" style={{ paddingTop: MTop(15) }}>
                <LoadingOutlined style={{ fontSize: 30, color: '#e1206d', marginTop: mTop(-30), }} />
              </div>
              <p style={{ color: '#e1206d', marginTop: px(5), width: '80%' }}>
                scanning...
              </p>

              <a href="#" style={{ color: '#e1206d', marginTop: px(30) }}
                onClick={cencleClick}
              >Cencle</a>
            </div>
          )
        }
      }
    }

  }
  const matchPet = (searchValue) => {
    console.log('搜索词:', searchValue);
    let list = electronStore.get('doctorExam')

    let searchData = []
    let keyWord = searchValue
    for (let i = 0; i < list.length; i++) {

      let petName = `${list[i].petId}`
      if (keyWord === petName) {
        searchData.push(list[i])
      }
    }


    setIsMatchPet(false)

    setMacMatchPetList(searchData)
  }



  return (
    <div id="heard"
      style={{ height: px(50) }}
    >
      <div className='l'>
        <div className='menuF' style={{ marginLeft: px(40), marginRight: px(40) }}>
          <div className="menu"
            onMouseOver={menuMouseOver}
            onMouseOut={menuMouseOut}>
            <img src={menu} style={{ width: px(20), }} />
            {
              menuVisible
                // true
                ? <div
                  className='manuBody'
                  style={{ top: px(20), left: px(-40) }}
                >
                  <div className='triangle'
                    style={{
                      borderLeft: `${px(10)}px solid transparent`,
                      borderRight: `${px(10)}px solid transparent`,
                      borderBottom: `${px(13)}px solid #fff`,
                      left: px(40)
                    }} />

                  <div className='manuBodyList' style={{ marginTop: px(13) }}>
                    {menuList()}
                  </div>
                </div>
                : null
            }






          </div>
        </div>



        <div className="search" style={{ width: px(300) }}>

          <input
            placeholder="Search Pet    &#xe63f;"
            style={{ fontSize: px(16), paddingLeft: px(20) }}
            value={value}
            onChange={(text) => {
              inputChange(text)
            }}

            onKeyUp={(e) => {
              // console.log(e);
              if (e.keyCode === 13) {
                console.log('回车,去搜索');
              }
              if (e.keyCode === 27) {
                console.log('清空');
                setValue('')
                setVisible(false)
              }
            }}

          />
          {
            blueSearch ?
              <div className="searchIconFa bluSearch"
              // style={{ cursor: 'pointer', backgroundColor: 'pink' }}
              // onClick={blueClick}
              >
                <div onClick={blueClick} >
                  {/* <img src={blueSearchPng} style={{ width: '50%' }} /> */}
                  <span className=" iconfont icon-sousuo searchIcon"
                    style={{ fontSize: px(25) }}
                  />
                </div>

                {
                  searchMac ?
                    // true ?
                    <div className='searchPet flex' style={{ width: px(400), }}>
                      <div className='triangle'
                        style={{
                          borderLeft: `${px(20)}px solid transparent`,
                          borderRight: `${px(20)}px solid transparent`,
                          borderBottom: `${px(25)}px solid #fff`,
                          // marginLeft: px(30),
                          zIndex: 999,

                        }} />

                      <div className='searchPetBody' style={{ width: '100%' }} >
                        {blusearchBody()}
                      </div>
                    </div>
                    : null
                }

              </div>
              : <div className="searchIconFa">
                <span className=" iconfont icon-sousuo searchIcon"
                  style={{ fontSize: px(25) }}
                />
              </div>
          }






          {
            visible ?
              // true ?
              <div className='searchPet' style={{ top: px(35), width: px(400), }}>
                <div className='triangle'
                  style={{
                    borderLeft: `${px(20)}px solid transparent`,
                    borderRight: `${px(20)}px solid transparent`,
                    borderBottom: `${px(25)}px solid #fff`,
                    marginLeft: px(30),
                    zIndex: 999,

                  }} />

                <div className='searchPetBody' >
                  {searchPetBody()}
                </div>
              </div>
              : null
          }





        </div>
      </div >


      <div className="r"
      >


        <div className='heardCenter'>
          <div className="message"
            onClick={() => history.push('/menuOptions/unassigned')}
          >
            <img src={message} alt="" style={{ height: px(25), width: px(25) }} />
          </div>
          <div className="help"
            style={{ margin: `0 ${px(25)}px` }}
            onClick={() => history.push('/menuOptions/help')}
          >
            <img src={help} alt="" style={{ height: px(25) }} />
          </div>

        </div>
        <div className="min_close" style={{ paddingRight: px(15) }}>
          <div
            className='min_icon'
            onClick={MINCOLOSE.minClock}
            style={{ backgroundColor: minbgc, height: px(50), width: px(50) }}
            onMouseEnter={MINCOLOSE.minMouseEnter}
            onMouseLeave={MINCOLOSE.minMouseLeave}
          >
            <img src={rMin} alt="" style={{ width: px(20) }} />
          </div>
          <div
            className='min_icon'
            onClick={MINCOLOSE.closeClock}
            style={{ backgroundColor: closebgc, height: px(50), width: px(50) }}
            onMouseEnter={MINCOLOSE.closeMouseEnter}
            onMouseLeave={MINCOLOSE.closeMouseLeave}
          >
            <img src={rClose} alt="" style={{ width: px(20) }} />
          </div>
        </div>
      </div>

      {modalvisible && modal()}
      {deviceModel && devices()}

      <MyModal
        // visible={true}
        visible={modalVis}
        element={
          <div className='tip' style={{ width: px(420), height: px(480), borderRadius: px(20) }}>
            <div className='close'
              style={{ height: px(60) }}
              onClick={() => setModalVis(false)}
            >
              <div className='flex' style={{ height: px(60), width: px(60), }}>
                <img src={close} alt="" style={{ width: px(20) }} />
              </div>



            </div>
            <div className="text">
              <h1 style={{ fontSize: px(36), marginTop: px(30) }}> {isNotFound ? 'Pet not found!' : 'Pet found!'}</h1>

            </div>
            <div className='flex' style={{ margin: `${px(20)}px 0` }}>
              {isNotFound ?
                <img src={redclose} width="50px" /> :
                <img src={jinggao} width="50px" />
              }
            </div>
            <div className='textbody' style={{ marginTop: px(30), color: '#000' }}>
              {isNotFound ? <p style={{ fontSize: px(22) }}> This pet is not on your database</p> :
                <p style={{ fontSize: px(22) }}>Pet Identified but does not <br /> belong to your organization.</p>}
            </div>



            <div className='flex' style={{ marginTop: px(30), width: '100%', }}>

              <div
                className='btn flex'
                style={{ height: px(40) }}
                onClick={() => {
                  setModalVis(false)
                  cencleClick()
                }}
              >
                <p>OK</p>
              </div>
            </div>
          </div>
        }
      />

    </div >
  )
}

Heard.propTypes = {
  onReturn: PropTypes.func,
  onSearch: PropTypes.func,
  menu1Click: PropTypes.func,
  menu2Click: PropTypes.func,
  menu3Click: PropTypes.func,
  menu4Click: PropTypes.func,
  menu5Click: PropTypes.func,
  menu6Click: PropTypes.func,
  menu7Click: PropTypes.func,
  menu8Click: PropTypes.func,
  menu9Click: PropTypes.func,
  blueSearch: PropTypes.bool

}
Heard.defaultProps = {
  onSearch: () => { },
  onReturn: () => { },
  menu1Click: () => { },
  menu2Click: () => { },
  menu3Click: () => { },
  menu4Click: () => { },
  menu5Click: () => { },
  menu6Click: () => { },
  menu7Click: () => { },
  menu8Click: () => { },
  menu9Click: () => { },
  blueSearch: false,
}


export default connect(
  state => ({

  }),
  { setMenuNum }
)(Heard)