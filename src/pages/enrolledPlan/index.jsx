import React, { useEffect, useState, useRef } from "react";
import { Button, Input, Checkbox, Layout, Card, List } from "antd";

import catFood from '../../assets/img/catFood.png'

import { useHistory } from "react-router-dom";
import { connect } from "react-redux";
import {
  selectHardwareModalShowFun,
  petSortTypeFun,
  petDetailInfoFun,
} from "../../store/actions";
import PropTypes from 'prop-types';
import _ from "lodash";

import "./index.less";

const EnrolledPlan = ({ petMessage, hardwareMessage, bodyHeight }) => {
  const { Content, Header } = Layout;
  let history = useHistory();
  const [nextType, setNextType] = useState('selectIllness');//切换当前页面的组件。selectIllness：选择疾病；createPlan:创建计划；planInfo:计划详情。
  const options = [
    {
      label: 'Hepatic Disease',
      value: '1',
    },
    {
      label: 'Renal Disease',
      value: '2',
    },
    {
      label: 'Osteoarthritis / Mobility / Joint',
      value: '3',
    },
  ];
  const data = [
    {
      title: 'Title 1',
    },
    {
      title: 'Title 2',
    },
    {
      title: 'Title 3',
    },
    {
      title: 'Title 4',
    },
  ];
  //选择的疾病
  const onChange = (checkedValues) => {
    console.log('checked = ', checkedValues);
  };
  //切换头部文字
  const topTitle = () => {
    switch (nextType) {
      case 'selectIllness':
        return 'Prescription Diet Matrix';
      case 'createPlan':
        return 'Prescription Diet Recommendations'
      case 'planInfo':
        return 'Feeding Plan'
      default:
        break;
    }
  }
  //切换中间组件
  const middleContent = () => {
    switch (nextType) {
      case 'selectIllness':
        return (
          <div className="selectIllness">
            <Checkbox.Group
              options={options}
              onChange={onChange}
              className="checkboxGroup"
            />
          </div>
        );
      case 'createPlan':
        return (
          <div className="recommendMessageBox">
            <div className="leftBox">
              <img src={catFood} alt="" />
            </div>
            <div className="rightBox">
              <p>Hill's Science Diet Adult 11+ Chicken Recipe cat food</p>
              <p>Fluffy's Feeding Plan:</p>
              <div className="descriptionTitle">
                <p>
                  Based on Fluffy's BCS of 7, age 14, and osteoarthritis, we recommend feeding her 1 1/8 cups of kibble per day.
                </p>
                <p>443 Calories per cup</p>
              </div>
            </div>
          </div>
        )
      case 'planInfo':
        return (
          <div className="planList">
            <List
              grid={{
                gutter: 16,
                column: 4,
              }}
              dataSource={data}
              renderItem={(item) => (
                <List.Item>
                  <div className="item">
                    <div>
                      <p>{item.title}</p>
                      <p>123</p>
                    </div>
                    <div>
                      <p>Weight</p>
                      <p>465</p>
                    </div>
                  </div>
                </List.Item>
              )}
            />
          </div>
        );
      default:
        break;
    }
  }
  //切换底部按钮
  const bottomBtn = () => {
    switch (nextType) {
      case 'selectIllness':
        return (
          <Button
            type="primary"
            shape="round"
            onClick={() => { setNextType('createPlan') }}
          >
            Set Recommendations
          </Button>
        );
      case 'createPlan':
        return (
          <Button
            type="primary"
            shape="round"
            onClick={() => { setNextType('planInfo') }}
          >
            Create Feeding Plan
          </Button>
        );
      case 'planInfo':
        return (
          <>
            <Button
              type="primary"
              shape="round"
              onClick={() => { }}
              className="itemBtn"
            >
              Email
            </Button>
            <Button
              type="primary"
              shape="round"
              className="itemBtn"
              onClick={() => { }}
            >
              Print
            </Button>
            <Button
              type="primary"
              shape="round"
              className="itemBtn"
              onClick={() => { }}
            >
              Send to Mabel
            </Button>
          </>
        );
      default:
        break;
    }
  }

  return (
    <Layout className="planContentBox" style={{ height: bodyHeight }}>
      <div className="heardTitleBox">
        <p>{topTitle()}</p>
      </div>
      <div className="petMessageBox">
        12333
      </div>
      <div className="middleBox">
        {middleContent()}
      </div>
      <div className="btnBox">
        {bottomBtn()}
      </div>
    </Layout>
  );
};

EnrolledPlan.propTypes = {
  bodyHeight: PropTypes.number,
  devicesTypeList: PropTypes.array
}

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
)(EnrolledPlan);
