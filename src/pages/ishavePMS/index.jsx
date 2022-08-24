import React, { useEffect } from 'react';
import {
  Button,
} from 'antd';

import MaxMin from '../../utils/maxminreturn/MaxMinReturn';

import pms from '../../assets/images/pms.png';

import { useHistory } from "react-router-dom";

import './index.less'
const IsHavePMS = () => {
  let history = useHistory();

  useEffect(() => {
    let ipcRenderer = window.electron.ipcRenderer
    ipcRenderer.send('big')
  }, [])

  return (
    <div id="isHavePMS">
      <MaxMin
        onClick={() => { history.push('/') }}
        onClick1={() => history.goBack()}
      />

      <div className="body">
        <div className="title">Do you have PMS?</div>
        <div className="text">Practices with a PMS are strongly
        </div>
        <div className="text">encouraged to connect it.</div>

        <img src={pms} alt="" style={{ width: '100px' }} />

        <div className="buttons">
          <Button

            type="primary"
            shape="round"
            size='large'
          // onClick={() => { this.props.history.push('/page11') }}
          >
            Continue with email
          </Button>

          <Button

            type="primary"
            shape="round"
            size='large'
          // onClick={() => { this.props.history.push('/page11') }}
          >
            Connect PMS
          </Button>
        </div>
      </div>

    </div>
  )
}

IsHavePMS.propTypes = {

}
IsHavePMS.defaultProps = {

}
export default IsHavePMS
