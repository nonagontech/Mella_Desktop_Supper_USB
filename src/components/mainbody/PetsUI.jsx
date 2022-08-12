import React, { useEffect, useState } from 'react'
import {
  Dropdown,
  Menu,
} from 'antd'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import moment from 'moment'
import { LoadingOutlined } from '@ant-design/icons';
import { px } from '../../utils/px'
import { petSortTypeFun, petDetailInfoFun, setPetListArrFun } from '../../store/actions'
import electronStore from '../../utils/electronStore'
import petIcon from './../../assets/img/petIcon.png'
import xia from './../../assets/img/xia.png'
import MyModal from './../../utils/myModal/MyModal'
import redjinggao from './../../assets/img/redjinggao.png'

import { devicesTitleHeight } from '../../utils/InitDate'


import './mainbody.less'
import { fetchRequest } from '../../utils/FetchUtil1';

let storage = window.localStorage;


const PetsUI = ({ bodyHeight, petSortTypeFun, petSortType, petDetailInfoFun, petDetailInfo, setPetListArrFun, petListArr, selectHardwareType, rulerConnectStatus }) => {
  //定义宠物列表数组
  const [petList, setPetList] = useState([])
  //是否展示弹窗
  const [showModal, setShowModal] = useState(false)
  //选中的宠物的详细信息
  const [selectPetDetail, setSelectPetDetail] = useState({})

  //获取宠物列表加载动画
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    //设置宠物列表数据
    setPetList(petListArr)
  }, [petListArr])

  useEffect(() => {
    //从本地获取宠物列表数据
    // let petList = electronStore.get('petList') || [];
    setPetList(petList)
    _getExam()
  }, [])

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
    console.log('查询宠物的入参', params);

    setLoading(true)
    fetchRequest('/user/listAllPetInfo', 'GET', params)
      .then(res => {
        setLoading(false)
        console.log('查询所有宠物', res);
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
      <div className="petList" style={{ marginTop: px(10), height: bodyHeight - px(100) - px(240) }}>
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

  return (
    <div className="PetUI" style={{ height: bodyHeight - px(100), }}>
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
        {/* <div className="sort" style={{ paddingLeft: px(20) }}>
          <Dropdown overlay={menu} trigger={['click']}>
            <div className="sortBox">
              <img src={xia} alt="" width={px(20)} style={{ marginRight: px(10) }} />
              <div className="sortText" >
                {`Sort by: ${petSortType}`}
              </div>
            </div>
          </Dropdown>
        </div> */}
        <div className="title" style={{ padding: `${px(20)}px 0px ${px(20)}px ${px(20)}px ` }}>
          <img src={petIcon} alt="" width={px(25)} style={{ marginRight: px(10) }} />
          <div className="titleText" >Pets</div>
        </div>

        <div className="sort" style={{ paddingLeft: px(20) }}>
          <Dropdown overlay={menu} trigger={['click']}>
            <div className="sortBox">
              <img src={xia} alt="" width={px(20)} style={{ marginRight: px(10) }} />
              <div className="sortText" >
                {`Sort by: ${petSortType}`}
              </div>
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
      </div>




    </div>
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
