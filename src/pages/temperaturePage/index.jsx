import React, { useEffect, useState } from "react";
import { Layout } from "antd";

import LinkEquipment from "./components/linkEquipment";
import Measurement from "./components/measurement";
import MeasuredData from "./components/measuredData";
import HeaderItem from "./components/headerItem";

import { connect } from "react-redux";
import SelectPatient from '../../assets/img/SelectPatient.png'
import {
  selectHardwareModalShowFun,
  petSortTypeFun,
  petDetailInfoFun,
  setMellaConnectStatusFun,
  setMellaMeasureValueFun,
  setMellaPredictValueFun,
  setMellaMeasurePartFun,
} from "../../store/actions";
import { px } from "../../utils/px";
import _ from "lodash";
import PropTypes from 'prop-types';

import "./index.less";

const TemperaturePage = ({ petMessage, hardwareMessage, bodyHeight }) => {
  let { mellaConnectStatus, mellaMeasurePart } = hardwareMessage;
  const [vibible, setVibible] = useState(false);

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
        // return <MeasuredData />;
        return <LinkEquipment />;
      default:
        break;
    }
  };
  return (
    <>
      <Layout className="homeBox" style={{ height: bodyHeight }}>
        <div className="headerContentBox">
          <div style={{ height: '100%' }}>
            <HeaderItem />
          </div>
        </div>
        {_.isEmpty(petMessage) ? (
          <div className="chackPatientBox" style={{ height: bodyHeight - 100, flexDirection: 'column' }}>
            <img style={{ width: '500px' }} src={SelectPatient} alt="" />
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
