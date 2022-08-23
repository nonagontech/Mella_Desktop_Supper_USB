import React, { Component } from 'react'
import {
  message,
  Modal,
  Input
} from 'antd';
import MaxMin from '../../../utils/maxminreturn/MaxMinReturn'
import { createFromIconfontCN, SyncOutlined } from '@ant-design/icons';
import Button from './../../../utils/button/Button'
import Close from './../../../assets/img/close.png'
import left1 from './../../../assets/img/left1.png'
import { fetchRequest } from '../../../utils/FetchUtil1';
import temporaryStorage from '../../../utils/temporaryStorage';
import { px } from '../../../utils/px'
import MyModal from '../../../utils/myModal/MyModal';
import { fetchRequest2 } from '../../../utils/FetchUtil2';
import './index.less';


const MyIcon = createFromIconfontCN({
  scriptUrl: '//at.alicdn.com/t/font_2326495_7b2bscbhvvt.js'
})
export default class FindWorkplace extends Component {

  state = {
    search: '',
    listData: [],
    searchData: [],
    selectId: {},
    isOrg: false,       //nodel框是否显示
    isWorkplace: false,
    workplaceList: [],
    disabled: true,       //model是否可拖拽
    bounds: { left: 0, top: 0, bottom: 0, right: 0 },
    selectworkplace: {}
  }
  componentDidMount () {
    let ipcRenderer = window.electron.ipcRenderer
    ipcRenderer.send('big')
    fetchRequest(`/organization/listAll`, "GET", '')
      .then((res) => {
        console.log(res);
        if (res.msg === 'success') {
          this.setState({
            listData: res.data
          })
        }
      })
      .catch((err) => {
        console.log(err);
      })
    this.setState({
      selectId: temporaryStorage.logupSelectOrganization
    })
    temporaryStorage.logupSelectOrganization = {}

    //监听屏幕分辩率是否变化，变化就去更改界面内容距离大小
    ipcRenderer.on('changeFenBianLv', this.changeFenBianLv)



  }
  componentWillUnmount () {
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
  onStart = (event, uiData) => {
    const { clientWidth, clientHeight } = window?.document?.documentElement;
    const targetRect = this.draggleRef?.current?.getBoundingClientRect();
    this.setState({
      bounds: {
        left: -targetRect?.left + uiData?.x,
        right: clientWidth - (targetRect?.right - uiData?.x),
        top: -targetRect?.top + uiData?.y,
        bottom: clientHeight - (targetRect?.bottom - uiData?.y)
      }
    });
  };

  _logIn = () => {

    let storage = window.localStorage;
    let { email, hash } = temporaryStorage.logupVetInfo
    let params = {
      email: email.replace(/(^\s*)/g, ""),
      hash,
      identityTypeId: '1'
    }
    console.log('---登录入参', params);
    fetchRequest('/user/mellaLogin', 'POST', params)
      .then(res => {
        console.log(res);
        this.setState({
          isLoading: false
        })
        if (res.status && res.status === 404) {
          message.error('system error');
          return
        }
        if (res.status && res.status === 500) {
          message.error('Internal Server Error');
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
          this.setState({
            isOrg: false,
            isWorkplace: false
          })

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
              this.props.history.push("/MainBody");

            } else {
              this.props.history.push('/page12')
            }
          } else {
            storage.userWorkplace = ''
            storage.connectionKey = ''
            this.props.history.push("/MainBody");
            storage.lastOrganization = ''
            storage.lastWorkplaceId = ''
          }

        }
        if (res.code === 10000 && res.msg === '系统内部错误') {
          message.error('system error')
        }
      })
      .catch(err => {
        console.log(err);
        this.setState({
          isLoading: false
        })
        message.error('Login failed')
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
  _searchworkPlace = (val) => {
    let search = val.target.value
    let listData = this.state.workplaceList
    console.log('----------------', listData);
    let searchData = []
    for (let i = 0; i < listData.length; i++) {
      if (listData[i].workplaceName.toLowerCase().indexOf(search.toLowerCase()) !== -1) {
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
      return <li key={item.organizationId}
        onClick={() => {
          this.setState({
            selectId: item
          })
          console.log(item);
          temporaryStorage.logupSelectOrganization = item


        }}

      >
        <div className="item"> {item.name}</div>

        {(this.state.selectId.organizationId === item.organizationId ? <span className="search">&#xe614;</span> : null)}
      </li>
    })
    return (
      <ul>
        {option}
      </ul>
    )
  }

  _list1 = () => {
    const { search, workplaceList, searchData } = this.state
    let data = (search.length > 0) ? searchData : workplaceList
    let option = data.map((item, index) => {
      return <li key={item.workplaceId}
        onClick={() => {
          this.setState({
            selectworkplace: item
          })
          console.log(item);

        }}

      >

        {item.workplaceName}
        {(this.state.selectworkplace === item ? <span className="search">&#xe614;</span> : null)}
      </li>

    })
    return (
      <ul>
        {option}
      </ul>
    )
  }

  _goNewOrg = (e) => {
    e.preventDefault();
    this.setState({
      isOrg: false,
      isWorkplace: false
    })
    this.props.history.push('/uesr/logUp/NewOrganization')
  }
  _goNewWorkplace = (e) => {
    e.preventDefault();
    this.setState({
      isOrg: false,
      isWorkplace: false
    })
    this.props.history.push('/uesr/logUp/NewWorkplace')
  }
  _goWorkplace = () => {
    console.log('前往工作场所');
    fetchRequest(`/workplace/listAllWorkplaceByOrganizationId/${temporaryStorage.logupSelectOrganization.organizationId}`, "GET", '')
      .then((res) => {
        console.log(res);
        if (res.msg === 'success') {
          this.setState({
            workplaceList: res.data,
            isOrg: false,

          }, () => {
            this.setState({
              isWorkplace: true
            })
          })
        } else {
          console.log('请求错误');
        }
      })
      .catch((err) => {
        console.log(err);
      })
  }
  _addworkplaced = () => {
    let params = {
      userId: temporaryStorage.logupSuccessData.userId,
      roleId: 2,
      workplaceId: this.state.selectworkplace.workplaceId,
      organizationId: this.state.selectworkplace.organizationId
    }
    console.log('入参：', params);
    this.setState({
      isLoading: true,
      isWorkplace: false,
      isOrg: false
    })

    fetchRequest('/user/updateUserInfo', 'POST', params)
      .then(res => {
        console.log(res);

        if (res.flag === true) {
          message.success('Join successfully', 3)

          console.log('成功',);
          this._logIn()
        } else {
          this.setState({
            isLoading: false
          })
          message.error('Join failed', 3)
        }
      })
      .catch(err => {
        this.setState({
          isLoading: false
        })
        console.log(err);
        message.error(err.message, 3)
      })
  }

  render () {
    let { disabled, bounds, isOrg, isWorkplace } = this.state
    return (
      <div id="joinOrganizationByOption">
        <div className="heard">
          {/* 关闭缩小 */}
          <MaxMin
            onClick={() => { this.props.history.push('/') }}
            onClick1={() => this.props.history.push('/uesr/logUp/VetPrifile')}
          />
        </div>

        <div className="body">
          <div className="text">Join an Organization</div>

          <div className="way" style={{ marginTop: px(20), marginBottom: px(60) }}>
            <div className="item" style={{ paddingTop: px(60) }}
              onClick={() => {
                // this.props.history.push('/uesr/logUp/FindMyOrganization')
                this.setState({
                  isOrg: true
                })
                console.log('搜索名称加入');
              }}
            >
              <div className="iconBox">
                <MyIcon type='icon-search' className="icon" />
              </div>
              <div className="r">

                <div className="title">Search organization</div>

                <div className="arrow">
                  <MyIcon type='icon-jiantou2' className="icon" />
                </div>
              </div>
            </div>



            <div className="item" style={{ paddingTop: px(60) }}
              onClick={() => {
                console.log('创建');
                this.props.history.push('/uesr/logUp/NewOrganization')
              }}>
              <div className="iconBox">
                <MyIcon type='icon-tianjia4' className="icon" />
              </div>
              <div className="r">
                <div className="listtext">
                  <div className="title">Create an organization</div>
                </div>
                <div className="arrow">
                  <MyIcon type='icon-jiantou2' className="icon" />
                </div>
              </div>
            </div>

            <div className="item" style={{ paddingTop: px(60) }}
              onClick={() => {

                let params = {
                  userId: temporaryStorage.logupSuccessData.userId,
                  roleId: 2,
                }
                message.destroy()
                this.setState({
                  isLoading: true
                })
                console.log('搜索id加入', params);
                fetchRequest2('/user/updateUserInfo', 'POST', params)
                  .then(res => {
                    console.log(res);
                    if (res.flag === true) {

                      console.log('成功',);
                      this._logIn()
                    } else {
                      this.setState({
                        isLoading: false
                      })
                      message.error('Identity update failed')
                    }
                  })
                  .catch(err => {
                    console.log(err);
                    message.error(err.message, 3)
                  })
              }}>
              <div className="iconBox">
                <MyIcon type='icon-guanbi2' className="icon" />
              </div>
              <div className="r">
                <div className="listtext">
                  <div className="title">Continue without organization</div>
                </div>
                <div className="arrow">
                  <MyIcon type='icon-jiantou2' className="icon" />
                </div>
              </div>
            </div>
          </div>
        </div>




        <MyModal
          visible={isOrg}
          element={
            <div className='myfindOrg' >
              <div className="orgHeard">
                <div className="titleicon" style={{ marginTop: px(5) }}>
                  <div
                  // className=" iconfont icon-left return"
                  // onClick={() => { this.setState({ isWorkplace: false, isOrg: true }) }}
                  >
                    {/* <img src={left1} alt="" style={{ height: px(25) }} /> */}
                  </div>
                  <div
                    onClick={() => { this.setState({ isWorkplace: false, isOrg: false }) }}
                  >
                    <img src={Close} alt="" style={{ width: px(25) }} />
                  </div>
                </div>
                <div className="text"
                  onMouseOver={() => {
                    if (disabled) {
                      this.setState({
                        disabled: false,
                      });
                    }
                  }}
                  onMouseOut={() => {
                    this.setState({
                      disabled: true,
                    });
                  }}

                >Find my organization</div>

                <div className="searchBox">

                  <Input
                    placeholder=" &#xe61b; Search organization"
                    bordered={false}
                    allowClear={true}
                    value={this.state.search}
                    onChange={this._search}
                  />

                </div>
              </div>


              <div className="list"

              >
                {this._list()}
              </div>

              <div className="foot">
                <Button
                  text={'Join Organization'}
                  onClick={this._goWorkplace}
                />
                <span style={{ marginTop: px(20) }}>{`Don’t see your organization? `}</span>
                <a href="#" onClick={this._goNewOrg}>Create a new organization</a>
              </div>

            </div>
          }

        />




        <MyModal
          visible={isWorkplace}
          element={
            <div className='myfindOrg' >
              <div className="orgHeard">
                <div className="titleicon" style={{ marginTop: px(5) }}>
                  <div
                    // className=" iconfont icon-left return"
                    onClick={() => { this.setState({ isWorkplace: false, isOrg: true }) }}
                  >
                    <img src={left1} alt="" style={{ height: px(25) }} />
                  </div>
                  <div
                    onClick={() => { this.setState({ isWorkplace: false, isOrg: false }) }}
                  >
                    <img src={Close} alt="" style={{ width: px(25) }} />
                  </div>
                </div>


                <div className="text" style={{ fontSize: px(35) }}>Find my workplace</div>

                <div className="searchBox" style={{ borderRadius: px(15) }} >
                  <Input
                    placeholder=" &#xe61b; Search workplace"
                    bordered={false}
                    allowClear={true}
                    value={this.state.search}
                    onChange={this._searchworkPlace}
                  />

                </div>
              </div>


              <div className="list"

              >
                {this._list1()}
              </div>

              <div className="foot">
                <Button
                  text={'Join Workplace'}
                  onClick={this._addworkplaced}
                />
                <span style={{ marginTop: px(20) }}>{`Don’t see your workplace? `}</span>
                <a href="#" onClick={this._goNewWorkplace}>Create a new workplace</a>
              </div>

            </div>
          }

        />
        <MyModal
          visible={this.state.isLoading}
        />

      </div>
    )
  }
}
