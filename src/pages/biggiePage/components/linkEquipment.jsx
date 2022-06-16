import React, {
    useEffect,
    useState,
} from 'react';
import { Image, Layout } from 'antd';
import { connect } from 'react-redux';
import PressButton_Pro from './../../../assets/img/PressButton_Pro.png';
import biggieonscale from './../../../assets/img/biggieonscale.png';
import {
    selectHardwareModalShowFun,
    petSortTypeFun,
    petDetailInfoFun,
    setMellaConnectStatusFun,
    setMellaMeasureValueFun,
    setMellaPredictValueFun,
    setMellaMeasurePartFun
} from '../../../store/actions';
import _ from 'lodash';
import './linkEquipment.less';

const { Content, Header } = Layout;

const LinkEquipment = ({ petMessage, hardwareMessage }) => {
    let { mellaConnectStatus } = hardwareMessage;
    return (
        <>
            {/* <HeaderItem /> */}
            <Content className={"contentBox"}>
                <div className='startBox'>
                    <img src={biggieonscale}></img>
                    <p className='startTitle'>Ready, place under foreleg</p>
                </div>
            </Content>
        </>
    );
}
export default connect(
    state => ({
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
        setMellaMeasurePartFun
    }
)(LinkEquipment);