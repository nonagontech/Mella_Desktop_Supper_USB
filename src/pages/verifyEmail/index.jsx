import React, { useState, useEffect } from 'react'
import { message, Button } from 'antd'

import MaxMin from './../../utils/maxminreturn/MaxMinReturn';
import temporaryStorage from './../../utils/temporaryStorage';
import { fetchRequest2 } from './../../utils/FetchUtil2';
import { px } from './../../utils/px';
import MyModal from './../../utils/myModal/MyModal';
import { fetchRequest3 } from './../../utils/FetchUtil3';

import { useHistory } from 'react-router-dom'

import './index.less';
import { activateUserByEmailCode } from '../../api';

const VerifyEmail = () => {
  let history = useHistory()
  const [code, setCode] = useState('')
  const [resend, setResend] = useState(60)
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const timer = setInterval(() => {
      if (resend > 0) {
        setResend(resend - 1)
      }
    }, 1000);
    return () => {
      clearInterval(timer)
    }
  })

  const _resend = (e) => {

    if (resend <= 0) {

      //下面写逻辑代码
      let { domain, email, hash, phone, birthday, firstName, lastName } = temporaryStorage.logupVetInfo
      let params = {
        firstName,
        lastName,
        domain, email, hash, phone,
      }
      if (birthday) {
        params.birthday = birthday
      }
      console.log('重新获取验证码入参', params);
      fetchRequest2(`/user/resendDeskRegistEmail/${temporaryStorage.logupEmailCode}`, 'POST', params)
        .then(res => {
          console.log('重新获取验证码', res);
          if (res.msg === 'success') {
            message.success('The email has been resent, please check', 3)
            temporaryStorage.logupEmailCode = res.data
            setResend(60)
          } else {
            message.error('Failed to send mail', 3)

          }
        })
        .catch(err => {
          console.log('重新获取验证码失败');
        })

    }

    //阻止a链接跳转
    if (e && e.preventDefault)
      e.preventDefault();
    else
      window.event.returnValue = false;
  }
  const _next = () => {
    // console.log(code, '-----', temporaryStorage.logupEmailCode, '----', temporaryStorage.logupVetInfo);
    message.destroy()
    if (code !== temporaryStorage.logupEmailCode) {
      message.error('Verification code input is incorrect', 3)
      return
    }
    else {
      setVisible(true)
      activateUserByEmailCode(code)
        .then(res => {
          setVisible(false)
          console.log('验证码验证返回信息：', res);
          if (res.flag === true) {
            console.log('验证成功');
            temporaryStorage.logupSuccessData = res.data
            temporaryStorage.logupEmailCode = ''
            history.push('/uesr/logUp/JoinOrganizationByOption')
          } else {
            message.error('Verification code verification failed', 3)
          }

        })
        .catch(err => {
          setVisible(false)
          console.log('验证码验证错误：', err);
        })
    }
    // history.push('/uesr/logUp/FindWorkplace')
  }


  return (
    <div id="verifyEmail">
      <div className="heard">
        <MaxMin
          onClick={() => { history.push('/') }}
          onClick1={() => history.goBack()}
        />
      </div>
      <div className="body">
        <h1 className="title" style={{ fontSize: px(30), marginBottom: px(22) }}>Confirm your email</h1>
        <div className="text" >{`We have sent a code to ${temporaryStorage.logupVetInfo.email}.`}</div>
        <div className="text">Please enter it below to confirm your address.</div>
        <div className="inpF">
          <input
            className="inp"
            type="text"
            value={code}
            placeholder="Code"
            onChange={(val) => { setCode(val.target.value) }}
            maxLength={6}
            onKeyUp={(e) => { if (e.keyCode === 13) { _next() } }}
          />
        </div>

        {/* <div className="resend">
          <a href="#" onClick={_resend}>Resend</a>
          {resend > 0 && `(${resend})`}
        </div> */}
      </div>
      <div className="footer" style={{ padding: `${px(40)}px 0` }}>
        <div className="btnF">
          <Button
            type="primary"
            shape="round"
            size='large'
            htmlType="submit"
            onClick={_next}
          >
            Next
          </Button>
        </div>
      </div>

      <MyModal
        visible={visible}
      />








    </div>
  )
}

export default VerifyEmail

