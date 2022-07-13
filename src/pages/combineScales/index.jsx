import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import {
  Layout,
  Avatar,
  Button,
  Card,
  Space,
  message,
  Input,
  Modal,
} from "antd";
import {
  CheckCircleFilled,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import {
  setMenuNum,
  selectHardwareInfoFun,
  selectHardwareList,
} from "../../store/actions";
import _ from "lodash";
import { devicesTitleHeight } from "../../utils/InitDate";
import scaleImage from "./../../assets/img/scaleImage.png";
import combinedscales from "./../../assets/img/combinedscales.png";
import { px } from "../../utils/px";
import "./index.less";

const { Header, Content, Footer, Sider } = Layout;
const { Meta } = Card;
const { confirm } = Modal;
const CombineScales = ({
  petMessage,
  hardwareMessage,
  userMessage,
  setMenuNum,
  selectHardwareInfoFun,
  selectHardwareList,
}) => {
  let { hardwareList } = hardwareMessage;
  const [biggieList, setBiggieList] = useState([]); //体重秤仪器列表
  const [confirmType, setConfirmType] = useState(false); //确认选择
  const [checkHardwareList, setcheckHardwareList] = useState([]); //存储用户点击选择的体重秤信息
  const [saveName, setSaveName] = useState(""); //保存用户的更改的名字

  //点击卡片选择效果
  const onClick = (index, data) => {
    console.log(data);
    let changeClassName = document.getElementById(index).classList;
    let iconClassName = document.getElementById(`${"icon" + index}`);
    let cardClassNametype = document
      .getElementById(index)
      .classList.contains("cardBoxClick");
    cardClassNametype
      ? changeClassName.remove("cardBoxClick")
      : changeClassName.add("cardBoxClick");
    cardClassNametype
      ? (iconClassName.style.display = "none")
      : (iconClassName.style.display = "");
    let oldData = checkHardwareList;
    setcheckHardwareList(_.xorWith([data], oldData, _.isEqual));
  };
  //确认选择两个体重秤
  const onChangeScales = () => {
    if (_.size(checkHardwareList) > 1) {
      setConfirmType(true);
    } else {
      message.error({
        content: "Please choose more than two scales",
        style: {
          marginTop: "20vh",
        },
      });
    }
  };
  //保存用户更改的名字
  const saveChangeName = (e) => {
    setSaveName(e.target.value);
  };

  //跳转准备测量
  const startMeasuring = () => {
    confirm({
      title: "Are you sure to incorporate the body fat scale?",
      icon: <ExclamationCircleOutlined />,
      style: {
        marginTop: "20vh",
      },
      width: 480,
      onOk() {
        let mac = _.join(_.map(checkHardwareList, "mac"), "/");
        let newData = {
          name: _.isEmpty(saveName) ? "CompositeScale" : saveName,
          mac: mac,
          deviceType: "biggie",
          examRoom: "",
        };
        let newHardwareList = hardwareList;
        newHardwareList[1].devices.push({ ...newData });
        selectHardwareList(newHardwareList);
        selectHardwareInfoFun(newData);
        setMenuNum("1");
      },
    });
  };

  useEffect(() => {
    let newData = [];
    _.forIn(_.find(hardwareList, ["type", "biggie"]).devices, (item) => {
      if (item.mac.indexOf("/") === -1) {
        newData.push(item);
      }
    });
    setBiggieList(newData);
    return () => {};
  }, []);

  return (
    <>
      <Layout className="mergePage">
        <Header className="headerBox" style={{ height: px(100) }}>
          <span className="headerTitle">
            {confirmType ? "Scales Combined As One" : "Combine Scales"}
          </span>
        </Header>
        <Content className="contentBox">
          <div className="tipTitleBox">
            {!confirmType ? (
              <span>
                Select the scales you'd
                <br />
                like to combine
              </span>
            ) : (
              <span>
                These two scales are now combined.
                <br />
                Please give this combination a name
              </span>
            )}
          </div>

          {confirmType ? (
            <div className="asOneCardBox">
              <Space>
                {_.map(checkHardwareList, (item, index) => {
                  return (
                    <Card className="asOneCard">
                      <Meta
                        avatar={<Avatar src={scaleImage} size={53} />}
                        description={
                          <div style={{ display: "grid" }}>
                            <span>Device Name:{item.name}</span>
                            <span>
                              {item.deviceType === "biggie"
                                ? "Biggie Pro Scale"
                                : "Biggie Home Scale"}
                            </span>
                            <span>SN:{item.mac}</span>
                          </div>
                        }
                      />
                    </Card>
                  );
                })}
              </Space>
              <div className="acOneImageBox">
                <img src={combinedscales} />
              </div>
            </div>
          ) : (
            <div className="selectScalesBox">
              {_.map(biggieList, (item, index) => {
                return (
                  <Card
                    className="cardBox"
                    hoverable
                    onClick={() => onClick(`${index}`, item)}
                    id={`${index}`}
                    key={index}
                  >
                    <div className="cardBodyBox">
                      <Meta
                        avatar={<Avatar src={scaleImage} size={53} />}
                        description={
                          <div style={{ display: "grid" }}>
                            <span>Device Name:{item.name}</span>
                            <span>
                              {item.deviceType === "biggie"
                                ? "Biggie Pro Scale"
                                : "Biggie Home Scale"}
                            </span>
                            <span>SN:{item.mac}</span>
                          </div>
                        }
                      />
                      <CheckCircleFilled
                        id={`${"icon" + index}`}
                        style={{
                          color: "#5cbbe0",
                          fontSize: "20px",
                          display: "none",
                        }}
                      />
                    </div>
                  </Card>
                );
              })}
            </div>
          )}

          {confirmType ? (
            <>
              <div className="inputBox">
                <Input
                  placeholder="Combined Scale Name"
                  className="inputName"
                  maxLength={25}
                  onChange={saveChangeName}
                />
              </div>
              <div className="scalesBtnBox">
                <Button
                  type="primary"
                  className="scalesBtn"
                  shape="round"
                  onClick={() => startMeasuring()}
                >
                  Save & Start Measuring
                </Button>
              </div>
            </>
          ) : (
            <Space className="scalesBtnBox">
              <Button
                type="primary"
                className="scalesBtn"
                shape="round"
                onClick={() => setMenuNum("AddDevice")}
              >
                Add New Scale
              </Button>
              <Button
                type="primary"
                className="scalesBtn"
                shape="round"
                onClick={() => onChangeScales()}
              >
                Combine Scales
              </Button>
            </Space>
          )}
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
    selectHardwareInfoFun,
    selectHardwareList,
  }
)(CombineScales);
