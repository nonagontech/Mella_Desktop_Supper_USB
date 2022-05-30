
import React, { Component } from 'react'
import {
    Switch,
    Select,
} from 'antd'




import Heart from '../../../utils/heard/Heard'
import Slider from '../../../utils/slider/Slider'
import Button from '../../../utils/button/Button'
import electronStore from '../../../utils/electronStore'
import temporaryStorage from '../../../utils/temporaryStorage'
import { mTop, px } from '../../../utils/px';
import MyModal from '../../../utils/myModal/MyModal'
import parent from './../../../assets/img/parent.png'
import dog from '../../../assets/images/reddog.png'
import cat from '../../../assets/images/redcat.png'
import other from '../../../assets/images/redother.png'
import { fetchRequest } from '../../../utils/FetchUtil1'
import moment from 'moment'
import './connectWorkplace.less'

const { Option } = Select;
let storage = window.localStorage;

export default class ConnectWorkplace extends Component {

    state = {
        orgArr: [],
        workplaceJson: {},
        connectionKey: '',
        selectOrgId: -1,
        selectRoleId: ''
    }
    componentDidMount() {
        let ipcRenderer = window.electron.ipcRenderer
        let { height, width } = window.screen
        ipcRenderer.send('Lowbig')
        ipcRenderer.on('changeFenBianLv', this.changeFenBianLv)



        let userWorkplace = []
        try {
            userWorkplace = JSON.parse(storage.userWorkplace) || []
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
        // console.log('存储的工作场所和组织id', storage.lastWorkplaceId, storage.lastOrganization);
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
                        organizationId: storage.lastOrganization,
                        selectOrgId: storage.lastOrganization
                    })
                }

                let orgRepeatFlog = false, repeatFlogNum = -1
                for (let j = 0; j < orgArr.length; j++) {
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
                    workplaceJson[`${id}`] = workplace
                } else {
                    let connectKey = connectionKey || ''
                    let json = {
                        organizationId,
                        organizationName: name,
                        connectionKey: connectKey,
                        roleId,

                    }
                    let workplace = [{
                        workplaceName, workplaceId
                    }]
                    workplaceJson[`${organizationId}`] = workplace

                    orgArr.push(json)
                }
            }
        }
        // console.log('-----转换后的组织信息--', orgArr, workplaceJson);
        this.setState({
            orgArr,
            workplaceJson,
            connectionKey: storage.connectionKey,
            selectRoleId: storage.roleId,
            connectionKey: storage.connectionKey
        })


    }
    componentWillUnmount() {
        let ipcRenderer = window.electron.ipcRenderer

        ipcRenderer.removeListener('changeFenBianLv', this.changeFenBianLv)
    }
    changeFenBianLv = (e) => {
        // console.log(e);
        let ipcRenderer = window.electron.ipcRenderer
        let { height, width } = window.screen
        let windowsHeight = height > width ? width : height
        ipcRenderer.send('Lowbig')
        this.setState({

        })
    }



    render() {
        let { orgArr, selectOrgId } = this.state
        let option = orgArr.map((item, index) => {
            let bac = `${selectOrgId}` === `${item.organizationId}` ? '#e1206d' : '#fff'
            let col = `${selectOrgId}` === `${item.organizationId}` ? '#fff' : '#000'
            return <li key={`${item.organizationId}`}
                style={{ background: bac, color: col }}
                onClick={() => {

                    this.setState({
                        selectOrgId: item.organizationId,
                        connectionKey: item.connectionKey,
                        selectRoleId: item.roleId
                    })
                    // storage.roleId = item.roleId
                }}
            >
                <div className="org" style={{ fontSize: px(16), }}>{item.organizationName}</div>

            </li>
        })
        return (
            <div id="connectworkplace">
                <div className="heard">
                    <Heart
                        onReturn={() => {
                            this.props.history.goBack()
                        }}
                        onSearch={(data) => {

                            storage.doctorExam = JSON.stringify(data)

                            storage.doctorList = JSON.stringify(this.state.data)
                            if (storage.isClinical === 'true') {
                                this.props.history.push({ pathname: '/page8', identity: storage.identity, patientId: data.patientId })
                            } else {
                                this.props.history.push({ pathname: '/page10', })
                            }
                        }}
                        menu8Click={() => {
                            // console.log('--', storage.identity);
                            switch (storage.identity) {
                                case '2': this.props.history.push({ pathname: '/EzyVetSelectExam', listDate: storage.ezyVetList, defaultCurrent: storage.defaultCurrent })

                                    break;
                                case '1': this.props.history.push('/VetSpireSelectExam')

                                    break;
                                case '3': this.props.history.push({ pathname: '/uesr/selectExam', listDate: storage.doctorList, defaultCurrent: storage.defaultCurrent })

                                    break;

                                default:
                                    break;
                            }
                        }}
                    />
                </div>


                <div className="body" >
                    <div className="top">
                        <div className="title flex">
                            <p style={{ fontSize: px(24), fontWeight: '800' }}>Connected Workplaces</p>
                            <div className="addbtn flex" style={{ height: px(45) }}
                                onClick={() => this.props.history.push('/menuOptions/NewOrg')}
                            >

                                <p>+ Add Workplace</p>
                            </div>
                        </div>
                        <div className="tablebox">
                            <div className="table" style={{ height: px(220) }}>
                                <ul>
                                    {option}
                                </ul>
                            </div>
                        </div>
                    </div>
                    <div className="center"></div>
                    <div className="footer flex">
                        <div className="saveBtn flex" style={{ height: px(45) }}
                            onClick={() => {
                                let { selectOrgId, selectRoleId, connectionKey, workplaceJson } = this.state
                                // console.log({ selectOrgId, selectRoleId, connectionKey, workplaceJson });
                                storage.roleId = selectRoleId
                                storage.lastOrganization = selectOrgId
                                try {
                                    let key = parseInt(selectOrgId)
                                    let lastWorkplaceId = workplaceJson[key][0].workplaceId
                                    // console.log(lastWorkplaceId);
                                    storage.lastWorkplaceId = lastWorkplaceId
                                } catch (error) {

                                }
                                storage.connectionKey = connectionKey
                                this.props.history.replace('/menuOptions/settings')

                            }}
                        >
                            <p style={{ fontSize: px(18) }}>Save Changes</p>
                        </div>
                    </div>
                </div>


                {/* <MyModal visible={this.state.loading} /> */}







            </div>
        )
    }
}