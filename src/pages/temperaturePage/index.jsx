import React, {
    useEffect,
    useState,
} from 'react';
import { connect } from 'react-redux';
import { Layout, Menu, PageHeader } from 'antd';
import LinkEquipment from './components/linkEquipment';
import Measurement from './components/measurement';
import MeasuredData from './components/measuredData';
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
import './index.less';

const { Content, Header } = Layout;

const TemperaturePage = ({ petMessage, hardwareMessage }) => {
    let { mellaConnectStatus } = hardwareMessage;
    //测量温度中的页面变化
    const changePage = () => {
        switch (mellaConnectStatus) {
            case 'isMeasuring':
                return <Measurement />
            case 'complete':
                return <MeasuredData />
            case 'connected':
                return <LinkEquipment />
            case 'disconnected':
                return <LinkEquipment />
            default:
                break;
        }

    }
    useEffect(() => {

        return (() => { })
    }, [mellaConnectStatus])
    return (
        <Layout className='homeBox'>
            {
                _.isEmpty(petMessage) ?
                    (
                        <div className='chackPatientBox'>
                            <p className='chackPatientTitle'>Select a patient</p>
                        </div>
                    ) : (changePage())
            }
        </Layout>
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
)(TemperaturePage);