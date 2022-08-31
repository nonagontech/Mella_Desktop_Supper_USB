import React, { useEffect, useState } from "react";
import { Layout } from "antd";

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

import "./index.less";

const { Content, Header } = Layout;
const MabelPage = ({ petMessage, hardwareMessage, bodyHeight }) => {

  return (
    <Layout className="mabelPageBox" style={{ height: bodyHeight }}>
      <div className="headerContentBox" style={{ background: "#fff", position: 'relative' }}>
        <div style={{ height: '100%' }}>
          <HeaderItem />
        </div>
      </div>
      {_.isEmpty(petMessage) ? (
        <div className="chackPatientBox">
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

MabelPage.propTypes = {
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
)(MabelPage);
