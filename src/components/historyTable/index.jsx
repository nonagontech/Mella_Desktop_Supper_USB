import React, { useEffect, useState } from "react";
import {
  Table,
  Badge,
  Modal,
  Popconfirm,
  message,
} from "antd";

import measuredTable_1 from "./../../assets/img/measuredTable_1.png";
import measuredTable_2 from "./../../assets/img/measuredTable_2.png";
import measuredTable_3 from "./../../assets/img/measuredTable_3.png";
import EditCircle from "./../../assets/img/EditCircle.png";
import Delete from "./../../assets/img/Delete.png";

import { mTop } from "../../utils/px";
import electronStore from "../../utils/electronStore";
import { deletePetExamByExamId, getPetExamByPetId, updatePetExam } from "../../api";

import { connect } from "react-redux";
import {
  selectHardwareModalShowFun,
  petSortTypeFun,
  petDetailInfoFun,
  setMellaConnectStatusFun,
  setMellaMeasureValueFun,
  setMellaPredictValueFun,
  setMellaMeasurePartFun,
} from "../../store/actions";
import Draggable from "react-draggable";
import moment from "moment";
import _ from "lodash";
import { useThrottleFn, useDebounceFn, useDebounceEffect } from 'ahooks';

import "./index.less";

const HistoryTable = ({
  petMessage,
  hardwareMessage,
  setMellaConnectStatusFun,
  saveNum = 0,
  tableColumnType, //表格内容渲染temperature为温度表格，weight为体重表格
}) => {
  let { petId } = petMessage;
  let storage = window.localStorage;
  let draggleRef = React.createRef();
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
  const [reRender, setReRender] = useState(0);
  const [isHua, setIsHua] = useState(true);
  const [loading, setLoading] = useState(false);//加载
  const [petData, setPetData] = useState([]); //存储宠物历史数据
  const [pageSize, setPageSize] = useState(10); // 每页10条
  const [total, setTotal] = useState(0);//历史数据的总条数
  const [currPage, setCurrPage] = useState(1);//页码
  const [isMore, setIsMore] = useState(true); // 是否还有数据 false-已经到底
  //体重表格渲染
  const weightColumns = [
    {
      title: "Data",
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
      title: "Weight",
      dataIndex: "weight",
      ellipsis: true,
      align: "center",
      render: (text, record) => (
        <Badge color={color()} text={_.toNumber(text).toFixed(1)} />
      ),
    },

    {
      // title: "BF%",
      // dataIndex: "fat",
      title: "Impedance",
      dataIndex: "impedance",



      key: "fat",
      ellipsis: true,
      align: "center",
      render: (text, record, index) => {
        return <p style={{ textAlign: "center", color: "#58BDE6" }}>{text}</p>;
      },
    },
    {
      title: "BCS",
      dataIndex: "bodyConditionScore",
      key: "bodyConditionScore",
      ellipsis: true,
      align: "center",
      render: (text, record, index) => {
        return <p style={{ textAlign: "center", color: "#58BDE6" }}>{text}</p>;
      },
    },
    {
      title: "Note",
      dataIndex: "memo",
      ellipsis: true,
      align: "center",
      render: (text, record) => text,
    },
    {
      title: "Action",
      key: "action",
      ellipsis: true,
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
            className="operationIcon"
            src={EditCircle}
            onClick={() => {
              setVisible(true);
              setPetMessages(record);
            }}
          />
          <Popconfirm
            title="Sure to delete?"
            onConfirm={() => deletePetMessage(record.examId)}
          >
            <img src={Delete} />
          </Popconfirm>
        </div>
      ),
    },
  ];
  //温度表格渲染
  const TemperatureColumns = [
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

        return <Badge color={color(text)} text={num} />;
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
      title: "Action",
      key: "action",
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
            style={{ cursor: "pointer" }}
            src={EditCircle}
            onClick={() => {
              setVisible(true);
              setPetMessages(record);
            }}
          />
          <Popconfirm
            title="Sure to delete?"
            onConfirm={() => deletePetMessage(record.examId)}
          >
            <img style={{ cursor: "pointer" }} src={Delete} />
          </Popconfirm>
        </div>
      ),
    },
  ];
  //选择表格colum渲染
  const columType = () => {
    switch (tableColumnType) {
      case "temperature":
        return TemperatureColumns;
      case "weight":
        return weightColumns;
      default:
        break;
    }
  };
  //判断指示文字颜色
  const color = (data) => {
    if (_.toNumber(data) > 40) {
      return "#e1206d";
    } else if (_.inRange(_.round(_.toNumber(data)), 38, 40)) {
      return "#58bde6";
    } else {
      return "#98da86";
    }
  };
  //获取历史宠物数据
  const { run: getPetTemperatureData } = useDebounceFn((currPage) => {
    setLoading(true);
    let params = {
      pageSize: pageSize,
      currPage: currPage,
      deviceType: tableColumnType === "temperature" ? 0 : 1,
    }
    getPetExamByPetId(petId, params)
      .then((res) => {
        setLoading(false);
        setTotal(res.data.totalCount);
        if (res.flag === true) {
          let newArr = [];
          if (currPage === 1) {
            newArr = res.data.list;
          } else {
            let oldArr = petData;
            let arr = res.data.list;
            newArr = [...oldArr, ...arr];
          }
          setPetData(_.orderBy(newArr, 'createTime', 'desc'));
        }
      })
      .catch((err) => {
        setLoading(false);
      });
  }, { wait: 0 });

  //保存note
  const save = () => {
    let datas = {
      memo: newMemo,
    };
    updatePetExam(petMessages.examId, datas)
      .then((res) => {
        setVisible(false);
        getPetTemperatureData(1);
      })
      .catch((err) => {
        setVisible(false);
        console.log(err);
      });
  };
  //删除历史记录
  const deletePetMessage = (examId) => {
    deletePetExamByExamId(examId, '')
      .then(
        (res) => {
          if (res.flag === true) {
            message.success("Successfully Delete");
            getPetTemperatureData(1);
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
  //滚动监听
  const onScrollCapture = () => {
    // 滚动的容器
    let tableEleNodes = document.querySelectorAll(`.historyTableStyle .ant-table-body`)[0];
    //是否滚动到底部
    let bottomType = Math.round(tableEleNodes?.scrollTop) + tableEleNodes?.clientHeight === tableEleNodes?.scrollHeight;
    if (bottomType) {
      if (total === petData.length) {
        return false;
      }
      setCurrPage(currPage + 1);
      getPetTemperatureData(currPage + 1);
    }
  }

  useDebounceEffect(() => {
    setCurrPage(1);
    setPetData([]);
    setTotal(0);
    getPetTemperatureData(1);
  }, [petId], { wait: 0 });

  useEffect(() => {
    if (reRender !== saveNum) {
      setCurrPage(1);
      setPetData([]);
      setTotal(0);
      setReRender(saveNum);
      getPetTemperatureData(1);
    }
    return () => { };
  }, [saveNum]);

  useEffect(() => {
    let hardSet = electronStore.get(`${storage.userId}-hardwareConfiguration`);
    if (hardSet) {
      let { isHua } = hardSet;
      setIsHua(isHua);
    }
    return (() => { });
  }, []);

  return (
    <div className="tableContainer" onScrollCapture={onScrollCapture}>
      <Table
        rowKey={"examId"}
        columns={columType()}
        dataSource={petData}
        pagination={false}
        loading={loading}
        scroll={{
          y: '80%'
        }}
        className="historyTableStyle"
      />
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
        open={visible}
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
    setMellaConnectStatusFun,
    setMellaMeasureValueFun,
    setMellaPredictValueFun,
    setMellaMeasurePartFun,
  }
)(HistoryTable);
