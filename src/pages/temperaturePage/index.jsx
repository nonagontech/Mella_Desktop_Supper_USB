import React, {
    useEffect,
    useState,
} from 'react';
import { Layout, Menu ,PageHeader } from 'antd';
import LinkEquipment from './components/linkEquipment';
import Measurement from './components/measurement';
import MeasuredData from './components/measuredData'
import './index.less';

const { Content ,Header} = Layout;

const TemperaturePage = () => {

    return (
        <Layout className='homeBox'>
            {/* <div className='chackPatientBox'>
                <p className='chackPatientTitle'>Select a patient</p>
            </div> */}
                <LinkEquipment/>
                {/* <Measurement/> */}
                {/* <MeasuredData/> */}
        </Layout>
    );
};

export default TemperaturePage;