import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { Layout } from "antd";
import LinkEquipment from "./components/linkEquipment";
import Measurement from "./components/measurement";
import MeasuredData from "./components/measuredData";
import {
  selectHardwareModalShowFun,
  petSortTypeFun,
  petDetailInfoFun,
  setMellaConnectStatusFun,
  setMellaMeasureValueFun,
  setMellaPredictValueFun,
  setMellaMeasurePartFun,
} from "../../store/actions";
import _ from "lodash";
import HeaderItem from "./components/headerItem";
import { px } from "../../utils/px";
import PropTypes from 'prop-types';
import "./index.less";

const TemperaturePage = ({ petMessage, hardwareMessage,bodyHeight }) => {
  let { mellaConnectStatus } = hardwareMessage;
  //测量温度中的页面变化
  const changePage = () => {
    // return <MeasuredData />
    switch (mellaConnectStatus) {
      case "isMeasuring":
        return <Measurement />;
      case "complete":
        return <MeasuredData />;
      case "connected":
        return <LinkEquipment />;
      case "disconnected":
        return <LinkEquipment />;
      default:
        break;
    }
  };
  return (
    <>
      <Layout className="homeBox" style={{ height: bodyHeight }}>
        <div style={{ height: px(100), background: "#fff", position: 'relative' }}>
          <div style={{ height: '100%' }}>
            <HeaderItem />
          </div>
        </div>
        {_.isEmpty(petMessage) ? (
          <div className="chackPatientBox">
            <p className="chackPatientTitle">Select a patient</p>
          </div>
        ) : (
          changePage()
        )}
      </Layout>
    </>
  );
};

TemperaturePage.propTypes = {
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
    setMellaConnectStatusFun,
    setMellaMeasureValueFun,
    setMellaPredictValueFun,
    setMellaMeasurePartFun,
  }
)(TemperaturePage);
