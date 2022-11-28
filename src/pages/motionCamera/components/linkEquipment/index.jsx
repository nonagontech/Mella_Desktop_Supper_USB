import React, { useEffect, useState, useRef } from "react";
import html2canvas from 'html2canvas';
import { Button, Input, Card, List, Image, } from "antd";
import { InfoCircleFilled } from "@ant-design/icons";

import takePhto from "../../../../assets/img/takePhto.png"

import electronStore from "../../../../utils/electronStore";

import { useHistory } from "react-router-dom";
import { connect } from "react-redux";
import {
  selectHardwareModalShowFun,
  petSortTypeFun,
  petDetailInfoFun,
  setSelectHardwareType
} from "../../../../store/actions";
import _ from "lodash";

import "./index.less";
import { px } from "../../../../utils/px";
import MyModal from "../../../../utils/myModal/MyModal";

let loadVidio = false
let timer = null
const LinkEquipment = ({ petMessage, }) => {
  let history = useHistory();
  const [ip, setIp] = useState('');
  const [showIp, setShowIp] = useState('')
  const [loading, setLoading] = useState(false)
  const next = () => {
    setLoading(true)
    setIp(showIp)
    loadVidio = false
    timer && clearTimeout(timer)
    timer = setTimeout(() => {
      if (!loadVidio) {
        console.log('视频加载失败，前往重新获取');
        setLoading(false)
      }
    }, 5000);
  }

  const inputIp = () => {
    return (
      <div className="inputIp">
        <div className="title">Please enter the IP<br />address</div>

        <div className="middleBox">
          <Input placeholder="192.168.0.204" className="middleInput" style={{ width: px(300), height: px(50) }}
            value={showIp}
            onChange={(val) => setShowIp(val.target.value)}
          />
        </div>
        <div className="bottomBox">
          <Button type="primary" shape="round" style={{ width: px(400), height: px(40) }} onClick={next} >Next</Button>
        </div>
      </div>
    )
  }
  const takePhoto = async () => {

    // // let res = await html2canvas(document.getElementById('aphoto'), { useCORS: true })
    // // console.log("🚀 ~ file: index.jsx ~ line 65 ~ takePhoto ~ res", res)
    // console.log('电控');
    // html2canvas(document.getElementById('aphoto'), {
    //   allowTaint: false,
    //   useCORS: true,
    //   proxy: 'http://192.168.0.203:81'
    // }).then(function (canvas) {
    //   console.log(canvas);
    //   // toImage
    //   const dataImg = new Image()
    //   dataImg.src = canvas.toDataURL('image/png')
    //   const alink = document.createElement("a");
    //   alink.href = dataImg.src;
    //   alink.download = "testImg.jpg";
    //   alink.click();
    // });


  }
  const urlErrModal = () => {
    return (
      <div className="urlErrModal">
        <div className="close">

        </div>

      </div>
    )
  }

  const vidio = () => {
    return (
      <div className="vidio">
        <div className="vidioFa">
          <div id="aphoto">
            <img
              onError={(err) => {
                console.log("🚀 ~ file: index.jsx ~ line 59 ~ vidio ~ err", err)
                timer && clearTimeout(timer)
                setLoading(false)
              }}
              onLoad={e => {
                console.log('e', e);
                setLoading(false)
                loadVidio = true
                timer && clearTimeout(timer)
              }}

              src={`http://${ip}:81`} />
          </div>




        </div>
        <div
          className="btn"
          onClick={takePhoto}
        >
          <img src={takePhto} alt="" />
        </div>

        <MyModal
          visible={loading}
        // element={urlErrModal()}
        />




      </div>

    )


  }

  // useEffect(() => {
  //   setIp('')
  // }, [])





  return (
    <div id="motionCameraBody">
      {ip ? vidio() : inputIp()}
      {/* {inputIp()} */}
      {/* {vidio()} */}
    </div>
  );
};

export default connect(
  (state) => ({
    petMessage: state.petReduce.petDetailInfo,
    hardwareMessage: state.hardwareReduce,
  }),
  {
    selectHardwareModalShowFun,
    petSortTypeFun,
    petDetailInfoFun,
    setSelectHardwareType
  }
)(LinkEquipment);
