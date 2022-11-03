import React, { useEffect, useState, useRef } from "react";
import { Layout, Button, Input, message } from "antd";
import { px } from "../../../../utils/px";
import { connect } from "react-redux";
import {
  selectHardwareModalShowFun,
  petSortTypeFun,
  petDetailInfoFun,
} from "../../../../store/actions";

import PlugInOtter from "../../../../assets/img/PlugInOtter.png";

import moment from "moment";
import _ from "lodash";
import "./index.less";


const LinkEquipment = ({ petMessage, hardwareMessage, cutPageType, qsmConnectStatus, isNext = false }) => {
  const [nextType, setNextType] = useState(false);
  const [serialNumber, setSerialNumber] = useState('')


  const onClick = async () => {

    await register()
    await verify()
    setNextType(true);
  }
  const register = async () => {
    let storage = window.localStorage;
    const SDK = require("qsm-otter-sdk");
    let userId = storage.userId, userName = storage.userName, email = storage.userEmail, orgId = storage.lastOrganization, orgName = storage.orgName

    console.log('register入参：', { userId, userName, email, orgId, orgName });
    const response = await SDK.registerUserAndPractice("EX1QrGQTwPAjkJ0p7EEG7A", "ZQh5q7Uv1UPsC8RY0eDoSf3eYrMzDHxYkJExG13k", userId, userName, email, orgId, orgName)
    console.log('register入参：', response, response.status)
    let res = response
    if (res.status === 200) {
      message.success(res.data.message)
    } else {
      let zhenshu = parseInt(res.status / 100)
      switch (zhenshu) {
        case 2:
          message.success(res.data.message || res.data.error)
          break;
        case 4: message.warn(res.data.message || res.data.error)
          break;
        case 5:
          message.warn(res.data.message || res.data.error)

        default:
          break;
      }
    }
  }

  const verify = async () => {
    let storage = window.localStorage;
    const SDK = require("qsm-otter-sdk");
    let user_id = storage.userId;
    let practice_id = storage.lastOrganization;
    let serial_number = serialNumber;
    let API_KEY = "EX1QrGQTwPAjkJ0p7EEG7A"
    let ACCESS_TOKEN = "ZQh5q7Uv1UPsC8RY0eDoSf3eYrMzDHxYkJExG13k"
    console.log('verify入参', { user_id, practice_id, serial_number, serial_number, API_KEY, ACCESS_TOKEN });
    await SDK.verifyInstrument(API_KEY, ACCESS_TOKEN, user_id, practice_id, serial_number)
      .then(res => {
        console.log('verify', res)
        if (res.status === 200) {
          message.success(res.data.message)
        } else {
          let zhenshu = parseInt(res.status / 100)
          switch (zhenshu) {
            case 2:
              message.success(res.data.message || res.data.error)
              break;
            case 4: message.warn(res.data.message || res.data.error)
              break;
            case 5:
              message.warn(res.data.message || res.data.error)

            default:
              break;
          }
        }
      })
  }




  useEffect(() => {
    setNextType(false);
    return (() => { })

  }, [petMessage.petId])
  useEffect(() => {

    if (isNext) {
      setNextType(true)
    }
  }, [])


  const body = () => {
    if (!nextType) {
      return (
        <>
          <div className="middleBox">
            <Input placeholder="Please enter your serial number" className="middleInput" style={{ width: px(300), height: px(50) }}
              value={serialNumber}
              onChange={(val) => setSerialNumber(val.target.value)}
            />
          </div>
          <div className="bottomBox">
            <Button type="primary" shape="round" style={{ width: px(400), height: px(40) }} onClick={onClick} >Next</Button>
          </div>
        </>
      )
    } else {
      if (qsmConnectStatus === 'disconnected') {
        return (
          <div className="imageBox">
            <img src={PlugInOtter} alt="" style={{ height: px(360) }} />
          </div>
        )
      } else {
        cutPageType('swabPetEarPage')
      }
    }
  }


  return (
    <>
      <div className="topBox">
        <p className="topTitle" style={{ fontSize: px(40) }}>
          {!nextType ? 'Register OtterEQ' : 'Plug in OtterEQ'}
        </p>
      </div>
      {
        body()
      }
    </>
  );
};

export default connect(
  (state) => ({
    petMessage: state.petReduce.petDetailInfo,
    hardwareMessage: state.hardwareReduce,
    qsmConnectStatus: state.qsmReduce.qsmConnectStatus,
  }),
  {
    selectHardwareModalShowFun,
    petSortTypeFun,
    petDetailInfoFun,
  }
)(LinkEquipment);
