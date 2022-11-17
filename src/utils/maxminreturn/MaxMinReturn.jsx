import React, { Component } from 'react';
import rMin_red from "./../../assets/img/min-red.png";
import rClose_red from "./../../assets/img/close-red.png";
import rMin_white from "./../../assets/img/min-white.png";
import rClose_white from "./../../assets/img/close-white.png";
import './maxminreturn.less'
import MinClose from '../minClose/MinClose';
import { connect } from 'react-redux';

class MaxMin extends Component {
    state = {
        closebgc: '',
        minbgc: '',
        closeColor: '',
    }
    _close = () => {
        let ipcRenderer = window.electron.ipcRenderer
        console.log('关闭程序');
        ipcRenderer.send('window-close')
    }
    _min = () => {
        let ipcRenderer = window.electron.ipcRenderer
        console.log('最小化程序');
        ipcRenderer.send('window-min')
        this.setState({
            minbgc: '',
        })
    }
    _minMove = () => {

        this.setState({
            minbgc: 'rgb(229,229,229)'
        })
    }
    _minLeave = () => {
        this.setState({
            minbgc: ''
        })
    }
    _closeMove = () => {
        this.setState({
            closeColor: 'red',
            closebgc: '#fff'
        })
    }
    _closeLeave = () => {
        this.setState({
            closeColor: ' rgb(245, 145, 145)',
            closebgc: ''
        })
    }
    _home = () => {
        console.log(this.props);
        // this.props.history.push('/')
    }

    render() {
        const { closeColor, closebgc, minbgc } = this.state
        return (
            <div className="maxminreturn">
                <div className="heard1">
                    {this.props.systemType === 'mac' && <MinClose />}

                    <div
                        className=" iconfont icon-left heard"
                        onClick={this.props.onClick1}
                    />
                </div>


                {/* <div className='headIconBox'>

                </div> */}


                <div className="close123">
                    <div className="home iconfont icon-zhuye3"
                        onClick={this.props.onClick}
                    />
                    {this.props.systemType !== 'mac' &&
                        <>
                            <div
                                className="min iconfont icon-64"
                                onClick={this._min}
                                onMouseEnter={this._minMove}
                                onMouseLeave={this._minLeave}
                                style={{ backgroundColor: minbgc }}
                            ></div>

                            <div
                                className="max iconfont icon-guanbi2"
                                onClick={this._close}
                                onMouseEnter={this._closeMove}
                                onMouseLeave={this._closeLeave}
                                style={{ backgroundColor: closebgc, color: closeColor }}
                            ></div>
                        </>
                    }


                </div>
            </div>
        )
    }
}
export default connect(
    (state) => ({
        systemType: state.systemReduce.systemType
    })

)(MaxMin)
