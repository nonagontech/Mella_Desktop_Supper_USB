import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Input, Button, message, Spin, BackTop } from 'antd';
import { createFromIconfontCN, SyncOutlined, LoadingOutlined } from '@ant-design/icons';

import { devicesTitleHeight } from '../../utils/InitDate'
import electronStore from '../../utils/electronStore';
import blueSearch from './../../assets/img/blueSerch.png'
import biggieHome from './../../assets/img/searchType-biggieHome.png'
import biggiePro from './../../assets/img/searchType-biggiePro.png'
import mellaHome from './../../assets/img/searchType-home.png'
import mellaPro from './../../assets/img/searchType-mellaPro.png'
import maeBowl from './../../assets/img/searchType-maeBowl.png'
import other from './../../assets/img/searchType-other.png'
import possum from './../../assets/img/searchType-possum.png'
import rfid from './../../assets/img/searchType-rfid.png'
import MinClose from '../../utils/minClose/MinClose'
import MouseDiv from '../../utils/mouseDiv/MouseDiv'
import back_white from '../../assets/img/back-white.png'
import back_hui from '../../assets/img/back-hui.png'
import redclose from '../../assets/img/redclose.png'
import MyModal from './../../utils/myModal/MyModal'
import { mTop, px, MTop, pX } from '../../utils/px';
import './mainbody.less'

let storage = window.localStorage;
const AddDevice = ({ bodyHeight, hardwareReducer, isHaveUsbDevice, receiveBroadcastHardwareInfo }) => {
    //是否有底座设备
    const [noUSB, setNoUSB] = useState(false)
    //设备列表
    const [devicesList, setDevicesList] = useState([])
    //选择的设备
    const [selectDevice, setSelectDevice] = useState(null)
    //重命名
    const [reName, setReName] = useState('')
    //已经保存过的设备的macid
    const [saveDeviceMac, setSaveDeviceMac] = useState([])
    //顶部文本
    const [topText, setTopText] = useState(' Pair Device')

    useEffect(() => {
        //获取设备列表
        let devicesList = electronStore.get(`${storage.lastOrganization}-${storage.userId}-devicesTypeList`) || []
        if (devicesList.length > 0) {
            let saveDeviceMac = []
            for (let i = 0; i < devicesList.length; i++) {
                const element = devicesList[i];
                for (let j = 0; j < element.devices.length; j++) {
                    const device = element.devices[j];
                    saveDeviceMac.push(element.mac)
                }
            }
            setSaveDeviceMac(saveDeviceMac)
        }
    }, [])
    useEffect(() => {
        if (!selectDevice) {
            setTopText(' Pair Device')
        } else {
            setTopText('Device Connected')
        }

    }, [selectDevice])
    useEffect(() => {
        setNoUSB(!isHaveUsbDevice)
    }, [isHaveUsbDevice])
    useEffect(() => {
        let sameFlog = devicesList.some((device, index) => {
            return device.macId === receiveBroadcastHardwareInfo.macId
        })
        if (sameFlog || !receiveBroadcastHardwareInfo.macId) {   //重复直接退出
            return
        }
        let deviceArr = [].concat(devicesList)
        deviceArr.push(receiveBroadcastHardwareInfo)
        setDevicesList(deviceArr)



    }, [receiveBroadcastHardwareInfo])

    const addDevice = () => {
        //拿到列表中的所有硬件设备

    }

    const body = () => {

        if (selectDevice) {
            return <div className="addDevice1 flex">
                <div className="addDeviceTop flex">
                    <div className="title" style={{ fontSize: px(28), marginBottom: px(20), marginTop: px(20) }}>Would you like to name<br />
                        {`this ${selectDevice.name} device?`}</div>

                    <div className="title" style={{ fontSize: px(24), marginBottom: px(40), }}>
                        {`SN: ${selectDevice.macId}`}</div>


                    <div className="input flex" style={{ marginBottom: px(20), width: px(400) }}>
                        <input type="text" style={{ height: px(45) }}
                            value={reName}
                            onChange={(value) => {
                                setReName(value.target.value)

                            }}
                            placeholder={`${selectDevice.name} Device Name`}
                        />
                    </div>
                    <div className="input flex" style={{ marginBottom: px(60), width: px(400) }}>
                        <input type="text" style={{ height: px(45) }}
                            value={reName}
                            onChange={(value) => {
                                setReName(value.target.value)

                            }}
                            placeholder={`Exam Room Name`}
                        />
                    </div>
                    <div className="text" style={{ fontSize: px(18) }}>* We recommend naming based
                        on the Exam Room. Write<br /> the name
                        on the sticker provided so it is easy
                        to select<br /> your device in the future.</div>
                </div>
                <div className="addDeviceFoot flex">
                    <div className="btn"
                        onClick={() => {

                            // console.log(reName, selectDevice);
                            // if (reName) {
                            //     selectDevice.name = reName
                            // }
                            // let deviceList = electronStore.get(`${storage.userId}-deviceList`)
                            // console.log('---', deviceList);
                            // deviceList.push(selectDevice)
                            // electronStore.set(`${storage.userId}-deviceList`, deviceList)

                            // saveDeviceMac.push(selectDevice.macId)
                            // setSaveDeviceMac(saveDeviceMac)
                            // setSelectDevice({})
                            // setReName('')


                        }}
                    >
                        <p className='btnText'>Add Another Device</p>
                    </div>
                    <div className="btn"
                        onClick={() => {
                            console.log(reName, selectDevice);
                            if (reName) {
                                selectDevice.name = reName
                            }
                            let deviceList = electronStore.get(`${storage.userId}-deviceList`)
                            deviceList.push(selectDevice)
                            electronStore.set(`${storage.userId}-deviceList`, deviceList)
                        }}
                    >
                        <p className='btnText'>Finish</p>
                    </div>
                </div>


            </div>
        } else {
            if (noUSB) {
                return <div className='flex' style={{ width: '100%', marginBottom: px(120), height: '50%', }}>
                    <img src={redclose} alt="" style={{ width: px(80) }} />

                    <p style={{ textAlign: 'center', fontSize: px(30), marginTop: px(50) }}>The base is not detected.<br />Please insert the base</p>
                </div>
            } else {
                if (devicesList.length === 0) {
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
                    return <div className="flex" style={{ width: '100%', height: '100%', position: 'relative' }}>


                        <div className="addDeviceContent">
                            <div className="blueAnimal" style={{ marginTop: px(50) }}>
                                {/* <img src={blueSearch} alt="" width={px(150)} /> */}
                                <div className="loadIcon" style={{ marginBottom: MTop(5) }}>
                                    <LoadingOutlined style={{ fontSize: 30, color: '#8a8a8a', marginTop: mTop(-30), }} />
                                </div>
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

                        {/* <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', marginBottom: px(130) }}>
                          
                            <p>
                                {'searching...'}
                            </p>
                        </div> */}
                    </div>
                } else {
                    let options = devicesList.map((item, index) => {

                        let flog = saveDeviceMac.some((device, index) => {
                            return device === item.macId
                        })
                        let fontColor = flog ? '#D1C4C4' : '#4a4a4a'
                        return <li
                            className='flex'
                            style={{ marginBottom: px(20) }}
                            key={`${index}`}
                            onClick={() => {
                                if (!flog) {
                                    setSelectDevice(item)

                                } else {
                                    message.destroy();
                                    message.error('This device has already been added')
                                }

                            }}
                        >

                            <div className="deviceName" style={{ fontSize: px(24), color: fontColor }}>{item.name}</div>
                            <div className="deviceMacId" style={{ fontSize: px(18), color: fontColor }}>{item.macId}</div>

                        </li>
                    })
                    return <div className='deviceList ' >
                        <ul>
                            {options}
                        </ul>
                    </div>
                }
            }
        }

    }

    return (
        <div className='addDevice' style={{ height: bodyHeight }}>
            <div className="addDeviceTitle" style={{ height: devicesTitleHeight, fontSize: 26, paddingLeft: px(20) }}>
                {topText}
            </div>

            {body()}






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
        hardwareReducer: state.hardwareReduce,
        isHaveUsbDevice: state.hardwareReduce.isHaveUsbDevice,
        receiveBroadcastHardwareInfo: state.hardwareReduce.receiveBroadcastHardwareInfo,
    }),
    {}
)(AddDevice)