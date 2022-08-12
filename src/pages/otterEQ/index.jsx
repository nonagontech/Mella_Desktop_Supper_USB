import React, { useEffect, useState } from "react";
import { Layout } from "antd";
import LinkEquipment from "./components/linkEquipment";
import SwabPetEar from "./components/swabPetEar";
import ExperimentalPage from "./components/experimental";
import TimerPage from "./components/timer";
import HeaderItem from "./../temperaturePage/components/headerItem";
import { px } from "../../utils/px";
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
const OtterEQPage = ({ petMessage, hardwareMessage,bodyHeight }) => {
  const [cutPageType, setCutPageType] = useState('linkPage');
  const changePage = () => {
    switch (cutPageType) {
      case "linkPage":
        return <LinkEquipment cutPageType={getCutPageType} />;
      case "swabPetEarPage":
        return <SwabPetEar cutPageType={getCutPageType} />;
      case "experimentalPage":
        return <ExperimentalPage cutPageType={getCutPageType} />;
      case "timerPage":
        return <TimerPage cutPageType={getCutPageType} />;
      default:
        break;
    }
  };

  const getCutPageType = (type) => {
    console.log('type: ', type);
    if (!_.isEmpty(type)) {
      setCutPageType(type);
    }
  }

  return (
    <Layout className="ottterEQBox" style={{ height: bodyHeight }}>
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
        <Content className={"otterEQcontent"}>
          {changePage()}
        </Content>
      )}
    </Layout>
  );
};

OtterEQPage.propTypes = {
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
)(OtterEQPage);
