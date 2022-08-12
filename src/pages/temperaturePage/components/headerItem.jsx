import React, { useEffect, useState, useRef } from "react";
import { useHistory } from "react-router-dom";
import {
  Image,
  Layout,
  Dropdown,
  Col,
  Row,
  Avatar,
  Space,
  Card,
  Menu,
  Progress,
} from "antd";
import { DownOutlined } from "@ant-design/icons";
import Charlie from "./../../../assets/img/Charlie.png";
import BluetoothNotConnected from "./../../../assets/img/BluetoothNotConnected.png";
import AxillaryBluetooth from "./../../../assets/img/AxillaryBluetooth.png"; //腋温图片
import RectalBluetoothIcon from "./../../../assets/img/RectalBluetoothIcon.png"; //肛温图片
import EarBluetoothIcon from "./../../../assets/img/EarBluetoothIcon.png"; //耳温图片

import connectBle from "./../../../assets/img/connectBle.png";
import redcat from "./../../../assets/images/redcat.png";
import reddog from "./../../../assets/images/reddog.png";
import redother from "./../../../assets/images/redother.png";
import { connect } from "react-redux";
import { devicesTitleHeight } from "../../../utils/InitDate";
import {
  selectHardwareModalShowFun,
  petSortTypeFun,
  petDetailInfoFun,
  setMellaConnectStatusFun,
  setMellaMeasureValueFun,
  setMellaPredictValueFun,
  setMellaMeasurePartFun,
  setMellaPredictReturnValueFun,
} from "../../../store/actions";
import moment from "moment";
import { fetchRequest } from "../../../utils/FetchUtil1";
import _ from "lodash";
import "./headerItem.less";
import { px } from "../../../utils/px";

const { Header } = Layout;

const HeaderItem = ({
  petMessage,
  hardwareMessage,
  timeNum = 15,
  setMellaPredictReturnValueFun,
}) => {
  let history = useHistory();
  let {
    petName,
    patientId,
    firstName,
    lastName,
    gender,
    breedName,
    birthday,
    weight,
    url,
    petSpeciesBreedId,
    petId,
    isWalkIn,
  } = petMessage;
  let {
    mellaConnectStatus,
    mellaPredictValue,
    mellaMeasureValue,
    mellaMeasurePart,
    rulerConnectStatus,
    biggieConnectStatus,
    selectHardwareInfo,
    selectHardwareType,
  } = hardwareMessage;
  const [value, setValue] = useState(0);
  const saveCallBack = useRef();
  const callBack = () => {
    let random = null;
    if (timeNum === 15) {
      random = 7;
    } else if (timeNum === 30) {
      random = 3.5;
    } else {
      random = 1.75;
    }
    setValue(value + random);
  };
  //展示宠物照片方法
  const petPicture = (size) => {
    if (_.isEmpty(url)) {
      if (petSpeciesBreedId === 11001 || _.inRange(petSpeciesBreedId, 1, 136)) {
        return <Avatar src={redcat} size={size} />;
      } else if (
        petSpeciesBreedId === 12001 ||
        _.inRange(petSpeciesBreedId, 136, 456)
      ) {
        return <Avatar src={reddog} size={size} />;
      } else if (petSpeciesBreedId === 13001) {
        return <Avatar src={redother} size={size} />;
      } else {
        return <Avatar src={redother} size={size} />;
      }
    } else {
      return <Avatar src={url} size={size} />;
    }
  };
  //展示名字或id方法
  const showNameOrId = () => {
    if (_.isEmpty(petName) && _.isEmpty(patientId)) {
      return "unknown";
    } else if (!_.isEmpty(petName)) {
      return petName;
    } else {
      return patientId;
    }
  };
  //展示主人名字方法
  const ownerName = () => {
    if (_.isEmpty(firstName) && _.isEmpty(lastName)) {
      return "unknown";
    } else {
      return firstName + " " + lastName;
    }
  };
  //计算宠物年龄
  const calculateAge = () => {
    if (_.isEmpty(birthday)) {
      return "unknown";
    } else {
      return moment().diff(moment(birthday), "years") + " " + "Years Old";
    }
  };
  //计算宠物体重
  const calculateWeight = () => {
    if (_.isEmpty(weight)) {
      return "unknown";
    } else {
      return _.floor(weight * 2.2, 1) + " " + "lbs";
    }
  };
  //头部弹出卡片
  const cardItem = () => {
    return (
      <Menu onClick={(item) => clilkMenu(item)} className="popBox">
        <Menu.Item className="topItem">
          <div className="cardTopBox">
            <div className="topLeftBox">
              {petPicture(91)}
              <p className="cardTitle">{showNameOrId()}</p>
              <p className="cardTitle">{ownerName()}</p>
            </div>
            <div className="topRightBox">
              <p className="cardTitle">{calculateAge()}</p>
              <p className="cardTitle">{calculateWeight()}</p>
              <p className="cardTitle">{gender === 0 ? "Male" : "Venter"}</p>
              <p className="cardTitle">{breedName}</p>
            </div>
          </div>
        </Menu.Item>
          <Menu.Item key={"editPetInfo"} style={{ paddingLeft: '8px' }}>
            <p className="itemList">Edit Pet Profile</p>
          </Menu.Item>
          <Menu.Item style={{ paddingLeft: '8px' }}>
            <p className="itemList">Export Temperature History</p>
          </Menu.Item>
          <Menu.Item style={{ paddingLeft: '8px' }}>
            <p className="itemList">Export All Vitals History</p>
          </Menu.Item>
      </Menu>
    );
  };
  const clilkMenu = (item) => {
    console.log("---item", item);
    if (item.key === "editPetInfo" && !petMessage.isWalkIn) {
      //跳转到编辑宠物信息页面
      history.push("/page9");
    }
  };
  //超过15s后调用接口
  const prediction = () => {
    let parame = {
      ambient_temperature: 17,
      data: mellaPredictValue,
      deviceId: "11111",
      sampling_rate: "135ms",
    };
    let url = "/clinical/catv12Predict";
    console.log("-----调用接口入参", parame);
    fetchRequest(url, "POST", parame)
      .then((res) => {
        console.log("res", res);
        let ipcRenderer = window.electron.ipcRenderer;
        if (res.message === "Success") {
          let prediction = res.result.prediction.toFixed(2);
          console.log("------yuce", prediction);

          let num = parseFloat(parseFloat(prediction).toFixed(1));
          setMellaPredictReturnValueFun(num);

          let tempArr = prediction.split(".");
          let intNum = tempArr[0];
          let flotNum = tempArr[1];
          if (intNum.length < 2) {
            intNum = "0" + intNum;
          }
          if (flotNum.length < 2) {
            flotNum = "0" + flotNum;
          }
          const timeID = setTimeout(() => {
            ipcRenderer.send("usbdata", {
              command: "42",
              arr: [intNum, flotNum],
            });

            timeID && clearTimeout(timeID);
          }, 10);
        } else {
          const timeID = setTimeout(() => {
            // this.sendData('41', [])
            ipcRenderer.send("usbdata", { command: "41", arr: [] });

            clearTimeout(timeID);
          }, 10);
        }
      })
      .catch((err) => {
        console.log("err", err);
      });
  };
  //判断仪器是否连接从而判断选择什么图片
  const isConnect = () => {
    const checkImage = () => {
      if (mellaMeasurePart === "腋温") {
        return AxillaryBluetooth;
      } else if (mellaMeasurePart === "耳温") {
        return EarBluetoothIcon;
      } else {
        return RectalBluetoothIcon;
      }
    };
    switch (selectHardwareType) {
      case "mellaPro":
        return _.isEqual(mellaConnectStatus, "disconnected") ? (
          <Avatar size={40} src={BluetoothNotConnected} />
        ) : (
          <Progress
            width={48}
            type="circle"
            percent={value}
            format={() => <Avatar size={40} src={checkImage()} />}
          />
        );
      case "biggie":
        return _.isEqual(biggieConnectStatus, "disconnected") ? (
          <Avatar size={40} src={BluetoothNotConnected} />
        ) : (
          <Avatar size={40} src={connectBle} />
        );
      case "tape":
        return _.isEqual(rulerConnectStatus, "disconnected") ? (
          <Avatar size={40} src={BluetoothNotConnected} />
        ) : (
          <Avatar size={40} src={connectBle} />
        );
      default:
        break;
    }
  };

  useEffect(() => {
    saveCallBack.current = callBack;
    if (value === 105 && timeNum !== 60) {
      prediction();
    } else if (value === 105 && timeNum === 60) {
      let ipcRenderer = window.electron.ipcRenderer;
      const timeID = setTimeout(() => {
        ipcRenderer.send("usbdata", { command: "41", arr: [] });
        clearTimeout(timeID);
      }, 10);
    }
    return () => { };
  }, [value]);

  useEffect(() => {
    const tick = () => {
      saveCallBack.current();
    };
    let timer = null;
    if (mellaConnectStatus === "isMeasuring") {
      setValue(0);
      timer = setInterval(tick, 1000);
    } else if (value > 100 || mellaConnectStatus === "complete") {
      clearInterval(timer);
    } else if (mellaConnectStatus === "disconnected") {
      setValue(0);
    };
    if (mellaConnectStatus === "complete") {
      // let ipcRenderer = window.electron.ipcRenderer;
      // ipcRenderer.send("keyboardWriting", mellaMeasureValue);
    }
    return () => {
      clearInterval(timer);
    };
  }, [mellaConnectStatus]);

  return (
    <div className="headerBox">
      <Header style={{ background: "#fff", height: '100%' }}>
        {_.isEmpty(petId) && !isWalkIn ? (
          <></>
        ) : (
          <Row className="heardRow" >
            {/*头部左侧 */}
            <Col flex={10}>
              {isWalkIn ? (
                <span className="walkInTitle">Walk-In</span>
              ) : (
                <Dropdown overlay={cardItem} trigger={["click"]}>
                  <div
                    className="petMessageBox"
                    onClick={(e) => e.preventDefault()}
                  >
                    {petPicture(40)}
                    <div className="petMessageBox">
                      <p className="petName">
                        {!_.isEmpty(petMessage.patientId)
                          ? petMessage.patientId
                          : "unknown"}
                        ,{" "}
                        {!_.isEmpty(petMessage.petName)
                          ? petMessage.petName
                          : "unknown"}
                      </p>
                      <DownOutlined
                        style={{ fontSize: "22px", marginLeft: "10px" }}
                      />
                    </div>
                  </div>
                </Dropdown>
              )}
            </Col>
            {/*头部右侧 */}
            <Col flex={1}>
              <div className="linkStateImageBox">{isConnect()}</div>
            </Col>
          </Row>
        )}
      </Header>
    </div>
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
    setMellaPredictReturnValueFun,
  }
)(HeaderItem);
