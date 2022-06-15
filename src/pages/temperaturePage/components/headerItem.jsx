import React, {
    useEffect,
    useState,
} from 'react';
import { Image, Layout, Dropdown, Col, Row, Avatar, Space, Card, Menu } from 'antd';
import { DownOutlined } from '@ant-design/icons';
import Charlie from './../../../assets/img/Charlie.png';
import BluetoothNotConnected from './../../../assets/img/BluetoothNotConnected.png';
import AxillaryBluetooth from './../../../assets/img/AxillaryBluetooth.png';
import { connect } from 'react-redux';
import { selectHardwareModalShowFun, petSortTypeFun, petDetailInfoFun } from '../../../store/actions';
import _ from 'lodash';
import './headerItem.less';

const { Header } = Layout;

const HeaderItem = ({ petMessage }) => {
    //头部弹出卡片
    const cardItem = () => {
        return (
            <Menu>
                <Menu.Item className='topItem'>
                    <div className='cardTopBox'>
                        <div className='topLeftBox'>
                            <Avatar src={Charlie} size={91} />
                            <p className='cardTitle'>patientId</p>
                            <p className='cardTitle'>petName</p>
                        </div>
                        <div className='topRightBox'>
                            <p className='cardTitle'>3 Years Old</p>
                            <p className='cardTitle'>16 lbs</p>
                            <p className='cardTitle'>Male</p>
                            <p className='cardTitle'>Chihuahua Mix</p>
                        </div>
                    </div>
                </Menu.Item>
                <Menu.Item><p className='itemList'>Edit Pet Profile</p></Menu.Item>
                <Menu.Item><p className='itemList'>Export Temperature History</p></Menu.Item>
                <Menu.Item><p className='itemList'>Export All Vitals History</p></Menu.Item>
            </Menu>

        );
    }
    return (
        <>
            <Header className='headerBox'>
                <Row>
                    {/*头部左侧 */}
                    <Col flex={10}>
                        <Dropdown overlay={cardItem} trigger={['click']}>
                            <div className='petMessageBox' onClick={(e) => e.preventDefault()}>
                                <Avatar size={40} src={Charlie} />
                                <div className='petMessageBox'>
                                    <p className='petName'>
                                        {!_.isEmpty(petMessage.patientId) ? petMessage.patientId : 'unknown'}, {!_.isEmpty(petMessage.petName) ? petMessage.petName : 'unknown'}
                                    </p>
                                    <DownOutlined style={{ fontSize: '22px', marginLeft: '10px' }} />
                                </div>
                            </div>
                        </Dropdown>
                    </Col>
                    {/*头部右侧 */}
                    <Col flex={1}>
                        <div className='linkStateImageBox'>
                            <Avatar size={40} src={AxillaryBluetooth} />
                        </div>
                    </Col>
                </Row>
            </Header>
        </>
    );
};
export default connect(
    state => ({
        petMessage: state.petReduce.petDetailInfo
    }),
    { selectHardwareModalShowFun, petSortTypeFun, petDetailInfoFun }
)(HeaderItem);