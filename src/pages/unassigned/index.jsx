import React, { Component } from "react";
import { Table, Popconfirm, Modal, Input, message, Select, Spin } from "antd";

import Heard from "./../../utils/heard/Heard";
import del from "./../../assets/images/del.png";
import Close from "./../../assets/img/close.png";
import UploadImg from "./../../utils/uploadImg/UploadImg";
import { px, MTop } from "./../../utils/px";
import electronStore from "./../../utils/electronStore";
import MyModal from "./../../utils/myModal/MyModal";
import SelectPetModal from "../../components/selectPetModal";
import AddPetModal from "../../components/addPetModal";

import moment from "moment";
import Draggable from "react-draggable";

import "./index.less";
import {
  getPetExamByDoctorId,
  selectBreedBySpeciesId,
  listAllPetInfo,
  checkPatientId,
  addDeskPet,
  addAndSavePetExam,
  deletePetExamByExamId,
} from './../../api';

let storage = window.localStorage;
const { Option } = Select;

export default class Unassigned extends Component {
  state = {
    historyData: [], //列表的数据集合
    units: "℉",
    searchText: "", //搜索测试记录框输入的内容
    serchExamData: [], //搜索到的测量记录
    seleceEmergencies: {}, //分配的这条记录里的所有内容，比如温度、id、时间等
    visible: false, //nodel框是否显示
    imgId: -1, //上传后返回的图像id号

    assignPatientId: "",
    assignPetName: "",
    assignOwnerName: "",
    assignBreed: "",
    assignBreedId: "",
    assignPetAge: "",
    assignPetWeight: "",
    assignPetId: "",
    assignPetImgUrl: "",
    inputDisabled: false,
    breedArr: [], //猫、狗品种集合
    loading: false,
    disabled: true, //model是否可拖拽
    search: "", //分配宠物搜索框
    petListData: [],
    searchPetList: [],
    assignVisible: false, //点击assign按钮后跳出的选择宠物的弹框
    selectPetId: "",
    modalLoading: false,//控制弹窗加载
    pageSize: 10,//数量
    currPage: 1,//页码
    total: 0,//总数
    deviceType: 0,//未分配类型
    addPetId: '',//添加新宠物的id
    selectPetModalLoading: false,//选择宠物弹窗加载
    addPetVisible: false,//添加宠物弹窗
    addPetModalLoading: false,//添加宠物弹窗加载
  };

  componentDidMount() {
    let ipcRenderer = window.electron.ipcRenderer;
    ipcRenderer.send("big");
    ipcRenderer.on("changeFenBianLv", this.changeFenBianLv);
    let getBreed = electronStore.get("getBreed");
    if (getBreed) {
      this.setState({
        breedArr: getBreed,
      });
    }
    this.setState({
      deviceType: this.props.history.location.deviceType
    }, () => {
      this._getEmergencyHistory(1);
    })
  }
  componentWillUnmount() {
    message.destroy();
    let ipcRenderer = window.electron.ipcRenderer;

    ipcRenderer.removeListener("changeFenBianLv", this.changeFenBianLv);
  }
  changeFenBianLv = (e) => {
    console.log(e);
    let ipcRenderer = window.electron.ipcRenderer;
    let { height, width } = window.screen;
    let windowsHeight = height > width ? width : height;
    ipcRenderer.send("Lowbig");
    this.setState({});
  };
  //获取通过walk-In测量的信息，通过判断获取的数据中petId是否为空来展示数据
  _getEmergencyHistory = (currPage) => {
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
    this.setState({
      loading: true,
    });
    let data = {
      pageSize: this.state.pageSize,
      currPage: currPage,
      deviceType: this.state.deviceType,
    }
    getPetExamByDoctorId(storage.userId, data)
      .then((res) => {
        if (res.flag === true) {
          let datas = res.data.list;
          for (let i = datas.length - 1; i >= 0; i--) {
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
            let day = moment().diff(moment(createTime), "day");
            let Tem = temperature;
            try {
              if (clinicalDataEntity) {
                Tem = temperature || clinicalDataEntity.data0;
              }
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
              day,
            };
            historys.push(str);
          }
          let newArr = [];
          if (this.state.currPage === 1) {
            newArr = historys
          } else {
            let oldArr = this.state.historyData;
            let arr = historys;
            newArr = [...oldArr, ...arr];
          }
          //把所有数据拿完后做个排序
          let historyData = ForwardRankingDate(newArr, "createTime");
          this.setState({
            historyData,
            loading: false,
            total: res.data.totalCount
          });
        } else {
          this.setState({
            loading: false,
          });
        }
      })
      .catch((err) => {
        console.log(err);
        this.setState({
          loading: false,
        });
      });
  };
  _search = (value = "") => {
    let list = this.state.historyData;
    let searchData = [];
    let keyWord = value || this.state.searchText;
    for (let i = 0; i < list.length; i++) {
      let note = list[i].note ? list[i].note.toLowerCase() : "";
      if (`${note}`.indexOf(keyWord.toLowerCase()) !== -1) {
        searchData.push(list[i]);
      }
    }

    this.setState({
      serchExamData: searchData,
    });
  };
  draggleRef = React.createRef();
  //表格滚动
  onScrollCapture = () => {
    // 滚动的容器
    let tableEleNodes = document.querySelectorAll(`.tableStyle .ant-table-body`)[0];
    //是否滚动到底部
    let bottomType = Math.round(tableEleNodes?.scrollTop) + tableEleNodes?.clientHeight === tableEleNodes?.scrollHeight;
    if (bottomType) {
      if (this.state.total === this.state.historyData.length) {
        return false;
      }
      this.setState({
        currPage: this.state.currPage + 1,
      })
      this._getEmergencyHistory(this.state.currPage + 1);
    }
  }
  //选择宠物进行分配
  assignPet = (value) => {
    this.setState({ selectPetModalLoading: true });
    let parmes = {
      petId: value.petId,
      clinicalDatagroupId: this.state.seleceEmergencies.clinicalDatagroupId,
    };
    addAndSavePetExam(this.state.seleceEmergencies.historyId, parmes)
      .then((res) => {
        this.setState({ selectPetModalLoading: false });
        if (res.flag === true) {
          message.success("Assigned successfully");
          this.setState({
            assignVisible: false,
            addPetId: ''
          })
          this._getEmergencyHistory(1);
        } else {
          message.error("Assignment failed");
        }

      })
      .catch((err) => {
        message.error("Assignment failed");
        this.setState({ selectPetModalLoading: false });
      })


  }
  //添加宠物弹窗显示
  onAddPet = () => {
    this.setState({
      addPetId: '',
      addPetVisible: true,
      assignVisible: false,
    })
  }
  //添加新宠物
  addNewPet = (value) => {
    let data = {
      ...value,
      weight: value.weight === '' ? '' : parseFloat(value.weight).toFixed(2),
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
    this.setState({ addPetModalLoading: true }, () => {
      addDeskPet(value.patientId, data)
        .then((res) => {
          this.setState({ addPetModalLoading: false })
          if (res.flag === true) {
            message.success('Adding pets successfully');
            this.setState({
              addPetId: res.data.petId,
              addPetVisible: false,
              assignVisible: true,
            })
          } else {
            message.error('patientId already exists');
          }
        })
        .catch((err) => {
          message.error('system exception');
        })
    });

  }
  //删除分配记录
  deletePetExam = (key, record) => {
    deletePetExamByExamId(key, '')
      .then((res) => {
        if (res.flag === true) {
          const historyData = [...this.state.historyData];
          this.setState({
            historyData: historyData.filter((item) => item.historyId !== key),
          });
        } else {
          message.error('Fail to delete')
        }
      }
      )
      .catch((err) => {
        message.error('system exception');
      })
  }

  render() {
    let { loading, disabled, historyData, searchText, serchExamData } = this.state;

    const columns = [
      {
        title: "",
        dataIndex: "operation",
        key: "operation",
        ellipsis: true,
        align: "center",
        render: (text, record, index) => {
          return (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                margin: `${px(8)}px 0`,
              }}
            >
              <Popconfirm
                title="Sure to delete?"
                onConfirm={() => this.deletePetExam(record.historyId, record)}
              >
                <img src={del} alt="" width={25} style={{ marginRight: "8px" }} />
              </Popconfirm>
            </div>
          );
        },
      },
      {
        title: "Date",
        dataIndex: "date",
        key: "date",
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
        ellipsis: true,
        align: "center",
        render: (text, record, index) => {
          return <p style={{ textAlign: "center" }}>{text}</p>;
        },
      },
      {
        title: " Pet Description",
        dataIndex: "description",
        key: "description",
        ellipsis: true,
        align: "center",
        render: (text, record, index) => {
          return <p style={{ width: "70px" }}>{text}</p>;
        },
      },
      {
        title: "Species",
        dataIndex: "species",
        key: "species",
        render: (text, record, index) => {
          return <p style={{ width: "70px" }}>{text}</p>;
        },
      },
      {
        title: "Note",
        dataIndex: "note",
        key: "note",
        ellipsis: true,
        align: "center",
        render: (text, record, index) => {
          return <p style={{ width: "70px" }}>{text}</p>;
        },
      },

      {
        title: "",
        dataIndex: "assign",
        key: "assign",
        ellipsis: true,
        align: "center",
        render: (text, record, index) => {
          return (
            <div
              className="assign"
              style={{
                fontSize: px(16),
                paddingTop: px(5),
                paddingBottom: px(5),
              }}
              onClick={() => {
                this.setState({
                  assignVisible: true,
                  seleceEmergencies: record,
                });
              }}
            >
              Assign
            </div>
          );
        },
      },
    ];
    let tableData = searchText.length > 0 ? serchExamData : historyData;
    return (
      <div id="unassigned">
        <Heard />
        <div className="body">
          <div
            className="title"
            style={{
              marginTop: px(30),
              fontSize: px(30),
              marginBottom: px(40),
            }}
          >
            Unassigned Measurements
          </div>
          <div className="input" style={{ marginBottom: px(10) }}>
            <input
              type="text"
              placeholder="&#xe628; Search Pet Name or Description"
              value={this.state.searchText}
              onChange={(e) => {
                this.setState({
                  searchText: e.target.value,
                });
                this._search(e.target.value);
              }}
              onKeyUp={(e) => {
                if (e.keyCode === 13) {
                  this._search();
                }
                if (e.keyCode === 27) {
                  this.setState({
                    searchText: "",
                  });
                }
              }}
            />
            <div
              className="searchBtn"
              style={{ height: px(35), fontSize: px(18) }}
              onClick={this._search}
            >
              <p>Search</p>
            </div>
          </div>
          <div className="tableBox" onScrollCapture={() => this.onScrollCapture()}>
            <Table
              style={{
                width: "95%",
              }}
              loading={loading}
              columns={columns}
              dataSource={tableData}
              rowKey={(columns) => columns.historyId}
              pagination={false}
              scroll={{
                // y: MTop(500),
                y: 500
              }}
              className="tableStyle"
            />
          </div>
        </div>
        {
          this.state.assignVisible && (
            <SelectPetModal
              visible={this.state.assignVisible}
              destroyOnClose
              width={400}
              value={this.state.addPetId}
              onCancel={() => {
                this.setState({
                  assignVisible: false,
                  addPetId: ''
                })
              }}
              onAddPet={() => this.onAddPet()}
              onSelect={(value) => {
                this.assignPet(value);
              }}
              onLoading={this.state.selectPetModalLoading}
            />
          )
        }
        {
          this.state.addPetVisible && (
            <AddPetModal
              visible={this.state.addPetVisible}
              destroyOnClose
              width={400}
              onCancel={() => {
                this.setState({
                  addPetVisible: false,
                  assignVisible: true,
                })
              }}
              onConfirm={(value) => {
                this.addNewPet(value);
              }}
              onLoading={this.state.addPetModalLoading}
            />
          )
        }
      </div>
    );
  }
}
