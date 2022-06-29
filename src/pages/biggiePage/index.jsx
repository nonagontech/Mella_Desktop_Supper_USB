import React, { useEffect, useState } from "react";
import { Layout, message } from "antd";
import Biggie from "./Biggie";
import _ from "lodash";
import { connect } from "react-redux";
import { setBiggieConnectStatusFun } from "../../store/actions";
import HeaderItem from "./../temperaturePage/components/headerItem";
import HistoryTable from "../../components/historyTable";
import LinkEquipment from "./components/linkEquipment";
import "./biggiePage.less";
import { px } from "../../utils/px";
import { fetchRequest } from "../../utils/FetchUtil1";
import MyModal from "../../utils/myModal/MyModal";

const { Header, Content, Footer, Sider } = Layout;
let storage = window.localStorage;

const BiggirPage = ({
  hardwareReduce,
  setBiggieConnectStatusFun,
  petReduce,
}) => {
  let { petDetailInfo } = petReduce;
  let { biggieBodyWeight } = hardwareReduce;
  //定义体重值 体脂值 体重单位 连接状态
  const [weight, setWeight] = useState(0);
  const [saveNum, setSaveNum] = useState(0);
  const [fat, setFat] = useState(0);
  const [unit, setUnit] = useState("kg");
  const [connectStatus, setConnectStatus] = useState("disconnected");
  const [isSavePMS, setIsSavePMS] = useState(false);
  const [saveLoad, setSaveLoad] = useState(false);
  const [isHaveSaveBtn, setIsHaveSaveBtn] = useState(true);

  const _saveWeight = () => {
    let params = {
      petId: petDetailInfo.petId,
      doctorId: storage.userId,
      weight: weight,
      memo: "",
      fat,
      bodyConditionScore: null,
    };
    setSaveLoad(true);
    console.log("---体重保存入参--：", params);
    fetchRequest("/exam/addClamantPetExam", "POST", params)
      .then((res) => {
        setSaveLoad(false);
        console.log("res", res);
        if (res.flag === true) {
          switch (storage.lastOrganization) {
            default:
              message.success("Data successfully saved in Mella");
              break;
          }
          setSaveNum(saveNum + 1);
          setIsHaveSaveBtn(false);
          // this._getHistory()
        }
      })
      .catch((err) => {
        console.log(err);
        setSaveLoad(false);
      });
  };

  useEffect(() => {
    let isSave = storage.connectionKey ? false : true;
    setIsSavePMS(isSave);
    return() => {}
  }, []);
  useEffect(() => {
    let {
      biggieConnectStatus,
      biggieBodyFat,
      biggieBodyWeight,
      biggieUnit,
      biggieSameWeightCount,
    } = hardwareReduce;
    setConnectStatus(biggieConnectStatus);
    setFat(biggieBodyFat);
    setUnit(biggieUnit);
    if (biggieUnit === "lb") {
      biggieBodyWeight = biggieBodyWeight * 2;
    }
    setWeight(biggieBodyWeight);
    if (biggieSameWeightCount === 6) {
      let ipcRenderer = window.require("electron").ipcRenderer;
      ipcRenderer.send("keyboardWriting", weight);
    }

    return () => {};
  }, [hardwareReduce]);

  useEffect(() => {
    setIsHaveSaveBtn(true);
    return () => {};
  }, [biggieBodyWeight]);

  return (
    <>
      <Layout className="biggiePage">
        <HeaderItem />
        <Content className="biggieContentBox">
          {_.isEmpty(petDetailInfo) ? (
            <div className="chackPatientBox">
              <p className="chackPatientTitle">Select a patient</p>
            </div>
          ) : connectStatus === "isMeasuring" ? (
            <div className="biggbody">
              <div className="biggieTopBox" style={{ width: px(470) }}>
                <Biggie
                  weight={weight}
                  bodyFat={fat}
                  score={5}
                  impedance={fat}
                  isIbs={unit === "lb"}
                  onPress={_saveWeight}
                  discardOnPress={() =>
                    setBiggieConnectStatusFun("disconnected")
                  }
                  issave={isSavePMS}
                  isHaveSaveBtn={isHaveSaveBtn}
                />
              </div>
              <div className="biggeTitleBox">
                <p className="biggeTitle">History</p>
              </div>
              <div className="biggeTableBox">
                <HistoryTable saveNum={saveNum} />
              </div>
            </div>
          ) : (
            <div className="biggbody">
              <LinkEquipment />
            </div>
          )}
        </Content>
      </Layout>
      <MyModal visible={saveLoad} />
    </>
  );
};

export default connect(
  (state) => ({
    hardwareReduce: state.hardwareReduce,
    petReduce: state.petReduce,
  }),
  {
    setBiggieConnectStatusFun,
  }
)(BiggirPage);
