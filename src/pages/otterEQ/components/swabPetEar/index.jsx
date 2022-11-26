import React, { useEffect, useState, useRef } from "react";
import { Layout, Button, Input, Radio } from "antd";
import { px } from "../../../../utils/px";
import { connect } from "react-redux";



import {
  selectHardwareModalShowFun,
  petSortTypeFun,
  petDetailInfoFun,
  setQsmEarPart
} from "../../../../store/actions";

import DogLeftEar from "../../../../assets/img/DogLeftEar.png";
import DogRightEar from "../../../../assets/img/DogRightEar.png";
import CatLeftEar from "../../../../assets/img/CatLeftEar.png";
import CatRightEar from "../../../../assets/img/CatRightEar.png";


import moment from "moment";
import _ from "lodash";
import "./index.less";



const SwabPetEar = ({ petMessage, hardwareMessage, cutPageType, setQsmEarPart, qsmMessage }) => {
  let {
    petSpeciesBreedId,
  } = petMessage;
  const [value, setValue] = useState(1);

  const onChange = (e) => {
    setValue(e.target.value);
  };

  const imagetypeEvent = () => {
    if (value === 1) {
      if (petSpeciesBreedId === 11001 || _.inRange(petSpeciesBreedId, 1, 136)) {
        return <img src={CatRightEar} alt="" />;
      } else if (petSpeciesBreedId === 12001 || _.inRange(petSpeciesBreedId, 136, 456)) {
        return <img src={DogRightEar} alt="" />;
      } else {
        return <img src={DogRightEar} alt="" />;
      }
    } else {
      if (petSpeciesBreedId === 11001 || _.inRange(petSpeciesBreedId, 1, 136)) {
        return <img src={CatLeftEar} alt="" />;
      } else if (petSpeciesBreedId === 12001 || _.inRange(petSpeciesBreedId, 136, 456)) {
        return <img src={DogLeftEar} alt="" />;
      } else {
        return <img src={DogLeftEar} alt="" />;
      }
    }
  }

  const onClick = () => {
    //这里需要将qsm的耳朵记录下来
    setQsmEarPart(value)
    cutPageType('experimentalPage');
    // if (value === 1) {
    //   setValue(2);
    // } else {
    //   cutPageType('experimentalPage');
    // }

  }
  useEffect(() => {
    setValue(qsmMessage.qsmEarPart)
  }, [])




  return (
    <>
      <div className="topBox">
        <p className="topTitle" style={{ fontSize: px(40) }}>
          Swab Pet's Ear
        </p>
      </div>
      <div className="imageBox">
        {imagetypeEvent()}
      </div>
      <div className="radioBox">
        <Radio.Group onChange={onChange} value={value}>
          <Radio value={1}>Right Ear</Radio>
          <Radio value={2}>Left Ear</Radio>
        </Radio.Group>
      </div>
      <div className="bottomBox">
        <Button type="primary" shape="round" style={{ width: px(400), height: px(40) }} onClick={onClick}>Next</Button>
      </div>
    </>
  );
};

export default connect(
  (state) => ({
    petMessage: state.petReduce.petDetailInfo,
    hardwareMessage: state.hardwareReduce,
    qsmMessage: state.qsmReduce

  }),
  {
    selectHardwareModalShowFun,
    petSortTypeFun,
    petDetailInfoFun,
    setQsmEarPart
  }
)(SwabPetEar);
