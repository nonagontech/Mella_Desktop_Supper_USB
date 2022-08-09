import React, { Component } from 'react'
import { Menu, Table, Popconfirm, Tooltip, message, Select, Progress, Input, Modal } from 'antd';
import Draggable from "react-draggable";
import moment from 'moment'
//import 'antd/dist/antd.css';
import { createFromIconfontCN, LoadingOutlined, SyncOutlined } from '@ant-design/icons';



import { fetchRequest } from './../../utils/FetchUtil1'
import { fetchRequest1 } from './../../utils/FetchUtil'
import { fetchRequest2 } from './../../utils/FetchUtil2'
import { FetchEszVet } from './../../utils/FetchEszVet'

import ye from './../../assets/images/ye1.png'
import er from './../../assets/images/er3.png'
import gang from './../../assets/images/gang3.png'
import edit from './../../assets/images/edit.png'
import del from './../../assets/images/del.png'
import scale from './../../assets/images/scale.png'
import placement_gang from './../../assets/images/placement_gang.png'
import placement_er from './../../assets/images/placement_er.png'
import palcement_ye from './../../assets/images/palcement_ye.png'
import careacte from './../../assets/images/dogMessage.png'
import catcareacte from './../../assets/images/catMessage.png'
import dog from './../../assets/img/redDog.png'
import cat from './../../assets/img/redcat.png'
import other from './../../assets/images/other.png'

import dog1 from './../../assets/images/pinkdog.png'
import cat1 from './../../assets/images/pinkcat.png'
import redDog1 from './../../assets/images/reddog.png'
import redCat1 from './../../assets/images/redcat.png'
import redother from './../../assets/images/redother.png'



import electronStore from './../../utils/electronStore'


import './normalMeasurement.less'
import { fetchToken } from '../../utils/Fetch_token';
import { mTop, px, pX, win } from '../../utils/px';
import { fetchRequest4 } from '../../utils/FetchUtil4';
import temporaryStorage from '../../utils/temporaryStorage';
import Biggie from './../../pages/biggiePage/Biggie.jsx'
import MyModal from '../../utils/myModal/MyModal';
import Heard from '../../utils/heard/Heard';
import { fetchRhapsody } from '../../utils/FetchUtil5';
const { SubMenu } = Menu;
const { Option } = Select;
const MyIcon = createFromIconfontCN({
  scriptUrl: '//at.alicdn.com/t/font_2326495_7b2bscbhvvt.js'
})
let saveHistoryTime = null, getSerialTime = null
let ipcRenderer = window.electron.ipcRenderer

let detectTimer = null, countdownTimer = null, lastConnectionTime = null;

let storage = window.localStorage;
//用于预测的东西
let clinicalYuce = [], clinicalIndex = 0, endflog = false
let temp15 = ''
let is97Time = null, //为了防抖，因为有时候断开连接和连接成功总是连续的跳出来，展示就会一直闪烁，因此引入时间差大于800ms才展示
  initTime = null
let firstEar = true
let isMeasurement = false //正在测量为true，反之为false
let num07 = 0       //接收到07命令行的次数

let isClick = true

let sameBiggieNum = 0, keyboardBiggieFlog = false

let nextFlog = false //用来判断是否按下了尺子的确认键
let avoidRepetition = false //避免重复，防止尺子数据过来后持续刷新

let confirmBtnFlog = ''
//因为biggie样机测量完成控制字从02(测量中)变成03(测量完成),但是会发多组03,因此做一个限制,当控制字为02时biggieSave=false,第一次为03时变成true
let biggieSave = false

export default class NorMalMeasurement extends Component {
  state = {
    dogImg: redDog1,
    catImg: cat1,
    otherImg: other,
    selectWZ: 'dog',

    closebgc: '',
    minbgc: '',
    closeColor: '',
    value: '',
    api: '',
    id: '',
    dataArr: [],
    seleceID: '',//医生id
    data: { ci: [''], wen: [] },

    temColor: '',
    Temp: '',
    isMeasure: false,
    mearsurePart: 1,
    historyData: [],
    patientId: '',
    spin: false,        //patientId后面的刷新按钮是否旋转
    petName: '',
    addpatient_petName: '',
    addpatient_description: '',
    addpatient_species: 1,
    roomTemperature: '',
    referenceRectalTemperature: '',
    bodyConditionScore: '',
    furLength: '',
    bodyType: '',
    heartRate: '',
    bloodPressure: '',
    respiratoryRate: '',
    visible: false,       //nodel框是否显示
    disabled: true,       //model是否可拖拽
    bounds: { left: 0, top: 0, bottom: 0, right: 0 },
    units: '℉',
    measuerStatus: 'disconnected',
    isconnected: false,
    countdown: 15,
    petVitalTypeId: '01',  //测量部位
    probeID: '',         //探头id
    org: 1,
    err07Visible: false,


    //左侧的宠物信息
    petId: '',
    owner: '',
    breedName: '',
    isMix: false,
    age: null,
    weight: '',
    url: '',
    speciesId: null,

    //圆环的一些信息
    temp_statu: 'Ready',
    progress: 0,
    endMeasure: false,
    initFlog: false,
    isEarMeasure: false,


    //底部的信息
    isNotes: true,
    notes: '',
    petSpeciesBreedId: 0,
    consult_id: '',
    healthStatus: '',


    editId: '',
    memo: '',
    macAddr: '',
    loading: false,

    noUSB: false,  //是否有usb底座，为true代表没有
    devicesType: 'biggie',
    isHaveBigieDate: false, //为false则展示把宠物放到秤上的文本，为true则展示体重值

    biggieDate: '', //体脂称体重值（磅）
    sendWeight: '', //体脂称体重值（kg）
    impedance: '',   //阻抗
    isWeightSave: false,  //保存体重数据跳出的上传中弹框


    //宠物特征信息
    l2rarmDistance: '',           //左右手间距，这里用他临时替换成头部周长
    neckCircumference: '',        //脖子周长
    upperTorsoCircumference: '',  //上躯干周长
    lowerTorsoCircumference: '',  //下躯干周长
    h2tLength: '',                //头尾长度
    torsoLength: "",             //躯干长度

    rulerUnit: 'cm',               //尺子的单位
    itemIndex: 1,                //代表现在是第几个宠物特征
    updatePetAttributes: false,    //上传宠物属性的弹框

    isWalkIn: false,               //是否是从walkIn进来的
  }
  componentWillMount() {
    try {
      console.log('--------------', this.props.location.isconnected);
      if (this.props.location.isconnected === false || this.props.location.isconnected === true) {
        if (this.props.location.isconnected === false) {

        } else {
          this.setState({
            measuerStatus: 'connented',
            isconnected: true,
            isEarMeasure: false

          })
          is97Time = new Date()
        }
      }
    } catch (error) {

    }
  }

  componentDidMount() {
    ipcRenderer.send('big', win())
    storage.isClinical = 'false'
    if (storage.identity === '2') {
      let ezyVetSelectHealthstatus = JSON.parse(storage.ezyVetSelectHealthstatus)
      console.log(ezyVetSelectHealthstatus);
      let { age, animal_id, breed, consult_id, gender, key, owner, petName, weight, url, speciesId } = ezyVetSelectHealthstatus
      let petAge = null
      if (`${age}` === '' || `${age}` === 'null') {
        petAge = 0
      } else {
        petAge = age
      }
      this.setState({
        petName,
        owner,
        breedName: breed,
        weight,
        age: petAge,
        consult_id,
        healthStatus: key,
        patientId: animal_id,
        org: 4,
        url,
        speciesId
      }, () => {
        this._getPetInfo('ezyVet')
      })
    } else if (storage.identity === '1') {
      this.setState({
        petName: storage.selectPetName,
        owner: storage.selectOwner,
        breedName: storage.selectBreed,
        weight: storage.selectWeight,
        age: storage.selectAge,
        patientId: storage.selectPatientId,
        org: 1
      }, () => {
        this._getPetInfo('vetspire')
      })
    } else {
      let hardSet = electronStore.get('hardwareConfiguration')
      console.log('测量单位', hardSet);
      let rulerUnit = 'in'
      if (!hardSet) {
        let settings = {
          isHua: true,
          is15: true,
          self_tarting: false,
          isBacklight: true,
          isBeep: true,
          backlightTimer: { length: 140, number: '45' },
          autoOff: { length: 0, number: '30' },
        }
        electronStore.set('hardwareConfiguration', settings)
        this.setState({
          units: '℉',
          rulerUnit: 'in',
          countdown: 15
        })
      } else {
        let units = hardSet.isHua ? '℉' : '℃'
        rulerUnit = hardSet.isHua ? 'in' : 'cm'
        let countdown = hardSet.is15 ? 15 : 30
        console.log('测量单位', units);
        this.setState({
          units,
          countdown,
          rulerUnit
        })
      }




      let data = JSON.parse(storage.doctorExam)
      console.log('从列表里面传过来的数据', data);
      if (!data) {
        console.log('从walk-in来的');
        this.setState({
          isWalkIn: true
        })

      } else {
        let { l2rarmDistance, neckCircumference, upperTorsoCircumference, lowerTorsoCircumference,
          h2tLength, torsoLength, weight, url, speciesId } = data

        // l2rarmDistance = l2rarmDistance ? `${l2rarmDistance}` : ''
        // neckCircumference = neckCircumference ? `${neckCircumference}` : ''
        // upperTorsoCircumference = upperTorsoCircumference ? `${upperTorsoCircumference}` : ''
        // lowerTorsoCircumference = lowerTorsoCircumference ? `${lowerTorsoCircumference}` : ''
        // h2tLength = h2tLength ? `${h2tLength}` : ''
        // torsoLength = torsoLength ? `${torsoLength}` : ''
        console.log('+++++++++++', l2rarmDistance);

        l2rarmDistance = changeNum(l2rarmDistance)
        console.log('++++++0+++++', l2rarmDistance);
        neckCircumference = changeNum(neckCircumference)
        upperTorsoCircumference = changeNum(upperTorsoCircumference)
        lowerTorsoCircumference = changeNum(lowerTorsoCircumference)
        h2tLength = changeNum(h2tLength)
        torsoLength = changeNum(torsoLength)

        function changeNum(params) {

          if (params) {
            if (rulerUnit === 'cm') {
              return `${params}`
            } else {
              return `${(params / 2.54).toFixed(2)}`
            }
          } else {
            return ''
          }

        }


        if (weight && weight !== 'unknown') {
          weight = parseFloat(weight).toFixed(1)
        }
        let breedName = data.breed
        if (!breedName) {
          breedName = 'unknown'
        }
        switch (breedName) {
          case 'defaultdog':
            breedName = 'Dog'

            break;
          case 'defaultother':
            breedName = 'Other'

            break;
          case 'defaultcat':
            breedName = 'Cat'
            break;

        }
        this.setState({
          petName: data.petName,
          owner: data.owner,
          breedName,
          weight,
          age: data.age,
          patientId: data.patientId,
          petId: data.petId,
          l2rarmDistance, neckCircumference, upperTorsoCircumference, lowerTorsoCircumference,
          h2tLength, torsoLength,
          url, speciesId,
          isWalkIn: false
        }, () => {
          this._getHistory()
        })
      }
    }





    //这里做了个监听，当有数据发过来的时候直接在这里接收
    ipcRenderer.on('sned', this._send)
    ipcRenderer.on('usbDetect', this.usbDetect)
    ipcRenderer.on('noUSB', this._noUSB)

    this._whether_to_connect_to_mella()
    //刚进入测量界面需要获取以前的历史数据，测量一次就添加一个记录
    // this._getHistory()

    ipcRenderer.on('changeFenBianLv', this.changeFenBianLv)


    if (temporaryStorage.devicesType) {
      this.setState({
        devicesType: temporaryStorage.devicesType
      })
    }

  }
  componentWillUnmount() {
    ipcRenderer.removeListener('sned', this._send)
    ipcRenderer.removeListener('usbDetect', this.usbDetect)
    ipcRenderer.removeListener('noUSB', this._noUSB)
    ipcRenderer.removeListener('changeFenBianLv', this.changeFenBianLv)

    clearInterval(detectTimer)
    detectTimer && clearInterval(detectTimer)
    countdownTimer && clearInterval(countdownTimer)
    getSerialTime && clearTimeout(getSerialTime)
    this.detectTimer && clearInterval(this.detectTimer)
    this.detectTimer && clearInterval(this.detectTimer)
    lastConnectionTime = null;
    clinicalYuce = []
    clinicalIndex = 0
    message.destroy()


  }
  changeFenBianLv = (e) => {
    console.log(e);
    let ipcRenderer = window.electron.ipcRenderer
    ipcRenderer.send('big', win())
    this.setState({

    })
  }
  _noUSB = (e, data) => {
    console.log('没有USB设备：', data);
    if (data === false) {
      message.destroy()
      this.setState({
        noUSB: false
      })
    } else {
      if (!this.state.noUSB) {
        message.error('The base is not detected. Please insert the base', 0)
        this.setState({
          noUSB: true
        })
      }

    }
  }

  _send = (event, data) => {
    //data就是测量的数据，是十进制的数字
    this.command(data)()
  }
  /**
   *
   *usb检测，为true代表插上了设备，false代表拔出了设备
   */
  usbDetect = (event, data) => {
    this.detectTimer && clearInterval(this.detectTimer)
    if (data === true) {
      this._whether_to_connect_to_mella()
    } else {
      this.detectTimer && clearInterval(this.detectTimer)
      num07 = 0
    }
  }
  _whether_to_connect_to_mella = () => {
    message.destroy()
    this.detectTimer = setInterval(() => {
      if (isMeasurement) {
        return
      }
      if (!initTime) {
        // console.log('断开连接');

        firstEar = true
        let hardSet = electronStore.get('hardwareConfiguration')
        let countdown = hardSet.is15 ? 15 : 30
        this.setState({
          measuerStatus: 'disconnected',
          countdown,
          isMeasure: false,
          isconnected: false,
          isEarMeasure: false
        })
        initTime = new Date()
      } else {
        ipcRenderer.send('usbdata', { command: '07', arr: ['5A'] })
        if (new Date() - initTime < 5000) {
          // console.log('连接成功');

        } else {
          console.log('2断开连接');
          firstEar = true
          let hardSet = electronStore.get('hardwareConfiguration')
          let countdown = hardSet.is15 ? 15 : 30
          this.setState({
            measuerStatus: 'disconnected',
            countdown,
            isMeasure: false,
            isconnected: false,
            isEarMeasure: false
          })
        }
      }
    }, 2000);



  }
  /**------------------顶部start------------------------ */
  _close = () => {
    let ipcRenderer = window.electron.ipcRenderer
    console.log('关闭程序');
    ipcRenderer.send('window-close')
  }
  _min = () => {
    let ipcRenderer = window.electron.ipcRenderer
    console.log('最小化程序');
    ipcRenderer.send('window-min')
    this.setState({
      minbgc: '',
    })
  }
  _minMove = () => {

    this.setState({
      minbgc: 'rgb(211, 205, 205)'
    })
  }
  _minLeave = () => {
    this.setState({
      minbgc: ''
    })
  }
  _closeMove = () => {
    this.setState({
      closeColor: 'red',
      closebgc: '#fff'
    })
  }
  _closeLeave = () => {
    this.setState({
      closeColor: '#fff',
      closebgc: ''
    })
  }


  handleClick = e => {
    console.log('click ', e);

    switch (e.key) {
      case '1':
        switch (storage.identity) {
          case '2': this.props.history.push({ pathname: '/EzyVetSelectExam', listDate: storage.ezyVetList, defaultCurrent: storage.defaultCurrent })

            break;
          case '1': this.props.history.push('/VetSpireSelectExam')

            break;
          case '3': this.props.history.push({ pathname: '/uesr/selectExam', listDate: storage.doctorList, defaultCurrent: storage.defaultCurrent })

            break;

          default:
            break;
        }

        break;

      case '2': this.props.history.push('/'); break;
      case '3': this.props.history.push({ pathname: '/page8', identity: storage.identity, patientId: this.state.patientId, isconnected: this.state.isconnected }); break;
      case '4': this.props.history.push('/page12'); break;
      case '5': this.props.history.push('/menuOptions/settings'); break;
      default:
        break;
    }

  };
  // newArr 指的是十进制数字数组，   dataArr1:指的是16进制字符串数组
  command = (newArr) => {
    let dataArr1 = newArr.map(item => {
      if (item.toString(16).length < 2) {
        return '0' + item.toString(16)
      } else {
        return item.toString(16)
      }
    })

    const instruction = [209, 193, 192, 129, 135, 238, 98, 97, 130, 208, 177, 194, 7, 99, 255]
    if (newArr[2] !== 7) {
      initTime = new Date()
      num07 = 0
    } else {
      num07++
    }



    isMeasurement = false
    const commandArr = {
      209: () => {  //腋温
        if (firstEar) {
          firstEar = false
          console.log('去获取探头id');
          ipcRenderer.send('usbdata', { command: '31', arr: [] })
        }
        isMeasurement = true
        let temp1 = parseFloat(`${dataArr1[3]}.${(dataArr1[4])}`)
        let temp0 = parseFloat(`${dataArr1[5]}.${(dataArr1[6])}`)
        // let Temp = parseFloat(temp0.toFixed(1))
        let Temp = temp0
        console.log(Temp);
        if (Temp === 24.7 || Temp === 0 || Temp === null || Temp === undefined) {
          return
        }


        if (this.state.isMeasure === false) {

          if (countdownTimer) {
            let hardSet = electronStore.get('hardwareConfiguration')
            let countdown = hardSet.is15 ? 15 : 30
            this.setState({
              countdown
            })
          }

          countdownTimer = setInterval(() => {
            let { countdown, isconnected } = this.state
            this.setState({
              countdown: countdown - 1

            })

            if (countdown === 0) {
              console.log('调用15秒的接口');
              this._prediction()
              countdownTimer && clearInterval(countdownTimer)
              this.setState({
                countdown: 0
              })
              // ipcRenderer.send('usbdata', { command: '41', arr: [] })

            }

            if (isconnected === false) {
              countdownTimer && clearInterval(countdownTimer)

            }
          }, 1000);
        }
        lastConnectionTime = new Date();



        let progress = (Temp - 25) * 5
        let dataS = {
          sample: clinicalIndex++,
          data0: temp0,
          data1: temp1
        }
        clinicalYuce.push(dataS)
        if (clinicalIndex < 10) {
          clinicalYuce.push({
            sample: clinicalIndex++,
            data0: temp0,
            data1: temp1
          })
        }
        this.setState({
          Temp,
          isMeasure: true,
          // mearsurePart: 1,
          measuerStatus: 'connented',
          isconnected: true,
          progress,
          endMeasure: false,
          initFlog: true,
          isEarMeasure: false
        })

      },
      208: () => {  //耳温

        lastConnectionTime = new Date();
        isMeasurement = true
        if (firstEar) {
          firstEar = false
          console.log('去获取探头id');
          ipcRenderer.send('usbdata', { command: '31', arr: [] })
        }
        //现在探头0可能不存在，所以把探头0改为探头1
        let temp0 = parseFloat(`${dataArr1[7]}.${(dataArr1[8])}`)
        let Temp = temp0

        console.log(Temp, temp0);
        let progress = (Temp - 25) * 5
        this.setState({
          Temp,
          isMeasure: false,
          mearsurePart: 3,
          measuerStatus: '测量中',
          isconnected: true,
          progress,
          endMeasure: false,
          initFlog: true,
          isEarMeasure: true,
          petVitalTypeId: '03'
        })

      },
      193: () => {  //硬件发送结束命令
        this.time193 && clearTimeout(this.time193)
        this.time193 = setTimeout(() => {
          endflog = true
          countdownTimer && clearInterval(countdownTimer)
          this.setState({
            isMeasure: false,
            endMeasure: true,
            isEarMeasure: false
          })
          lastConnectionTime = new Date();
          if (saveHistoryTime != null) {
            clearTimeout(saveHistoryTime)
          }

          clinicalYuce = []
          clinicalIndex = 0
          firstEar = true
          this.time193 && clearTimeout(this.time193)
          console.log('-----------=======最终结果值========---------', this.state.Temp);
          let { Temp, units } = this.state
          let temp = units === '℉' ? (Temp * 1.8 + 32).toFixed(1) : `${Temp}`.toFixed(1)
          if (this.state.devicesType === 'mella') {
            ipcRenderer.send('keyboardWriting', temp)
          }

        }, 1000);


      },
      // 194: () => {       //硬件收到机器学习结果并停止测量，通知我们一声
      //   endflog = true
      //   countdownTimer && clearInterval(countdownTimer)
      //   this.setState({
      //     isMeasure: false,
      //     endMeasure: true,
      //     isEarMeasure: false
      //   })
      //   lastConnectionTime = new Date();
      //   if (saveHistoryTime != null) {
      //     clearTimeout(saveHistoryTime)
      //   }

      //   clinicalYuce = []
      //   clinicalIndex = 0
      //   isMeasurement = false
      // },

      192: () => {   //开始测量返回结果
        switch (newArr[3]) {
          case 90: console.log('有探头，开始测量的返回指令·'); break;
          case 11: console.log('没有探头，开始测量的返回值'); break;

        }
      },
      129: () => {      //返回硬件版本号
        console.log(`返回的版本号为${newArr[3]}`);
        lastConnectionTime = new Date();
        this.setState({
          measuerStatus: 'connented',
          isconnected: true,
          isEarMeasure: false

        })
      },
      135: () => {          //硬件的一些基本信息
        /**
         * ______________新版、旧版没法控制温度计__________________
         * newArr[3]、newArr[4]、newArr[5]、newArr[6]是蓝牙温度计的修正系数
         * newArr[7] 无操作关机时间
         * newArr[8] 背光时间
         * newArr[9] 是否提示音    ：00代表无提示音，11代表有提示音
         * newArr[10] 测量单位    01代表℃，00代表℉
         */

        let hardSet = electronStore.get('hardwareConfiguration')
        let beep = hardSet.isBeep ? '11' : '00'
        let unit = hardSet.isHua ? '00' : '01'

        if (dataArr1[7] === hardSet.autoOff.number && dataArr1[8] === hardSet.backlightTimer.number &&
          dataArr1[9] === beep && dataArr1[10] === unit) {
        } else {
          console.log('不相同，去发送命令');
          let setArr = ['03', 'ed', '07', 'dd', hardSet.autoOff.number, hardSet.isBacklight ? hardSet.backlightTimer.number : '00', hardSet.isBeep ? '11' : '00', hardSet.isHua ? '00' : '01']
          ipcRenderer.send('usbdata', { command: '21', arr: setArr })
        }
        this.setState({
          measuerStatus: 'connented',
          isconnected: true
        })

      },
      238: () => {     //探头松动
        console.log('探头松动');
        this.setState({
          isMeasure: false,
          endMeasure: true
        })
        message.error('The probe is loose, please re-install and measure again', 5)
        clinicalYuce = []
        clinicalIndex = 0
        countdownTimer && clearInterval(countdownTimer)
      },
      194: () => {       //硬件收到了机器学习预测的温度
        this.setState({
          isMeasure: false,
          endMeasure: true,
          APIFlog: true,
          isEarMeasure: false
        })
        clinicalYuce = []
        clinicalIndex = 0
        endflog = true
        countdownTimer && clearInterval(countdownTimer)
      },
      98: () => { //蓝牙连接断开
        console.log('断开连接---断开连接---断开连接---断开连接---断开连接---断开连接');
        firstEar = true
        console.log(new Date() - is97Time);
        if (new Date() - is97Time < 1000) {
          return
        }

        let hardSet = electronStore.get('hardwareConfiguration')
        let countdown = hardSet.is15 ? 15 : 30
        this.setState({
          measuerStatus: 'disconnected',
          countdown,
          isMeasure: false,
          isconnected: false,
          isEarMeasure: false
        })








      },
      97: () => {       //蓝牙连接
        console.log('连接成功---连接成功---连接成功---连接成功---连接成功---连接成功');
        // disconnectedNum = 0
        // lastConnectionTime = new Date();
        //  disconnectedNum = 0
        // lastConnectionTime = new Date();
        this.setState({
          measuerStatus: 'connented',
          isconnected: true,
          isEarMeasure: false

        })
        is97Time = new Date()
      },
      177: () => {         //探头id
        let dataArr1 = newArr.map(item => {
          if (item.toString(16).length < 2) {
            return '0' + item.toString(16)
          } else {
            return item.toString(16)
          }
        })


        let id = ''
        for (let i = 3; i < dataArr1.length - 2; i++) {
          id += dataArr1[i]

        }
        console.log(id, dataArr1[7]);

        this.setState({
          probeID: id,
          petVitalTypeId: dataArr1[7]
        })
        if (dataArr1[7] === '01') {
          this.setState({
            mearsurePart: 1
          })
        } else if (dataArr1[7] === '02') {
          this.setState({
            mearsurePart: 2
          })
        } else if (dataArr1[7] === '03') {
          this.setState({
            mearsurePart: 3
          })
        }



      },
      7: () => {  //发什么收什么，需要去重新插拔底座
        console.log('重新插拔底座');
        if (num07 === 3 && this.state.err07Visible === false) {
          this.setState({
            err07Visible: true
          })
        }
      },
      99: () => { //体脂称的广播信息
        function getVal(shi, xiaoshuo) {

          if (shi.length < 2) {
            shi = `0${shi}`
          }
          if (xiaoshuo.length < 2) {
            xiaoshuo = `0${xiaoshuo}`
          }
          return `0x${shi}${xiaoshuo}`
        }


        let weight = getVal((dataArr1[3]).toString(16), (dataArr1[4]).toString(16))
        let impedance = getVal((dataArr1[5]).toString(16), (dataArr1[6]).toString(16))
        let sendWeight = null
        try {
          sendWeight = parseInt(weight) / 100
          weight = parseInt(weight) / 100 * 2.2046
          if (impedance) {
            impedance = parseInt(impedance)
          }
          weight = weight.toFixed(1)

        } catch (error) {
          console.log(error);
        }

        if (weight) {
          // console.log(sameBiggieNum, keyboardBiggieFlog);
          if (weight === this.state.biggieDate && this.state.devicesType === 'biggie') {

            sameBiggieNum++
            if (!keyboardBiggieFlog && sameBiggieNum === 6) {
              console.log('键盘写入');
              let { units, sendWeight, biggieDate } = this.state

              let weight = units === '℃' ? sendWeight : biggieDate
              ipcRenderer.send('keyboardWriting', weight)
            }

          } else {
            sameBiggieNum = 0
            keyboardBiggieFlog = false
          }

          this.setState({
            biggieDate: weight,
            impedance,
            sendWeight,
            isHaveBigieDate: true
          })
        }

      },
      100: () => {//蓝牙软尺广播的数据
        let confirmBtn = newArr[6]    //十进制数字，值为160代表尺子拉动，值为161代表按了尺子确认按钮
        let rulerUnitNum = newArr[11] //十进制数字，值大于等于80代表单位为in，小于80代表单位为cm
        let newVal = null             //为测量数值，和单位匹配对应
        const ITEMINDEX = 6

        //num1和num2组成测得的测量值，num的值为测量数值，单位恒为厘米
        let num1 = dataArr1[7]
        let num2 = dataArr1[8]
        let num = getVal(num1, num2)
        try {
          newVal = (parseInt(num) / 100)
          if (newVal < 3) {
            newVal = 0
          }

          if (rulerUnitNum >= 80) {
            newVal = (newVal * 0.3937).toFixed(2)

          } else {
            newVal = newVal.toFixed(1)
          }
        } catch (error) {
          console.log(error);
        }


        function getVal(shi, xiaoshuo) {

          if (shi.length < 2) {
            shi = `0${shi}`
          }
          if (xiaoshuo.length < 2) {
            xiaoshuo = `0${xiaoshuo}`
          }
          return `0x${shi}${xiaoshuo}`
        }

        //点击了确认按钮
        let { itemIndex, l2rarmDistance, neckCircumference, upperTorsoCircumference, lowerTorsoCircumference,
          h2tLength, torsoLength
        } = this.state
        if (confirmBtn === 161) {
          if (!nextFlog) {
            nextFlog = true


            let units = rulerUnitNum >= 80 ? 'in' : 'cm'
            if (itemIndex === ITEMINDEX) {
              // this._next()
              return
            }
            let newitemIndex = itemIndex >= ITEMINDEX ? ITEMINDEX : itemIndex + 1
            let textValue = ''
            switch (itemIndex) {
              case 1: textValue = l2rarmDistance; break;
              case 2: textValue = h2tLength; break;
              case 3: textValue = torsoLength; break;
              case 4: textValue = neckCircumference; break;
              case 5: textValue = upperTorsoCircumference; break;
              case 6: textValue = lowerTorsoCircumference; break;
              default:
                break;
            }

            if (newVal !== textValue && parseInt(newVal) > 0) {

              switch (itemIndex) {
                case 1: this.setState({ l2rarmDistance: newVal, itemIndex: newitemIndex, units }); break;
                case 2: this.setState({ h2tLength: newVal, itemIndex: newitemIndex, units }); break;
                case 3: this.setState({ torsoLength: newVal, itemIndex: newitemIndex, units }); break;
                case 4: this.setState({ neckCircumference: newVal, itemIndex: newitemIndex, units }); break;
                // case 5: this.setState({ bodyWidth: newVal, itemIndex: newitemIndex, units }); break;
                case 5: this.setState({ upperTorsoCircumference: newVal, itemIndex: newitemIndex, units }); break;
                case 6: this.setState({ lowerTorsoCircumference: newVal, itemIndex: newitemIndex, units }); break;
                default: this.setState({
                  itemIndex: newitemIndex
                  , units
                })
                  break;
              }
            } else {
              this.setState({
                itemIndex: newitemIndex,
                units
              })
            }



          }
        } else if (confirmBtn === 160) {
          nextFlog = false
          let textValue = ''
          let units = rulerUnitNum >= 80 ? 'in' : 'cm'

          switch (itemIndex) {
            case 1: textValue = l2rarmDistance; break;
            case 2: textValue = h2tLength; break;
            case 3: textValue = torsoLength; break;
            case 4: textValue = neckCircumference; break;
            case 5: textValue = upperTorsoCircumference; break;
            case 6: textValue = lowerTorsoCircumference; break;
          }

          if (newVal !== textValue && parseInt(newVal) > 0) {
            if (!avoidRepetition) {
              avoidRepetition = true
              this.avoidRepetition = setTimeout(() => {
                avoidRepetition = false
                this.avoidRepetition && clearTimeout(this.avoidRepetition)
              }, 100);
              switch (itemIndex) {
                case 1: this.setState({ l2rarmDistance: newVal, units }); break;
                case 2: this.setState({ h2tLength: newVal, units }); break;
                case 3: this.setState({ torsoLength: newVal, units }); break;
                case 4: this.setState({ neckCircumference: newVal, units }); break;
                case 5: this.setState({ upperTorsoCircumference: newVal, units }); break;
                case 6: this.setState({ lowerTorsoCircumference: newVal, units }); break;
                default:
                  break;
              }
            }
          }
        }




      },
      255: () => {
        // console.log(dataArr1);
        let length = newArr.length
        let frameLength = newArr[1]   //帧长
        let itemLength = newArr[3] + 1  //数据位的长度   13
        let dataIndex = 0

        let bluName = ''
        let bluData = []
        //["aa", "25", "ff", |"03", "03", "b0", "ff",| "0f", "ff", "ac", "d2", "0b", "72", "c1", "7d", "3e", "d0", "a0", "00", "05", "09", "00", "2e",| "05", "09", "54", "61", "70", "65", |"06", "ef", "d0", "3e", "7d", "c1", "72", |"0b", "5c", "55"]
        while (itemLength < length && (itemLength + 3 <= frameLength)) {
          let itemData = []
          for (let i = 0; i < newArr[dataIndex + 3] - 1; i++) {
            itemData.push(dataArr1[i + dataIndex + 5])
          }
          // console.log('--剪切的数据---', itemData);
          switch (newArr[dataIndex + 4]) {
            case 9:
            case 8:
              let str = ''
              for (let i = 0; i < itemData.length; i++) {
                let item = parseInt(itemData[i], 16)
                str += String.fromCharCode(item)

              }
              bluName = str
              // console.log('--蓝牙名称:', bluName);


              break;

            case 255:
              bluData = itemData
              break;
            case 7: console.log('---UUID'); break;
            case 239:
              // console.log('---mac地址');
              break;

            case 3: console.log('----尺子的,不知道什么用'); break;

            default: console.log('直接跳出循环'); return;
          }
          dataIndex = itemLength
          itemLength = itemLength + newArr[dataIndex + 3] + 1
        }
        console.log('硬件名称', bluName, '-----硬件数据', bluData);

        if (bluName.indexOf('C19') !== -1 && bluData.length > 10) {

          let weight = `0x${bluData[10]}${bluData[11]}`
          let impedance = `0x${bluData[12]}${bluData[13]}`
          let sendWeight = null
          try {
            //sendWeight的值单位是kg,weight的值为lb(磅)
            sendWeight = parseInt(weight) / 100
            weight = parseInt(weight) / 100 * 2.2046
            if (impedance) {
              impedance = parseInt(impedance)
            }
            weight = weight.toFixed(1)

          } catch (error) {
            console.log(error);
          }
          // console.log('----秤', weight, impedance);

          if (weight) {
            // console.log(sameBiggieNum, keyboardBiggieFlog);
            if (weight === this.state.biggieDate && this.state.devicesType === 'biggie') {

              sameBiggieNum++
              if (!keyboardBiggieFlog && sameBiggieNum === 6) {
                console.log('键盘写入');
                let { units, sendWeight, biggieDate } = this.state

                let weight = units === '℃' ? sendWeight : biggieDate
                ipcRenderer.send('keyboardWriting', weight)
              }

            } else {
              sameBiggieNum = 0
              keyboardBiggieFlog = false
            }

            this.setState({
              biggieDate: weight,
              impedance,
              sendWeight,
              isHaveBigieDate: true
            })
          }
        } else if (bluName.indexOf('Tape') !== -1) {

          let confirmBtn = parseInt(bluData[8], 16)     //十进制数字，值为160代表尺子拉动，值为161代表按了尺子确认按钮
          let rulerUnitNum = parseInt(bluData[13], 16) //十进制数字，值大于等于80代表单位为in，小于80代表单位为cm
          let newVal = null             //为测量数值，和单位匹配对应
          const ITEMINDEX = 7
          let units = rulerUnitNum >= 80 ? 'in' : 'cm'

          //num1和num2组成测得的测量值，num的值为测量数值，单位恒为厘米
          let num1 = bluData[9]
          let num2 = bluData[10]
          let num = getVal(num1, num2)
          try {
            newVal = (parseInt(num) / 100)
            if (newVal < 3) {
              newVal = 0
            }

            if (rulerUnitNum >= 80) {
              newVal = (newVal * 0.3937).toFixed(2)

            } else {
              newVal = newVal.toFixed(1)
            }
          } catch (error) {
            console.log(error);
          }



          function getVal(shi, xiaoshuo) {

            if (shi.length < 2) {
              shi = `0${shi}`
            }
            if (xiaoshuo.length < 2) {
              xiaoshuo = `0${xiaoshuo}`
            }
            return `0x${shi}${xiaoshuo}`
          }

          //点击了确认按钮
          let { itemIndex, l2rarmDistance, neckCircumference, upperTorsoCircumference, lowerTorsoCircumference,
            h2tLength, torsoLength
          } = this.state
          if (confirmBtn === 161) {
            if (!nextFlog) {
              nextFlog = true

              if (itemIndex === ITEMINDEX) {
                this._updatePetAttributes()
                return
              }
              let newitemIndex = itemIndex >= ITEMINDEX ? 1 : itemIndex + 1

              let textValue = ''
              switch (itemIndex) {
                case 1: textValue = l2rarmDistance; break;
                case 2: textValue = h2tLength; break;
                case 3: textValue = torsoLength; break;
                case 4: textValue = neckCircumference; break;
                case 5: textValue = upperTorsoCircumference; break;
                case 6: textValue = lowerTorsoCircumference; break;
                default:
                  break;
              }

              if (newVal !== textValue && parseInt(newVal) > 0) {
                switch (itemIndex) {
                  case 1: this.setState({ l2rarmDistance: newVal, itemIndex: newitemIndex, rulerUnit: units }); break;
                  case 2: this.setState({ h2tLength: newVal, itemIndex: newitemIndex, rulerUnit: units }); break;
                  case 3: this.setState({ torsoLength: newVal, itemIndex: newitemIndex, rulerUnit: units }); break;
                  case 4: this.setState({ neckCircumference: newVal, itemIndex: newitemIndex, rulerUnit: units }); break;
                  // case 5: this.setState({ bodyWidth: newVal, itemIndex: newitemIndex, units }); break;
                  case 5: this.setState({ upperTorsoCircumference: newVal, itemIndex: newitemIndex, rulerUnit: units }); break;
                  case 6: this.setState({ lowerTorsoCircumference: newVal, itemIndex: newitemIndex, rulerUnit: units }); break;
                  default: this.setState({
                    itemIndex: newitemIndex
                    , rulerUnit: units
                  })
                    break;
                }
              } else {
                this.setState({
                  itemIndex: newitemIndex,
                  rulerUnit: units
                })
              }



            }
          } else if (confirmBtn === 160) {
            nextFlog = false
            let textValue = ''


            switch (itemIndex) {
              case 1: textValue = l2rarmDistance; break;
              case 2: textValue = h2tLength; break;
              case 3: textValue = torsoLength; break;
              case 4: textValue = neckCircumference; break;
              case 5: textValue = upperTorsoCircumference; break;
              case 6: textValue = lowerTorsoCircumference; break;
            }

            if (newVal !== textValue && parseInt(newVal) > 0) {
              if (!avoidRepetition) {
                avoidRepetition = true
                this.avoidRepetition = setTimeout(() => {
                  avoidRepetition = false
                  this.avoidRepetition && clearTimeout(this.avoidRepetition)
                }, 100);
                switch (itemIndex) {
                  case 1: this.setState({ l2rarmDistance: newVal, rulerUnit: units }); break;
                  case 2: this.setState({ h2tLength: newVal, rulerUnit: units }); break;
                  case 3: this.setState({ torsoLength: newVal, rulerUnit: units }); break;
                  case 4: this.setState({ neckCircumference: newVal, rulerUnit: units }); break;
                  case 5: this.setState({ upperTorsoCircumference: newVal, rulerUnit: units }); break;
                  case 6: this.setState({ lowerTorsoCircumference: newVal, rulerUnit: units }); break;
                  default:
                    break;
                }
              }
            }
          }

        } else if (bluName.indexOf('Mella Measure') !== -1 && this.state.devicesType === 'biggie') {
          //255
          let { itemIndex, l2rarmDistance, neckCircumference, upperTorsoCircumference, lowerTorsoCircumference,
            h2tLength, torsoLength
          } = this.state
          // console.log('结束循环蓝牙名称', bluData)
          let confirmBtn = bluData[8]     //十六进制数字，值为01代表尺子拉动，值为x2代表按了尺子确认按钮

          let rulerUnitNum = parseInt(bluData[11], 16) //十进制数字，值等于11代表单位为in，00代表单位为cm
          let newVal = null             //为测量数值，和单位匹配对应
          const ITEMINDEX = 6
          let units = rulerUnitNum === 0 ? 'cm' : 'in'


          if (units !== this.state.rulerUnit) {
            if (units === 'cm') {
              l2rarmDistance = l2rarmDistance ? `${(parseFloat(l2rarmDistance) * 2.54).toFixed(1)}` : ''
              neckCircumference = neckCircumference ? `${(parseFloat(neckCircumference) * 2.54).toFixed(1)}` : ''
              upperTorsoCircumference = upperTorsoCircumference ? `${(parseFloat(upperTorsoCircumference) * 2.54).toFixed(1)}` : ''
              lowerTorsoCircumference = lowerTorsoCircumference ? `${(parseFloat(lowerTorsoCircumference) * 2.54).toFixed(1)}` : ''
              h2tLength = h2tLength ? `${(parseFloat(h2tLength) * 2.54).toFixed(1)}` : ''
              torsoLength = torsoLength ? `${(parseFloat(torsoLength) * 2.54).toFixed(1)}` : ''
            } else {
              l2rarmDistance = l2rarmDistance ? `${(parseFloat(l2rarmDistance) / 2.54).toFixed(2)}` : ''
              neckCircumference = neckCircumference ? `${(parseFloat(neckCircumference) / 2.54).toFixed(2)}` : ''
              upperTorsoCircumference = upperTorsoCircumference ? `${(parseFloat(upperTorsoCircumference) / 2.54).toFixed(2)}` : ''
              lowerTorsoCircumference = lowerTorsoCircumference ? `${(parseFloat(lowerTorsoCircumference) / 2.54).toFixed(2)}` : ''
              h2tLength = h2tLength ? `${(parseFloat(h2tLength) / 2.54).toFixed(2)}` : ''
              torsoLength = torsoLength ? `${(parseFloat(torsoLength) / 2.54).toFixed(2)}` : ''
            }

            this.setState({
              l2rarmDistance, neckCircumference, upperTorsoCircumference, lowerTorsoCircumference,
              h2tLength, torsoLength,
              rulerUnit: units
            })


          }

          //num1和num2组成测得的测量值，num的值为测量数值，单位恒为厘米
          let num1 = bluData[9]
          let num2 = bluData[10]
          let num = getVal(num1, num2)
          try {
            newVal = parseFloat(num)
            if (rulerUnitNum === 17) {
              newVal = newVal.toFixed(2)

            } else {
              newVal = newVal.toFixed(1)
            }
          } catch (error) {
            console.log(error);
          }



          function getVal(shi, xiaoshuo) {
            let num1 = parseInt(shi, 16)
            let num2 = parseInt(xiaoshuo, 16)

            return `${num1}.${num2}`
          }

          //点击了确认按钮

          if (confirmBtn[1] === '2' && confirmBtn[0] !== confirmBtnFlog) {
            confirmBtnFlog = confirmBtn[0]
            if (!nextFlog) {
              nextFlog = true

              if (itemIndex === ITEMINDEX) {
                this._updatePetAttributes()
                return
              }
              let newitemIndex = itemIndex >= ITEMINDEX ? 1 : itemIndex + 1

              let textValue = ''
              try {
                switch (itemIndex) {
                  case 1: textValue = l2rarmDistance; this.input2 && this.input2.focus(); break;
                  case 2: textValue = h2tLength; this.input3 && this.input3.focus(); break;
                  case 3: textValue = torsoLength; this.input4 && this.input4.focus(); break;
                  case 4: textValue = neckCircumference; this.input5 && this.input5.focus(); break;
                  case 5: textValue = upperTorsoCircumference; this.input6 && this.input6.focus(); break;
                  case 6: textValue = lowerTorsoCircumference; this.input7 && this.input7.focus(); break;
                  default:
                    break;
                }
              } catch (error) {
                console.log(error);
              }




              if (newVal !== textValue && parseInt(newVal) >= 0) {
                switch (itemIndex) {
                  case 1: this.setState({ l2rarmDistance: newVal, itemIndex: newitemIndex, rulerUnit: units }); break;
                  case 2: this.setState({ h2tLength: newVal, itemIndex: newitemIndex, rulerUnit: units }); break;
                  case 3: this.setState({ torsoLength: newVal, itemIndex: newitemIndex, rulerUnit: units }); break;
                  case 4: this.setState({ neckCircumference: newVal, itemIndex: newitemIndex, rulerUnit: units }); break;
                  // case 5: this.setState({ bodyWidth: newVal, itemIndex: newitemIndex, units }); break;
                  case 5: this.setState({ upperTorsoCircumference: newVal, itemIndex: newitemIndex, rulerUnit: units }); break;
                  case 6: this.setState({ lowerTorsoCircumference: newVal, itemIndex: newitemIndex, rulerUnit: units }); break;
                  default: this.setState({
                    itemIndex: newitemIndex
                    , rulerUnit: units
                  })
                    break;
                }
              } else {
                this.setState({
                  itemIndex: newitemIndex,
                  rulerUnit: units
                })
              }



            }
          } else if (confirmBtn === '01') {
            nextFlog = false
            let textValue = ''


            switch (itemIndex) {
              case 1: textValue = l2rarmDistance; break;
              case 2: textValue = h2tLength; break;
              case 3: textValue = torsoLength; break;
              case 4: textValue = neckCircumference; break;
              case 5: textValue = upperTorsoCircumference; break;
              case 6: textValue = lowerTorsoCircumference; break;
            }

            if (newVal !== textValue && parseInt(newVal) >= 0) {
              if (!avoidRepetition) {
                avoidRepetition = true
                this.avoidRepetition = setTimeout(() => {
                  avoidRepetition = false
                  this.avoidRepetition && clearTimeout(this.avoidRepetition)
                }, 100);
                try {
                  switch (itemIndex) {
                    case 1: this.setState({ l2rarmDistance: newVal, rulerUnit: units }); this.input1 && this.input1.focus(); break;
                    case 2: this.setState({ h2tLength: newVal, rulerUnit: units }); this.input2 && this.input2.focus(); break;
                    case 3: this.setState({ torsoLength: newVal, rulerUnit: units }); this.input3 && this.input3.focus(); break;
                    case 4: this.setState({ neckCircumference: newVal, rulerUnit: units }); this.input4 && this.input4.focus(); break;
                    case 5: this.setState({ upperTorsoCircumference: newVal, rulerUnit: units }); this.input5 && this.input5.focus(); break;
                    case 6: this.setState({ lowerTorsoCircumference: newVal, rulerUnit: units }); this.input6 && this.input6.focus(); break;
                    default:
                      break;
                  }
                } catch (error) {
                  console.log(error);
                }

              }
            }
          }

        }

        // if (bluName.indexOf('C19') !== -1 && bluData.length > 10) {
        // console.log(bluData);

        else if (bluName.indexOf('Biggie') !== -1 && this.state.devicesType === 'biggie' && bluData.length > 10) {
          function getVal(shi) {
            if (`${shi}`.length < 2) {
              return `0${shi}`
            }
            return `${shi}`

          }

          let newArr = bluData

          let weight = `${getVal(newArr[9].toString(16))}${getVal(newArr[10].toString(16))}`
          weight = parseInt(weight, 16)


          let impedance = `${getVal(newArr[12].toString(16))}${getVal(newArr[13].toString(16))}`
          impedance = parseInt(impedance, 16)

          let arr11 = getVal(newArr[11].toString(16))

          weight = weight / Math.pow(10, parseInt(arr11[0]))
          // console.log('重量为', weight);
          let weightUnits = 'kg'
          let sendWeight, biggieDate
          switch (arr11[1]) {
            case '0':
              weightUnits = 'kg';
              sendWeight = weight;
              biggieDate = (weight * 2.2046).toFixed(2)
              break;
            case '1':
              weightUnits = 'lb';
              sendWeight = weight;
              biggieDate = (weight * 2).toFixed(2)
              break;
            default:
              break;
          }

          // if (`${getVal(newArr[8].toString(16))}` === '03') {
          //   //进入了结束测量
          //   if (!biggieSave) {
          //     //第一条测量完成指令
          //     console.log('键盘写入');
          //     let { units, } = this.state

          //     let weight = units === '℃' ? sendWeight : biggieDate
          //     ipcRenderer.send('keyboardWriting', weight)

          //   }
          //   biggieSave = true
          // } else {
          //   biggieSave = false
          // }
          if (weight === this.state.biggieDate && this.state.devicesType === 'biggie') {

            sameBiggieNum++
            if (!keyboardBiggieFlog && sameBiggieNum === 6) {
              console.log('键盘写入');
              let { units, } = this.state

              let weight = units === '℃' ? sendWeight : biggieDate
              ipcRenderer.send('keyboardWriting', weight)
            }

          } else {
            sameBiggieNum = 0
            keyboardBiggieFlog = false
          }



          if (weight >= 0) {

            this.setState({
              biggieDate,
              impedance,
              sendWeight,
              isHaveBigieDate: true
            })
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
  testCheck = (arr) => {
    if (arr.length < 7) {
      return false
    }
    let i = 7
    let checkFloag = arr[i];


    for (i = 8; i < arr.length - 2; i++) {
      checkFloag = checkFloag ^ arr[i];
    }
    return checkFloag;
  }
  getMac = (arr) => {
    // console.log(arr);
    let str = arr[1].toString(16)
    if (str.length === 1) {
      str = '0' + str
    }
    for (let i = 2; i < 7; i++) {

      let item = arr[i].toString(16)
      if (item.length === 1) {
        item = '0' + item
      }
      str += `:${item}`
      // }


    }




    return str
  }
  //15秒的预测程序
  _time15 = (val) => {

    let isDog = true
    let { petSpeciesBreedId } = this.state
    if (petSpeciesBreedId < 136) {
      isDog = false
    }
    let parame = {
      ambient_temperature: 25,
      data: clinicalYuce,
      deviceId: '11111111111111111111111111',

      sampling_rate: '104ms'
    }

    console.log('预测传入数据', parame);

    let url = !isDog ? '/clinical/dogPredict' : '/clinical/catPredict'
    console.log(url)
    console.log('预测发送只', parame);

    fetchRequest(url, 'POST', parame)
      .then((res) => {
        // predictionFlog = false
        if (res.message === 'Success') {
          console.log('预测返回值：', res);

          let prediction = res.result.prediction.toFixed(2)
          temp15 = parseFloat(prediction)

        } else {
          console.log('system error')
        }


      })
      .catch((err) => {
        console.log(`:${err}`)

      })



  }
  //预测程序
  _prediction = (val) => {

    let isDog = true
    let { petSpeciesBreedId } = this.state
    if (petSpeciesBreedId < 136) {
      isDog = false
    }
    let parame = {
      // ambient_temperature: this.state.huanwen,
      ambient_temperature: 17,

      data: clinicalYuce,
      deviceId: `${this.state.probeId}`,
      // deviceId: '11111111111111111111111111',

      sampling_rate: '135ms'
    }

    console.log('预测传入数据', parame);

    clinicalYuce = []
    clinicalIndex = 0

    let url = isDog ? '/clinical/dogv12Predict' : '/clinical/catv12Predict'
    console.log(url, petSpeciesBreedId)
    console.log('预测发送只', parame);

    fetchRequest(url, 'POST', parame)
      .then((res) => {
        console.log('预测结果：', res);
        // predictionFlog = false
        if (res.message === 'Success') {
          console.log('预测返回值：', res);

          let prediction = res.result.prediction.toFixed(2)
          console.log(prediction);


          let tempArr = prediction.split('.')
          let intNum = tempArr[0]
          let flotNum = tempArr[1]
          if (intNum.length < 2) {
            intNum = '0' + intNum
          }
          if (flotNum.length < 2) {
            flotNum = '0' + flotNum
          }
          endflog = false


          //1.这里先注释掉,后面忘了取消注释
          const timeID1 = setInterval(() => {
            if (endflog) {
              let Temp = parseFloat(prediction)
              let progress = (Temp - 25) * 5
              this.setState({
                Temp,
                progress
              })
              endflog = false

              timeID1 && clearInterval(timeID1)
            } else {
              const timeID = setTimeout(() => {
                ipcRenderer.send('usbdata', { command: '42', arr: [intNum, flotNum] })
                timeID && clearTimeout(timeID)
              }, 10)

            }
          }, 200)



        } else {
          const timeID = setTimeout(() => {
            // this.sendData('41', [])
            ipcRenderer.send('usbdata', { command: '41', arr: [] })

            clearTimeout(timeID)
          }, 10)
          console.log('system error')
        }


      })
      .catch((err) => {
        // predictionFlog = false
        console.log(err);
        const timeID = setTimeout(() => {
          // this.sendData('41', [])
          ipcRenderer.send('usbdata', { command: '41', arr: [] })

          clearTimeout(timeID)
        }, 10)
        console.log(`:${err}`)

      })



  }
  _mearsurePort = () => {
    switch (this.state.devicesType) {
      case 'mella':
        switch (this.state.mearsurePart) {
          case 1: return (
            <div >
              <div className='part'>
                Axillary
                <img src={ye} alt="" width="50px" />

              </div>
            </div>
          );
          case 2: return (
            <div >
              <div className='part'>
                Rectal
                <img src={gang} alt="" width="50px" />

              </div>
            </div>
          );
          default: return (
            <div >
              <div className='part'>
                Ear
                <img src={er} alt="" width="50px" />

              </div>
            </div>
          );
        }
      case 'biggie':
        return (
          <div className='part'>
            Scale
            <img src={scale} alt="" width="50px" />

          </div>
        )
      default:
        break;
    }


  }
  _getHistory = () => {
    let historys = []
    this.setState({
      loading: true
    })
    fetchRequest(`/pet/getPetExamByPetId/${this.state.petId}`, 'GET', '')  //userID要自动的
      .then(res => {
        console.log(res);
        this.setState({
          loading: false
        })
        if (res.flag === true) {
          let datas = res.data
          console.log('-------', datas);
          for (let i = datas.length - 1; i >= 0; i--) {
            let data = datas[i]
            let { petId, examId, userId, petVitalTypeId, temperature, roomTemperature, bloodPressure, memo,
              bodyConditionScore, heartRate, respiratoryRate, referenceRectalTemperature, furLength, createTime,
              modifiedTime, fat, weight } = data
            // console.log(createTime);
            let time = null
            if (storage.vetspireOrEzyvet === '2') {
              time = modifiedTime
              if (modifiedTime === '' || modifiedTime === null) {
                time = createTime
              }
            } else {
              time = createTime
            }
            let json = {
              time,
              Temp: temperature,
              placement: petVitalTypeId,
              note: memo,
              historyId: examId,
              bodyConditionScore,
              heartRate,
              respiratoryRate,
              referenceRectalTemperature,
              furLength,
              roomTemperature,
              bloodPressure,
              petId,
              userId,
              fat, weight
            }
            // console.log(json);
            historys.push(json)


          }
          console.log('----', historys);
          let historyData = []
          for (let i = 0; i < historys.length; i++) {
            let history = historys[i]
            let { bodyConditionScore, heartRate, respiratoryRate, referenceRectalTemperature, furLength, roomTemperature, bloodPressure, petId, userId, examId, time, fat, weight } = history
            let placement = history.placement
            if (placement === null || placement === '') {
              placement = 1
            }
            let str = {
              date: moment(time).format('MMM DD'),
              time: moment(time).format('hh:mm A'),
              temp: history.Temp,
              placement,
              note: history.note,
              historyId: history.historyId,
              bodyConditionScore, heartRate, respiratoryRate, referenceRectalTemperature, furLength, roomTemperature, bloodPressure, petId, userId,
              key: examId,
              fat, weight
            }
            historyData.push(str)
          }
          console.log('historyData:', historyData);
          this.setState({
            historyData
          })
        }
      })
      .catch(err => {
        this.setState({
          loading: false
        })
        console.log(err);
      })

  }



  _getPetInfo = (value) => {
    let datas = null

    datas = {
      patientId: this.state.patientId,
      org: this.state.org
    }



    console.log('入参：', datas);
    fetchRequest('/pet/getPetInfoByPatientIdAndPetId', 'POST', datas)
      .then(res => {
        console.log('宠物信息', res);
        this.setState({
          spin: false
        })
        if (res.flag === true) {
          //有宠物，进入1
          let { petId, petSpeciesBreedId } = res.data[0]
          console.log('------------', petId);
          this.setState({
            petId,
            petSpeciesBreedId
          }, () => {
            console.log('去获取历史记录');
            this._getHistory()
          })
        } else {
          //没有宠物，进入2

        }
      })
      .catch(err => {
        this.setState({
          spin: false
        })
        console.log(err);
      })

  }

  draggleRef = React.createRef();

  showModal = () => {
    this.setState({
      visible: true
    });
  };





  onStart = (event, uiData) => {
    const { clientWidth, clientHeight } = window?.document?.documentElement;
    const targetRect = this.draggleRef?.current?.getBoundingClientRect();
    this.setState({
      bounds: {
        left: -targetRect?.left + uiData?.x,
        right: clientWidth - (targetRect?.right - uiData?.x),
        top: -targetRect?.top + uiData?.y,
        bottom: clientHeight - (targetRect?.bottom - uiData?.y)
      }
    });
  };
  _changeDeviceType = (val, e) => {
    console.log(val, e)
    this.setState({
      devicesType: val
    })

    if (val === 'biggie' && this.state.isHaveBigieDate) {
      this.setState({
        isHaveBigieDate: false
      })
      keyboardBiggieFlog = false
      sameBiggieNum = 0
    }

    temporaryStorage.devicesType = val




  }
  _refresh = () => {
    console.log('点击了');
    this.setState({
      spin: true,  //
      // addpatient_description: '',
      // addpatient_petName: '',
      // addpatient_species: 1
    })
    if (this.state.addpatient_patientId === '') {
      this.setState({
        spin: false
      })
    } else {
      let list = electronStore.get('doctorExam')

      let searchData = []
      let keyWord = this.state.addpatient_patientId
      for (let i = 0; i < list.length; i++) {
        let patientId = list[i].patientId
        if (`${patientId}` === keyWord) {
          searchData.push(list[i])
        }
      }
      console.log('搜索到的宠物为', searchData);
      if (searchData.length > 0) {
        let data = searchData[0]
        let { l2rarmDistance, neckCircumference, upperTorsoCircumference, lowerTorsoCircumference,
          h2tLength, torsoLength } = data

        l2rarmDistance = l2rarmDistance ? `${l2rarmDistance}` : ''
        neckCircumference = neckCircumference ? `${neckCircumference}` : ''
        upperTorsoCircumference = upperTorsoCircumference ? `${upperTorsoCircumference}` : ''
        lowerTorsoCircumference = lowerTorsoCircumference ? `${lowerTorsoCircumference}` : ''
        h2tLength = h2tLength ? `${h2tLength}` : ''
        torsoLength = torsoLength ? `${torsoLength}` : ''
        let weight = data.weight
        if (weight && weight !== 'unknown') {
          weight = parseFloat(weight).toFixed(1)
        }
        let breedName = data.breed
        if (!breedName) {
          breedName = 'unknown'
        }
        switch (breedName) {
          case 'defaultdog':
            breedName = 'Dog'

            break;
          case 'defaultother':
            breedName = 'Other'

            break;
          case 'defaultcat':
            breedName = 'Cat'
            break;

        }
        console.log('-----------', weight);
        this.setState({
          petName: data.petName,
          owner: data.owner,
          breedName,
          weight,
          age: data.age,
          patientId: data.patientId,
          petId: data.petId,
          itemIndex: 1,
          l2rarmDistance,
          neckCircumference,
          upperTorsoCircumference,
          lowerTorsoCircumference,
          h2tLength,
          torsoLength,
          isWalkIn: false
        }, () => {
          this._getHistory()
        })
      } else {
        this.setState({
          spin: false
        })
      }
    }
  }

  selectWZ = (val) => {
    switch (val) {
      case 'dog':
        this.setState({
          catImg: cat1,
          dogImg: redDog1,
          otherImg: other,
          selectWZ: val,
        })

        break;

      case 'cat':
        this.setState({
          catImg: redCat1,
          dogImg: dog1,
          otherImg: other,
          selectWZ: val,
        })

        break;

      case 'other':
        this.setState({
          catImg: cat1,
          dogImg: dog1,
          otherImg: redother,
          selectWZ: val,
        })
        break;

      default:
        break;
    }
  }

  _topLeft = () => {
    let { patientId, breedName, isMix, age, petName, owner, weight, url, speciesId, petId, isWalkIn, spin, dogImg, catImg, otherImg, addpatient_patientId } = this.state
    if (isWalkIn) {

      return (
        <div className="l">
          <div className="petinfo">
            <div className="heard"
              style={{ height: px(50), marginTop: px(10), fontSize: px(24) }}
            >

              <div className="ltitle" style={{ marginLeft: px(30) }}>
                <p > {`Walk-In Exam`}</p>
              </div>
            </div>

            <div className="walkPetinfo"
              style={{ marginTop: mTop(10), marginBottom: mTop(10), fontSize: px(16), paddingLeft: px(30), }}
            >
              <div className="patirntID"
                style={{ marginTop: px(10), }}
              >
                <p style={{ width: '80px', }}>Patient ID:</p>
                <Input
                  style={{ width: px(150), height: mTop(33), marginLeft: px(25), fontSize: px(18), marginRight: px(6) }}

                  value={addpatient_patientId}
                  bordered={false}
                  onChange={(item) => {
                    this.setState({
                      addpatient_patientId: item.target.value.replace(/\s/g, "")
                    })
                  }}
                  onKeyDown={(e) => {
                    // console.log('------', e);
                    if (e.keyCode === 13) {
                      this._refresh()
                    }
                  }}
                />
                <SyncOutlined className='refresh'
                  style={{ fontSize: px(25) }}
                  onClick={this._refresh} spin={spin} />
              </div>

              <div className='newPet'>
                <div className="patirntID"
                  style={{ marginTop: px(10) }}
                >
                  <p style={{ width: '80px' }}>Pet Name*:</p>
                  <Input
                    // style={{ border: 'none', outline: 'medium' }}
                    style={{ width: px(150), height: mTop(33), marginLeft: px(25), fontSize: px(18), marginRight: px(6) }}

                    value={this.state.addpatient_petName}
                    bordered={false}
                    onChange={(item) => {
                      // console.log(item);
                      this.setState({
                        addpatient_petName: item.target.value
                      })
                    }}
                  />
                </div>
                <div className="patirntID"
                  style={{ marginTop: px(10) }}
                >
                  <p style={{ width: '80px' }}>Description:</p>
                  <Input
                    // style={{ border: 'none', outline: 'medium' }}
                    style={{ width: px(150), height: mTop(33), marginLeft: px(25), fontSize: px(18), marginRight: px(6) }}

                    value={this.state.addpatient_description}
                    bordered={false}
                    onChange={(item) => {
                      // console.log(item);
                      this.setState({
                        addpatient_description: item.target.value
                      })
                    }}
                  />
                </div>


                <div className="species" style={{ marginBottom: px(20), height: px(70), marginTop: px(10) }}>

                  <ul>
                    <li >
                      <div className='speciesChild' >
                        <div className='dog'

                          onClick={() => { this.selectWZ('dog') }}>
                          <img src={dogImg} alt="" style={{ width: px(40) }} />
                        </div>
                        Dog
                      </div>
                    </li>
                    <li>
                      <div className='speciesChild' >
                        <div className='dog' onClick={() => { this.selectWZ('cat') }} >
                          <img src={catImg} alt="" style={{ height: px(40) }} />
                        </div>
                        Cat
                      </div>
                    </li>
                    <li >
                      <div className='speciesChild' >
                        <div className='dog' onClick={() => { this.selectWZ('other') }} >
                          <img src={otherImg} alt="" style={{ width: px(40) }} />
                        </div>
                        Other
                      </div>
                    </li>

                  </ul>
                </div>


              </div>

            </div>
          </div>




          <div className="deviceInfo">
            <div className="heard1"
              style={{ height: px(40), marginTop: px(10), paddingRight: px(10), paddingLeft: px(30) }}
            >
              <span>Device Info</span>
            </div>
            <div className="devicesBody"
              style={{ marginTop: mTop(23) }}
            >
              <div className="devices"
                style={{ paddingLeft: px(31) }}
              >
                <p>Device:</p>
                <Select
                  value={this.state.devicesType}
                  style={{ width: 120 }}
                  size={'small'}
                  onChange={this._changeDeviceType}
                >
                  <Option value="mella">Mella</Option>
                  <Option value="biggie">Biggie</Option>
                </Select>
              </div>
              {this._mearsurePort()}
            </div>

          </div>
        </div>
      )

    }

    if (breedName === null) {
      breedName = ''
    }
    let mix = ''
    if (isMix === true) {
      mix = 'Mix'
    }
    let title = ''
    if (petName && `${petName}`.toLowerCase() !== 'unknown') {
      title += `${petName}`
    }
    if (petName && `${petName}`.toLowerCase() !== 'unknown' && patientId && `${patientId}`.toLowerCase() !== 'unknown') {
      title += `, \xa0 `
    }
    if (patientId && `${patientId}`.toLowerCase() !== 'unknown') {
      title += `ID: ${patientId}`
    }

    let wei = (weight && `${weight}`.toLowerCase() !== 'unknown') ? `${weight}` : ''
    if (wei && wei.indexOf(`kg`) === -1) {
      wei += 'kg'
    }
    let image = `url(${other})`
    if (url) {
      image = `url(${url}?download=0&width=80)`
    } else {
      switch (speciesId) {
        case 1: image = `url(${cat})`; break;
        case 2: image = `url(${dog})`; break;

        default:
          break;
      }
    }




    return (
      <div className="l">
        <div className="petinfo">
          <div className="heard"
            style={{ height: px(50), marginTop: px(10), fontSize: px(24) }}
          >
            <div className="avaterBox">
              <div className='avatar'
                style={{
                  width: px(50),
                  height: px(50),
                  // marginRight: px(20),
                  backgroundImage: image,
                  marginLeft: px(20)


                }}
                onClick={() => {
                  storage.goEditPet = 'nomalmeasurement'
                  this.props.history.push({ pathname: '/page9', participate: { patientId, petName, petId } })
                }}
              >
                {(storage.identity === '3') &&
                  <img className='edit' src={edit} alt="" width='18px' />}
              </div>

            </div>

            <div className="ltitle">
              <p > {title}</p>
            </div>



          </div>

          <div className="info"
            style={{ marginTop: mTop(10), marginBottom: mTop(10), fontSize: px(16), paddingLeft: px(60) }}
          >
            <p>Owner: {(owner && `${owner}`.toLowerCase() !== 'unknown') ? `${owner}` : ''}</p>
            <p>Breed: {(breedName && `${breedName}`.toLowerCase() !== 'unknown') ? `${breedName}  ${mix}` : ''}</p>
            <p>Age: {((age && `${age}`.toLowerCase() !== 'unknown') || age === 0) ? `${age} yrs` : ''} </p>
            <p>Weight: {wei}</p>
          </div>
        </div>
        <div className="deviceInfo">
          <div className="heard1"
            style={{ height: mTop(40), marginTop: mTop(10), paddingRight: px(10), paddingLeft: px(30) }}
          >
            <span>Device Info</span>
          </div>
          <div className="devicesBody"
            style={{ marginTop: mTop(23) }}
          >
            <div className="devices"
              style={{ paddingLeft: px(31) }}
            >
              <p>Device:</p>
              <Select
                value={this.state.devicesType}
                style={{ width: 120 }}
                size={'small'}
                onChange={this._changeDeviceType}
              >
                <Option value="mella">Mella</Option>
                <Option value="biggie">Biggie</Option>
              </Select>
            </div>
            {this._mearsurePort()}
          </div>

        </div>
      </div>
    )



  }
  handleChange = index => {
    console.log('---------', index);
    this.setState({
      furLength: index
    })
  };
  handleChange1 = index => {
    console.log('---------', index);
    this.setState({
      bodyType: index
    })
  };

  _foot = () => {

    // console.log('所有的历史记录：', historyData);



    let lbgc = '', rbgc = ''
    if (this.state.isNotes) {
      lbgc = 'rgba(25,173,228,0.5)'; rbgc = 'rgba(105,201,237,1)'
    } else {
      lbgc = 'rgba(105,201,237,1)'; rbgc = 'rgba(25,173,228,0.5)'
    }

    return (
      <div className="clinical_foot">
        <div className="top"
          style={{ height: '10%', }}
        >
          <div className="foot_l" style={{ backgroundColor: lbgc }} onClick={() => this.setState({ isNotes: true })}>
            Notes
          </div>
          <div className="foot_l" style={{ backgroundColor: rbgc }} onClick={() => this.setState({ isNotes: false })}>
            History
          </div>
        </div>
        {(this.state.isNotes) ? (
          this._notes()
        ) : (this._history())}

      </div >
    )
  }
  _notes = () => {
    let { l2rarmDistance, neckCircumference, upperTorsoCircumference, lowerTorsoCircumference,
      h2tLength, torsoLength, rulerUnit, updatePetAttributes } = this.state
    function num(val) {
      let weight = val.target.value
      let newText = weight.replace(/[^\d.]/g, "");
      newText = newText.replace(/^\./g, "");
      newText = newText.replace(/\.{2,}/g, ".");
      newText = newText.replace(".", "$#$").replace(/\./g, "").replace("$#$", ".");
      newText = newText.replace(/^(\-)*(\d+)\.(\d\d).*$/, '$1$2.$3');//只能输入两个小数
      if (newText.indexOf(".") < 0 && newText != "") {//以上已经过滤，此处控制的是如果没有小数点，首位不能为类似于 01、02的金额
        newText = parseFloat(newText)
      }
      return `${newText}`

    }
    if (this.state.devicesType === 'mella') {
      return (
        <div className="note" style={{ height: mTop(256), marginTop: mTop(10) }}>
          <textarea
            rows="10"
            cols="30"
            value={this.state.notes}
            onChange={(val) => {
              console.log(val);
              this.setState({
                notes: val.target.value
              })
            }}
          >
          </textarea>
        </div>
      )
    } else {
      let { speciesId } = this.state
      let species = speciesId === 1 ? catcareacte : careacte
      return (
        <div className="characteristics flex">
          <div className="careacterL flex">
            <div className="item flex">
              <div className="textTitle" style={{ fontSize: px(15) }}>Head Circumference:</div>
              <div className="input flex" style={{ height: px(30), borderRadius: px(40) }}>
                <input type="text"
                  style={{
                    borderRadius: px(40), fontSize: px(17),
                    paddingRight: px(20)
                  }}
                  value={l2rarmDistance}
                  ref={(input) => { this.input1 = input }}
                  // autoFocus={true}
                  onChange={(val) => {
                    let data = num(val)
                    console.log(data);
                    this.setState({
                      l2rarmDistance: data
                    })


                  }}
                  onFocus={() => {
                    this.setState({
                      itemIndex: 1
                    })
                  }}
                />
                <div className="unit" style={{ right: px(8), fontSize: px(15) }}>{rulerUnit}</div>
              </div>
            </div>
            <div className="item flex">
              <div className="textTitle" style={{ fontSize: px(15) }}>Heard to Tail Length:</div>
              <div className="input flex" style={{ height: px(30), borderRadius: px(40) }}>
                <input type="text"
                  style={{ borderRadius: px(40), fontSize: px(17), paddingRight: px(20) }}
                  ref={(input) => { this.input2 = input }}
                  value={h2tLength}
                  onChange={(val) => {
                    let data = num(val)
                    this.setState({
                      h2tLength: data
                    })
                  }}
                  onFocus={() => {
                    this.setState({
                      itemIndex: 2
                    })
                  }}
                />
                <div className="unit" style={{ right: px(8), fontSize: px(17) }}>{rulerUnit}</div>
              </div>
            </div>
            <div className="item flex">
              <div className="textTitle" style={{ fontSize: px(15) }}>Neck to Tail Length:</div>
              <div className="input flex" style={{ height: px(30), borderRadius: px(40) }}>
                <input type="text"
                  style={{ borderRadius: px(40), fontSize: px(17), paddingRight: px(20) }}
                  ref={(input) => { this.input3 = input }}
                  value={torsoLength}
                  onChange={(val) => {
                    let data = num(val)
                    this.setState({
                      torsoLength: data
                    })


                  }}
                  onFocus={() => {
                    this.setState({
                      itemIndex: 3
                    })
                  }}
                />
                <div className="unit" style={{ right: px(8), fontSize: px(17) }}>{rulerUnit}</div>
              </div>
            </div>

            <div className="item flex">
              <div className="textTitle" style={{ fontSize: px(15) }}>Neck:</div>
              <div className="input flex" style={{ height: px(30), borderRadius: px(40) }}>
                <input type="text"
                  style={{ borderRadius: px(40), fontSize: px(17), paddingRight: px(20) }}
                  ref={(input) => { this.input4 = input }}
                  value={neckCircumference}
                  onChange={(val) => {
                    let data = num(val)
                    this.setState({
                      neckCircumference: data
                    })


                  }}
                  onFocus={() => {
                    this.setState({
                      itemIndex: 4
                    })
                  }}
                />
                <div className="unit" style={{ right: px(8), fontSize: px(17) }}>{rulerUnit}</div>
              </div>
            </div>
            <div className="item flex">
              <div className="textTitle" style={{ fontSize: px(15) }}>Upper Torso:</div>
              <div className="input flex" style={{ height: px(30), borderRadius: px(40) }}>
                <input type="text"
                  style={{ borderRadius: px(40), fontSize: px(17), paddingRight: px(20) }}
                  value={upperTorsoCircumference}
                  ref={(input1) => { this.input5 = input1 }}
                  onChange={(val) => {
                    let data = num(val)
                    this.setState({
                      upperTorsoCircumference: data
                    })


                  }}
                  onFocus={() => {
                    this.setState({
                      itemIndex: 5
                    })
                  }}
                />
                <div className="unit" style={{ right: px(8), fontSize: px(17) }}>{rulerUnit}</div>
              </div>
            </div>
            <div className="item flex">
              <div className="textTitle" style={{ fontSize: px(15) }}>Lower Torso:</div>
              <div className="input flex" style={{ height: px(30), borderRadius: px(40) }}>
                <input type="text"
                  style={{ borderRadius: px(40), fontSize: px(17), paddingRight: px(20) }}
                  value={`${lowerTorsoCircumference}`}
                  ref={(input) => { this.input6 = input }}
                  onChange={(val) => {
                    let data = num(val)
                    this.setState({
                      lowerTorsoCircumference: data
                    })
                  }}
                  onFocus={() => {
                    this.setState({
                      itemIndex: 6
                    })
                  }}
                />
                <div className="unit" style={{ right: px(8), fontSize: px(17) }}>{rulerUnit}</div>
              </div>
            </div>


          </div>

          <div className="careacterR flex">
            <div className="imgBox flex" style={{ borderRadius: px(20) }}>
              <img src={species} alt="" style={{ width: '80%' }} />
            </div>
          </div>

          <MyModal
            visible={updatePetAttributes}
            text={'Uploading pet information to database'}
          />
        </div >
      )

    }





  }
  //更新宠物的属性值，比如头尾、上躯干周长等
  _updatePetAttributes = () => {
    let { l2rarmDistance, lowerTorsoCircumference, upperTorsoCircumference, neckCircumference, rulerUnit, petId, h2tLength, torsoLength } = this.state


    l2rarmDistance = newNum(l2rarmDistance)
    lowerTorsoCircumference = newNum(lowerTorsoCircumference)
    upperTorsoCircumference = newNum(upperTorsoCircumference)
    neckCircumference = newNum(neckCircumference)
    h2tLength = newNum(h2tLength)
    torsoLength = newNum(torsoLength)

    function newNum(val) {
      if (val) {
        if (rulerUnit === 'in') {
          return parseFloat((parseFloat(val) * 2.54).toFixed(1))

        } else {
          return parseFloat(val)
        }

      } else {
        return ''
      }


    }

    let prams = {
      l2rarmDistance: l2rarmDistance || null,
      lowerTorsoCircumference: lowerTorsoCircumference || null,
      upperTorsoCircumference: upperTorsoCircumference || null,
      neckCircumference: neckCircumference || null,
      h2tLength: h2tLength || null,
      torsoLength: torsoLength || null,
    }
    this.setState({
      updatePetAttributes: true
    })
    let url = `/pet/updatePetInfo/${storage.userId}/${this.state.petId}`
    console.log('入参:', prams);
    fetchRequest(url, 'POST', prams)
      .then(res => {
        console.log(res);
        this.setState({
          updatePetAttributes: false,
          itemIndex: 1
        })
        this.input1.focus();

        if (res.flag) {
          message.success('Uploaded successfully')
        } else {
          message.error('upload failed')
        }
      })
      .catch(err => {
        this.setState({
          updatePetAttributes: false
        })
        message.error('update failed')
        console.log(err);
      })
  }
  _history = () => {
    const _del = (key, record) => {
      console.log('删除', key, record);
      /**------------这里还要删除后台的数据------------ */
      fetchRequest(`/pet/deletePetExamByExamId/${key}`, 'DELETE')
        .then(res => {
          if (res.flag === true) {
            console.log('删除成功');
            const historyData = [...this.state.historyData];
            console.log(historyData);
            this.setState({
              historyData: historyData.filter((item) => item.historyId !== key)
            });
          } else {
            console.log('删除失败');
          }
        })
    }
    const _edit = (key, record) => {
      console.log('编辑', key, record);
      this.setState({
        visible: true,
        editId: key,
        memo: record.note
      })



    }

    let { historyData, devicesType } = this.state
    let listData = [], columns = []
    switch (devicesType) {
      case 'biggie':
        for (let i = 0; i < historyData.length; i++) {
          const element = historyData[i];
          if (element.weight) {
            listData.push(element)
          }

        }

        columns = [
          {
            title: '',
            dataIndex: 'operation',
            key: 'operation',
            width: '15%',
            render: (text, record, index) => {
              // console.log('狩猎:', text, record, index);
              //record:
              return (
                <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-around', padding: `${px(18)}px 0` }}>
                  <Popconfirm title="Sure to delete?" onConfirm={() => _del(record.historyId, record)}>
                    <img src={del} alt="" style={{ width: px(25) }} />
                  </Popconfirm>
                  <img src={edit} alt="" style={{ width: px(25) }}
                    onClick={() => _edit(record.historyId, record)}
                  />
                </div>
              )

            }
          },
          {
            title: 'Date',
            dataIndex: 'date',
            key: 'date',
            width: '17%',
            render: (text, record, index) => {

              return (
                <p style={{ textAlign: 'center' }}>{text}</p>
              )

            }
          },
          {
            title: 'Time',
            dataIndex: 'time',
            key: 'time',
            width: '17%',
            render: (text, record, index) => {

              return (
                <p style={{ textAlign: 'center' }}>{text}</p>
              )

            }
          },
          {
            title: `Weight`,
            key: 'weight',
            dataIndex: 'weight',
            width: '13%',
            render: (text, record, index) => {


              let bag = '#58BDE6', tem = ''

              if (this.state.units === '℃') {
                if (text) {
                  tem = `${text.toFixed(1)}kgs`
                }
              } else {

                tem = `${(text * 2.2046).toFixed(1)}lbs`

              }
              return (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>

                  <p style={{ margin: 0, padding: 0, color: bag }}>{tem}</p>
                </div>
              )

            }
          },
          {
            title: 'BF%',
            dataIndex: 'fat',
            key: 'fat',
            align: 'center',
            width: '11%',
            render: (text, record, index) => {

              return (
                <p style={{ textAlign: 'center', color: '#58BDE6' }}>{text}</p>
              )

            }
          },
          {
            title: 'BCS',
            dataIndex: 'bodyConditionScore',
            key: 'bodyConditionScore',
            align: 'center',
            width: '18%',
            render: (text, record, index) => {

              return (
                <p style={{ textAlign: 'center', color: '#58BDE6' }}>{text}</p>
              )

            }
          },
          {
            title: 'Note',
            dataIndex: 'note',
            key: 'note',
            width: '11%',
            render: (text, record, index) => {

              return (
                <p style={{ width: '70px' }}>{text}</p>
              )

            }
          },
        ];


        break;
      case 'mella':
        for (let i = 0; i < historyData.length; i++) {
          const element = historyData[i];
          if (element.temp) {
            listData.push(element)
          }

        }
        columns = [
          {
            title: '',
            dataIndex: 'operation',
            key: 'operation',
            width: '15%',
            render: (text, record, index) => {
              // console.log('狩猎:', text, record, index);
              //record:
              return (
                <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-around', padding: `${px(18)}px 0` }}>
                  <Popconfirm title="Sure to delete?" onConfirm={() => _del(record.historyId, record)}>
                    <img src={del} alt="" style={{ width: px(25) }} />
                  </Popconfirm>
                  <img src={edit} alt="" style={{ width: px(25) }}
                    onClick={() => _edit(record.historyId, record)}
                  />
                </div>
              )

            }
          },
          {
            title: 'Date',
            dataIndex: 'date',
            key: 'date',
            width: '17%',
            render: (text, record, index) => {

              return (
                <p style={{ textAlign: 'center' }}>{text}</p>
              )

            }
          },
          {
            title: 'Time',
            dataIndex: 'time',
            key: 'time',
            width: '17%',
            render: (text, record, index) => {

              return (
                <p style={{ textAlign: 'center' }}>{text}</p>
              )

            }
          },
          {
            title: `Temp(${this.state.units})`,
            key: 'temp',
            dataIndex: 'temp',
            width: '17%',
            render: (text, record, index) => {
              // console.log(text, record);


              /**
              * bag：温度数值前的圆圈的背景颜色
              * tem：展示的温度
              * endvalue:将从后台得到的数据全部转化成华氏度
              * min：猫的正常体温的左区间,单位℉，后期要做的猫狗都行，这需要告诉我此宠物是猫还是狗
              * max：猫的正常体温的右区间,单位℉，后期要做的猫狗都行，这需要告诉我此宠物是猫还是狗
              *
              */

              let bag = '', tem = ''

              let endValue = text > 55 ? text : parseInt((text * 1.8 + 32) * 10) / 10
              let min = 99.5, max = 102.2
              //99.5 = 37.5   102.2=39








              if (endValue > max) {
                bag = '#E1206D'
              } else if (endValue < min) {
                bag = '#98DA86'
              } else {
                bag = '#58BDE6'
              }



              if (this.state.units === '℃') {
                if (text) {
                  tem = `${text.toFixed(1)}${this.state.units}`
                }
              } else {
                if (text) {
                  if (text > 55) {
                    tem = `${text}${this.state.units}`
                  } else {
                    tem = `${parseInt((text * 1.8 + 32) * 10) / 10}${this.state.units}`
                  }

                }
              }
              return (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {tem ? <div style={{ width: '8px', height: '8px', borderRadius: '8px', backgroundColor: bag, marginRight: '3px' }} /> : null}
                  <p style={{ margin: 0, padding: 0 }}>{tem}</p>
                </div>
              )

            }
          },
          {
            title: 'Placement',
            dataIndex: 'placement',
            key: 'placement',
            align: 'center',
            width: '18%',
            render: (text, record, index) => {
              // console.log(text, record, index);
              /**
               * old:   1:腋温  2：肛温 3：耳温
               * new:   1.腋温  2：大腿温度 3.肛温  4：耳温
               */
              switch (record.placement) {
                case 0: return (    //腋温
                  <div>
                    <img src={placement_er} alt="" />
                  </div>
                )
                case 1: return (    //腋温
                  <div>
                    <img src={palcement_ye} alt="" />
                  </div>
                )
                case 3: return (     //肛温
                  <div>
                    <img src={placement_gang} alt="" />
                  </div>
                )
                case 2: return (     //肛温
                  <div>
                    <img src={placement_gang} alt="" />
                  </div>
                )
                case 4: return (    //耳温
                  <div>
                    <img src={placement_er} alt="" />
                  </div>
                )
                default: break;
              }
              return (
                <p style={{ textAlign: 'center' }}>{text}</p>
              )

            }
          },
          {
            title: 'Note',
            dataIndex: 'note',
            key: 'note',
            width: '16%',
            render: (text, record, index) => {

              return (
                <p style={{ width: '100%', textAlign: 'left', }}>{text}</p>
              )

            }
          },
        ];


        break;

      default:
        break;
    }





    const pas = window.screen.height < 1000 ? 2 : 3

    let hisHe = mTop(200)
    try {
      let historyElement = document.querySelectorAll('#clinicalMeasure .historyTable')
      hisHe = historyElement[0].clientHeight - mTop(100)
    } catch (error) {

    }


    return (
      <div className='historyTable' style={{ height: '85%' }}>
        <Table
          loading={this.state.loading}
          columns={columns}
          dataSource={listData}
          rowKey={columns => columns.historyId}
          pagination={false}
          scroll={{
            y: hisHe
          }}
        />
      </div>
    )
  }

  _ciral = () => {

    let num = px(280)
    let windowWidth = document.documentElement.clientHeight
    if (windowWidth) {
      num = windowWidth * 0.30
    }
    return (
      <div className="crial" style={{ marginTop: mTop(50), }}>
        {!this.state.isconnected && <div className="bb1"
          style={{ top: mTop(-40) }}
        >
          <div className="btn5"
            style={{ width: px(230), height: mTop(30), fontSize: px(16), }}
            onClick={() => {
              console.log('点击了切换按钮');

              if (isClick === true) {
                isClick = false
                console.log('发送给主进程切换按钮');
                ipcRenderer.send('qiehuan')
                // ipcRenderer.send('getSerialPort')
                const time = setTimeout(() => {
                  isClick = true
                  clearTimeout(time)
                }, 2500)
              }
            }}
          >Re-sync Base</div>
        </div>}
        <div className='flex' >
          <Progress

            type="dashboard"

            strokeColor={{
              "100%": "#108ee9",
              "30%": "#87d068"
            }}
            format={() => ``}
            percent={this.state.progress}
            gapDegree={30}
            width={num}
            strokeWidth={10}
            success={{ strokeColor: 'red' }}

          />
          <div className="crialtext"
          // style={{ height: mTop(50), top: mTop(135) }}
          >
            {this._crialText()}
          </div>
        </div>


        {this._btnEndTime()}
      </div>
    )
  }
  _save = () => {
    if (this.state.isWalkIn) {
      let { Temp, addpatient_description, addpatient_petName, addpatient_species } = this.state
      let petVitalId = null
      switch (this.state.petVitalTypeId) {
        case '01': petVitalId = 1; break;
        case '02': petVitalId = 3; break;
        case '03': petVitalId = 4; break;
        default: petVitalId = 1; break;
      }
      let datas = {

        temperature: parseFloat(Temp),  //测量温度
        doctorId: storage.userId,
        memo: this.state.notes,
        clinicalDataEntityList: [{
          data0: parseFloat(Temp),
          data1: parseFloat(Temp),
          data2: parseFloat(Temp),
        }],
        petVitalTypeId: petVitalId,
        petName: addpatient_petName,
        description: addpatient_description,
        speciesId: addpatient_species,

      }
      this.setState({
        isWeightSave: true
      })
      console.log('入参', datas);

      fetchRequest(`/clinical/addAllClinical`, 'POST', datas)
        .then(res => {
          if (res.flag === true) {

            let hardSet = electronStore.get('hardwareConfiguration')
            let countdown = hardSet.is15 ? 15 : 30

            this.setState({
              initFlog: false,
              endMeasure: false,
              Temp: 0,
              progress: 0,
              countdown,
              isWeightSave: false
            })
            temp15 = 0
            message.success('Data successfully saved in Mella')

          } else {
            message.error('Save failed')
            this.setState({
              isWeightSave: false
            })
          }
        })
        .catch(err => {
          message.error('Save failed')
          this.setState({
            isWeightSave: false
          })
        })


      return
    }
    console.log(storage.vetspireOrEzyvet);
    if (storage.identity === '2') {
      let parames = {
        consult_id: this.state.consult_id,
        temperature: this.state.Temp
      }
      if (this.state.macAddr) {
        parames.macAddr = this.state.macAddr
      }
      console.log(parames, storage.ezyVetToken);
      //petVitalId是宠物测量部位
      let petVitalId = null
      switch (this.state.petVitalTypeId) {
        case '01': petVitalId = 1; break;
        case '02': petVitalId = 3; break;
        case '03': petVitalId = 4; break;
        default: petVitalId = 1; break;
      }
      console.log('ezy请求地址：', `/EzyVet/healthstatus/${this.state.healthStatus}/${this.state.probeID}/${this.state.petVitalTypeId}/${petVitalId}`);
      fetchToken(`/EzyVet/healthstatus/${this.state.healthStatus}/${petVitalId}`, 'PATCH', parames, `Bearer ${storage.ezyVetToken}`)
        .then(res => {
          console.log(res);
          if (res.msg === 'success') {
            console.log('成功');
            message.success('Saved successfully')
            let hardSet = electronStore.get('hardwareConfiguration')
            let countdown = hardSet.is15 ? 15 : 30
            this.setState({
              initFlog: false,
              endMeasure: false,
              Temp: 0,
              progress: 0,
              countdown,
            })
            temp15 = 0
            this._getHistory()

          }
        })
        .catch(err => {
          console.log(err);
        })
      return
    } else if (storage.identity === '1') {
      //这是vetspire的保存测量记录
      let parames = {
        APIkey: storage.API,
        vitalId: storage.selectExamId,
        temp: parseInt((this.state.Temp * 1.8 + 32) * 10) / 10


      }

      console.log('------------------', parames);

      fetchRequest1('/VetSpire/updateVitalsTemperatureByVitalId', 'POST', parames)
        .then(res => {
          console.log(res);
          if (res.flag === true) {
            if (res.data.updateVitals !== null) {
              message.success('Saved successfully')
            } else {
              message.error('Save failed')
            }
            let sendData = {
              petId: this.state.petId,
              temperature: this.state.Temp,
              memo: this.state.notes,
              petVitalTypeId: this.state.petVitalTypeId
            }
            console.log('send', sendData);
            fetchRequest('/pet/savePetExam', 'POST', sendData)
              .then(res => {
                console.log(res);
                if (res.flag === true) {
                  let hardSet = electronStore.get('hardwareConfiguration')
                  let countdown = hardSet.is15 ? 15 : 30
                  this.setState({
                    initFlog: false,
                    endMeasure: false,
                    Temp: 0,
                    progress: 0,
                    countdown,
                  })
                  temp15 = 0
                  this._getHistory()
                }
              })
              .catch(err => {
                console.log(err);
              })
          } else {
            message.error('Save failed')
          }
        })
        .catch(err => {
          console.log(err);
        })
    } else {

      //现在Rhapsody组织数据还没有集成到后台，因此这里就先做临时处理
      if (storage.lastOrganization === '34') {
        console.log(this.state.patientId, this.state.petId);
        let params = { query: `query { patient (id:"${this.state.patientId}") {  vitals { data{ id, weight{value}, temperature{value}, createdAt, updatedAt}}}}` }

        this.setState({
          isWeightSave: true
        })
        fetchRhapsody('', 'POST', params, storage.connectionKey)
          .then(res => {
            console.log('---', res);


            if (res.errors) {
              message.error('Failed to obtain case list')
              this.setState({
                isWeightSave: false
              })
            } else {
              let { vitals } = res.data.patient
              let vitalArr = vitals.data
              if (vitalArr.length > 0) {
                vitalArr.sort((a, b) => {
                  return moment(parseInt(a.createdAt) * 1000).format('YYYY-MM-DD HH:mm') > moment(parseInt(b.createdAt) * 1000).format('YYYY-MM-DD HH:mm') ? -1 : 1
                })
                let temperature = parseInt((this.state.Temp * 1.8 + 32) * 10) / 10

                let params = {}
                if (vitalArr[0].weight && vitalArr[0].weight.value) {
                  params = {
                    query: `mutation {
                      updateVital(
                          id:"${vitalArr[0].id}"
                          input:{
                            weight:{value:${vitalArr[0].weight.value}}
                              temperature:{value:${temperature}}
                              patientId:"${this.state.patientId}"
                          }
                      )
                      {
                          id,
                          weight{value},
                          temperature{value}
                      }
                  }`}
                } else {
                  params = {
                    query: `mutation {
                      updateVital(
                          id:"${vitalArr[0].id}"
                          input:{
                              temperature:{value:${temperature}}
                              patientId:"${this.state.patientId}"
                          }
                      )
                      {
                          id,
                          weight{value},
                          temperature{value}
                      }
                  }`}

                }






                console.log('---入参---', { patientID: this.state.patientId, vitalId: vitalArr[0].id, temperature });

                fetchRhapsody('', 'POST', params, storage.connectionKey)
                  .then(res => {
                    console.log(res);
                    if (res.errors) {
                      message.error('Data saving failed')
                      this.setState({
                        isWeightSave: false
                      })
                    } else {
                      let hardSet = electronStore.get('hardwareConfiguration')
                      let countdown = hardSet.is15 ? 15 : 30
                      this.setState({
                        initFlog: false,
                        endMeasure: false,
                        Temp: 0,
                        progress: 0,
                        countdown,
                        isWeightSave: false
                      })
                      message.success('Data saved successfully')
                    }


                  })
                  .catch(err => {
                    message.error('Data saving failed')
                    this.setState({
                      isWeightSave: false
                    })
                    console.log(err);
                  })

              } else {
                this.setState({
                  isWeightSave: false
                })
                message.error('There is no case sheet for this pet')
              }
            }
          })
          .catch(err => {
            this.setState({
              isWeightSave: false
            })
            message.error('Failed to obtain case list')
            console.log(err);
          })
        return
      }




      console.log('我是普通医生，不带集成的');
      let petVitalId = null
      switch (this.state.petVitalTypeId) {
        case '01': petVitalId = 1; break;
        case '02': petVitalId = 3; break;
        case '03': petVitalId = 4; break;
        default: petVitalId = 1; break;
      }
      let params = {
        petId: this.state.petId,
        doctorId: storage.userId,
        temperature: this.state.Temp,
        petVitalTypeId: petVitalId,
        memo: this.state.notes
      }
      this.setState({
        isWeightSave: true
      })






      fetchRequest('/exam/addClamantPetExam', 'POST', params)
        .then(res => {
          console.log('res', res);
          if (res.flag === true) {

            let hardSet = electronStore.get('hardwareConfiguration')
            let countdown = hardSet.is15 ? 15 : 30

            let copyTemp = this.state.Temp
            this.setState({
              initFlog: false,
              endMeasure: false,
              Temp: 0,
              progress: 0,
              countdown,
            })
            temp15 = 0
            switch (storage.lastOrganization) {
              case '3'://vetspire
                this.updataVetspire(copyTemp)

                break;

              case '4'://ezyVet
                this.updataEzyvet(copyTemp)
                break;

              default: message.success('Data successfully saved in Mella')
                this.setState({
                  isWeightSave: false
                })
                break;
            }
            this._getHistory()
          } else {
            message.error('Save failed')
            this.setState({
              isWeightSave: false
            })
          }
        })
        .catch(err => {
          console.log(err);
          message.error('Save failed')
          this.setState({
            isWeightSave: false
          })
        })
    }
  }

  updataEzyvet = (Temp) => {
    let { patientId } = this.state

    let params = {
      id: patientId
    }
    // this.setState({
    //   isWeightSave: false
    // })
    console.log('入参:', params, storage.connectionKey);

    fetchRequest4('/EzyVet/ezyvetGetPetLatestExam', "GET", params, `Bearer ${storage.connectionKey}`)
      .then(res => {
        console.log('宠物最新病历单获取:', res);
        if (res.flag && res.data && res.data.items.length > 0) {
          let data = res.data.items[0]
          let { consult_id } = data
          if (!consult_id) {
            console.log('最新病历单获取失败');
            this.setState({
              isWeightSave: false
            })
            message.error('Failed to obtain the latest medical record, the data is saved in Mella')
            return
          }
          let paramId = data.id
          let temperature = Temp
          // if (this.state.units === '℉') {
          //   temperature = ((Temp - 32) / 1.8).toFixed(1)
          // } else {
          //   temperature = Temp
          // }
          let parames1 = {
            consult_id,
            temperature
          }
          let petVitalId = null
          switch (this.state.petVitalTypeId) {
            case '01': petVitalId = 1; break;
            case '02': petVitalId = 3; break;
            case '03': petVitalId = 4; break;
            default: petVitalId = 1; break;
          }
          console.log('入参', parames1, storage.connectionKey);
          fetchRequest2(`/EzyVet/healthstatus/${paramId}/${petVitalId}`, "PATCH", parames1, `Bearer ${storage.connectionKey}`)
            .then(res => {
              console.log('更新ezyvet的体重', res);
              this.setState({
                isWeightSave: false
              })
              if (res.flag) {
                console.log('更新ezyvet的体重成功');
                message.success('Data successfully saved in EzyVet')

                //Toast.success('Temperature update successful')
              } else {
                //Toast.fail('Temperature update failed')
                console.log('更新ezyvet的体重失败');
                message.error('Data failed saved in EzyVet')
              }
            })
            .catch(err => {
              this.setState({
                isWeightSave: false
              })
              //Toast.fail('Temperature update failed')
              console.log('更新ezyvet的体重', err);
              message.error('Data failed saved in EzyVet')
            })
        } else {
          this.setState({
            isWeightSave: false
          })
          //Toast.fail('Temperature update failed')
          message.error('Failed to obtain the latest medical record, the data is saved in Mella')
        }
      })
      .catch(err => {
        this.setState({
          isWeightSave: false
        })
        console.log('宠物最新病历单获取', err);
        message.error('Failed to obtain the latest medical record, the data is saved in Mella')

        //Toast.fail('Temperature update failed')
      })


  }
  updataVetspire = (Temp) => {
    let datas = {
      APIkey: storage.connectionKey,
      patientId: this.state.patientId
    }
    console.log('更新vetspire的数值', datas);
    fetchRequest4('/VetSpire/vetspireGetPetLatestExam', "POST", datas)
      .then(res => {
        console.log(res);
        if (res.flag) {
          let data = res.data.encounters[0].vitals
          let encountersId = data.id

          let temperature = parseInt((Temp * 1.8 + 32) * 10) / 10
          // if (this.state.units === '℉') {
          //   temperature = Temp
          // } else {
          //   temperature = (Temp * 1.8 + 32).toFixed(1)
          // }
          let params = {
            vitalId: encountersId,
            APIkey: storage.connectionKey,
            temp: temperature
          }
          console.log('写数据到vetspire', params);
          fetchRequest2(`/VetSpire/updateVitalsTemperatureByVitalId`, "POST", params)
            .then(res => {
              this.setState({
                isWeightSave: false
              })

              console.log('写数据到vetspire', res);
              if (res.flag) {
                console.log('vetspire写成功');
                message.success('Data successfully saved in Vetspire')
              } else {
                message.error('Data failed saved in Vetspire')
              }
            })
            .catch(err => {
              this.setState({
                isWeightSave: false
              })

              console.log('vetspire写失败', err);
              message.error('Data failed saved in Vetspire')
              //Toast.fail('Temperature update failed')
            })
        } else {
          console.log('最新病历单获取失败');
          this.setState({
            isWeightSave: false
          })
          message.error('Failed to obtain the latest medical record, the data is saved in Mella')

          //Toast.fail('Temperature update failed')
        }
      })
      .catch(err => {
        this.setState({
          isWeightSave: false
        })


        console.log('最新病历单获取失败', err);
        message.error('Failed to obtain the latest medical record, the data is saved in Mella')
      })

  }


  _btnEndTime = () => {
    let { endMeasure, isconnected, initFlog } = this.state
    if (initFlog === false) {
      return
    }

    if (endMeasure === true) {
      // if (isconnected === true) {
      return (
        <>
          <div className="btn"
            style={{ marginTop: mTop(30) }}
          >
            <div className="btn1"
              style={{ width: px(120), height: mTop(35) }}
              onClick={() => {
                console.log('点击了Discard');
                let hardSet = electronStore.get('hardwareConfiguration') || {}
                let countdown = hardSet.is15 ? 15 : 30
                this.setState({
                  endMeasure: false,
                  Temp: 0,
                  progress: 0,
                  countdown,
                  initFlog: false
                })
                temp15 = 0
              }}
            >
              Discard
            </div>

            <div className="btn1"
              style={{ width: px(120), height: mTop(35) }}
              onClick={() => {
                this.timer && clearTimeout(this.timer)
                this.timer = setTimeout(() => {
                  this._save()
                  clearTimeout(this.timer)
                }, 500);
              }}>
              Save
            </div>
          </div>
          {isconnected === true ? null : <p style={{ fontSize: px(30), color: '#3B3A3A', marginTop: mTop(10) }}> disconnected</p>}
        </>
      )
    } else {
      if (isconnected === true) {
        if (this.state.isEarMeasure) {
          return
        }
        return (
          <div className="time"
            style={{ fontSize: px(32), marginTop: mTop(35) }}
          >
            <p>{`Measuring time  ${this.state.countdown}  s`}</p>
          </div>
        )
      } else {
        return (
          null
        )
      }
    }
  }
  _crialText = () => {
    let { endMeasure, isMeasure, isconnected, Temp } = this.state
    Temp = parseFloat(Temp)

    let temp = this.state.units === '℉' ? parseInt((Temp * 1.8 + 32) * 10) / 10 : Temp.toFixed(1)
    let text = '', temColor = ''
    if (Temp > 15) {
      if (Temp > 39) {
        text = 'High'
        temColor = '#E1206D'
      } else if (Temp < 31) {
        text = 'Low'
        temColor = '#47C2ED'

      } else {
        text = 'Normal'
        temColor = '#78D35D'
      }
    }
    if (endMeasure === true) {
      if (`${Temp}` === 'NaN' || `${Temp}` === '0') {
        if (isconnected === true) {

          return (
            <p style={{ fontSize: px(30), color: '#3B3A3A' }}>connected</p>
          )
        }
        else {
          return (
            <p style={{ fontSize: px(30), color: '#3B3A3A' }}>disconnected</p>
          )
        }
      } else {


        return (
          <div style={{ color: temColor }}>
            <span >{temp} <sup style={{ fontSize: px(18) }}>{this.state.units}</sup></span>
            <span style={{ fontSize: px(22) }}>{text}</span>
          </div>
        )
      }
    } else {
      if (isMeasure === true) {
        return (
          <>
            <span style={{ fontSize: px(36), color: temColor, display: 'flex', alignItems: 'center' }}>
              {temp} <sup style={{ fontSize: px(18) }}>{this.state.units}</sup></span>
          </>
        )
      } else {
        if (this.state.isEarMeasure) {
          return (
            <p style={{ fontSize: px(30), color: '#3B3A3A' }}>measuring</p>
          )
        } else {
          if (isconnected === true) {

            return (
              <p style={{ fontSize: px(30), color: '#3B3A3A' }}>connected</p>
            )
          }
          else {
            return (
              <p style={{ fontSize: px(30), color: '#3B3A3A' }}>disconnected</p>
            )
          }
        }

      }
    }

  }

  handleCancel = (e) => {
    console.log(e);
    this.setState({
      visible: false,
      emerPatientID: ''
    });
  };
  _modal = () => {
    let that = this

    function save() {
      let datas = {
        memo: that.state.memo
      }

      console.log('入参：', datas, that.state.editId);
      fetchRequest(`/pet/updatePetExam/${that.state.editId}`, 'POST', datas)
        .then(res => {
          console.log(res);
          that.setState({
            visible: false,
          })
          that._getHistory()

        })
        .catch(err => {
          that.setState({
            spin: false
          })
          console.log(err);
        })

    }


    let { disabled, bounds, visible } = this.state
    return (
      <Modal
        title={
          <div
            style={{
              width: '100%',
              cursor: 'move',
              height: '20px',
              textAlign: 'center'
            }}
            onMouseOver={() => {
              if (disabled) {
                this.setState({
                  disabled: false,
                });
              }
            }}
            onMouseOut={() => {
              this.setState({
                disabled: true,
              });
            }}

            onFocus={() => { }}
            onBlur={() => { }}
          // end
          >
            Edit Note
          </div>
        }
        visible={visible}
        // visible={true}
        onCancel={this.handleCancel}
        modalRender={(modal) => (
          <Draggable
            disabled={disabled}
            bounds={bounds}
            onStart={(event, uiData) => this.onStart(event, uiData)}
          >
            <div ref={this.draggleRef}>{modal}</div>
          </Draggable>
        )}
        footer={
          [] // 设置footer为空，去掉 取消 确定默认按钮
        }
        destroyOnClose={true}
      >
        <div id="selectEmergenciesModal">
          <div className="selectEmergenciesModal">
            <p style={{ width: '80px' }}>Notes</p>
            {/* <Input
              style={{ border: 'none', outline: 'medium' }}
              bordered={false}
              onChange={(item) => {
              }}

            /> */}
            <textarea
              rows="5"
              cols="40"
              style={{ textIndent: '10px' }}
              value={that.state.memo}
              onChange={(val) => {
                that.setState({
                  memo: val.target.value
                })
              }}

            >
            </textarea>
          </div>
          <div className="btn" style={{ width: '60%' }} onClick={save}>Save Changes</div>
        </div>

      </Modal>

    )

  }

  biggie = () => {
    let { isHaveBigieDate, biggieDate, sendWeight, impedance, units } = this.state
    if (isHaveBigieDate) {
      let bodyFat = impedance ? 20 : null
      let score = impedance ? 5 : null

      let isIbs = units === '℃' ? false : true
      let weight = units === '℃' ? sendWeight : biggieDate

      let issave = storage.connectionKey ? false : true
      return (
        <Biggie
          issave={issave}
          weight={`${weight}`}
          onPress={this._saveWeight}
          bodyFat={bodyFat}
          score={score}
          impedance={impedance}
          isIbs={isIbs}
          discardOnPress={() => {
            this.setState({
              isHaveBigieDate: false
            })
            keyboardBiggieFlog = false
            sameBiggieNum = 0
          }}
        />
      )
    } else {
      return (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%' }}>
          <h1 style={{ fontWeight: 'bold', width: '80%', textAlign: 'center', }}>Ready, place pet onto scale</h1>
        </div>

      )
    }



  }

  _saveWeight = () => {
    console.log('开始去保存了', storage.lastOrganization, storage.connectionKey);


    //现在Rhapsody组织数据还没有集成到后台，因此这里就先做临时处理
    if (storage.lastOrganization === '34') {
      let params = { query: `query { patient (id:"${this.state.patientId}") {  vitals { data{ id, weight{value}, temperature{value}, createdAt, updatedAt}}}}` }

      this.setState({
        isWeightSave: true
      })

      fetchRhapsody('', 'POST', params, storage.connectionKey)
        .then(res => {
          console.log('---', res);
          if (res.errors) {
            message.error('Failed to obtain case list')
            this.setState({
              isWeightSave: false
            })
          } else {
            let { vitals } = res.data.patient
            let vitalArr = vitals.data
            if (vitalArr.length > 0) {
              vitalArr.sort((a, b) => {
                return moment(parseInt(a.createdAt) * 1000).format('YYYY-MM-DD HH:mm') > moment(parseInt(b.createdAt) * 1000).format('YYYY-MM-DD HH:mm') ? -1 : 1
              })

              console.log('-----', vitalArr);


              let params = {}
              if (vitalArr[0].temperature && vitalArr[0].temperature.value) {
                params = {
                  query: `mutation {
                      updateVital(
                          id:"${vitalArr[0].id}"
                          input:{
                            weight:{value:${this.state.biggieDate}}
                            temperature:{value:${vitalArr[0].temperature.value}}
                              patientId:"${this.state.patientId}"
                          }
                      )
                      {
                          id,
                          weight{value},
                          temperature{value}
                      }
                  }`}
              } else {
                params = {
                  query: `mutation {
                      updateVital(
                          id:"${vitalArr[0].id}"
                          input:{
                            weight:{value:${this.state.biggieDate}}

                              patientId:"${this.state.patientId}"
                          }
                      )
                      {
                          id,
                          weight{value},
                          temperature{value}
                      }
                  }`}
              }

              console.log('---入参---', params);



              fetchRhapsody('', 'POST', params, storage.connectionKey)
                .then(res => {
                  console.log(res);
                  if (res.errors) {
                    this.setState({
                      isWeightSave: false
                    })
                    message.error('Data saving failed')
                  } else {
                    this.setState({
                      isHaveBigieDate: false,
                      isWeightSave: false
                    })
                    keyboardBiggieFlog = false
                    sameBiggieNum = 0
                    message.success('Data saved successfully')
                  }


                })
                .catch(err => {
                  this.setState({
                    isWeightSave: false
                  })
                  message.error('Data saving failed')
                  console.log(err);
                })


            } else {
              this.setState({
                isWeightSave: false
              })
              message.error('There is no case sheet for this pet')
            }








          }
        })
        .catch(err => {
          message.error('Failed to obtain case list')
          this.setState({
            isWeightSave: false
          })
          console.log(err);
        })








      return
    }










    this.setState({
      isWeightSave: true
    })
    let fat = this.state.impedance ? 20 : null
    let bodyConditionScore = this.state.impedance ? 5 : null

    let params = {
      petId: this.state.petId,
      doctorId: storage.userId,
      weight: this.state.sendWeight,
      memo: this.state.notes,
      fat,
      bodyConditionScore
    }
    console.log('---体重保存入参--：', params);
    fetchRequest('/exam/addClamantPetExam', 'POST', params)
      .then(res => {
        console.log('res', res);
        if (res.flag === true) {
          switch (storage.lastOrganization) {
            case '3'://vetspire
              this.updataWeightVetspire()

              break;

            case '4'://ezyVet
              this.updataWeightEzyvet()
              break;

            default:
              this.setState({
                isHaveBigieDate: false,
                isWeightSave: false
              })
              keyboardBiggieFlog = false
              sameBiggieNum = 0
              message.success('Data successfully saved in Mella')
              break;
          }

          this._getHistory()
        }
      })
      .catch(err => {
        console.log(err);
      })





  }

  updataWeightVetspire = () => {
    console.log('保存到vetspire');
    this.setState({
      isWeightSave: true
    })

    let datas = {
      APIkey: storage.connectionKey,
      patientId: this.state.patientId
    }
    console.log('更新vetspire的数值', datas);
    fetchRequest4('/VetSpire/vetspireGetPetLatestExam', "POST", datas)
      .then(res => {
        console.log(res);
        if (res.flag) {

          let data = res.data.encounters[0].vitals
          let encountersId = data.id

          let params = {
            vitalId: encountersId,
            APIkey: storage.connectionKey,
            weight: this.state.biggieDate
          }
          console.log('写数据到vetspire', params);
          fetchRequest4(`/VetSpire/vetspireUpdateWeight`, "POST", params)
            .then(res => {
              this.setState({
                isWeightSave: false
              })


              console.log('写数据到vetspire', res);
              if (res.flag) {
                console.log('vetspire写成功');
                this.setState({
                  isHaveBigieDate: false
                })
                keyboardBiggieFlog = false
                sameBiggieNum = 0
                message.success('Data successfully saved in Vetspire')
              } else {
                message.error('Data failed saved in Vetspire')
              }
            })
            .catch(err => {
              this.setState({
                isWeightSave: false
              })

              console.log('vetspire写失败', err);
              message.error('Data failed saved in Vetspire')
              //Toast.fail('Temperature update failed')
            })
        } else {
          console.log('最新病历单获取失败');
          message.error('Failed to obtain the latest medical record')

          // Toast.fail('Update failed')
          this.setState({
            isWeightSave: false
          })

        }
      })
      .catch(err => {

        console.log('最新病历单获取失败', err);
        message.error('Failed to obtain the latest medical record')
        this.setState({
          isWeightSave: false
        })
      })

  }
  updataWeightEzyvet = () => {
    console.log('保存到ezyVet');
    this.setState({
      isWeightSave: true
    })

    let { patientId } = this.state

    let params = {
      id: patientId
    }
    console.log('入参:', params, storage.connectionKey);

    fetchRequest4('/EzyVet/ezyvetGetPetLatestExam', "GET", params, `Bearer ${storage.connectionKey}`)
      .then(res => {
        console.log('宠物最新病历单获取:', res);
        if (res.flag && res.data && res.data.items.length > 0) {
          let data = res.data.items[0]
          let { consult_id } = data
          if (!consult_id) {
            console.log('最新病历单获取失败');
            message.error('Failed to obtain the latest medical record, the data is saved in Mella')
            return
          }
          let paramId = data.id
          let parames1 = {
            consult_id,
            weight: this.state.sendWeight
          }

          console.log('入参', parames1, storage.connectionKey);
          fetchRequest4(`/EzyVet/ezyvetUpdateWeight/${paramId}`, "PATCH", parames1, `Bearer ${storage.connectionKey}`)
            .then(res => {
              console.log('更新ezyvet的体重', res);
              this.setState({
                isWeightSave: false
              })

              if (res.flag) {
                console.log('更新ezyvet的体重成功');
                message.success('Data successfully saved in EzyVet')
                this.setState({
                  isHaveBigieDate: false
                })
                keyboardBiggieFlog = false
                sameBiggieNum = 0
                //Toast.success('Temperature update successful')
              } else {
                //Toast.fail('Temperature update failed')
                console.log('更新ezyvet的体重失败');
                message.error('Data failed saved in EzyVet')
              }
            })
            .catch(err => {
              this.setState({
                isWeightSave: false
              })

              //Toast.fail('Temperature update failed')
              console.log('更新ezyvet的体重', err);
              message.error('Data failed saved in EzyVet')
            })
        } else {
          this.setState({
            isWeightSave: false
          })

          //Toast.fail('Temperature update failed')
          message.error('Failed to obtain the latest medical record')
        }
      })
      .catch(err => {
        console.log('宠物最新病历单获取', err);
        message.error('Failed to obtain the latest medical record')
        this.setState({
          isWeightSave: false
        })
        //Toast.fail('Temperature update failed')
      })


  }


  render() {
    const { closeColor, closebgc, minbgc, isWeightSave } = this.state
    // console.dir(this.input1)
    // try {
    //   console.log(this.input1.checked)
    // } catch (error) {

    // }

    return (
      <div id="clinicalMeasure">

        <div style={{ height: '60%', }}>
          <div className="heard">
            <Heard
              onSearch={(data) => {
                console.log('搜索到的宠物', data);
                let { l2rarmDistance, neckCircumference, upperTorsoCircumference, lowerTorsoCircumference,
                  h2tLength, torsoLength } = data

                l2rarmDistance = l2rarmDistance ? `${l2rarmDistance}` : ''
                neckCircumference = neckCircumference ? `${neckCircumference}` : ''
                upperTorsoCircumference = upperTorsoCircumference ? `${upperTorsoCircumference}` : ''
                lowerTorsoCircumference = lowerTorsoCircumference ? `${lowerTorsoCircumference}` : ''
                h2tLength = h2tLength ? `${h2tLength}` : ''
                torsoLength = torsoLength ? `${torsoLength}` : ''
                let weight = data.weight
                if (weight && weight !== 'unknown') {
                  weight = parseFloat(weight).toFixed(1)
                }
                let breedName = data.breed
                if (!breedName) {
                  breedName = 'unknown'
                }
                switch (breedName) {
                  case 'defaultdog':
                    breedName = 'Dog'

                    break;
                  case 'defaultother':
                    breedName = 'Other'

                    break;
                  case 'defaultcat':
                    breedName = 'Cat'
                    break;

                }
                console.log('-----------', weight);
                this.setState({
                  petName: data.petName,
                  owner: data.owner,
                  breedName,
                  weight,
                  age: data.age,
                  patientId: data.patientId,
                  petId: data.petId,
                  itemIndex: 1,
                  l2rarmDistance,
                  neckCircumference,
                  upperTorsoCircumference,
                  lowerTorsoCircumference,
                  h2tLength,
                  torsoLength,
                  isWalkIn: false
                }, () => {
                  this._getHistory()
                })

              }}
              menu8Click={() => {
                switch (storage.identity) {
                  case '2': this.props.history.push({ pathname: '/EzyVetSelectExam', listDate: storage.ezyVetList, defaultCurrent: storage.defaultCurrent })

                    break;
                  case '1': this.props.history.push('/VetSpireSelectExam')

                    break;
                  case '3': this.props.history.push({ pathname: '/uesr/selectExam', listDate: storage.doctorList, defaultCurrent: storage.defaultCurrent })

                    break;

                  default:
                    break;
                }
              }}
              onReturn={() => {
                this.props.history.goBack()
              }}

            />
          </div>



          {/* 宠物信息与圆环部分部分 */}
          <div className='clinical_top'
          // style={{ height: mTop(480) }}
          >
            {this._topLeft()}
            <div className="r"

            >
              {
                this.state.devicesType === 'mella' ?
                  this._ciral() :
                  this.biggie()
              }
            </div>
          </div>
        </div>



        {/* 底部宠物信息 */}
        {this._foot()}
        {this._modal()}
        {/* {this._table()} */}

        <Modal

          visible={this.state.err07Visible}
          // visible={true}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          width={330}
          closable={false}
          footer={[

          ]}
          destroyOnClose={true}
          wrapClassName="vetPrifileModal"
        >
          <div id='vetPrifileModal'>
            <div className="title">prompt
            </div>

            <div className='text'>Please re-plug the base device</div>


            <div className="btn" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '5px' }}>

              <button
                onClick={() => {
                  this.setState({
                    err07Visible: false,

                  })
                  num07 = 0
                }}
              >OK</button>


            </div>
          </div>

        </Modal>

        <Modal

          visible={this.state.err07Visible}
          // visible={true}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          width={330}
          closable={false}
          footer={[

          ]}
          destroyOnClose={true}
          wrapClassName="vetPrifileModal"
        >
          <div id='vetPrifileModal'>
            <div className="title">prompt
            </div>

            <div className='text'>Please re-plug the base device</div>


            <div className="btn" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '5px' }}>

              <button
                onClick={() => {
                  this.setState({
                    err07Visible: false,

                  })
                  num07 = 0
                }}
              >OK</button>


            </div>
          </div>

        </Modal>


        <MyModal
          visible={isWeightSave}
          element={
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
              <div className="loadIcon" style={{ marginBottom: px(5) }}>
                <LoadingOutlined style={{ fontSize: 30, color: '#fff', marginTop: mTop(-30), }} />
              </div>
              <p>
                Data is being saved
              </p>
            </div>
          }
        />

      </div>
    )
  }
}
