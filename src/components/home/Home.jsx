import React, { Component, } from 'react'
import {
  Button,
  message
} from 'antd';
//import 'antd/dist/antd.css';
import './home.less'
import logo from './../../assets/images/mella.png'
// import MaxMin from './../../utils/maxMin/MaxMin'
import temporaryStorage from './../../utils/temporaryStorage'
import { px, mTop, win, timerFun } from './../../utils/px'
import MinClose from '../../utils/minClose/MinClose';
import electronStore from './../../utils/electronStore'
import SelectionBox from './../../utils/selectionBox/SelectionBox'
import { addQRCode } from '../../utils/axios';
import { fetchRequest2 } from '../../utils/FetchUtil2';
import { version } from './../../utils/appversion'
let storage = window.localStorage;
//定义变量:连续点击了几次logo
let logoClick = 0;
//定义变量:点击logo的时间
let logoTime = 0;
export default class Home extends Component {
  state = {
    imgurl: '',
    size: { width: 0, height: 0 }
  }
  componentDidMount() {
    let ipcRenderer = window.electron.ipcRenderer
    timerFun()
    ipcRenderer.send('close-loading-window', 1)
    ipcRenderer.send('small', win())
    storage.measurepatientId = '';
    temporaryStorage.logupVetInfo = {}
    ipcRenderer.on('changeFenBianLv', this.changeFenBianLv)

    // fetchRequest2('/user/getLoginQRcode', "GET", '')
    //     // addQRCode()
    //     .then(res => {
    //         console.log('首页获取', res);


    //     })
    //     .catch(err => {

    //         console.log(err);
    //     })


    // addQRCode()
    //     .then(res => {
    //         message.destroy()

    //         console.log('---获取二维码', res);

    //     })
    //     .catch(err => {

    //         console.log(err);
    //     })





  }
  resize = (e) => {
    // console.log('-------------监听的数据', e);

  }
  componentWillUnmount() {
    let ipcRenderer = window.electron.ipcRenderer
    window.removeEventListener('resize', this.resize);

    ipcRenderer.removeListener('changeFenBianLv', this.changeFenBianLv)
  }
  changeFenBianLv = (e) => {
    console.log('changeFenBianLv');
    console.log(e);
    let ipcRenderer = window.electron.ipcRenderer
    // ipcRenderer.send('small')
    ipcRenderer.send('small', win())
    this.setState({

    })
  }


  _quickStart = () => {
    console.log('dianji2')
    this.props.history.push('/page1')
    // this.props.history.push('/menuOptions/advancedsettings')

  }
  _createAccount = () => {
    this.props.history.push('/uesr/logUp/VetPrifile')

    // this.props.history.push('/uesr/logUp/JoinOrganizationByOption')

  }
  _test = () => {
    console.log('点击');
    console.log(navigator);
    console.log(navigator.userAgent);
    console.log('---------------------------');
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

        let ipcRenderer = window.electron.ipcRenderer
        ipcRenderer.send('openDevTools', true)
      }
    }

  }
  render() {
    return (

      <div id="home">
        {/* <MaxMin
                    onClick={() => { this.props.history.push('/') }}
                /> */}
        <div className="daohang" style={{ paddingTop: px(10), paddingRight: px(20) }}>
          <MinClose />
        </div>
        <div className='flex refresh' style={{ alignItems: 'flex-end', paddingRight: px(20) }}>
          <div className='flex' style={{ flexDirection: 'row', paddingTop: px(20), paddingRight: px(18), color: '#700B33', cursor: 'pointer' }}>

            V{version}
          </div>



        </div>

        <div className="heard" >
          <div

            onClick={this._openUtils}
            className="logo"

          >
            <img
              src={logo}
              alt=""
              // style={{ marginTop: mTop(100), marginBottom: mTop(100), width: px(300) }}
            />
          </div>

        </div>


        <div className="button" style={{ marginBottom: px(25) }}>
          <Button
            // style={{ width: px(300), fontSize: px(20), height: px(300 / 6.5) }}
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
            // style={{ width: px(300), fontSize: px(20), height: px(300 / 6.5) }}
            type="primary"
            shape="round"
            size='large'
            onClick={this._createAccount}
            className="createBtn"
          >
            Create an Account
          </Button>
        </div>
      </div>
    )
  }
}
