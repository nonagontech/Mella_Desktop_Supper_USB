import React, { useEffect, useState } from 'react'
import {
  Dropdown,
  Menu,
  Select,
  Tooltip,
  Spin,
  message
} from 'antd';
import { LoadingOutlined } from '@ant-design/icons';

import petIcon from './../../assets/img/petIcon.png'
import xia from './../../assets/img/xia.png'
import MyModal from './../../utils/myModal/MyModal'
import redjinggao from './../../assets/img/redjinggao.png'
import orgicn from './../../assets/img/orgicn.png'
import deivceAdd from "./../../assets/img/hardList-add.png";

import { px } from '../../utils/px';
import { changeThemeColor } from '../../utils/commonFun';

import { connect } from 'react-redux'
import { petSortTypeFun, petDetailInfoFun, setPetListArrFun } from '../../store/actions';
import { useHistory } from "react-router-dom";
import PropTypes from 'prop-types'
import moment from 'moment';
import _ from 'lodash';

import './mainbody.less'
import { listAllPetInfo } from '../../api';

let storage = window.localStorage;

const { Option } = Select;

const PetsUI = ({
  bodyHeight,
  petSortTypeFun,
  petSortType,
  petDetailInfoFun,
  petDetailInfo,
  setPetListArrFun,
  petListArr,
  selectHardwareType,
  rulerConnectStatus,
  selectHardwareInfo,
  receiveBroadcastHardwareInfo,
}) => {
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
  const [color, setColor] = useState('#e1206d');//颜色切换
  const [pageSize, setPageSize] = useState(20); // 每页20条
  const [total, setTotal] = useState(0);//宠物列表数据的总条数
  const [currPage, setCurrPage] = useState(1);//页码

  //获取组织列表
  const getOrgList = () => {
    let userWorkplace = [];
    try {
      userWorkplace = JSON.parse(storage.userWorkplace) || [];
    } catch (error) {
      console.log("字符串转对象失败", error);
    }
    let orgArr = [],
      workplaceJson = {};
    for (let i = 0; i < userWorkplace.length; i++) {
      let element = userWorkplace[i];
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
          storage.orgName = name

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
  const _getExam = (currPage = 1) => {
    setLoading(true);
    let params = {
      doctorId: storage.userId,
      pageSize: pageSize,
      currPage: currPage,
    }
    if (storage.lastWorkplaceId) {
      params.workplaceId = storage.lastWorkplaceId
    }
    if (storage.lastOrganization) {
      params.organizationId = storage.lastOrganization
    }
    //TODO逻辑好像还有问题
    listAllPetInfo(params)
      .then(res => {
        setLoading(false);
        if (res.flag === true) {
          setTotal(res.data.count);
          let newArr = [];
          if (currPage === 1) {
            newArr = res.data.data;
          } else {
            let oldArr = petList;
            let arr = res.data.data;
            newArr = [...oldArr, ...arr];
          }
          setPetList(newArr);
          setPetListArrFun(newArr);
        } else if (res.msg === '用户没有关联任何宠物') {
          message.warn('The user is not associated with any pets');
          setPetList([]);
          setPetListArrFun([]);
        }
      })
      .catch(err => {
        setLoading(false);
        setPetList([]);
        setPetListArrFun([]);
      })
  }
  const dataSort = (data, key,) => {
    if (!key) {
      key = petSortType
    }
    let petList = [].concat(data)
    switch (key) {

      case 'Time':
      case 'Recent':
        petList.sort((a, b) => { return a.createTime > b.createTime ? -1 : 1 })
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
      { value: 'Recent' },
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
      <Menu
        onClick={({ key, }) => {
          petSortTypeFun(key)
          let petArr = dataSort(petList, key,)
          setPetList(petArr)
          setPetListArrFun(petArr)
        }}
      >
        {options}

      </Menu>
    );
  }
  //宠物列表
  const petListUI = () => {
    let options = petList.map((item, index) => {
      let itemBac = '', itemColor = '#141414'
      if (item.petId === petDetailInfo.petId) {
        itemBac = color
        itemColor = '#fff'
      }
      return (
        <li key={item.petId} >
          <div className='petItem'
            style={{ padding: `${px(7)}px 0 ${px(7)}px ${px(20)}px`, fontSize: 14, backgroundColor: itemBac, color: itemColor }}
            onClick={() => {
              //当硬件是尺子且尺子还在测量的时候,要做出提示
              setSelectPetDetail(item)
              let { deviceType, mac } = selectHardwareInfo
              if ((mac && receiveBroadcastHardwareInfo.deviceType === 'tape' && receiveBroadcastHardwareInfo.macId === mac) && selectHardwareType === 'tape' && rulerConnectStatus !== 'disconnected') {
                setShowModal(true)
              } else {
                petDetailInfoFun(item)
              }
            }}
          >
            {`${item.patientId}, ${item.petName}`}
          </div>
        </li >
      )
    });
    //加载图标
    const antIcon = (
      <LoadingOutlined
        style={{
          fontSize: 24,
          color: color,
        }}
        spin
      />
    );

    return (
      <div className="petList" onScrollCapture={onScrollCapture}>
        <ul>
          {options}
        </ul>
        <Spin spinning={loading} indicator={antIcon} />
      </div>
    )
  }
  //滚动监听
  const onScrollCapture = () => {
    // 滚动的容器
    let tableEleNodes = document.querySelectorAll(`.petList ul`)[0];
    //是否滚动到底部
    let bottomType = Math.round(tableEleNodes?.scrollTop) + tableEleNodes?.clientHeight === tableEleNodes?.scrollHeight;
    if (bottomType) {
      if (currPage === _.ceil(total / pageSize)) {
        return false;
      }
      setCurrPage(currPage + 1);
      _getExam(currPage + 1);
    }
  }
  //组织列表
  const selectOrgUI = () => {
    const selectOrgFn = (value, option) => {
      setPetList([]);
      setTotal(0);
      setCurrPage(1);
      setOrganizationName(value);
      storage.roleId = option.roleid;
      storage.lastOrganization = option.organizationid;
      storage.connectionKey = option.connectionkey;
      storage.orgName = option.value

      try {
        let key = parseInt(selectOrgId);
        let lastWorkplaceId = workplaceJson[key][0].workplaceId;
        storage.lastWorkplaceId = lastWorkplaceId;
      } catch (error) { }
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
        popupClassName="selectOrgUI"
        bordered={false}
        suffixIcon={<img src={xia} alt="" width={px(15)} style={{ marginLeft: px(10) }} />}
      >
        {options}
      </Select>
    )

  }
  //设置宠物列表数据
  useEffect(() => {
    setPetList(petListArr);
    return (() => { });
  }, [petListArr])
  //获取组织列表
  useEffect(() => {
    getOrgList();
    _getExam();
    return (() => { });
  }, []);
  //修改颜色
  useEffect(() => {
    setColor(changeThemeColor(selectHardwareType));
  }, [selectHardwareType]);

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
        <div className="sort" style={{ paddingLeft: px(15), display: 'flex' }}>
          <Dropdown overlay={menu} trigger={['click']}>
            <div className="sortBox">
              <div className="sortText" >
                {`Sort by: ${petSortType}`}
              </div>
              <img src={xia} alt="" width={px(15)} style={{ marginLeft: px(10), cursor: 'pointer' }} />
            </div>
          </Dropdown>
          <Tooltip placement='bottom' title='Add a Pet'>
            <div
              className="addImgBox"
              onClick={() => history.push("/pet/doctorAddPet")}
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
        {petListUI()}
        <div className="walkBtn">
          <div
            className="walkbtnBox"
            style={{ height: px(40), marginTop: px(15), backgroundColor: color }}
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
    selectHardwareInfo: state.hardwareReduce.selectHardwareInfo,
    receiveBroadcastHardwareInfo: state.hardwareReduce.receiveBroadcastHardwareInfo
  }),
  { petSortTypeFun, petDetailInfoFun, setPetListArrFun }
)(PetsUI)
