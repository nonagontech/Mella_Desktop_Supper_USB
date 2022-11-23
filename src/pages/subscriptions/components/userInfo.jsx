import React, { useState } from 'react'
import {
    Button
} from 'antd'
import PropTypes from "prop-types";


const UserInfo = ({ userName, userUrl, endDate, btnFun }) => {
    return (
        <div className="userInfo">
            <div className="userIcon">
                <img src={userUrl} alt="" />
            </div>
            <div className="userName">{userName}</div>
            {endDate ?
                <div className="endDate">{`Expired on December 3, 2022`} </div> :
                <div >
                    <div className="endDate">Subscribe and enjoy<br /> more services</div>
                </div>
            }
            <Button type="primary"
                shape="round"
                size={'middle'}
                className="subscribeBtn"
                onClick={btnFun}
            >
                {endDate ? 'renew' : 'subscribe'}
            </Button>
        </div>
    )
}
UserInfo.propTypes = {
    userName: PropTypes.string,
    userUrl: PropTypes.string,
    endDate: PropTypes.string,
    btnFun: PropTypes.func
};
UserInfo.defaultProps = {
    userName: '',
    userUrl: '',
    endDate: '',
    btnFun: () => { }
}
export default UserInfo;