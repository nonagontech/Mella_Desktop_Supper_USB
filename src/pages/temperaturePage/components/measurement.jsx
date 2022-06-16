import React, {
    useEffect,
    useState,
} from 'react';
import { Button, Progress, Layout } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import Animation_1 from './../../../assets/img/Animation_1.png';
import Animation_2 from './../../../assets/img/Animation_2.png';
import Animation_3 from './../../../assets/img/Animation_3.png';
import HeaderItem from './headerItem';
import { connect } from 'react-redux';
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
import './measurement.less';

const { Content, Header } = Layout;

const Measurement = ({ petMessage, hardwareMessage }) => {
    let { mellaMeasureValue } = hardwareMessage;
    const [percent, setPercent] = useState(0);
    const decline = () => {
        let newPercent = percent + 10;
        if (newPercent > 100) {
            newPercent = 100;
        }
        setPercent(newPercent);
    }
    //圆滑里面的文字
    const ProgressTitle = (percent) => {
        return (
            <p className='ProgressTitle'>{percent} ℃</p>
        );
    }
    return (
        <>
            <HeaderItem />
            <Content className={"contentBox"}>
                <Progress type="dashboard" percent={_.round(mellaMeasureValue, 1)} gapDegree={30} width={'260px'} strokeWidth={'8'} format={percent => ProgressTitle(percent)} />
                <Button onClick={decline} icon={<PlusOutlined />} />
                {
                    percent === 0 ? (<img src={Animation_1} />) : (<img src={Animation_2} />)
                }
            </Content>
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
)(Measurement);