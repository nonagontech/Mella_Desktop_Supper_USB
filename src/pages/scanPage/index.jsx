import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { Layout, Menu, PageHeader } from "antd";
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
import HeaderItem from "../temperaturePage/components/headerItem";
import LinkEquipment from "./components/LinkEquipment";
import ScanPet from "./components/scanPet";
import PropTypes from 'prop-types';
import { px } from "../../utils/px";

import "./index.less";

const ScanPage = ({ petMessage, hardwareMessage, bodyHeight, }) => {
  let { petId, isWalkIn } = petMessage;

  return (
    <>
      <Layout className="scanHomeBox" style={{ height: bodyHeight }}>
        <div style={{ height: px(100), background: "#fff", position: 'relative' }}>
          <div style={{ height: '100%' }}>
            <HeaderItem />
          </div>
        </div>
        {_.isEmpty(petId) && !isWalkIn ? <LinkEquipment /> : <ScanPet />}
      </Layout>
    </>
  );
};

ScanPage.propTypes = {
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
)(ScanPage);
