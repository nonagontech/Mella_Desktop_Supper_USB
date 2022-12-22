import React, { useEffect, useState } from "react";
import {
  Button,
  Layout,
  Modal,
  message,
} from "antd";
import { ExclamationCircleOutlined, DownOutlined } from "@ant-design/icons";
import { useHistory } from "react-router-dom";
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
import xia_hui from "./../../../assets/img/xia_hui.png";
import up_red from "./../../../assets/img/up_red.png"
import down_red from "./../../../assets/img/down_red.png"
import down_black from "./../../../assets/img/down_black.png"
import { useUpdateEffect } from 'ahooks';
import _ from "lodash";
import moment from "moment/moment";

import "./calculationResult.less";

const { Content } = Layout;
const CalculationResult = ({
  type,
  petMessage,
  petDetailInfoFun,
  ruleMessage,
  getMeasureData,
  setRulerUnitFun
}) => {
  let history = useHistory();
  const [lastWeightValue, setLastWeightValue] = useState('');//最近一次的体重值
  const [lastWeightTimeValue, setLastWeightTimeValue] = useState('');//最近一次的体重测量时间
  const [lastRuleTimeValue, setLastRuleTimeValue] = useState('');//最近一次的尺子测量时间

  let { petId, petSpeciesBreedId, weight, birthday } = petMessage;
  let { rulerUnit, biggieUnit } = ruleMessage;
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

  let btnList = [
    {
      key: 'LBM',
      name: 'Previous LBM',
      data: '1',
      unit: 'lb'
    },
    {
      key: 'FM',
      name: 'Previous FM',
      data: '1',
      unit: 'lb'
    },
    {
      key: 'BF',
      name: 'Previous BF%',
      data: '1',
      unit: 'lb'
    },
    {
      key: 'day',
      name: 'Days to goal',
      data: '2'
    }
  ]

  //重新测量
  const onAgainMeasure = () => {
    type(false);
  }
  //用户点击保存
  const onSave = () => {
    // Modal.confirm({
    //   title: "Confirm",
    //   icon: <ExclamationCircleOutlined />,
    //   content: "Whether To Save Data",
    //   top: "40vh",
    //   onOk: saveData,
    // });
    saveData()
  }
  //in-cm转换
  const in_cm = (val) => {
    if (val) {
      if (rulerUnit === "in") {
        return parseFloat((parseFloat(val) * 2.54).toFixed(1));
      } else {
        return parseFloat(val);
      }
    } else {
      return 0;
    }
  }
  //保存数据
  const saveData = () => {
    let prams = {
      l2rarmDistance: in_cm(getMeasureData.bodyValue) || null,
      lowerTorsoCircumference: in_cm(getMeasureData.lowerValue) || null,
      upperTorsoCircumference: in_cm(getMeasureData.upperValue) || null,
      neckCircumference: in_cm(getMeasureData.neckValue) || null,
      h2tLength: in_cm(getMeasureData.headValue) || null,
      torsoLength: in_cm(getMeasureData.torsoValue) || null,
      hindLimbLength: in_cm(getMeasureData.hindlimbValue) || null,
      foreLimbLength: in_cm(getMeasureData.forelimbLengthValue) || null,
      foreLimbCircumference: in_cm(getMeasureData.forelimbCircumferenceValue) || null,
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
        return _.round(catLeanBodyMass(headValue, in_cm(hindlimbValue), in_cm(forelimbCircumferenceValue), in_cm(forelimbLengthValue), in_cm(bodyValue), in_cm(upperValue)), 2);
      case 'dog':
        return _.round(dogLeanBodyMass(weight * 2.2046, calculateAge(birthday), in_cm(headValue), in_cm(forelimbLengthValue), in_cm(hindlimbValue)), 2);
      default:
        // message.warning('The pet is of unknown breed');
        return;
    }
  }
  //获取FatMass
  const getFatMass = () => {
    switch (petPicture(petSpeciesBreedId)) {
      case 'cat':
        return _.round(catFatMass(weight * 2.2046, in_cm(headValue), in_cm(forelimbLengthValue), in_cm(forelimbCircumferenceValue)), 2);
      case 'dog':
        return _.round(dogFatMass(weight * 2.2046, in_cm(hindlimbValue), in_cm(upperValue), in_cm(headValue)), 2);
      default:
        // message.warning('The pet is of unknown breed');
        return;
    }
  }
  // 下拉历史
  const TempHisVisible = () => {
    console.log('1');
  }
  //判断上一次测量的体重是否超过一个月
  const judgeWightTime = () => {
    let newTime = moment();
    let diffTime = newTime.diff(moment(lastWeightTimeValue), 'month');
    if (diffTime >= 1 && lastWeightValue) {
      return (
        <p className="historyWeightWarningTitle">Last Weighed {moment(lastWeightTimeValue).format("LL")}.Please
          <a onClick={() => updatePetMessage()}>update the pet's weight</a>.
        </p>
      );
    } else if (diffTime === 0 && lastWeightValue) {
      return <p className="historyWeightTitle">Last Weighed {moment(lastWeightTimeValue).format("LL")}: {lastWeightValue} {biggieUnit === 'kg' ? 'kg' : 'lbs'}</p>
    } else {
      return null
    }
  }
  //用户更新宠物体重信息
  const updatePetMessage = () => {
    //跳转到编辑宠物信息页面
    history.push("/page9");
  }
  //获取BodyFatPercent
  const getBodyFatPercent = () => {
    switch (petPicture(petSpeciesBreedId)) {
      case 'cat':
        return;
      case 'dog':
        return _.round(dogBodyFatPercentage(in_cm(upperValue), in_cm(lowerValue), in_cm(hindlimbValue), in_cm(headValue)), 2);

      default:
        // message.warning('The pet is of unknown breed');
        return;
    }
  }

  useUpdateEffect(() => {
    type(false);
    return () => { };
  }, [petId]);

  return (
    <Content className="calculationResultContentBox">
      <div className="historyWeightBox">
        {
          judgeWightTime()
        }
      </div>
      <div className="localityGroup">
        <div className="localityBox">
          <div className="circleBox">
            <div className="dataBox">
              <p>{getLeanBodyMass() > 0 ? `${getLeanBodyMass()}g` : '—'}</p>
            </div>
          </div>
          <div className="localityTitleBox">
            <p className="localityTitle">Lean Body Mass</p>
          </div>
          <img src={down_black} className="downBlack" alt=""  />
        </div>
        <div className="localityBox">
          <div className="circleBox">
            <div className="dataBox">
              <p>{getBodyFatPercent() > 0 ? `${getBodyFatPercent()}%` : '—'}</p>
            </div>
          </div>
          <div className="localityTitleBox">
            <p className="localityTitle">Body Fat Percent</p>
          </div>
          <img src={down_black} className="downBlack" alt=""  />
        </div>
        <div className="localityBox">
          <div className="circleBox">
            <div className="dataBox">
              <p>{getFatMass() > 0 ? `${getFatMass()}g` : '—'}</p>
            </div>
          </div>
          <div className="localityTitleBox">
            <p className="localityTitle">Fat Mass</p>
          </div>
          <img src={down_black} className="downBlack" alt=""  />
        </div>
      </div>
      <div className="measureContent">
        {btnList.map((item, index) => (
          // <li key={index}>
          //   <>
          //     <img src={data.img} alt="" />
          //     <p>{data.title}</p>
          //   </>
          // </li>
          <div key={index} className="item">
            <>
              <p className="pSt1">{item.name}</p>
              <div className="bottom">
                {
                  item.key != 'day' && <img src={up_red} style={{ width: "20px" , marginRight: "10px"}} alt=""  />
                }
                {/* <img src={up_red} style={{ width: "20px" , marginRight: "10px"}} alt=""  />
                <img src={down_red} style={{ width: "20px" , marginRight: "10px"}} alt=""  /> */}
                <p className="pSt2">{item.data}</p>
                <p className="pSt2">{ item.key != 'day' ? item.unit : null}</p>
              </div>
              {/* <p className="pSt2">{item.data}</p> */}
            </>
          </div>
        ))}
      </div>
      <div className="calculateBtnBox">
        <Button
          type="primary"
          shape="round"
          size="large"
          className="calculateBtn"
          onClick={() => onAgainMeasure()}
        >
          Measure Again
        </Button>
        <Button
          type="primary"
          shape="round"
          size="large"
          className="calculateBtn"
          onClick={() => onSave()}
        >
          Save
        </Button>
      </div>
      <div className="scrollHistory">
        <span className="his" onClick={() => TempHisVisible()}>Hisory</span>
        <img src={xia_hui} style={{ width: "30px", cursor: "pointer" }} alt="" onClick={() => TempHisVisible()} />
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
