

import React, { Component, } from 'react'
import { connect } from 'react-redux';
import Heard from '../../utils/heard/Heard'
import { mTop, px, pX, win } from '../../utils/px';
import HardAndPetsUI from './HardAndPetsUI';
import HardWareTypeUI from './hardWareTypeUI';
import TemperaturePage from '../../pages/temperaturePage'
import { selectHardwareModalShowFun } from '../../store/actions';
import './mainbody.less'

let ipcRenderer = window.require('electron').ipcRenderer


class App extends Component {
  state = {
    //body部分窗口高度
    bodyHeight: 0,
    //本地保存的硬件类型数组
    devicesTypeList: [],
    //展示硬件类型的数组
    showHardWareTypeList: [],
  }
  componentDidMount() {
    ipcRenderer.send('big', win())
    //获取窗口高度
    this.resize()
    //react监听屏幕窗口改变
    window.addEventListener('resize', this.resize)

    //获取设备类型
    let devicesTypeList = [
      {
        type: 'mellaPro',
        devices: [
          {
            name: 'mellaPro',
            mac: '',
            deviceType: 'mellaPro',
            examRoom: '',
          }
        ]
      },
      {
        type: 'biggie',
        devices: [
          {
            name: 'biggie',
            mac: '',
            deviceType: 'biggie',
            examRoom: '',
          },
          {
            name: 'biggie002',
            mac: '1253',
            deviceType: 'biggie',
            examRoom: '',
          }
        ]
      },
      {
        type: 'otterEQ',
        devices: [
          {
            name: 'otterEQ',
            mac: '',
            deviceType: 'otterEQ',
            examRoom: '',
          }
        ]
      },

      {
        type: 'rfid',
        devices: [
          {
            name: 'rfid',
            mac: '',
            deviceType: 'rfid',
            examRoom: '',
          }
        ]
      },
      {
        type: 'tape',
        devices: [
          {
            name: 'tape',
            mac: '',
            deviceType: 'tape',
            examRoom: '',
          }
        ]
      },
      {
        type: 'maeBowl',
        devices: [
          {
            name: 'maeBowl',
            mac: '',
            deviceType: 'maeBowl',
            examRoom: '',
          }
        ]
      }
    ]
    let showHardWareTypeList = [].concat(devicesTypeList)
    showHardWareTypeList.push({
      type: 'add',
      devices: []
    })

    this.setState({
      devicesTypeList,
      showHardWareTypeList
    })
  }

  componentWillUnmount() {
    //组件销毁，取消监听
    window.removeEventListener('resize', this.resize)
  }

  //监听屏幕窗口改变
  resize = () => {
    let { offsetWidth, offsetHeight } = this.mainbody
    // console.log('resize', this.mainbody, { offsetWidth, offsetHeight });
    if (offsetHeight !== this.state.bodyHeight) {
      this.setState({
        bodyHeight: offsetHeight - px(50)
      })
    }
  }

  render() {
    let { bodyHeight } = this.state

    return (
      <div className='flex' id='mainbody'
        ref={(val) => this.mainbody = val}
        onClick={() => {
          if (this.props.selectHardwareModalShowFun) {
            this.props.selectHardwareModalShowFun(false)
          }
        }}
      >
        <Heard />
        <div className="mainbody-body">
          <HardWareTypeUI
            bodyHeight={bodyHeight}
            devicesTypeList={this.state.showHardWareTypeList}
          />
          <HardAndPetsUI bodyHeight={bodyHeight} />
          {/* <TemperaturePage /> */}
          <div style={{width:'100%'}}>dgdgdf</div>
        </div>
      </div>
    )
  }
}
export default connect(
  state => ({
  }),
  { selectHardwareModalShowFun }
)(App)
