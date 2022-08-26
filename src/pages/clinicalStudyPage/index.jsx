import React, { useEffect, useRef, useState, useCallback } from "react";
import { Layout, message, Input, Modal, Table, Popconfirm, Select } from "antd";
import { LoadingOutlined } from "@ant-design/icons";

import edit from "./../../assets/images/edit.png";
import del from "./../../assets/images/del.png";
import start from "./../../assets/img/start.png";
import placement_gang from "./../../assets/images/placement_gang.png";
import placement_er from "./../../assets/images/placement_er.png";
import palcement_ye from "./../../assets/images/palcement_ye.png";

import HeaderItem from "./../temperaturePage/components/headerItem";
import { px, mTop } from "../../utils/px";
import electronStore from "../../utils/electronStore";
import UnassignModal from './../../components/UnassignModal/UnassignModal';
import SelectPet from "../../components/selectPetModal";
import AddPetModal from "../../components/addPetModal";
import {
  addAllClinical,
  deletePetExamByExamId,
  getClinicalDataByExamId,
  getPetExamAndClinicalByPetId,
  getPetExamByDoctorId,
  updatePetExam,
  updatePetInfo,
  addAndSavePetExam,
  addDeskPet,
} from "../../api";

import { connect } from "react-redux";
import { setTest } from "../../store/actions";
import ReactECharts from "echarts-for-react";
import propTypes from "prop-types";
import moment from "moment";
import Draggable from "react-draggable";
import _ from "lodash";

import "./index.less";


let resyncDeviceIsClick = true; //用于控制多次点击重新配对按钮
let storage = window.localStorage;

let mellaMeasureNumCopy = 0;

//定义echarts的数据个数
const { Option } = Select;
let saveHistoryTime = null;
const ClinicalStudy = ({
  bodyHeight,
  mellaConnectStatus,
  mellaMeasureValue,
  mellaMeasureNum,
  petDetailInfo,
  setTest,
  biggieBodyWeight,
  biggieUnit,
}) => {
  const [units, setUnits] = useState("");
  const [temperature, setTemp] = useState(0);
  const [showHistoryEchart, setShowHistoryEchart] = useState(false);
  const [echarsData, setEcharsData] = useState({
    Eci: [],
    wen0: [],
    wen1: [],
  });
  const [echarsData1, setEcharsData1] = useState({
    Eci: [],
    wen0: [],
    wen1: [],
  });
  const [mellaStatus, setMellaStatus] = useState("disconnected");
  const [roomTemperature, setRoomTemperature] = useState("");
  const [referenceRectalTemperature, setReferenceRectalTemperature] =
    useState("");
  const [bodyConditionScore, setBodyConditionScore] = useState("");
  const [furLength, setFurLength] = useState("");
  const [heartRate, setHeartRate] = useState("");
  const [bloodPressure, setBloodPressure] = useState("");
  const [respiratoryRate, setRespiratoryRate] = useState("");
  const [notes, setNotes] = useState("");
  const [isPetCharacteristics, setIsPetCharacteristics] = useState(false);
  const [historyData, setHistoryData] = useState([]);
  const [editRectal, setEditRectal] = useState("");
  const [editRoomTemperature, setEditRoomTemperature] = useState("");
  const [editHeartRate, setEditHeartRate] = useState("");
  //定义变量 editBloodPressure,  editRespiratoryRate, editVisible: true, editId: key, memo: record.note, editBodyConditionScore, editFurLength
  const [editBloodPressure, setEditBloodPressure] = useState("");
  const [editRespiratoryRate, setEditRespiratoryRate] = useState("");
  const [editVisible, setEditVisible] = useState(false);
  const [editId, setEditId] = useState("");
  const [editMemo, setEditMemo] = useState("");
  const [editBodyConditionScore, setEditBodyConditionScore] = useState("");
  const [editFurLength, setEditFurLength] = useState("");
  const [tipSpin, setTipSpin] = useState(false);
  const [tip, setTip] = useState("");
  const [loading, setLoading] = useState(false);
  const [disabled, setDisabled] = useState(true);
  const [bounds, setBounds] = useState({
    left: 0,
    top: 0,
    bottom: 0,
    right: 0,
  });
  const [memo, setMemo] = useState("");
  const [windowWidth, setWindowWidth] = useState(px(500));
  const [WeightValue, setWeightValue] = useState('');
  const echartsElement = useRef(null);
  const clinicalRef = useRef(null);
  const [assignVisible, setAssignVisible] = useState(false);
  const [seleceEmergencies, setSeleceEmergencies] = useState({});
  const [lastWorkplaceId, setLastLastWorkplaceId] = useState('');
  const [selectPetVisible, setSelectPetVisible] = useState(false);//选择宠物弹窗显隐
  const [addPetVisible, setAddPetVisible] = useState(false);//添加新宠物弹窗显隐
  const [selectPetModalLoading, setSelectPetModalLoading] = useState(false);//分配宠物后调用接口加载
  const [addPetModalLoading, setAddPetModalLoading] = useState(false);//添加新宠物调用接口加载

  //分辨率变化
  const chartsBox = useCallback((node) => {
    if (node !== null && echartsElement.current) {
      setTimeout(() => {
        echartsElement.current.getEchartsInstance().resize({ height: px(380) });
      }, 1000)
    }
  }, [window.screen.availWidth]);
  //窗口宽高变化
  const resize = () => {
    if (clinicalRef.current && clinicalRef.current.offsetWidth) {
      setWindowWidth(clinicalRef.current.offsetWidth);
    }
  };
  const addClinical = () => {
    console.log("调用接口进行保存数据");
    let emerData = [];
    let { Eci, wen0, wen1 } = echarsData;
    for (let i = 0; i < wen0.length; i++) {
      const element = wen0[i];
      let str = {
        data0: element,
        data1: wen1[i],
      };
      emerData.push(str);
    }

    saveHistoryTime && clearTimeout(saveHistoryTime);
    saveHistoryTime = setTimeout(() => {
      let BCS =
        bodyConditionScore === "" ? null : parseFloat(bodyConditionScore);
      let hrartR = heartRate === "" ? null : parseFloat(heartRate);
      let respireatoryR =
        respiratoryRate === "" ? null : parseFloat(respiratoryRate);

      let roomT =
        roomTemperature === ""
          ? null
          : ((parseFloat(roomTemperature) - 32) / 1.8).toFixed(2);

      let referenceT =
        referenceRectalTemperature === ""
          ? null
          : ((parseFloat(referenceRectalTemperature) - 32) / 1.8).toFixed(2);

      let furL = furLength === "" ? null : parseFloat(furLength);

      let petVitalId = 1;

      let datas = {
        temperature: parseFloat(temperature), //测量温度
        roomTemperature: roomT, //室温
        bodyConditionScore: BCS, //身体状况评分
        heartRate: hrartR, //心率
        respiratoryRate: respireatoryR, //呼吸率
        referenceRectalTemperature: referenceT, //参考腹部温度
        furLength: furL, //毛发长度
        bloodPressure: bloodPressure, //血压
        memo: notes,
        petVitalTypeId: petVitalId,
        clinicalDataEntityList: emerData,
        anusTemperature: referenceT
      };
      if (storage.roleId === `1`) {
        datas.userId = storage.userId;
      } else {
        datas.doctorId = storage.userId;
        datas.userId = storage.userId;
      }
      let ubdateWeight = units === "℉" ? (WeightValue / 2).toFixed(2) : WeightValue.toFixed(2);
      let updatePetInfoData = {

        weight: ubdateWeight
      }
      if (storage.lastOrganization) {
        updatePetInfoData.organizationId = storage.lastOrganization
      }

      let { petId, isWalkIn } = petDetailInfo;
      if (petId && !isWalkIn) {
        datas.petId = petId;
        console.log("入参数据:", datas);
        addAllClinical(datas)
          .then((res) => {
            console.log(res);

            if (res.flag === true) {
              console.log("上传成功");
              message.success("Uploaded successfully");
              _getHistory11(petDetailInfo.petId);
            } else {
              console.log("上传失败");

              message.error("upload failed");
            }
          })
          .catch((err) => {
            console.log(err);
            message.error("upload failed");
          });
      } else if (isWalkIn) {
        console.log("温度数据保存入参：", datas);

        addAllClinical(datas)
          .then((res) => {
            if (res.flag === true) {
              message.success("Uploaded successfully");

              _getEmergencyHistory();
            } else {
              console.log("上传失败");
              message.error("upload failed");
            }
          })
          .catch((err) => {
            console.log(err);
            message.error(err);
          });
      }
      if (WeightValue !== '') {

        updatePetInfo(petId, updatePetInfoData)
          .then((res) => {
            if (res.flag === true) {

            } else {
              message.error('Failed to update pet weight');
            }
          })
          .catch(err => {
            console.log(err);
          })
      }
    }, 500);
  };
  const _getHistory11 = (petId) => {
    let historys = [];
    setLoading(true);
    getPetExamAndClinicalByPetId(petId)
      .then((res) => {
        setLoading(false);
        if (res.flag === true) {
          let datas = res.data;
          for (let i = datas.length - 1; i >= 0; i--) {
            let data = datas[i];

            let {
              petId,
              examId,
              clinicalDatagroupId,
              userId,
              petVitalTypeId,
              temperature,
              roomTemperature,
              bloodPressure,
              memo,
              bodyConditionScore,
              heartRate,
              respiratoryRate,
              referenceRectalTemperature,
              furLength,
              createTime,
              clinicalDataEntity,
              modifiedTime,
            } = data;

            if (!clinicalDatagroupId) {
              continue;
            }
            let Tem = temperature;
            if (clinicalDataEntity) {
              Tem = Tem || clinicalDataEntity.data0;
            }
            Tem = Tem ? Tem : 0;

            let time = null;
            if (
              modifiedTime &&
              `${modifiedTime}` !== "" &&
              `${modifiedTime}` !== `undefined`
            ) {
              time = modifiedTime;
            } else {
              time = createTime;
            }
            let json = {
              time,
              Temp: Tem,
              placement: petVitalTypeId,
              note: memo,
              historyId: examId,
              bodyConditionScore,
              heartRate,
              respiratoryRate,
              referenceRectalTemperature,
              furLength,
              roomTemperature,
              bloodPressure,
              petId,
              userId,
            };
            historys.push(json);
          }
          let historyData = [];
          for (let i = 0; i < historys.length; i++) {
            let history = historys[i];
            let {
              bodyConditionScore,
              heartRate,
              respiratoryRate,
              referenceRectalTemperature,
              furLength,
              roomTemperature,
              bloodPressure,
              petId,
              userId,
              examId,
            } = history;
            // console.log('--------', history.placement);
            let placement = history.placement;
            if (placement === null || placement === "") {
              placement = 1;
            }
            let str = {
              date: moment(history.time).format("MMM DD"),
              time: moment(history.time).format("hh:mm A"),
              temp: history.Temp,
              placement,
              note: history.note,
              historyId: history.historyId,
              bodyConditionScore,
              heartRate,
              respiratoryRate,
              referenceRectalTemperature,
              furLength,
              roomTemperature,
              bloodPressure,
              petId,
              userId,
              key: examId,
            };
            historyData.push(str);
          }
          // this.setState({
          //     historyData
          // })
          setHistoryData(historyData);
        }
      })
      .catch((err) => {
        setLoading(false);
        console.log(err);
      });
  };
  const _getEmergencyHistory = () => {
    //封装的日期排序方法
    function ForwardRankingDate(data, p) {
      for (let i = 0; i < data.length - 1; i++) {
        for (let j = 0; j < data.length - 1 - i; j++) {
          if (Date.parse(data[j][p]) < Date.parse(data[j + 1][p])) {
            var temp = data[j];
            data[j] = data[j + 1];
            data[j + 1] = temp;
          }
        }
      }
      return data;
    }
    let historys = [];
    setLoading(true);

    getPetExamByDoctorId(storage.userId)
      .then((res) => {
        setLoading(false);
        if (res.flag === true) {
          let datas = res.data;
          for (let i = datas.length - 1; i >= 0; i--) {
            if (datas[i].petId === null) {
              let {
                petId,
                examId,
                userId,
                petVitalTypeId,
                temperature,
                roomTemperature,
                bloodPressure,
                memo,
                clinicalDatagroupId,
                bodyConditionScore,
                heartRate,
                respiratoryRate,
                referenceRectalTemperature,
                furLength,
                createTime,
                clinicalDataEntity,
              } = datas[i];
              let Tem = temperature;
              try {
                Tem = temperature || clinicalDataEntity.data0;
              } catch (error) {
                console.log("抛出的异常", error);
              }

              let str = {
                clinicalDatagroupId,
                createTime,
                date: moment(createTime).format("MMM DD"),
                time: moment(createTime).format("hh:mm A"),
                temp: parseInt(Tem * 10) / 10,
                placement: petVitalTypeId,
                note: memo,
                historyId: examId,
                bodyConditionScore,
                heartRate,
                respiratoryRate,
                referenceRectalTemperature,
                furLength,
                roomTemperature,
                bloodPressure,
                petId,
                userId,
              };

              historys.push(str);
            }
          }

          //把所有数据拿完后做个排序

          let historyData = ForwardRankingDate(historys, "createTime");
          console.log("historyData:", historyData);
          setHistoryData(historyData);
        }
      })
      .catch((err) => {
        setLoading(false);
        console.log(err);
      });
  };
  const getOption = () => {
    let option = {};
    try {
      let min, max;
      if (units === "℃") {
        min = 25;
        max = 45;
      } else {
        min = 75;
        max = 115;
      }
      let { Eci, wen0, wen1 } = _.isEmpty(echarsData1.Eci)
        ? echarsData
        : echarsData1;
      option = {
        color: ["#81b22f"],
        tooltip: {
          /*返回需要的信息*/
          trigger: "axis",
          triggerOn: "mousemove",
          enterable: true,
          formatter: function (param) {
            var value = param[0].value;
            // console.log('---valuez值', value, units);
            if (
              (units === "℉" && parseInt(value) <= 32) ||
              (units === "℃" && parseInt(value) == 0)
            ) {
              return `<div style="border-bottom: 1px solid rgba(255,255,255,.3); font-size: 16px;padding-bottom: 7px;margin-bottom: 7px;">Temp:--</div>`;
            }
            return `<div style="border-bottom: 1px solid rgba(255,255,255,.3); font-size: 16px;padding-bottom: 7px;margin-bottom: 7px;">Temp:${value.toFixed(
              1
            )}${units}</div>`;
          },
        },
        xAxis: {
          name: "SPL",
          nameLocation: "end",
          nameTextStyle: {
            align: "left",
          },
          type: "category",
          data: Eci,
          axisLine: {
            lineStyle: {
              // 设置x轴颜色
              color: "#A0A0A0",
              show: true,
            },
          },
          // 设置X轴数据旋转倾斜
          axisLabel: {
            rotate: 0, // 旋转角度
            interval: 29, //设置X轴数据间隔几个显示一个，为0表示都显示
          },
        },
        yAxis: {
          name: "temperature",
          type: "value",
          min, // 设置y轴刻度的最小值
          max, // 设置y轴刻度的最大值
          splitNumber: 0, // 设置y轴刻度间隔个数
          nameTextStyle: {
            padding: [0, 0, 0, 8],
            // backgroundColor: 'pink',
            width: "1200px",
            // fontSize: 20,
            align: "left",
          },

          axisLine: {
            lineStyle: {
              // 设置x轴颜色
              color: "#A0A0A0",
              show: true,
            },
          },
          splitLine: {
            show: false,
          },
        },
        series: [
          {
            name: "模拟数据",
            type: "line",
            showSymbol: false,
            hoverAnimation: false,
            // data: [44, 40, 34, 29, 31, 33, 39, 39, 33, 25, 26, 32, 38, 39, 25, 30, 37],
            data: wen0,
            smooth: 0.5,
            symbol: "none",
            // itemStyle: {
            //     normal: {

            //     }
            // }
            lineStyle: {
              // 系列级个性化折线样式
              width: 2,
              type: "solid",
              color: {
                type: "linear",
                x: 0,
                y: 1,
                x2: 0,
                y2: 0,
                colorStops: [
                  {
                    offset: 0.5,
                    color: "#47C2ED", // 0% 处的颜色  蓝
                  },
                  {
                    offset: 1,
                    color: "#78D35D", // 50% 处的颜色  绿
                  },
                  // {
                  //   offset: 1, color: 'red' // 100% 处的颜色   红
                  // }
                ],
                globalCoord: false, // 缺省为 false
              },
            },
          },
        ],
      };
    } catch (error) { }

    return option;
  };
  const _status = () => {
    let text = "",
      unit = "",
      temColor = "";
    let Temp = parseFloat(temperature);
    if (mellaConnectStatus === "disconnected") {
      if (!showHistoryEchart) {
        Temp = "";
        text = "disconnected";
        temColor = "#3B3A3A";
      } else {
        text = "disconnected";
        temColor = "#3B3A3A";
      }
    } else if (mellaConnectStatus === "connected") {
      Temp = "";
      text = "connected";
      temColor = "#3B3A3A";
    } else {
      text = "connected";
      temColor = "#3B3A3A";
      if (Temp > 15) {
        unit = units;
        if (Temp > 39) {
          text = "High";
          temColor = "#E1206D";
        } else if (Temp < 31) {
          text = "Low";
          temColor = "#47C2ED";
        } else {
          text = "Normal";
          temColor = "#78D35D";
        }
      }
    }
    let temp = null;

    if (`${Temp}` !== "NaN" && Temp) {
      temp =
        units === "℉" ? parseInt((Temp * 1.8 + 32) * 10) / 10 : Temp.toFixed(1);
    }
    let lowFlog = false;
    if (unit === "℃") {
      if (temp < 24.8) {
        lowFlog = true;
      }
    } else {
      if (temp < 76.6) {
        lowFlog = true;
      }
    }

    return (
      <div
        className="Tem"
        style={{
          color: temColor,
          right: px(100),
          bottom: mTop(120),
          pointerEvents: "none",
        }}
      >
        {mellaConnectStatus !== "isMeasuring" ? (
          showHistoryEchart ? (
            <>
              <span style={{ fontSize: px(46), fontWeight: "bold" }}>
                {temp}{" "}
                <sup style={{ fontSize: px(28), fontWeight: "bold" }}>
                  {units}
                </sup>
              </span>
              <br />
              {/* <span style={{ fontSize: px(22) }}>{text}</span> */}

              <span
                style={{
                  fontSize: px(32),
                  color: "#8a8a8a",
                  fontWeight: "bold",
                }}
              >{`History`}</span>
            </>
          ) : (
            <>
              <span style={{ fontSize: px(46), fontWeight: "bold" }}>
                {temp < 3 && !temp ? null : temp}{" "}
                <sup style={{ fontSize: px(28), fontWeight: "bold" }}>
                  {unit}
                </sup>
              </span>
              <br />
              <span style={{ fontSize: px(32), fontWeight: "bold" }}>
                {text}
              </span>
            </>
          )
        ) : lowFlog ? (
          <>
            <span style={{ fontSize: px(46), fontWeight: "bold" }}>
              {"Low"}
            </span>
            <br />
          </>
        ) : (
          <>
            <span style={{ fontSize: px(46), fontWeight: "bold" }}>
              {temp}{" "}
              <sup style={{ fontSize: px(28), fontWeight: "bold" }}>{unit}</sup>
            </span>
            <br />
          </>
        )}
      </div>
    );
  };
  const handleChange = (index) => {
    console.log("---------", index);
    setFurLength(index);
  };
  const _petCharacteristics = () => {
    let placeholder = "";
    switch (`${furLength}`) {
      case "1":
        placeholder = "smooth";
        break;
      case "2":
        placeholder = "short";
        break;
      case "3":
        placeholder = "medium";
        break;
      case "4":
        placeholder = "long";
        break;
      default:
        break;
    }
    // console.log('------', WeightValue);

    return (
      <div
        className="petChaeacteristics"
        style={{ paddingLeft: px(10), paddingRight: px(10), height: "100%" }}
      >
        <div className="child">
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              position: "relative",
            }}
          >
            <p style={{ width: "150px" }}>Room Temperature: </p>
            <Input
              className="inp"
              // style={{ border: 'none', outline: 'medium' }}
              // style={{ width: px(105), height: mTop(33), fontSize: px(18), marginRight: px(6) }}
              value={roomTemperature}
              bordered={false}
              onChange={(item) => {
                let str = item.target.value
                  .replace(/[^\d^\.]+/g, "")
                  .replace(/\.{2,}/g, ".")
                  .replace(".", "$#$")
                  .replace(/\./g, "")
                  .replace("$#$", ".")
                  .replace(/^(\-)*(\d+)\.(\d\d).*$/, "$1$2.$3");
                setRoomTemperature(str);
              }}
              suffix={'℉'}
              maxLength={8}
            />
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              position: "relative",
            }}
          >
            <p style={{ width: "150px" }}>Reference Rectal Temperature: </p>
            <Input
              className="inp"
              // style={{ border: 'none', outline: 'medium' }}

              value={`${referenceRectalTemperature}`}
              bordered={false}
              onChange={(item) => {
                let str = item.target.value
                  .replace(/[^\d^\.]+/g, "")
                  .replace(/\.{2,}/g, ".")
                  .replace(".", "$#$")
                  .replace(/\./g, "")
                  .replace("$#$", ".")
                  .replace(/^(\-)*(\d+)\.(\d\d).*$/, "$1$2.$3");
                setReferenceRectalTemperature(str);
              }}
              suffix={'℉'}
              maxLength={8}
            />
          </div>
        </div>
        <div className="child">
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <p style={{ width: "150px" }}>Body Condition Score: </p>
            <Input
              className="inp"
              style={{ border: "none", outline: "medium" }}
              value={bodyConditionScore}
              bordered={false}
              onChange={(item) => {
                let str = item.target.value
                  .replace(/[^\d^\.]+/g, "")
                  .replace(/\.{2,}/g, ".")
                  .replace(".", "$#$")
                  .replace(/\./g, "")
                  .replace("$#$", ".")
                  .replace(/^(\-)*(\d+)\.(\d\d).*$/, "$1$2.$3");
                setBodyConditionScore(str);
              }}
              maxLength={8}
            />
          </div>
          <div className="furLength">
            <p style={{ width: "150px" }}>Fur Length: </p>
            <Select
              className="inpSelect"
              placeholder
              onChange={handleChange}
              style={{
                // width: "105px",
                borderRadius: "40px",
                // height: "33px",
                outline: "none",
                borderWidth: 0,
              }}
              value={placeholder}
            >
              <Option value="1">smooth</Option>
              <Option value="2">short</Option>
              <Option value="3">medium</Option>
              <Option value="4">long</Option>
            </Select>
          </div>
        </div>
        <div className="child">
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              position: "relative",
            }}
          >
            <p style={{ width: "150px" }}>Heart Rate: </p>
            <Input
              className="inp"
              style={{ border: "none", outline: "medium" }}
              value={`${heartRate}`}
              bordered={false}
              onChange={(item) => {
                let str = item.target.value
                  .replace(/[^\d^\.]+/g, "")
                  .replace(/\.{2,}/g, ".")
                  .replace(".", "$#$")
                  .replace(/\./g, "")
                  .replace("$#$", ".")
                  .replace(/^(\-)*(\d+)\.(\d\d).*$/, "$1$2.$3");
                setHeartRate(str);
              }}
              suffix={'bpm'}
              maxLength={8}
            />
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              position: "relative",
            }}
          >
            <p style={{ width: "150px" }}>Blood Pressure: </p>
            <Input
              className="inp"
              style={{ border: "none", outline: "medium" }}
              value={bloodPressure}
              bordered={false}
              onChange={(item) => {
                let str = item.target.value
                  .replace(/[^\d^\.]+/g, "")
                  .replace(/\.{2,}/g, ".")
                  .replace(".", "$#$")
                  .replace(/\./g, "")
                  .replace("$#$", ".")
                  .replace(/^(\-)*(\d+)\.(\d\d).*$/, "$1$2.$3");
                setBloodPressure(str);
              }}
              suffix={'mm'}
              maxLength={8}
            />
          </div>
        </div>
        <div className="child">
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              position: "relative",
            }}
          >
            <p style={{ width: "150px" }}>Respiratory Rate: </p>
            <Input
              className="inp"
              style={{ border: "none", outline: "medium" }}
              value={`${respiratoryRate}`}
              bordered={false}
              onChange={(item) => {
                let str = item.target.value
                  .replace(/[^\d^\.]+/g, "")
                  .replace(/\.{2,}/g, ".")
                  .replace(".", "$#$")
                  .replace(/\./g, "")
                  .replace("$#$", ".")
                  .replace(/^(\-)*(\d+)\.(\d\d).*$/, "$1$2.$3");
                setRespiratoryRate(str);
              }}
              suffix={'bpm'}
              maxLength={8}
            />
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', position: 'relative' }}>
            <p style={{ width: '150px' }}>Weight:  </p>
            <Input className='inp'
              style={{ border: 'none', outline: 'medium' }}
              value={WeightValue}
              bordered={false}
              onChange={(item) => {
                let str = item.target.value.replace(/[^\d^\.]+/g, '').replace(/\.{2,}/g, ".").replace(".", "$#$").replace(/\./g, "").replace("$#$", ".").replace(/^(\-)*(\d+)\.(\d\d).*$/, '$1$2.$3')
                setWeightValue(str);
              }}
              suffix={units === '℉' ? 'lb' : 'kg'}
              maxLength={8}
            />
          </div>
        </div>
      </div>
    );
  };
  const _history = () => {
    const _del = (key, record) => {
      deletePetExamByExamId(key)
        .then(
          (res) => {
            if (res.flag === true) {
              const historyData1 = [...historyData];
              setHistoryData(
                historyData1.filter((item) => item.historyId !== key)
              );
            } else {
              message.error('fail to delete!');
            }
          }
        );
    };
    const _edit = (key, record) => {
      let {
        heartRate,
        bloodPressure,
        respiratoryRate,
        referenceRectalTemperature,
        roomTemperature,
        bodyConditionScore,
        furLength,
        note,
      } = record;
      let editHeartRate =
        heartRate !== null && heartRate !== undefined ? heartRate : "";
      let editBloodPressure =
        bloodPressure !== null && bloodPressure !== undefined
          ? bloodPressure
          : "";
      let editRespiratoryRate =
        respiratoryRate !== null && respiratoryRate !== undefined
          ? respiratoryRate
          : "";
      let editRectal =
        referenceRectalTemperature !== null &&
          referenceRectalTemperature !== undefined
          ? (referenceRectalTemperature * 1.8 + 32).toFixed(1)
          : "";
      let editRoomTemperature =
        roomTemperature !== null && roomTemperature !== undefined
          ? (roomTemperature * 1.8 + 32).toFixed(1)
          : "";
      let editBodyConditionScore =
        bodyConditionScore !== null && bodyConditionScore !== undefined
          ? bodyConditionScore
          : "";
      let editFurLength = furLength;
      let mome = note ? note : "";

      console.log(
        editRectal,
        editRoomTemperature,
        editHeartRate,
        editBloodPressure,
        editRespiratoryRate
      );

      //更新editRectal,editRoomTemperature,editHeartRate,editBloodPressure,editRespiratoryRate,editVisible: true,editId: key,memo: record.note,editBodyConditionScore,editFurLength
      setEditRectal(editRectal);
      setEditRoomTemperature(editRoomTemperature);
      setEditHeartRate(editHeartRate);
      setEditBloodPressure(editBloodPressure);
      setEditRespiratoryRate(editRespiratoryRate);
      setEditVisible(true);
      setEditId(key);
      setEditMemo(record.note);
      setEditBodyConditionScore(editBodyConditionScore);
      setEditFurLength(editFurLength);
      setMemo(mome);
    };
    const see = (id, record) => {
      setEcharsData1({
        Eci: [],
        wen0: [],
        wen1: [],
      });
      console.log(id, record);
      setTip("data is loading");
      setTipSpin(true);
      getClinicalDataByExamId(id)
        .then((res) => {
          setTip("");
          setTipSpin(false);
          if (res.flag) {
            let datas = res.data.clinicalDataEntityList;
            if (datas) {
              let echarsData = {
                Eci: [],
                wen0: [],
                wen1: [],
              };
              let { wen0, wen1, Eci } = echarsData;
              for (let i = 0; i < datas.length; i++) {
                let { data0, data1 } = datas[i];

                Eci.push(i);
                if (units === "℃") {
                  wen0.push(data0);
                  wen1.push(data1);
                } else {
                  wen0.push(data0 * 1.8 + 32);
                  wen1.push(data1 * 1.8 + 32);
                }
              }
              let Temp = datas[datas.length - 1].data0 || "";
              setEcharsData(echarsData);
              setTemp(Temp);
              setShowHistoryEchart(true);
            }
          }
        })
        .catch((err) => {
          setTip("");
          setTipSpin(false);
          console.log(err);
        });
    };
    const isflog = window.screen.height < 1000 ? true : false;
    const columns = [
      {
        title: "",
        dataIndex: "operation",
        key: "operation",
        className: `${isflog ? "operation" : ""}`,

        render: (text, record, index) => {
          return (
            <div
              className="activeImageBox"
              style={{
                display: "flex",
              }}
            >
              <Popconfirm
                title="Sure to delete?"
                onConfirm={() => _del(record.historyId, record)}
              >
                <img src={del} alt="" className="activeImages" />
              </Popconfirm>
              {petDetailInfo.isWalkIn ? (
                <div
                  className="assign"
                  style={{
                    fontSize: px(14),
                  }}
                  onClick={() => {
                    setSelectPetVisible(true);
                    setSeleceEmergencies(record);
                    setLastLastWorkplaceId(storage.lastOrganization);
                  }}
                >
                  Assign
                </div>
              ) : (
                <>
                  <img
                    src={edit}
                    alt=""
                    // style={{ width: px(25) }}
                    onClick={() => _edit(record.historyId, record)}
                    className="activeImages"
                  />

                  <img
                    src={start}
                    alt=""
                    // style={{ width: px(25) }}
                    onClick={() => see(record.historyId, record)}
                    className="activeImages"
                  />
                </>
              )}
            </div>
          );
        },
      },
      {
        title: "Date",
        dataIndex: "date",
        key: "date",
        className: `${isflog ? "operation" : ""}`,
        ellipsis: true,
        align: "center",
        render: (text, record, index) => {
          return <p style={{ textAlign: "center" }}>{text}</p>;
        },
      },
      {
        title: "Time",
        dataIndex: "time",
        key: "time",
        className: `${isflog ? "operation" : ""}`,
        ellipsis: true,
        align: "center",
        render: (text, record, index) => {
          return <p style={{ textAlign: "center" }}>{text}</p>;
        },
      },
      {
        title: `Temp(${units})`,
        // title: `Temp(℉)`,
        key: "temp",
        dataIndex: "temp",
        className: `${isflog ? "operation" : ""}`,
        ellipsis: true,
        align: "center",
        render: (text, record, index) => {
          // console.log(text, record);

          /**
           * bag：温度数值前的圆圈的背景颜色
           * tem：展示的温度
           * endvalue:将从后台得到的数据全部转化成华氏度
           * min：猫的正常体温的左区间,单位℉，后期要做的猫狗都行，这需要告诉我此宠物是猫还是狗
           * max：猫的正常体温的右区间,单位℉，后期要做的猫狗都行，这需要告诉我此宠物是猫还是狗
           *
           */

          let bag = "",
            tem = "";

          let endValue =
            text > 55 ? text : parseInt((text * 1.8 + 32) * 10) / 10;
          let min = 100.4,
            max = 102.56;

          if (endValue > max) {
            bag = "#E1206D";
          } else if (endValue < min) {
            bag = "#98DA86";
          } else {
            bag = "#58BDE6";
          }

          if (units === "℃") {
            if (text) {
              tem = `${text}${units}`;
              if (text > 55) {
                tem = `${((text - 32) / 1.8).toFixed(1)}${units}`;
              } else {
                tem = `${text.toFixed(1)}${units}`;
              }
            }
          } else {
            if (text) {
              if (text > 55) {
                tem = `${text}${units}`;
              } else {
                tem = `${parseInt((text * 1.8 + 32) * 10) / 10}${units}`;
              }
            }
          }
          return (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {tem ? (
                <div
                  style={{
                    width: "8px",
                    height: "8px",
                    borderRadius: "8px",
                    backgroundColor: bag,
                    marginRight: "3px",
                  }}
                />
              ) : null}
              <p style={{ margin: 0, padding: 0 }}>{tem}</p>
            </div>
          );
        },
      },
      {
        title: `Rectal Temperature`,
        key: "referenceRectalTemperature",
        dataIndex: "referenceRectalTemperature",
        className: `${isflog ? "operation" : ""}`,
        ellipsis: true,
        align: "center",
        render: (text, record, index) => {
          // console.log('肛温的值：', text);
          let num = text;
          if (text !== null) {
            num = (text * 1.8 + 32).toFixed(1);
          }

          return (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {text !== null && (
                <p style={{ margin: 0, padding: 0 }}>
                  {num} <span>{"℉"}</span>
                </p>
              )}
            </div>
          );
        },
      },
      {
        title: "Placement",
        dataIndex: "placement",
        key: "placement",
        align: "center",
        className: `${isflog ? "operation" : ""}`,
        ellipsis: true,
        align: "center",
        render: (text, record, index) => {
          switch (record.placement) {
            case 1:
              return (
                //腋温
                <div>
                  <img src={palcement_ye} alt="" />
                </div>
              );
            case 3:
              return (
                //肛温
                <div>
                  <img src={placement_gang} alt="" />
                </div>
              );
            case 2:
              return (
                //肛温
                <div>
                  <img src={placement_gang} alt="" />
                </div>
              );
            case 4:
              return (
                //耳温
                <div>
                  <img src={placement_er} alt="" />
                </div>
              );
            default:
              return null;
          }
        },
      },
      {
        title: "Note",
        dataIndex: "note",
        key: "note",
        className: `${isflog ? "operation" : ""}`,
        ellipsis: true,
        align: "center",
        render: (text, record, index) => {
          return <p style={{ width: "100%" }}>{text}</p>;
        },
      },
    ];

    let hisHe = mTop(200);
    try {
      let historyElement = document.querySelectorAll(
        "#clinicalMeasure11 .historyTable"
      );
      hisHe = historyElement[0].clientHeight - mTop(100);
    } catch (error) { }

    return (
      <div className="historyTable">
        <Table
          columns={columns}
          loading={loading}
          dataSource={historyData}
          rowKey={(columns) => columns.historyId}
          // pagination={{ pageSize: 3, showSizeChanger: false, showQuickJumper: true }}
          pagination={false}
          scroll={{
            // y: hisHe,
            y: '80%'
          }}
        />
      </div>
    );
  };
  const _editModal = () => {
    function save() {
      let datas = {
        memo: memo,
        bodyConditionScore: parseInt(editBodyConditionScore),
        furLength: parseInt(editFurLength),
        heartRate: editHeartRate,
        bloodPressure: editBloodPressure,
        respiratoryRate: editRespiratoryRate,
      };
      if (editRoomTemperature) {
        datas.roomTemperature = (
          (parseFloat(editRoomTemperature) - 32) /
          1.8
        ).toFixed(2);
      }
      if (editRectal) {
        datas.referenceRectalTemperature = (
          (parseFloat(editRectal) - 32) /
          1.8
        ).toFixed(2);
      }

      setEditVisible(false);
      setTip("Data is being modified");
      setTipSpin(true);


      updatePetExam(editId, datas)
        .then((res) => {
          console.log(res);
          setTipSpin(false);
          setTip("");
          message.success("Data modified successfully");

          _getHistory11(petDetailInfo.petId);
        })
        .catch((err) => {
          setTipSpin(false);
          setTip("");

          message.success(" Data modification failed");

          console.log(err);
        });
    }

    let furLength = "";
    if (editFurLength !== null && editFurLength !== undefined) {
      switch (`${editFurLength}`) {
        case "1":
          furLength = "smooth";
          break;
        case "2":
          furLength = "short";
          break;
        case "3":
          furLength = "medium";
          break;
        case "4":
          furLength = "long";
          break;

        default:
          break;
      }
    }

    return (
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
          // end
          >
            Modification history information
          </div>
        }
        visible={editVisible}
        // visible={true}
        onCancel={() => {
          setEditVisible(false);
        }}
        modalRender={(modal) => (
          <Draggable
            disabled={disabled}
            bounds={bounds}
          // onStart={(event, uiData) => this.onStart(event, uiData)}
          >
            <div>{modal}</div>
          </Draggable>
        )}
        footer={
          [] // 设置footer为空，去掉 取消 确定默认按钮
        }
        destroyOnClose={true}
        className="editModalBox"
      >
        <div id="selectEmergenciesModal">
          <div className="selectEmergenciesModal">
            <p style={{ width: "140px" }}>Room Temperature </p>
            <Input
              style={{ border: "none", outline: "medium" }}
              bordered={false}
              value={editRoomTemperature}
              onChange={(item) => {
                let str = item.target.value
                  .replace(/[^\d^\.]+/g, "")
                  .replace(/\.{2,}/g, ".")
                  .replace(".", "$#$")
                  .replace(/\./g, "")
                  .replace("$#$", ".")
                  .replace(/^(\-)*(\d+)\.(\d\d).*$/, "$1$2.$3");

                setEditRoomTemperature(str);
              }}
            />
            <span>℉</span>
          </div>

          <div className="selectEmergenciesModal">
            <p style={{ width: "140px" }}>Rectal Temperature</p>
            <Input
              style={{ border: "none", outline: "medium" }}
              bordered={false}
              value={editRectal}
              onChange={(item) => {
                let str = item.target.value
                  .replace(/[^\d^\.]+/g, "")
                  .replace(/\.{2,}/g, ".")
                  .replace(".", "$#$")
                  .replace(/\./g, "")
                  .replace("$#$", ".")
                  .replace(/^(\-)*(\d+)\.(\d\d).*$/, "$1$2.$3");
                setEditRectal(str);
              }}
            />
            <span>℉</span>
          </div>

          <div className="selectEmergenciesModal">
            <p style={{ width: "140px" }}>Body Condition Score</p>
            <Input
              style={{ border: "none", outline: "medium" }}
              bordered={false}
              value={editBodyConditionScore}
              onChange={(item) => {
                let str = item.target.value.replace(/[^\d]/g, "");

                setEditBodyConditionScore(str);
              }}
            />
          </div>

          <div className="bodyType11">
            <p style={{ width: "140px" }}>Fur Length: </p>
            <Select
              placeholder
              onChange={(index) => {
                console.log(index);
                setEditFurLength(index);
              }}
              style={{
                borderRadius: "40px",
                height: "33px",
                outline: "none",
                borderWidth: 0,
              }}
              value={furLength}
            >
              <Option value="1">smooth</Option>
              <Option value="2">short</Option>
              <Option value="3">medium</Option>
              <Option value="4">long</Option>
            </Select>
          </div>

          <div className="selectEmergenciesModal">
            <p style={{ width: "140px" }}>Heart Rate: </p>
            <Input
              style={{ border: "none", outline: "medium" }}
              bordered={false}
              value={editHeartRate}
              onChange={(item) => {
                let str = item.target.value.replace(/[^\d]/g, "");
                setEditHeartRate(str);
              }}
            />
            <span>bpm</span>
          </div>

          <div className="selectEmergenciesModal">
            <p style={{ width: "140px" }}>Blood Pressure </p>
            <Input
              style={{ border: "none", outline: "medium" }}
              bordered={false}
              value={editBloodPressure}
              onChange={(item) => {
                setEditBloodPressure(item.target.value);
              }}
            />
            <span>mm</span>
          </div>

          <div className="selectEmergenciesModal">
            <p style={{ width: "140px" }}>Respiratory Rate: </p>
            <Input
              style={{ border: "none", outline: "medium" }}
              bordered={false}
              value={editRespiratoryRate}
              onChange={(item) => {
                let str = item.target.value.replace(/[^\d]/g, "");
                setEditRespiratoryRate(str);
              }}
            />
            <span>bpm</span>
          </div>

          <div className="selectEmergenciesModal">
            <p style={{ width: "80px" }}>Notes</p>
            <textarea
              rows="2"
              cols="40"
              style={{ textIndent: "10px" }}
              value={memo}
              onChange={(val) => {
                setMemo(val.target.value);
              }}
            ></textarea>
          </div>

          <div className="btn" onClick={save}>
            Save
          </div>
        </div>
      </Modal>
    );
  };
  const _foot = () => {
    let lbgc = "",
      rbgc = "";
    if (isPetCharacteristics) {
      lbgc = "rgba(25,173,228,0.5)";
      rbgc = "rgba(105,201,237,1)";
    } else {
      lbgc = "rgba(105,201,237,1)";
      rbgc = "rgba(25,173,228,0.5)";
    }
    return (
      <div className="clinical_foot">
        <div className="top">
          <div
            className="foot_l"
            style={{ backgroundColor: lbgc }}
            onClick={() => setIsPetCharacteristics(true)}
          >
            Exam Details
          </div>
          <div
            className="foot_l"
            style={{ backgroundColor: rbgc }}
            onClick={() => setIsPetCharacteristics(false)}
          >
            History
          </div>
        </div>
        {isPetCharacteristics ? _petCharacteristics() : _history()}
      </div>
    );
  };
  //获取本地数据
  const getLocalSetting = () => {
    let settings = {
      isHua: true,
      is15: true,
      self_tarting: false, //自启动
      isBacklight: true,
      isBeep: true,
      backlightTimer: { length: 140, number: "45" },
      autoOff: { length: 0, number: "30" },
    };
    electronStore.set(`${storage.userId}-hardwareConfiguration`, settings);
  };
  //echars渲染
  const echars = () => {
    return (
      <div id="myCharts"
        style={{ width: windowWidth }}
        ref={chartsBox}
      >
        <ReactECharts
          option={getOption()}
          theme="Imooc"
          style={{ height: 'auto', width: 'auto' }}
          notMerge={true}
          lazyUpdate={true}
          ref={echartsElement}
          className="charts"
        />
        {_status()}
      </div>
    );
  };
  //分配宠物walk-in信息
  const assignPet = (value) => {
    setSelectPetModalLoading(true);
    let parmes = {
      petId: value.petId,
      clinicalDatagroupId: seleceEmergencies.clinicalDatagroupId,
    };
    addAndSavePetExam(seleceEmergencies.historyId, parmes)
      .then((res) => {
        setSelectPetModalLoading(false);
        if (res.flag === true) {
          setSelectPetVisible(false);
          message.success("Assigned successfully");
        } else {
          message.error("Assignment failed");
        }
      })
      .catch((err) => {
        setSelectPetModalLoading(false);
        message.error("Assignment failed");
      });
  }
  //添加宠物弹窗显示
  const onAddPet = () => {
    setSelectPetVisible(false);
    setAddPetVisible(true);
  }
  //添加宠物
  const addNewPet = (value) => {
    let data = {
      ...value,
      weight: parseFloat(value.weight).toFixed(2),
    };
    if (storage.lastWorkplaceId) {
      data.workplaceId = storage.lastWorkplaceId
    }
    if (storage.lastOrganization) {
      data.organizationId = storage.lastOrganization
    }
    if (storage.userId) {
      data.doctorId = storage.userId
    }
    setAddPetModalLoading(true);
    addDeskPet(value.patientId, data)
      .then((res) => {
        setAddPetModalLoading(false);
        if (res.flag === true) {

        } else {
          message.error('')
        }
        console.log('res: ', res);
      })
      .catch((err) => {
        setAddPetModalLoading(false);
      })
  }

  useEffect(() => {
    if (petDetailInfo.petId) {
      _getHistory11(petDetailInfo.petId);
    } else if (petDetailInfo.isWalkIn) {
      _getEmergencyHistory();
    }
    return () => { };
  }, [petDetailInfo]);

  useEffect(() => {
    return () => {
      saveHistoryTime && clearTimeout(saveHistoryTime);
    };
  }, []);

  useEffect(() => {
    //react监听屏幕窗口改变
    window.addEventListener("resize", resize);

    return () => {
      window.removeEventListener("resize", resize);
    };
  }, []);

  useEffect(() => {
    mellaMeasureNumCopy = mellaMeasureNum;
    // setTest(echartsElement);
  }, []);

  useEffect(() => {
    if (mellaMeasureNumCopy === mellaMeasureNum) {
      return;
    }
    mellaMeasureNumCopy = mellaMeasureNum;
    // console.log('监听', mellaMeasureValue);
    setTemp(mellaMeasureValue);
    let { Eci, wen0, wen1 } = echarsData;
    //两个数组合并成一个数组
    let EciCopy = [...Eci];

    let win0Copy = [...wen0];
    let wen1Copy = [...wen1];
    EciCopy.push(EciCopy.length + 1);
    win0Copy.push(mellaMeasureValue);
    wen1Copy.push(mellaMeasureValue);
    let json = {
      Eci: EciCopy,
      wen0: win0Copy,
      wen1: wen1Copy,
    };
    setEcharsData(json);
    let Eci1 = echarsData1.Eci;
    let wen01 = echarsData1.wen0;
    let wen11 = echarsData1.wen1;
    let EciCopy1 = [...Eci1];

    let win0Copy1 = [...wen01];
    let wen1Copy1 = [...wen11];
    EciCopy1.push(EciCopy1.length + 1);
    let num =
      units === "℃"
        ? mellaMeasureValue
        : _.floor(mellaMeasureValue * 1.8 + 32, 2);
    win0Copy1.push(num);
    wen1Copy1.push(num);
    let json1 = {
      Eci: EciCopy1,
      wen0: win0Copy1,
      wen1: wen1Copy1,
    };
    setEcharsData1(json1);
    // const option = getOption();
    // echartsElement.current.getEchartsInstance().setOption(option);
    return () => { };
  }, [mellaMeasureNum]);

  useEffect(() => {
    if (mellaConnectStatus === "complete" && echarsData.Eci.length > 10) {
      addClinical();
    }
    if (mellaConnectStatus === "isMeasuring" && mellaStatus !== "isMeasuring") {
      setEcharsData({
        Eci: [],
        wen0: [],
        wen1: [],
      });
      setEcharsData1({
        Eci: [],
        wen0: [],
        wen1: [],
      });
    }
    if (mellaConnectStatus === "isMeasuring") {
      setShowHistoryEchart(false);
    }

    setMellaStatus(mellaConnectStatus);
    return () => { };
  }, [mellaConnectStatus]);

  useEffect(() => {
    let hardSet = electronStore.get(`${storage.userId}-hardwareConfiguration`);
    if (!hardSet) {
      getLocalSetting();
    } else {
      setUnits(hardSet.isHua ? "℉" : "℃");
    }
    return () => { };
  }, []);

  useEffect(() => {
    let bufferData = electronStore.get(`${petDetailInfo.petId}`);
    // console.log('bufferData: ', bufferData);
    setRoomTemperature(bufferData ? bufferData?.roomTemperature : '');
    setReferenceRectalTemperature(bufferData ? bufferData?.referenceRectalTemperature : '');
    setBodyConditionScore(bufferData ? bufferData?.bodyConditionScore : '');
    setFurLength(bufferData ? bufferData?.furLength : '');
    setHeartRate(bufferData ? bufferData?.heartRate : '');
    setBloodPressure(bufferData ? bufferData?.bloodPressure : '');
    setRespiratoryRate(bufferData ? bufferData?.respiratoryRate : '');
    setWeightValue(bufferData ? bufferData?.WeightValue : '');
    return (() => { })
  }, [petDetailInfo.petId]);

  useEffect(() => {
    return () => {
      let newData = {
        roomTemperature: roomTemperature,
        referenceRectalTemperature: referenceRectalTemperature,
        bodyConditionScore: bodyConditionScore,
        furLength: furLength,
        heartRate: heartRate,
        bloodPressure: bloodPressure,
        respiratoryRate: respiratoryRate,
        WeightValue: WeightValue
      }
      electronStore.set(`${petDetailInfo.petId}`, newData);
    }
  }, [roomTemperature, referenceRectalTemperature, bodyConditionScore, furLength, heartRate, bloodPressure, respiratoryRate, WeightValue, petDetailInfo.petId])

  useEffect(() => {
    if (biggieBodyWeight !== 0) {
      if (units === '℉') {
        setWeightValue((biggieBodyWeight * 2).toFixed(2));
      } else {
        setWeightValue(biggieBodyWeight.toFixed(2));
      }


    }
    return (() => { })
  }, [biggieBodyWeight])


  return (
    <>
      <div
        id="clinical"
        style={{
          height: bodyHeight,
          minWidth: px(200),
          minHeight: bodyHeight,
          overflow: "hidden",
        }}
        ref={clinicalRef}
      >
        <div
          className="headerContentBox"
          style={{ background: "#fff", position: "relative" }}
        >
          <Layout style={{ height: "100%" }}>
            <HeaderItem timeNum={60} />
          </Layout>
        </div>
        <div
          className="clinicalBody"
          style={{ width: "100%", height: bodyHeight - px(100) }}
        >
          <div className="clinical_top">
            <div className="r">
              {/*顶部按钮Re-sync Base*/}
              {mellaConnectStatus === "disconnected" && (
                <div className="bb1">
                  <div
                    className="btn78"
                    onClick={() => {
                      if (resyncDeviceIsClick === true) {
                        resyncDeviceIsClick = false;
                        let ipcRenderer = window.electron.ipcRenderer;
                        ipcRenderer.send("qiehuan");
                        const time = setTimeout(() => {
                          resyncDeviceIsClick = true;
                          clearTimeout(time);
                        }, 2500);
                      }
                    }}
                  >
                    Re-sync Base
                  </div>
                </div>
              )}
              {echars()}
              {/* 底部宠物信息 */}
              {_foot()}
              {_editModal()}
              {tipSpin && (
                // true &&
                <div className="modal">
                  <div className="loadIcon" style={{ marginBottom: px(5) }}>
                    <LoadingOutlined
                      style={{
                        fontSize: 30,
                        color: "#fff",
                        marginTop: mTop(-30),
                      }}
                    />
                  </div>
                  <p>data is loading...</p>
                </div>
              )}
            </div>
          </div>
        </div>
        {
          selectPetVisible && (
            <SelectPet
              visible={selectPetVisible}
              destroyOnClose
              width={400}
              onCancel={() => setSelectPetVisible(false)}
              onSelect={(value) => {
                assignPet(value);
              }}
              onAddPet={() => onAddPet()}
              onLoading={selectPetModalLoading}
            />
          )
        }
        {
          addPetVisible && (
            <AddPetModal
              visible={addPetVisible}
              destroyOnClose
              width={400}
              onCancel={() => {
                setAddPetVisible(false);
                setSelectPetVisible(true);
              }}
              onConfirm={(value) => {
                console.log('value: ', value);
                addNewPet(value);
              }}
              onLoading={addPetModalLoading}
            />
          )
        }
      </div>
    </>
  );
};

ClinicalStudy.propTypes = {
  bodyHeight: propTypes.number,
};
ClinicalStudy.defaultProps = {
  bodyHeight: 0,
};
export default connect(
  (state) => ({
    mellaConnectStatus: state.hardwareReduce.mellaConnectStatus,
    mellaMeasureValue: state.hardwareReduce.mellaMeasureValue,
    mellaMeasureNum: state.hardwareReduce.mellaMeasureNum,
    biggieBodyWeight: state.hardwareReduce.biggieBodyWeight,
    biggieUnit: state.hardwareReduce.biggieUnit,
    petDetailInfo: state.petReduce.petDetailInfo,
  }),
  { setTest }
)(ClinicalStudy);
