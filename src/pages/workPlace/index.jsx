
import React, { Component, } from 'react'
import {
  Select,
  Button,
} from 'antd';

import logo from '../../assets/images/mellaLogo.png';

import { px, win } from '../../utils/px';
import MaxMin from './../../utils/maxminreturn/MaxMinReturn'
import { fetchRequest4 } from '../../utils/FetchUtil4';
import MyModal from '../../utils/myModal/MyModal';

import './index.less';

const { Option } = Select;
let storage = window.localStorage;
export default class WorkPlace extends Component {
  state = {
    organization: '',
    workplaceList: [],
    spin: false,
    orgArr: [],
    workplaceJson: {},
    workplaceId: '',
    workplaceName: '',
    organizationId: '',
    organizationName: '',
    connectionKey: '',
    selectRoleId: ''

  }
  componentDidMount() {
    let ipcRenderer = window.electron.ipcRenderer
    ipcRenderer.send('Lowbig', win())

    let userWorkplace = []
    try {
      userWorkplace = JSON.parse(storage.userWorkplace) || []
      console.log(userWorkplace);
    } catch (error) {
      console.log('字符串转对象失败', error);
    }
    /*orgArr的格式为[{
      organizationId:1,
      organizationName:'11111',
      connectionKey:''
    }]

     workplace:{
       1:{
          workplaceId:1,
          workplaceName:'122334
        },
     }
    */
    let orgArr = [], workplaceJson = {}
    console.log('存储的工作场所和组织id', storage.lastWorkplaceId, storage.lastOrganization);
    for (let i = 0; i < userWorkplace.length; i++) {
      let element = userWorkplace[i]
      // console.log('每一项的值：', element);
      if (element.organizationEntity && element.workplaceEntity) {
        let { organizationEntity, workplaceEntity, roleId } = element
        const { name, organizationId, connectionKey } = organizationEntity
        const { workplaceName, workplaceId } = workplaceEntity

        if (`${workplaceId}` === storage.lastWorkplaceId) {
          this.setState({
            workplaceName,
            workplaceId: storage.lastWorkplaceId
          })
        }

        if (`${organizationId}` === storage.lastOrganization) {
          this.setState({
            organizationName: name,
            organizationId: storage.lastOrganization
          })
        }

        let orgRepeatFlog = false, repeatFlogNum = -1
        for (let j = 0; j < orgArr.length; j++) {
          console.log(orgArr[j].organizationId, organizationId);
          if (orgArr[j].organizationId === organizationId) {
            orgRepeatFlog = true
            repeatFlogNum = j
            break;
          }

        }
        if (orgRepeatFlog) {
          let workplace = {
            workplaceName, workplaceId
          }
          let id = orgArr[repeatFlogNum].organizationId
          let sameflog = false
          console.log(workplaceJson[`${id}`], workplace);
          for (let k = 0; k < workplaceJson[`${id}`].length; k++) {
            const element = workplaceJson[`${id}`][k];
            if (element.workplaceId === workplace.workplaceId && element.workplaceName === workplace.workplaceName) {
              sameflog = true
              break
            }

          }
          if (!sameflog) {
            workplaceJson[`${id}`].push(workplace)
          }

        } else {
          let connectKey = connectionKey || ''
          let json = {
            organizationId,
            organizationName: name,
            connectionKey: connectKey,
            roleId
          }
          let workplace = [{
            workplaceName, workplaceId
          }]
          workplaceJson[`${organizationId}`] = workplace

          orgArr.push(json)
        }
      }
    }
    console.log('-----转换后的组织信息--', orgArr, workplaceJson);
    this.setState({
      orgArr,
      workplaceJson,
      connectionKey: storage.connectionKey,
      selectRoleId: storage.roleId
    })
    //分辨率改变后窗口自动改变
    ipcRenderer.on('changeFenBianLv', this.changeFenBianLv)

  }

  componentWillUnmount() {
    let ipcRenderer = window.electron.ipcRenderer
    ipcRenderer.removeListener('changeFenBianLv', this.changeFenBianLv)
  }
  changeFenBianLv = (e) => {
    console.log(e);
    let ipcRenderer = window.electron.ipcRenderer
    ipcRenderer.send('Lowbig', win())
    this.setState({

    })
  }
  _select = (value, e) => {
    console.log(value, e);  //value的值为id

  }

  _next = () => {
    // this.props.history.push('/page8')

    let { workplaceId, organizationId, connectionKey, selectRoleId } = this.state
    console.log({ workplaceId, organizationId, connectionKey, selectRoleId });

    // this.setState({
    //   spin: true
    // })
    // fetchRequest(`/organization/updateLastWorkplace/${storage.userId}/${workplaceId}`)
    //   .then(res => {
    //     console.log(res);
    //     this.setState({
    //       spin: false
    //     })
    //     if (res.msg === 'success') {
    //       storage.lastWorkplaceId = workplaceId
    //       this.props.history.goBack()
    //     }
    //   })
    //   .catch(err => {
    //     this.setState({
    //       spin: false
    //     })
    //     console.log(err);
    //   })

    this.setState({
      spin: true
    })
    console.log('入参', { userId: storage.userId, roleId: storage.roleId, workplaceId });
    fetchRequest4(`/user/changeLatestWorkplace/${storage.userId}/${2}/${workplaceId}`, "GET")
      .then(res => {
        console.log('切换成功', res);
        storage.lastWorkplaceId = `${workplaceId}`
        storage.lastOrganization = organizationId
        storage.connectionKey = connectionKey

        if (selectRoleId) {
          storage.roleId = selectRoleId
        }

        this.props.history.push('/uesr/selectExam')

      })
      .catch(err => {
        console.log(err);
        storage.lastWorkplaceId = workplaceId
        storage.lastOrganization = organizationId
        storage.connectionKey = connectionKey

        this.props.history.push('/uesr/selectExam')

      })
  }
  render() {

    let { orgArr, organizationName, workplaceName, workplaceJson, organizationId } = this.state
    let orgOptions = orgArr.map(item => <Option key={item.organizationId} connectionkey={item.connectionKey} roleid={item.roleId} >{item.organizationName}</Option>)
    let workplaceArr = []
    if (workplaceJson[`${organizationId}`]) {
      workplaceArr = workplaceJson[`${organizationId}`]
      console.log('workArr = ', workplaceArr);
    }
    let workplaceOptions = workplaceArr.map(item => <Option key={item.workplaceId}>{item.workplaceName}</Option>)
    return (
      <div id="workplace">
        {/* 关闭缩小 */}
        <div className="header">
          <MaxMin
            onClick={() => { this.props.history.push('/') }}
            onClick1={() => this.props.history.goBack()}
          />
        </div>
        <div className="body flex">
          <div className="img flex">
            <img src={logo} alt="" style={{ width: px(130) }} />
          </div>

          <div className="title">
            <div className="text" style={{ fontSize: px(28), marginBottom: px(40) }}>Verify Organization Information</div>
            <div className="text2" style={{ fontSize: px(24), textAlign: 'center' }}>Good Pets</div>
          </div>


          <div className="selectAll" style={{ marginBottom: px(160) }}>

            <div className="select" >
              <p style={{ fontSize: px(18) }}>Select Organization:</p>
              <Select style={{ width: '40%' }}
                value={organizationName}
                onChange={(val, e) => {
                  console.log(val, e)
                  let workplace = workplaceJson[e.key]
                  console.log(workplace);
                  this.setState({
                    organizationId: e.key,
                    organizationName: e.children,
                    connectionKey: e.connectionkey,
                    workplaceId: workplace[0].workplaceId,
                    workplaceName: workplace[0].workplaceName,
                    selectRoleId: e.roleid
                  })
                }}>
                {/* <Option value="1">UGA Veterinary Teaching Hospital</Option> */}
                {orgOptions}
              </Select>
            </div>

            <div className="select" >
              <p style={{ fontSize: px(18) }}>Select Location:</p>
              <Select style={{ width: '40%' }}
                value={workplaceName}
                onChange={(val, e) => {
                  console.log(val, e)
                  this.setState({
                    workplaceId: e.key,
                    workplaceName: e.children
                  })
                }}>
                {workplaceOptions}
              </Select>
            </div>


          </div>

        </div>

        <div className="foot flex">
          <div className="btn">
            <Button
              type="primary"
              shape="round"
              size='large'
              onClick={this._next}
            >
              Verify
            </Button>
          </div>


        </div>





        <MyModal
          visible={this.state.spin}
        />


      </div>

    )
  }
}

