import React, { Component, useState } from 'react'
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
import { changeselectHardwareIndex, selectHardwareList, selectHardwareInfoFun } from './../../store/actions'
import electronStore from '../../utils/electronStore'

let storage = window.localStorage;
// class HardWareTypeUI extends Component {
const HardWareTypeUI = ({ bodyHeight, devicesTypeList, selectHardwareIndex, changeselectHardwareIndex, selectHardwareList, selectHardwareInfoFun }) => {



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
    if (index === selectHardwareIndex) {
      borderStyle = ` 2px solid #3B3A3A`
    }

    return <li key={`${index}`} style={{ padding: `${px(10)}px 0`, }}
      onClick={() => {

        console.log(item);
        changeselectHardwareIndex(index)
        selectHardwareList(item)
        let devicesInfo = electronStore.get(`${storage.lastOrganization}-${storage.userId}-${item.type}-selectDeviceInfo`)

        if (!devicesInfo) {
          devicesInfo = item.devices[0]
          electronStore.set(`${storage.lastOrganization}-${storage.userId}-${item.type}-selectDeviceInfo`, devicesInfo)
        }

        selectHardwareInfoFun(devicesInfo)

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
  state => ({ selectHardwareIndex: state.hardwareReduce.selectHardwareIndex }),
  { changeselectHardwareIndex, selectHardwareList, selectHardwareInfoFun }
)(HardWareTypeUI)