import React, { Component } from 'react'
import {
  Input,
  Button,
  message,
  Spin

} from 'antd';
// import { Input, Button, message, Spin, BackTop } from 'antd';
import { createFromIconfontCN, SyncOutlined, LoadingOutlined } from '@ant-design/icons';

import './forgotPassword.less'
import temporaryStorage from '../../../utils/temporaryStorage';
import { fetchRequest } from '../../../utils/FetchUtil1';
import { px, mTop, pX, MTop } from '../../../utils/px';
import MouseDiv from '../../../utils/mouseDiv/MouseDiv'
import MinClose from '../../../utils/minClose/MinClose'
import back_white from '../../../assets/img/back-white.png'
import back_hui from '../../../assets/img/back-hui.png'
import mellaLogo from '../../../assets/images/mellaLogo.png'
import errorIcon from '../../../assets/images/errorIcon.png'


//num做超时处理
let num = 0
export default class ForgotPassword extends Component {

  state = {
    email: '',
    success1: false,
    spin: false,        //调用接口加载中
    noRegistered: false, //邮箱没被注册跳出的弹窗
    isLimit: false,      //账号被限制、注册未激活状态

  }
  componentDidMount () {
    let ipcRenderer = window.electron.ipcRenderer
    ipcRenderer.send('small')
    if (temporaryStorage.forgotPassword_email) {
      this.setState({
        email: temporaryStorage.forgotPassword_email
      })
    }
    ipcRenderer.on('changeFenBianLv', this.changeFenBianLv)
  }
  componentWillUnmount () {
    this.timer && clearInterval(this.timer)
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
    let { email } = this.state
    message.destroy()
    console.log('点击了发送按钮', email)
    if (email.length < 2 || email.indexOf('@') === -1) {
      message.error('Email number format is incorrect')
      return
    }
    this.setState({
      spin: true
    })
    console.log('开始去检测邮箱');
    fetchRequest(`/user/checkUser/${email}`, 'GET', '')
      .then(res => {
        console.log('检测邮箱存不存在', res);
        if (res.code) {
          switch (res.code) {

            case 11011:
              console.log('邮箱存在，发送邮件');
              this._sendEmail()
              break;
            case 11012:
              console.log('账号被限制、注册未激活状态');
              this.setState({
                isLimit: true
              })
              break;
            case 11013:
              console.log('邮箱未被注册，跳出弹框询问是否前往注册');
            case 11014:
              console.log('邮箱被注销或者封停，跳出弹框询问是否前往注册');
              this.setState({
                noRegistered: true,
                spin: false
              })
              return
          }
        } else {
          console.log('系统错误', res);
          message.error('system error')
          this.setState({
            spin: false
          })
        }
      })
      .catch(err => {
        console.log('err', err);
        this.setState({
          spin: false
        })
        message.error('system error')

      })



  }
  _sendEmail = () => {
    fetchRequest(`/user/forgetPwd/${this.state.email}`, "GET", '')
      .then(res => {
        console.log('调用验证邮箱返回的数据', res);
        this.setState({
          spin: false
        })
        if (res.flag === true) {
          console.log('邮件发送成功,请注意查收')
          this.timer && clearInterval(this.timer)
          this.timer = setInterval(() => {
            num++
            if (num > 300) {
              message.error('The email is invalid, please click send again', 10)
              num = 0
              this.timer && clearInterval(this.timer)
            }
            this._validation()

          }, 1000);
          message.success('The email was sent successfully, please check it', 10)
        } else {
          console.log('邮件发送失败');
          message.error('The account does not exist', 10)
        }
      })
      .catch(err => {
        console.log('err', err);
        this.setState({
          spin: false
        })
      })
  }
  _validation = () => {

    fetchRequest(`/user/checkForgetPassword/${this.state.email}`, "GET", '')
      .then(res => {
        console.log('验证结果', res);
        if (res.flag === true) {
          temporaryStorage.forgotUserId = res.data.userId

          this.timer && clearInterval(this.timer)
          if (this.state.success1 === false) {
            this.setState({
              success1: true
            }, () => {
              console.log('跳转');
              this.props.history.push('/user/login/resetPassword')
            })
          }
          console.log('成功了');
        }
      })
      .catch(err => {
        console.log(err);
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

  render () {
    return (
      <div id="forgotPassword">

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





        <div className="body" style={{ height: MTop(280), }}>
          <div className="logo"
            style={{ paddingTop: mTop(10) }}
          >
            <img src={mellaLogo} alt="" style={{ width: px(130) }} />
          </div>
          <div className="text"
            style={{ fontSize: px(30), padding: `${px(20)}px 0`, marginBottom: mTop(10), marginTop: mTop(20) }}
          >
            Forgot Your Password?
          </div>
          <p className="text1" style={{ fontSize: px(20) }}>
            Please enter email and we<br />
            will send you a link if there is an<br />
            account associated with that address.<br />
          </p>
          {/* <div className="text1">Please enter email and we</div>
          <div className="text1">will send you a link if there is an</div>
          <div className="text1">account associated with that address.</div> */}
          <div className="inpF">

            <Input className='inp'
              style={{ width: px(310), height: mTop(50), marginLeft: px(6), marginBottom: mTop(18), fontSize: px(18) }}
              value={this.state.email}
              placeholder='rachel@friends.com'
              bordered={false}
              onChange={(item) => {
                let str = item.target.value
                this.setState({
                  email: str
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
            SEND LINK
          </Button>
        </div>

        {
          this.state.spin &&
          <div className="modal">
            <div className="loadIcon" style={{ marginBottom: MTop(5) }}>
              <LoadingOutlined style={{ fontSize: 30, color: '#fff', marginTop: mTop(-30), }} />


            </div>
            <p>
              loading...
            </p>
          </div>
        }


        {
          this.state.noRegistered &&
          <div className="modal">
            <div className="modalChaild" style={{ borderRadius: pX(20) }}>
              <img src={errorIcon} alt="" style={{ width: pX(30), margin: `${pX(20)}px 0` }} />
              <p style={{ fontSize: px(17) }}>
                This account is not registered. Do you want to go to register?
              </p>

              <div className="modalbutton" style={{ margin: `${pX(0)}px 0 ${pX(20)}px` }}>
                <Button
                  style={{ width: pX(120), fontSize: px(16), height: pX(35) }}

                  type="primary"
                  shape="round"
                  size='large'
                  onClick={() => {
                    this.setState({
                      noRegistered: false
                    })
                  }}
                >
                  Cancel
                </Button>
                <Button
                  style={{ width: pX(120), fontSize: px(16), height: pX(35) }}

                  type="primary"
                  shape="round"
                  size='large'
                  onClick={() => {
                    this.setState({
                      noRegistered: false
                    })
                    this.props.history.push({ pathname: '/uesr/logUp/VetPrifile', email: this.state.email })

                  }}
                >
                  Jump
                </Button>
              </div>
            </div>



          </div>
        }


        {
          this.state.isLimit &&
          <div className="modal">
            <div className="modalChaild" style={{ borderRadius: pX(20) }}>
              <img src={errorIcon} alt="" style={{ width: pX(30), margin: `${pX(20)}px 0` }} />
              <p style={{ fontSize: px(17) }}>
                Your email is not verified - please verify
              </p>

              <div className="modalbutton" style={{ margin: `${pX(0)}px 0 ${pX(20)}px` }}>
                <Button
                  style={{ width: pX(120), fontSize: px(16), height: pX(35) }}

                  type="primary"
                  shape="round"
                  size='large'
                  onClick={() => {
                    this.setState({
                      isLimit: false
                    })
                  }}
                >
                  Cancel
                </Button>
                <Button
                  style={{ width: pX(120), fontSize: px(16), height: pX(35) }}

                  type="primary"
                  shape="round"
                  size='large'
                  onClick={() => {
                    this.setState({
                      isLimit: false,
                      spin: true
                    })

                    fetchRequest(`/user/sendActivateEmail/${this.state.email}`, "GET", "")
                      .then(res => {
                        console.log(res);
                        this.setState({
                          spin: false,
                        })
                        if (res.flag === true) {
                          console.log('发送成功');
                          const time = setTimeout(() => {
                            message.success('The email has been sent, please follow the prompts')
                            clearTimeout(time)
                          }, 5);

                        } else {
                          console.log('发送失败');
                          const time = setTimeout(() => {
                            message.error('Failed to send mail')
                            clearTimeout(time)
                          }, 5);

                        }
                      })
                      .catch(err => {
                        console.log(err);
                        this.setState({
                          spin: false,
                        })
                      })
                  }}
                >
                  Jump
                </Button>
              </div>
            </div>



          </div>
        }









      </div>
    )
  }
}