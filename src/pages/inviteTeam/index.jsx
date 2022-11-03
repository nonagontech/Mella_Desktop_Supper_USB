
/**
 *
 * this.props.location.isAddDoctor是上个组件传过来的标志,为true代表从设置里面的邀请跳转过来的
 */
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
import { px } from '../../utils/px';
import Button from '../../utils/button/Button'
import MyModal from '../../utils/myModal/MyModal';

import './index.less';
import { checkUser, mellaLogin } from '../../api';
import { inviteUserByEmail } from '../../api/melladesk/user';
let storage = window.localStorage;
export default class InviteTeam extends Component {
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
    let { isAddDoctor } = this.props.location
    message.destroy()
    let { tags } = this.state
    let { userId } = !isAddDoctor ? temporaryStorage.logupSuccessData : storage
    let organizationId = !isAddDoctor ? temporaryStorage.logupOrganization.organizationId : storage.lastOrganization
    console.log({ tags, userId, organizationId });
    if (tags.length === 0) {
      message.error('Please enter the invitation email')
      return
    }
    this.setState({
      visible: true
    })
    console.log('入参:', tags);

    inviteUserByEmail(userId, organizationId, tags)
      .then(res => {
        console.log(res);
        if (res.flag === true) {
          console.log('成功，跳转');
          message.success('Invitation successful', 3)
          if (!isAddDoctor) {
            this._logIn()
          } else {
            this.setState({
              visible: false
            })
            this.props.history.goBack()
          }

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
    let { email, hash } = temporaryStorage.logupVetInfo
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
          let { userWorkplace, lastOrganization, token, lastName, firstName } = res.success
          storage.token = token
          storage.userId = ''
          storage.userName = `${lastName} ${firstName}`
          storage.userEmail = email
          let data = {
            email: email.replace(/(^\s*)/g, ""),
            hash,
          };
          data = JSON.stringify(data);
          storage.saveSign = data;

          storage.userId = res.success.userId
          storage.roleId = res.success.roleId

          //每次登陆后清空宠物列表缓存的数据
          storage.doctorList = ''
          storage.defaultCurrent = ''



          //由于后台接口原因，导致这里的最后工作场所可能不是自己的，因此下面全注释掉。改成如果有多个工作场所则跳转到选择工作场所界面，不是多个则跳转到选择宠物界面
          if (res.success.lastWorkplaceId) {
            storage.lastWorkplaceId = res.success.lastWorkplaceId;
          } else {
            storage.lastWorkplaceId = "";
          }

          if (res.success.lastOrganization) {
            storage.lastOrganization = res.success.lastOrganization;
          } else {
            storage.lastOrganization = "";
          }

          if (userWorkplace) {
            storage.userWorkplace = JSON.stringify(userWorkplace)
            let connectionKey = ''

            for (let i = 0; i < userWorkplace.length; i++) {
              const element = userWorkplace[i];
              if (element.organizationEntity) {
                if (
                  element.organizationEntity.organizationId === lastOrganization
                ) {
                  if (element.organizationEntity.connectionKey) {
                    connectionKey = element.organizationEntity.connectionKey;
                  }
                  if (element.roleId) {
                    console.log(element.roleId);
                    storage.roleId = element.roleId;
                  }

                  break;
                }
              }
            }
            console.log("----------key值为：", connectionKey);
            storage.connectionKey = connectionKey;

          } else {
            storage.userWorkplace = ''
            storage.connectionKey = ''

          }
          this.props.history.push("/MainBody");


        }
      })
      .catch(err => {
        this.setState({
          visible: false
        })
        console.log(err);
      })
  }

  _food = () => {
    if (!this.props.location.isAddDoctor) {

    }
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
          {
            !this.props.location.isAddDoctor && <Button
              type="primary"
              shape="round"
              size='large'
              htmlType="submit"
              onClick={this._logIn}
              text={'Skip'}
            >
              Skip
            </Button>
          }

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
