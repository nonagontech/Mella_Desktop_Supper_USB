import React, { useEffect, useState, useRef } from "react";
import { Layout, Button, Input, Radio, message } from "antd";
import { px } from "../../../../utils/px";
import { connect } from "react-redux";
import {
    selectHardwareModalShowFun,
    petSortTypeFun,
    petDetailInfoFun,
    setQsmTimeType
} from "../../../../store/actions";

import swirl from "../../../../assets/img/swirl.png";
import BreakSeal from "../../../../assets/img/Break-Seal.png";
import label from "../../../../assets/img/label.png";
import Incubator from "../../../../assets/img/Incubator.png";

import overnight from "../../../../assets/img/overnight.png";
import rapid from "../../../../assets/img/rapid.png";
import addSwab from "../../../../assets/images/addSwab.png";
import test1 from "../../../../assets/images/test1.png";
import success from "../../../../assets/images/success.png";



import moment from "moment";
import _ from "lodash";
import "./index.less";
import MyModal from "../../../../utils/myModal/MyModal";


let storage = window.localStorage;

const Result = ({ petMessage, cutPageType, setQsmTimeType, qsmMessage }) => {
    const [value, setValue] = useState(1);
    const [visible, setVisible] = useState(false)

    const cutTitle = () => {
        switch (value) {
            case 1:
                return (<>{`${'Insert new swab and '}`}<br />{`${'collect sample'}`}</>);
            case 2:
                return (<>{`${'Put new swab sample'}`}<br />{`${'to sensor'}`} </>);
            case 3:
                return (<>{`${'Test complete!'}`} </>);
            default:
                break;
        }
    }


    const cutImage = () => {
        switch (value) {
            case 1:
                return <img src={addSwab} alt="" style={{ width: px(287 / 420 * 514), height: px(287) }} />;
            case 2:
                return <img src={test1} alt="" style={{ width: px(287 / 566 * 682), height: px(287) }} />;
            case 3:
                return <img src={success} alt="" style={{ width: px(287), height: px(287) }} />;
            default:
                break;
        }
    }

    const onClick = () => {

        switch (value) {
            case 1: setValue(value + 1); break;

            case 2:
                let { petId, petName, birthday, speciesId, userId, firstName, lastName, phone } = petMessage
                let species = 0
                switch (speciesId) {
                    case 1:
                    case 11001:
                        species = 1; break;
                    default:
                        break;
                }
                let pet = {
                    id: petId,
                    species,
                }
                if (petName) {
                    pet.name = petName;
                }
                if (birthday) {
                    pet.dob = birthday;
                }


                let pet_owner = {
                    id: userId || storage.userId,
                }
                if (firstName) {
                    pet_owner.name = firstName
                }
                if (lastName) {
                    pet_owner.family_name = lastName
                }
                if (phone) {
                    pet_owner.phone = phone
                }


                let { qsmEarPart, qsmTimeType } = qsmMessage
                let kind = qsmEarPart === 1 ? 1 : 0
                let sample_area = qsmTimeType
                let test = {
                    kind,
                    sample_area
                }
                RunMeasurement(pet, pet_owner, test)

                break;
            case 3: cutPageType('linkPage'); break;
            default:
                break;
        }

    }
    const RunMeasurement = async (pet, pet_owner, test) => {
        let { qsmPart } = qsmMessage
        let API_KEY = "EX1QrGQTwPAjkJ0p7EEG7A"
        let ACCESS_TOKEN = "ZQh5q7Uv1UPsC8RY0eDoSf3eYrMzDHxYkJExG13k"
        let user_id = storage.userId;
        console.log("🚀 ~ file: index.jsx ~ line 115 ~ RunMeasurement ~ storage.userId", storage.userId)
        let practice_id = storage.lastOrganization;
        const SDK = require("qsm-otter-sdk");

        let num = 0

        async function runMeasurement() {
            try {
                console.log('入参：', { qsmPart, API_KEY, ACCESS_TOKEN, user_id, practice_id, pet_owner, pet, test, num });
                setVisible(true)
                const res = await SDK.runMeasurement(qsmPart, API_KEY, ACCESS_TOKEN, user_id, practice_id, pet_owner, pet, test)
                // let res = { status: 200 }
                setVisible(false)


                console.log("🚀 ~ file: index.jsx ~ line 112 ~ RunMeasurement ~ res", res)
                if (res.status === 200) {
                    message.success(res.data.message)
                    // qsmPart.close()
                    console.log('关闭弹窗并调到下一页');
                    setValue(3)
                } else {
                    message.error(res.statusText)
                }



            } catch (error) {
                if (`${error}`.indexOf(`Failed to execute 'open' on 'SerialPort': The port is already open.`) !== -1) {
                    if (num < 3) {
                        num++
                        qsmPart.close()
                        setTimeout(() => {
                            runMeasurement()
                        }, 2000);

                    }
                } else {
                    setVisible(false)
                }
                console.error('error', error)
            }
        }
        runMeasurement()


    }
    const btnText = () => {
        switch (value) {
            case 1:
                return 'Next'
            case 2:
                return 'Run Measurement'
            case 3:
                return 'Run New Test'
            default:
                break;
        }
    }
    return (
        <div className="qsmResult">
            <div className="topBox">
                <p className="topTitle" style={{ fontSize: px(40) }}>
                    {cutTitle()}
                </p>
            </div>
            <div className="imageBox">
                {cutImage()}
            </div>
            <div className="bottomBox">
                <Button type="primary" shape="round" style={{ width: px(400), height: px(40) }} onClick={onClick}>{btnText()}</Button>
            </div>
            <MyModal visible={visible} />
        </div>
    );

};

export default connect(
    (state) => ({
        petMessage: state.petReduce.petDetailInfo,
        qsmMessage: state.qsmReduce,
    }),
    {
        selectHardwareModalShowFun,
        petSortTypeFun,
        petDetailInfoFun,
        setQsmTimeType
    }
)(Result);
