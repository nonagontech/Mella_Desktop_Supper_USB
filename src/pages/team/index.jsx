import React, { Component, } from 'react'
import {
  Tag,
  Input,
  Tooltip,
  message,
} from 'antd';
import { PlusOutlined } from '@ant-design/icons';

import MaxMin from '../../utils/maxminreturn/MaxMinReturn'
import temporaryStorage from '../../utils/temporaryStorage'
import { fetchRequest2 } from '../../utils/FetchUtil2';
import { px } from '../../utils/px';
import Button from '../../utils/button/Button';
import MyModal from '../../utils/myModal/MyModal';

import './index.less';
import { checkUser, mellaLogin } from '../../api';

export default class Team extends Component {

  state = {

    tags: [],
    inputVisible: false,
    inputValue: '',
    editInputIndex: -1,
    editInputValue: '',
    visible: false
  }

  componentDidMount() {
    let ipcRenderer = window.electron.ipcRenderer
    ipcRenderer.send('big')

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


  handleClose = removedTag => {
    const tags = this.state.tags.filter(tag => tag !== removedTag);
    console.log(tags);
    this.setState({ tags });
  };

  showInput = () => {
    this.setState({ inputVisible: true }, () => this.input.focus());
  };

  handleInputChange = e => {
    this.setState({ inputValue: e.target.value });
  };

  handleInputConfirm = () => {
    const { inputValue } = this.state;
    let { tags } = this.state;
    if (inputValue && tags.indexOf(inputValue) === -1) {
      console.log('输入的内容为：', inputValue);
      message.destroy()
      checkUser(inputValue)
        .then(res => {


          console.log('检测邮箱存不存在', res);

          if (res.code) {
            switch (res.code) {

              case 11011:
                console.log('邮箱存在，发送邮件');
                tags = [...tags, inputValue];
                console.log(tags);

                this.setState({
                  tags,
                  inputVisible: false,
                  inputValue: '',
                });
                break;
              // case 11012:
              //     console.log('账号被限制、注册未激活状态');



              // case 11013:
              //     console.log('邮箱未被注册，跳出弹框询问是否前往注册');
              case 11014:
                console.log('邮箱被注销或者封停，跳出弹框询问是否前往注册');
                message.error('This mailbox was not found!', 3)
                this.setState({
                  inputVisible: false,
                  inputValue: '',
                });
                break;

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
          message.error(`Error:${err.message}`)
          console.log('检测邮箱号的接口出错了', err);
        })


    }

  };


  saveInputRef = input => {
    this.input = input;
  };

  saveEditInputRef = input => {
    this.editInput = input;
  };

  _next = () => {
    message.destroy()
    let { tags } = this.state
    let { userId } = temporaryStorage.logupSuccessData
    let { organizationId } = temporaryStorage.logupOrganization
    console.log({ tags, userId, organizationId });
    if (tags.length === 0) {
      this._logIn()
    }
    this.setState({
      visible: true
    })
    console.log('入参:', tags);
    fetchRequest2(`/user/inviteUserByEmail/${userId}/${organizationId}`, "POST", tags)
      .then(res => {
        console.log(res);
        if (res.flag === true) {
          console.log('成功，跳转');
          message.success('Invitation successful', 3)
          this._logIn()
        } else {
          this.setState({
            visible: false
          })
        }

      })
      .catch(err => {
        this.setState({
          visible: false
        })
        console.log(err);
        message.error(err.message, 3)
      })
  }
  _logIn = () => {

    let storage = window.localStorage;
    let sign = storage.saveSign
    try {
      sign = JSON.parse(sign)
    } catch (error) {

    }

    let { email, hash } = sign
    let params = {
      email: email.replace(/(^\s*)/g, ""),
      hash,
      identityTypeId: '1'
    }
    console.log('登录入参:', params);
    mellaLogin(params)
      .then(res => {
        console.log(res);
        this.setState({
          visible: false
        })
        if (res.status && res.status === 404) {
          message.error('system error');
          return
        }
        if (res.code === 10001 && res.msg === '账号错误') {
          message.error('Account error');
          return
        }
        if (res.code === 10002 && res.msg === '密码错误') {
          message.error('wrong password')
          return;
        }
        if (res.code === 0 && res.msg === 'success' && res.success.roleId === 1) {
          message.error('You do not have the authority of a doctor, please contact the administrator or customer service', 10)
          return
        }

        if (res.code === 0 && res.msg === 'success') {
          console.log('账号密码正确，登录进去了');
          let { userWorkplace, lastOrganization, token } = res.success
          storage.token = token
          storage.userId = ''

          storage.userId = res.success.userId
          storage.roleId = res.success.roleId

          //每次登陆后清空宠物列表缓存的数据
          storage.doctorList = ''
          storage.defaultCurrent = ''




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
            console.log('----------key值为：', connectionKey);
            storage.connectionKey = connectionKey

          } else {
            storage.userWorkplace = ''
            storage.connectionKey = ''

          }







          this.props.history.push('/menuOptions/ConnectWorkplace')


        }
      })
      .catch(err => {
        this.setState({
          visible: false
        })
        console.log(err);
      })
  }






  render() {
    const { tags, inputVisible, inputValue, editInputIndex, editInputValue } = this.state;
    // console.log('---', editInputIndex);
    return (
      <div id="inviteTeam" >
        {/* 关闭缩小 */}
        <div className="heard">
          <MaxMin
            onClick={() => { this.props.history.push('/') }}
            onClick1={() => this.props.history.goBack()}
          />
          <div className="text">Invite your Team</div>

          <div className="addF">
            <p>To:</p>
            <div className="add">

              <>
                {tags.map((tag, index) => {
                  const isLongTag = tag.length > 25;  //标签里面的字符串的长度

                  const tagElem = (
                    <Tag
                      className="edit-tag"
                      key={tag}
                      closable={true}
                      onClose={() => this.handleClose(tag)}
                    >
                      <span>
                        {isLongTag ? `${tag.slice(0, 25)}...` : tag}
                      </span>
                    </Tag>
                  );
                  return isLongTag ? (
                    <Tooltip title={tag} key={tag}>
                      {tagElem}
                    </Tooltip>
                  ) : (
                    tagElem
                  );
                })}
                {inputVisible && (
                  <Input
                    ref={this.saveInputRef}
                    type="text"
                    size="small"
                    className="tag-input"
                    value={inputValue}
                    onChange={this.handleInputChange}
                    onBlur={this.handleInputConfirm}
                    onPressEnter={this.handleInputConfirm}
                  />
                )}
                {!inputVisible && (
                  <Tag className="site-tag-plus" onClick={this.showInput}>
                    <PlusOutlined />Press Enter to add mailbox
                  </Tag>
                )}
              </>
            </div>
          </div>
        </div>

        <div className="btn"
          style={{ padding: `${px(40)}px 0` }}
        >
          <Button
            type="primary"
            shape="round"
            size='large'
            htmlType="submit"
            onClick={this._logIn}
            text={'Skip'}
          >
            Skip
          </Button>
          <Button
            type="primary"
            shape="round"
            size='large'
            htmlType="submit"
            onClick={this._next}
            text={'Send'}
          >

          </Button>
        </div>
        <MyModal visible={this.state.visible} />

      </div>


    )
  }
}
