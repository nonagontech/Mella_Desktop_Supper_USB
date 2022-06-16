

import React, { Component, } from 'react'
import { connect } from 'react-redux';
import Heard from '../../utils/heard/Heard'
import { mTop, px, pX, win, timerFun } from '../../utils/px';
import HardAndPetsUI from './HardAndPetsUI';
import HardWareTypeUI from './hardWareTypeUI';
import TemperaturePage from '../../pages/temperaturePage'
import {
  selectHardwareModalShowFun,
  setIsHaveUsbDeviceFun,
  setMellaConnectStatusFun,
  setMellaMeasureValueFun,
  setMellaPredictValueFun,
  setMellaMeasurePartFun,
  setMellaDeviceIdFun
} from '../../store/actions';
import './mainbody.less'
import { message } from 'antd';
import electronStore from '../../utils/electronStore';
import AddDevice from './AddDevice';
import BiggiePage from '../../pages/biggiePage';

let ipcRenderer = window.require('electron').ipcRenderer
let isMeasure = false //是否正在测量,用于判断是否需要发送指定指令给USB,查看硬件是否连接
let initTime = 0 //初始化时间,用来计算底座没有回应温度计的时间差,如果时间差大于6秒代表断开连接
let num07 = 0       //接收到07命令行的次数,次数大于3跳出弹框
let firstEar = true  //为true代表一组数据测量完成,下组测量数据
let is97Time = null //为了防抖，因为有时候断开连接和连接成功总是连续的跳出来，展示就会一直闪烁，因此引入时间差大于800ms才展示

//用于预测的东西
let clinicalYuce = [], clinicalIndex = 0

let storage = window.localStorage;
class App extends Component {
  state = {
    //body部分窗口高度
    bodyHeight: 0,
    //本地保存的硬件类型数组
    devicesTypeList: [],
    //展示硬件类型的数组
    showHardWareTypeList: [],
    //是否有USB设备
    isHaveUsbDevice: false,
    //mella温度计测量状态
    mellaMeasureStatus: 'disconnected', //connected,disconnected,isMeasuring,complete
  }
  componentDidMount() {
    ipcRenderer.send('big', win())
    timerFun()
    ipcRenderer.on('changeFenBianLv', this.changeFenBianLv)
    //获取窗口高度
    this.resize()
    //react监听屏幕窗口改变
    window.addEventListener('resize', this.resize)

    //获取设备类型
    this.getDevicesType()

    //检测USB设备发来的信息
    ipcRenderer.on('sned', this._send)
    //检测是否有USB设备
    ipcRenderer.on('noUSB', this._noUSB)
    //定时查看mella温度计是否与底座连接或断开
    this._whether_to_connect_to_mella()
  }
  componentWillUnmount() {
    //组件销毁，取消监听
    window.removeEventListener('resize', this.resize)
    ipcRenderer.removeListener('changeFenBianLv', this.changeFenBianLv)
    ipcRenderer.removeListener('sned', this._send)
    ipcRenderer.removeListener('noUSB', this._noUSB)
  }
  changeFenBianLv = (e) => {

    let ipcRenderer = window.electron.ipcRenderer
    // ipcRenderer.send('small')
    ipcRenderer.send('big', win())
    this.setState({

    })
  }
  //检测USB设备发来的信息
  _send = (e, data) => {
    console.log('检测USB设备发来的信息', data)
    //data就是测量的数据，是十进制的数字
    this.command(data)()

  }
  //监听是否有USB设备,true代表没有USB设备，false代表有USB设备
  _noUSB = (e, data) => {
    console.log('监听是否有USB设备', data);
    if (data === this.props.isHaveUsbDevice) {
      this.props.setIsHaveUsbDeviceFun(!data)
    }
    if (data === this.state.isHaveUsbDevice) {
      this.setState({
        isHaveUsbDevice: !data
      })
    }
  }
  //监听mella温度计是否与底座连接或断开
  _whether_to_connect_to_mella = () => {
    console.log('监听mella温度计是否与底座连接或断开');
    message.destroy()
    this.detectTimer && clearInterval(this.detectTimer)
    //2秒检测一次
    this.detectTimer = setInterval(() => {
      //如果正在测量或者没有USB设备，不检测
      if (isMeasure || !this.state.isHaveUsbDevice) {
        return
      }
      //让底座发送查询温度计信息指令
      ipcRenderer.send('usbdata', { command: '07', arr: ['5A'] })
      //如果底座没有回应，则计算时间差,时间差大于5秒，则没与温度计连接
      if (new Date() - initTime > 6000) {
        this._disconnect_to_mella()
      } else {

      }
    }, 2000)
  }
  //底座与温度计断开连接
  _disconnect_to_mella = () => {
    let { setMellaConnectStatusFun, mellaConnectStatus, setMellaDeviceIdFun } = this.props
    if (mellaConnectStatus !== 'disconnected') {
      setMellaConnectStatusFun('disconnected')
    }
    setMellaDeviceIdFun('')

  }
  //底座与温度计连接
  _connect_to_mella = () => {
    let { setMellaConnectStatusFun, mellaConnectStatus } = this.props
    if (mellaConnectStatus !== 'connected') {
      setMellaConnectStatusFun('connected')
    }
  }

  // newArr 指的是十进制数字数组，   dataArr1:指的是16进制字符串数组
  command = (newArr) => {
    let dataArr1 = newArr.map(item => {
      if (item.toString(16).length < 2) {
        return '0' + item.toString(16)
      } else {
        return item.toString(16)
      }
    })
    //除了255,其他都是温度计的数据
    let { setMellaConnectStatusFun, setMellaMeasureValueFun, setMellaPredictValueFun, setMellaMeasurePartFun, mellaMeasurePart, mellaConnectStatus } = this.props

    const instruction = [209, 193, 192, 129, 135, 238, 98, 97, 130, 208, 177, 194, 7, 99, 255, 182]

    if (newArr[2] !== 7 && newArr[2] !== 255 && newArr[2] !== 182) {

      initTime = new Date()
      num07 = 0
      if (mellaConnectStatus === 'disconnected') {
        this._connect_to_mella()
      }
    } else {
      num07++
    }

    const commandArr = {
      209: () => {  //腋温
        //第一次测量去获取探头ID
        if (firstEar) {
          firstEar = false
          console.log('去获取探头id');
          ipcRenderer.send('usbdata', { command: '31', arr: [] })
          //重新测量,清空预测值
          clinicalYuce = []
          clinicalIndex = 0

        }
        let temp1 = parseFloat(`${dataArr1[3]}.${(dataArr1[4])}`)
        let temp0 = parseFloat(`${dataArr1[5]}.${(dataArr1[6])}`)
        let Temp = temp0
        if (Temp === 24.7 || Temp === 0 || Temp === null || Temp === undefined) {
          return
        }
        let dataS = {
          sample: clinicalIndex++,
          data0: temp0,
          data1: temp1
        }
        clinicalYuce.push(dataS)
        if (clinicalYuce.length >= 30) {
          setMellaPredictValueFun(clinicalYuce)
        }
        setMellaMeasureValueFun(Temp)
        if (mellaConnectStatus !== 'isMeasuring') {
          setMellaConnectStatusFun('isMeasuring')
        }

        if (mellaMeasurePart !== '腋温' || mellaMeasurePart !== '肛温') {
          setMellaMeasurePartFun('腋温')
        }




      },
      208: () => {  //耳温

        if (firstEar) {
          firstEar = false
          ipcRenderer.send('usbdata', { command: '31', arr: [] })
          //重新测量,清空预测值
          clinicalYuce = []
          clinicalIndex = 0
        }
        //现在探头0可能不存在，所以把探头0改为探头1
        let temp0 = parseFloat(`${dataArr1[7]}.${(dataArr1[8])}`)
        let Temp = temp0
        setMellaMeasureValueFun(Temp)
        if (mellaConnectStatus !== 'isMeasuring') {
          setMellaConnectStatusFun('isMeasuring')
        }

        if (mellaMeasurePart !== '耳温') {
          setMellaMeasurePartFun('耳温')
        }



      },
      193: () => {  //指令结束\自动结束后\温度计收到预测数据后温度计返回值,结束后可能还会粘一组测量中的数据
        //为了清除黏贴的数据，使用定时器
        this.time193 && clearTimeout(this.time193)
        this.time193 = setTimeout(() => {
          firstEar = true
          if (mellaConnectStatus !== 'complete') {
            setMellaConnectStatusFun('complete')
          }

          let { units } = this.state
          let Temp = this.props.mellaMeasureValue
          let temp = units === '℉' ? parseInt((Temp * 1.8 + 32) * 10) / 10 : Temp.toFixed(1)
          // if (this.state.devicesType === 'mella') {
          //   ipcRenderer.send('keyboardWriting', temp)
          // }
          this.time193 && clearTimeout(this.time193)

        }, 1000);


      },
      194: () => {       //硬件收到机器学习结果并停止测量，
        if (mellaConnectStatus !== 'complete') {
          setMellaConnectStatusFun('complete')
        }
        clinicalYuce = []
        clinicalIndex = 0

      },
      192: () => {   //温度计收到40开始数据后返回的指令
        switch (newArr[3]) {
          case 90: console.log('有探头，开始测量的返回指令·'); break;
          case 11: console.log('没有探头，开始测量的返回值'); break;

        }
      },
      129: () => {      //返回硬件版本号
        console.log(`返回的版本号为${newArr[3]}`);
      },
      135: () => {          //硬件的一些基本信息
        /**
         * ______________新版、旧版没法控制温度计__________________
         * newArr[3]、newArr[4]、newArr[5]、newArr[6]是蓝牙温度计的修正系数
         * newArr[7] 无操作关机时间
         * newArr[8] 背光时间
         * newArr[9] 是否提示音    ：00代表无提示音，11代表有提示音
         * newArr[10] 测量单位    01代表℃，00代表℉
         */

        let hardSet = electronStore.get('hardwareConfiguration') || {}

        let beep = hardSet.isBeep ? '11' : '00'
        let unit = hardSet.isHua ? '00' : '01'

        // if (dataArr1[7] === hardSet.autoOff.number && dataArr1[8] === hardSet.backlightTimer.number &&
        //   dataArr1[9] === beep && dataArr1[10] === unit) {
        // } else {
        //   console.log('不相同，去发送命令');
        //   let setArr = ['03', 'ed', '07', 'dd', hardSet.autoOff.number, hardSet.isBacklight ? hardSet.backlightTimer.number : '00', hardSet.isBeep ? '11' : '00', hardSet.isHua ? '00' : '01']
        //   ipcRenderer.send('usbdata', { command: '21', arr: setArr })
        // }


      },
      238: () => {     //探头松动
        console.log('探头松动');
        message.error('The probe is loose, please re-install and measure again', 5)

      },

      98: () => { //蓝牙连接断开
        console.log('断开连接---断开连接---断开连接---断开连接---断开连接---断开连接');
        firstEar = true
        console.log(new Date() - is97Time);
        if (new Date() - is97Time < 1000) {
          return
        }
        this._disconnect_to_mella()

      },
      97: () => {       //蓝牙连接
        console.log('连接成功---连接成功---连接成功---连接成功---连接成功---连接成功');

        is97Time = new Date()
        this._connect_to_mella()
      },
      177: () => {         //探头id
        let dataArr1 = newArr.map(item => {
          if (item.toString(16).length < 2) {
            return '0' + item.toString(16)
          } else {
            return item.toString(16)
          }
        })


        let id = ''
        for (let i = 3; i < dataArr1.length - 2; i++) {
          id += dataArr1[i]

        }
        console.log(id, dataArr1[7]);
        setMellaDeviceIdFun(id)
        // this.setState({
        //   probeID: id,
        //   petVitalTypeId: dataArr1[7]
        // })
        if (dataArr1[7] === '01') {
          if (mellaMeasurePart !== "腋温") {
            setMellaMeasurePartFun('腋温')
          }
        } else if (dataArr1[7] === '02') {
          if (mellaMeasurePart !== "肛温") {
            setMellaMeasurePartFun('肛温')
          }
        } else if (dataArr1[7] === '03') {
          if (mellaMeasurePart !== "耳温") {
            setMellaMeasurePartFun('耳温')
          }
        }



      },
      7: () => {  //发什么收什么，需要去重新插拔底座
        console.log('重新插拔底座');
        if (num07 === 3 && this.state.err07Visible === false) {
          this.setState({
            err07Visible: true
          })
        }
      },
      // 255: () => {

      // }
      255: () => {

        let length = newArr.length
        let frameLength = newArr[1]   //帧长
        let itemLength = newArr[3] + 1  //数据位的长度   13
        let dataIndex = 0

        let bluName = ''
        let bluData = []
        while (itemLength < length && (itemLength + 3 <= frameLength)) {
          let itemData = []
          for (let i = 0; i < newArr[dataIndex + 3] - 1; i++) {
            itemData.push(dataArr1[i + dataIndex + 5])
          }
          // console.log('--剪切的数据---', itemData);
          switch (newArr[dataIndex + 4]) {
            case 9:
            case 8:
              let str = ''
              for (let i = 0; i < itemData.length; i++) {
                let item = parseInt(itemData[i], 16)
                str += String.fromCharCode(item)

              }
              bluName = str
              // console.log('--蓝牙名称:', bluName);


              break;

            case 255:
              bluData = itemData
              break;
            case 7: console.log('---UUID'); break;
            case 239:
              // console.log('---mac地址'); 
              break;

            case 3: console.log('----尺子的,不知道什么用'); break;

            default: console.log('直接跳出循环'); return;
          }
          dataIndex = itemLength
          itemLength = itemLength + newArr[dataIndex + 3] + 1
        }
        console.log('硬件名称', bluName, '-----硬件数据', bluData);

        // if (bluName.indexOf('C19') !== -1 && bluData.length > 10) {

        //   let weight = `0x${bluData[10]}${bluData[11]}`
        //   let impedance = `0x${bluData[12]}${bluData[13]}`
        //   let sendWeight = null
        //   try {
        //     //sendWeight的值单位是kg,weight的值为lb(磅)
        //     sendWeight = parseInt(weight) / 100
        //     weight = parseInt(weight) / 100 * 2.2046
        //     if (impedance) {
        //       impedance = parseInt(impedance)
        //     }
        //     weight = weight.toFixed(1)

        //   } catch (error) {
        //     console.log(error);
        //   }
        //   // console.log('----秤', weight, impedance);

        //   if (weight) {
        //     // console.log(sameBiggieNum, keyboardBiggieFlog);
        //     if (weight === this.state.biggieDate && this.state.devicesType === 'biggie') {

        //       sameBiggieNum++
        //       if (!keyboardBiggieFlog && sameBiggieNum === 6) {
        //         console.log('键盘写入');
        //         let { units, sendWeight, biggieDate } = this.state

        //         let weight = units === '℃' ? sendWeight : biggieDate
        //         ipcRenderer.send('keyboardWriting', weight)
        //       }

        //     } else {
        //       sameBiggieNum = 0
        //       keyboardBiggieFlog = false
        //     }

        //     this.setState({
        //       biggieDate: weight,
        //       impedance,
        //       sendWeight,
        //       isHaveBigieDate: true
        //     })
        //   }
        // } else if (bluName.indexOf('Tape') !== -1) {

        //   let confirmBtn = parseInt(bluData[8], 16)     //十进制数字，值为160代表尺子拉动，值为161代表按了尺子确认按钮
        //   let rulerUnitNum = parseInt(bluData[13], 16) //十进制数字，值大于等于80代表单位为in，小于80代表单位为cm
        //   let newVal = null             //为测量数值，和单位匹配对应
        //   const ITEMINDEX = 7
        //   let units = rulerUnitNum >= 80 ? 'in' : 'cm'

        //   //num1和num2组成测得的测量值，num的值为测量数值，单位恒为厘米
        //   let num1 = bluData[9]
        //   let num2 = bluData[10]
        //   let num = getVal(num1, num2)
        //   try {
        //     newVal = (parseInt(num) / 100)
        //     if (newVal < 3) {
        //       newVal = 0
        //     }

        //     if (rulerUnitNum >= 80) {
        //       newVal = (newVal * 0.3937).toFixed(2)

        //     } else {
        //       newVal = newVal.toFixed(1)
        //     }
        //   } catch (error) {
        //     console.log(error);
        //   }



        //   function getVal(shi, xiaoshuo) {

        //     if (shi.length < 2) {
        //       shi = `0${shi}`
        //     }
        //     if (xiaoshuo.length < 2) {
        //       xiaoshuo = `0${xiaoshuo}`
        //     }
        //     return `0x${shi}${xiaoshuo}`
        //   }

        //   //点击了确认按钮
        //   let { itemIndex, l2rarmDistance, neckCircumference, upperTorsoCircumference, lowerTorsoCircumference,
        //     h2tLength, torsoLength
        //   } = this.state
        //   if (confirmBtn === 161) {
        //     if (!nextFlog) {
        //       nextFlog = true

        //       if (itemIndex === ITEMINDEX) {
        //         this._updatePetAttributes()
        //         return
        //       }
        //       let newitemIndex = itemIndex >= ITEMINDEX ? 1 : itemIndex + 1

        //       let textValue = ''
        //       switch (itemIndex) {
        //         case 1: textValue = l2rarmDistance; break;
        //         case 2: textValue = h2tLength; break;
        //         case 3: textValue = torsoLength; break;
        //         case 4: textValue = neckCircumference; break;
        //         case 5: textValue = upperTorsoCircumference; break;
        //         case 6: textValue = lowerTorsoCircumference; break;
        //         default:
        //           break;
        //       }

        //       if (newVal !== textValue && parseInt(newVal) > 0) {
        //         switch (itemIndex) {
        //           case 1: this.setState({ l2rarmDistance: newVal, itemIndex: newitemIndex, rulerUnit: units }); break;
        //           case 2: this.setState({ h2tLength: newVal, itemIndex: newitemIndex, rulerUnit: units }); break;
        //           case 3: this.setState({ torsoLength: newVal, itemIndex: newitemIndex, rulerUnit: units }); break;
        //           case 4: this.setState({ neckCircumference: newVal, itemIndex: newitemIndex, rulerUnit: units }); break;
        //           // case 5: this.setState({ bodyWidth: newVal, itemIndex: newitemIndex, units }); break;
        //           case 5: this.setState({ upperTorsoCircumference: newVal, itemIndex: newitemIndex, rulerUnit: units }); break;
        //           case 6: this.setState({ lowerTorsoCircumference: newVal, itemIndex: newitemIndex, rulerUnit: units }); break;
        //           default: this.setState({
        //             itemIndex: newitemIndex
        //             , rulerUnit: units
        //           })
        //             break;
        //         }
        //       } else {
        //         this.setState({
        //           itemIndex: newitemIndex,
        //           rulerUnit: units
        //         })
        //       }



        //     }
        //   } else if (confirmBtn === 160) {
        //     nextFlog = false
        //     let textValue = ''


        //     switch (itemIndex) {
        //       case 1: textValue = l2rarmDistance; break;
        //       case 2: textValue = h2tLength; break;
        //       case 3: textValue = torsoLength; break;
        //       case 4: textValue = neckCircumference; break;
        //       case 5: textValue = upperTorsoCircumference; break;
        //       case 6: textValue = lowerTorsoCircumference; break;
        //     }

        //     if (newVal !== textValue && parseInt(newVal) > 0) {
        //       if (!avoidRepetition) {
        //         avoidRepetition = true
        //         this.avoidRepetition = setTimeout(() => {
        //           avoidRepetition = false
        //           this.avoidRepetition && clearTimeout(this.avoidRepetition)
        //         }, 100);
        //         switch (itemIndex) {
        //           case 1: this.setState({ l2rarmDistance: newVal, rulerUnit: units }); break;
        //           case 2: this.setState({ h2tLength: newVal, rulerUnit: units }); break;
        //           case 3: this.setState({ torsoLength: newVal, rulerUnit: units }); break;
        //           case 4: this.setState({ neckCircumference: newVal, rulerUnit: units }); break;
        //           case 5: this.setState({ upperTorsoCircumference: newVal, rulerUnit: units }); break;
        //           case 6: this.setState({ lowerTorsoCircumference: newVal, rulerUnit: units }); break;
        //           default:
        //             break;
        //         }
        //       }
        //     }
        //   }

        // } else if (bluName.indexOf('Mella Measure') !== -1 && this.state.devicesType === 'biggie') {
        //   //255
        //   let { itemIndex, l2rarmDistance, neckCircumference, upperTorsoCircumference, lowerTorsoCircumference,
        //     h2tLength, torsoLength
        //   } = this.state
        //   // console.log('结束循环蓝牙名称', bluData)
        //   let confirmBtn = bluData[8]     //十六进制数字，值为01代表尺子拉动，值为x2代表按了尺子确认按钮

        //   let rulerUnitNum = parseInt(bluData[11], 16) //十进制数字，值等于11代表单位为in，00代表单位为cm
        //   let newVal = null             //为测量数值，和单位匹配对应
        //   const ITEMINDEX = 6
        //   let units = rulerUnitNum === 0 ? 'cm' : 'in'


        //   if (units !== this.state.rulerUnit) {
        //     if (units === 'cm') {
        //       l2rarmDistance = l2rarmDistance ? `${(parseFloat(l2rarmDistance) * 2.54).toFixed(1)}` : ''
        //       neckCircumference = neckCircumference ? `${(parseFloat(neckCircumference) * 2.54).toFixed(1)}` : ''
        //       upperTorsoCircumference = upperTorsoCircumference ? `${(parseFloat(upperTorsoCircumference) * 2.54).toFixed(1)}` : ''
        //       lowerTorsoCircumference = lowerTorsoCircumference ? `${(parseFloat(lowerTorsoCircumference) * 2.54).toFixed(1)}` : ''
        //       h2tLength = h2tLength ? `${(parseFloat(h2tLength) * 2.54).toFixed(1)}` : ''
        //       torsoLength = torsoLength ? `${(parseFloat(torsoLength) * 2.54).toFixed(1)}` : ''
        //     } else {
        //       l2rarmDistance = l2rarmDistance ? `${(parseFloat(l2rarmDistance) / 2.54).toFixed(2)}` : ''
        //       neckCircumference = neckCircumference ? `${(parseFloat(neckCircumference) / 2.54).toFixed(2)}` : ''
        //       upperTorsoCircumference = upperTorsoCircumference ? `${(parseFloat(upperTorsoCircumference) / 2.54).toFixed(2)}` : ''
        //       lowerTorsoCircumference = lowerTorsoCircumference ? `${(parseFloat(lowerTorsoCircumference) / 2.54).toFixed(2)}` : ''
        //       h2tLength = h2tLength ? `${(parseFloat(h2tLength) / 2.54).toFixed(2)}` : ''
        //       torsoLength = torsoLength ? `${(parseFloat(torsoLength) / 2.54).toFixed(2)}` : ''
        //     }

        //     this.setState({
        //       l2rarmDistance, neckCircumference, upperTorsoCircumference, lowerTorsoCircumference,
        //       h2tLength, torsoLength,
        //       rulerUnit: units
        //     })


        //   }

        //   //num1和num2组成测得的测量值，num的值为测量数值，单位恒为厘米
        //   let num1 = bluData[9]
        //   let num2 = bluData[10]
        //   let num = getVal(num1, num2)
        //   try {
        //     newVal = parseFloat(num)
        //     if (rulerUnitNum === 17) {
        //       newVal = newVal.toFixed(2)

        //     } else {
        //       newVal = newVal.toFixed(1)
        //     }
        //   } catch (error) {
        //     console.log(error);
        //   }



        //   function getVal(shi, xiaoshuo) {
        //     let num1 = parseInt(shi, 16)
        //     let num2 = parseInt(xiaoshuo, 16)

        //     return `${num1}.${num2}`
        //   }

        //   //点击了确认按钮

        //   if (confirmBtn[1] === '2' && confirmBtn[0] !== confirmBtnFlog) {
        //     confirmBtnFlog = confirmBtn[0]
        //     if (!nextFlog) {
        //       nextFlog = true

        //       if (itemIndex === ITEMINDEX) {
        //         this._updatePetAttributes()
        //         return
        //       }
        //       let newitemIndex = itemIndex >= ITEMINDEX ? 1 : itemIndex + 1

        //       let textValue = ''
        //       try {
        //         switch (itemIndex) {
        //           case 1: textValue = l2rarmDistance; this.input2 && this.input2.focus(); break;
        //           case 2: textValue = h2tLength; this.input3 && this.input3.focus(); break;
        //           case 3: textValue = torsoLength; this.input4 && this.input4.focus(); break;
        //           case 4: textValue = neckCircumference; this.input5 && this.input5.focus(); break;
        //           case 5: textValue = upperTorsoCircumference; this.input6 && this.input6.focus(); break;
        //           case 6: textValue = lowerTorsoCircumference; this.input7 && this.input7.focus(); break;
        //           default:
        //             break;
        //         }
        //       } catch (error) {
        //         console.log(error);
        //       }




        //       if (newVal !== textValue && parseInt(newVal) >= 0) {
        //         switch (itemIndex) {
        //           case 1: this.setState({ l2rarmDistance: newVal, itemIndex: newitemIndex, rulerUnit: units }); break;
        //           case 2: this.setState({ h2tLength: newVal, itemIndex: newitemIndex, rulerUnit: units }); break;
        //           case 3: this.setState({ torsoLength: newVal, itemIndex: newitemIndex, rulerUnit: units }); break;
        //           case 4: this.setState({ neckCircumference: newVal, itemIndex: newitemIndex, rulerUnit: units }); break;
        //           // case 5: this.setState({ bodyWidth: newVal, itemIndex: newitemIndex, units }); break;
        //           case 5: this.setState({ upperTorsoCircumference: newVal, itemIndex: newitemIndex, rulerUnit: units }); break;
        //           case 6: this.setState({ lowerTorsoCircumference: newVal, itemIndex: newitemIndex, rulerUnit: units }); break;
        //           default: this.setState({
        //             itemIndex: newitemIndex
        //             , rulerUnit: units
        //           })
        //             break;
        //         }
        //       } else {
        //         this.setState({
        //           itemIndex: newitemIndex,
        //           rulerUnit: units
        //         })
        //       }



        //     }
        //   } else if (confirmBtn === '01') {
        //     nextFlog = false
        //     let textValue = ''


        //     switch (itemIndex) {
        //       case 1: textValue = l2rarmDistance; break;
        //       case 2: textValue = h2tLength; break;
        //       case 3: textValue = torsoLength; break;
        //       case 4: textValue = neckCircumference; break;
        //       case 5: textValue = upperTorsoCircumference; break;
        //       case 6: textValue = lowerTorsoCircumference; break;
        //     }

        //     if (newVal !== textValue && parseInt(newVal) >= 0) {
        //       if (!avoidRepetition) {
        //         avoidRepetition = true
        //         this.avoidRepetition = setTimeout(() => {
        //           avoidRepetition = false
        //           this.avoidRepetition && clearTimeout(this.avoidRepetition)
        //         }, 100);
        //         try {
        //           switch (itemIndex) {
        //             case 1: this.setState({ l2rarmDistance: newVal, rulerUnit: units }); this.input1 && this.input1.focus(); break;
        //             case 2: this.setState({ h2tLength: newVal, rulerUnit: units }); this.input2 && this.input2.focus(); break;
        //             case 3: this.setState({ torsoLength: newVal, rulerUnit: units }); this.input3 && this.input3.focus(); break;
        //             case 4: this.setState({ neckCircumference: newVal, rulerUnit: units }); this.input4 && this.input4.focus(); break;
        //             case 5: this.setState({ upperTorsoCircumference: newVal, rulerUnit: units }); this.input5 && this.input5.focus(); break;
        //             case 6: this.setState({ lowerTorsoCircumference: newVal, rulerUnit: units }); this.input6 && this.input6.focus(); break;
        //             default:
        //               break;
        //           }
        //         } catch (error) {
        //           console.log(error);
        //         }

        //       }
        //     }
        //   }

        // }




        // else if (bluName.indexOf('Biggie') !== -1 && this.state.devicesType === 'biggie' && bluData.length > 10) {
        //   function getVal(shi) {
        //     if (`${shi}`.length < 2) {
        //       return `0${shi}`
        //     }
        //     return `${shi}`

        //   }

        //   let newArr = bluData

        //   let weight = `${getVal(newArr[9].toString(16))}${getVal(newArr[10].toString(16))}`
        //   weight = parseInt(weight, 16)


        //   let impedance = `${getVal(newArr[12].toString(16))}${getVal(newArr[13].toString(16))}`
        //   impedance = parseInt(impedance, 16)

        //   let arr11 = getVal(newArr[11].toString(16))

        //   weight = weight / Math.pow(10, parseInt(arr11[0]))
        //   // console.log('重量为', weight);
        //   let weightUnits = 'kg'
        //   let sendWeight, biggieDate
        //   switch (arr11[1]) {
        //     case '0':
        //       weightUnits = 'kg';
        //       sendWeight = weight;
        //       biggieDate = (weight * 2.2046).toFixed(2)
        //       break;
        //     case '1':
        //       weightUnits = 'lb';
        //       sendWeight = weight;
        //       biggieDate = (weight * 2).toFixed(2)
        //       break;
        //     default:
        //       break;
        //   }


        //   if (weight === this.state.biggieDate && this.state.devicesType === 'biggie') {

        //     sameBiggieNum++
        //     if (!keyboardBiggieFlog && sameBiggieNum === 6) {
        //       console.log('键盘写入');
        //       let { units, } = this.state

        //       let weight = units === '℃' ? sendWeight : biggieDate
        //       ipcRenderer.send('keyboardWriting', weight)
        //     }

        //   } else {
        //     sameBiggieNum = 0
        //     keyboardBiggieFlog = false
        //   }



        //   if (weight >= 0) {

        //     this.setState({
        //       biggieDate,
        //       impedance,
        //       sendWeight,
        //       isHaveBigieDate: true
        //     })
        //   }






        // }
      }
      ,
      182: () => {
        console.log('打开了底座通信');
      }




    }
    if (instruction.indexOf(newArr[2]) !== -1) {
      return commandArr[newArr[2]]
    } else {
      return () => {
        console.log('没有控制命令', commandArr);
      }
    }
  }

  testCheck = (arr) => {
    if (arr.length < 7) {
      return false
    }
    let i = 7
    let checkFloag = arr[i];


    for (i = 8; i < arr.length - 2; i++) {
      checkFloag = checkFloag ^ arr[i];
    }
    return checkFloag;
  }
  getMac = (arr) => {
    // console.log(arr);
    let str = arr[1].toString(16)
    if (str.length === 1) {
      str = '0' + str
    }
    for (let i = 2; i < 7; i++) {

      let item = arr[i].toString(16)
      if (item.length === 1) {
        item = '0' + item
      }
      str += `:${item}`
      // }


    }




    return str
  }




  //监听屏幕窗口改变
  resize = () => {
    let { offsetWidth, offsetHeight } = this.mainbody
    // console.log('resize', this.mainbody, { offsetWidth, offsetHeight });
    if (offsetHeight !== this.state.bodyHeight) {
      this.setState({
        bodyHeight: offsetHeight - px(50)
      })
    }
  }
  //获取设备类型
  getDevicesType = () => {
    // let devicesTypeList = [
    //   {
    //     type: 'mellaPro',
    //     devices: [
    //       {
    //         name: 'mellaPro',
    //         mac: '',
    //         deviceType: 'mellaPro',
    //         examRoom: '',
    //       }
    //     ]
    //   },
    //   {
    //     type: 'biggie',
    //     devices: [
    //       {
    //         name: 'biggie',
    //         mac: '',
    //         deviceType: 'biggie',
    //         examRoom: '',
    //       },
    //       {
    //         name: 'biggie002',
    //         mac: '1253',
    //         deviceType: 'biggie',
    //         examRoom: '',
    //       }
    //     ]
    //   },
    //   {
    //     type: 'otterEQ',
    //     devices: [
    //       {
    //         name: 'otterEQ',
    //         mac: '',
    //         deviceType: 'otterEQ',
    //         examRoom: '',
    //       }
    //     ]
    //   },

    //   {
    //     type: 'rfid',
    //     devices: [
    //       {
    //         name: 'rfid',
    //         mac: '',
    //         deviceType: 'rfid',
    //         examRoom: '',
    //       }
    //     ]
    //   },
    //   {
    //     type: 'tape',
    //     devices: [
    //       {
    //         name: 'tape',
    //         mac: '',
    //         deviceType: 'tape',
    //         examRoom: '',
    //       }
    //     ]
    //   },
    //   {
    //     type: 'maeBowl',
    //     devices: [
    //       {
    //         name: 'maeBowl',
    //         mac: '',
    //         deviceType: 'maeBowl',
    //         examRoom: '',
    //       }
    //     ]
    //   }
    // ]
    let devicesTypeList = electronStore.get(`${storage.lastOrganization}-${storage.userId}-devicesTypeList`) || []
    console.log('获取的设备列表', devicesTypeList);
    if (devicesTypeList.length === 0) {
      devicesTypeList.push(
        {
          type: 'mellaPro',
          devices: [
            {
              name: 'mellaPro',
              mac: '',
              deviceType: 'mellaPro',
              examRoom: '',
            }
          ]
        })

      devicesTypeList.push({
        type: 'biggie',
        devices: [
          {
            name: 'biggie',
            mac: '',
            deviceType: 'biggie',
            examRoom: '',
          },
          {
            name: 'biggie002',
            mac: '1253',
            deviceType: 'biggie',
            examRoom: '',
          }
        ]
      })

    }


    let showHardWareTypeList = [].concat(devicesTypeList)
    showHardWareTypeList.push({
      type: 'add',
      devices: []
    })


    this.setState({
      devicesTypeList,
      showHardWareTypeList
    })
  }
  body = () => {

    let { selectHardwareType } = this.props
    let { bodyHeight } = this.state
    let measurePage = null
    switch (selectHardwareType) {
      case 'mellaPro':
        measurePage = <TemperaturePage />

        break;
      case 'biggie':
        measurePage = <BiggiePage />

      default:
        break;
    }
    if (selectHardwareType === 'add') {
      return <AddDevice
        bodyHeight={bodyHeight}
      />
    } else {
      return (<>
        <HardAndPetsUI
          bodyHeight={bodyHeight}
        />
        {measurePage}
      </>)
    }
  }

  render() {
    let { bodyHeight } = this.state

    return (
      <div className='flex' id='mainbody'
        ref={(val) => this.mainbody = val}
        onClick={() => {
          if (this.props.selectHardwareModalShowFun) {
            this.props.selectHardwareModalShowFun(false)
          }
        }}
      >
        <Heard />
        <div
          className="mainbody-body"
        >

          <HardWareTypeUI
            bodyHeight={bodyHeight}
            devicesTypeList={this.state.showHardWareTypeList}
          />
          {this.body()}


        </div>
      </div>
    )
  }
}
export default connect(
  state => ({
    isHaveUsbDevice: state.hardwareReduce.isHaveUsbDevice,
    mellaConnectStatus: state.hardwareReduce.mellaConnectStatus,
    mellaMeasureValue: state.hardwareReduce.mellaMeasureValue,
    mellaMeasurePart: state.hardwareReduce.mellaMeasurePart,
    selectHardwareType: state.hardwareReduce.selectHardwareType,


  }),
  {
    selectHardwareModalShowFun,
    setIsHaveUsbDeviceFun,

    setMellaConnectStatusFun,
    setMellaMeasureValueFun,
    setMellaPredictValueFun,
    setMellaMeasurePartFun,
    setMellaDeviceIdFun
  }
)(App)
