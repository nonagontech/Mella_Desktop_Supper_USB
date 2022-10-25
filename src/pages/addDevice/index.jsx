import React, { Component } from 'react'
import { message } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';

import MinClose from '../../utils/minClose/MinClose'
import MouseDiv from '../../utils/mouseDiv/MouseDiv'
import { mTop, px, MTop, } from '../../utils/px';
import electronStore from '../../utils/electronStore';

import back_white from '../../assets/img/back-white.png';
import back_hui from '../../assets/img/back-hui.png';
import redclose from '../../assets/img/redclose.png';

import './index.less';

let storage = window.localStorage;
let ipcRenderer = window.electron.ipcRenderer

let num07 = 0       //接收到07命令行的次数


export default class AddDevice extends Component {

  state = {
    noUSB: false,
    devicesList: [],
    selectDevice: null,
    // selectDevice: true,
    reName: '',
    saveDeviceMac: []  //这是已经保存过的设备的macid

  }

  componentDidMount() {
    message.destroy()

    ipcRenderer.send('small')
    // 监听分辨率是否改变
    ipcRenderer.on('changeFenBianLv', this.changeFenBianLv)
    //这里做了个监听，当有数据发过来的时候直接在这里接收
    ipcRenderer.on('sned', this._send)
    ipcRenderer.on('noUSB', this._noUSB)
    let devicesList = electronStore.get(`${storage.userId}-deviceList`)
    if (devicesList) {
      let saveDeviceMac = []
      for (let i = 0; i < devicesList.length; i++) {
        const element = devicesList[i];
        saveDeviceMac.push(element.macId)
      }
      this.setState({
        saveDeviceMac
      })
    }



    // const timer = setTimeout(() => {
    //   let deviceList = [
    //     // { name: 'Add Device', deviceType: 'add', macId: '0' },
    //     { name: 'malla001', deviceType: 'mellaHome', macId: '11:22:33:44:55:66' },
    //     { name: 'malla002', deviceType: 'mellaPro', macId: '11:22:33:44:55:66' },
    //     { name: 'malla003', deviceType: 'mellaHome', macId: '11:22:33:44:55:66' },
    //     { name: 'biggie00222222222222221', deviceType: 'biggie', macId: '11:22:33:44:55:66' },
    //     { name: 'malla001', deviceType: 'biggie', macId: '11:22:33:44:55:66' },
    //     { name: 'Charlie001', deviceType: 'rfid', macId: '11:22:33:44:55:66' },
    //   ]
    //   this.setState({
    //     devicesList: deviceList
    //   })
    //   clearTimeout(timer)
    // }, 500);

  }
  componentWillUnmount() {
    ipcRenderer.removeListener('sned', this._send)
    ipcRenderer.removeListener('noUSB', this._noUSB)
    ipcRenderer.removeListener('changeFenBianLv', this.changeFenBianLv)
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

        this.setState({
          noUSB: true
        })
      }
    }
  }

  _send = (event, data) => {
    //data就是测量的数据，是十进制的数字
    // console.log(data);
    this.command(data)()
  }
  // newArr 指的是十进制数字数组，   dataArr1:指的是16进制字符串数组
  command = (newArr) => {
    const instruction = [255]
    let dataArr1 = newArr.map(item => {
      if (item.toString(16).length < 2) {
        return '0' + item.toString(16)
      } else {
        return item.toString(16)
      }
    })
    // console.log(dataArr1);
    const commandArr = {
      255: () => {//蓝牙软尺广播的数据
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
        let macId = ''
        if (bluData.length > 7) {
          macId = this.getMac(bluName, bluData)
        }


        let sameFlog = this.state.devicesList.some((device, index) => {
          return device.macId === macId
        })
        if (sameFlog || !macId) {   //重复直接退出
          return
        }
        let deviceType = ''
        switch (bluName) {
          case 'Biggie':        //这是体脂称
            deviceType = 'biggie'

            break;
          case 'C19':        //这是体脂称
            deviceType = 'biggie'

            break;

          case 'MaeBowl':   //这是称量碗
            deviceType = 'maeBowl'
            break;

          case 'Mella Measure': //这是蓝牙尺
            deviceType = 'tape'
            break;

        }
        if (macId && deviceType && bluName) {
          let json = {
            name: bluName,
            deviceType,
            macId
          }
          let deviceArr = [].concat(this.state.devicesList)
          deviceArr.push(json)
          this.setState({
            devicesList: deviceArr
          })
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
  getMac = (bluName, bluData) => {
    switch (bluName) {
      case 'Biggie':
      case 'MaeBowl':
      case 'Mella Measure':
      case 'C19':
        let str = bluData[1]
        for (let i = 2; i < 7; i++) {
          str += `:${bluData[i]}`
        }
        return str


      default:
        break;
    }

  }



  changeFenBianLv = (e) => {
    ipcRenderer.send('small')
    this.setState({
    })
  }
  beforeDiv = () => {
    return (
      <img src={back_hui} alt="" style={{ width: px(15) }} />
    )
  }
  afterDiv = () => {
    return (
      <img src={back_white} alt="" style={{ width: px(15) }} />
    )

  }

  body = () => {
    let { noUSB, devicesList, selectDevice, reName } = this.state
    if (selectDevice) {
      return <div className="addDevice flex">
        <div className="addDeviceTop flex">
          <div className="title" style={{ fontSize: px(30), marginBottom: px(40) }}>Would you like to name<br />
            this Mella device?</div>

          <div className="input flex" style={{ marginBottom: px(60) }}>
            <input type="text" style={{ height: px(45) }}
              value={reName}
              onChange={(value) => {
                this.setState({
                  reName: value.target.value
                })
              }}
            />
          </div>
          <div className="text" style={{ fontSize: px(18) }}>* We recommend naming based
            on the Exam Room. Write the name
            on the sticker provided so it is easy
            to select your device in the future.</div>
        </div>
        <div className="addDeviceFoot flex">
          <div className="btn"
            onClick={() => {
              let { reName, selectDevice } = this.state
              console.log(reName, selectDevice);
              if (reName) {
                selectDevice.name = reName
              }
              let deviceList = electronStore.get(`${storage.userId}-deviceList`)
              console.log('---', deviceList);
              deviceList.push(selectDevice)
              electronStore.set(`${storage.userId}-deviceList`, deviceList)
              let { saveDeviceMac } = this.state
              saveDeviceMac.push(selectDevice.macId)
              this.setState({
                saveDeviceMac,
                selectDevice: null,
                reName: ''
              })

            }}
          >
            <p className='btnText'>Add Another</p>
          </div>
          <div className="btn"
            onClick={() => {
              let { reName, selectDevice } = this.state
              console.log(reName, selectDevice);
              if (reName) {
                selectDevice.name = reName
              }
              let deviceList = electronStore.get(`${storage.userId}-deviceList`)
              deviceList.push(selectDevice)
              electronStore.set(`${storage.userId}-deviceList`, deviceList)
              this.props.history.goBack()

            }}
          >
            <p className='btnText'>Finish</p>
          </div>
        </div>


      </div>
    } else {
      if (noUSB) {
        return <div className='flex' style={{ width: '100%', marginBottom: px(120), height: '50%', }}>
          <img src={redclose} alt="" style={{ width: px(80) }} />

          <p style={{ textAlign: 'center', fontSize: px(30), marginTop: px(50) }}>The base is not detected.<br />Please insert the base</p>
        </div>
      } else {
        if (devicesList.length === 0) {
          return <div className="flex" style={{ width: '100%', height: '100%', position: 'relative' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', marginBottom: px(130) }}>
              <div className="loadIcon" style={{ marginBottom: MTop(5) }}>
                <LoadingOutlined style={{ fontSize: 30, color: '#8a8a8a', marginTop: mTop(-30), }} />
              </div>
              <p>
                {'searching...'}
              </p>
            </div>
          </div>
        } else {
          let options = devicesList.map((item, index) => {
            let { saveDeviceMac } = this.state
            let flog = saveDeviceMac.some((device, index) => {
              return device === item.macId
            })
            let fontColor = flog ? '#D1C4C4' : '#4a4a4a'
            return <li
              className='flex'
              style={{ marginBottom: px(20) }}
              key={`${index}`}
              onClick={() => {
                if (!flog) {
                  this.setState({
                    selectDevice: item
                  })
                } else {
                  message.destroy();
                  message.error('This device has already been added')
                }

              }}
            >

              <div className="deviceName" style={{ fontSize: px(24), color: fontColor }}>{item.name}</div>
              <div className="deviceMacId" style={{ fontSize: px(18), color: fontColor }}>{item.macId}</div>

            </li>
          })
          return <div className='deviceList'>
            <ul>
              {options}
            </ul>
          </div>
        }
      }
    }

  }





  render() {
    return (
      <div id="addDevice">
        <div className="heaed">
          <div className="l"
          >
            <MouseDiv
              className='mouseDiv'
              beforeDiv={this.beforeDiv}
              afterDiv={this.afterDiv}
              divClick={() => {
                let { selectDevice } = this.state
                if (selectDevice) {
                  this.setState({
                    selectDevice: null
                  })
                } else {
                  this.props.history.goBack()
                }

              }}
            />
          </div>
          <div className="r">

            < MinClose

            />
          </div>
        </div>

        <div className="body flex">
          {this.body()}
        </div>






      </div>
    )
  }
}
