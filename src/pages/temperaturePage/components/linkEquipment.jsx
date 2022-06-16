import React, {
    useEffect,
    useState,
} from 'react';
import { Image, Layout } from 'antd';
import { connect } from 'react-redux';
import PressButton_Pro from './../../../assets/img/PressButton_Pro.png';
import AxillaryPlacement from './../../../assets/img/AxillaryPlacement.png';
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
// import HeaderItem from './headerItem';
import './linkEquipment.less';

const { Content, Header } = Layout;

const LinkEquipment = ({ petMessage, hardwareMessage }) => {
    let { mellaConnectStatus } = hardwareMessage;
    return (
        <>
            {/* <HeaderItem /> */}
            <Content className={"contentBox"}>
                {
                    _.isEqual(mellaConnectStatus, 'disconnected') ?
                        (
                            <div className='startBox'>
                                <p className='startTitle'>Turn on your<br />Mella Thermometer<br />or Pair New Mella</p>
                                <img src={PressButton_Pro}></img>
                            </div>
                        ) :
                        (
                            <div className='startBox'>
                                <p className='startTitle'>Ready, place under foreleg</p>
                                <img src={AxillaryPlacement}></img>
                                <div className='bottomTip'>
                                    <p className='tipTitle'>Need Help With Accurate Placement On Pet?</p>
                                </div>
                            </div>
                        )
                }
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