import React, {
    useEffect,
    useState,
} from 'react';
import { Image, Layout, Dropdown, Col, Row, Avatar, Space, Card, Menu ,Progress } from 'antd';
import { DownOutlined } from '@ant-design/icons';
import Charlie from './../../../assets/img/Charlie.png';
import BluetoothNotConnected from './../../../assets/img/BluetoothNotConnected.png';
import AxillaryBluetooth from './../../../assets/img/AxillaryBluetooth.png';
import redcat from './../../../assets/images/redcat.png';
import reddog from './../../../assets/images/reddog.png';
import redother from './../../../assets/images/redother.png';
import { connect } from 'react-redux';
import { selectHardwareModalShowFun, petSortTypeFun, petDetailInfoFun } from '../../../store/actions';
import moment from 'moment'
import _ from 'lodash';

import './headerItem.less';

const { Header } = Layout;

const HeaderItem = ({ petMessage }) => {
    let { petName, patientId, firstName, lastName, gender, breedName, birthday, weight, url, petSpeciesBreedId } = petMessage;
    //展示宠物照片方法
    const petPicture = (size) => {
        if (_.isEmpty(url)) {
            if (petSpeciesBreedId === 11001 || _.inRange(petSpeciesBreedId, 1, 136)) {
                return <Avatar src={redcat} size={size} />
            } else if (petSpeciesBreedId === 12001 || _.inRange(petSpeciesBreedId, 136, 456)) {
                return <Avatar src={reddog} size={size} />
            } else if (petSpeciesBreedId === 13001) {
                return <Avatar src={redother} size={size} />
            } else {
                return <Avatar src={redother} size={size} />
            }
        } else {
            return <Avatar src={url} size={size} />
        }
    }
    //展示名字或id方法
    const showNameOrId = () => {
        if (_.isEmpty(petName) && _.isEmpty(patientId)) {
            return 'unknown'
        } else if (!_.isEmpty(petName)) {
            return petName
        } else {
            return patientId
        }
    }
    //展示主人名字方法
    const ownerName = () => {
        if (_.isEmpty(firstName) && _.isEmpty(lastName)) {
            return 'unknown'
        } else {
            return firstName + ' ' + lastName
        }
    }
    //计算宠物年龄
    const calculateAge = () => {
        if (_.isEmpty(birthday)) {
            return 'unknown'
        } else {
            return moment().diff(moment(birthday), 'years') + ' ' + 'Years Old'
        }
    }
    //计算宠物体重
    const calculateWeight = () => {
        if (_.isEmpty(weight)) {
            return 'unknown'
        } else {
            return _.floor(weight * 2.2, 1) + ' ' + 'lbs'
        }
    }
    //头部弹出卡片
    const cardItem = () => {
        return (
            <Menu>
                <Menu.Item className='topItem'>
                    <div className='cardTopBox'>
                        <div className='topLeftBox'>
                            {petPicture(91)}
                            <p className='cardTitle'>{showNameOrId()}</p>
                            <p className='cardTitle'>{ownerName()}</p>
                        </div>
                        <div className='topRightBox'>
                            <p className='cardTitle'>{calculateAge()}</p>
                            <p className='cardTitle'>{calculateWeight()}</p>
                            <p className='cardTitle'>{gender === 0 ? 'Male' : 'Venter'}</p>
                            <p className='cardTitle'>{breedName}</p>
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
                                {petPicture(40)}
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
                            <Progress width={48} type="circle" percent={100} format={() => (<Avatar size={40} src={AxillaryBluetooth} />)}/>
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