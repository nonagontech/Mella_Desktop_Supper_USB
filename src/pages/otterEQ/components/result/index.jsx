import React, { useEffect, useState, useRef } from "react";
import { Layout, Button, Input, Radio } from "antd";
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


let storage = window.localStorage;

const Result = ({ petMessage, cutPageType, setQsmTimeType, qsmMessage }) => {
    const [value, setValue] = useState(1);

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
                    name: petName,
                    dob: birthday,
                    species,
                }
                let pet_owner = {
                    // id:userId||storage.userId
                    id: userId,
                    name: firstName,
                    family_name: lastName,
                    phone
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
        let practice_id = storage.lastOrganization;
        const SDK = require("qsm-otter-sdk");
        console.log('入参：', { qsmPart, API_KEY, ACCESS_TOKEN, user_id, practice_id, pet_owner, pet, test });
        try {
            const res = await SDK.runMeasurement(qsmPart, API_KEY, ACCESS_TOKEN, user_id, practice_id, pet_owner, pet, test)
            console.log("🚀 ~ file: index.jsx ~ line 112 ~ RunMeasurement ~ res", res)
        } catch (error) {
         console.log(error)
        }

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
        <>
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
        </>
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
