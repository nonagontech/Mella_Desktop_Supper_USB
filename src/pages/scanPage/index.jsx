import React, {
    useEffect,
    useState,
} from 'react';
import { connect } from 'react-redux';
import { Layout, Menu, PageHeader } from 'antd';
import {
    selectHardwareModalShowFun,
    petSortTypeFun,
    petDetailInfoFun,
    setMellaConnectStatusFun,
    setMellaMeasureValueFun,
    setMellaPredictValueFun,
    setMellaMeasurePartFun
} from '../../store/actions';
import _ from 'lodash';
import HeaderItem from '../temperaturePage/components/headerItem';
import LinkEquipment from './components/LinkEquipment';
import ScanPet from './components/scanPet';
import './index.less';

const ScanPage = ({ petMessage, hardwareMessage }) => {
    console.log('petMessage', petMessage);
    let { mellaConnectStatus } = hardwareMessage;
    return (
        <>
            <Layout className='homeBox'>
                <HeaderItem />
                {/* <LinkEquipment/> */}
                <ScanPet />
            </Layout>
        </>
    );
};

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
)(ScanPage);