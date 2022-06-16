import React, {
    useEffect,
    useState,
} from 'react';
import { Button, Progress, Space, Table, Tag, Badge, Modal, Popconfirm, message } from 'antd';
import measuredTable_1 from './../../../assets/img/measuredTable_1.png';
import measuredTable_2 from './../../../assets/img/measuredTable_2.png';
import measuredTable_3 from './../../../assets/img/measuredTable_3.png';
import EditCircle from './../../../assets/img/EditCircle.png';
import Delete from './../../../assets/img/Delete.png';
import _ from 'lodash';
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
import Draggable from "react-draggable";
import { fetchRequest } from '../../../utils/FetchUtil1';
import moment from 'moment';
import './measuredData.less';

const MeasuredData = ({ petMessage, hardwareMessage, setMellaConnectStatusFun }) => {
    let { mellaMeasureValue, mellaConnectStatus, mellaMeasurePart } = hardwareMessage;
    let { petId, memo } = petMessage;
    let storage = window.localStorage;
    const [petTemperatureData, setPetTemperatureData] = useState([]);//存储宠物历史温度数据
    const [disabled, setDisabled] = useState(true);//model是否可拖拽
    const [visible, setVisible] = useState(false);//model框是否显示
    const [newMemo, setNewMemo] = useState('');//note内容
    const [petMessages, setPetMessages] = useState({});//接收点击了那个的值
    const [saveType, setSaveType] = useState(false);//是否隐藏按钮
    const [bounds, setBounds] = useState({ left: 0, top: 0, bottom: 0, right: 0 });
    //表格渲染
    const columns = [
        {
            title: 'Dat',
            dataIndex: 'createTime',
            with: 200,
            render: (text, record) => (moment(text).format('MMM D')),

        },
        {
            title: 'Tim',
            dataIndex: 'createTime',
            with: 150,
            render: (text, record) => (moment(text).format('hh:mm A')),
        },
        {
            title: 'Temp',
            dataIndex: 'temperature',
            with: 150,
            render: (text, record) => (
                <Badge color="#87d068" text={text} />
            ),
        },
        {
            title: 'Placeme',
            dataIndex: 'petVitalTypeId',
            render: (text, record) => {
                if (text === 1) {
                    return <img src={measuredTable_2} />
                } else if (text === 3) {
                    return <img src={measuredTable_1} />
                } else if (text === 4) {
                    return <img src={measuredTable_3} />
                } else {
                    return <img src={measuredTable_2} />
                }
            },
        },
        {
            title: 'Note',
            dataIndex: 'memo',
            render: (text, record) => (text)
        },
        {
            key: 'action',
            render: (text, record) => (
                <>
                    <img
                        className='operationIcon'
                        src={EditCircle}
                        onClick={() => {
                            setVisible(true);
                            setPetMessages(record);
                        }}
                    />
                    <Popconfirm title="Sure to delete?" onConfirm={() => deletePetMessage(record.examId)}>
                        <img src={Delete} />
                    </Popconfirm>
                </>
            ),
        },
    ]
    //圆滑里面的文字
    const ProgressTitle = (percent) => {
        //根据温度判断指示文字
        const title = () => {
            if (mellaMeasureValue > 40) {
                return 'Danger'
            } else if (_.inRange(_.round(mellaMeasureValue), 38, 40)) {
                return 'Normal'
            } else {
                return 'Low'
            }
        }
        //根据温度判断指示文字颜色
        const color = () => {
            if (mellaMeasureValue > 40) {
                return '#e1206d'
            } else if (_.inRange(_.round(mellaMeasureValue), 38, 40)) {
                return '#58bde6'
            } else {
                return '#98da86'
            }
        }
        return (
            <>
                <p  style={{color:{color}}} className='ProgressTitle'>{percent}
                    <span style={{color:{color}}} className='symbol'>℃</span>
                </p>
                <p style={{color:{color}}} className='ProgressTitle'>{title()}</p>
            </>

        );
    }
    //获取历史宠物温度数据
    const getPetTemperatureData = () => {
        fetchRequest(`/pet/getPetExamByPetId/${petId}`, 'GET', '')
            .then(res => {
                console.log('历史温度记录', res);
                if (res.flag === true) {
                    setPetTemperatureData(res.data);
                }
            }).catch((err) => {
                console.log(err);
            })

    }
    //返回准备测量界面
    const backConnectedPage = () => {
        if (mellaConnectStatus != 'connected') {
            setMellaConnectStatusFun('connected');
        } else {
            setMellaConnectStatusFun('disconnected');
        }
    }
    //保存数据
    const saveData = () => {
        let petVitalId = null;
        switch (mellaMeasurePart) {
            case '腋温': petVitalId = 1; break;
            case '肛温': petVitalId = 3; break;
            case '耳温': petVitalId = 4; break;
            default: petVitalId = 1; break;
        }
        let params = {
            petId: petId,
            doctorId: storage.userId,
            temperature: mellaMeasureValue,
            petVitalTypeId: petVitalId,
            memo: ''
        }
        fetchRequest('/exam/addClamantPetExam', 'POST', params)
            .then(res => {
                if (res.flag === true) {
                    getPetTemperatureData();
                    setSaveType(true);
                    message.success('save successfully');
                }
            }).catch((err) => {
                console.log(err);
            })
    }
    //保存note
    const save = () => {
        let datas = {
            memo: newMemo
        }
        fetchRequest(`/pet/updatePetExam/${petMessages.examId}`, 'POST', datas)
            .then(res => {
                setVisible(false);
                getPetTemperatureData();
            })
            .catch(err => {
                setVisible(false);
                console.log(err);
            })

    }
    //删除历史温度记录
    const deletePetMessage = (examId) => {
        fetchRequest(`/pet/deletePetExamByExamId/${examId}`, 'DELETE')
            .then(res => {
                if (res.flag === true) {
                    message.success('Successfully Delete');
                    getPetTemperatureData();
                } else {
                    message.error('Fail To Delete');
                }
            })

    }
    //关闭弹窗
    const handleCancel = (e) => {
        setVisible(false);
    };
    let draggleRef = React.createRef();
    const onStart = (event, uiData) => {
        const { clientWidth, clientHeight } = window?.document?.documentElement;
        const targetRect = draggleRef?.current?.getBoundingClientRect();
        setBounds({
            left: -targetRect?.left + uiData?.x,
            right: clientWidth - (targetRect?.right - uiData?.x),
            top: -targetRect?.top + uiData?.y,
            bottom: clientHeight - (targetRect?.bottom - uiData?.y)
        });
    };

    useEffect(() => {
        getPetTemperatureData();
        return (() => { });
    }, [])

    return (
        <>
            <div className='measurementBox'>
                <Progress
                    type="dashboard"
                    percent={_.round(mellaMeasureValue, 1)}
                    gapDegree={30}
                    width={'260px'}
                    strokeWidth={'8'}
                    format={percent => ProgressTitle(percent)}
                    strokeColor={{
                        '0%': '#7bd163',
                        '100%': '#19ade4',
                    }}
                />
                {
                    !saveType && (
                        <div className='buttonBox'>
                            <Button type="danger" shape="round" color='#e1206d' onClick={() => backConnectedPage()}>Discard</Button>
                            <Button type="danger" shape="round" color='#e1206d' onClick={() => saveData()}>Save</Button>
                        </div>
                    )
                }
                <div className='listTitleBox'>
                    <p className='listTitle'>History</p>
                </div>
                <Table
                    rowKey={'examId'}
                    columns={columns}
                    dataSource={petTemperatureData}
                    className='measuredTable'
                    pagination={false}
                >
                </Table>
            </div>
            {/*修改note弹窗 */}
            <Modal
                title={
                    <div
                        style={{
                            width: '100%',
                            cursor: 'move',
                            height: '20px',
                            textAlign: 'center'
                        }}
                        onMouseOver={() => {
                            if (disabled) {
                                setDisabled(false);
                            }
                        }}
                        onMouseOut={() => {
                            setDisabled(true);
                        }}
                        onFocus={() => { }}
                        onBlur={() => { }}
                    >
                        Edit Note
                    </div>
                }
                visible={visible}
                onCancel={handleCancel}
                modalRender={(modal) => (
                    <Draggable
                        disabled={disabled}
                        bounds={bounds}
                        onStart={(event, uiData) => onStart(event, uiData)}
                    >
                        <div ref={draggleRef}>{modal}</div>
                    </Draggable>
                )}
                footer={
                    [] // 设置footer为空，去掉 取消 确定默认按钮
                }
                destroyOnClose={true}
            >
                <div className="noteModal">
                    <div className="noteModalText">
                        <p style={{ width: '80px' }}>Notes</p>
                        <textarea
                            rows="5"
                            cols="40"
                            style={{ textIndent: '10px' }}
                            // value={petMessages.memo}
                            onChange={(val) => {
                                setNewMemo(val.target.value);
                            }}
                        >
                        </textarea>
                    </div>
                    <div className="btn" style={{ width: '60%' }} onClick={() => save()}>Save Changes</div>
                </div>
            </Modal>
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
)(MeasuredData);