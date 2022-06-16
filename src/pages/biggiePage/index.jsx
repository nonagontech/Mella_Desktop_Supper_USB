import React, {
    useEffect,
    useState,
} from 'react';
import { Button, Progress, Space, Table, Tag, Badge } from 'antd';
import measuredTable_1 from './../../assets/img/measuredTable_1.png';
import measuredTable_2 from './../../assets/img/measuredTable_2.png';
import measuredTable_3 from './../../assets/img/measuredTable_3.png';
import EditCircle from './../../assets/img/EditCircle.png';
import Delete from './../../assets/img/Delete.png';
import _ from 'lodash';
import { connect } from 'react-redux';
import {

} from '../../store/actions';
import HeaderItem from './../temperaturePage/components/headerItem';
import './biggiePage.less';



const BiggirPage = ({ }) => {

    return (
        <div id='biggiePage'>
            <HeaderItem />
            <div className='measurementBox'>


            </div>
        </div>
    );
};

export default connect(
    state => ({

    }),
    {

    }
)(BiggirPage);