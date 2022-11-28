import React, { useEffect, useState, useRef } from "react";
import { Layout, Button, Input, Radio } from "antd";
import { px } from "../../../../utils/px";
import { connect } from "react-redux";
import {
  selectHardwareModalShowFun,
  petSortTypeFun,
  petDetailInfoFun,
  setQsmTimeType
} from "../../../../store/actions";

import swirl from "../../../../assets/img/swirl.png";
import BreakSeal from "../../../../assets/img/Break-Seal.png";
import label from "../../../../assets/img/label.png";
import Incubator from "../../../../assets/img/Incubator.png";

import overnight from "../../../../assets/img/overnight.png";
import rapid from "../../../../assets/img/rapid.png";
import dui from "../../../../assets/img/dui1.png";


import moment from "moment";
import _ from "lodash";
import "./index.less";

const lists = [
  {

    title: 'Rapid Test Prep',
    text: 'Mix sample swab in elution buffer for 60 seconds.',
    img: rapid
  },
  {
    title: 'Overnight test prep',
    text: 'Swirl a fresh sterile swab on the surface of the culture medium.',
    img: overnight
  }
]

const ExperimentalPage = ({ petMessage, hardwareMessage, cutPageType, setQsmTimeType, qsmMessage }) => {
  const [value, setValue] = useState(1);
  // const [value, setValue] = useState(3);
  const [type, setType] = useState(0)

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
      case 5:
        return (<>{`${'Select Test Type'}`} </>);
      default:
        break;
    }
  }
  const itemList = () => {
    let options = lists.map((item, index) => {
      return (
        <li key={index.toString()}>
          <div className="liItem" onClick={() => {
            setType(index)
            setQsmTimeType(index)
          }}>
            <div className="img">
              <img src={item.img} />
            </div>
            <div className="textbox">
              <h5 className="title">{item.title}</h5>
              <div className="text">{item.text}</div>
            </div>
            <div className="select">
              {type === index ?
                <img src={dui} alt="" /> :
                <div style={{ width: '30px' }} />
              }
            </div>



          </div>
        </li>
      )

    })
    return (
      <ul>
        {options}
      </ul>
    )
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
      case 5:
        return <div className="qsmSelectTime">
          {itemList()}
        </div>
      default:
        break;
    }
  }

  const onClick = () => {
    if (value !== 5) {
      setValue(value + 1)
    } else {
      if (type === 0) {
        cutPageType('timerPage');
      } else {
        cutPageType('result');
      }
    }
  }
  useEffect(() => {
    setType(qsmMessage.qsmTimeType)
  }, [])

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
    qsmMessage: state.qsmReduce,
  }),
  {
    selectHardwareModalShowFun,
    petSortTypeFun,
    petDetailInfoFun,
    setQsmTimeType
  }
)(ExperimentalPage);
