import React, { useState, useEffect } from "react";
import { Layout } from "antd";

import HeaderItem from "../temperaturePage/components/headerItem";
import LinkEquipment from "./components/LinkEquipment";
import ScanPet from "./components/scanPet";
import CalculationResult from "./components/calculationResult";

import PropTypes from 'prop-types';
import _ from "lodash";
import { connect } from "react-redux";
import {
  selectHardwareModalShowFun,
  petSortTypeFun,
  petDetailInfoFun,
  setMellaConnectStatusFun,
  setMellaMeasureValueFun,
  setMellaPredictValueFun,
  setMellaMeasurePartFun,
} from "../../store/actions";

import "./index.less";

const ScanPage = ({ petMessage, hardwareMessage, bodyHeight, }) => {
  let { petId, isWalkIn } = petMessage;
  const [calculationResultType, setCalculationResultType] = useState(false);//切换计算结果界面
  const [measureData, setMeasureData] = useState({});//测量的值

  return (
    <>
      <Layout className="scanHomeBox" style={{ height: bodyHeight }}>
        <div className="headerContentBox" style={{ background: "#fff", position: 'relative' }}>
          <div style={{ height: '100%' }}>
            <HeaderItem />
          </div>
        </div>
        {
          calculationResultType ?
            (
              <CalculationResult type={setCalculationResultType} getMeasureData={measureData} />
            ) :
            (
              _.isEmpty(petId) && !isWalkIn ? <LinkEquipment /> : <ScanPet type={setCalculationResultType} setMeasureData={setMeasureData} />
            )
        }

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
