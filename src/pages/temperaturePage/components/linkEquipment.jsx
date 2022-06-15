import React, {
    useEffect,
    useState,
} from 'react';
import { Image, Layout } from 'antd';
import PressButton_Pro from './../../../assets/img/PressButton_Pro.png';
import AxillaryPlacement from './../../../assets/img/AxillaryPlacement.png';
import HeaderItem from './headerItem'
import './linkEquipment.less';
const { Content, Header } = Layout;
const LinkEquipment = () => {

    return (
        <>
            <HeaderItem/>
            <Content className={"contentBox"}>
                <div className='startBox'>
                    <p className='startTitle'>Turn on yourMella Thermometer or Pair New Mella</p>
                    <img src={PressButton_Pro}></img>
                </div>
                <div className='startBox'>
                    <p className='startTitle'>Ready, place under foreleg</p>
                    <img src={AxillaryPlacement}></img>
                    <div className='bottomTip'>
                        <p className='tipTitle'>Need Help With Accurate Placement On Pet?</p>
                    </div>
                </div>
            </Content>
        </>
    );
}
export default LinkEquipment;