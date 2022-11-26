import React, { useEffect, useState, useRef } from "react";
import { Button, Input, Card, List, Image, } from "antd";
import { InfoCircleFilled } from "@ant-design/icons";

import takePhto from "../../../../assets/img/takePhto.png"

import electronStore from "../../../../utils/electronStore";

import { useHistory } from "react-router-dom";
import { connect } from "react-redux";
import {
  selectHardwareModalShowFun,
  petSortTypeFun,
  petDetailInfoFun,
  setSelectHardwareType
} from "../../../../store/actions";
import _ from "lodash";

import "./index.less";
import { px } from "../../../../utils/px";
import MyModal from "../../../../utils/myModal/MyModal";

const LinkEquipment = ({ petMessage, }) => {
  let history = useHistory();
  const [ip, setIp] = useState('192.168.0.202');
  const [showIp, setShowIp] = useState('')

  const next = () => {
    setIp(showIp)
  }

  const inputIp = () => {
    return (
      <div className="inputIp">
        <div className="title">Please enter the IP<br />address</div>

        <div className="middleBox">
          <Input placeholder="192.168.0.203" className="middleInput" style={{ width: px(300), height: px(50) }}
            value={showIp}
            onChange={(val) => setShowIp(val.target.value)}
          />
        </div>
        <div className="bottomBox">
          <Button type="primary" shape="round" style={{ width: px(400), height: px(40) }} onClick={next} >Next</Button>
        </div>
      </div>
    )
  }
  const takePhoto = () => {

  }
  const urlErrModal = () => {
    return (
      <div className="urlErrModal">
        <div className="close">

        </div>

      </div>
    )
  }

  const vidio = () => {
    return (
      <div className="vidio">
        <div className="vidioFa">
          <img
            onError={(err) => {
              console.log("🚀 ~ file: index.jsx ~ line 59 ~ vidio ~ err", err)
            }}

            src={`http://${ip}:81`} />
        </div>
        <div
          className="btn"
          onClick={takePhoto}
        >
          <img src={takePhto} alt="" />
        </div>

        <MyModal
          visible={true}
          element={urlErrModal()}
        />




      </div>

    )


  }



  return (
    <div id="motionCameraBody">
      {/* {inputIp()} */}
      {vidio()}
    </div>
  );
};

export default connect(
  (state) => ({
    petMessage: state.petReduce.petDetailInfo,
    hardwareMessage: state.hardwareReduce,
  }),
  {
    selectHardwareModalShowFun,
    petSortTypeFun,
    petDetailInfoFun,
    setSelectHardwareType
  }
)(LinkEquipment);
