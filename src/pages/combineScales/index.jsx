import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { Layout, Avatar, Button, Card } from "antd";
import { CheckCircleFilled } from "@ant-design/icons";
import { setMenuNum } from "../../store/actions";
import _ from "lodash";
import { devicesTitleHeight } from "../../utils/InitDate";
import scaleImage from "./../../assets/img/scaleImage.png";
import "./index.less";

const { Header, Content, Footer, Sider } = Layout;
const { Meta } = Card;
const CombineScales = ({ petMessage, hardwareMessage, userMessage }) => {
  return (
    <>
      <Layout className="mergePage">
        <Header className="headerBox" style={{ height: devicesTitleHeight }}>
          <span className="headerTitle">Combine Scales</span>
        </Header>
        <Content className="contentBox">
          <div className="tipTitleBox">
            <span>Select the scales you'd like to combine</span>
          </div>
          <div className="selectScalesBox">
            <Card className="cardBox" hoverable>
              <div className="cardBodyBox">
                <Meta
                  avatar={<Avatar src={scaleImage} />}
                  description="This is the description"
                />
                <CheckCircleFilled style={{color:'#5cbbe0',fontSize:'18px'}}/>
              </div>
            </Card>
            <Card className="cardBox" hoverable>
              <div className="cardBodyBox">
                <Meta
                  avatar={<Avatar src={scaleImage} />}
                  description="This is the description"
                />
                <CheckCircleFilled  style={{color:'#5cbbe0',fontSize:'18px'}}/>
              </div>
            </Card>
            <Card className="cardBox" hoverable>
              <div className="cardBodyBox">
                <Meta
                  avatar={<Avatar src={scaleImage} />}
                  description="This is the description"
                />
                <CheckCircleFilled style={{color:'#5cbbe0',fontSize:'18px'}}/>
              </div>
            </Card>
          </div>
        </Content>
      </Layout>
    </>
  );
};

export default connect(
  (state) => ({
    petMessage: state.petReduce.petDetailInfo,
    hardwareMessage: state.hardwareReduce,
    userMessage: state.userReduce,
  }),
  {
    setMenuNum,
  }
)(CombineScales);
