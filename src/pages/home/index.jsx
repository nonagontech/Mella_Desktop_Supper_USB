import React, { Component, } from 'react'
import {
  Button,
  message
} from 'antd';

import temporaryStorage from '../../utils/temporaryStorage'
import { px, mTop, win, timerFun } from '../../utils/px'
import MinClose from '../../utils/minClose/MinClose';
import { version } from '../../utils/appversion';
import logo from '../../assets/images/mella.png'
import './index.less';

let storage = window.localStorage;
//定义变量:连续点击了几次logo
let logoClick = 0;
//定义变量:点击logo的时间
let logoTime = 0;
let ipcRenderer = window.electron.ipcRenderer

export default class Home extends Component {
  state = {
    imgurl: '',
    size: { width: 0, height: 0 }
  }
  componentDidMount() {
    timerFun()
    ipcRenderer.send('close-loading-window', 1)
    ipcRenderer.send('small', win())
    storage.measurepatientId = '';
    temporaryStorage.logupVetInfo = {}
  }





  _openUtils = () => {
    console.log('点击来了', logoClick);
    if (new Date() - logoTime > 500) {
      logoClick = 0;
      logoTime = new Date();

    } else {
      logoClick++;
      logoTime = new Date();
      if (logoClick >= 8) {
        logoClick = 0;
        ipcRenderer.send('openDevTools', true)
      }
    }
  }
  render() {
    return (
      <div id="home">
        <div className="daohang" style={{ paddingTop: px(10), paddingRight: px(20) }}>
          <MinClose />
        </div>
        <div className='flex refresh' style={{ alignItems: 'flex-end', paddingRight: px(20) }}>
          <div className='flex' style={{ flexDirection: 'row', paddingTop: px(20), paddingRight: px(18), color: '#700B33', cursor: 'pointer' }}>
            V{version}
          </div>
        </div>
        <div className="heard" >
          <div className="logo"
            onClick={this._openUtils}
          >
            <img src={logo} alt="" />
          </div>
        </div>
        <div className="button" style={{ marginBottom: px(25) }}>
          <Button
            type="primary"
            shape="round"
            size='large'
            onClick={() => { this.props.history.push('/page11') }}
            className="siginInBtn"
          >
            Sign In
          </Button>
        </div>
        <p className="text" style={{ marginTop: mTop(5), marginBottom: mTop(5) }}>New to Mella?</p>
        <div className="create" style={{ marginBottom: mTop(20), marginTop: px(25) }}>
          <Button
            type="primary"
            shape="round"
            size='large'
            onClick={() => { this.props.history.push('/uesr/logUp/VetPrifile') }}
            className="createBtn"
          >
            Create an Account
          </Button>
        </div>
      </div>
    )
  }
}
