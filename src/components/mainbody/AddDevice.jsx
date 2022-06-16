import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { px } from '../../utils/px'
import { devicesTitleHeight } from '../../utils/InitDate'

import blueSearch from './../../assets/img/blueSerch.png'
import biggieHome from './../../assets/img/searchType-biggieHome.png'
import biggiePro from './../../assets/img/searchType-biggiePro.png'
import mellaHome from './../../assets/img/searchType-home.png'
import mellaPro from './../../assets/img/searchType-mellaPro.png'
import maeBowl from './../../assets/img/searchType-maeBowl.png'
import other from './../../assets/img/searchType-other.png'
import possum from './../../assets/img/searchType-possum.png'
import rfid from './../../assets/img/searchType-rfid.png'
import './mainbody.less'
const AddDevice = ({ bodyHeight, }) => {

    let options = (val) => {
        let arr = []
        if (val === 1) {
            arr = [mellaPro, mellaHome, biggiePro, biggieHome, rfid]
        } else {
            arr = [possum, maeBowl, other]
        }
        let option = arr.map((item, index) => {
            let imgWidth = px(80)
            imgWidth = index === 2 ? px(65) : imgWidth
            return (<li style={{ margin: `${px(20)}px` }}>
                <div className="searchType-item" key={index} >
                    <img src={item} alt="" width={imgWidth} />
                </div>
            </li>)
        })
        return (
            <ul>
                {option}
            </ul>
        )
    }

    return (
        <div className='addDevice' style={{ height: bodyHeight }}>
            <div className="addDeviceTitle" style={{ height: devicesTitleHeight, fontSize: 26, paddingLeft: px(20) }}>
                Pair Device
            </div>

            <div className="addDeviceContent">
                <div className="blueAnimal" style={{ marginTop: px(40) }}>
                    <img src={blueSearch} alt="" width={px(150)} />
                </div>
                <div className="openText" style={{ margin: `${px(15)}px 0` }}>
                    Make sure your bluetooth and wifi is<br /> activated and turn on your device.
                </div>
                <div className="btn" style={{ width: px(350), height: px(40) }}>
                    <div className="btnText">
                        Scan For Devices
                    </div>
                </div>
                <div className="or" style={{ marginTop: px(10), marginBottom: px(15) }}>
                    Or
                </div>
                <div className="select">
                    Select device type to
                </div>
                <div className="add">
                    add manually
                </div>

                <div className="item">
                    {options(1)}
                    {options(2)}
                </div>
            </div>




        </div >

    )
}


AddDevice.propTypes = {
    bodyHeight: PropTypes.number,
    devicesTypeList: PropTypes.array
}
//默认值
AddDevice.defaultProps = {
    bodyHeight: 0,
    devicesTypeList: []
}
export default connect(
    state => ({

    }),
    {}
)(AddDevice)