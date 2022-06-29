import React, { useEffect, useState } from 'react'
import {
  Dropdown,
  Menu,
} from 'antd'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import moment from 'moment'
import { px } from '../../utils/px'
import { petSortTypeFun, petDetailInfoFun, setPetListArrFun } from '../../store/actions'
import electronStore from '../../utils/electronStore'
import petIcon from './../../assets/img/petIcon.png'
import xia from './../../assets/img/xia.png'

import { devicesTitleHeight } from '../../utils/InitDate'


import './mainbody.less'
import { fetchRequest } from '../../utils/FetchUtil1';

let storage = window.localStorage;


const PetsUI = ({ bodyHeight, petSortTypeFun, petSortType, petDetailInfoFun, petDetailInfo, setPetListArrFun, petListArr }) => {
  //定义宠物列表数组
  const [petList, setPetList] = useState([])

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


    fetchRequest('/user/listAllPetInfo', 'GET', params)
      .then(res => {
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
              console.log('点击了宠物', item);
              petDetailInfoFun(item)
            }}
          >
            {`${item.patientId}, ${item.petName}`}
          </div>
        </li>
      )

    })

    return (
      <div className="petList" style={{ marginTop: px(10), height: bodyHeight - devicesTitleHeight - px(220) }}>
        <ul>
          {options}
        </ul>
      </div>
    )
  }

  return (
    <div className="PetUI" style={{ height: bodyHeight - devicesTitleHeight, }}>
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
          style={{ height: px(40), marginTop: px(30) }}
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
  }),
  { petSortTypeFun, petDetailInfoFun, setPetListArrFun }
)(PetsUI)