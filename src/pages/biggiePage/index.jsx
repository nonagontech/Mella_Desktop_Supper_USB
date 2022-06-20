import React, {
    useEffect,
    useState,
} from 'react';
import { Button, Progress, Space, Table, Tag, Badge } from 'antd';
import Biggie from './Biggie'
import _ from 'lodash';
import { connect } from 'react-redux';
import {
    setBiggieConnectStatusFun
} from '../../store/actions';
import HeaderItem from './../temperaturePage/components/headerItem';
import HistoryTable from '../../components/historyTable';
import LinkEquipment from './components/linkEquipment';
import './biggiePage.less';
import { px } from '../../utils/px';
let storage = window.localStorage;



const BiggirPage = ({ hardwareReduce, setBiggieConnectStatusFun, petReduce }) => {
    let { petDetailInfo } = petReduce
    //定义体重值 体脂值 体重单位 连接状态
    const [weight, setWeight] = useState(0);
    const [fat, setFat] = useState(0);
    const [unit, setUnit] = useState('kg');
    const [connectStatus, setConnectStatus] = useState('disconnected');
    const [isSavePMS, setIsSavePMS] = useState(false);
    useEffect(() => {
        let isSave = storage.connectionKey ? false : true
        setIsSavePMS(isSave)
    }, [])
    useEffect(() => {

        let { biggieConnectStatus, biggieBodyFat, biggieBodyWeight, biggieUnit, biggieSameWeightCount } = hardwareReduce;

        setConnectStatus(biggieConnectStatus);

        setFat(biggieBodyFat);
        setUnit(biggieUnit);
        if (biggieUnit === 'lb') {
            biggieBodyWeight = biggieBodyWeight * 2;
        }
        setWeight(biggieBodyWeight);

        if (biggieSameWeightCount === 6) {
            let ipcRenderer = window.require('electron').ipcRenderer;
            ipcRenderer.send('keyboardWriting', weight)
        }
    }, [hardwareReduce]);
    return (
        <div id='biggiePage'>
            <HeaderItem />
            <div className='measurementBox'>
                {
                    _.isEmpty(petDetailInfo) ? (
                        <div className='chackPatientBox'>
                            <p className='chackPatientTitle'>Select a patient</p>
                        </div>
                    ) : (
                        // connectStatus === 'isMeasuring' ?
                        //     (
                        //         <>
                        //             <div className="biggie" style={{ width: px(400), }}>
                        //                 <Biggie
                        //                     weight={weight}
                        //                     bodyFat={fat}
                        //                     score={5}
                        //                     impedance={fat}
                        //                     isIbs={unit === 'lb'}
                        //                     onPress={() => { console.log('点击了保存') }}
                        //                     discardOnPress={() => setBiggieConnectStatusFun('disconnected')}
                        //                     issave={isSavePMS}
                        //                 />
                        //             </div>
                        //             <HistoryTable />
                        //         </>
                        //     )
                        //     : (

                        //     <LinkEquipment />
                        // )
                        <>
                            <div className="biggie" style={{ width: px(400), }}>
                                <Biggie
                                    weight={weight}
                                    bodyFat={fat}
                                    score={5}
                                    impedance={fat}
                                    isIbs={unit === 'lb'}
                                    onPress={() => { console.log('点击了保存') }}
                                    discardOnPress={() => setBiggieConnectStatusFun('disconnected')}
                                    issave={isSavePMS}
                                />
                            </div>
                            <HistoryTable />
                        </>
                    )
                }

            </div>
        </div>
    );
};

export default connect(
    state => ({
        hardwareReduce: state.hardwareReduce,
        petReduce: state.petReduce
    }),
    {
        setBiggieConnectStatusFun
    }
)(BiggirPage);