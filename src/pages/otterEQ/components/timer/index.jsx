import React, { useEffect, useState, useRef } from "react";
import { Button, Progress } from "antd";
import { px } from "../../../../utils/px";
import { connect } from "react-redux";
import {
  selectHardwareModalShowFun,
  petSortTypeFun,
  petDetailInfoFun,
} from "../../../../store/actions";

import moment from "moment";
import _ from "lodash";
import "./index.less";
let timer = null
const TimerPage = ({ petMessage, hardwareMessage, cutPageType }) => {
  const [time, setTime] = useState(60)
  const timeLengthTo2 = (value) => {
    if (`${value}`.length === 1) {
      return `0${value}`
    }
    return `${value}`

  }
  const onClick = () => {
    timer && clearInterval(timer)
    cutPageType('result');
  }
  useEffect(() => {
    timer && clearInterval(timer)
    timer = setInterval(() => {
      setTime(v => {
        if (v === 0) {
          timer && clearInterval(timer)
          onClick()
          return v
        }
        return v - 1
      })

    }, 1000)
    return () => timer && clearInterval(timer)
  }, [])
  return (
    <>
      <div className="topBox">
        <p className="topTitle" style={{ fontSize: px(40) }}>
          Results Processing
        </p>
      </div>
      <div className="middleBox" style={{ margin: px(-100) }}>
        <p className="middleTitle" style={{ fontSize: px(30) }}>
          Please wait for
          <br />
          accurate results
        </p>
      </div>
      <div>
        <Progress
          type="circle"
          percent={time / 60 * 100}
          format={() => <div style={{ fontSize: '32px' }}>{`00:00:${timeLengthTo2(time)}`}</div>}
          width={270}
          strokeWidth={12}
          strokeColor={'#FFA132'}
        />
      </div>

      <div className="bottomBox">
        <Button type="primary" shape="round" style={{ width: px(400), height: px(40), fontSize: '20px' }} onClick={onClick}>{`skip timer & procees`}</Button>
      </div>
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
  }
)(TimerPage);
