import React, { useEffect, useState, useRef } from "react";
import { connect } from "react-redux";
import {
  Layout,
  Menu,
  PageHeader,
  Radio,
  Input,
  Space,
  Button,
  Modal,
  message,
  Carousel,
} from "antd";
import { ExclamationCircleOutlined } from "@ant-design/icons";
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
import NumericInput from "./numericInput";
import head from "./../../../assets/img/head.png";
import neck from "./../../../assets/img/neck.png";
import upper from "./../../../assets/img/upper.png";
import lower from "./../../../assets/img/lower.png";
import Full from "./../../../assets/img/Full.png";
import body from "./../../../assets/img/body.png";
import catHead from "./../../../assets/img/catHead.png";
import catNeck from "./../../../assets/img/catNeck.png";
import catUpper from "./../../../assets/img/catUpper.png";
import catLower from "./../../../assets/img/catLower.png";
import catFull from "./../../../assets/img/catFull.png";
import catBody from "./../../../assets/img/catBody.png";
import redjinggao from './../../../assets/img/redjinggao.png'
import "./scanPet.less";
import { px } from "../../../utils/px";
import MyModal from '../../../utils/myModal/MyModal'
import { updatePetInfo1 } from "../../../api";

const { Content, Header } = Layout;
const ScanPet = ({
  petMessage,
  petDetailInfoFun,
  ruleMessage,
  setRulerConfirmCountFun,
  setRulerMeasureValueFun,
  setRulerUnitFun,
  setRulerConnectStatusFun
}) => {
  let { petSpeciesBreedId, patientId, petId } = petMessage;
  let { rulerMeasureValue, rulerConfirmCount, rulerUnit, rulerConnectStatus, selectHardwareInfo, receiveBroadcastHardwareInfo } = ruleMessage;
  let storage = window.localStorage;
  const [radioValue, setRadioValue] = useState("in");
  const [inputIndex, setInputIndex] = useState(-1);
  const [visible, setVisible] = useState(false);
  const [carouselIndex, setCarouselIndex] = useState(1);
  const [headValue, setHeadValue] = useState(""); //接收输入框的值
  const [neckValue, setNeckValue] = useState(""); //接收输入框的值
  const [upperValue, setUpperValue] = useState(""); //接收输入框的值
  const [lowerValue, setLowerValue] = useState(""); //接收输入框的值
  const [torsoValue, setTorsoValue] = useState(""); //接收输入框的值
  const [bodyValue, setBodyValue] = useState(""); //接收输入框的值
  const [showModal, setShowModal] = useState(false);
  const [selectPetDetail, setSelectPetDetail] = useState({})
  let newData = [];


  //保存input组
  const inputEl = (data) => {
    newData.push(data);
  };

  //切换聚焦事件
  const switchFocus = () => {
    let num = inputIndex;
    if (num === 3) {
      setCarouselIndex(2);
    }
    if (num < 5) {
      setInputIndex(num + 1);
    }
  };

  //结束事件
  const finishScan = () => {
    Modal.confirm({
      title: "Confirm",
      icon: <ExclamationCircleOutlined />,
      content: "Whether To Save Data",
      top: "40vh",
      onOk: saveData,
    });
  };
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
      l2rarmDistance: newNum(bodyValue) || null,
      lowerTorsoCircumference: newNum(lowerValue) || null,
      upperTorsoCircumference: newNum(upperValue) || null,
      neckCircumference: newNum(neckValue) || null,
      h2tLength: newNum(headValue) || null,
      torsoLength: newNum(torsoValue) || null,
    };

    updatePetInfo1(storage.userId, petId, prams)

      .then((res) => {
        if (res.flag) {
          petDetailInfoFun({
            ...petMessage,
            ...prams,
          });
          message.success("Uploaded successfully");
        } else {
          message.error("upload failed");
        }
      })
      .catch((err) => {
        message.error("update failed");
        console.log(err);
      });
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

  //切换图片
  const changeImage = () => {
    switch (inputIndex) {
      case 0:
        return checkPetType() === 1 ? (
          <img src={head} />
        ) : (
          <img src={catHead} />
        );
      case 1:
        return checkPetType() === 1 ? (
          <img src={neck} />
        ) : (
          <img src={catNeck} />
        );
      case 2:
        return checkPetType() === 1 ? (
          <img src={upper} />
        ) : (
          <img src={catUpper} />
        );
      case 3:
        return checkPetType() === 1 ? (
          <img src={lower} />
        ) : (
          <img src={catLower} />
        );
      case 4:
        return checkPetType() === 1 ? (
          <img src={Full} />
        ) : (
          <img src={catFull} />
        );
      case 5:
        return checkPetType() === 1 ? (
          <img src={body} />
        ) : (
          <img src={catBody} />
        );
      default:
        return checkPetType() === 1 ? (
          <img src={body} />
        ) : (
          <img src={catBody} />
        );
    }
  };

  //点击输入框事件
  const clickInput = (index) => {
    setInputIndex(index);
  };

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

  //小圆点点击事件
  const clickPoint = (index) => {
    if (index === 1) {
      setCarouselIndex(1);
    } else {
      setCarouselIndex(2);
    }
  };
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



  //监听点击界面中下一步按钮
  useEffect(() => {
    console.log("inputIndex", inputIndex);

    if (inputIndex < 6 && inputIndex !== -1) {
      newData[inputIndex].focus();
    }
    if (inputIndex === 6) {
      finishScan();
    }

    return () => { };
  }, [inputIndex]);

  useEffect(() => {
    if (carouselIndex === 2) {
      setInputIndex(4);
    } else if (carouselIndex === 1) {
      setInputIndex(0);
    }
    return () => { };
  }, [carouselIndex]);

  //监听用户点击了硬件中的下一步按钮
  useEffect(() => {
    if (inputIndex === -1) {
      setInputIndex(0);
    } else if (inputIndex < 6) {
      setInputIndex(inputIndex + 1);
    }
    if (inputIndex === 3) {
      setCarouselIndex(2);
    }
    return () => { };
  }, [rulerConfirmCount]);

  // useEffect(() => {
  //   setRulerConnectStatusFun('disconnected')
  // },[])


  //监听切换了宠物
  useEffect(() => {
    // if (rulerConnectStatus === 'isMeasuring') {
    //   setShowModal(true);
    // } else {
    setInputIndex(0);
    setCarouselIndex(1);
    let {
      torsoLength,
      l2rarmDistance,
      upperTorsoCircumference,
      lowerTorsoCircumference,
      h2tLength,
      neckCircumference,
    } = petMessage;

    setBodyValue(petLengthDataConvert(l2rarmDistance));
    setLowerValue(petLengthDataConvert(lowerTorsoCircumference));
    setUpperValue(petLengthDataConvert(upperTorsoCircumference));
    setNeckValue(petLengthDataConvert(neckCircumference));
    setHeadValue(petLengthDataConvert(h2tLength));
    setTorsoValue(petLengthDataConvert(torsoLength));
    // }
    return () => { };
  }, [petId]);
  //监听用户点击了硬件中的下一步按钮和拉动皮尺
  useEffect(() => {
    if (inputIndex < 6) {
      let { deviceType, mac } = selectHardwareInfo
      console.log(selectHardwareInfo);
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
          }
        }
      }

    }
  }, [rulerConfirmCount, rulerMeasureValue]);
  // //监听单位改变
  // useEffect(() => {
  //   let { deviceType, mac } = selectHardwareInfo

  //   console.log('=====', receiveBroadcastHardwareInfo.macId);
  //   if (deviceType === 'tape') {
  //     if (mac === '45264' || (mac && receiveBroadcastHardwareInfo.deviceType === 'tape' && receiveBroadcastHardwareInfo.macId === mac)) {
  //       console.log('初始化====', rulerUnit, radioValue);

  //       setRadioValue(rulerUnit);
  //       setHeadValue(headValue && changeUnit(headValue));
  //       setNeckValue(neckValue && changeUnit(neckValue));
  //       setUpperValue(upperValue && changeUnit(upperValue));
  //       setLowerValue(lowerValue && changeUnit(lowerValue));
  //       setTorsoValue(torsoValue && changeUnit(torsoValue));
  //       setBodyValue(bodyValue && changeUnit(bodyValue));

  //     }
  //   }

  // }, [rulerUnit]);


  return (
    <>
      <Content className="scanContentBox">
        <div className="scanImageBox">{changeImage()}</div>
        {/*选择单位框*/}
        <Radio.Group
          value={radioValue}
          onChange={changeRadio}
          buttonStyle="solid"
          className="selectLengthUnit"
        >
          <Radio.Button
            value="in"
            style={{
              background: radioValue === "in" ? "#e1206d" : "#fff",
              borderColorRight: radioValue === "in" ? "#e1206d" : "#fff",
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
              background: radioValue === "cm" ? "#e1206d" : "#fff",
              borderColorRight: radioValue === "cm" ? "#e1206d" : "#fff",
              borderRadius: "20px",
              borderTopLeftRadius: "0px",
              borderBottomLeftRadius: "0px",
            }}
          >
            cm
          </Radio.Button>
        </Radio.Group>
        <div className="slideshowBox" style={{ height: px(100) }}>
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
                    getInput={inputEl}
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
                    getInput={inputEl}
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
                    getInput={inputEl}
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
                    getInput={inputEl}
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
                    getInput={inputEl}
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
                    getInput={inputEl}
                    onClick={() => clickInput(5)}
                    index={inputIndex}
                    onKey={5}
                  />
                </div>
              </Space>
            </Input.Group>
          </div>
        </div>

        {/*小圆点 */}
        <div className="dotBox">
          <ul className="dotList">
            <li>
              <Button
                className="dotItem"
                onClick={() => clickPoint(1)}
                style={{
                  background: carouselIndex === 1 ? "#0a0a0a" : "#bdbaba",
                }}
              >
                1
              </Button>
            </li>
            <li>
              <Button
                className="dotItem"
                onClick={() => clickPoint(2)}
                style={{
                  background: carouselIndex === 2 ? "#0a0a0a" : "#bdbaba",
                }}
              >
                2
              </Button>
            </li>
          </ul>
        </div>
        {/*下一步 */}
        <div className="nextBtnBox">
          <Button
            type="primary"
            shape="round"
            size="large"
            className="nextBtn"
            onClick={inputIndex > 4 ? finishScan : switchFocus}
          >
            {inputIndex > 4 ? "Finish" : "Next"}
          </Button>
        </div>
      </Content>
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
  }
)(ScanPet);
