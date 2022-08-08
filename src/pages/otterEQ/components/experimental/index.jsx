import React, { useEffect, useState, useRef } from "react";
import { Layout, Button, Input, Radio } from "antd";
import { px } from "../../../../utils/px";
import { connect } from "react-redux";
import {
  selectHardwareModalShowFun,
  petSortTypeFun,
  petDetailInfoFun,
} from "../../../../store/actions";

import swirl from "../../../../assets/img/swirl.png";
import BreakSeal from "../../../../assets/img/Break-Seal.png";
import label from "../../../../assets/img/label.png";
import Incubator from "../../../../assets/img/Incubator.png";


import moment from "moment";
import _ from "lodash";
import "./index.less";

const ExperimentalPage = ({ petMessage, hardwareMessage ,cutPageType}) => {
  const [value, setValue] = useState(1);

  const cutTitle = () => {
    switch (value) {
      case 1:
        return (<>{`${'Swirl sample in'}`}<br />{`${'solution'}`}</>);
      case 2:
        return (<>{`${'Break off stem and'}`}<br />{`${'seal collection tube'}`} </>);
      case 3:
        return (<>{`${'Affix label to'}`}<br />{`${'collection tube'}`} </>);
      case 4:
        return (<>{`${'Place tube in'}`}<br />{`${'incubator'}`} </>);
      default:
        break;
    }
  }

  const cutImage = () => {
    switch (value) {
      case 1:
        return <img src={swirl} alt="" style={{ width: px(328), height: px(287) }} />;
      case 2:
        return <img src={BreakSeal} alt="" style={{ width: px(328), height: px(287) }} />;
      case 3:
        return <img src={label} alt="" style={{ width: px(328), height: px(287) }} />;
      case 4:
        return <img src={Incubator} alt="" style={{ width: px(328), height: px(287) }} />;
      default:
        break;
    }
  }

  const onClick = () => {
    if (value !== 4) {
      setValue(value + 1)
    } else {
      cutPageType('timerPage');
    }
  }

  return (
    <>
      <div className="topBox">
        <p className="topTitle" style={{ fontSize: px(40) }}>
          {cutTitle()}
        </p>
      </div>
      <div className="imageBox">
        {cutImage()}
      </div>
      <div className="bottomBox">
        <Button type="primary" shape="round" style={{ width: px(400), height: px(40) }} onClick={onClick}>{value !== 4 ? 'Next' : 'Start Timer'}</Button>
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
)(ExperimentalPage);
