import React, { useEffect, useState } from "react";
import {
  Progress,
} from "antd";

const MeasuredProgress = ({ gapDegree, percent, strokeColor, format }) => {

  return (
    <>
      <Progress
        type="dashboard"
        percent={percent}
        gapDegree={gapDegree}
        strokeWidth={"8"}
        // format={(percent) => ProgressTitle(percent)}
        strokeColor={{
          "0%": "#7bd163",
          "100%": "#19ade4",
        }}
      />
    </>
  );

};

export default MeasuredProgress;
