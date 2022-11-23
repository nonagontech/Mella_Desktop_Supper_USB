import React, { useEffect, useState } from 'react'
import {
    Button
} from "antd"
import PropTypes from "prop-types";

import { accessArr, subAdvantage } from './components/accessArr';
import close from './../../assets/img/close-white.png'
import './index.less'
import { list } from '../../api';


const BuySub = ({ cancleFun, buyFun, loadings }) => {

    useEffect(() => {
        list()
            .then(res => {
                console.log("🚀 ~ file: index.jsx ~ line 23 ~ useEffect ~ res", res)

            })
            .catch(err => {
                console.log(err);
            })
    }, [])

    const listUI = () => {
        let options = accessArr.map((item, index) => {

            return (
                <li key={`1${index}`}>
                    <div>
                        <div className="title1" style={{ backgroundColor: item.color }}>{item.title1}</div>
                        <div className="title">{item.title}</div>
                        <div className="h2">{item.h2}</div>
                        <div className="h3">{item.h3}</div>
                        <Button type="primary" shape="round" className='buyBtn'
                            onClick={() => {
                                buyFun(item)
                            }}
                            loading={loadings[index]}
                        >Buy Bow</Button>
                    </div>
                </li>
            )
        })
        return (<ul>
            {options}
        </ul>)
    }
    const advantage = () => {
        let options = subAdvantage.map((item1, index) => {
            let option = item1.map((item, index1) => {
                return (
                    <li key={`${index}${index1}`}>
                        <div className="itemone">
                            <div className="icon">
                                <img src={item.icon} alt="" />
                            </div>
                            <div className="text">{item.text}</div>
                        </div>
                    </li>
                )
            })
            return (
                <ul className={`ul${index}`}>
                    {option}
                </ul>
            )
        })
        return options
    }

    return (
        <div id='buySub'>
            <div className="cencerIcon">
                <div onClick={cancleFun}>
                    <img src={close} alt="" />
                </div>

            </div>
            <div className="buySubTitle">Select the option that best describes your needs</div>
            <div className="subList">
                {listUI()}
            </div>
            <div className="premium">Premium Features</div>
            <div className="subAdvantage">
                {advantage()}
            </div>
            {/* <div className="bottom">
                <div>

                </div>
                <div
                    className="cancel"
                    onClick={cancleFun}
                >cancel</div>
            </div> */}

        </div>
    )
}
BuySub.propTypes = {
    cancleFun: PropTypes.func,
    buyFun: PropTypes.func,
    loadings: PropTypes.array
};
BuySub.defaultProps = {
    cancleFun: () => { },
    buyFun: () => { },
    loadings: [false, false, false]
}

export default BuySub;