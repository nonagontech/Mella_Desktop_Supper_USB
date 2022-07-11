import React, { useEffect, useState } from "react";
import { Image, Layout } from "antd";
import { connect } from "react-redux";
import PressButton_Pro from "./../../../assets/img/PressButton_Pro.png";
import biggieonscale from "./../../../assets/img/biggieonscale.png";
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

const LinkEquipment = ({ petMessage, hardwareMessage }) => {
  let { mellaConnectStatus } = hardwareMessage;
  const [saveNum, setSaveNum] = useState(0);
  return (
    <>
      <div className={"linkBox"}>
        <div className="startBox">
          <img src={biggieonscale}></img>
          <p className="startTitle">Ready, place pet onto scale</p>
        </div>
        <div className="tableBox">
          <HistoryTable saveNum={saveNum} tableColumnType="weight" />
        </div>
      </div>
    </>
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
    setMellaConnectStatusFun,
    setMellaMeasureValueFun,
    setMellaPredictValueFun,
    setMellaMeasurePartFun,
  }
)(LinkEquipment);
