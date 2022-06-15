import React, {
    useEffect,
    useState,
} from 'react';
import { connect } from 'react-redux';
import { Layout, Menu, PageHeader } from 'antd';
import LinkEquipment from './components/linkEquipment';
import Measurement from './components/measurement';
import MeasuredData from './components/measuredData';
import { selectHardwareModalShowFun, petSortTypeFun, petDetailInfoFun } from '../../store/actions';
import _ from 'lodash';
import './index.less';

const { Content, Header } = Layout;

const TemperaturePage = ({ petMessage }) => {

    return (
        <Layout className='homeBox'>
            {
                _.isEmpty(petMessage) ? (
                    <div className='chackPatientBox'>
                        <p className='chackPatientTitle'>Select a patient</p>
                    </div>
                ) : (
                    <LinkEquipment />
                )
            }
            {/* <Measurement/> */}
            {/* <MeasuredData/> */}
        </Layout>
    );
};

export default connect(
    state => ({
        petMessage: state.petReduce.petDetailInfo
    }),
    { selectHardwareModalShowFun, petSortTypeFun, petDetailInfoFun }
)(TemperaturePage);