import React, { Component } from 'react';
import rMin_red from "./../../assets/img/min-red.png";
import rClose_red from "./../../assets/img/close-red.png";
import rMin_white from "./../../assets/img/min-white.png";
import rClose_white from "./../../assets/img/close-white.png";

import { px } from '../../utils/px';
import back_white from "./../../assets/img/back-white.png";
import back_hui from "./../../assets/img/back-hui.png";
import MouseDiv from "./../../utils/mouseDiv/MouseDiv";



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

    beforeDiv = () => {
      return <img src={back_hui} alt="" style={{ width: px(15) }} />;
    };
    afterDiv = () => {
      return <img src={back_white} alt="" style={{ width: px(15) }} />;
    };


    render() {
        const { closeColor, closebgc, minbgc } = this.state
        return (
            <div className="maxminreturn">
                <div className="heard1">
                    {this.props.systemType === 'mac' && <MinClose />}
                    {/* <div
                        className=" iconfont icon-left heard"
                        onClick={this.props.onClick1}
                    /> */}
                    <MouseDiv
                        className="mouseDiv"
                        beforeDiv={this.beforeDiv}
                        afterDiv={this.afterDiv}
                        divClick={this.props.onClick1}
                      />
                </div>
                {/* <div className='headIconBox'>
                </div> */}
                <div className="close123">
                    {/* <div className="home iconfont icon-zhuye3"
                        onClick={this.props.onClick}
                    /> */}
                    {this.props.systemType !== 'mac' &&
                        <>
                          <div
                            className="heaed"
                            // style={{ paddingRight: px(20) }}
                          >
                            <div className="l">

                            </div>
                            <div className="r">
                              <MinClose />
                            </div>
                          </div>
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
