import React, { useEffect, useState, useRef } from "react";
import { Image, Layout, Button } from "antd";
import { connect } from "react-redux";

import PressButton_Pro from "./../../../assets/img/PressButton_Pro.png";
import AxillaryPlacement from "./../../../assets/img/AxillaryPlacement.png"; //腋温底部图片
import EarPlacement from "./../../../assets/img/EarPlacement.png"; //耳温底部图片
import RectalPlacement from "./../../../assets/img/RectalPlacement.png"; //肛温底部图片
import Standing_Dog from "./../../../assets/img/Standing_Dog.png";
import Standing_Cat from "./../../../assets/img/Standing_Cat.png";
import Sitting_Dog from "./../../../assets/img/Sitting_Dog.png";
import Sitting_Cat from "./../../../assets/img/Sitting_Cat.png";
import Laying_Dog from "./../../../assets/img/Laying_Dog.png";
import Laying_Cat from "./../../../assets/img/Laying_Cat.png";
import { px } from "../../../utils/px";

import {
  selectHardwareModalShowFun,
  petSortTypeFun,
  petDetailInfoFun,
  setMellaConnectStatusFun,
  setMellaMeasureValueFun,
  setMellaPredictValueFun,
  setMellaMeasurePartFun,
} from "../../../store/actions";
import _ from "lodash";
import HistoryTable from "../../../components/historyTable";
import moment from "moment";
import "./linkEquipment.less";

const { Content, Header } = Layout;

const LinkEquipment = ({ petMessage, hardwareMessage }) => {
  let { mellaConnectStatus, mellaMeasurePart } = hardwareMessage;
  let imageMap = [
    Standing_Dog,
    Standing_Cat,
    Sitting_Dog,
    Sitting_Cat,
    Laying_Dog,
    Laying_Cat,
  ];

  const [type, setType] = useState(false); //是否显示轮播图
  const [carouselIndex, setCarouselIndex] = useState(0); //轮播图下标
  const saveCallBack = useRef();
  const callBack = () => {
    setCarouselIndex(carouselIndex + 1);
  };

  //切换图片
  const checkImage = () => {
    if (mellaMeasurePart === "腋温") {
      return AxillaryPlacement;
    } else if (mellaMeasurePart === "耳温") {
      return EarPlacement;
    } else {
      return RectalPlacement;
    }
  };
  //点击进入轮播图
  const clickIntoTip = () => {
    setType(true);
  };
  //小圆点点击事件
  const clickPoint = (index) => {
    setCarouselIndex(index);
  };

  useEffect(() => {
    saveCallBack.current = callBack;
    if (carouselIndex === 6) {
      setCarouselIndex(0);
    }
  }, [carouselIndex]);

  useEffect(() => {
    const tick = () => {
      saveCallBack.current();
    };
    let timer = null;
    if (type && mellaConnectStatus === "connected") {
      timer = setInterval(tick, 1500);
    }
    if (mellaConnectStatus !== "connected") {
      setType(false);
      setCarouselIndex(0);
      clearInterval(timer);
    }
    return () => {
      clearInterval(timer);
    };
  }, [type, mellaConnectStatus]);

  return (
    <>
      <Content className={"contentBox"}>
        {_.isEqual(mellaConnectStatus, "disconnected") ? (
          <>
            <div className="startBox">
              <p className="startTitle">
                Turn on your
                <br />
                Mella Thermometer
                <br />
                or Pair New Mella
              </p>
              <img src={PressButton_Pro} className={"PressButton_Pro"} style={{width:px(300),height:px(200)}} />
            </div>
            <div className="tableBox">
              <HistoryTable tableColumnType='temperature' />
            </div>
          </>
        ) : (
          <>
            <div className="startBox">
              <p className="startTitle">
                {!type
                  ? "Ready, place under foreleg"
                  : "Place Under Foreleg Standing"}
              </p>
              {!type ? (
                <>
                  <img src={checkImage()}></img>
                  {mellaMeasurePart === "腋温" ? (
                    <div className="bottomTip">
                      <p className="tipTitle" onClick={() => clickIntoTip()}>
                        Need Help With Accurate Placement On Pet?
                      </p>
                    </div>
                  ) : (
                    <></>
                  )}
                </>
              ) : (
                <>
                  <div className="carouselBox">
                    {_.map(imageMap, (item, index) => {
                      return (
                        <div key={index}>
                          <img
                            className="contentStyle"
                            src={item}
                            style={{
                              display: carouselIndex === index ? "" : "none",
                            }}
                          />
                        </div>
                      );
                    })}
                  </div>
                  <div className="dotBox">
                    <ul className="dotList">
                      {_.map(imageMap, (item, index) => {
                        return (
                          <li key={index}>
                            <Button
                              className="dotItem"
                              onClick={() => clickPoint(index)}
                              style={{
                                background:
                                  carouselIndex === index
                                    ? "#0a0a0a"
                                    : "#bdbaba",
                              }}
                            >
                              {index}
                            </Button>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                </>
              )}
            </div>
          </>
        )}
      </Content>
    </>
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
  }
)(LinkEquipment);
