import React, { useEffect, useState } from "react";
import {
  Layout,
  Radio,
  Input,
  Space,
  Button,
  message,
  Modal,
} from "antd";
import { LeftOutlined, RightOutlined } from '@ant-design/icons';


import dogHead from "./../../../assets/img/dogHead.png";
import dogNeck from "./../../../assets/img/dogNeck.png";
import dogUpper from "./../../../assets/img/dogUpper.png";
import dogLower from "./../../../assets/img/dogLower.png";
import dogTorso from "./../../../assets/img/dogTorso.png";
import dogBody from "./../../../assets/img/dogBody.png";
import dogHindlimb from "./../../../assets/img/dogHindlimb.png";
import dogForelimbLength from "./../../../assets/img/dogForelimbLength.png";
import dogForelimbCircumference from "./../../../assets/img/dogForelimbCircumference.png";

import dogHead_D from "./../../../assets/img/dogHead_D.png";
import dogNeck_D from "./../../../assets/img/dogNeck_D.png";
import dogUpper_D from "./../../../assets/img/dogUpper_D.png";
import dogLower_D from "./../../../assets/img/dogLower_D.png";
import dogTorso_D from "./../../../assets/img/dogTorso_D.png";
import dogBody_D from "./../../../assets/img/dogBody_D.png";
import dogHindlimb_D from "./../../../assets/img/dogHindlimb_D.png";
import dogForelimbLength_D from "./../../../assets/img/dogForelimbLength_D.png";
import dogForelimbCircumference_D from "./../../../assets/img/dogForelimbCircumference_D.png";

import catHead from "./../../../assets/img/catHead.png";
import catNeck from "./../../../assets/img/catNeck.png";
import catUpper from "./../../../assets/img/catUpper.png";
import catLower from "./../../../assets/img/catLower.png";
import catTorso from "./../../../assets/img/catTorso.png";
import catBody from "./../../../assets/img/catBody.png";
import catHindlimb from "./../../../assets/img/catHindlimb.png";
import catForelimbLength from "./../../../assets/img/catForelimbLength.png";
import catForelimbCircumference from "./../../../assets/img/catForelimbCircumference.png";

import catHead_D from "./../../../assets/img/catHead_D.png";
import catNeck_D from "./../../../assets/img/catNeck_D.png";
import catUpper_D from "./../../../assets/img/catUpper_D.png";
import catLower_D from "./../../../assets/img/catLower_D.png";
import catTorso_D from "./../../../assets/img/catTorso_D.png";
import catBody_D from "./../../../assets/img/catBody_D.png";
import catHindlimb_D from "./../../../assets/img/catHindlimb_D.png";
import catForelimbLength_D from "./../../../assets/img/catForelimbLength_D.png";
import catForelimbCircumference_D from "./../../../assets/img/catForelimbCircumference_D.png";

import amplification from './../../../assets/img/amplification.png';
import shrink from './../../../assets/img/shrink.png';

import { useHistory } from "react-router-dom";
import { connect } from "react-redux";
import {
  selectHardwareModalShowFun,
  petSortTypeFun,
  petDetailInfoFun,
  setRulerConnectStatusFun,
  setRulerMeasureValueFun,
  setRulerUnitFun,
  setRulerConfirmCountFun,
  setSelectHardwareType
} from "../../../store/actions";

import { KgtoLb } from '../../../utils/commonFun';
import { px } from "../../../utils/px";
import NumericInput from "./numericInput";
import {
  getRecentPetData
} from "./../../../api";

import _ from "lodash";
import moment from "moment/moment";

import "./scanPet.less";

const { Content } = Layout;
const ScanPet = ({
  petMessage,
  ruleMessage,
  setRulerUnitFun,
  type,
  setMeasureData,
  setSelectHardwareType,
}) => {
  let history = useHistory();
  let { petSpeciesBreedId, petId, weight } = petMessage;
  let { rulerMeasureValue, rulerConfirmCount, rulerUnit, rulerConnectStatus, selectHardwareInfo, receiveBroadcastHardwareInfo, biggieUnit } = ruleMessage;
  const [radioValue, setRadioValue] = useState("in");//单位
  const [inputIndex, setInputIndex] = useState(-1);//输入框下标
  const [missInputIndex, setMissInputIndex] = useState(0);//输入框下标
  const [carouselIndex, setCarouselIndex] = useState(1);//小小圆点下标

  const [headValue, setHeadValue] = useState(""); //接收输入框的值
  const [neckValue, setNeckValue] = useState(""); //接收输入框的值
  const [upperValue, setUpperValue] = useState(""); //接收输入框的值
  const [lowerValue, setLowerValue] = useState(""); //接收输入框的值
  const [torsoValue, setTorsoValue] = useState(""); //接收输入框的值
  const [bodyValue, setBodyValue] = useState(""); //接收输入框的值
  const [hindlimbValue, setHindlimbValue] = useState(""); //接收输入框的值
  const [forelimbLengthValue, setForelimbLengthValue] = useState(""); //接收输入框的值
  const [forelimbCircumferenceValue, setForelimbCircumferenceValue] = useState(""); //接收输入框的值

  const [missHeadValue, setMissHeadValue] = useState(""); //接收输入框的值
  const [missNeckValue, setMissNeckValue] = useState(""); //接收输入框的值
  const [missUpperValue, setMissUpperValue] = useState(""); //接收输入框的值
  const [missLowerValue, setMissLowerValue] = useState(""); //接收输入框的值
  const [missTorsoValue, setMissTorsoValue] = useState(""); //接收输入框的值
  const [missBodyValue, setMissBodyValue] = useState(""); //接收输入框的值
  const [missHindlimbValue, setMissHindlimbValue] = useState(""); //接收输入框的值
  const [missForelimbLengthValue, setMissForelimbLengthValue] = useState(""); //接收输入框的值
  const [missForelimbCircumferenceValue, setMissForelimbCircumferenceValue] = useState(""); //接收输入框的值

  const [lookType, setLookType] = useState(false);//用户查看局部放大图片
  const [weightTipVisible, setWeightTipVisible] = useState(false);//体重是否为空的弹窗
  const [missMeasureVisible, setMissMeasureVisible] = useState(false);//是否有遗漏测量的弹窗
  const [lastWeightValue, setLastWeightValue] = useState('')//最近一次的体重值
  const [lastWeightTimeValue, setLastWeightTimeValue] = useState('')//最近一次的体重测量时间

  let newData = [];
  let missNewData = [];

  //保存input组，为了选中
  const inputEl = (data) => {
    newData.push(data);
  };
  //保存遗漏的input组，为了选中
  const missInputEl = (data) => {
    missNewData.push(data);
  }
  //切换聚焦事件
  const switchFocus = () => {
    let num = inputIndex;
    if (num === 3) {
      setCarouselIndex(2);
    }
    if (num === 7) {
      setCarouselIndex(3);
    }
    if (num < 8) {
      setInputIndex(num + 1);
    }
  };
  //切换到计算界面，判断测量结果是否有遗漏
  const finishScan = () => {
    if (headValue && neckValue && upperValue && lowerValue && torsoValue && bodyValue && hindlimbValue && forelimbLengthValue && forelimbCircumferenceValue) {
      type(true);
      setMeasureData({
        headValue: headValue,
        neckValue: neckValue,
        upperValue: upperValue,
        lowerValue: lowerValue,
        torsoValue: torsoValue,
        bodyValue: bodyValue,
        hindlimbValue: hindlimbValue,
        forelimbLengthValue: forelimbLengthValue,
        forelimbCircumferenceValue: forelimbCircumferenceValue,
      });
    } else {
      setMissHeadValue(headValue);
      setMissNeckValue(neckValue);
      setMissUpperValue(upperValue);
      setMissLowerValue(lowerValue);
      setMissTorsoValue(torsoValue);
      setMissBodyValue(bodyValue);
      setMissHindlimbValue(hindlimbValue);
      setMissForelimbLengthValue(forelimbLengthValue);
      setMissForelimbCircumferenceValue(forelimbCircumferenceValue);
      setMissMeasureVisible(true);
    }
  };
  //判断是猫还是狗还是其他
  const checkPetType = () => {
    //0是猫，1是狗，或者petSpeciesBreedId为空判断图片为狗
    if (petSpeciesBreedId === 11001 || _.inRange(petSpeciesBreedId, 1, 136)) {
      return 0;
    } else if (
      petSpeciesBreedId === 12001 ||
      _.inRange(petSpeciesBreedId, 136, 456)
    ) {
      return 1;
    } else {
      return 1;
    }
  };
  //用户点击放大按钮查看局部详情
  const onLookImage = (type) => {
    setLookType(type);
  }
  //切换整体图片
  const changeImage = () => {
    switch (inputIndex) {
      case 0:
        return checkPetType() === 1 ? (
          <img src={dogHead} width='320px' />
        ) : (
          <img src={catHead} width='320px' />
        );
      case 1:
        return checkPetType() === 1 ? (
          <img src={dogNeck} width='320px' />
        ) : (
          <img src={catNeck} width='320px' />
        );
      case 2:
        return checkPetType() === 1 ? (
          <img src={dogUpper} width='320px' />
        ) : (
          <img src={catUpper} width='320px' />
        );
      case 3:
        return checkPetType() === 1 ? (
          <img src={dogLower} width='320px' />
        ) : (
          <img src={catLower} width='320px' />
        );
      case 4:
        return checkPetType() === 1 ? (
          <img src={dogTorso} width='320px' />
        ) : (
          <img src={catTorso} width='320px' />
        );
      case 5:
        return checkPetType() === 1 ? (
          <img src={dogBody} width='320px' />
        ) : (
          <img src={catBody} width='320px' />
        );
      case 6:
        return checkPetType() === 1 ? (
          <img src={dogHindlimb} width='320px' />
        ) : (
          <img src={catHindlimb} width='320px' />
        );
      case 7:
        return checkPetType() === 1 ? (
          <img src={dogForelimbLength} width='320px' />
        ) : (
          <img src={catForelimbLength} width='320px' />
        );
      case 8:
        return checkPetType() === 1 ? (
          <img src={dogForelimbCircumference} width='320px' />
        ) : (
          <img src={catForelimbCircumference} width='320px' />
        );
      default:
        return checkPetType() === 1 ? (
          <img src={dogForelimbCircumference} width='320px' />
        ) : (
          <img src={catForelimbCircumference} width='320px' />
        );
    }
  };
  //切换局部放大图片
  const changeLookImage = () => {
    switch (inputIndex) {
      case 0:
        return <div className="localityBox">
          <div className="localityTitleBox">
            <p className="localityTitle">Head<br />Circumference</p>
          </div>
          {
            checkPetType() === 1 ?
              (
                <img src={dogHead_D} className="localityImage" />
              ) :
              (
                <img src={catHead_D} className="localityImage" />
              )
          }
        </div>;
      case 1:
        return <div className="localityBox">
          <div className="localityTitleBox">
            <p className="localityTitle">Neck<br />Circumference</p>
          </div>
          {
            checkPetType() === 1 ?
              (
                <img src={dogNeck_D} className="localityImage" />
              ) :
              (
                <img src={catNeck_D} className="localityImage" />
              )
          }
        </div>;
      case 2:
        return <div className="localityBox">
          <div className="localityTitleBox">
            <p className="localityTitle">Upper Torso<br />Circumference</p>
          </div>
          {
            checkPetType() === 1 ?
              (
                <img src={dogUpper_D} className="localityImage" />
              ) :
              (
                <img src={catUpper_D} className="localityImage" />
              )
          }
        </div>;
      case 3:
        return <div className="localityBox">
          <div className="localityTitleBox">
            <p className="localityTitle">Lower Torso<br />Circumference</p>
          </div>
          {
            checkPetType() === 1 ?
              (
                <img src={dogLower_D} className="localityImage" />
              ) :
              (
                <img src={catLower_D} className="localityImage" />
              )
          }
        </div>;
      case 4:
        return <div className="localityBox">
          <div className="localityTitleBox">
            <p className="localityTitle">Full Torso<br />Length</p>
          </div>
          {
            checkPetType() === 1 ?
              (
                <img src={dogTorso_D} className="localityImage" />
              ) :
              (
                <img src={catTorso_D} className="localityImage" />
              )
          }
        </div>;
      case 5:
        return <div className="localityBox">
          <div className="localityTitleBox">
            <p className="localityTitle">Full Body<br />Length</p>
          </div>
          {
            checkPetType() === 1 ?
              (
                <img src={dogBody_D} className="localityImage" />
              ) :
              (
                <img src={catBody_D} className="localityImage" />
              )
          }
        </div>;
      case 6:
        return <div className="localityBox">
          <div className="localityTitleBox">
            <p className="localityTitle">Hindlimb<br />Length</p>
          </div>
          {
            checkPetType() === 1 ?
              (
                <img src={dogHindlimb_D} className="localityImage" />
              ) :
              (
                <img src={catHindlimb_D} className="localityImage" />
              )
          }
        </div>;
      case 7:
        return <div className="localityBox">
          <div className="localityTitleBox">
            <p className="localityTitle">Forelimb<br />Length</p>
          </div>
          {
            checkPetType() === 1 ?
              (
                <img src={dogForelimbLength_D} className="localityImage" />
              ) :
              (
                <img src={catForelimbLength_D} className="localityImage" />
              )
          }
        </div>;
      case 8:
        return <div className="localityBox">
          <div className="localityTitleBox">
            <p className="localityTitle">Forelimb<br />Circumference</p>
          </div>
          {
            checkPetType() === 1 ?
              (
                <img src={dogForelimbCircumference_D} className="localityImage" />
              ) :
              (
                <img src={catForelimbCircumference_D} className="localityImage" />
              )
          }
        </div>;
      default:
        return;
    }
  }
  //点击输入框事件
  const clickInput = (index) => {
    setInputIndex(index);
  };
  //点击遗漏输入框事件
  const missClickInput = (index) => {
    setMissInputIndex(index);
  }
  //单位转化
  const changeUnit = (value) => {
    if (rulerUnit === "cm") {
      return _.round(value * 2.54, 1);
    } else if (rulerUnit === "in") {
      return _.floor(_.divide(value, 2.54), 2);
    }
  };
  //单选框改变事件
  const changeRadio = (e) => {
    setRadioValue(e.target.value);
    setRulerUnitFun(e.target.value);
  };
  //左箭头点击事件
  const letfClick = () => {
    if (_.inRange(inputIndex, 4, 8)) {
      setCarouselIndex(1);
    } else if (inputIndex === 8) {
      setCarouselIndex(2);
    }

  }
  //右箭头点击事件
  const rightClick = () => {
    if (_.inRange(inputIndex, 0, 4)) {
      setCarouselIndex(2);
    } else if (_.inRange(inputIndex, 4, 8)) {
      setCarouselIndex(3);
    }
  }
  //切换宠物获取到长度信息,对数据根据界面单位进行换算
  const petLengthDataConvert = (val) => {
    if (!val) {
      return "";
    } else {
      if (rulerUnit === "cm") {
        return val.toFixed(1);
      } else {
        return _.floor(_.divide(val, 2.54), 2);
      }
    }
  };
  const onValue = () => {
    switch (inputIndex) {
      case 0:
        return headValue;
      case 1:
        return neckValue;
      case 2:
        return upperValue;
      case 3:
        return lowerValue;
      case 4:
        return torsoValue;
      case 5:
        return bodyValue;
      case 6:
        return hindlimbValue;
      case 7:
        return forelimbLengthValue;
      case 8:
        return forelimbCircumferenceValue;
      default:
        return headValue;
    }
  }
  const onOnChange = () => {
    switch (inputIndex) {
      case 0:
        return setHeadValue;
      case 1:
        return setNeckValue;
      case 2:
        return setUpperValue;
      case 3:
        return setLowerValue;
      case 4:
        return setTorsoValue;
      case 5:
        return setBodyValue;
      case 6:
        return setHindlimbValue;
      case 7:
        return setForelimbLengthValue;
      case 8:
        return setForelimbCircumferenceValue;
      default:
        return setHeadValue;
    }
  }
  //上一次历史数据展示
  const historyData = () => {
    switch (carouselIndex) {
      case 1:
        return <Space className="historyData">
          <p>7</p>
          <p>10</p>
          <p>20</p>
          <p>15</p>
        </Space>;
      case 2:
        return <Space className="historyData">
          <p>14</p>
          <p>16</p>
          <p>8</p>
          <p>9</p>
        </Space>;
      case 3:
        return <Space className="historyData">
          <p>8</p>
        </Space>;
      default:
        return <Space className="historyData">
          <p>7</p>
          <p>10</p>
          <p>20</p>
          <p>15</p>
        </Space>;
    }
  }
  //用户忽视体重为空
  const onCancel = () => {
    setWeightTipVisible(false);
  }
  //用户更新宠物体重信息
  const updatePetMessage = () => {
    //跳转到编辑宠物信息页面
    history.push("/page9");
  }
  //用户前往体脂秤界面进行测量体重
  const goToBiggieScale = () => {
    setSelectHardwareType('biggie');
    //跳转到mainBody界面
    history.push("/MainBody");
  }
  //用户完成遗漏的数值填写
  const saveMiss = () => {
    if (missHeadValue && missNeckValue && missUpperValue && missLowerValue && missTorsoValue && missBodyValue && missHindlimbValue && missForelimbLengthValue && missForelimbCircumferenceValue) {
      type(true);
      setMeasureData({
        headValue: headValue || missHeadValue,
        neckValue: neckValue || missNeckValue,
        upperValue: upperValue || missUpperValue,
        lowerValue: lowerValue || missLowerValue,
        torsoValue: torsoValue || missTorsoValue,
        bodyValue: bodyValue || missBodyValue,
        hindlimbValue: hindlimbValue || missHindlimbValue,
        forelimbLengthValue: forelimbLengthValue || missForelimbLengthValue,
        forelimbCircumferenceValue: forelimbCircumferenceValue || missForelimbCircumferenceValue,
      });
    } else {
      message.warning('Please complete the missing values');
    }

  }
  //获取上一次测量的体重
  const getRecentPet = () => {
    getRecentPetData(petId)
      .then((res) => {
        if (res.weight) {
          setLastWeightValue(biggieUnit === 'kg' ? res.weight.weight : KgtoLb(res.weight.weight));
          setLastWeightTimeValue(res.weight.createTime);
        } else if (res.ruler.weight) {
          setLastWeightValue(biggieUnit === 'kg' ? res.ruler.weight : KgtoLb(res.ruler.weight));
          setLastWeightTimeValue(res.ruler.createTime);
        } else {
          setLastWeightValue('');
          setLastWeightTimeValue('');
        }
      })
      .catch((err) => {
        message.error('The latest data cannot be obtained');
      })
  }
  //判断上一次测量的体重是否超过一个月
  const judgeWightTime = () => {
    let newTime = moment();
    let diffTime = newTime.diff(moment(lastWeightTimeValue), 'month');
    if (diffTime >= 1 && lastWeightValue) {
      return (
        <p className="historyWeightWarningTitle">Last date Weighed was {moment(lastWeightTimeValue).format("LL")}.Please
          <a onClick={() => updatePetMessage()}>update the pet's weight</a>.
        </p>
      );
    } else if (diffTime === 0 && lastWeightValue) {
      return <p className="historyWeightTitle">Last Weighed {moment(lastWeightTimeValue).format("LL")}: {lastWeightValue} {biggieUnit === 'kg' ? 'kg' : 'lbs'}</p>
    } else {
      return null
    }
  }

  //监听点击界面中下一步按钮
  useEffect(() => {
    console.log("inputIndex", inputIndex);

    if (inputIndex < 9 && inputIndex !== -1) {
      newData[inputIndex].focus();
    }
    if (inputIndex === 9) {
      finishScan();
    }
    return () => { };
  }, [inputIndex]);
  //监听切换
  useEffect(() => {
    switch (carouselIndex) {
      case 1:
        setInputIndex(0);
        break;
      case 2:
        setInputIndex(4);
        break;
      case 3:
        setInputIndex(8);
        break;
      default:
        setInputIndex(0);
        break;
    }
    return () => { };
  }, [carouselIndex]);
  //监听用户点击了硬件中的下一步按钮
  useEffect(() => {
    if (inputIndex === -1) {
      setInputIndex(0);
    } else if (inputIndex < 9) {
      setInputIndex(inputIndex + 1);
    }
    if (inputIndex === 3) {
      setCarouselIndex(2);
    }
    if (inputIndex === 7) {
      setCarouselIndex(3);
    }
    return () => { };
  }, [rulerConfirmCount]);
  //监听切换了宠物
  useEffect(() => {
    setInputIndex(0);
    setCarouselIndex(1);
    let {
      torsoLength,
      l2rarmDistance,
      upperTorsoCircumference,
      lowerTorsoCircumference,
      h2tLength,
      neckCircumference,
      hindLimbLength,
      foreLimbLength,
      foreLimbCircumference
    } = petMessage;
    setBodyValue(petLengthDataConvert(l2rarmDistance));
    setLowerValue(petLengthDataConvert(lowerTorsoCircumference));
    setUpperValue(petLengthDataConvert(upperTorsoCircumference));
    setNeckValue(petLengthDataConvert(neckCircumference));
    setHeadValue(petLengthDataConvert(h2tLength));
    setTorsoValue(petLengthDataConvert(torsoLength));
    setHindlimbValue(petLengthDataConvert(hindLimbLength));
    setForelimbLengthValue(petLengthDataConvert(foreLimbLength));
    setForelimbCircumferenceValue(petLengthDataConvert(foreLimbCircumference));
    return () => { };
  }, [petId]);
  //监听用户点击了硬件中的下一步按钮和拉动皮尺
  useEffect(() => {
    if (inputIndex < 9) {
      let { deviceType, mac } = selectHardwareInfo
      if (deviceType === 'tape') {
        if (mac === null || (mac && receiveBroadcastHardwareInfo.deviceType === 'tape' && receiveBroadcastHardwareInfo.macId === mac)) {
          switch (inputIndex) {
            case 0:
              setHeadValue(rulerMeasureValue);
              break;
            case 1:
              setNeckValue(rulerMeasureValue);
              break;
            case 2:
              setUpperValue(rulerMeasureValue);
              break;
            case 3:
              setLowerValue(rulerMeasureValue);
              break;
            case 4:
              setTorsoValue(rulerMeasureValue);
              break;
            case 5:
              setBodyValue(rulerMeasureValue);
              break;
            case 6:
              setHindlimbValue(rulerMeasureValue);
              break;
            case 7:
              setForelimbLengthValue(rulerMeasureValue);
              break;
            case 8:
              setForelimbCircumferenceValue(rulerMeasureValue);
              break;
            default:
              break;
          }
          if (rulerUnit !== radioValue) {
            setRadioValue(rulerUnit);
            setHeadValue(headValue && changeUnit(headValue));
            setNeckValue(neckValue && changeUnit(neckValue));
            setUpperValue(upperValue && changeUnit(upperValue));
            setLowerValue(lowerValue && changeUnit(lowerValue));
            setTorsoValue(torsoValue && changeUnit(torsoValue));
            setBodyValue(bodyValue && changeUnit(bodyValue));
            setHindlimbValue(hindlimbValue && changeUnit(hindlimbValue));
            setForelimbLengthValue(forelimbLengthValue && changeUnit(forelimbLengthValue));
            setForelimbCircumferenceValue(forelimbCircumferenceValue && changeUnit(forelimbCircumferenceValue));
          }
        }
      }

    }
  }, [rulerConfirmCount, rulerMeasureValue]);
  //检测宠物体重是否为空
  useEffect(() => {
    if (!weight) {
      setWeightTipVisible(true)
    }
    return () => { };
  }, [petId]);
  //获取上一次测量的体重
  useEffect(() => {
    getRecentPet();
    return (() => { })
  }, [petId]);

  return (
    <>
      <Content className="scanContentBox">
        <div className="historyWeightBox">
          {
            judgeWightTime()
          }
        </div>
        {
          lookType ?
            (
              <>
                <div className="lookImageBox">
                  {changeLookImage()}
                  < img src={shrink} className="checkImage" onClick={() => onLookImage(false)} />
                </div>
                <div className="lookInputBox">
                  <NumericInput
                    value={onValue()}
                    onChange={onOnChange()}
                    onClick={() => clickInput(inputIndex)}
                    index={inputIndex}
                    onKey={inputIndex}
                    ChangeSize={'32px'}
                  />
                </div>
              </>
            ) :
            (
              <div className="scanImageBox">
                {changeImage()}
                < img src={amplification} className="checkImage" onClick={() => onLookImage(true)} />
              </div>
            )
        }
        {/*选择单位框*/}
        <Radio.Group
          value={radioValue}
          onChange={changeRadio}
          buttonStyle="solid"
          className="selectLengthUnit"
        >
          <Radio.Button
            value="in"
            className="inButton"
            style={{
              background: radioValue === "in" ? "#D5B019" : "#FFFFFF",
              borderColor: radioValue === "in" ? "#D5B019" : "#B3B3B3",
              borderRadius: "20px",
              borderTopRightRadius: "0px",
              borderBottomRightRadius: "0px",
            }}
          >
            in
          </Radio.Button>
          <Radio.Button
            value="cm"
            className="cmButton"
            style={{
              background: radioValue === "cm" ? "#D5B019" : "#FFFFFF",
              borderColor: radioValue === "cm" ? "#D5B019" : "#B3B3B3",
              borderRadius: "20px",
              borderTopLeftRadius: "0px",
              borderBottomLeftRadius: "0px",
            }}
          >
            cm
          </Radio.Button>
        </Radio.Group>
        {/**输入框 */}
        <div className="slideshowBox" style={{ height: px(100) }}>
          <div className="leftImageBox" onClick={() => letfClick()}>
            <LeftOutlined style={{ fontSize: '24px', visibility: carouselIndex === 1 ? 'hidden' : 'visible' }} />
          </div>
          <div className="scollInputGroup">
            {/*第一列输入框*/}
            <Input.Group
              className="inputGroupItem"
              style={{ display: carouselIndex === 1 ? "" : "none" }}
            >
              <Space className="inputItemBox">
                <div className="inputItem">
                  <p className="inputTitle">Head Circumference</p>
                  <NumericInput
                    value={headValue}
                    onChange={setHeadValue}
                    getinput={inputEl}
                    onClick={() => clickInput(0)}
                    index={inputIndex}
                    onKey={0}
                  />
                </div>
                <div className="inputItem">
                  <p className="inputTitle">Neck Circumference</p>
                  <NumericInput
                    value={neckValue}
                    onChange={setNeckValue}
                    getinput={inputEl}
                    onClick={() => clickInput(1)}
                    index={inputIndex}
                    onKey={1}
                  />
                </div>
                <div className="inputItem">
                  <p className="inputTitle">Upper Torso Circumference</p>
                  <NumericInput
                    value={upperValue}
                    onChange={setUpperValue}
                    getinput={inputEl}
                    onClick={() => clickInput(2)}
                    index={inputIndex}
                    onKey={2}
                  />
                </div>
                <div className="inputItem">
                  <p className="inputTitle">Lower Torso Circumference</p>
                  <NumericInput
                    value={lowerValue}
                    onChange={setLowerValue}
                    getinput={inputEl}
                    onClick={() => clickInput(3)}
                    index={inputIndex}
                    onKey={3}
                  />
                </div>
              </Space>
            </Input.Group>
            {/*第二列输入框*/}
            <Input.Group
              className="inputGroupItem"
              style={{ display: carouselIndex === 2 ? "" : "none" }}
            >
              <Space className="inputItemBox">
                <div className="inputItem">
                  <p className="inputTitle">Full Torso Length</p>
                  <NumericInput
                    value={torsoValue}
                    onChange={setTorsoValue}
                    getinput={inputEl}
                    onClick={() => clickInput(4)}
                    index={inputIndex}
                    onKey={4}
                  />
                </div>
                <div className="inputItem">
                  <p className="inputTitle">Full Body Length</p>
                  <NumericInput
                    value={bodyValue}
                    onChange={setBodyValue}
                    getinput={inputEl}
                    onClick={() => clickInput(5)}
                    index={inputIndex}
                    onKey={5}
                  />
                </div>
                <div className="inputItem">
                  <p className="inputTitle">Hindlimb Length</p>
                  <NumericInput
                    value={hindlimbValue}
                    onChange={setHindlimbValue}
                    getinput={inputEl}
                    onClick={() => clickInput(6)}
                    index={inputIndex}
                    onKey={6}
                  />
                </div>
                <div className="inputItem">
                  <p className="inputTitle">Forelimb Length</p>
                  <NumericInput
                    value={forelimbLengthValue}
                    onChange={setForelimbLengthValue}
                    getinput={inputEl}
                    onClick={() => clickInput(7)}
                    index={inputIndex}
                    onKey={7}
                  />
                </div>
              </Space>
            </Input.Group>
            {/*第三列输入框*/}
            <Input.Group
              className="inputGroupItem"
              style={{ display: carouselIndex === 3 ? "" : "none" }}
            >
              <Space className="inputItemBox">
                <div className="inputItem">
                  <p className="inputTitle">Forelimb Circumference</p>
                  <NumericInput
                    value={forelimbCircumferenceValue}
                    onChange={setForelimbCircumferenceValue}
                    getinput={inputEl}
                    onClick={() => clickInput(8)}
                    index={inputIndex}
                    onKey={8}
                  />
                </div>
              </Space>
            </Input.Group>
          </div>
          <div className="rightImageBox" onClick={() => rightClick()}>
            <RightOutlined style={{ fontSize: '24px', visibility: carouselIndex === 3 ? 'hidden' : 'visible' }} />
          </div>
        </div>
        {/*历史测量数据展示*/}
        <div className="historyBox">
          <div className="historyTimeBox">
            <p>Previously Measured on 06-20-22</p>
          </div>
          <div className="historyDataBox">
            {historyData()}
          </div>

        </div>
        {/*下一步 */}
        <div className="nextBtnBox">
          <Button
            type="primary"
            shape="round"
            size="large"
            className="nextBtn"
            onClick={inputIndex > 7 ? finishScan : switchFocus}
          >
            {inputIndex > 7 ? "Calculate" : "Next"}
          </Button>
        </div>
      </Content>
      <Modal
        open={weightTipVisible}
        width={320}
        className='weightTipModal'
        centered
        keyboard={false}
        closable={false}
        footer={null}
      >
        <div className="modalContentBox">
          <p className="title">Weight Required</p>
          <div className="tipTitleBox">
            <p className="tipTitle">
              This pet's weight has not been
            </p>
            <p className="tipTitle">
              entered into their profile. Update
            </p>
            <p className="tipTitle">
              their pet profile with the weight or
            </p>
            <div className="tipTitle">
              use the
              <p onClick={() => goToBiggieScale()}>Biggie Scale</p>
              .
            </div>
          </div>
          <div className="modalBtnBox">
            <Button
              type="primary"
              shape="round"
              size='middle'
              onClick={() => onCancel()}
              className="modalBtn"
            >
              Skip
            </Button>
            <Button
              type="primary"
              shape="round"
              size='middle'
              onClick={() => updatePetMessage()}
              className="modalBtn"
            >
              Update Profile
            </Button>
          </div>
        </div>
      </Modal>
      <Modal
        open={missMeasureVisible}
        width={432}
        className='missMeasureModal'
        centered
        keyboard={false}
        closable={false}
        footer={null}
      >
        <div className="modalContentBox">
          <p className="title">You've missed these measurements</p>
          <p className="title">Enter these missing readings</p>
          <div className="inputBox">
            {
              headValue ? (null) :
                (
                  <div className="inputItem">
                    <p className="inputTitle">Full Torso Length</p>
                    <NumericInput
                      value={missHeadValue}
                      onChange={setMissHeadValue}
                      getinput={missInputEl}
                      onClick={() => missClickInput(0)}
                      index={missInputIndex}
                      onKey={0}
                    />
                  </div>

                )
            }
            {
              neckValue ? (null) :
                (
                  <div className="inputItem">
                    <p className="inputTitle">Neck Circumference</p>
                    <NumericInput
                      value={missNeckValue}
                      onChange={setMissNeckValue}
                      getinput={missInputEl}
                      onClick={() => missClickInput(1)}
                      index={missInputIndex}
                      onKey={1}
                    />
                  </div>

                )
            }
            {
              upperValue ? (null) :
                (
                  <div className="inputItem">
                    <p className="inputTitle">Upper Torso Circumference</p>
                    <NumericInput
                      value={missUpperValue}
                      onChange={setMissUpperValue}
                      getinput={missInputEl}
                      onClick={() => missClickInput(2)}
                      index={missInputIndex}
                      onKey={2}
                    />
                  </div>
                )
            }
            {
              lowerValue ? (null) :
                (
                  <div className="inputItem">
                    <p className="inputTitle">Lower Torso Circumference</p>
                    <NumericInput
                      value={missLowerValue}
                      onChange={setMissLowerValue}
                      getinput={missInputEl}
                      onClick={() => missClickInput(3)}
                      index={missInputIndex}
                      onKey={3}
                    />
                  </div>
                )
            }
            {
              torsoValue ? (null) :
                (
                  <div className="inputItem">
                    <p className="inputTitle">Full Torso Length</p>
                    <NumericInput
                      value={missTorsoValue}
                      onChange={setMissTorsoValue}
                      getinput={missInputEl}
                      onClick={() => missClickInput(4)}
                      index={missInputIndex}
                      onKey={4}
                    />
                  </div>
                )
            }
            {
              bodyValue ? (null) :
                (
                  <div className="inputItem">
                    <p className="inputTitle">Full Body Length</p>
                    <NumericInput
                      value={missBodyValue}
                      onChange={setMissBodyValue}
                      getinput={missInputEl}
                      onClick={() => missClickInput(5)}
                      index={missInputIndex}
                      onKey={5}
                    />
                  </div>
                )
            }
            {
              hindlimbValue ? (null) :
                (
                  <div className="inputItem">
                    <p className="inputTitle">Hindlimb Length</p>
                    <NumericInput
                      value={missHindlimbValue}
                      onChange={setMissHindlimbValue}
                      getinput={missInputEl}
                      onClick={() => missClickInput(6)}
                      index={missInputIndex}
                      onKey={6}
                    />
                  </div>
                )
            }
            {
              forelimbLengthValue ? (null) :
                (
                  <div className="inputItem">
                    <p className="inputTitle">Forelimb Length</p>
                    <NumericInput
                      value={missForelimbLengthValue}
                      onChange={setMissForelimbLengthValue}
                      getinput={missInputEl}
                      onClick={() => missClickInput(7)}
                      index={missInputIndex}
                      onKey={7}
                    />
                  </div>
                )
            }
            {
              forelimbCircumferenceValue ? (null) :
                (
                  <div className="inputItem">
                    <p className="inputTitle">Forelimb Circumference</p>
                    <NumericInput
                      value={missForelimbCircumferenceValue}
                      onChange={setMissForelimbCircumferenceValue}
                      getinput={missInputEl}
                      onClick={() => missClickInput(8)}
                      index={missInputIndex}
                      onKey={8}
                    />
                  </div>
                )
            }

          </div>
          <div className="modalBtnBox">
            <Button
              type="primary"
              shape="round"
              size='middle'
              onClick={() => setMissMeasureVisible(false)}
              className="modalBtn"
            >
              cancel
            </Button>
            <Button
              type="primary"
              shape="round"
              size='middle'
              onClick={() => saveMiss()}
              className="modalBtn"
            >
              Save and Calculate
            </Button>
          </div>
        </div>
      </Modal>
    </>
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
    setSelectHardwareType,
  }
)(ScanPet);
