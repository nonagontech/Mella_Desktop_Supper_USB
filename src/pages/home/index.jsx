import React, { Component, } from 'react'
import {
  Button,
  message,
  Radio,
} from 'antd';

import temporaryStorage from '../../utils/temporaryStorage'
import { px, mTop, win } from '../../utils/px'
import MinClose from '../../utils/minClose/MinClose';
import { version } from '../../utils/appversion';
import logo from '../../assets/images/mella.png'
import './index.less';
import { connect } from 'react-redux';

let storage = window.localStorage;
//定义变量:连续点击了几次logo
let logoClick = 0;
//定义变量:点击logo的时间
let logoTime = 0;
let ipcRenderer = window.electron.ipcRenderer

class Home extends Component {
  state = {
    imgurl: '',
    size: { width: 0, height: 0 }
  }
  componentDidMount() {
    ipcRenderer.send('close-loading-window', 1)
    ipcRenderer.send('small', win())
    storage.measurepatientId = '';
    temporaryStorage.logupVetInfo = {}
    console.log('----===----', this.props.systemType);
  }



  _signUP = () => {
    console.log('1');
    this.props.history.push('/uesr/logUp/VetPrifile')
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

    let daohang = this.props.systemType === 'mac' ? 'daohang mac' : 'daohang windows'

    return (
      <div id="home">
        <div className={daohang} style={{ paddingTop: px(10), paddingRight: px(20), }}>
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
        <div className="text"  style={{ marginTop: mTop(5), marginBottom: mTop(5) }}>New to Mella? <p onClick={this._signUP} style={{textDecoration: 'underline' }}>Sign Up</p></div>
        <div className="create" style={{ marginBottom: mTop(20), marginTop: px(25) }}>
          <Button
            type="primary"
            shape="round"
            size='large'
            // onClick={() => { this.props.history.push('/uesr/logUp/VetPrifile') }}
            className="createBtn"
          >
            Quick Start
          </Button>
          {/* <Button
            type="primary"
            shape="round"
            size='large'
            onClick={() => { this.props.history.push('/uesr/logUp/VetPrifile') }}
            className="createBtn"
          >
            Create an Account
          </Button> */}
        </div>
        <div className="text"  style={{ marginTop: mTop(5), marginBottom: mTop(5) }}>
          <p style={{ width: '350px', fontSize: '18px', color: '#ffc4db', textAlign: 'left' }}>
          <Radio></Radio>I have read and agreed to the <p></p>
           <span style={{ marginLeft: '22px', textDecoration: 'underline', color: '#fff' }}>Terms and Services</span> and <span style={{ color: '#fff', textDecoration: 'underline' }}>Privacy Policy</span>
          </p>
        </div>

      </div>
    )
  }
}

export default connect(
  (state) => ({
    systemType: state.systemReduce.systemType
  })
)(Home)
