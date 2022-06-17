import React, {
    useEffect,
    useState,
} from 'react';
import { Image, Layout } from 'antd';
import { connect } from 'react-redux';
import ScanChip from './../../../assets/img/ScanChip.png';
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
            <Content className={"contentBox"}>
                <div className='startBox'>
                    <p className='startTitle'>Scan Pet's Microchip</p>
                    <img src={ScanChip}></img>
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