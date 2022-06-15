import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { px } from '../../utils/px'
import { devicesTitleHeight } from '../../utils/InitDate'
import xia from './../../assets/img/xia.png'
import { selectHardwareModalShowFun } from './../../store/actions'
import PetsUI from './PetsUI.jsx'

import './mainbody.less'
import HardListModal from './HardListModal'


const HardAndPetsUI = ({ bodyHeight, selectHardwareInfo, selectHardwareModalShow, selectHardwareModalShowFun }) => {

  return (
    <div className='deviceAndPets' style={{ width: px(200), height: bodyHeight }}>
      <div className='deviceAndPets-title' style={{ height: devicesTitleHeight }}
        onClick={(e) => {
          //react阻止冒泡
          e.stopPropagation()
          selectHardwareModalShowFun(!selectHardwareModalShow)
        }}
      >
        <div className="devicesName" style={{ fontSize: px(26) }}>
          {selectHardwareInfo.name}
        </div>
        <div className="imgBox" style={{ marginLeft: px(7) }}>
          <img src={xia} alt="" width={px(32)} />
        </div>
        {selectHardwareModalShow && <HardListModal />}
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
    selectHardwareInfo: state.hardwareReduce.selectHardwareInfo,
    selectHardwareList: state.hardwareReduce.selectHardwareList,
    selectHardwareModalShow: state.hardwareReduce.selectHardwareModalShow,
  }),
  { selectHardwareModalShowFun }
)(HardAndPetsUI)