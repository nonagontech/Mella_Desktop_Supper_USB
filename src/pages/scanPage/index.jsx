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
import './index.less';

const ScanPage = () => {

    return (
        <>
            <Layout className='homeBox'>
                <HeaderItem />
                <LinkEquipment/>
            </Layout>

        </>
    );

};

export default ScanPage;