import React, { useState, useEffect } from 'react'

import xia from './../../assets/img/xia.png'

import { px } from '../../utils/px'

import PetsUI from './PetsUI.jsx'
import HardListModal from './HardListModal'

import PropTypes from 'prop-types'
import { connect } from 'react-redux';
import { selectHardwareModalShowFun, selectHardwareInfoFun } from './../../store/actions';

import './mainbody.less';

let storage = window.localStorage
const HardAndPetsUI = ({ bodyHeight, selectHardwareType, selectHardwareModalShow, hardwareList, selectHardwareModalShowFun, hardwareInfo, selectHardwareInfoFun }) => {
  //定义选择的硬件详细信息
  const [selectHardwareDetail, setSelectHardwareDetail] = useState({})
  useEffect(() => {
    //根据设备类型获取到此类型下的所有硬件,并用来展示

    for (let i = 0; i < hardwareList.length; i++) {
      const element = hardwareList[i];

      if (element.type === selectHardwareType) {
        let list = element.devices || []

        //获取被选中的硬件的详细信息
        let selectHardwareInfo = hardwareInfo || {}
        if (selectHardwareInfo.mac === null && list[0]) {
          let selectHardwareInfo = list[0]
          selectHardwareInfoFun(selectHardwareInfo)

          setSelectHardwareDetail(selectHardwareInfo)
        } else {
          let sameFlag = false
          for (let i = 0; i < list.length; i++) {
            const element = list[i];
            if (element.name === selectHardwareInfo.name && element.mac === selectHardwareInfo.mac) {
              setSelectHardwareDetail(selectHardwareInfo)
              sameFlag = true
              break
            }
          }
          if (!sameFlag) {
            let selectHardwareInfo = list[0] || {}
            setSelectHardwareDetail(selectHardwareInfo)
          }
        }
        break
      }
    }
  }, [selectHardwareType, hardwareList,])


  // console.log('=====----===', selectHardwareDetail);

  return (
    <div className='deviceAndPets' style={{ width: px(200), height: bodyHeight }}>
      <div className='deviceAndPets-title'
        onClick={(e) => {
          //react阻止冒泡
          e.stopPropagation()
          selectHardwareModalShowFun(!selectHardwareModalShow)
        }}
      >
        <div className="devicesName" style={{ fontSize: px(20) }}>
          {selectHardwareDetail.name || "No Equipment"}
        </div>
        <div className="imgBox" style={{ marginLeft: px(7) }}>
          <img src={xia} alt="" width={px(20)} />
        </div>
        {selectHardwareModalShow && <HardListModal setInfo={(item) => {
          setSelectHardwareDetail(item)
        }} />}
      </div>
      <PetsUI
        bodyHeight={bodyHeight}
      />
    </div >
  )
}


HardAndPetsUI.propTypes = {
  bodyHeight: PropTypes.number,
  devicesTypeList: PropTypes.array
}
//默认值
HardAndPetsUI.defaultProps = {
  bodyHeight: 0,
  devicesTypeList: []
}
export default connect(
  state => ({
    selectHardwareModalShow: state.hardwareReduce.selectHardwareModalShow,
    selectHardwareType: state.hardwareReduce.selectHardwareType,
    hardwareList: state.hardwareReduce.hardwareList,
    hardwareInfo: state.hardwareReduce.selectHardwareInfo,

  }),
  {
    selectHardwareModalShowFun,
    selectHardwareInfoFun
  }
)(HardAndPetsUI)
