import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { px } from '../../utils/px'
import { devicesTitleHeight } from '../../utils/InitDate'
import xia from './../../assets/img/xia.png'
import { selectHardwareModalShowFun } from './../../store/actions'
import PetsUI from './PetsUI.jsx'
import electronStore from '../../utils/electronStore'


import './mainbody.less'
import HardListModal from './HardListModal'
let storage = window.localStorage


const HardAndPetsUI = ({ bodyHeight, selectHardwareType, selectHardwareModalShow, hardwareList, selectHardwareModalShowFun }) => {
  //定义选择的硬件详细信息
  const [selectHardwareDetail, setSelectHardwareDetail] = useState({})

  useEffect(() => {

  }, [])
  let selectDevice = electronStore.get(`${storage.lastOrganization}-${storage.userId}-${selectHardwareType}-selectDeviceInfo`) || {}
  useEffect(() => {
    console.log('初始化硬件和宠物界面', hardwareList);
    //根据设备类型获取到此类型下的所有硬件,并用来展示
    for (let i = 0; i < hardwareList.length; i++) {
      const element = hardwareList[i];
      if (element.type === selectHardwareType) {
        let list = element.devices || []
        //获取被选中的硬件的详细信息
        let selectHardwareInfo = electronStore.get(`${storage.lastOrganization}-${storage.userId}-${selectHardwareType}-selectDeviceInfo`) || {}
        console.log('------=========--------', selectHardwareInfo);
        if (selectHardwareInfo === {}) {
          let selectHardwareInfo = list[0] || {}
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
          console.log('sameFlag', sameFlag);
          if (!sameFlag) {
            console.log('设置了默认值');
            let selectHardwareInfo = list[0] || {}
            setSelectHardwareDetail(selectHardwareInfo)
          }
        }
        break
      }
    }
  }, [selectHardwareType, hardwareList, selectDevice])


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
          {selectHardwareDetail.name}
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
    selectHardwareModalShow: state.hardwareReduce.selectHardwareModalShow,
    selectHardwareType: state.hardwareReduce.selectHardwareType,
    hardwareList: state.hardwareReduce.hardwareList
  }),
  { selectHardwareModalShowFun }
)(HardAndPetsUI)