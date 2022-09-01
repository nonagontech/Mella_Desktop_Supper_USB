import React, { useEffect, useState, useRef } from "react";
import { Button, Input, Card, List } from "antd";
import { InfoCircleFilled } from "@ant-design/icons";

import scale from "../../../../assets/img/scale.png"

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

const LinkEquipment = ({ petMessage, hardwareMessage, setSelectHardwareType }) => {
  let history = useHistory();
  const data = [
    {
      title: 'Last 24 hrs',
      number: '1'
    },
    {
      title: 'Last 7 days',
      number: '3'
    },
    {
      title: 'Days to goal',
      number: '33'
    },
    {
      title: 'Ideal Weight',
      number: '42'
    },
  ];
  const [planType, setPlanType] = useState(false);

  useEffect(() => {
    console.log('electronStore.get(`${petMessage.petId}-planType`): ', electronStore.get(`${petMessage.petId}-planType`));
    setPlanType(electronStore.get(`${petMessage.petId}-planType`) ? true : false);
  }, [petMessage.petId]);



  return (
    <div className="contentBox">
      {
        planType ?
          (
            <>
              <div className="topBox annulusBox">
                <div className="excircle">
                  <div className="circleContentBox">
                    <img src={scale} alt="" />
                    <div className="floatBox">
                      <div className="weightTitle">
                        <p>70</p>
                        <p>lbs</p>
                      </div>
                      <div className="identification">
                        <p>Current Weight</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="middleBox">
                <div className="bodyState">
                  <div className="item">
                    <InfoCircleFilled style={{ fontSize: '20px' }} />
                    <p>Body Fat Percent: 88%</p>
                  </div>
                  <div className="item">
                    <InfoCircleFilled style={{ fontSize: '20px' }} />
                    <p>Body Condition Score: 9</p>
                  </div>
                </div>
                <p className="hintTitle">23 lbs over ideal weight</p>
              </div>
              <div className="bottomBox">
                <List
                  dataSource={data}
                  renderItem={(item) => (
                    <div className="listBox">
                      <List.Item>
                        <div className="item">
                          <div className="top">
                            <p>{item.title}</p>
                          </div>
                          <div className="bottom">
                            <p>{item.number}</p>
                          </div>
                        </div>
                      </List.Item>
                    </div>
                  )}
                />
              </div>
            </>
          )
          :
          (
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
          )
      }
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
