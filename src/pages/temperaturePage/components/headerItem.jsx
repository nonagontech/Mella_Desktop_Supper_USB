import React, { useEffect, useState, useRef } from "react";
import {
  Image,
  Layout,
  Dropdown,
  Col,
  Row,
  Avatar,
  Space,
  Card,
  Menu,
  Progress,
  message
} from "antd";
import { DownOutlined } from "@ant-design/icons";

import BluetoothNotConnected from "./../../../assets/img/BluetoothNotConnected.png";
import AxillaryBluetooth from "./../../../assets/img/AxillaryBluetooth.png"; //腋温图片
import RectalBluetoothIcon from "./../../../assets/img/RectalBluetoothIcon.png"; //肛温图片
import EarBluetoothIcon from "./../../../assets/img/EarBluetoothIcon.png"; //耳温图片
import Connect from './../../../assets/img/connect.png'
import connectBle from "./../../../assets/img/connectBle.png";
import redcat from "./../../../assets/images/redcat.png";
import reddog from "./../../../assets/images/reddog.png";
import redother from "./../../../assets/images/redother.png";

import electronStore from "../../../utils/electronStore";
import { catv12Predict } from "../../../api";
import { changeThemeColor } from "../../../utils/commonFun";

import { useHistory } from "react-router-dom";
import { connect } from "react-redux";
import {
  selectHardwareModalShowFun,
  petSortTypeFun,
  petDetailInfoFun,
  setMellaConnectStatusFun,
  setMellaMeasureValueFun,
  setMellaPredictValueFun,
  setMellaMeasurePartFun,
  setMellaPredictReturnValueFun,


  mellaPredictReturnValue,
  setMellaDeviceIdFun,
} from "../../../store/actions";
import moment from "moment";
import _ from "lodash";

import "./headerItem.less";
import { devType } from "../../../config/config";
import { buf2hex, hex2buf, hex2arr } from '../../../utils/commonFun'
const { Header } = Layout;

//连接
let initTime = 0; //初始化时间,用来计算底座没有回应温度计的时间差,如果时间差大于6秒代表断开连接
let num07 = 0; //接收到07命令行的次数,次数大于3跳出弹框
let firstEar = true; //为true代表一组数据测量完成,下组测量数据
let is97Time = null; //为了防抖，因为有时候断开连接和连接成功总是连续的跳出来，展示就会一直闪烁，因此引入时间差大于800ms才展示
let exchangeNum = 0; //奇数发送查询探头id指令，偶数发送询问配置
let time194 = 0

//用于预测的东西
let clinicalYuce = [],
  clinicalIndex = 0;





let readCharacteristic = null,
  writeCharacteristic = null

//搜索到的设备
let device = null
//因为每次点击断开连接的图标都会产生一次断开监听，因此做一个标志位，让他只有第一次才会监听
let dicconnectFlog = null


const HeaderItem = ({
  petMessage,
  hardwareMessage,
  timeNum = 15,
  setMellaPredictReturnValueFun,

  setMellaConnectStatusFun,
  setMellaPredictValueFun,
  setMellaMeasurePartFun,
  mellaPredictReturnValue,
  setMellaDeviceIdFun,
  setMellaMeasureValueFun
}) => {
  let history = useHistory();
  let storage = window.localStorage;
  let {
    petName,
    patientId,
    firstName,
    lastName,
    gender,
    breedName,
    birthday,
    weight,
    url,
    petSpeciesBreedId,
    petId,
    isWalkIn,
  } = petMessage;
  let {
    mellaConnectStatus,
    mellaPredictValue,
    mellaMeasureValue,
    mellaMeasurePart,
    rulerConnectStatus,
    biggieConnectStatus,
    selectHardwareInfo,
    selectHardwareType,
  } = hardwareMessage;
  const [value, setValue] = useState(0);
  const [color, setColor] = useState('#e1206d');//颜色切换
  const saveCallBack = useRef();
  const callBack = () => {
    let random = null;
    if (timeNum === 15) {
      random = 7;
    } else if (timeNum === 30) {
      random = 3.5;
    } else {
      random = 1.75;
    }
    setValue(value + random);
  };
  //展示宠物照片方法
  const petPicture = (size) => {
    if (_.isEmpty(url)) {
      if (petSpeciesBreedId === 11001 || _.inRange(petSpeciesBreedId, 1, 136)) {
        return <Avatar src={redcat} size={size} />;
      } else if (
        petSpeciesBreedId === 12001 ||
        _.inRange(petSpeciesBreedId, 136, 456)
      ) {
        return <Avatar src={reddog} size={size} />;
      } else if (petSpeciesBreedId === 13001) {
        return <Avatar src={redother} size={size} />;
      } else {
        return <Avatar src={redother} size={size} />;
      }
    } else {
      return <Avatar src={url} size={size} />;
    }
  };
  //展示名字或id方法
  const showNameOrId = () => {
    if (_.isEmpty(petName) && _.isEmpty(patientId)) {
      return "unknown";
    } else if (!_.isEmpty(petName)) {
      return petName;
    } else {
      return patientId;
    }
  };
  //展示主人名字方法
  const ownerName = () => {
    if (_.isEmpty(firstName) && _.isEmpty(lastName)) {
      return "unknown";
    } else {
      return firstName + " " + lastName;
    }
  };
  //计算宠物年龄
  const calculateAge = () => {
    if (_.isEmpty(birthday)) {
      return "unknown";
    } else {
      return moment().diff(moment(birthday), "years") + " " + "Years Old";
    }
  };
  //计算宠物体重
  const calculateWeight = () => {
    if (_.isEmpty(weight)) {
      return "unknown";
    } else {
      return _.floor(weight * 2.2, 1) + " " + "lbs";
    }
  };
  //头部弹出卡片
  const cardItem = () => {
    return (
      <Menu onClick={(item) => clilkMenu(item)} className="popBox">
        <Menu.Item className="topItem">
          <div className="cardTopBox" style={{ backgroundColor: color }}>
            <div className="topLeftBox">
              {petPicture(91)}
              <p className="cardTitle" style={{ fontWeight: 700 }} >{showNameOrId()}</p>
              <p className="cardTitle">{ownerName()}</p>
            </div>
            <div className="topRightBox">
              <p className="cardTitle">{calculateAge()}</p>
              <p className="cardTitle">{calculateWeight()}</p>
              <p className="cardTitle">{gender === 0 ? "Male" : "Venter"}</p>
              <p className="cardTitle">{breedName}</p>
            </div>
          </div>
        </Menu.Item>
        <Menu.Item key={"editPetInfo"} style={{ paddingLeft: '8px' }}>
          <p className="itemList">Temperature History</p>
        </Menu.Item>
        <Menu.Item key={"editPetInfo"} style={{ paddingLeft: '8px' }}>
          <p className="itemList">Edit Pet Profile</p>
        </Menu.Item>
        <Menu.Item style={{ paddingLeft: '8px' }}>
          <p className="itemList">Export Temperature History</p>
        </Menu.Item>
        <Menu.Item style={{ paddingLeft: '8px' }}>
          <p className="itemList">Export All Vitals History</p>
        </Menu.Item>
      </Menu>
    );
  };
  const clilkMenu = (item) => {
    console.log("---item", item);
    if (item.key === "editPetInfo" && !petMessage.isWalkIn) {
      //跳转到编辑宠物信息页面
      history.push("/page9");
    }
  };
  //超过15s后调用接口
  const prediction = () => {
    let parame = {
      ambient_temperature: 17,
      data: mellaPredictValue,
      deviceId: "11111",
      sampling_rate: "135ms",
    };
    let url = "/clinical/catv12Predict";
    catv12Predict(parame)
      .then((res) => {
        console.log("res", res);
        let ipcRenderer = window.electron.ipcRenderer;
        if (res.message === "Success") {
          let prediction = res.result.prediction.toFixed(2);
          let num = parseFloat(parseFloat(prediction).toFixed(1));
          setMellaPredictReturnValueFun(num);
          let tempArr = prediction.split(".");
          let intNum = tempArr[0];
          let flotNum = tempArr[1];
          if (intNum.length < 2) {
            intNum = "0" + intNum;
          }
          if (flotNum.length < 2) {
            flotNum = "0" + flotNum;
          }
          const timeID = setTimeout(() => {
            ipcRenderer.send("usbdata", {
              command: "42",
              arr: [intNum, flotNum],
            });

            timeID && clearTimeout(timeID);
          }, 10);
        } else {
          const timeID = setTimeout(() => {
            ipcRenderer.send("usbdata", { command: "41", arr: [] });
            clearTimeout(timeID);
          }, 10);
        }
      })
      .catch((err) => {
        console.log("err", err);
      });
  };
  //判断仪器是否连接从而判断选择什么图片
  const isConnect = () => {
    const checkImage = () => {
      switch (mellaMeasurePart) {
        case "腋温": return AxillaryBluetooth;
        case "耳温": return EarBluetoothIcon;
        case "肛温": return RectalBluetoothIcon;
        case "": return Connect;

        default:
          break;
      }

    };

    if (electronStore.get(`${storage.userId}-isClical`)) {
      return _.isEqual(mellaConnectStatus, "disconnected") || _.isEmpty(mellaMeasurePart) ? (
        <Avatar size={40} src={BluetoothNotConnected} />
      ) : (
        <Progress
          width={48}
          type="circle"
          percent={value}
          format={() => <Avatar size={40} src={checkImage()} />}
        />
      );
    } else {
      switch (selectHardwareType) {
        case "mellaPro":
          return _.isEqual(mellaConnectStatus, "disconnected") ? (
            <Avatar size={40} src={BluetoothNotConnected} onClick={() => { if (devType === 'react') { connectMellaHome() } }} />
          ) : (
            <Progress
              width={48}
              type="circle"
              percent={value}
              format={() => <Avatar size={40} src={checkImage()} />}
            />
          );
        case "biggie":
          return _.isEqual(biggieConnectStatus, "disconnected") ? (
            <Avatar size={40} src={BluetoothNotConnected} />
          ) : (
            <Avatar size={40} src={connectBle} />
          );
        case "tape":
          return _.isEqual(rulerConnectStatus, "disconnected") ? (
            <Avatar size={40} src={BluetoothNotConnected} />
          ) : (
            <Avatar size={40} src={connectBle} />
          );
        default:
          break;
      }
    }
  };



  //下面是网页端时网页连接的逻辑
  //点击未连接图标开始挑出弹框
  //搜索连接mellahome
  const connectMellaHome = async () => {

    let option = {
      filters: [{ name: 'MellaHome' }, { name: 'MellaPro' },],
      // acceptAllDevices: true,
      optionalServices: ['0000ffe0-0000-1000-8000-00805f9b34fb']
      // optionalServices: [0xff0f]
    }
    let radioService = null
    console.log('准备', device);
    // if (device) {
    //   device.removeAddEventListener('gattserverdisconnected', onDisconnected);//监听设备断开连接
    // }
    if (!navigator.bluetooth) {
      message.error('No Web Bluetooth support.')
    }
    device = null


    device = await navigator.bluetooth.requestDevice(option)
    console.log('----', device);
    //没有做销毁监听，会重复监听
    if (!dicconnectFlog) {
      device.addEventListener('gattserverdisconnected', onDisconnected);//监听设备断开连接
      dicconnectFlog = true
    }
    let connectStatus = device.gatt.connected
    console.log('设备', device, connectStatus);
    if (connectStatus) {
      console.log('已经连接，返回');
      return
    }
    let server = await device.gatt.connect(); //蓝牙连接
    console.log('连接成功', server);
    // let alltPrimaryServices = await server.getPrimaryServices()//获取服务uuid
    // console.log('服务uuid：', alltPrimaryServices);
    if (mellaConnectStatus !== "connected") {
      setMellaConnectStatusFun("connected");
    }
    try {
      let service = await server.getPrimaryService('0000ffe0-0000-1000-8000-00805f9b34fb'); //获取一个主GATT服务
      let characteristics = await service.getCharacteristics()//获取所有的特征值
      console.log('所有的特征值：', characteristics);
      let readcharacteristic = await service.getCharacteristic('0000ffe4-0000-1000-8000-00805f9b34fb')
      // setReadCharacteristic(readcharacteristic)
      readCharacteristic = readcharacteristic
      let writecharacteristic = await service.getCharacteristic('0000ffe1-0000-1000-8000-00805f9b34fb')
      // setWriteCharacteristic(writecharacteristic)
      writeCharacteristic = writecharacteristic
    } catch (error) {
      console.log('----====---', error);
    }




    try {
      await readCharacteristic.startNotifications()
    } catch (error) {
      console.log('读通知', error);
    }
    console.log('设置监听');
    try {
      readCharacteristic.addEventListener('characteristicvaluechanged',
        handleCharacteristicValueChanged);
    } catch (error) {
      console.log('监听出错', error);
    }

    // sendData("07", ["5A"], writeCharacteristic)
    // setTimeout(() => {
    //   sendData("07", ["5A"], writeCharacteristic)

    // }, 500);
    sendData("48", ["02"], writeCharacteristic)
    // setTimeout(() => {
    //   sendData("48", ["02"], writeCharacteristic)

    // }, 500);

  }
  const handleCharacteristicValueChanged = (event) => {
    const value = event.target.value.buffer;
    let hex = buf2hex(value)
    let arr = hex2arr(hex)
    console.log('Received ', arr);
    command(arr)()
  }
  const onDisconnected = async (event) => {

    const device1 = event.target;
    console.log(`设备: ${device1.name} 已经断开连接`);

    setMellaConnectStatusFun("disconnected");
    if (readCharacteristic) {
      await readCharacteristic.removeEventListener('characteristicvaluechanged',
        handleCharacteristicValueChanged);

      // setReadCharacteristic(null)
      readCharacteristic = null
      writeCharacteristic = null
    }



  }

  const blueSend = async (sendText, cha = writeCharacteristic) => {
    if (cha) {
      let buffer = hex2buf(sendText)
      console.log('发送的hex', sendText);
      await cha.writeValue(buffer)

      cha.writeValue(buffer)
        .catch(() => {
          console.log("DOMException: GATT operation already in progress.");
          return Promise.resolve()
            .then(() => setTimeout(() => {

            }, 500))
            .then(() => { cha.writeValue(buffer); });
        });
    } else {
      console.log('没有', writeCharacteristic);
    }

  }
  // 发送数据
  const sendData = (command, arr, cha = writeCharacteristic) => {
    //帧长,如果帧长是一位,前面加0
    let length = arr.length + 3;
    length = length.toString(16);
    if (length.length < 2) {
      length = '0' + length;
    }
    // console.log(length , command)
    //开始生成校验位
    let Check = parseInt(length, 16) ^ parseInt(command, 16);
    for (let i = 0; i < arr.length; i++) {
      Check = Check ^ parseInt(arr[i].toString(16), 16);
    }
    //如果校验位长度为1前面补0
    Check = Check.toString(16);
    if (Check.length < 2) {
      Check = '0' + Check;
    }
    // console.log(Check)
    let str = 'AA' + length + command + arr.join('') + Check + '55';
    // console.log('发送的数据', str);

    blueSend(str, cha)
  };





  //底座与温度计断开连接
  const _disconnect_to_mella = () => {

    if (mellaConnectStatus !== "disconnected") {
      setMellaConnectStatusFun("disconnected");
    }
    // setMellaDeviceIdFun("");
  };
  //底座与温度计连接
  const _connect_to_mella = () => {

    if (mellaConnectStatus !== "connected") {
      // setMellaConnectStatusFun("connected");
    }
  };
  // newArr 指的是十进制数字数组，   dataArr1:指的是16进制字符串数组
  const command = (newArr) => {

    let dataArr1 = newArr.map((item) => {
      if (item.toString(16).length < 2) {
        return "0" + item.toString(16);
      } else {
        return item.toString(16);
      }
    });
    console.log('我进来了', dataArr1);


    const instruction = [
      209, 193, 192, 129, 135, 238, 98, 97, 130, 208, 177, 194, 99, 134
    ];


    if (mellaConnectStatus === "disconnected") {
      _connect_to_mella();
    }


    const commandArr = {
      209: () => {

        //腋温
        //第一次测量去获取探头ID
        if (firstEar) {
          firstEar = false;
          // console.log("去获取探头id");
          //ipcRenderer.send("usbdata", { command: "31", arr: [] });
          //重新测量,清空预测值
          clinicalYuce = [];
          clinicalIndex = 0;
        }
        let temp1 = parseFloat(`${dataArr1[3]}.${dataArr1[4]}`);
        let temp0 = parseFloat(`${dataArr1[5]}.${dataArr1[6]}`);
        let Temp = temp0;
        if (
          Temp === 24.7 ||
          Temp === 0 ||
          Temp === null ||
          Temp === undefined
        ) {
          return;
        }

        let dataS = {
          sample: clinicalIndex++,
          data0: temp0,
          data1: temp1,
        };
        clinicalYuce.push(dataS);
        if (clinicalYuce.length >= 30) {
          setMellaPredictValueFun(clinicalYuce);
        }
        setMellaMeasureValueFun(Temp);
        if (mellaConnectStatus !== "isMeasuring") {
          setMellaConnectStatusFun("isMeasuring");
        }
        if (mellaMeasurePart !== "腋温" && mellaMeasurePart !== "肛温") {

          setMellaMeasurePartFun("腋温");
        }
        // this.props.setMellaMeasureNumFun(this.props.mellaMeasureNum + 1);
      },
      208: () => {
        //耳温

        if (firstEar) {
          firstEar = false;
          //ipcRenderer.send("usbdata", { command: "31", arr: [] });
          //重新测量,清空预测值
          clinicalYuce = [];
          clinicalIndex = 0;
        }
        //现在探头0可能不存在，所以把探头0改为探头1
        let temp0 = parseFloat(`${dataArr1[7]}.${dataArr1[4.18]}`);
        let Temp = temp0;
        setMellaMeasureValueFun(Temp);
        if (mellaConnectStatus !== "isMeasuring") {
          setMellaConnectStatusFun("isMeasuring");
        }

        if (mellaMeasurePart !== "耳温") {
          setMellaMeasurePartFun("耳温");
        }
      },
      193: () => {
        //指令结束\自动结束后\温度计收到预测数据后温度计返回值,结束后可能还会粘一组测量中的数据

        firstEar = true;
        if (mellaConnectStatus !== "complete") {
          setMellaConnectStatusFun("complete");
        }
      },
      194: () => {
        //硬件收到机器学习结果并停止测量，
        time194 = new Date()
        console.log("---机器学习", newArr);
        if (mellaConnectStatus !== "complete") {
          setMellaConnectStatusFun("complete");
        }
        setMellaMeasureValueFun(mellaPredictReturnValue);
        firstEar = true;
        if (mellaConnectStatus !== "complete") {
          setMellaConnectStatusFun("complete");
        }

        clinicalYuce = [];
        clinicalIndex = 0;
      },
      192: () => {
        //温度计收到40开始数据后返回的指令
        switch (newArr[3]) {
          case 90:
            console.log("有探头，开始测量的返回指令·");
            break;
          case 11:
            console.log("没有探头，开始测量的返回值");
            break;
        }
      },
      129: () => {
        //返回硬件版本号
        console.log(`返回的版本号为${newArr[3]}`);
      },
      134: () => {
        switch (newArr[3]) {
          case 1:
            console.log('腋温');
            setMellaMeasurePartFun("腋温");
            break;
          case 2:
            console.log('肛温');
            setMellaMeasurePartFun("肛温");
            break;

          default:
            break;
        }
        sendData("07", ["5A"], writeCharacteristic)
      },
      135: () => {
        //硬件的一些基本信息
        /**
         * ______________新版、旧版没法控制温度计__________________
         * newArr[3]、newArr[4]、newArr[5]、newArr[6]是蓝牙温度计的修正系数
         * newArr[7] 无操作关机时间
         * newArr[8] 背光时间
         * newArr[9] 是否提示音    ：00代表无提示音，11代表有提示音
         * newArr[10] 测量单位    01代表℃，00代表℉
         */

        let hardSet = electronStore.get(
          `${storage.userId}-hardwareConfiguration`
        );
        console.log('--hardSet--', hardSet);
        if (!hardSet) {
          hardSet = {
            isHua: true,
            is15: true,
            self_tarting: false, //自启动
            isBacklight: true,
            isBeep: true,
            backlightTimer: { length: 140, number: "45" },
            autoOff: { length: 0, number: "30" },
          };
        }
        let { isHua, is15, self_tarting, isBacklight, isBeep, backlightTimer, autoOff } = hardSet

        let beep = isBeep ? "11" : "00";
        let unit = isHua ? "00" : "01";
        let autoOffNumber = autoOff.number
        let backlightTimerNumber = isBacklight ? backlightTimer.number : '00'
        if (
          dataArr1[7] === autoOffNumber &&
          dataArr1[8] === backlightTimerNumber &&
          dataArr1[9] === beep &&
          dataArr1[10] === unit
        ) {
        } else {
          let setArr = ["03", "ed", "07", "dd", autoOffNumber, backlightTimerNumber, beep, unit,];
          console.log('不相同，我要去发送配置');
          sendData("21", setArr)
        }
      },
      238: () => {
        //探头松动
        console.log("探头松动");
        message.error(
          "The probe is loose, please re-install and measure again",
          5
        );
      },

      98: () => {
        //蓝牙连接断开
        console.log(
          "断开连接---断开连接---断开连接---断开连接---断开连接---断开连接"
        );
        firstEar = true;
        // console.log(new Date() - is97Time);
        if (new Date() - is97Time < 1300) {
          return;
        }
        _disconnect_to_mella();
      },
      97: () => {
        //蓝牙连接
        console.log(
          "连接成功---连接成功---连接成功---连接成功---连接成功---连接成功"
        );

        //ipcRenderer.send("usbdata", { command: "31", arr: ["5A"] });



        is97Time = new Date();
        _connect_to_mella();
      },
      177: () => {
        //探头id
        let dataArr1 = newArr.map((item) => {
          if (item.toString(16).length < 2) {
            return "0" + item.toString(16);
          } else {
            return item.toString(16);
          }
        });

        let id = "";
        for (let i = 3; i < dataArr1.length - 2; i++) {
          id += dataArr1[i];
        }
        // console.log(id, dataArr1[7]);
        setMellaDeviceIdFun(id);
        // this.setState({
        //   probeID: id,
        //   petVitalTypeId: dataArr1[7]
        // })
        if (dataArr1[7] === "01") {
          if (mellaMeasurePart !== "腋温") {
            setMellaMeasurePartFun("腋温");
          }
        } else if (dataArr1[7] === "02") {
          if (mellaMeasurePart !== "肛温") {
            setMellaMeasurePartFun("肛温");
          }
        } else if (dataArr1[7] === "03") {
          if (mellaMeasurePart !== "耳温") {
            setMellaMeasurePartFun("耳温");
          }
        }
      },

    };
    if (instruction.indexOf(newArr[2]) !== -1) {
      return commandArr[newArr[2]];
    } else {
      return () => {
        console.log("没有控制命令", commandArr);
      };
    }
  };



















  useEffect(() => {
    saveCallBack.current = callBack;
    if (value === 105 && timeNum !== 60) {
      prediction();
    } else if (value === 105 && timeNum === 60) {
      let ipcRenderer = window.electron.ipcRenderer;
      const timeID = setTimeout(() => {
        ipcRenderer.send("usbdata", { command: "41", arr: [] });
        clearTimeout(timeID);
      }, 10);
    }
    return () => { };
  }, [value]);

  useEffect(() => {
    const tick = () => {
      saveCallBack.current();
    };
    let timer = null;
    if (mellaConnectStatus === "isMeasuring") {
      setValue(0);
      timer = setInterval(tick, 1000);
    } else if (value > 100 || mellaConnectStatus === "complete") {
      clearInterval(timer);
    } else if (mellaConnectStatus === "disconnected") {
      setValue(0);
    };
    if (mellaConnectStatus === "complete") {
      // let ipcRenderer = window.electron.ipcRenderer;
      // ipcRenderer.send("keyboardWriting", mellaMeasureValue);
    }
    return () => {
      clearInterval(timer);
    };
  }, [mellaConnectStatus]);

  useEffect(() => {
    setColor(changeThemeColor(selectHardwareType));
  }, [selectHardwareType]);

  return (
    <div className="headerBox">
      <Header style={{ background: "#fff", height: '100%' }}>
        {_.isEmpty(petId) && !isWalkIn ? (
          <></>
        ) : (
          <Row className="heardRow" >
            {/*头部左侧 */}
            <Col flex={10}>
              {isWalkIn ? (
                <span className="walkInTitle">Walk-In</span>
              ) : (
                <Dropdown overlay={cardItem} trigger={["click"]}>
                  <div
                    className="petMessageBox"
                    onClick={(e) => e.preventDefault()}
                  >
                    {petPicture(40)}
                    <div className="petMessageBox">
                      <p className="petName">
                        {!_.isEmpty(petMessage.patientId)
                          ? petMessage.patientId
                          : "unknown"}
                        ,{" "}
                        {!_.isEmpty(petMessage.petName)
                          ? petMessage.petName
                          : "unknown"}
                      </p>
                      <DownOutlined
                        style={{ fontSize: "22px", marginLeft: "10px" }}
                      />
                    </div>
                  </div>
                </Dropdown>
              )}
            </Col>
            {/*头部右侧 */}
            <Col flex={1}>
              <div className="linkStateImageBox">{isConnect()}</div>
            </Col>
          </Row>
        )}
      </Header>
    </div>
  );
};
export default connect(
  (state) => ({
    petMessage: state.petReduce.petDetailInfo,
    hardwareMessage: state.hardwareReduce,
    mellaPredictReturnValue: state.hardwareReducemellaPredictReturnValue
  }),
  {
    selectHardwareModalShowFun,
    petSortTypeFun,
    petDetailInfoFun,
    setMellaConnectStatusFun,
    setMellaMeasureValueFun,
    setMellaPredictValueFun,
    setMellaMeasurePartFun,
    setMellaPredictReturnValueFun,
    setMellaDeviceIdFun
  }
)(HeaderItem);
