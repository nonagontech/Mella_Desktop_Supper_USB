import React, { useEffect, useState, useRef } from "react";
import { Button, Input } from "antd";

import electronStore from "../../../../utils/electronStore";

import { useHistory } from "react-router-dom";
import { connect } from "react-redux";
import {
  selectHardwareModalShowFun,
  petSortTypeFun,
  petDetailInfoFun,
  setSelectHardwareType
} from "../../../../store/actions";
import _ from "lodash";

import "./index.less";

const LinkEquipment = ({ petMessage, hardwareMessage,setSelectHardwareType }) => {
  let history = useHistory();

  return (
    <div className="contentBox">
      <div className="planBox">
        <p className="title">
          Luna is not enrolled<br />
          in a feeding plan
        </p>
        <p className="recommendedTitle">A Mabel smart bowl scale is recommended.</p>
        <div className="btnBox">
          <Button
            type="primary"
            shape="round"
            block
            onClick={() => {
              setSelectHardwareType('prescribePlan');
            }}
          >
            Prescribe Feeding Plan
          </Button>
        </div>
      </div>
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
    setSelectHardwareType
  }
)(LinkEquipment);
