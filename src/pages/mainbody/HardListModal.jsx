import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { px } from "../../utils/px";
import {
  selectHardwareInfoFun,
  selectHardwareModalShowFun,
  setMenuNum,
} from "./../../store/actions";
import electronStore from "../../utils/electronStore";

import deviceBiggie from "./../../assets/img/deviceIcon-biggie.png";
import nextImg from "./../../assets/img/nextImg.png";
import dui from "./../../assets/img/dui.png";
import deviceMella from "./../../assets/img/deviceIcon-mella.png";
import deviceRfid from "./../../assets/img/deviceIcon-rfid.png";
import deviceMaeBowl from "./../../assets/img/deviceIcon-maeBowl.png";
import deviceTape from "./../../assets/img/deviceIcon-tape.png";
import deivceAdd from "./../../assets/img/hardList-add.png";
import scales from "./../../assets/img/scales.png";
import "./mainbody.less";
import { compareObject } from "../../utils/current";

let storage = window.localStorage;
const HardAndPetsUI = ({
  hardwareList,
  selectHardwareType,
  selectHardwareInfoFun,
  selectHardwareModalShowFun,
  setInfo,
  setMenuNum,
  hardwareMessage,
}) => {
  let { selectHardwareInfo } = hardwareMessage;
  //定义数组hardwareList
  const [hardwareListArr, setHardwareList] = useState([]);
  //定义选择的硬件详细信息
  const [selectHardwareDetail, setSelectHardwareDetail] = useState({});

  let options = hardwareListArr.map((item, index) => {
    let { name, mac, deviceType } = item;
    let deviceTypeStr = "",
      img = null;
    switch (deviceType) {
      case "biggie":
        deviceTypeStr = "Biggie Pro Scale";
        img = <img src={deviceBiggie} alt="" width={px(75)} />;
        break;
      case "rfid":
        deviceTypeStr = "RFID";
        img = <img src={deviceRfid} alt="" width={px(40)} />;
        break;
      case "tape":
        deviceTypeStr = "Tabby";
        img = <img src={deviceTape} alt="" width={px(50)} />;
        break;
      case "maeBowl":
        deviceTypeStr = "MaeBowl";
        img = <img src={deviceMaeBowl} alt="" width={px(40)} />;

        break;
      case "otterEQ":
        deviceTypeStr = "Otter EQ";

        break;
      case "mellaPro":
        deviceTypeStr = "Mella Pro";
        img = <img src={deviceMella} alt="" width={px(20)} />;
        break;

      default:
        break;
    }
    //判断对象是否相等

    let isEqual = compareObject(item, selectHardwareDetail);
    // console.log("判断两个对象是否相同", isEqual, item, selectHardwareDetail);
    return (
      <li
        key={`${index}`}
        onClick={() => {
          setSelectHardwareDetail(item);
          electronStore.set(
            `${storage.lastOrganization}-${storage.userId}-${deviceType}-selectDeviceInfo`,
            item
          );
          selectHardwareInfoFun(item);
          setInfo && setInfo(item);
        }}
      >
        <div
          className="hardListInfo"
          style={{ paddingTop: px(15), paddingBottom: px(15) }}
        >
          <div className="deviceL">
            <div
              className="hardIcon"
              style={{ marginLeft: px(3), marginRight: px(3), width: px(75) }}
            >
              {img}
            </div>
            <div className="deviceInfo">
              <div className="deviceName">{`Device Name: ${name}`}</div>
              <div className="deviceName">{deviceTypeStr}</div>
              <div className="deviceName">{`SN: ${mac}`}</div>
            </div>
          </div>

          <div className="deviceR" style={{ marginRight: px(20) }}>
            <img src={nextImg} alt="" width={px(13)} />
            {isEqual && (
              <div
                className="seleIcon"
                style={{ width: px(18), height: px(18), top: px(-30) }}
              >
                <img src={dui} alt="" width={px(12)} />
              </div>
            )}
          </div>
        </div>
      </li>
    );
  });
  const otherItems = () => {
    let deviceType = selectHardwareDetail.deviceType;
    let isBiggie = deviceType === "biggie",
      deviceTypeStr = "";
    switch (deviceType) {
      case "biggie":
        deviceTypeStr = "Biggie";
        break;
      case "rfid":
        deviceTypeStr = "RFID";
        break;
      case "tape":
        deviceTypeStr = "Tabby";

        break;
      case "maeBowl":
        deviceTypeStr = "MaeBowl";

        break;
      case "otterEQ":
        deviceTypeStr = "Otter EQ";
        break;
      case "mellaPro":
        deviceTypeStr = "Mella";
        break;
      default:
        break;
    }
    // console.log("selectHardwareDetail", selectHardwareDetail);
    return (
      <div>
        {isBiggie && (
          <div
            className="addNewDevice"
            style={{ paddingTop: px(10), paddingBottom: px(10) }}
            onClick={() => setMenuNum("CombineScales")}
          >
            <div
              className="addNewDeviceText"
              style={{ paddingLeft: px(25) }}
            >{`Combine Scales`}</div>
            <div className="addNewDeviceImg">
              <img
                src={scales}
                alt=""
                width={px(30)}
                style={{ marginRight: px(20) }}
              />
            </div>
          </div>
        )}
        <div
          className="addNewDevice"
          style={{ paddingTop: px(10), paddingBottom: px(10) }}
        >
          <div
            className="addNewDeviceText"
            style={{ paddingLeft: px(25) }}
          >{`Add New ${deviceTypeStr}`}</div>
          <div className="addNewDeviceImg">
            <img
              src={deivceAdd}
              alt=""
              width={px(30)}
              style={{ marginRight: px(20) }}
            />
          </div>
        </div>
      </div>
    );
  };

  useEffect(() => {
    //根据设备类型获取到此类型下的所有硬件,并用来展示
    for (let i = 0; i < hardwareList.length; i++) {
      const element = hardwareList[i];
      if (element.type === selectHardwareType) {
        let list = element.devices || [];
        setHardwareList(list);
        //获取被选中的硬件的详细信息
        let selectHardwareInfoData = selectHardwareInfo || {};
        if (selectHardwareInfoData === {}) {
          let selectHardwareInfoData = list[0] || {};
          setSelectHardwareDetail(selectHardwareInfoData);
        } else {
          let sameFlag = false;
          for (let i = 0; i < list.length; i++) {
            const element = list[i];
            if (
              element.name === selectHardwareInfoData.name &&
              element.mac === selectHardwareInfoData.mac
            ) {
              setSelectHardwareDetail(selectHardwareInfoData);
              sameFlag = true;
              break;
            }
          }
          console.log("sameFlag", sameFlag);
          if (!sameFlag) {
            console.log("设置了默认值");
            let selectHardwareInfoData = list[0] || {};
            setSelectHardwareDetail(selectHardwareInfoData);
          }
        }
        break;
      }
    }
  }, [selectHardwareType]);

  return (
    <div
      className="hardList"
      style={{ top: px(90), zIndex: 999 }}
      onClick={(e) => {
        e.stopPropagation();
        selectHardwareModalShowFun(false);
      }}
    >
      <ul>{options}</ul>
      {otherItems()}
    </div>
  );
};

HardAndPetsUI.propTypes = {
  setInfo: PropTypes.func,
};
//默认值
HardAndPetsUI.defaultProps = {
  setInfo: () => {},
};
export default connect(
  (state) => ({
    selectHardwareType: state.hardwareReduce.selectHardwareType,
    hardwareList: state.hardwareReduce.hardwareList,
    userMessage: state.userReduce,
    hardwareMessage: state.hardwareReduce,
  }),
  { selectHardwareInfoFun, selectHardwareModalShowFun, setMenuNum }
)(HardAndPetsUI);
