import React, { useEffect, useState } from "react";
import { Layout, message } from "antd";

import LinkEquipment from "./components/linkEquipment";
import SwabPetEar from "./components/swabPetEar";
import ExperimentalPage from "./components/experimental";
import TimerPage from "./components/timer";
import HeaderItem from "./../temperaturePage/components/headerItem";

import _ from "lodash";
import { connect } from "react-redux";
import {
  selectHardwareModalShowFun,
  petSortTypeFun,
  petDetailInfoFun,
  setQsmConnectStatus,
  setQsmPart
} from "../../store/actions";
import PropTypes from 'prop-types';

import "./index.less";
import Result from "./components/result";


// const ipcRenderer = window.require("electron").ipcRenderer;
let ipcRenderer = window.electron.ipcRenderer;
const SDK = require("qsm-otter-sdk");

const { Content, Header } = Layout;
const OtterEQPage = ({ petMessage, hardwareMessage, bodyHeight, setQsmConnectStatus, setQsmPart }) => {
  const [cutPageType, setCutPageType] = useState('linkPage');
  const [qsmConStatus, setQsmConStatus] = useState('linkPage');
  const [qsmPortName, setQsmPortName] = useState('')
  const changePage = () => {
    if (qsmConStatus === 'connected')
      switch (cutPageType) {
        case "linkPage":
          return <LinkEquipment cutPageType={getCutPageType} />;
        // return <Result cutPageType={getCutPageType} />;
        case "swabPetEarPage":
          return <SwabPetEar cutPageType={getCutPageType} />;
        case "experimentalPage":
          return <ExperimentalPage cutPageType={getCutPageType} />;
        case "timerPage":
          return <TimerPage cutPageType={getCutPageType} />;
        case "result":
          return <Result cutPageType={getCutPageType} />;
        default:
          break;
      } else {
      switch (cutPageType) {
        case "linkPage":
          return <LinkEquipment cutPageType={getCutPageType} />;
        case "swabPetEarPage":
        case "experimentalPage":
        case "timerPage":
          return <LinkEquipment cutPageType={getCutPageType} isNext={true} />;
        default:
          break;
      }
    }
  };

  const getCutPageType = (type) => {
    console.log('type: ', type);
    if (!_.isEmpty(type)) {
      setCutPageType(type);
    }
  }

  //查看是否有QSM设备插入
  const readQSMConnectionStatus = async () => {
    try {
      const pairInstrument = await SDK.pairInstrument()
      console.log("🚀 ~ file: index.jsx ~ line 69 ~ readQSMConnectionStatus ~ pairInstrument", pairInstrument)
      setQsmPart(pairInstrument)
    } catch (error) {
      console.log('error', error);
    }

    setTimeout(async () => {
      const connectionStatus = await SDK.readConnectionStatus()

      let a = typeof (connectionStatus)
      console.log('插入情况', connectionStatus, a);
      if (typeof (connectionStatus) === 'boolean') {
        let status = connectionStatus ? 'connected' : 'disconnected'
        setQsmConnectStatus(status)
        setQsmConStatus(status)
      }
    }, 500);
  }

  /**
   * @dec 从main.js传过来的usb插拔事件
   * @param {*} e
   * @param {*} data 值为true 代表插入设备，false为拔掉设备
   */
  const usbDetect = async (e, data) => {
    // if (data) { // readQSMConnectionStatus()
    //   readQSMConnectionStatus()
    // } else {
    //   const connectionStatus = await SDK.readConnectionStatus()

    //   let a = typeof (connectionStatus)
    //   console.log('插入情况', connectionStatus, a);
    //   if (typeof (connectionStatus) === 'boolean') {
    //     let status = connectionStatus ? 'connected' : 'disconnected'
    //     setQsmConnectStatus(status)setQsmPart
    //     setQsmConStatus(status)
    //   }
    // }

  }
  let deviceStatus = null
  const conectstatus = async () => {
    deviceStatus = await SDK.readConnectionStatus()
    console.log('connect', deviceStatus)
    if (typeof (deviceStatus) === 'boolean') {
      let status = deviceStatus ? 'connected' : 'disconnected'
      setQsmConnectStatus(status)
      setQsmConStatus(status)
    }
  }
  const getQsmPortName = (e, data) => {
    setQsmPart(data)
    setQsmPortName(data)
  }

  useEffect(() => {
    setCutPageType('linkPage');
    return (() => { })

  }, [petMessage.petId])

  useEffect(() => {
    console.log('连接监听');
    navigator.serial.addEventListener("connect", conectstatus);
    navigator.serial.addEventListener("disconnect", conectstatus);
    return () => {
      navigator.serial.removeEventListener("connect", conectstatus);
      navigator.serial.removeEventListener("disconnect", conectstatus);
    }
  }, [])

  // useEffect(() => {
  //   ipcRenderer.on('qsmPortName', getQsmPortName);
  //   return () => { ipcRenderer.removeListener("qsmPortName", getQsmPortName); };

  // }, [])




  //监听usb的插拔
  useEffect(() => {
    ipcRenderer.on("usbDetect", usbDetect);
    return () => {
      ipcRenderer.removeListener("usbDetect", usbDetect);
    }
  }, [])
  //初始化获取设备是否插入
  useEffect(() => {
    readQSMConnectionStatus()
    message.destroy();
  }, [])


  return (
    <Layout className="ottterEQBox" style={{ height: bodyHeight }}>
      <div className="headerContentBox" style={{ background: "#fff", position: 'relative' }}>
        <div style={{ height: '100%' }}>
          <HeaderItem />
        </div>
      </div>
      {_.isEmpty(petMessage) ? (
        <div className="chackPatientBox" style={{ height: bodyHeight - 100 }}>
          <p className="chackPatientTitle">Select a patient</p>
        </div>
      ) : (
        <Content className="otterEQcontent">
          {changePage()}
        </Content>
      )}
    </Layout>
  );
};

OtterEQPage.propTypes = {
  bodyHeight: PropTypes.number,
  devicesTypeList: PropTypes.array
}

export default connect(
  (state) => ({
    petMessage: state.petReduce.petDetailInfo,
    hardwareMessage: state.hardwareReduce,
  }),
  {
    selectHardwareModalShowFun,
    petSortTypeFun,
    petDetailInfoFun,
    setQsmConnectStatus,
    setQsmPart
  }
)(OtterEQPage);
