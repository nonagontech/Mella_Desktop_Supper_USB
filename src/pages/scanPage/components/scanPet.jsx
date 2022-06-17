import React, {
    useEffect,
    useState,
    useRef
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
import NumericInput from './numericInput';
import head from './../../../assets/img/head.png';
import neck from './../../../assets/img/neck.png';
import upper from './../../../assets/img/upper.png';
import lower from './../../../assets/img/lower.png';
import Full from './../../../assets/img/Full.png';
import body from './../../../assets/img/body.png';
import catHead from './../../../assets/img/catHead.png';
import catNeck from './../../../assets/img/catNeck.png';
import catUpper from './../../../assets/img/catUpper.png';
import catLower from './../../../assets/img/catLower.png';
import catFull from './../../../assets/img/catFull.png';
import catBody from './../../../assets/img/catBody.png';
import './scanPet.less';

const { Content, Header } = Layout;
const ScanPet = ({ petMessage, hardwareMessage }) => {
    const [inputGroup, setInputGroup] = useState([]);
    const [inputIndex, setInputIndex] = useState(0);
    const [value, setValue] = useState('');//接收输入框的值
    const [value1, setValue1] = useState('');//接收输入框的值
    let newData = [];
    let { mellaConnectStatus } = hardwareMessage;
    let { petSpeciesBreedId, patientId } = petMessage;

    //保存input组
    const inputEl = (data) => {
        newData.push(data);
        console.log('newData', newData);
    }

    //切换聚焦事件
    const switchFocus = () => {
        let num = inputIndex;
        if (num < 5) {
            setInputIndex(num + 1);
        }
    }

    //结束事件
    const finishScan = () => {
        console.log('结束测量');
    }

    //判断是猫还是狗还是其他
    const checkPetType = () => {
        //0是猫，1是狗，或者petSpeciesBreedId为空判断图片为狗
        if (petSpeciesBreedId === 11001 || _.inRange(petSpeciesBreedId, 1, 136)) {
            return 0
        } else if (petSpeciesBreedId === 12001 || _.inRange(petSpeciesBreedId, 136, 456)) {
            return 1
        } else {
            return 1
        }
    }

    //切换图片
    const changeImage = () => {
        switch (inputIndex) {
            case 0:
                return checkPetType() === 1 ? <img src={head} /> : <img src={catHead} />
            case 1:
                return checkPetType() === 1 ? <img src={neck} /> : <img src={catNeck} />
            case 2:
                return checkPetType() === 1 ? <img src={upper} /> : <img src={catUpper} />
            case 3:
                return checkPetType() === 1 ? <img src={lower} /> : <img src={catLower} />
            case 4:
                return checkPetType() === 1 ? <img src={Full} /> : <img src={catFull} />
            case 5:
                return checkPetType() === 1 ? <img src={body} /> : <img src={catBody} />
            default:
                break;
        }
    }

    useEffect(() => {
        newData[inputIndex].focus();
        return (() => { });
    }, [inputIndex, patientId]);

    useEffect(() => {
        setInputIndex(0);
        return (() => { });
    }, [patientId])

    return (
        <>
            <Content className='contentBox'>
                <div className='scanImageBox'>
                    {changeImage()}
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
                            <NumericInput
                                value={value}
                                onChange={setValue}
                                getInput={inputEl}
                                key={0}
                            />
                        </div>
                        <div className='inputItem'>
                            <p className='inputTitle'>Neck Circumference</p>
                            <NumericInput
                                value={value}
                                onChange={setValue}
                                getInput={inputEl}
                                key={1}
                            />
                        </div>
                        <div className='inputItem'>
                            <p className='inputTitle'>Upper Torso Circumference</p>
                            <NumericInput
                                value={value}
                                onChange={setValue}
                                getInput={inputEl}
                                key={2}
                            />
                        </div>
                        <div className='inputItem'>
                            <p className='inputTitle'>Lower Torso Circumference</p>
                            <NumericInput
                                value={value}
                                onChange={setValue}
                                getInput={inputEl}
                                key={3}
                            />
                        </div>
                    </Space>
                </Input.Group>
                {/*第二列输入框*/}
                <Input.Group className='inputGroupItem' >
                    <Space className='inputItemBox'>
                        <div className='inputItem'>
                            <p className='inputTitle'>Full Torso Length</p>
                            <NumericInput
                                value={value}
                                onChange={setValue}
                                getInput={inputEl}
                                key={4}
                            />
                        </div>
                        <div className='inputItem'>
                            <p className='inputTitle'>Full Body Length</p>
                            <NumericInput
                                value={value}
                                onChange={setValue}
                                getInput={inputEl}
                                key={5}
                            />
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
                    <Button
                        type="primary"
                        shape="round"
                        size='large'
                        className='btn'
                        onClick={inputIndex === 5 ? finishScan : switchFocus}
                    >
                        {
                            inputIndex === 5 ? 'Finish' : 'Next'
                        }
                    </Button>
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