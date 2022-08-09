
import React, { Component } from 'react'
import {
  Switch,
  Select,
  message
} from 'antd'




import Heart from '../../../utils/heard/Heard'
import Slider from '../../../utils/slider/Slider'
import Button from './../../../utils/button/Button'
import electronStore from './../../../utils/electronStore'
import temporaryStorage from './../../../utils/temporaryStorage'
import { mTop, px, win } from '../../../utils/px';
import MyModal from './../../../utils/myModal/MyModal'
import redJinggao from './../../../assets/img/redjinggao.png'
import './settings.less'

import SelectionBox from './../../../utils/selectionBox/SelectionBox'
const { Option } = Select;
let storage = window.localStorage

export default class Settings extends Component {

  state = {
    self_tarting: false,      //自启动，
    isHua: true,              //为true代表为华氏度，为false代表℃
    is15: true,               //腋温测量时长，为true则是15秒，为false则是35秒
    isClicleStudy: false,     //是否处于临床测试，为true则在处于，false则不处于
    isBacklight: true,        //是否开启背光，为true则是开启背光，为false则是关闭背光
    isBeep: true,             //是否开启蜂鸣器，为true则是开启蜂鸣器，反之则是关闭蜂鸣器
    backlightTimer: { length: 140, number: '45' },//背光时长，长度指的是在滑轨上面的距离，number指的是显示的秒数
    autoOff: { length: 0, number: '30' },  //无操作自动关机，长度指的是在滑轨上面的距离，number指的是关闭的秒数


    oldIsHua: true,
    oldIs15: true,
    oldIsBacklight: true,
    oldIsBeep: true,
    oldBacklightTimer: { length: 140, number: '45' },
    oldAutoOff: { length: 0, number: '30' },
    oldIsClicleStudy: false,

    isSave: false,

    num0: '',
    num1: '',
    num2: '',
    num3: '',
    num4: '',
    num5: '',
    verifyNum: '',

    maxLength: 1, //验证码长度
    valueA: "", //验证码第一位
    valueB: "", //二
    valueC: "", //三
    valueD: "", //四
    valueE: "", //5
    valueF: "", //6
    isClicleStudyModal: false
  }
  componentDidMount() {
    let ipcRenderer = window.electron.ipcRenderer
    let { height, width } = window.screen
    let windowsHeight = height > width ? width : height
    // if (windowsHeight < 900) {
    //   ipcRenderer.send('table', win())
    // } else {
    //   ipcRenderer.send('setting', win())
    // }
    ipcRenderer.send('big', win())
    //这里要根据保存的时候存到哪个位置的，然后拿出来更新state
    let hardSet = electronStore.get(`${storage.userId}-hardwareConfiguration`)
    console.log('----', hardSet);
    let isClicleStudy = storage.isClinical === 'true' ? true : false
    if (hardSet) {
      console.log('不是第一次进来，有设置的');
      let { isHua, is15, isBacklight, isBeep, backlightTimer, autoOff } = hardSet

      this.setState({
        isHua,
        is15,
        isBacklight,
        isBeep,
        backlightTimer,
        autoOff,
        // isClicleStudy: temporaryStorage.isClicleStudy,
        isClicleStudy,

        oldIsHua: isHua,
        oldIs15: is15,
        oldIsBacklight: isBacklight,
        oldIsBeep: isBeep,
        oldBacklightTimer: backlightTimer,
        oldAutoOff: autoOff,
        // oldIsClicleStudy: temporaryStorage.isClicleStudy,
        oldIsClicleStudy: isClicleStudy,

      })
    } else {
      let settings = {
        isHua: true,
        is15: true,
        self_tarting: false,  //自启动
        isBacklight: true,
        isBeep: true,
        backlightTimer: { length: 140, number: '45' },
        autoOff: { length: 0, number: '30' },
      }
      electronStore.set(`${storage.userId}-hardwareConfiguration`, settings)
      let { isHua, is15, isBacklight, isBeep, backlightTimer, autoOff } = settings
      this.setState({
        isHua,
        is15,
        isBacklight,
        isBeep,
        backlightTimer,
        autoOff,
        // isClicleStudy: temporaryStorage.isClicleStudy,
        isClicleStudy,

        oldIsHua: isHua,
        oldIs15: is15,
        oldIsBacklight: isBacklight,
        oldIsBeep: isBeep,
        oldBacklightTimer: backlightTimer,
        oldAutoOff: autoOff,
        // oldIsClicleStudy: temporaryStorage.isClicleStudy,
        oldIsClicleStudy: isClicleStudy


      })
    }

    ipcRenderer.on('changeFenBianLv', this.changeFenBianLv)

  }
  componentWillUnmount() {
    let ipcRenderer = window.electron.ipcRenderer

    ipcRenderer.removeListener('changeFenBianLv', this.changeFenBianLv)
  }
  changeFenBianLv = (e) => {
    console.log(e);
    let ipcRenderer = window.electron.ipcRenderer
    let { height, width } = window.screen
    let windowsHeight = height > width ? width : height
    if (windowsHeight < 900) {
      ipcRenderer.send('table', win())
    } else {
      ipcRenderer.send('big', win())
    }
    this.setState({

    })
  }

  _save = () => {
    console.log('点击保存');
    /**
     * 分别两部分保存保存，
     * 本地存储：程序自启动、测量单位、背光、蜂鸣器、背光时间、硬件自动关机时间、腋温测量时间
     * 临时存储：处于临床测试状态
     */
    this.setState({
      isSave: false
    })
    let { self_tarting, isHua, isClicleStudy, isBacklight, isBeep, backlightTimer, autoOff, is15 } = this.state
    // console.log({ self_tarting, isHua, isClicleStudy, isBacklight, isBeep, backlightTimer, autoOff, is15 });
    let settings = {
      isHua,
      is15,
      self_tarting,
      isBacklight,
      isBeep,
      backlightTimer,
      autoOff,
    }
    electronStore.set(`${storage.userId}-hardwareConfiguration`, settings)
    // temporaryStorage.isClicleStudy = isClicleStudy
    storage.isClinical = `${isClicleStudy}`
    let ipcRenderer = window.electron.ipcRenderer
    if (self_tarting) {
      ipcRenderer.send('openAutoStart')
    } else {
      ipcRenderer.send('closeAutoStart')
    }
    let setArr = ['03', 'ed', '07', 'dd', autoOff.number, isBacklight ? backlightTimer.number : '00', isBeep ? '11' : '00', isHua ? '00' : '01']
    console.log('setArr', setArr);



    ipcRenderer.send('usbdata', { command: '21', arr: setArr })

    this.props.history.goBack()
  }
  _goback = () => {
    console.log('返回');
    let { isHua, is15, isBacklight, isBeep, backlightTimer, autoOff, isClicleStudy,
      oldAutoOff, oldBacklightTimer, oldIs15, oldIsBacklight, oldIsBeep, oldIsClicleStudy, oldIsHua, } = this.state
    if (isHua !== oldIsHua || is15 !== oldIs15 || isBacklight !== oldIsBacklight || isBeep !== oldIsBeep || backlightTimer !== oldBacklightTimer
      || autoOff !== oldAutoOff || isClicleStudy !== oldIsClicleStudy) {
      console.log('做了更改');
      this.setState({
        isSave: true
      })

    } else {
      this.props.history.goBack()
    }

  }

  //验证码光标后移
  handleInputValue = (e, type) => {

    const { value = "" } = e.target;
    switch (type) {
      case "A":
        if (value) this.secondFoucs.focus();

        this.setState({
          valueA: value.slice(0, 1)
        });


        break;


      case "B":
        if (value) this.tridFoucs.focus();

        this.setState({
          valueB: value.slice(0, 1)
        });


        break;

      case "C":
        if (value) this.fourFoucs.focus();

        this.setState({
          valueC: value.slice(0, 1)
        });


        break;

      case "D":
        if (value) this.fiveFoucs.focus();

        this.setState({
          valueD: value.slice(0, 1)
        });


        break;

      case "E":
        if (value) this.sixFoucs.focus();

        this.setState({
          valueE: value.slice(0, 1)
        });


        break;
      default:
        this.setState({
          valueF: value.slice(0, 1),
          isShow: true
        });
        break;
    }

  };
  //删除验证码
  handleDel = e => {
    const BACK_SPACE = 8;
    const isBackSpaceKey = e.keyCode === BACK_SPACE;
    if (isBackSpaceKey && e.target.value.length === 0) {
      let previous = e.target;
      //上一个兄弟节点
      previous = previous.previousElementSibling;
      if (previous !== null && previous.tagName.toLowerCase() === "input") {
        previous.focus();
      }
    }
  };


  moceCursor = (index) => {
    let inputs = document.querySelectorAll('#settings .verify input')
    if (index < 5) {
      inputs[++index].focus()
    }
  }
  backCursor = (index) => {
    let inputs = document.querySelectorAll('#settings .verify input')
    inputs[--index].focus()
  }
  _device = () => {

    let userId = storage.userId
    let deviceList = electronStore.get(`${userId}-deviceList`)
    console.log('---', deviceList);
    if (!deviceList) {
      let str = `${getRamNumber()}`
      for (let i = 0; i < 5; i++) {
        str += `:${getRamNumber()}`
      }
      console.log('随机生成的mac地址:', str);
      deviceList = [{ name: 'MellaPro', deviceType: 'mellaPro', macId: str }]
      electronStore.set(`${userId}-deviceList`, deviceList)
    }


    function getRamNumber() {
      var result = '';
      for (var i = 0; i < 2; i++) {
        result += Math.floor(Math.random() * 16).toString(16);//获取0-15并通过toString转16进制
      }
      //默认字母小写，手动转大写
      return result.toLowerCase();//另toLowerCase()转小写
    }
    let deviceArr = []
    let selectDevice = electronStore.get(`${storage.userId}-selectDevice`)
    let selectDeviceName = ''
    for (let i = 0; i < deviceList.length; i++) {
      const element = deviceList[i];
      let json = {
        key: element.macId, value: element.name
      }
      deviceArr.push(json)
      if (selectDevice === element.macId) {
        selectDeviceName = element.name
      }
    }



    return (
      <div className="item" style={{ marginTop: px(15) }}>
        <div className="l">
          <div className="hardSetting">{`Hardware Settings`}</div>
        </div>


        {/* <div className="l">
          <div className="text">Device:</div>

          <div className="selebox" style={{ width: px(200) }}>
            <SelectionBox
              listArr={deviceArr}
              clickItem={(value) => {
                console.log('选择的设备:', value);
                electronStore.set(`${storage.userId}-selectDevice`, value.key)

              }}
              initSelectVale={selectDeviceName}

            />
          </div>


        </div> */}
      </div>
    )
  }


  render() {
    let { isClicleStudy, isBacklight, isBeep, backlightTimer, valueA, valueB, valueC, valueD, isClicleStudyModal, valueE, valueF, maxLength, sortBy, showsortBy } = this.state

    let bodyHeight = '90%'
    try {
      bodyHeight = document.getElementById('settings').clientHeight - document.querySelectorAll('#settings .heard')[0].clientHeight
    } catch (error) {

    }


    return (
      <div id="settings">
        <div className="heard">
          <Heart
            onReturn={this._goback}
            // onSearch={(val) => { console.log(val); }}
            menu8Click={() => {
              switch (storage.identity) {   //1是vetspire   2是ezyvet   3是医生
                case '1': this.props.history.push('/VetSpireSelectExam')

                  break;
                case '2': this.props.history.push({ pathname: '/EzyVetSelectExam', listDate: storage.ezyVetList, defaultCurrent: storage.defaultCurrent })

                  break;

                case '3': this.props.history.push({ pathname: '/uesr/selectExam', listDate: storage.doctorList, defaultCurrent: storage.defaultCurrent })

                  break;
                default:
                  break;
              }
            }}
          />
        </div>


        <div className="body">
          <div className="setting">
            {/* 桌面设计 */}
            <div className="desk">
              <div className="title">Desktop Settings</div>

              <div className="item" style={{ marginBottom: px(10) }}>
                <div className="l">
                  <div className="text">Launch Mella on Computer Startup</div>
                  <div className="icon"
                    onClick={() => this.setState({ self_tarting: !this.state.self_tarting })}
                  >
                    {(this.state.self_tarting) && <span  >&#xe619;</span>}

                  </div>

                </div>


                <div className="l" style={{ paddingLeft: px(50), paddingRight: px(50) }}>
                  <div className="text">Units:</div>
                  <div className="unit">


                    <div className="one"

                      onClick={() => { this.setState({ isHua: true }) }}
                    >
                      <div className="check">
                        {(this.state.isHua) && <div className="ciral" />}
                      </div>
                      <div className="unitsText">°F / lbs</div>
                    </div>
                    <div className="one"

                      onClick={() => { this.setState({ isHua: false }) }}
                    >
                      <div className="check">
                        {(!this.state.isHua) && <div className="ciral" />}
                      </div>
                      <div className="unitsText">°C / kg</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="item" style={{ marginBottom: px(10) }}>
                {/* <div className="l">
                  <div className="text">Clinical Study Mode</div>
                  <div className="switch">
                    <Switch
                      checked={isClicleStudy}
                      onClick={() => {
                        if (isClicleStudy === false) {
                          this.setState({
                            isClicleStudy: !isClicleStudy,
                            isClicleStudyModal: true
                          })
                        } else {
                          this.setState({
                            isClicleStudy: !isClicleStudy
                          })
                          // temporaryStorage.isClicleStudy = false
                          storage.isClinical = `${false}`

                          this.props.history.push({ pathname: '/page10' })
                        }

                      }}
                      size='small'
                    />
                  </div>

                </div> */}

                {/* 
                <div className="l" style={{ height: '50px' }}>

                </div> */}
              </div>

            </div>

            {/* 用户设计 */}
            {
              // storage.roleId === '3' &&
              <div className="desk">
                <div className="title user">User Admin</div>

                <div className="item" style={{ marginBottom: px(10) }}>
                  <div className="l" onClick={() => { this.props.history.push('/menuOptions/ConnectWorkplace') }}>
                    <div className="text">{`Org & Practice Profiles`}</div>
                    <div className="rightIcon">&#xe60c;</div>

                  </div>


                  <div className="l" onClick={() => { this.props.history.push('/menuOptions/invite') }}>
                    <div className="text">Invite Your Team</div>
                    <div className="rightIcon">&#xe60c;</div>
                  </div>
                </div>

                <div className="item" style={{ marginBottom: px(10) }}>
                  <div className="l"
                    onClick={() => {
                      console.log(storage.roleId);
                      message.destroy()
                      if (storage.roleId === '3') {
                        this.props.history.push('/menuOptions/veterinarians')
                      } else {
                        message.error('You do not have administrator rights')
                      }
                    }}

                  >
                    <div className="text">Vet Profile Management</div>
                    <div className="rightIcon">&#xe60c;</div>
                  </div>


                  <div className="l "
                    onClick={() => this.props.history.push('/menuOptions/petAndParents')}

                    style={{ marginTop: '25px', marginBottom: '20px' }}>
                    <div className="text">Pet and Parents Profile Management</div>
                    <div className="rightIcon">&#xe60c;</div>
                  </div>
                </div>

              </div>
            }


            {/* 硬件设置 */}

            <div className="desk">

              {this._device()}
              <div className="item" style={{ marginTop: px(25) }}>
                <div className="l">
                  <div className="text">Backlight</div>
                  <Switch
                    checked={isBacklight}
                    onClick={() => this.setState({ isBacklight: !isBacklight })}
                    size='small'
                  />
                </div>


                <div className="l">
                  <div className="text">Action Beep</div>
                  <Switch
                    checked={isBeep}
                    onClick={() => this.setState({ isBeep: !isBeep })}
                    size='small'
                  />
                </div>
              </div>


              <div className="item" style={{ marginTop: px(35) }}>
                <div className="l">
                  <div className="backlight" style={{ width: px(300) }} >
                    <div className="text">Backlight Timer</div>
                    <div className="solid">
                      10 Secs
                      <div className="slider" >
                        <Slider
                          min={10}
                          max={60}
                          railWidth={px(200)}
                          getData={(e) => { console.log(e); this.setState({ backlightTimer: e }) }}
                          left={backlightTimer.length}
                        />
                      </div>
                      60 Secs
                    </div>

                  </div>
                </div>


                <div className="l" >
                  <div className="backlight" style={{ width: px(300) }} >
                    <div className="text">Auto Off After</div>
                    <div className="solid">
                      30 Secs
                      <div className="slider">
                        <Slider
                          min={30}
                          max={60}
                          railWidth={px(200)}
                          getData={(e) => { this.setState({ autoOff: e }) }}
                          left={this.state.autoOff.length}
                        />
                      </div>
                      60 Secs
                    </div>

                  </div>
                </div>
              </div>

              <div className="item" style={{ marginTop: px(35) }}>



                <div className="l" style={{ flexDirection: 'column', alignItems: 'flex-start' }}>
                  <div className="text">Measurement Time for Axillary Sensor</div>
                  <div className="unit">


                    <div className="one"
                      onClick={() => { this.setState({ is15: true }) }}
                    >
                      <div className="check">
                        {(this.state.is15) && <div className="ciral" />}
                      </div>
                      <div className="unitsText">15 Secs</div>
                    </div>
                    <div className="one"
                      onClick={() => { this.setState({ is15: false }) }}
                    >
                      <div className="check">
                        {(!this.state.is15) && <div className="ciral" />}
                      </div>
                      <div className="unitsText">30 Secs</div>
                    </div>
                  </div>
                </div>

                <div className="l" onClick={() => this.props.history.push('/menuOptions/advancedsettings')}>
                  <div className="text">Advanced Settings</div>
                  <div className="rightIcon">&#xe60c;</div>
                </div>
              </div>


            </div>

          </div>


          <div className="btn" style={{ padding: `${px(40)}px 0` }}>
            <Button
              text={'Save Changes'}
              onClick={this._save}
            />
          </div>





        </div>

        <MyModal
          visible={this.state.isSave}
          element={
            <div className='isSave'
            //  style={{ borderRadius: `${px(20)}px`, backgroundColor: '#fff' }}
            >
              <img src={redJinggao} alt="" style={{ width: px(50), margin: `${px(25)}px 0` }} />
              <p>Settings changed - save?</p>
              <div className="btn" style={{ margin: `${px(30)}px 0` }} >
                <Button
                  text={'Cancel'}
                  onClick={() => {
                    this.setState({
                      isSave: false
                    })
                  }}
                  textBoxStyle={{
                    width: '40%',
                    height: px(40)
                  }}
                />
                <Button
                  text={'OK'}
                  onClick={this._save}
                  textBoxStyle={{
                    width: '40%',
                    height: px(40)
                  }}
                />
              </div>
            </div>
          }
        />


        <MyModal
          visible={isClicleStudyModal}
          element={
            <div className='isSave'
              style={{ width: '40%' }}
            >

              <div className="title" style={{ marginTop: px(60) }}>
                Are you sure you want to enter<br />
                Clinical Study Mode?<br />
                Please enter code to enter.
              </div>



              <div className='verify' style={{ margin: `${px(20)}px 0` }}>

                <input

                  ref={ref => {
                    this.firstFoucs = ref;
                  }}
                  value={valueA}
                  maxLength={maxLength}
                  onKeyDown={maxLength ? this.handleDel : null}
                  onChange={e => this.handleInputValue(e, "A")}
                  autoFocus={'autofocus'}
                />
                <input

                  ref={ref => {
                    this.secondFoucs = ref;
                  }}
                  value={valueB}
                  maxLength={maxLength}
                  onKeyDown={maxLength ? this.handleDel : null}
                  onChange={e => this.handleInputValue(e, "B")}
                />
                <input
                  foucs

                  ref={ref => {
                    this.tridFoucs = ref;
                  }}
                  value={valueC}
                  maxLength={maxLength}
                  onKeyDown={maxLength ? this.handleDel : null}
                  onChange={e => this.handleInputValue(e, "C")}
                />
                <input

                  ref={ref => {
                    this.fourFoucs = ref;
                  }}
                  value={valueD}
                  maxLength={maxLength}
                  onKeyDown={maxLength ? this.handleDel : null}
                  onChange={e => this.handleInputValue(e, "D")}
                />



                <input

                  ref={ref => {
                    this.fiveFoucs = ref;
                  }}
                  value={valueE}
                  maxLength={maxLength}
                  onKeyDown={maxLength ? this.handleDel : null}
                  onChange={e => this.handleInputValue(e, "E")}
                />
                <input

                  ref={ref => {
                    this.sixFoucs = ref;
                  }}
                  value={valueF}
                  maxLength={maxLength}
                  onKeyDown={maxLength ? this.handleDel : null}
                  onChange={e => this.handleInputValue(e, "F")}
                />
              </div>




              <div className="btn" style={{ margin: `${px(30)}px 0` }} >
                <Button
                  text={'Cancel'}
                  onClick={() => {
                    this.setState({
                      isClicleStudyModal: false,
                      isClicleStudy: false,
                      valueA: '',
                      valueB: '',
                      valueC: '',
                      valueD: '',
                      valueE: '',
                      valueF: ''
                    })
                  }}
                  textBoxStyle={{
                    width: '40%',
                    height: px(40)
                  }}
                />
                <Button
                  text={'OK'}
                  onClick={() => {
                    if (valueA && valueB && valueC && valueD && valueE && valueF) {
                      this.setState({
                        isClicleStudyModal: false
                      })
                      // temporaryStorage.isClicleStudy = true

                      // let storage = window.localStorage;
                      storage.isClinical = `${true}`
                      this.props.history.push({ pathname: '/page8', identity: storage.identity });
                    }


                  }}
                  textBoxStyle={{
                    width: '40%',
                    height: px(40)
                  }}
                />
              </div>
            </div>
          }
        />


      </div>
    )
  }
}