import React, { useEffect, useState } from "react";
import {
  Button,
  Layout,
  Modal,
  message,
} from "antd";
import { ExclamationCircleOutlined } from "@ant-design/icons";

import { updatePetInfo1 } from "../../../api";
import { petPicture, calculateAge, catLeanBodyMass, catFatMass, dogLeanBodyMass, dogFatMass, dogBodyFatPercentage } from '../../../utils/commonFun';

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
  let { petId, petSpeciesBreedId, weight, birthday } = petMessage;
  let { rulerUnit } = ruleMessage;
  let {
    headValue,
    neckValue,
    upperValue,
    lowerValue,
    torsoValue,
    bodyValue,
    hindlimbValue,
    forelimbLengthValue,
    forelimbCircumferenceValue,
  } = getMeasureData;
  let storage = window.localStorage;
  //重新测量
  const onAgainMeasure = () => {
    type(false);
  }
  //用户点击保存
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
      hindLimbLength: newNum(getMeasureData.hindlimbValue) || null,
      foreLimbLength: newNum(getMeasureData.forelimbLengthValue) || null,
      foreLimbCircumference: newNum(getMeasureData.forelimbCircumferenceValue) || null,
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
  //获取LeanBodyMass
  const getLeanBodyMass = () => {
    switch (petPicture(petSpeciesBreedId)) {
      case 'cat':
        return _.round(catLeanBodyMass(headValue, hindlimbValue, forelimbCircumferenceValue, forelimbLengthValue, bodyValue, upperValue), 2);
      case 'dog':
        return _.round(dogLeanBodyMass(weight, calculateAge(birthday), headValue, forelimbLengthValue, hindlimbValue), 2);
      default:
        message.warning('The pet is of unknown breed');
        return;
    }
  }
  //获取FatMass
  const getFatMass = () => {
    switch (petPicture(petSpeciesBreedId)) {
      case 'cat':
        return _.round(catFatMass(weight, headValue, forelimbLengthValue, forelimbCircumferenceValue), 2);
      case 'dog':
        return _.round(dogBodyFatPercentage(upperValue, lowerValue, hindlimbValue, headValue), 2);
      default:
        message.warning('The pet is of unknown breed');
        return;
    }
  }
  //获取BodyFatPercent
  const getBodyFatPercent = () => {
    switch (petPicture(petSpeciesBreedId)) {
      case 'cat':
        return;
      case 'dog':
        return _.round(dogFatMass(weight, hindlimbValue, upperValue, headValue), 2);
      default:
        message.warning('The pet is of unknown breed');
        return;
    }
  }
  return (
    <Content className="calculationResultContentBox">
      <div className="localityBox">
        <div className="localityTitleBox">
          <p className="localityTitle">Lean Body Mass</p>
        </div>
        <div className="circleBox">
          <div className="dataBox">
            <p>{getLeanBodyMass() ? `${getLeanBodyMass()}g` : ''}</p>
          </div>
        </div>
      </div>
      <div className="localityBox">
        <div className="localityTitleBox">
          <p className="localityTitle">Fat Mass</p>
        </div>
        <div className="circleBox">
          <div className="dataBox">
            <p>{getFatMass() ? `${getFatMass()}g` : ''}</p>
          </div>
        </div>
      </div>
      <div className="localityBox">
        <div className="localityTitleBox">
          <p className="localityTitle">Body Fat Percent</p>
        </div>
        <div className="circleBox">
          <div className="dataBox">
            <p>{getBodyFatPercent() ? `${getBodyFatPercent()}%` : ''}</p>
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
