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
import LinkEquipment from "./components/linkEquipment";
import ScanPet from "./components/scanPet";
import "./index.less";

const ScanPage = ({ petMessage, hardwareMessage }) => {
  let { petId } = petMessage;

  return (
    <>
      <Layout className="homeBox">
        <HeaderItem />
        {_.isEmpty(petId) ? <LinkEquipment /> : <ScanPet />}
      </Layout>
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
)(ScanPage);
