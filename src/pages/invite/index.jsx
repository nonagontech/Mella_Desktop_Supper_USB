import React, { Component, } from 'react'
import {
  Tag,
  Input,
  Tooltip,
  message,
} from 'antd';
import { PlusOutlined } from '@ant-design/icons';


import MaxMin from '../../utils/maxminreturn/MaxMinReturn'
import { px } from '../../utils/px';
import Button from '../../utils/button/Button'
import MyModal from '../../utils/myModal/MyModal';

import './index.less';
import { checkUser } from '../../api';
import { inviteUserByEmail } from '../../api/melladesk/user';

let storage = window.localStorage;

export default class Invite extends Component {

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
          console.log(res);
          if (res.code === 11011) {
            console.log('邮箱号以被注册，是否忘记密码');
            tags = [...tags, inputValue];
            console.log(tags);

            this.setState({
              tags,
              inputVisible: false,
              inputValue: '',
            });
          }
          else {
            message.error('This mailbox was not found!', 3)
            this.setState({
              inputVisible: false,
              inputValue: '',
            });
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
    let userId = storage.userId
    let organizationId = storage.lastOrganization
    console.log({ tags, userId, organizationId });
    if (tags.length === 0) {
      message.error('Please enter the invitation email')
      return
    }
    this.setState({
      visible: true
    })

    inviteUserByEmail(userId, organizationId, tags)
      .then(res => {
        console.log(res);
        this.setState({
          visible: false
        })
        if (res.flag === true) {
          console.log('成功，跳转');
          message.success('Invitation successful', 3)
          this.props.history.goBack()

        } else {
          message.error('Invitation failed')

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
  render() {
    const { tags, inputVisible, inputValue, editInputIndex, editInputValue } = this.state;
    console.log('---', editInputIndex);
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

          {/* <Button
            type="primary"
            shape="round"
            size='large'
            htmlType="submit"
            onClick={this._next}
            text={'Send'}
          >

          </Button> */}

          <Button

            onClick={this._next}
            text={'Send'}
            textBoxStyle={{ height: px(45), width: '45%' }}
          >

          </Button>
        </div>
        <MyModal visible={this.state.visible} />

      </div>


    )
  }
}
