import React, { useEffect, useState } from "react";
import { Layout, message } from "antd";

import HeaderItem from "./../temperaturePage/components/headerItem";
import LinkEquipment from "./components/linkEquipment";

import _ from "lodash";
import { connect } from "react-redux";
import {
  selectHardwareModalShowFun,
  petSortTypeFun,
  petDetailInfoFun,
} from "../../store/actions";
import PropTypes from 'prop-types';
import SelectPatient from '../../assets/img/SelectPatient.png'

import "./index.less";

const { Content, Header } = Layout;
const MotionCamera = ({ petMessage, hardwareMessage, bodyHeight }) => {

  //为了清除应没有底座跳出的弹框
  useEffect(() => {
    message.destroy();
  }, [])

  return (
    <Layout id="motionCamera" style={{ height: bodyHeight }}>
      <div className="headerContentBox" style={{ background: "#fff", position: 'relative' }}>
        <div style={{ height: '100%' }}>
          <HeaderItem />
        </div>
      </div>
      {_.isEmpty(petMessage) ? (
        <div className="chackPatientBox" style={{ height: bodyHeight - 100, flexDirection: 'column'}}>
          <img style={{ width: '500px' }} src={SelectPatient} alt="" />
          <p className="chackPatientTitle">Select a patient</p>
        </div>
      ) : (
        <Content className={"mabelPagecontentBox"}>
          <LinkEquipment />
        </Content>
      )}
    </Layout>
  );
};

MotionCamera.propTypes = {
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
  }
)(MotionCamera);
