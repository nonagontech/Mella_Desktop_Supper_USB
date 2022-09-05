import React, { useEffect, useState } from "react";
import {
  Button,
  Progress,
  Space,
  Table,
  Tag,
  Badge,
  Modal,
  Popconfirm,
  message,
} from "antd";
import measuredTable_1 from "./../../../assets/img/measuredTable_1.png";
import measuredTable_2 from "./../../../assets/img/measuredTable_2.png";
import measuredTable_3 from "./../../../assets/img/measuredTable_3.png";
import EditCircle from "./../../../assets/img/EditCircle.png";
import Delete from "./../../../assets/img/Delete.png";
import _ from "lodash";
import { connect } from "react-redux";
import {
  selectHardwareModalShowFun,
  petSortTypeFun,
  petDetailInfoFun,
  setMellaConnectStatusFun,
  setMellaMeasureValueFun,
  setMellaPredictValueFun,
  setMellaMeasurePartFun,
} from "../../../store/actions";
import Draggable from "react-draggable";
import { px, mTop } from "../../../utils/px";
import moment from "moment";
import electronStore from "../../../utils/electronStore";
import "./measuredData.less";
import {

  deletePetExamByExamId,
  ezyvetGetPetLatestExam,
  getPetExamByPetId,
  healthstatus,
  updatePetExam,
  updateVitalsTemperatureByVitalId,
  vetspireGetPetLatestExam
} from "../../../api";
import { addClamantPetExam } from './../../../api/mellaserver/exam'


const MeasuredData = ({
  petMessage,
  hardwareMessage,
  setMellaConnectStatusFun,
}) => {
  let { mellaMeasureValue, mellaConnectStatus, mellaMeasurePart } =
    hardwareMessage;
  let draggleRef = React.createRef();
  let { petId, memo, patientId } = petMessage;
  let storage = window.localStorage;
  let hisHe = mTop(200);
  try {
    let historyElement = document.querySelectorAll(".measurementBox .table");
    hisHe = historyElement[0].clientHeight - mTop(60);
  } catch (error) { }
  const [petTemperatureData, setPetTemperatureData] = useState([]); //存储宠物历史温度数据
  const [disabled, setDisabled] = useState(true); //model是否可拖拽
  const [visible, setVisible] = useState(false); //model框是否显示
  const [newMemo, setNewMemo] = useState(""); //note内容
  const [petMessages, setPetMessages] = useState({}); //接收点击了那个的值
  const [saveType, setSaveType] = useState(false); //是否隐藏按钮
  const [bounds, setBounds] = useState({
    left: 0,
    top: 0,
    bottom: 0,
    right: 0,
  });
  const [isHua, setIsHua] = useState(true);
  //表格渲染
  const columns = [
    {
      title: "Date",
      dataIndex: "createTime",
      ellipsis: true,
      align: "center",
      render: (text, record) => moment(text).format("MMM D"),
    },
    {
      title: "Time",
      dataIndex: "createTime",
      ellipsis: true,
      align: "center",
      render: (text, record) => moment(text).format("hh:mm A"),
    },
    {
      title: `Temp(${isHua ? "℉" : "℃"})`,
      dataIndex: "temperature",
      ellipsis: true,
      align: "center",
      render: (text, record) => {
        let num = parseFloat(text);
        if (isHua) {
          num = parseInt((num * 1.8 + 32) * 10) / 10;
        } else {
          num = num.toFixed(1);
        }

        return <Badge color={color()} text={num} />;
      },
    },
    {
      title: "Placement",
      dataIndex: "petVitalTypeId",
      ellipsis: true,
      align: "center",
      render: (text, record) => {
        if (text === 1) {
          return <img src={measuredTable_2} />;
        } else if (text === 3) {
          return <img src={measuredTable_1} />;
        } else if (text === 4) {
          return <img src={measuredTable_3} />;
        } else {
          return <img src={measuredTable_2} />;
        }
      },
    },
    {
      title: "Notes",
      dataIndex: "memo",
      ellipsis: true,
      align: "center",
      render: (text, record) => text,
    },
    {
      key: "Action",
      align: "center",
      render: (text, record) => (
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-around",
          }}
        >
          <img
            // className="operationIcon"
            src={EditCircle}
            onClick={() => {
              setVisible(true);
              setPetMessages(record);
            }}
            style={{ cursor: "pointer" }}
          />
          <Popconfirm
            title="Sure to delete?"
            onConfirm={() => deletePetMessage(record.examId)}
          >
            <img src={Delete} style={{ cursor: "pointer" }} />
          </Popconfirm>
        </div>
      ),
    },
  ];
  //根据温度判断指示文字颜色
  const color = () => {
    if (mellaMeasureValue > 40) {
      return "#e1206d";
    } else if (_.inRange(_.round(mellaMeasureValue), 38, 40)) {
      return "#58bde6";
    } else {
      return "#98da86";
    }
  };
  //圆滑里面的文字
  const ProgressTitle = (percent) => {
    //根据温度判断指示文字
    const title = () => {
      if (mellaMeasureValue > 40) {
        return "Danger";
      } else if (_.inRange(_.round(mellaMeasureValue), 38, 40)) {
        return "Normal";
      } else {
        return "Low";
      }
    };
    return (
      <>
        <p style={{ color: { color } }} className="ProgressTitle">
          {getTemp(percent)}
          <span style={{ color: { color } }} className="symbol">{`${isHua ? "℉" : "℃"
            }`}</span>
        </p>
        <p style={{ color: { color } }} className="ProgressTitle">
          {title()}
        </p>
      </>
    );
  };
  //获取历史宠物温度数据
  const getPetTemperatureData = () => {
    let params = {
      pageSize: 10,
      currPage: 1,
      deviceType: 0,
    }
    getPetExamByPetId(petId, params)
      .then((res) => {
        if (res.flag === true) {
          let arr = [];
          for (let i = 0; i < res.data.list.length; i++) {
            const element = res.data.list[i];
            arr.push(element);
          }
          setPetTemperatureData(_.orderBy(arr, 'createTime', 'desc'));
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };
  //返回准备测量界面
  const backConnectedPage = () => {
    if (mellaConnectStatus != "connected") {
      setMellaConnectStatusFun("connected");
    } else {
      setMellaConnectStatusFun("disconnected");
    }
  };
  //保存数据
  const saveData = () => {
    let petVitalId = null;
    switch (mellaMeasurePart) {
      case "腋温":
        petVitalId = 1;
        break;
      case "肛温":
        petVitalId = 3;
        break;
      case "耳温":
        petVitalId = 4;
        break;
      default:
        petVitalId = 1;
        break;
    }
    let params = {
      petId: petId,
      doctorId: storage.userId,
      temperature: mellaMeasureValue,
      petVitalTypeId: petVitalId,
      memo: "",
    };

    addClamantPetExam(params)
      .then((res) => {
        if (res.flag === true) {
          switch (storage.lastOrganization) {
            case '3'://vetspire
              updataVetspire(mellaMeasureValue)
              break;
            case '4'://ezyVet
              updataEzyvet(mellaMeasureValue, petVitalId)
              break;
            default: message.success('Data successfully saved in Mella')
              break;
          }
        }
        setSaveType(true);
        getPetTemperatureData();
      })
      .catch((err) => {
        console.log(err);
      });
  };
  //保存note
  const save = () => {
    let datas = {
      memo: newMemo,
    };
    updatePetExam(petMessages.examId, datas)
      .then((res) => {
        setVisible(false);
        getPetTemperatureData();
      })
      .catch((err) => {
        setVisible(false);
        console.log(err);
      });
  };
  //删除历史温度记录
  const deletePetMessage = (examId) => {

    deletePetExamByExamId(examId, '')
      .then(
        (res) => {
          if (res.flag === true) {
            message.success("Successfully Delete");
            getPetTemperatureData();
          } else {
            message.error("Fail To Delete");
          }
        }
      );
  };
  //关闭弹窗
  const handleCancel = (e) => {
    setVisible(false);
  };
  const onStart = (event, uiData) => {
    const { clientWidth, clientHeight } = window?.document?.documentElement;
    const targetRect = draggleRef?.current?.getBoundingClientRect();
    setBounds({
      left: -targetRect?.left + uiData?.x,
      right: clientWidth - (targetRect?.right - uiData?.x),
      top: -targetRect?.top + uiData?.y,
      bottom: clientHeight - (targetRect?.bottom - uiData?.y),
    });
  };
  const getTemp = (percent) => {

    let num = parseFloat(mellaMeasureValue);
    if (isHua) {
      num = (num * 1.8 + 32).toFixed(1);
    } else {
      num = parseFloat(num.toFixed(1));
    }
    return num;
  };
  const updataEzyvet = (Temp, petVitalId) => {
    let params = {
      id: patientId
    }

    ezyvetGetPetLatestExam(params)
      .then(res => {
        if (res.code === 10004 && res.msg === 'ezyvet token失效') {
          storage.connectionKey = res.newToken;
          reupdataEzyvet(Temp, petVitalId)
          return
        }
        if (res.flag && res.data && res.data.items.length > 0) {
          let data = res.data.items[0]
          let { consult_id } = data
          if (!consult_id) {
            message.error('Failed to obtain the latest medical record, the data is saved in Mella')
            return
          }
          let paramId = data.id
          let temperature = Temp
          let parames1 = {
            consult_id,
            temperature
          }

          healthstatus(paramId, petVitalId, parames1)
            .then(res => {
              if (res.code === 10004 && res.msg === 'ezyvet token失效') {
                storage.connectionKey = res.newToken;
                reupdataEzyvet(Temp, petVitalId)
                return
              }
              if (res.flag) {
                message.success('Data successfully saved in EzyVet')
              } else {
                message.error('Data failed saved in EzyVet')
              }
            })
            .catch(err => {
              message.error('Data failed saved in EzyVet')
            })
        } else {
          message.error('Failed to obtain the latest medical record, the data is saved in Mella')
        }
      })
      .catch(err => {
        message.error('Failed to obtain the latest medical record, the data is saved in Mella')
      })
  }
  const reupdataEzyvet = (Temp, petVitalId) => {
    let params = {
      id: patientId
    }

    ezyvetGetPetLatestExam(params)
      .then(res => {
        if (res.flag && res.data && res.data.items.length > 0) {
          let data = res.data.items[0]

          let { consult_id } = data
          if (!consult_id) {
            message.error('Failed to obtain the latest medical record, the data is saved in Mella')
            return
          }
          let paramId = data.id
          let temperature = Temp
          let parames1 = {
            consult_id,
            temperature
          }

          healthstatus(paramId, petVitalId, parames1)
            .then(res => {
              if (res.flag) {
                message.success('Data successfully saved in EzyVet')
              } else {
                message.error('Data failed saved in EzyVet')
              }
            })
            .catch(err => {
              message.error('Data failed saved in EzyVet')
            })
        } else {
          message.error('Failed to obtain the latest medical record, the data is saved in Mella')
        }
      })
      .catch(err => {
        message.error('Failed to obtain the latest medical record, the data is saved in Mella')
      })
  }
  const updataVetspire = (Temp) => {
    let datas = {
      APIkey: storage.connectionKey,
      patientId: patientId
    }
    vetspireGetPetLatestExam(datas)
      .then(res => {
        if (res.flag) {
          let data = res.data.encounters[0].vitals
          let encountersId = data.id
          let temperature = parseInt((Temp * 1.8 + 32) * 10) / 10
          let params = {
            vitalId: encountersId,
            APIkey: storage.connectionKey,
            temp: temperature
          }

          updateVitalsTemperatureByVitalId(params)
            .then(res => {
              if (res.flag) {
                message.success('Data successfully saved in Vetspire')
              } else {
                message.error('Data failed saved in Vetspire')
              }
            })
            .catch(err => {
              message.error('Data failed saved in Vetspire')
            })
        } else {
          message.error('Failed to obtain the latest medical record, the data is saved in Mella')
        }
      })
      .catch(err => {
        message.error('Failed to obtain the latest medical record, the data is saved in Mella')
      })
  }

  useEffect(() => {
    getPetTemperatureData();
    return () => { };
  }, [petMessage]);

  useEffect(() => {
    let hardSet = electronStore.get(`${storage.userId}-hardwareConfiguration`);
    if (hardSet) {
      let { isHua } = hardSet;
      setIsHua(isHua);
    }
  }, []);

  return (
    <>
      <div className="measurementBox">
        <div className="progress" style={{ height: px(400) }}>
          <Progress
            type="dashboard"
            percent={_.round(mellaMeasureValue, 1)}
            gapDegree={30}
            // width={px(260)}
            strokeWidth={"8"}
            format={(percent) => ProgressTitle(percent)}
            strokeColor={{
              "0%": "#7bd163",
              "100%": "#19ade4",
            }}
            className="measurementProgress"
          />
          {!saveType && (
            <div className="buttonBox">
              <Button
                style={{ backgroundColor: "#e1206d" }}
                type="danger"
                shape="round"
                onClick={() => backConnectedPage()}
              >
                Discard
              </Button>
              <Button
                style={{ backgroundColor: "#e1206d" }}
                type="danger"
                shape="round"
                color="#e1206d"
                onClick={() => saveData()}
              >
                Save
              </Button>
            </div>
          )}
        </div>

        <div className="listTitleBox1">
          <p className="listTitle">History</p>
        </div>
        <div className="table" style={{ height: mTop(300) }}>
          <Table
            rowKey={"examId"}
            columns={columns}
            dataSource={petTemperatureData}
            className="measuredTable"
            pagination={false}
            scroll={{
              // y: hisHe,
              y: '80%'
            }}
          ></Table>
        </div>
      </div>
      {/*修改note弹窗 */}
      <Modal
        title={
          <div
            style={{
              width: "100%",
              cursor: "move",
              height: "20px",
              textAlign: "center",
            }}
            onMouseOver={() => {
              if (disabled) {
                setDisabled(false);
              }
            }}
            onMouseOut={() => {
              setDisabled(true);
            }}
            onFocus={() => { }}
            onBlur={() => { }}
          >
            Edit Note
          </div>
        }
        visible={visible}
        onCancel={handleCancel}
        modalRender={(modal) => (
          <Draggable
            disabled={disabled}
            bounds={bounds}
            onStart={(event, uiData) => onStart(event, uiData)}
          >
            <div ref={draggleRef}>{modal}</div>
          </Draggable>
        )}
        footer={
          [] // 设置footer为空，去掉 取消 确定默认按钮
        }
        destroyOnClose={true}
      >
        <div className="noteModal">
          <div className="noteModalText">
            <p style={{ width: "80px" }}>Notes</p>
            <textarea
              rows="5"
              cols="40"
              style={{ textIndent: "10px" }}
              // value={petMessages.memo}
              onChange={(val) => {
                setNewMemo(val.target.value);
              }}
            ></textarea>
          </div>
          <div className="btn" style={{ width: "60%" }} onClick={() => save()}>
            Save Changes
          </div>
        </div>
      </Modal>
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
    setMellaConnectStatusFun,
    setMellaMeasureValueFun,
    setMellaPredictValueFun,
    setMellaMeasurePartFun,
  }
)(MeasuredData);
