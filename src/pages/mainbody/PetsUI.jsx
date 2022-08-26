import React, { useEffect, useState } from 'react'
import {
  Dropdown,
  Menu,
  Select,
  Tooltip,
} from 'antd';
import { LoadingOutlined } from '@ant-design/icons';

import petIcon from './../../assets/img/petIcon.png'
import xia from './../../assets/img/xia.png'
import MyModal from './../../utils/myModal/MyModal'
import redjinggao from './../../assets/img/redjinggao.png'
import orgicn from './../../assets/img/orgicn.png'
import deivceAdd from "./../../assets/img/hardList-add.png";

import { px } from '../../utils/px'

import { connect } from 'react-redux'
import { petSortTypeFun, petDetailInfoFun, setPetListArrFun } from '../../store/actions'
import { useHistory } from "react-router-dom";
import PropTypes from 'prop-types'
import moment from 'moment'

import './mainbody.less'
import { listAllPetInfo } from '../../api';

let storage = window.localStorage;

const { Option } = Select;

const PetsUI = ({ bodyHeight, petSortTypeFun, petSortType, petDetailInfoFun, petDetailInfo, setPetListArrFun, petListArr, selectHardwareType, rulerConnectStatus }) => {
  const history = useHistory();
  //定义宠物列表数组
  const [petList, setPetList] = useState([])
  //是否展示弹窗
  const [showModal, setShowModal] = useState(false)
  //选中的宠物的详细信息
  const [selectPetDetail, setSelectPetDetail] = useState({})

  //获取宠物列表加载动画
  const [loading, setLoading] = useState(false)

  const [orgArr, setOrgArr] = useState([])
  const [workplaceJson, setWorkplaceJson] = useState({})
  const [connectionKey, setConnectionKey] = useState("")
  const [selectOrgId, setSelectOrgId] = useState(-1)
  const [selectRoleId, setSelectRoleId] = useState("")
  const [workplaceName, setWorkplaceName] = useState("")
  const [workplaceId, setWorkplaceId] = useState()
  const [organizationName, setOrganizationName] = useState("")
  const [organizationId, setOrganizationId] = useState()

  //获取组织列表
  const getOrgList = () => {
    let userWorkplace = [];
    try {
      userWorkplace = JSON.parse(storage.userWorkplace) || [];
    } catch (error) {
      console.log("字符串转对象失败", error);
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
    let orgArr = [],
      workplaceJson = {};
    for (let i = 0; i < userWorkplace.length; i++) {
      let element = userWorkplace[i];
      // console.log('每一项的值：', element);
      if (element.organizationEntity && element.workplaceEntity) {
        let { organizationEntity, workplaceEntity, roleId } = element;
        const { name, organizationId, connectionKey } = organizationEntity;
        const { workplaceName, workplaceId } = workplaceEntity;

        if (`${workplaceId}` === storage.lastWorkplaceId) {
          setWorkplaceName(workplaceName)
          setWorkplaceId(workplaceId)
        }

        if (`${organizationId}` === storage.lastOrganization) {

          setOrganizationName(name)
          setSelectOrgId(storage.lastOrganization)
          setSelectOrgId(storage.lastOrganization)

        }

        let orgRepeatFlog = false,
          repeatFlogNum = -1;
        for (let j = 0; j < orgArr.length; j++) {
          if (orgArr[j].organizationId === organizationId) {
            orgRepeatFlog = true;
            repeatFlogNum = j;
            break;
          }
        }
        if (orgRepeatFlog) {
          let workplace = {
            workplaceName,
            workplaceId,
          };
          let id = orgArr[repeatFlogNum].organizationId;
          workplaceJson[`${id}`] = workplace;
        } else {
          let connectKey = connectionKey || "";
          let json = {
            organizationId,
            organizationName: name,
            connectionKey: connectKey,
            roleId,
          };
          let workplace = [
            {
              workplaceName,
              workplaceId,
            },
          ];
          workplaceJson[`${organizationId}`] = workplace;

          orgArr.push(json);
        }
      }
    }

    setOrgArr(orgArr)
    setWorkplaceJson(workplaceJson)
    setConnectionKey(storage.connectionKey)
    setSelectRoleId(storage.roleId)

  }
  //获取宠物列表数据
  const _getExam = () => {
    let params = {
      doctorId: storage.userId,
      offset: 0,
      size: 100,
    }
    if (storage.lastWorkplaceId) {
      params.workplaceId = storage.lastWorkplaceId
    }
    if (storage.lastOrganization) {
      params.organizationId = storage.lastOrganization
    }
    setLoading(true)
    listAllPetInfo(params)
      .then(res => {
        setLoading(false)
        if (res.flag === true && res.data) {
          let oldList = res.data
          let petArr = dataSort(oldList)
          setPetList(petArr)
          setPetListArrFun(petArr)
        } else {

        }
      })
      .catch(err => {
        setLoading(false)
        console.log(err);
      })
  }
  const dataSort = (data) => {
    let petList = [].concat(data)
    switch (petSortType) {
      case 'Time':
        petList.sort((a, b) => { return moment(parseInt(a.insertedAt) * 1000).format('YYYY-MM-DD HH:mm') > moment(parseInt(b.insertedAt) * 1000).format('YYYY-MM-DD HH:mm') ? -1 : 1 })
        break;
      case 'Pet ID':
        petList.sort((a, b) => { return a.patientId >= b.patientId ? 1 : -1 })
        break;
      case 'Owner':
        petList.sort((a, b) => { return a.owner >= b.owner ? 1 : -1 })
        break;
      case 'Breed':
        petList.sort((a, b) => { return a.breed >= b.breed ? 1 : -1 })
        break;
      case 'Pet Name':
        petList.sort((a, b) => { return a.petName >= b.petName ? 1 : -1 })
        break;
      case 'Gender':
        petList.sort((a, b) => { return a.gender >= b.gender ? 1 : -1 })
        break;
    }
    return petList
  }
  const menu = () => {
    let menuList = [
      // { value: 'Time' },
      { value: 'Pet ID' },
      // { value: 'Owner' },
      // { value: 'Breed' },
      { value: 'Pet Name' },
      // { value: 'Gender' },
    ];
    let options = menuList.map((item, index) => {
      let itemstyle = {}, textColor = '#1a1a1a'
      if (petSortType === item.value) {
        itemstyle = { backgroundColor: '#e1206D' }
        textColor = '#fff'
      }
      return (
        <Menu.Item style={itemstyle} key={`${item.value}`}>
          <div style={{ color: textColor }}>{item.value}</div>
        </Menu.Item>
      )
    })
    return (
      <Menu onClick={({ key, }) => {
        petSortTypeFun(key)
        let petArr = dataSort(petList)
        setPetList(petArr)
        setPetListArrFun(petArr)
      }}>
        {options}

      </Menu>
    );
  }
  const petListUI = () => {
    let options = petList.map((item, index) => {
      let itemBac = '#E7E7E7', itemColor = '#141414'
      if (item.petId === petDetailInfo.petId) {
        itemBac = '#e1206D'
        itemColor = '#fff'
      }
      return (
        <li key={index} >
          <div className='petItem'
            style={{ padding: `${px(7)}px 0 ${px(7)}px ${px(20)}px`, fontSize: 14, backgroundColor: itemBac, color: itemColor }}
            onClick={() => {
              //当硬件是尺子且尺子还在测量的时候,要做出提示
              setSelectPetDetail(item)
              if (selectHardwareType === 'tape' && rulerConnectStatus !== 'disconnected') {
                setShowModal(true)
              } else {
                petDetailInfoFun(item)
              }
              // petDetailInfoFun(item)
            }}
          >
            {`${item.patientId}, ${item.petName}`}
          </div>
        </li>
      )

    })

    return (
      <div className="petList" style={{ marginTop: px(10) }}>
        {loading ?
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', width: '100%', height: '100%' }}>
            <div className="loadIcon" style={{ marginBottom: px(5) }}>
              <LoadingOutlined style={{ fontSize: 30, color: '#141414', marginTop: px(-30), }} />
            </div>
            <p style={{ color: '#141414' }}>loading... </p>
          </div>
          :
          <ul>
            {options}
          </ul>}

      </div>
    )
  }
  const selectOrgUI = () => {
    // console.log('orgArr', orgArr);
    const selectOrgFn = (value, option) => {
      console.log('-------value', value, option);
      setOrganizationName(value)
      storage.roleId = option.roleid
      storage.lastOrganization = option.organizationid
      storage.connectionKey = option.connectionkey
      try {
        let key = parseInt(selectOrgId);
        let lastWorkplaceId = workplaceJson[key][0].workplaceId;
        // console.log('------', lastWorkplaceId);
        storage.lastWorkplaceId = lastWorkplaceId;

      } catch (error) {

      }
      _getExam()

    }

    let options = orgArr.map((item, index) => {
      if (index === 1) {
      }
      return (
        <Option
          key={`${item.organizationId}`}
          value={item.organizationName}
          organizationid={item.organizationId}
          roleid={item.roleId}
          connectionkey={item.connectionKey}


        >
          {item.organizationName}
        </Option>
      )
    })
    return (
      <Select
        style={{ width: '70%', marginLeft: px(15) }}
        value={organizationName}
        onChange={selectOrgFn}
        dropdownClassName="selectOrgUI"
        bordered={false}
        // showArrow={false}
        // dropdownMatchSelectWidth={140}
        suffixIcon={() => <img src={xia} alt="" width={px(20)} style={{ marginLeft: px(10) }} />}
      >
        {options}
      </Select>
    )

  }

  useEffect(() => {
    //设置宠物列表数据
    setPetList(petListArr)
  }, [petListArr])
  //获取组织列表
  useEffect(() => {
    getOrgList()
  }, [])

  useEffect(() => {
    _getExam()
  }, [])


  return (
    <div className="PetUI11" style={{ height: bodyHeight - px(100), }}>
      <MyModal
        visible={showModal}
        element={
          <div className='petUiModal'>
            <img src={redjinggao} alt="" width={'45px'} style={{ margin: `${px(25)}px 0` }} />
            <div className='bodyText' style={{ marginTop: px(30) }}>Patient Switched – select dimension to measure</div>
            <div className="btns" style={{ marginTop: px(35) }}>
              <div className="btn" onClick={() => { setShowModal(false) }}>Cancel</div>
              <div className="btn" onClick={() => { setShowModal(false); petDetailInfoFun(selectPetDetail) }}>Confirm</div>
            </div>
          </div>
        }
      />
      <div style={{ width: '100%', position: 'relative', height: bodyHeight - px(100), }}>
        <div className="selectOrg" style={{ width: '100%' }}>
          <div className="title" style={{ padding: `${px(10)}px 0px ${px(10)}px ${px(20)}px ` }}>
            <img src={orgicn} alt="" width={px(25)} style={{ marginRight: px(10) }} />
            <div className="titleText" >{`Organization`}</div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
            {selectOrgUI()}
            <Tooltip placement='bottom' title='Add an organization'>
              <div
                className="addImgBox"
                onClick={() => history.push("/menuOptions/NewOrg")}
              >
                <img
                  src={deivceAdd}
                  alt=""
                  width={px(20)}
                  style={{ marginLeft: px(12) }}
                />
              </div>

            </Tooltip>
          </div>
        </div>
        <div className="title" style={{ padding: `${px(20)}px 0px ${px(20)}px ${px(20)}px ` }}>
          <img src={petIcon} alt="" width={px(25)} style={{ marginRight: px(10) }} />
          <div className="titleText" >Pets</div>
        </div>
        <div className="sort" style={{ paddingLeft: px(20) }}>
          <Dropdown overlay={menu} trigger={['click']}>
            <div className="sortBox">
              <div className="sortText" >
                {`Sort by: ${petSortType}`}
              </div>
              <img src={xia} alt="" width={px(15)} style={{ marginLeft: px(10) }} />
            </div>
          </Dropdown>
        </div>
        {petListUI()}
        <div className="walkBtn">
          <div
            className="walkbtnBox"
            style={{ height: px(40), marginTop: px(15) }}
            onClick={() => {
              let json = {
                isWalkIn: true,
                petId: null,
                petName: null,
                owner: null,
                breed: null,

              }
              petDetailInfoFun(json)
            }}
          >
            <div className="walkText">Walk-In</div>
          </div>
        </div>
        {/* <MyModal visible={loading} /> */}
      </div >
    </div >
  )
}


PetsUI.propTypes = {
  bodyHeight: PropTypes.number
}
//默认值
PetsUI.defaultProps = {
  bodyHeight: 0
}
export default connect(
  state => ({
    petSortType: state.petReduce.petSortType,
    petDetailInfo: state.petReduce.petDetailInfo,
    petListArr: state.petReduce.petListArr,
    selectHardwareType: state.hardwareReduce.selectHardwareType,
    rulerConnectStatus: state.hardwareReduce.rulerConnectStatus,
  }),
  { petSortTypeFun, petDetailInfoFun, setPetListArrFun }
)(PetsUI)
