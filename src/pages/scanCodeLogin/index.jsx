import React, { Component } from 'react'
import {
  Button,
} from 'antd';

import temporaryStorage from '../../utils/temporaryStorage';
import { px } from '../../utils/px'

import './index.less';
import { loginWithQRcode } from '../../api/melladesk/user';

let storage = window.localStorage;
let flog = false
export default class ScanCodeLogin extends Component {

  state = {
    name: '',
    url: ''
  }
  componentDidMount() {
    let ipcRenderer = window.electron.ipcRenderer
    ipcRenderer.send('small')
    this.timer = setInterval(() => {
      this._getUser()
    }, 1000);
    console.log(this.props.history);
    let { name, url } = this.props.history.location.params
    this.setState({
      name,
      url
    })
  }
  componentWillUnmount() {
    this.timer && clearInterval(this.timer)
  }
  _getUser = () => {
    loginWithQRcode(temporaryStorage.QRToken)
      .then(res => {
        console.log('-----：', res);
        if (res.flag === true) {
          switch (res.code) {
            case 10001:
              console.log('未扫码');
              flog = false
              this.props.history.goBack()

              break;

            case 11033:
              console.log('扫码未点击登录');
              flog = false
              // let { name, url } = res.data
              // if (name === this.state.name && url === this.state.url) {
              //   return
              // }
              // this.setState({
              //   name,
              //   url
              // })
              break;

            case 11023:
              console.log('过期');
              this.timer && clearInterval(this.timer)
              if (!flog) {
                this.props.history.replace('/page11')
              }


              break;
            case 20000:
              this.timer && clearInterval(this.timer)
              console.log('--------------成功');
              flog = true
              let success = res.data
              let { userWorkplace, lastOrganization } = success

              storage.userId = success.userId
              storage.roleId = success.roleId

              //每次登陆后清空宠物列表缓存的数据
              storage.doctorList = ''
              storage.defaultCurrent = ''

              if (success.lastWorkplaceId) {
                storage.lastWorkplaceId = success.lastWorkplaceId
              } else {
                storage.lastWorkplaceId = ''
              }

              if (success.lastOrganization) {
                storage.lastOrganization = success.lastOrganization
              } else {
                storage.lastOrganization = ''
              }



              if (userWorkplace) {
                storage.userWorkplace = JSON.stringify(userWorkplace)
                let connectionKey = ''
                for (let i = 0; i < userWorkplace.length; i++) {
                  const element = userWorkplace[i];
                  if (element.organizationEntity) {
                    if (element.organizationEntity.organizationId === lastOrganization) {

                      if (element.organizationEntity.connectionKey) {
                        connectionKey = element.organizationEntity.connectionKey
                      }
                      if (element.roleId) {
                        console.log(element.roleId);
                        storage.roleId = element.roleId
                      }

                      break
                    }
                  }
                }
                storage.connectionKey = connectionKey

              } else {
                storage.userWorkplace = ''
                storage.connectionKey = ''
              }
              this.props.history.push('/uesr/selectExam')






              // storage.userId = res.data.userId
              // storage.roleId = res.data.roleId
              // if (res.data.lastWorkplaceId) {
              //   storage.lastWorkplaceId = res.data.lastWorkplaceId
              // } else {
              //   storage.lastWorkplaceId = ''
              // }
              // if (res.data.lastOrganization) {
              //   storage.lastOrganization = res.data.lastOrganization
              // } else {
              //   storage.lastOrganization = ''
              // }
              // this.props.history.push('/uesr/selectExam')


              break;

            default:

              break;
          }
        }
        console.log('code', res.code);
      })
      .catch(err => {
        console.log(err);
      })
  }

  _continue = () => {
    this.props.history.replace('/page11')

  }

  render() {
    let { url } = this.state
    return (
      <div id="scanCodeLogin" className='pt-3'>


        <div className="text  mb-3"
          style={{ fontSize: px(26), width: px(350), marginTop: px(20), marginBottom: px(40) }}
        >
          <h1>Need to confirm login on mobile phone</h1>
        </div>

        <div className="bodycenter">
          <div className="imgF ">
            <img src={url} alt="" style={{ width: px(150), hight: px(150) }} />
          </div>
          <p>{this.state.name}</p>
          <div className="success" style={{ marginTop: px(30) }}>Scan code completed</div>
        </div>
        <div className="button1" style={{ height: px(150) }}>
          <Button
            style={{ width: px(300), fontSize: px(18), height: px(300 / 6.5) }}
            type="primary"
            shape="round"
            size='large'
            onClick={this._continue}
          >
            Cancel login
          </Button>

        </div>


      </div>
    )
  }
}
