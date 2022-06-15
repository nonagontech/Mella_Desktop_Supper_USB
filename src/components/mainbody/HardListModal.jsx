import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { px } from '../../utils/px'
import { selectHardwareInfoFun, selectHardwareModalShowFun } from './../../store/actions'
import electronStore from '../../utils/electronStore'

import deviceBiggie from './../../assets/img/deviceIcon-biggie.png'
import nextImg from './../../assets/img/nextImg.png'
import dui from './../../assets/img/dui.png'
import deviceMella from './../../assets/img/deviceIcon-mella.png'
import deviceRfid from './../../assets/img/deviceIcon-rfid.png'
import deviceMaeBowl from './../../assets/img/deviceIcon-maeBowl.png'
import deviceTape from './../../assets/img/deviceIcon-tape.png'
import deivceAdd from './../../assets/img/hardList-add.png'
import scales from './../../assets/img/scales.png'
import './mainbody.less'

let storage = window.localStorage;
const HardAndPetsUI = ({ selectHardwareInfo, selectHardwareList, selectHardwareInfoFun, selectHardwareModalShowFun }) => {
  //定义数组hardwareList
  const [hardwareList, setHardwareList] = useState([])
  //定义选择的硬件详细信息
  const [selectHardwareDetail, setSelectHardwareDetail] = useState({})
  useEffect(() => {
    let list = selectHardwareList.devices || []
    setHardwareList(list)
    setSelectHardwareDetail(selectHardwareInfo)
  }, [selectHardwareList])

  let options = hardwareList.map((item, index) => {

    let { name, mac, deviceType } = item
    let deviceTypeStr = '', img = null
    switch (deviceType) {
      case 'biggie': deviceTypeStr = 'Biggie Pro Scale'
        img = <img src={deviceBiggie} alt="" width={px(75)} />
        break;
      case 'rfid': deviceTypeStr = 'RFID'
        img = <img src={deviceRfid} alt="" width={px(40)} />
        break;
      case 'tape': deviceTypeStr = 'Tabby'
        img = <img src={deviceTape} alt="" width={px(50)} />
        break;
      case 'maeBowl': deviceTypeStr = 'MaeBowl'
        img = <img src={deviceMaeBowl} alt="" width={px(40)} />

        break;
      case 'otterEQ': deviceTypeStr = 'Otter EQ'

        break;
      case 'mellaPro': deviceTypeStr = 'Mella Pro'
        img = <img src={deviceMella} alt="" width={px(20)} />
        break;



      default:
        break;
    }
    //判断对象是否相等
    let isEqual = JSON.stringify(item) === JSON.stringify(selectHardwareDetail)

    return <li key={`${index}`}
      onClick={() => {
        setSelectHardwareDetail(item)
        electronStore.set(`${storage.lastOrganization}-${storage.userId}-${deviceType}-selectDeviceInfo`, item)
        selectHardwareInfoFun(item)
      }}>
      <div className="hardListInfo" style={{ paddingTop: px(15), paddingBottom: px(15) }}>
        <div className="deviceL" >
          <div className="hardIcon" style={{ marginLeft: px(3), marginRight: px(3), width: px(75) }}>
            {img}
          </div>
          <div className="deviceInfo">
            <div className="deviceName" >{`Device Name: ${name}`}</div>
            <div className="deviceName" >{deviceTypeStr}</div>
            <div className="deviceName" >{`SN: ${mac}`}</div>

          </div>
        </div>

        <div className="deviceR" style={{ marginRight: px(20) }}>
          <img src={nextImg} alt="" width={px(13)} />
          {
            isEqual && <div className="seleIcon" style={{ width: px(18), height: px(18), top: px(-30) }}>
              <img src={dui} alt="" width={px(12)} />
            </div>
          }

        </div>
      </div>
    </li>
  }
  )
  const otherItems = () => {
    let deviceType = selectHardwareDetail.deviceType
    let isBiggie = deviceType === 'biggie', deviceTypeStr = ''
    switch (deviceType) {
      case 'biggie': deviceTypeStr = 'Biggie'
        break;
      case 'rfid': deviceTypeStr = 'RFID'
        break;
      case 'tape': deviceTypeStr = 'Tabby'

        break;
      case 'maeBowl': deviceTypeStr = 'MaeBowl'

        break;
      case 'otterEQ': deviceTypeStr = 'Otter EQ'
        break;
      case 'mellaPro': deviceTypeStr = 'Mella'
        break;
      default:
        break;
    }
    return (
      <div>
        {isBiggie &&
          <div className="addNewDevice"
            style={{ paddingTop: px(10), paddingBottom: px(10) }}


          >
            <div className="addNewDeviceText" style={{ paddingLeft: px(25) }}>{`Combine Scales`}</div>
            <div className="addNewDeviceImg">
              <img src={scales} alt="" width={px(30)} style={{ marginRight: px(20) }} />
            </div>
          </div>
        }
        <div className="addNewDevice" style={{ paddingTop: px(10), paddingBottom: px(10) }}>
          <div className="addNewDeviceText" style={{ paddingLeft: px(25) }}>{`Add New ${deviceTypeStr}`}</div>
          <div className="addNewDeviceImg">
            <img src={deivceAdd} alt="" width={px(30)} style={{ marginRight: px(20) }} />
          </div>
        </div>
      </div>


    )

  }

  return (
    <div className="hardList"
      style={{ top: px(90) }}
      onClick={(e) => {
        e.stopPropagation()
        selectHardwareModalShowFun(false)
      }}
    >
      <ul>
        {options}
      </ul>
      {otherItems()}

    </div>
  )
}


HardAndPetsUI.propTypes = {
  selectHardwareList: PropTypes.any
}
//默认值
HardAndPetsUI.defaultProps = {
  selectHardwareList: {}
}
export default connect(
  state => ({
    selectHardwareInfo: state.hardwareReduce.selectHardwareInfo,
    selectHardwareList: state.hardwareReduce.selectHardwareList,
  }),
  { selectHardwareInfoFun, selectHardwareModalShowFun }
)(HardAndPetsUI)