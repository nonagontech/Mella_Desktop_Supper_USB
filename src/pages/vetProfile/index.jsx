import React, { Component, } from 'react'
import {
  Button,
  Modal,
  message
} from 'antd';
import { CaretDownFilled } from '@ant-design/icons';

import imgArray from './../../utils/areaCode/imgArray'
import MaxMin from './../../utils/maxminreturn/MaxMinReturn'
import { fetchRequest2 } from './../../utils/FetchUtil2'
import countryList from './../../utils/areaCode/country';
import temporaryStorage from './../../utils/temporaryStorage'
import { px } from './../../utils/px';
import MyModal from './../../utils/myModal/MyModal'
import { fetchRequest3 } from './../../utils/FetchUtil3';

import { checkUser, registByAWSSES } from '../../api';

import moment from 'moment';

import './index.less';

const options = [
  { label: 'Dogs', value: 'Dogs' },
  { label: 'Cats', value: 'Cats' },
  { label: 'Small Pets', value: 'Small Pets' },
  { label: 'Nutrition', value: 'Nutrition' },
  { label: 'Surgery', value: 'Surgery' },
  { label: 'Zoo', value: 'Zoo' },
  { label: 'Wildlife', value: 'Wildlife' },
  { label: 'Cardiology', value: 'Cardiology' },
  { label: 'Neurology', value: 'Neurology' },
  { label: 'Anaesthesia', value: 'Anaesthesia' },
  { label: 'Other', value: 'Other' },
]
export default class VetPrifile extends Component {

  state = {
    code: 1,
    imgArrayIndex: 0,
    otherText: '',
    name: '',
    lastName: '',
    email: '',
    phone: '',
    birthday: moment(),
    password: '',
    password1: '',
    checboxtValue: [],
    expertise: '00000000000',       //专业领域，勾选某一项，则这一项为1，反之为0    01011111101

    visible: false,       //nodel框是否显示
    disabled: true,       //model是否可拖拽
    bounds: { left: 0, top: 0, bottom: 0, right: 0 },
    loadVisible: false
  }

  componentDidMount() {
    //发送指令让main.js创建一个big窗口
    let ipcRenderer = window.electron.ipcRenderer
    ipcRenderer.send('big')

    //检测是否本地是否有注册信息，有就展示出来。
    console.log(temporaryStorage.logupVetInfo);
    if (temporaryStorage.logupVetInfo && temporaryStorage.logupVetInfo.email) {
      console.log('进来了');
      let { firstName, lastName, email, hash, code, initPhone, imgArrayIndex } = temporaryStorage.logupVetInfo
      this.setState({
        name: firstName || '',
        lastName,
        email,
        password: hash,
        password1: hash,
        code,
        phone: initPhone || '',
        imgArrayIndex
      })


    }


    //如果是从别的界面跳转过来并且带来了邮箱号，要直接展示在输入框里。eg：忘记密码输入的邮箱号未注册，跳转到注册界面
    if (this.props.location && this.props.location.email) {
      this.setState({
        email: this.props.location.email
      })
    }
    //监听屏幕分辩率是否变化，变化就去更改界面内容距离大小
    ipcRenderer.on('changeFenBianLv', this.changeFenBianLv)


  }
  componentWillUnmount() {
    let ipcRenderer = window.electron.ipcRenderer
    ipcRenderer.removeListener('changeFenBianLv', this.changeFenBianLv)
  }
  changeFenBianLv = (e) => {
    console.log(e);
    let ipcRenderer = window.electron.ipcRenderer
    ipcRenderer.send('big')
    this.setState({

    })
  }


  _next1 = () => {
    let { name, lastName, email, code, phone, password1, password, } = this.state
    message.destroy()
    console.log({ name, email, code, phone, password1, password, });
    email = email.toLocaleLowerCase()
    if (name.length <= 0) {
      message.error('Please enter your first name', 3)
      return
    }
    if (lastName.length <= 0) {
      message.error('Please enter your last name', 3)
      return
    }
    if (!email) {
      message.error('Please enter the mailbox number', 3)
      return
    } else {
      if (email.indexOf('@') === -1 || email.indexOf('@') === 0 || email.indexOf('@') === email.length - 1) {
        message.error('E-mail format is incorrect', 3)
        return
      }
    }
    // if (!phone) {
    //   message.error('Please enter the phone number', 3)
    //   return
    // }
    if (password.length <= 0 || password1.length <= 0) {
      message.error('Please enter the password', 3)
      return
    }

    if (password !== password1) {
      message.error('The password entered twice is incorrect, please re-enter', 3)
      return
    }
    this.setState({
      loadVisible: true
    })
    checkUser(email)
      .then(res => {
        console.log(res);
        if (!res.flag) {
          console.log('邮箱号以被注册，是否忘记密码');
          this.setState({
            loadVisible: false,
            visible: true
          })
        }
        else {
          console.log('邮箱号可以使用');
          if (res.code === 11011 || res.code === 11012) {
            this.setState({
              loadVisible: false,
              visible: true
            })
            return
          }

          let params = {
            firstName: name,
            lastName,
            email,
            // phone: `+${code}${phone}`,
            hash: password,
          }
          if (phone) {
            params.phone = `+${code}${phone}`
          }
          console.log('注册接口的入参：', params);
          fetchRequest2('/user/deskRegistAWSSNS', "POST", params)
            .then(res => {
              this.setState({
                loadVisible: false
              })
              console.log('注册接口返回数据：', res);
              if (res.flag) {
                console.log('注册成功了，去验证验证码');
                temporaryStorage.logupEmailCode = res.data
                params.code = code
                params.initPhone = phone
                params.imgArrayIndex = this.state.imgArrayIndex
                temporaryStorage.logupVetInfo = params
                this.props.history.push('/uesr/logUp/VerifyEmail')
              } else {
                message.error('registration failed', 3)
              }
            })
            .catch(err => {
              this.setState({
                loadVisible: false
              })
              message.error(`Error:${err.message}`)
              console.log('注册接口抛出错误：', err);
            })
        }
      })
      .catch(err => {
        this.setState({
          loadVisible: false
        })
        message.error(`Error:${err.message}`)
        console.log('检测邮箱号的接口出错了', err);
      })
  }
  _next = () => {
    let { name, lastName, email, code, phone, password1, password, } = this.state
    message.destroy()
    console.log({ name, email, code, phone, password1, password, });
    email = email.toLocaleLowerCase()
    if (name.length <= 0) {
      message.error('Please enter your first name', 3)
      return
    }
    if (lastName.length <= 0) {
      message.error('Please enter your last name', 3)
      return
    }
    if (!email) {
      message.error('Please enter the mailbox number', 3)
      return
    } else {
      if (email.indexOf('@') === -1 || email.indexOf('@') === 0 || email.indexOf('@') === email.length - 1) {
        message.error('E-mail format is incorrect', 3)
        return
      }
    }
    // if (!phone) {
    //   message.error('Please enter the phone number', 3)
    //   return
    // }
    if (password.length <= 0 || password1.length <= 0) {
      message.error('Please enter the password', 3)
      return
    }

    if (password !== password1) {
      message.error('The password entered twice is incorrect, please re-enter', 3)
      return
    }
    this.setState({
      loadVisible: true
    })


    let params = {
      firstName: name,
      lastName,
      email,
      hash: password,
    }
    if (phone) {
      params.phone = `+${code}${phone}`
    }
    console.log('注册接口的入参：', params);
    registByAWSSES(params)
      .then(res => {
        this.setState({
          loadVisible: false
        })
        console.log('注册接口返回数据：', res);
        switch (res.code) {
          case 11011:
            console.log('用户已存在，应该跳出弹框')
            this.setState({
              visible: true
            })

            break;

          case 20000:
            console.log('可以注册，跳转到下一页');
            temporaryStorage.logupEmailCode = res.data
            params.code = code
            params.initPhone = phone
            params.imgArrayIndex = this.state.imgArrayIndex
            temporaryStorage.logupVetInfo = params
            this.props.history.push('/uesr/logUp/VerifyEmail')
            break;

          default:
            break;
        }
        // if (res.flag) {
        //   console.log('注册成功了，去验证验证码');
        //   temporaryStorage.logupEmailCode = res.data
        //   params.code = code
        //   params.initPhone = phone
        //   params.imgArrayIndex = this.state.imgArrayIndex
        //   temporaryStorage.logupVetInfo = params
        //   this.props.history.push('/uesr/logUp/VerifyEmail')
        // } else {
        //   message.error('registration failed', 3)
        // }
      })
      .catch(err => {
        this.setState({
          loadVisible: false
        })
        message.error(`Error:${err.message}`)
        console.log('注册接口抛出错误：', err);
      })

  }
  _signIn = (e) => {
    e.preventDefault();
    this.props.history.push('/page11')
  }



  render() {

    let { lastName, disabled, bounds, name, email, phone, password, password1, visible } = this.state
    return (
      <div id="vetPrifile" >
        {/* 关闭缩小 */}
        <div className="heard">
          <MaxMin
            onClick={() => { this.props.history.push('/') }}
            onClick1={() => this.props.history.push('/')}
          />
        </div>
        <div className="body">
          <div className="text"
            style={{ fontSize: px(30), marginBottom: px(120) }}
          >
            Let’s start by creating your account
          </div>
          <div className="form" >
            <div className="item" style={{ marginBottom: px(40) }}>
              <div className="l" style={{ margin: `0 ${px(8)}px` }}>
                <input
                  type="text"
                  value={name}
                  placeholder="First Name"
                  onChange={(value) => {
                    let data = value.target.value

                    this.setState({
                      name: data
                    })
                  }}
                />

              </div>
              <div className="l" style={{ margin: `0 ${px(8)}px` }}>
                <input
                  type="text"
                  value={lastName}
                  placeholder="Last Name"
                  onChange={(value) => {
                    let data = value.target.value

                    this.setState({
                      lastName: data
                    })
                  }}
                />

              </div>
            </div>

            <div className="item" style={{ marginBottom: px(40) }}>
              <div className="l" style={{ margin: `0 ${px(8)}px` }}>
                <input
                  type="Email"
                  value={email}
                  placeholder="Email Address*"
                  onChange={(value) => {
                    let data = value.target.value
                    this.setState({
                      email: data
                    })
                  }}
                />
              </div>
              <div className="l" style={{ margin: `0 ${px(8)}px` }}>
                <ul id="list" style={{ top: -px(80), left: px(10) }}>
                  {countryList.map((item, index) => {
                    let url = imgArray[item.locale.toLowerCase()] ? imgArray[item.locale.toLowerCase()].default : ''
                    return (
                      <li key={index}>
                        <div key={index}
                          style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}
                          onClick={() => {
                            console.log(item, index);
                            this.setState({
                              code: item.code,
                              imgArrayIndex: index
                            })
                            document.getElementById('list').style.display = "none"
                          }}
                        >
                          <img src={url} alt="" />
                          <p >{`${item.en}   +${item.code}`}</p>
                        </div>
                      </li>
                    )
                  })}
                </ul>


                <div className='phone'>
                  <div
                    style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', position: 'absolute', left: '10px' }}
                    onClick={() => {
                      document.getElementById('list').style.display = "block"
                    }}
                  >
                    <img style={{ zIndex: '888' }}
                      src={imgArray[countryList[this.state.imgArrayIndex].locale.toLowerCase()].default} alt=""
                    />
                    <CaretDownFilled style={{ marginRight: '10px' }} />
                  </div>


                  <input
                    type="Phone"
                    value={phone}
                    placeholder="Phone Number"
                    onChange={(value) => {
                      let data = value.target.value
                      this.setState({
                        phone: data.replace(/[^\-?\d]/g, '')
                      })
                    }}
                  />
                </div>

              </div>

            </div>


            <div className="item" style={{ marginBottom: px(40) }}>
              <div className="l" style={{ margin: `0 ${px(8)}px` }}>
                <input
                  type="Password"
                  value={password}
                  placeholder="Create Password"
                  onChange={(value) => {
                    let data = value.target.value
                    this.setState({
                      password: data
                    })
                  }}
                />
              </div>
              <div className="l" style={{ margin: `0 ${px(8)}px` }}>
                <input
                  type="Password"
                  value={password1}
                  placeholder="Confirm  Password"
                  onChange={(value) => {
                    let data = value.target.value
                    this.setState({
                      password1: data
                    })
                  }}
                />
              </div>
            </div>


          </div>
        </div>




        <div className="foot">
          <div className="footText"
          >Already have an accoun? <a href="#" onClick={this._signIn}> Sign In</a></div>

          {/* 按钮 */}
          <div className="btn" style={{ padding: `${px(40)}px 0` }}>
            <Button
              type="primary"
              shape="round"
              size='large'
              htmlType="submit"
              onClick={this._next}
            >
              Next
            </Button>
          </div>
        </div>

        <MyModal

          visible={this.state.loadVisible}
        />

        <Modal

          visible={visible}
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
            <div className="title">Email Already Exists</div>

            <div className='text'>Please sign up with your Mella<br />account and create a new<br />workspace from the<br />Settings menu.</div>

            <div className="btn">

              <button
                onClick={() => {
                  this.setState({
                    visible: false,
                    email: ''
                  })
                }}
              >Try Again</button>
              <button
                onClick={() => {
                  this.setState({
                    visible: false
                  })
                  this.props.history.replace('/page11')
                }}
              >Sign Up</button>

            </div>
          </div>


        </Modal>
      </div>


    )
  }
}

