import React, { Component } from 'react'
import {
  Input,
  Button,
  message
} from 'antd';
import { LoadingOutlined } from '@ant-design/icons';

import mellaLogo from '../../assets/images/mellaLogo.png'
import back_white from '../../assets/img/back-white.png';
import back_hui from '../../assets/img/back-hui.png';

import temporaryStorage from '../../utils/temporaryStorage';
import { px, mTop, MTop } from '../../utils/px';
import MouseDiv from '../../utils/mouseDiv/MouseDiv'
import MinClose from '../../utils/minClose/MinClose'

import './index.less';
import { resetPWD } from '../../api';

let storage = window.localStorage;
export default class ResetPassword extends Component {

  state = {
    hash: '',
    hash1: '',
    spin: false
  }
  componentDidMount() {
    let ipcRenderer = window.electron.ipcRenderer
    ipcRenderer.send('small')
    ipcRenderer.on('changeFenBianLv', this.changeFenBianLv)
  }
  componentWillUnmount() {
    message.destroy()
    let ipcRenderer = window.electron.ipcRenderer
    ipcRenderer.removeListener('changeFenBianLv', this.changeFenBianLv)
  }
  changeFenBianLv = (e) => {
    console.log(e);
    let ipcRenderer = window.electron.ipcRenderer
    ipcRenderer.send('small')
    this.setState({

    })
  }

  _continue = () => {
    console.log('点击了发送按钮')
    message.destroy()
    let { hash, hash1 } = this.state
    console.log(hash, hash1, hash !== hash1);
    if (!hash && !hash1) {

      message.error('Please enter a new password', 10)
      return
    }
    if (hash !== hash1) {
      message.error('The two passwords are inconsistent, please re-enter', 10)
      return
    }
    this.setState({
      spin: true
    })


    resetPWD(temporaryStorage.forgotUserId, hash)
      .then(res => {
        console.log('修改密码返回结果', res);
        this.setState({
          spin: false
        })
        if (res.flag === true) {
          let data = {
            email: temporaryStorage.forgotPassword_email,
            hash: this.state.hash
          }
          console.log(data);
          data = JSON.stringify(data)
          storage.signIn = data
          temporaryStorage.forgotPassword_email = ''
          temporaryStorage.forgotUserId = ''
          this.props.history.replace('/page11')
          // this.props.history.push('/page11')
        }
      })
      .catch(err => {
        console.log('err', err);
        this.setState({
          spin: false
        })
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

  render() {
    return (
      <div id="resetPassword">
        {/* <div className="iconfont icon-left heard return" onClick={() => { this.props.history.goBack() }} />
        <div className="logo">
          <img src={mellaLogo} alt="" />
        </div>
        <div className="text">Reset Your<br />Password</div> */}

        <div className="heaed"  >
          <div className="l">
            <MouseDiv
              className='mouseDiv'
              beforeDiv={this.beforeDiv}
              afterDiv={this.afterDiv}
              divClick={() => {
                this.props.history.goBack()
              }}
            />
          </div>
          <div className="r">
            < MinClose />
          </div>
        </div>

        <div className="body" style={{ height: MTop(280), }}>
          <div className="logo"
            style={{ paddingTop: mTop(10) }}
          >
            <img src={mellaLogo} alt="" style={{ width: px(130) }} />
          </div>
          <div className="text"
            style={{ fontSize: px(30), padding: `${px(20)}px 0`, marginBottom: mTop(10), marginTop: mTop(20) }}
          >
            Reset Your<br />Password
          </div>

          <div className="inpF">

            <Input.Password className='inp'
              style={{ width: px(310), height: mTop(50), marginLeft: px(6), marginBottom: mTop(18), fontSize: px(18) }}
              visibilityToggle={false}
              value={this.state.hash}
              placeholder='New Password'
              bordered={false}
              onChange={(item) => {
                let str = item.target.value
                this.setState({
                  hash: str
                })
              }}
            />
            <Input.Password className='inp'
              style={{ width: px(310), height: mTop(50), marginLeft: px(6), marginBottom: mTop(18), fontSize: px(18) }}
              visibilityToggle={false}
              value={this.state.hash1}
              placeholder='Re-Enter New Password'
              bordered={false}
              onChange={(item) => {
                let str = item.target.value
                this.setState({
                  hash1: str
                })
              }}
            />

          </div>
        </div>



        <div className="button1" >
          <Button
            style={{ width: px(300), fontSize: px(18), height: px(300 / 6.5) }}

            type="primary"
            shape="round"
            size='large'
            onClick={this._continue}
          >
            Continue
          </Button>
        </div>
        {
          this.state.spin &&
          <div className="modal">
            <div className="loadIcon" style={{ marginBottom: MTop(5) }}>
              <LoadingOutlined style={{ fontSize: 30, color: '#e1206d', marginTop: mTop(-30), }} />


            </div>
            <p>
              loading...
            </p>
          </div>
        }




        {/*
        <div className="heaed"  >
          <div className="l"
          >

            <MouseDiv
              className='mouseDiv'
              beforeDiv={this.beforeDiv}
              afterDiv={this.afterDiv}
              divClick={() => {
                this.props.history.goBack()
              }}
            />
          </div>
          <div className="r">

            < MinClose

            />
          </div>
        </div>



        <div className="inpF">
          <Input.Password className='inp'
            visibilityToggle={false}
            style={{ border: 'none', outline: 'medium' }}
            value={this.state.hash}
            placeholder='New Password'
            bordered={false}
            onChange={(item) => {
              let str = item.target.value
              this.setState({
                hash: str
              })
            }}
          />
          <Input.Password className='inp'
            visibilityToggle={false}
            style={{ border: 'none', outline: 'medium' }}
            value={this.state.hash1}
            placeholder='Re-Enter New Password'
            bordered={false}
            onChange={(item) => {
              let str = item.target.value
              this.setState({
                hash1: str
              })
            }}
          />
        </div>

        <div className="button1">
          <Button
            type="primary"
            shape="round"
            size='large'
            onClick={this._continue}
          >
            Continue
          </Button>

        </div> */}


      </div>
    )
  }
}
