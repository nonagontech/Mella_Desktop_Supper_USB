import React, { useEffect, useState } from "react";
import { Image, Layout } from "antd";
import { connect } from "react-redux";
import PressButton_Pro from "./../../../assets/img/PressButton_Pro.png";
import biggieonscale from "./../../../assets/img/biggieonscale.png";
import connectScale from "../../../assets/img/connectScale.png"
import {
  selectHardwareModalShowFun,
  petSortTypeFun,
  petDetailInfoFun,
  setMellaConnectStatusFun,
  setMellaMeasureValueFun,
  setMellaPredictValueFun,
  setMellaMeasurePartFun,
} from "../../../store/actions";
import _ from "lodash";
import HistoryTable from "../../../components/historyTable";
import "./linkEquipment.less";

const { Content, Header } = Layout;

const LinkEquipment = ({ petMessage, hardwareMessage, biggieConnectStatus }) => {
  let { mellaConnectStatus } = hardwareMessage;
  const [saveNum, setSaveNum] = useState(0);
  return (
    <>
      <div className={"linkBox"}>
        <div className="startBox">
          {
            biggieConnectStatus != 'disconnected' ? (
              <>
                <img src={biggieonscale}></img>
                <p className="startTitle">Ready, place pet onto scale</p>
              </>
            ) : (
              <>
                <img className="scaleImg" src={connectScale}></img>
                <p className="startTitle">Connect scale to start</p>
              </>
            )
          }


        </div>
      </div>
    </>
  );
};
export default connect(
  (state) => ({
    petMessage: state.petReduce.petDetailInfo,
    hardwareMessage: state.hardwareReduce,
    biggieConnectStatus: state.hardwareReduce.biggieConnectStatus
  }),
  {
    selectHardwareModalShowFun,
    petSortTypeFun,
    petDetailInfoFun,
    setMellaConnectStatusFun,
    setMellaMeasureValueFun,
    setMellaPredictValueFun,
    setMellaMeasurePartFun,
  }
)(LinkEquipment);
