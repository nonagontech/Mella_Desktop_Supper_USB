import React, {
    useEffect,
    useState,
    useRef
} from 'react';
import { Button, Progress, Layout, Carousel } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import Animation_1 from './../../../assets/img/Animation_1.png';
import Animation_2 from './../../../assets/img/Animation_2.png';
import Animation_3 from './../../../assets/img/Animation_3.png';
// import HeaderItem from './headerItem';
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
    const [value, setValue] = useState(0);
    const [timers, setTimers] = useState(0);
    const saveCallBack = useRef();
    const callBack = () => {
        const random = 1;
        setValue(value + random);
        setTimers(timers + random);
    };
    //圆滑里面的文字
    const ProgressTitle = (percent) => {
        return (
            <>
                <p className='ProgressTitle'>{percent}
                    <span className='symbol'>℃</span>
                </p>
                <p className='ProgressTitle'>Measuring</p>
            </>

        );
    }
    //图片切换
    const checkImage = () => {
        switch (timers) {
            case 0:
                return <img src={Animation_1} />
            case 1:
                return <img src={Animation_2} />
            case 2:
                return <img src={Animation_3} />
            case 3:
                return <img src={Animation_3} />
            default:
                break;
        }
    }

    useEffect(() => {
        saveCallBack.current = callBack;
        if (timers > 2) {
            setTimers(0);
        }
        return () => { };
    });

    useEffect(() => {
        const tick = () => {
            saveCallBack.current();
        };
        const timer = setInterval(tick, 1000);
        return () => {
            clearInterval(timer);
        };
    }, [])

    return (
        <>
            {/* <HeaderItem /> */}
            <Content className={"contentBox"}>
                <Progress type="dashboard" percent={_.round(mellaMeasureValue, 1)} gapDegree={30} width={'260px'} strokeWidth={'8'} format={percent => ProgressTitle(percent)} />
                {checkImage()}
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