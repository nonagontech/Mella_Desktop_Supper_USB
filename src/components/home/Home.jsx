import React, { Component, } from 'react'
import {
    Button,
    message
} from 'antd';
//import 'antd/dist/antd.css';
import './home.less'
import logo from './../../assets/images/mella.png'
// import MaxMin from './../../utils/maxMin/MaxMin'
import temporaryStorage from './../../utils/temporaryStorage'
import { px, mTop, win, timerFun } from './../../utils/px'
import MinClose from '../../utils/minClose/MinClose';
import electronStore from './../../utils/electronStore'
import SelectionBox from './../../utils/selectionBox/SelectionBox'
import { addQRCode } from '../../utils/axios';
import { fetchRequest2 } from '../../utils/FetchUtil2';
let storage = window.localStorage;
// let size = { width: 0, height: 0 }
export default class Home extends Component {
    state = {
        imgurl: '',
        size: { width: 0, height: 0 }
    }
    componentDidMount() {
        let ipcRenderer = window.electron.ipcRenderer
        timerFun()
        // let win1 = JSON.stringify(win)
        // console.log(win);
        ipcRenderer.send('small', win())
        storage.measurepatientId = '';
        temporaryStorage.logupVetInfo = {}
        // window.removeEventListener('resize', this.resize);
        // window.addEventListener('resize', this.resize);

        ipcRenderer.on('changeFenBianLv', this.changeFenBianLv)

        fetchRequest2('/user/getLoginQRcode', "GET", '')
            // addQRCode()
            .then(res => {
                console.log('首页获取', res);


            })
            .catch(err => {

                console.log(err);
            })


        addQRCode()
            .then(res => {
                message.destroy()

                console.log('---获取二维码', res);

            })
            .catch(err => {

                console.log(err);
            })





    }
    resize = (e) => {
        // console.log('-------------监听的数据', e);

    }
    componentWillUnmount() {
        let ipcRenderer = window.electron.ipcRenderer
        window.removeEventListener('resize', this.resize);

        ipcRenderer.removeListener('changeFenBianLv', this.changeFenBianLv)
    }
    changeFenBianLv = (e) => {
        console.log('changeFenBianLv');
        console.log(e);
        let ipcRenderer = window.electron.ipcRenderer
        // ipcRenderer.send('small')
        ipcRenderer.send('small', win())
        this.setState({

        })
    }






    _quickStart = () => {
        console.log('dianji2')
        this.props.history.push('/page1')
        // this.props.history.push('/menuOptions/advancedsettings')

    }
    _createAccount = () => {
        this.props.history.push('/uesr/logUp/VetPrifile')

        // this.props.history.push('/uesr/logUp/JoinOrganizationByOption')

    }
    _test = () => {
        console.log('点击');
        console.log(navigator);
        console.log(navigator.userAgent);
        console.log('---------------------------');


    }
    render() {
        return (

            <div id="home">
                {/* <MaxMin
                    onClick={() => { this.props.history.push('/') }}
                /> */}
                <div className="daohang">
                    <MinClose />
                </div>

                <div className="heard" >
                    <img
                        src={logo}
                        alt=""
                        style={{ paddingTop: mTop(100), paddingBottom: mTop(100), width: px(300) }}
                    />
                </div>


                <div className="button" style={{ marginBottom: px(25) }}>
                    <Button
                        style={{ width: px(300), fontSize: px(20), height: px(300 / 6.5) }}
                        type="primary"
                        shape="round"
                        size='large'
                        onClick={() => { this.props.history.push('/page11') }}
                    // onClick={() => { this.props.history.push('/menuOptions/settings') }}



                    >
                        Sign In
                    </Button>

                </div>

                {/* <div className="button">
                    <Button
                        style={{ width: px(300), fontSize: px(20), height: px(300 / 6.5) }}
                        type="primary"
                        shape="round"
                        size='large'
                        onClick={this._quickStart}
                    >
                        Sign in with PMS
                    </Button>

                </div> */}
                <p className="text" style={{ fontSize: px(20), marginTop: mTop(5), marginBottom: mTop(5) }}>New to Mella?</p>

                <div className="create" style={{ marginBottom: mTop(20), marginTop: px(25) }}>
                    <Button
                        style={{ width: px(300), fontSize: px(20), height: px(300 / 6.5) }}
                        type="primary"
                        shape="round"
                        size='large'
                        onClick={this._createAccount}
                    >
                        Create an Account
                    </Button>
                </div>



            </div>
        )
    }
}