import React, { useEffect, useState } from "react";
import { message } from 'antd'

import mellaPro from "./../../assets/img/hardList-mella.png";
import moveMellaPro from "./../../assets/img/moveMellaPro.png";
import biggie from "./../../assets/img/hardList-biggie.png";
import moveBiggie from "./../../assets/img/moveBiggie.png";
import tape from "./../../assets/img/hardList-tape.png";
import moveTape from "./../../assets/img/moveTape.png";
import otterEQ from "./../../assets/img/hardList-otterEQ.png";
import moveOtterEQ from "./../../assets/img/moveOtterEQ.png";
import mabel from "./../../assets/img/hardList-mabel.png";
import moveMabel from "./../../assets/img/moveMabel.png";

import rfid from "./../../assets/img/hardList-rfid.png";
import smalls from './../../assets/img/smalls.png'
import cameraIcon from './../../assets/img/cameraIcon.png'
import add from "./../../assets/img/hardList-add.png";

import electronStore from "../../utils/electronStore";
import { px } from "../../utils/px";

import PropTypes from "prop-types";
import { connect } from "react-redux";
import {
  selectHardwareInfoFun,
  setSelectHardwareType,
  setMenuNum,
} from "./../../store/actions";
import { useHover } from 'ahooks';

let storage = window.localStorage;
//devicesTypeList是index传过来的硬件种类以及种类下的所有硬件
const HardWareTypeUI = ({
  bodyHeight,
  devicesTypeList,
  selectHardwareInfoFun,
  setSelectHardwareType,
  selectHardwareType,
  setMenuNum,
  menuNum,
}) => {
  //根据左侧列表的设备类型，获取当前选中的设备类型下选中的硬件,先看本地有没有存,没存就拿第一个展示
  const [onMouseEnterIndex, setOnMouseEnterIndex] = useState(-1);//移入硬件图片的下标

  let options = devicesTypeList.map((item, index) => {
    let img = null;
    switch (item.type) {
      case "mellaPro":
        img = onMouseEnterIndex === 0 ? moveMellaPro : mellaPro;
        break;
      case "biggie":
        img = onMouseEnterIndex === 1 ? moveBiggie : biggie;
        break;
      case "tape":
        img = onMouseEnterIndex === 2 ? moveTape : tape;
        break;
      case "otterEQ":
        img = onMouseEnterIndex === 3 ? moveOtterEQ : otterEQ;
        break;
      case "mabel":
        img = onMouseEnterIndex === 4 ? moveMabel : mabel;
        break;
      case "rfid":
        img = rfid;
        break;
      case "camera":
        img = onMouseEnterIndex === 5 ? cameraIcon : smalls
        break
      case "add":
        img = add;
        break;

      default:
        break;
    }
    let borderStyle = ``;
    if (item.type === selectHardwareType && menuNum !== "6" && !electronStore.get(`${storage.userId}-isClical`)) {
      borderStyle = ` 2px solid #3B3A3A`;
    }
    return (
      <li
        key={`${index}`}
        style={{ margin: `${px(10)}px 0` }}
        onClick={() => {
          if (menuNum !== "6" && !electronStore.get(`${storage.userId}-isClical`)) {
            setMenuNum("1");
            setSelectHardwareType(item.type);
            if (item.type === "add") {
            } else {
              let devicesInfo = {
                deviceType: item.type,
                examRoom: null,
                mac: null,
                name: null
              }
              if (item.devices.length > 0) {
                devicesInfo = electronStore.get(
                  `${storage.lastOrganization}-${storage.userId}-${item.type}-selectDeviceInfo`
                ) || {};
                let isSame = item.devices.some((item) => item.mac === devicesInfo.mac)
                if (!isSame) {
                  devicesInfo = item.devices[0];
                  electronStore.set(
                    `${storage.lastOrganization}-${storage.userId}-${item.type}-selectDeviceInfo`,
                    devicesInfo
                  );
                }
              }
              selectHardwareInfoFun(devicesInfo);
            }
          }
          else {
            message.destroy();
            message.warning('Please exit clinical trial mode first');
          }
        }}
        onMouseEnter={() => {
          setOnMouseEnterIndex(index);
        }}
        onMouseLeave={() => {
          setOnMouseEnterIndex(-1);
        }}
      >
        <div
          className="item"
          style={{ border: borderStyle }}
          id={`item${index}`}
        >
          <img src={img} alt="" width={px(55)} />
        </div>
      </li>
    );
  });


  useEffect(() => {
    let Index = null;
    for (let i = 0; i < devicesTypeList.length; i++) {
      const element = devicesTypeList[i];
      if (element.type === selectHardwareType) {
        Index = i;
        break;
      }
    }
    if (Index === null) {
      return;
    }

    let hard = devicesTypeList[Index];
    if (hard && hard.type !== "add") {
      let devicesInfo = electronStore.get(
        `${storage.lastOrganization}-${storage.userId}-${hard.type}-selectDeviceInfo`
      );
      if (!devicesInfo) {
        if (hard.devices.length > 0) {
          devicesInfo = hard.devices[0];
          electronStore.set(
            `${storage.lastOrganization}-${storage.userId}-${hard.type}-selectDeviceInfo`,
            devicesInfo
          );
        } else if (hard.devices.length === 0) {
          devicesInfo = {
            deviceType: hard.type,
            examRoom: null,
            mac: null,
            name: null,
          };
        }
      } else {
        let sameFlag = false;
        for (let i = 0; i < hard.devices.length; i++) {
          const element = hard.devices[i];
          if (
            element.mac === devicesInfo.mac &&
            element.name === devicesInfo.name
          ) {
            sameFlag = true;
            break;
          }
        }
        if (!sameFlag) {
          devicesInfo = hard.devices[0];
          electronStore.delete(
            `${storage.lastOrganization}-${storage.userId}-${hard.type}-selectDeviceInfo`);
          electronStore.set(
            `${storage.lastOrganization}-${storage.userId}-${hard.type}-selectDeviceInfo`,
            devicesInfo
          );
        }
      }
      selectHardwareInfoFun(devicesInfo);
    }
  }, [devicesTypeList]);

  return (
    <div className="hardwareType" style={{ width: px(80), height: bodyHeight }}>
      <ul>{options}</ul>
    </div>
  );
};

HardWareTypeUI.propTypes = {
  bodyHeight: PropTypes.number,
  devicesTypeList: PropTypes.array,
};
//默认值
HardWareTypeUI.defaultProps = {
  bodyHeight: 0,
  devicesTypeList: [],
};

export default connect(
  (state) => ({
    selectHardwareType: state.hardwareReduce.selectHardwareType,
    menuNum: state.userReduce.menuNum,
  }),
  { selectHardwareInfoFun, setSelectHardwareType, setMenuNum }
)(HardWareTypeUI);
