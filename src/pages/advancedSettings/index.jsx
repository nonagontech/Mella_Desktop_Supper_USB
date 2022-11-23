
import React, { Component } from 'react'
import { message, Modal, Button } from 'antd';
import Heart from '../../utils/heard/Heard'
import { px, win } from '../../utils/px'
import MyModal from '../../utils/myModal/MyModal.jsx'
import './index.less';
import { getOta } from '../../api/mellaserver/backend';
import { versionComarision } from '../../utils/commonFun';
import { getInfoOfLatestDevice } from '../../api/mellaserver/mellarecord';
import { localHardBinVersion } from '../../utils/appversion';

let ipcRenderer = window.electron.ipcRenderer
let uploadType = ''

export default class AdvancedSettings extends Component {

  state = {
    isHaveBase: true,
    uploadText: '',
    isUpload: false,
    updateModal: false,
    progress: 0,
    localVersion: '',
    cloudVersion: '',
    filePath: '',
    isModalOpen: false,
    errorFlog: false
  }
  componentDidMount() {
    ipcRenderer.send("big", win());
    //检测是否有usb设备
    ipcRenderer.on('noUSB', this._noUSB)
    //升级过程中发送的过程信息
    ipcRenderer.on('uploadBaseInfo', this._uploadBaseInfo)
    //底座发过来的指令信息
    ipcRenderer.on('sned', this._send)
    //发送结束升级指令,相当于初始化
    ipcRenderer.send('reUpload', {})
    //获取插入硬件版本
    // this.getHardwareVersion();
  }
  componentWillUnmount() {
    ipcRenderer.removeListener('noUSB', this._noUSB)
    ipcRenderer.removeListener('uploadBaseInfo', this._uploadBaseInfo)
    ipcRenderer.removeListener('sned', this._send)
    this.localVersionTimer && clearTimeout(this.localVersionTimer)
  }
  //进入界面时获取底座的版本
  // getHardwareVersion = () => {
  //   if(this.state.isHaveBase)
  //   ipcRenderer.send('usbdata', { command: '08', arr: [''] });
  //   this.localVersionTimer = setTimeout(() => {
  //     //如果3秒后还没有收到桌面返回的版本号,则代表这是很老的底座程序,给出弹窗提示
  //     this.setState({ isModalOpen: true });
  //     this.localVersionTimer && clearTimeout(this.localVersionTimer)
  //   }, 3000);
  // }
  //底座发过来的指令信息
  _send = (event, data) => {
    //data就是测量的数据，是十进制的数字
    console.log('_send', data);
    if (this.state.errorFlog) {
      this.setState({
        errorFlog: true
      })
    }
    let { isUpload } = this.state

    if (data[2] === 54) {
      if (isUpload) {
        if (data[3] === 0) {
          this.setState({
            uploadText: 'Start the upgrade after re-plugging the base'
          })
          ipcRenderer.send('startUpload', {})
        }
      }

    } else if (data[2] === 182) {
      //为0代表底座通讯关闭成功了

      if (data[3] === 0) {
        if (isUpload) {
          console.log('发送指令让底座进入升级状态');
          ipcRenderer.send('enterUpgrade', { command: '38', arr: ['5A'] })
        }

      }
    } else if (data[2] === 136) {
      //获取到了版本信息,把定时器关闭,此底座不是很老版本
      console.log('版本信息:', data);
      this.localVersionTimer && clearTimeout(this.localVersionTimer)
      let localVersion = `${data[6]}.${data[7]}.${data[8]}`;
      this.setState({
        localVersion,
        uploadText: `The current version number is v${localVersion}, getting the latest version`
      }, () => {
        this.cloudVersion()
      })
    }

  }
  //是否插上底座设备，为false则代表插上了底座设备，反之为拔掉了底座设备
  _noUSB = (e, data) => {
    console.log('没有USB设备：', data);
    let { isUpload, progress } = this.state
    if (data === false) {
      this.setState({
        isHaveBase: true,
      })
      if (isUpload) {
        if (progress === 0) {
          console.log('正在升级过程中检测到了拔插 前去发送升级文件', uploadType);
          if (uploadType === 'base') {
            console.log('底座升级', this.state.cloudVersion);
            //如果版本号和本地版本号一致则使用本地存放的硬件文件，如果没有云端版本或者，云端文件地址则也使用本地的升级文件包
            if (localHardBinVersion === this.state.cloudVersion || !this.state.cloudVersion || !this.state.filePath) {

              console.log('使用本地文件进行升级');
              ipcRenderer.send('updateBase', { state: 'reset', type: 'base' })
            } else {
              ipcRenderer.send('updateBase', { state: 'base', url: this.state.filePath, fileName: `mellabase${this.state.cloudVersion}` })
            }


          } else if (uploadType === 'reset') {
            console.log('底座出厂设置');
            ipcRenderer.send('updateBase', { state: 'reset', type: 'reset' })
          }
        } else if (progress === 100) {
          this.failTimer && clearTimeout(this.failTimer)
          this.setState({
            isUpload: false,
            updateModal: false,
            progress: 0,
            localVersion: '',
            cloudVersion: '',
          })
          message.destroy()
          message.success('The update is successful. Please re plug the base');
          ipcRenderer.send('reUpload', {})
        } else {
          this.setState({
            isUpload: false,
            updateModal: false,
            progress: 0,
            localVersion: '',
            cloudVersion: '',
          })
          message.destroy()
          message.error('Upgrade failed, Please reinsert the base')
          ipcRenderer.send('reUpload', {})
        }


      }
    } else {
      if (this.state.isHaveBase) {
        this.setState({
          isHaveBase: false,

        })
      }
      if (isUpload) {
        if (progress > 0 && progress < 100) {
          this.setState({
            isUpload: false,
            updateModal: false,
            progress: 0,
            localVersion: '',
            cloudVersion: '',
          })
          message.destroy()
          message.error('Upgrade failed, Please reinsert the base')
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
          updateModal: false,
          progress: 0,
          localVersion: '',
          cloudVersion: '',
        })
        message.destroy()
        message.error(data.data)
        ipcRenderer.send('reUpload', {})
        break;
      case 'error1':
        this.setState({
          isUpload: false,
          updateModal: false,
          progress: 0,
          localVersion: '',
          cloudVersion: '',
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
              updateModal: false,
              progress: 0,
              localVersion: '',
              cloudVersion: '',
            })
            message.destroy()
            message.error('Upgrade failed, Please reinsert the base')
            ipcRenderer.send('reUpload', {})
          }, 5000);
        }
        break;

      case 'success':
        this.setState({
          isUpload: false,
          updateModal: false,
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
        isUpload: false,
        updateModal: false,
        localVersion: '',
        cloudVersion: '',
      })
      message.destroy()
      message.error('No base device found, please plug it in and try again')
    } else {
      console.log('---我插入底座了，准备去升级, 这里就可以打开modal框了');
      this.setState({
        uploadText: 'Detect upgrade environment',
        isUpload: true,
        updateModal: true,
        progress: 0,
        errorFlog: true
      })
      uploadType = val
      //第一步，发送一个关闭通信的指令，看是否能够收到，如果收不到则判定底座已经在升级状态下，直接去发送文件
      console.log('发送指令查看底座是否已经在升级状态');
      ipcRenderer.send('usbdata', { command: '36', arr: ['00'] })
      const timer = setTimeout(() => {
        if (this.state.errorFlog) {
          this.setState({
            uploadText: "Please manually plug and unplug the base"
          })
          ipcRenderer.send('startUpload', {})

        }
        clearTimeout(timer)
      }, 3000);


      //2.如果能收到关闭指令，则发送开始升级指令

      //3.如果如果测试检测到usb插拔，则去发送文件



    }
  }
  _upload1 = (val) => {
    let { isHaveBase } = this.state
    message.destroy()
    if (!isHaveBase) {
      this.setState({
        isUpload: false,
        updateModal: false,
        localVersion: '',
        cloudVersion: '',
      })

      message.error('No base device found, please plug it in and try again')
    } else {
      console.log('---我插入底座了，准备去升级, 这里就可以打开modal框了');
      this.setState({
        uploadText: 'Detect upgrade environment',
        updateModal: true,
        progress: 0,
        localVersion: '',
        cloudVersion: '',
        errorFlog: true

      }, () => {
        this.localVersion()
      })
      uploadType = val
    }
  }
  //询问本地的版本号
  localVersion = () => {
    this.setState({
      uploadText: 'Query the local version number',
    })
    ipcRenderer.send('usbdata', { command: '08', arr: [''] });
    this.localVersionTimer && clearTimeout(this.localVersionTimer)
    this.localVersionTimer = setTimeout(() => {
      //如果3秒后还没有收到桌面返回的版本号,则代表这是很老的底座程序,直接去下载文件升级
      this.cloudVersion()
      this.localVersionTimer && clearTimeout(this.localVersionTimer)
    }, 3000);
  }
  //询问网端最新的版本号
  cloudVersion = () => {
    getInfoOfLatestDevice('mellabase')
      .then(res => {
        console.log('获取到了网端的版本号', res);
        if (res.flag) {
          let { firmwareVersion, updateUrl } = res.data
          let cloudBigtolocal = versionComarision(firmwareVersion, this.state.localVersion)
          console.log('比较信息:', firmwareVersion, this.state.localVersion, cloudBigtolocal);
          if (cloudBigtolocal || !this.state.localVersion) {
            this.setState({
              cloudVersion: firmwareVersion,
              filePath: updateUrl,
              isUpload: true,
              uploadText: 'Start getting upgrade files'

            })
            this.setState({
              errorFlog: true
            }, () => {
              ipcRenderer.send('usbdata', { command: '36', arr: ['00'] })
              console.log('发送指令查看底座是否已经在升级状态');
            })



            const timer = setTimeout(() => {
              if (this.state.errorFlog) {

                this.setState({
                  uploadText: "Please manually plug and unplug the base"
                })
                ipcRenderer.send('startUpload', {})

              }
              clearTimeout(timer)
            }, 3000);
          } else {
            this.setState({
              updateModal: false
            })
            message.success(`The hardware version is v${firmwareVersion}, which is the latest version`)
          }



        } else {
          console.log('没有获取到版本的文件');
          message.error('Failed to get the latest version')
          this.setState({
            updateModal: false
          })
        }
      })
      .catch(err => {
        console.log('获取版本失败,停止升级', err);
        message.error('Failed to get the latest version')
        this.setState({
          updateModal: false
        })

      })
  }

  render() {

    return (
      <div id='advancedsettings'>
        <div className="heard">
          <Heart />
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

              onClick={() => this._upload1('base')}
            >
              <div className="btn">Update Mella Charging Base</div>
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
          visible={this.state.updateModal}
          element={
            <div style={{ height: px(200), borderRadius: px(20) }} className="upload">

              {/* <p>{this.state.uploadText} </p> */}
              <p style={{ color: '#000', padding: 0, margin: 0 }}>{this.state.uploadText}</p>
            </div>
          }
        />
        <Modal
          open={this.state.isModalOpen}
          // width={432}
          className='tipModal'
          centered
          keyboard={false}
          closable={false}
          footer={null}
        >
          <div className='modalContentBox'>
            <p className="title">An update for the Mella Pro Charger is available</p>
            <div className="modalBtnBox">
              <Button
                type="primary"
                shape="round"
                size='middle'
                onClick={() => this.setState({ isModalOpen: false })}
                className="modalBtn"
              >
                cancel
              </Button>
              <Button
                type="primary"
                shape="round"
                size='middle'
                onClick={() => {
                  this._upload1('base');
                  this.setState({ isModalOpen: false })
                }}
                className="modalBtn"
              >
                Update Mella Charging Base
              </Button>
            </div>
          </div>
        </Modal>
      </div>
    )
  }
}
