import React, { useEffect, useState } from "react";
import { Layout, message } from "antd";

import { connect } from "react-redux";
import { setBiggieConnectStatusFun } from "../../store/actions";

import HeaderItem from "./../temperaturePage/components/headerItem";
import HistoryTable from "../../components/historyTable";
import LinkEquipment from "./components/linkEquipment";
import Biggie from "./components/Biggie";

import { px } from "../../utils/px";
import MyModal from "../../utils/myModal/MyModal";

import PropTypes from 'prop-types';
import _ from "lodash";

import "./index.less";
import { ezyvetGetPetLatestExam, ezyvetUpdateWeight, vetspireGetPetLatestExam, vetspireUpdateWeight } from "../../api";
import { addClamantPetExam } from '../../api/mellaserver/exam'


const { Header, Content, Footer, Sider } = Layout;
let storage = window.localStorage;

const BiggirPage = ({
  hardwareReduce,
  setBiggieConnectStatusFun,
  petReduce,
  bodyHeight,
}) => {
  let { petDetailInfo } = petReduce;
  let { biggieBodyWeight } = hardwareReduce;
  //定义体重值 体脂值 体重单位 连接状态
  const [weight, setWeight] = useState(0);
  const [impedance, setImpedance] = useState(null)
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
      fat: null,
      bodyConditionScore: null,
      impedance: impedance ? impedance : null
    };
    setSaveLoad(true);
    addClamantPetExam(params)
      .then((res) => {
        setSaveLoad(false);
        if (res.flag === true) {
          switch (storage.lastOrganization) {
            case '3'://vetspire
              updataWeightVetspire()
              break;
            case '4'://ezyVet
              updataWeightEzyvet()
              break;
            default:
              message.success("Data successfully saved in Mella");
              break;
          }
          setSaveNum(saveNum + 1);
          setIsHaveSaveBtn(false);
        }
      })
      .catch((err) => {
        console.log(err);
        setSaveLoad(false);
      });
  };
  const updataWeightVetspire = () => {
    let datas = {
      APIkey: storage.connectionKey,
      patientId: petDetailInfo.patientId,
    }
    vetspireGetPetLatestExam(datas)
      .then(res => {
        if (res.flag) {
          let data = res.data.encounters[0].vitals
          let encountersId = data.id
          let params = {
            vitalId: encountersId,
            APIkey: storage.connectionKey,
            weight: unit === 'kg' ? (weight * 2.2046).toFixed(1) : weight
          }
          vetspireUpdateWeight(params)
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
          message.error('Failed to obtain the latest medical record')
        }
      })
      .catch(err => {
        message.error('Failed to obtain the latest medical record')
      })

  }
  const updataWeightEzyvet = () => {
    let params = {
      id: petDetailInfo.patientId
    }


    ezyvetGetPetLatestExam(params)
      .then(res => {
        if (res.code === 10004 && res.msg === 'ezyvet token失效') {
          storage.connectionKey = res.newToken;
          reUpdataWeightEzyvet();
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
          let parames1 = {
            consult_id,
            weight: unit === 'kg' ? weight : (weight / 2.2046).toFixed(2)
          }

          ezyvetUpdateWeight(paramId, parames1)
            .then(res => {
              if (res.code === 10004 && res.msg === 'ezyvet token失效') {
                storage.connectionKey = res.newToken;
                reUpdataWeightEzyvet();
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
          message.error('Failed to obtain the latest medical record')
        }
      })
      .catch(err => {
        message.error('Failed to obtain the latest medical record')
      })
  }

  const reUpdataWeightEzyvet = () => {
    let params = {
      id: petDetailInfo.patientId
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
          let parames1 = {
            consult_id,
            weight: unit === 'kg' ? weight : (weight / 2.2046).toFixed(2)
          }
          ezyvetUpdateWeight(paramId, parames1)
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
          message.error('Failed to obtain the latest medical record')
        }
      })
      .catch(err => {
        message.error('Failed to obtain the latest medical record')
      })
  }

  useEffect(() => {
    let isSave = storage.connectionKey ? false : true;
    setIsSavePMS(isSave);
    return () => { };
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
    setImpedance(biggieBodyFat)
    setUnit(biggieUnit);
    if (biggieUnit === "lb") {
      biggieBodyWeight = biggieBodyWeight * 2;
    }
    setWeight(biggieBodyWeight);
    if (biggieSameWeightCount === 6) {
      // let ipcRenderer = window.require("electron").ipcRenderer;
      let ipcRenderer = window.electron.ipcRenderer;
      ipcRenderer.send("keyboardWriting", weight);
    }

    return () => { };
  }, [hardwareReduce]);

  useEffect(() => {
    setIsHaveSaveBtn(true);
    return () => { };
  }, [biggieBodyWeight]);
  //宠物变了,要设置为未连接
  useEffect(() => {
    setBiggieConnectStatusFun("disconnected")
  }, [petDetailInfo]);

  return (
    <>
      <Layout className="biggiePage" style={{ height: bodyHeight }}>
        <div className="headerContentBox" style={{ background: "#fff", position: 'relative' }}>
          <div style={{ height: '100%' }}>
            <HeaderItem />
          </div>
        </div>
        <Content className="biggieContentBox">
          {_.isEmpty(petDetailInfo) ? (
            <>
              <div className="chackPatientBox">
                <p className="chackPatientTitle">Select a patient</p>
              </div>
            </>
          ) : connectStatus === "isMeasuring" ? (
            <div className="biggbody">
              <div className="biggieTopBox">
                <Biggie
                  weight={weight}
                  bodyFat={fat ? 5 : 0}
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
            </div>
          ) : (
            <LinkEquipment />
          )}
          {
            !_.isEmpty(petDetailInfo) && (
              <div className="bottomContent">
                <div className="biggeTitleBox">
                  <p className="biggeTitle">History</p>
                </div>
                <HistoryTable saveNum={saveNum} tableColumnType='weight' />
              </div>
            )
          }
        </Content>
      </Layout>
      <MyModal visible={saveLoad} />
    </>
  );
};

BiggirPage.propTypes = {
  bodyHeight: PropTypes.number,
  devicesTypeList: PropTypes.array
}

export default connect(
  (state) => ({
    hardwareReduce: state.hardwareReduce,
    petReduce: state.petReduce,
  }),
  {
    setBiggieConnectStatusFun,
  }
)(BiggirPage);
