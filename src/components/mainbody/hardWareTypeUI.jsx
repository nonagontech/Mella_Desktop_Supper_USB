import React, { Component, useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import { px } from '../../utils/px'
import mellaPro from './../../assets/img/hardList-mella.png'
import biggie from './../../assets/img/hardList-biggie.png'
import rfid from './../../assets/img/hardList-rfid.png'
import tape from './../../assets/img/hardList-tape.png'
import add from './../../assets/img/hardList-add.png'
import maeBowl from './../../assets/img/hardList-maeBowl.png'
import otterEQ from './../../assets/img/hardList-otterEQ.png'
import { selectHardwareInfoFun, setSelectHardwareType } from './../../store/actions'
import electronStore from '../../utils/electronStore'

let storage = window.localStorage;
//devicesTypeList是index传过来的硬件种类以及种类下的所有硬件
const HardWareTypeUI = ({ bodyHeight, devicesTypeList, selectHardwareInfoFun, setSelectHardwareType, selectHardwareType }) => {
  //根据左侧列表的设备类型，获取当前选中的设备类型下选中的硬件,先看本地有没有存,没存就拿第一个展示
  // useEffect(() => {
  //   let Index = null
  //   for (let i = 0; i < devicesTypeList.length; i++) {
  //     const element = devicesTypeList[i];
  //     if (element.type === selectHardwareType) {
  //       Index = i
  //       break
  //     }
  //   }
  //   if (Index === null) {
  //     return
  //   }

  //   let hard = devicesTypeList[Index]
  //   if (hard && hard.type !== 'add') {
  //     let devicesInfo = electronStore.get(`${storage.lastOrganization}-${storage.userId}-${hard.type}-selectDeviceInfo`)




  //     if (!devicesInfo) {
  //       devicesInfo = hard.devices[0]
  //       electronStore.set(`${storage.lastOrganization}-${storage.userId}-${hard.type}-selectDeviceInfo`, devicesInfo)
  //     } else {

  //       let sameFlag = false
  //       console.log('============', hard.devices, devicesInfo);
  //       for (let i = 0; i < hard.devices.length; i++) {
  //         const element = hard.devices[i];
  //         if (element.mac === devicesInfo.mac && element.name === devicesInfo.name) {
  //           sameFlag = true
  //           break
  //         }
  //       }
  //       if (!sameFlag) {
  //         devicesInfo = hard.devices[0]
  //         electronStore.set(`${storage.lastOrganization}-${storage.userId}-${hard.type}-selectDeviceInfo`, devicesInfo)
  //       }
  //     }

  //     console.log('保存的折本信息', devicesInfo);;

  //     selectHardwareInfoFun(devicesInfo)

  //     selectHardwareList(hard)
  //   }

  // }, [devicesTypeList])



  let options = devicesTypeList.map((item, index) => {

    let img = null
    switch (item.type) {
      case 'mellaPro':
        img = mellaPro
        break;

      case 'biggie':
        img = biggie
        break;

      case 'rfid':
        img = rfid
        break;

      case 'tape':
        img = tape
        break;
      case "maeBowl":
        img = maeBowl
        break;
      case 'add':
        img = add
        break;

      case 'otterEQ':
        img = otterEQ
        break;
      default:
        break;
    }
    let borderStyle = ``
    if (item.type === selectHardwareType) {
      borderStyle = ` 2px solid #3B3A3A`
    }

    return <li key={`${index}`} style={{ padding: `${px(10)}px 0`, }}
      onClick={() => {
        console.log(item.type);
        if (item.type === 'add') {


        } else {
          let devicesInfo = electronStore.get(`${storage.lastOrganization}-${storage.userId}-${item.type}-selectDeviceInfo`)

          //要做个处理,看保存的数据是否和当前的一致，如果不一致，就把当前的保存下来


          if (!devicesInfo && item.devices[0]) {
            devicesInfo = item.devices[0]
            electronStore.set(`${storage.lastOrganization}-${storage.userId}-${item.type}-selectDeviceInfo`, devicesInfo)
          }


          selectHardwareInfoFun(devicesInfo)
        }
        setSelectHardwareType(item.type)
      }
      }
    >
      <div style={{ border: borderStyle, padding: px(2), borderRadius: px(10) }}>
        <img src={img} alt="" width={px(55)} />
      </div>


    </li>
  })


  return (
    <div className="hardwareType" style={{ width: px(80), height: bodyHeight }}>
      <ul>
        {options}
      </ul>
    </div>
  )

}




HardWareTypeUI.propTypes = {
  bodyHeight: PropTypes.number,
  devicesTypeList: PropTypes.array,

}
//默认值
HardWareTypeUI.defaultProps = {
  bodyHeight: 0,
  devicesTypeList: []
}

export default connect(
  state => ({
    selectHardwareType: state.hardwareReduce.selectHardwareType,
  }),
  { selectHardwareInfoFun, setSelectHardwareType }
)(HardWareTypeUI)