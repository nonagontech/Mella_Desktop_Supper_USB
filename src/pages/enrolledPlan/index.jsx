import React, { useEffect, useState, useRef } from "react";
import { Button, Checkbox, Layout, List, Avatar, Modal, Form, Input } from "antd";

import catFood from '../../assets/img/catFood.png';
import redcat from "../../assets/images/redcat.png";
import reddog from "../../assets/images/reddog.png";
import redother from "../../assets/images/redother.png";

import { calculateAge, petPicture } from '../../utils/commonFun';
import electronStore from "../../utils/electronStore";

import { useHistory } from "react-router-dom";
import { connect } from "react-redux";
import {
  selectHardwareModalShowFun,
  petSortTypeFun,
  petDetailInfoFun,
  setSelectHardwareType
} from "../../store/actions";
import PropTypes from 'prop-types';
import _ from "lodash";

import "./index.less";

const EnrolledPlan = ({ petMessage, hardwareMessage, bodyHeight,setSelectHardwareType }) => {
  const { Content, Header } = Layout;
  let history = useHistory();
  const [form] = Form.useForm();
  const [nextType, setNextType] = useState('selectIllness');//切换当前页面的组件。selectIllness：选择疾病；createPlan:创建计划；planInfo:计划详情。
  const [isModalVisible, setIsModalVisible] = useState(false);//控制弹窗的显隐
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
  //表单提交
  const onFinish = (values) => {
    console.log(values);
    setSelectHardwareType("mabel");
  };
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
              dataSource={data}
              renderItem={(item) => (
                <div className="listBox">
                  <List.Item className="listItem">
                    <div className="item">
                      <div className="top">
                        <p>{item.title}</p>
                        <p>123</p>
                      </div>
                      <div className="bottom">
                        <p>Weight</p>
                        <p>465</p>
                      </div>
                    </div>
                  </List.Item>
                </div>
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
            onClick={() => {
              electronStore.set(`${petMessage.petId}-planType`, true);
              setNextType('createPlan');
            }}
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
              onClick={() => { setIsModalVisible(true) }}
            >
              Send to Mabel
            </Button>
          </>
        );
      default:
        break;
    }
  }
  //展示宠物照片
  const shoePetPicture = () => {
    if (_.isEmpty(petMessage?.url)) {
      switch (petPicture(petMessage?.petSpeciesBreedId)) {
        case 'cat':
          return redcat
        case 'dog':
          return reddog
        case 'other':
          return redother
        default:
          return redother
      }
    } else {
      return petMessage?.url
    }
  }
  //展示主人名字方法
  const ownerName = () => {
    if (_.isEmpty(petMessage?.firstName) && _.isEmpty(petMessage?.lastName)) {
      return "unknown";
    } else {
      return petMessage?.firstName + " " + petMessage?.lastName;
    }
  };
  //关闭弹窗
  const handleCancel = () => {
    setIsModalVisible(false);
  };

  return (
    <Layout className="planContentBox" style={{ height: bodyHeight }}>
      <div className="heardTitleBox">
        <p>{topTitle()}</p>
      </div>
      <div className="petMessageBox">
        <div className="left">
          <Avatar src={shoePetPicture()} size={64} />
          <div className="petMsg">
            <p>{petMessage.petName ? petMessage?.petName : 'unknown'}</p>
            <p>{ownerName()}</p>
          </div>
        </div>
        <div className="right">
          <p>{calculateAge(petMessage?.birthday) === 'unknown' ? 'unknown' : `${calculateAge(petMessage?.birthday)} Years Old`}</p>
          <p>{petMessage?.weight} lbs</p>
          <p>{petMessage?.gender === 0 ? 'Male' : 'Female'}</p>
          <p>{petMessage?.breedName}</p>
        </div>
      </div>
      <div className="middleBox">
        {middleContent()}
      </div>
      <div className="btnBox">
        {bottomBtn()}
      </div>
      <Modal
        title="Send Feeding Plan to Mabel"
        open={isModalVisible}
        onCancel={handleCancel}
        centered
        maskClosable={false}
        footer={null}
        destroyOnClose
        width={300}
        className="planModal"
      >
        <div className="modalContentBox">
          <div className="description">
            <p>Enter pet parent's email associated with their Mella Health App.</p>
          </div>
          <div className="formBox">
            <Form form={form} onFinish={onFinish} preserve={false}>
              <Form.Item
                name="mellaId"
              >
                <Input />
              </Form.Item>
              <Form.Item
                name="email"
              >
                <Input />
              </Form.Item>
              <Form.Item>
                <Button type="primary" shape="round" block htmlType="submit">
                  Send
                </Button>
              </Form.Item>
            </Form>
          </div>
        </div>
      </Modal>
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
    setSelectHardwareType,
  }
)(EnrolledPlan);
