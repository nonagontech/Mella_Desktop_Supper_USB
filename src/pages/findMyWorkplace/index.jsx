import React, { Component } from 'react'
import {
  Input,
  message
} from 'antd';
import { createFromIconfontCN } from '@ant-design/icons';

import MaxMin from '../../utils/maxminreturn/MaxMinReturn'
import temporaryStorage from '../../utils/temporaryStorage'
import Button from '../../utils/button/Button'

import './index.less'
import { listAllWorkplaceByOrganizationId } from '../../api/mellaserver/workplace';
import { mellaLogin, updateUserInfo } from '../../api/mellaserver/user';

const MyIcon = createFromIconfontCN({
  scriptUrl: '//at.alicdn.com/t/font_2326495_7b2bscbhvvt.js'
})
export default class JoinworkplaceByName extends Component {

  state = {
    search: '',
    listData: [],
    searchData: [],
    selectId: {}

  }
  componentDidMount() {
    let ipcRenderer = window.electron.ipcRenderer
    ipcRenderer.send('small')

    listAllWorkplaceByOrganizationId(temporaryStorage.logupSelectOrganization.organizationId)
      .then((res) => {
        console.log(res);
        if (res.msg === 'success') {
          this.setState({
            listData: res.data
          })
        } else {
          console.log('请求错误');
        }
      })
      .catch((err) => {
        console.log(err);
      })
  }
  _search = (val) => {
    let search = val.target.value
    let { listData } = this.state
    let searchData = []
    for (let i = 0; i < listData.length; i++) {
      if (listData[i].name.toLowerCase().indexOf(search.toLowerCase()) !== -1) {
        searchData.push(listData[i])
      }
    }
    this.setState({
      search,
      searchData
    })

  }
  _list = () => {
    const { search, listData, searchData } = this.state
    let data = (search.length > 0) ? searchData : listData
    let option = data.map((item, index) => {

      return <li key={item.workplaceId}
        onClick={() => {
          this.setState({
            selectId: item
          })
          console.log(item);
          let params = {
            userId: temporaryStorage.logupSuccessData.userId,
            roleId: 2,
            workplaceId: item.workplaceId,
            organizationId: item.organizationId
          }
          updateUserInfo(params)
            .then(res => {
              console.log(res);
              if (res.flag === true) {

                console.log('成功',);
                this._logIn()
              }
            })
            .catch(err => {
              console.log(err);
              message.error(err.message, 3)
            })
        }}

      >
        {(this.state.selectId === item ? <span className="search">&#xe614;</span> : null)}
        {item.workplaceName}</li>
    })
    return (
      <ul>
        {option}
      </ul>
    )
  }

  _logIn = () => {

    let storage = window.localStorage;
    let { email, hash } = temporaryStorage.logupVetInfo
    let params = {
      email: email.replace(/(^\s*)/g, ""),
      hash,
      identityTypeId: '1'
    }
    mellaLogin(params)
      .then(res => {
        console.log(res);
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
            const element = userWorkplace[0];
            storage.lastOrganization = element.organizationEntity.organizationId
            storage.lastWorkplaceId = element.workplaceEntity.workplaceId
            if (element.organizationEntity.connectionKey) {
              connectionKey = element.organizationEntity.connectionKey
            }
            if (element.roleId) {
              console.log(element.roleId);
              storage.roleId = element.roleId
            }
            if (userWorkplace.length === 1) {
              this.props.history.push('/uesr/selectExam')

            } else {
              this.props.history.push('/page12')
            }
          } else {
            storage.userWorkplace = ''
            storage.connectionKey = ''
            this.props.history.push('/uesr/selectExam')
          }


        }
      })
      .catch(err => {
        console.log(err);
      })
  }
  render() {
    return (
      <div id="findMyWorkplace">
        {/* 关闭缩小 */}
        <MaxMin
          onClick={() => { this.props.history.push('/') }}
          onClick1={() => this.props.history.goBack()}
        />
        <div className="body">
          <div className="text">Find my workplace</div>

          <div className="searchBox">
            <div><MyIcon type='icon-sousuo' className="icon" /></div>

            <Input
              placeholder="Please input workplace name"
              bordered={false}
              allowClear={true}
              value={this.state.search}
              onChange={this._search}
            />

          </div>


          <div className="list">
            {this._list()}
          </div>
          <Button
            text={'My Workplace Isn`t Listed'}
            textBoxStyle={{ marginTop: '50px' }}
            onClick={() => {
              this.props.history.push('/uesr/logUp/NewWorkplace')
            }}
          />
        </div>




      </div>
    )
  }
}
