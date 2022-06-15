import React, {
    useEffect,
    useState,
} from 'react';
import { Image, Layout, Dropdown, Col, Row, Avatar, Space, Card, Menu } from 'antd';
import { DownOutlined } from '@ant-design/icons';
import Charlie from './../../../assets/img/Charlie.png';
import BluetoothNotConnected from './../../../assets/img/BluetoothNotConnected.png';
import AxillaryBluetooth from './../../../assets/img/AxillaryBluetooth.png';
import './headerItem.less';

const { Header } = Layout;
const cardItem = () => {
    return (
        <Menu>
            <Menu.Item className='topItem'>
                <div className='cardTopBox'>
                    <div className='topLeftBox'>
                        <Avatar src={Charlie} size={91} />
                        <p className='cardTitle'>Charlie</p>
                        <p className='cardTitle'>Rachel Green</p>
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
            {/* <Card>
                <div className='cardTopBox'>
                    <div className='topLeftBox'>
                        <Avatar src={Charlie} size={91} />
                        <p className='cardTitle'>Charlie</p>
                        <p className='cardTitle'>Rachel Green</p>
                    </div>
                    <div className='topRightBox'>
                        <p className='cardTitle'>3 Years Old</p>
                        <p className='cardTitle'>16 lbs</p>
                        <p className='cardTitle'>Male</p>
                        <p className='cardTitle'>Chihuahua Mix</p>
                    </div>
                </div>
                <div className='cardBottomBox'>
                    <p className='itemList'>Edit Pet Profile</p>
                    <p className='itemList'>Export Temperature History</p>
                    <p className='itemList'>Export All Vitals History</p>
                </div>
            </Card> */}
        </Menu>

    );
}
const HeaderItem = () => {
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
                                    <p className='petName'>CH2384, Charlie</p>
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
export default HeaderItem