import React, { useEffect, useState, useRef } from "react";
import { Button, Progress, Layout, Carousel, Modal } from "antd";
import { PlusOutlined } from "@ant-design/icons";

import Animation_1 from "./../../../assets/img/Animation_1.png";
import Animation_2 from "./../../../assets/img/Animation_2.png";
import Animation_3 from "./../../../assets/img/Animation_3.png";
import mellaCoolDown from "./../../../assets/img/mellaCoolDown.png"
import { connect } from "react-redux";
import {
  selectHardwareModalShowFun,
  petSortTypeFun,
  petDetailInfoFun,
  setMellaConnectStatusFun,
  setMellaMeasureValueFun,
  setMellaPredictValueFun,
  setMellaMeasurePartFun,
} from "../../../store/actions";
import { px } from "../../../utils/px";
import electronStore from "../../../utils/electronStore";
import _ from "lodash";

import "./measurement.less";

let storage = window.localStorage;
const { Content, Header } = Layout;

const Measurement = ({ petMessage, hardwareMessage }) => {
  let { mellaMeasureValue, mellaMeasurePart } = hardwareMessage;
  const [percent, setPercent] = useState(0);
  const [value, setValue] = useState(0);
  const [timers, setTimers] = useState(0);
  const [isHua, setIsHua] = useState(true);
  // 温度太高弹窗
  const [mellaCoolDown, setMellaCoolDown] = useState(true);
  const saveCallBack = useRef();
  const callBack = () => {
    const random = 1;
    setValue(value + random);
    setTimers(timers + random);
  };

  //圆滑里面的文字
  const ProgressTitle = (percent) => {
    let num = parseFloat(percent);
    if (isHua) {
      num = (num * 1.8 + 32).toFixed(1);
    }
    return (
      <>
        {mellaMeasurePart !== "耳温" ? (
          <p className="ProgressTitle">
            {num}
            <span className="symbol">{`${isHua ? "℉" : "℃"}`}</span>
          </p>
        ) : (
          <></>
        )}
        <p className="ProgressTitle">Measuring</p>
      </>
    );
  };
  //图片切换
  const checkImage = () => {
    switch (timers) {
      case 0:
        return <img src={Animation_1} />;
      case 1:
        return <img src={Animation_2} />;
      case 2:
        return <img src={Animation_3} />;
      case 3:
        return <img src={Animation_3} />;
      default:
        break;
    }
  };

  useEffect(() => {
    saveCallBack.current = callBack;
    if (timers > 2) {
      setTimers(0);
    }
    return () => { };
  });

  useEffect(() => {
    const tick = () => {
      saveCallBack.current();
    };
    const timer = setInterval(tick, 1000);
    return () => {
      clearInterval(timer);
    };
  }, []);
  useEffect(() => {
    let hardSet = electronStore.get(`${storage.userId}-hardwareConfiguration`);
    if (hardSet) {
      let { isHua } = hardSet;
      setIsHua(isHua);
    }
  }, []);

  return (
    <>
      {/* <HeaderItem /> */}
      <Content className={"measureContentBox"}>
        <div style={{height: '100%', display: 'flex', flexDirection: 'column', alignItems:'center', justifyContent:'center'}}>
          <div style={{ marginTop: 16 }}>
            <Progress
              type="dashboard"
              percent={_.round(mellaMeasureValue, 1)}
              gapDegree={30}
              // width={px(260)}
              strokeWidth={"8"}
              format={(percent) => ProgressTitle(percent)}
              strokeColor={'#4C595E'}
              className='measuringProgress'
            />
          </div>
          {checkImage()}
        </div>
        {/* <Modal
          open={mellaCoolDown}
          // onOk={handleOk}
          centered
          // onCancel={() => this.setState({ baseModalVisible: false })}
          width={430}
          footer={[]}
          className="mellaCoolDown"
        >
          <div className="modalContainer">
            <div className="title">Mella Needs To Cooldown</div>
            <div className="subTitle">Mella is still cooling down. <br /> Wait a bit then try again.</div>
            <img src={mellaCoolDown} alt="" width={180} height={180} />
            <div className="bottomTitle">
              Tip: Wave thermometer in the air or use a <br />
              cold damp cloth to wipe off the tip of the <br />
              thermometer until it is at 85°F
            </div>
            <Button
              style={{ backgroundColor: "#e1206d" }}
              className="btn"
              type="danger"
              shape="round"
              color="#e1206d"
            >
              OK
            </Button>
          </div>
        </Modal> */}
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
)(Measurement);
