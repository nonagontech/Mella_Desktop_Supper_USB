
import React, { Component } from 'react'

import './advancedsetting.less'
import Heart from '../../../utils/heard/Heard'
import { px, win } from './../../../utils/px'
import MyModal from './../../../utils/myModal/MyModal.jsx'
import { message } from 'antd'


let ipcRenderer = window.electron.ipcRenderer
let storage = window.localStorage;
let uploadType = ''
export default class AdvancedSettings extends Component {

  state = {
    isHaveBase: true,
    uploadText: '',
    isUpload: false,
    progress: 0
  }

  componentDidMount () {
    ipcRenderer.send('Lowbig', win())
    ipcRenderer.on('usbDetect', this.usbDetect)
    ipcRenderer.on('noUSB', this._noUSB)
    ipcRenderer.on('uploadBaseInfo', this._uploadBaseInfo)
    ipcRenderer.on('sned', this._send)
    ipcRenderer.on('changeFenBianLv', this.changeFenBianLv)
    ipcRenderer.send('reUpload', {})
  }
  componentWillUnmount () {
    ipcRenderer.removeListener('usbDetect', this.usbDetect)
    ipcRenderer.removeListener('noUSB', this._noUSB)
    ipcRenderer.removeListener('uploadBaseInfo', this._uploadBaseInfo)
    ipcRenderer.removeListener('sned', this._send)
    ipcRenderer.removeListener('changeFenBianLv', this.changeFenBianLv)
  }
  changeFenBianLv = (e) => {
    console.log(e);
    let ipcRenderer = window.electron.ipcRenderer
    ipcRenderer.send('Lowbig', win())
    this.setState({

    })
  }
  _send = (event, data) => {
    //data就是测量的数据，是十进制的数字
    console.log(data);
    let { isUpload } = this.state

    if (data[2] === 54) {
      if (isUpload) {
        if (data[3] === 0) {
          console.log('这是已经在升级状态下的, 要他重新插拔底座然后再去发送指令');
          this.setState({
            uploadText: 'Start the upgrade after re-plugging the base'
          })
          ipcRenderer.send('startUpload', {})
        }
      }

    } else if (data[2] === 182) {
      //这是底座正常的情况，要去发送开始升级的指令

      if (data[3] === 0) {
        if (isUpload) {
          console.log('开始去发送进入升级状态指令');
          ipcRenderer.send('enterUpgrade', { command: '38', arr: ['5A'] })
        }

      }
    }

  }
  /**
   * 
   *usb插拔检测（不一定是底座设备插拔），为true代表插上了设备，false代表拔出了设备
   */
  usbDetect = (event, data) => {

  }
  //是否插上底座设备，为true则代表插上了底座设备，反之为拔掉了底座设备
  _noUSB = (e, data) => {
    console.log('没有USB设备：', data);
    let { isUpload, progress } = this.state
    if (data === false) {

      this.setState({
        isHaveBase: true
      })
      if (isUpload) {
        if (progress === 0) {
          console.log('正在升级过程中检测到了拔插 前去发送升级文件', uploadType);
          if (uploadType === 'base') {
            console.log('底座升级');
            ipcRenderer.send('updateBase', { state: 'base' })
          } else if (uploadType === 'reset') {
            console.log('底座出厂设置');
            ipcRenderer.send('updateBase', { state: 'reset' })
          }
        } else if (progress === 100) {
          this.failTimer && clearTimeout(this.failTimer)
          this.setState({
            isUpload: false,
            progress: 0,
          })
          message.destroy()
          message.success('update successed')
          ipcRenderer.send('reUpload', {})
        } else {
          this.setState({
            isUpload: false,
            progress: 0,
          })
          message.destroy()
          message.error('Upgrade failed')
          ipcRenderer.send('reUpload', {})
        }


      }

    } else {

      if (this.state.isHaveBase) {
        this.setState({
          isHaveBase: false
        })
      }
      if (isUpload) {
        if (progress > 0 && progress < 100) {
          this.setState({
            isUpload: false,
            progress: 0,
          })
          message.destroy()
          message.error('Upgrade failed')
          ipcRenderer.send('reUpload', {})
        }
      }


    }
  }
  _uploadBaseInfo = (e, data) => {
    console.log('升级过程中的信息：', data);
    switch (data.status) {
      case 'error':
        this.setState({
          isUpload: false,
          progress: 0,
        })
        message.destroy()
        message.error(data.data)
        ipcRenderer.send('reUpload', {})
        break;
      case 'error1':
        this.setState({
          isUpload: false,
          progress: 0,
        })
        message.destroy()
        message.error('Upgrade failed, please try again')
        ipcRenderer.send('reUpload', {})
        break;


      case 'normal':
        this.setState({
          uploadText: data.data,
          progress: data.progress
        })
        if (data.progress === 100) {
          console.log('进度到达100了');
          this.failTimer && clearTimeout(this.failTimer)
          this.failTimer = setTimeout(() => {

            this.setState({
              isUpload: false,
              progress: 0,
            })
            message.destroy()
            message.error('Upgrade failed')
            ipcRenderer.send('reUpload', {})
          }, 5000);
        }
        break;

      case 'success':
        this.setState({
          isUpload: false
        })
        message.destroy()
        message.success(data.data)
        ipcRenderer.send('reUpload', {})

        break;

      default:
        break;
    }



  }
  _upload = (val) => {

    let { isHaveBase } = this.state
    if (!isHaveBase) {
      this.setState({
        isUpload: false
      })
      message.destroy()
      message.error('No base device found, please plug it in and try again')
    } else {
      console.log('---我插入底座了，准备去升级, 这里就可以打开modal框了');
      this.setState({
        uploadText: 'Detect upgrade environment',
        isUpload: true,
        progress: 0
      })
      uploadType = val
      //第一步，发送一个关闭通信的指令，看是否能够收到，如果收不到则判定底座已经在升级状态下，直接去发送文件
      const timer = setTimeout(() => {
        console.log('发送指令查看底座是否已经在升级状态');
        ipcRenderer.send('usbdata', { command: '36', arr: ['00'] })
        clearTimeout(timer)
      }, 100);

      //2.如果能收到关闭指令，则发送开始升级指令

      //3.如果如果测试检测到usb插拔，则去发送文件



    }
  }

  render () {

    return (
      <div id='advancedsettings'>
        <div className="heard">
          <Heart
            onReturn={() => { this.props.history.goBack() }}
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
          />
          <div className="title">
            <h2>Advanced Settings</h2>
          </div>

        </div>

        <div className="body">
          <div className="item">
            <div className="ltext">
              <p style={{ fontSize: px(18) }}>
                Factory Reset<br /><br />

                This will erase all data from your Mella<br /> device, including:<br />
                - All installed updates<br />
                - User preferences and Settings<br />
              </p>
            </div>
            <div className="rbtn"
              // onClick={this._reset}
              onClick={() => this._upload('reset')}
            >
              <div className="btn">Erase all data and reset device</div>
            </div>
          </div>

          <div className="item">
            <div className="ltext">
              <p style={{ fontSize: px(18) }}>
                Mella Base
              </p>
            </div>
            <div className="rbtn"
              // onClick={this._updateBase}
              onClick={() => this._upload('base')}
            >
              <div className="btn">Plug in the base and Update</div>
            </div>
          </div>

          <div className="item">
            <div className="ltext">
              <p style={{ fontSize: px(18) }}>
                MellaPro Thermometer
              </p>
            </div>
            <div className="rbtn"
              onClick={() => {
                // ipcRenderer.send('usbdata', { command: '01', arr: ['11'] })
              }}
            >
              <div className="btn">Connect Bluetooth and Update</div>
            </div>
          </div>
        </div>

        <MyModal
          visible={this.state.isUpload}
          // visible={true}
          element={
            <div style={{ height: px(200), borderRadius: px(20) }} className="upload">

              {/* <p>{this.state.uploadText} </p> */}
              <p style={{ color: '#000', padding: 0, margin: 0 }}>{this.state.uploadText}</p>
            </div>
          }
        />
      </div>
    )
  }
}