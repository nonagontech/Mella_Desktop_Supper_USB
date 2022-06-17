import React, {
    useEffect,
    useState,
} from 'react';
import { connect } from 'react-redux';
import { Layout, Menu, PageHeader, Radio, Input, Space, Button } from 'antd';
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
import HeaderItem from '../../temperaturePage/components/headerItem';
import head from './../../../assets/img/head.png';
import './scanPet.less';

const { Content, Header } = Layout;
const ScanPet = ({ petMessage, hardwareMessage }) => {
    let { mellaConnectStatus } = hardwareMessage;

    //输入框输入
    const onChange = (e) => {
        const { value } = e.target;
        const reg = /^-?[0-9]*(\.[0-9]*)?$/;
        if ((!isNaN(value) && reg.test(value)) || value === '' || value === '-') {
            onChange(value);
        }
    }

    return (
        <>
            <Content className='contentBox'>
                <div className='scanImageBox'>
                    <img src={head} />
                </div>
                {/*选择单位框*/}
                <Radio.Group defaultValue="a" buttonStyle="solid" className='selectLengthUnit'>
                    <Radio.Button value="a">in</Radio.Button>
                    <Radio.Button value="b">cm</Radio.Button>
                </Radio.Group>
                {/*第一列输入框*/}
                <Input.Group className='inputGroupItem' >
                    <Space className='inputItemBox'>
                        <div className='inputItem'>
                            <p className='inputTitle'>Head Circumference</p>
                            <Input
                                className='inputNum'
                                onChange={() => onChange()}
                            />
                        </div>
                        <div className='inputItem'>
                            <p className='inputTitle'>Neck Circumference</p>
                            <Input className='inputNum' />
                        </div>
                        <div className='inputItem'>
                            <p className='inputTitle'>Upper Torso Circumference</p>
                            <Input className='inputNum' />
                        </div>
                        <div className='inputItem'>
                            <p className='inputTitle'>Lower Torso Circumference</p>
                            <Input className='inputNum' />
                        </div>
                    </Space>
                </Input.Group>
                {/*第二列输入框*/}
                <Input.Group className='inputGroupItem' >
                    <Space className='inputItemBox'>
                        <div className='inputItem'>
                            <p className='inputTitle'>Full Torso Length</p>
                            <Input className='inputNum' />
                        </div>
                        <div className='inputItem'>
                            <p className='inputTitle'>Full Body Length</p>
                            <Input className='inputNum' />
                        </div>
                    </Space>
                </Input.Group>
                {/*小圆点 */}
                <div className='dotBox'>
                    <ul className='dotList'>
                        <li>
                            <Button className='dotItem'>1</Button>
                        </li>
                        <li>
                            <Button className='dotItem'>2</Button>
                        </li>
                    </ul>
                </div>
                {/*下一步 */}
                <div className='nextBtn'>
                    <Button type="primary" shape="round" size='large' className='btn'>Next</Button>
                </div>
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
)(ScanPet);