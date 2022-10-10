import React, { useEffect, useState } from "react";
import {
  Button,
  Layout,
  Modal,
  message,
} from "antd";
import { ExclamationCircleOutlined } from "@ant-design/icons";

import { updatePetInfo1 } from "../../../api";

import { connect } from "react-redux";
import {
  selectHardwareModalShowFun,
  petSortTypeFun,
  petDetailInfoFun,
  setRulerConnectStatusFun,
  setRulerMeasureValueFun,
  setRulerUnitFun,
  setRulerConfirmCountFun,
} from "../../../store/actions";
import _ from "lodash";

import "./calculationResult.less";

const { Content } = Layout;
const CalculationResult = ({
  type,
  petMessage,
  petDetailInfoFun,
  ruleMessage,
  getMeasureData,
}) => {
  let { petId } = petMessage;
  let { rulerUnit } = ruleMessage;
  let storage = window.localStorage;
  //重新测量
  const onAgainMeasure = () => {
    type(false);
  }
  //保存数据
  const onSave = () => {
    Modal.confirm({
      title: "Confirm",
      icon: <ExclamationCircleOutlined />,
      content: "Whether To Save Data",
      top: "40vh",
      onOk: saveData,
    });
  }
  //保存数据
  const saveData = () => {
    const newNum = (val) => {
      if (val) {
        if (rulerUnit === "in") {
          return parseFloat((parseFloat(val) * 2.54).toFixed(1));
        } else {
          return parseFloat(val);
        }
      } else {
        return "";
      }
    };
    let prams = {
      l2rarmDistance: newNum(getMeasureData.bodyValue) || null,
      lowerTorsoCircumference: newNum(getMeasureData.lowerValue) || null,
      upperTorsoCircumference: newNum(getMeasureData.upperValue) || null,
      neckCircumference: newNum(getMeasureData.neckValue) || null,
      h2tLength: newNum(getMeasureData.headValue) || null,
      torsoLength: newNum(getMeasureData.torsoValue) || null,
    };

    updatePetInfo1(storage.userId, petId, prams)

      .then((res) => {
        if (res.flag) {
          petDetailInfoFun({
            ...petMessage,
            ...prams,
          });
          message.success("Uploaded successfully");
          type(false);
        } else {
          message.error("upload failed");
        }
      })
      .catch((err) => {
        message.error("update failed");
      });
  };

  return (
    <Content className="calculationResultContentBox">
      <div className="localityBox">
        <div className="localityTitleBox">
          <p className="localityTitle">Lean Body Mass</p>
        </div>
        <div className="circleBox">
          <div className="dataBox">
            <p>0.85</p>
            <p>g</p>
          </div>
        </div>
      </div>
      <div className="localityBox">
        <div className="localityTitleBox">
          <p className="localityTitle">Fat Mass</p>
        </div>
        <div className="circleBox">
          <div className="dataBox">
            <p>0.98</p>
            <p>g</p>
          </div>
        </div>
      </div>
      <div className="localityBox">
        <div className="localityTitleBox">
          <p className="localityTitle">Body Fat Percent</p>
        </div>
        <div className="circleBox">
          <div className="dataBox">
            <p>24%</p>
          </div>
        </div>
      </div>
      <div className="againMeasureBox">
        <p onClick={() => onAgainMeasure()}>Measure Again</p>
      </div>
      <div className="calculateBtnBox">
        <Button
          type="primary"
          shape="round"
          size="large"
          className="calculateBtn"
          onClick={() => onSave()}
        >
          Calculate
        </Button>
      </div>
    </Content>
  );

};

export default connect(
  (state) => ({
    petMessage: state.petReduce.petDetailInfo,
    ruleMessage: state.hardwareReduce,
  }),
  {
    selectHardwareModalShowFun,
    petSortTypeFun,
    petDetailInfoFun,
    setRulerConnectStatusFun,
    setRulerMeasureValueFun,
    setRulerUnitFun,
    setRulerConfirmCountFun,
  }
)(CalculationResult);
