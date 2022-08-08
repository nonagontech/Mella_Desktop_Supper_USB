import React, { useEffect, useState, useRef } from "react";
import { Progress } from "antd";
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

const TimerPage = ({ petMessage, hardwareMessage, cutPageType }) => {
  return (
    <>
      <div className="topBox">
        <p className="topTitle" style={{ fontSize: px(40) }}>
          Results Processing
        </p>
      </div>
      <div className="middleBox" style={{margin:px(-100)}}>
        <p className="middleTitle" style={{ fontSize: px(30) }}>
          Please wait for
          <br />
          accurate results
        </p>
      </div>
      <div>
        <Progress type="circle" percent={60} format={() => '06:01:59'} width={270} strokeWidth={12} />
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
