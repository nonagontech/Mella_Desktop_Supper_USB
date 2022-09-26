import React, { useEffect, useState, useRef } from "react";
import { Layout, Button, Input } from "antd";
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


  const onClick = () => {
    setNextType(true);
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
    // if(qsmConnectStatus ==='disconnected'){
    //   return (

    //   )
    // }
    if (!nextType) {
      return (
        <>
          <div className="middleBox">
            <Input placeholder="Please enter your serial number" className="middleInput" style={{ width: px(300), height: px(50) }} />
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
