////这是普通用户的选择界面，后期集成时候别忘了identity，进入测量界面的身份，是vetspire、ezyvet、普通医生
import React, { Component } from 'react'
import {
  Table,
  Input,
  Button,
  Space,
  message,
  Menu,
  Modal,
  Select,
  ConfigProvider

} from 'antd';
import Draggable from "react-draggable";
import Button1 from '../../utils/button/Button'
import moment from 'moment'
//import 'antd/dist/antd.css';
import Heard from '../../utils/heard/Heard'
import { SyncOutlined, createFromIconfontCN } from '@ant-design/icons';
import MaxMin from '../../utils/maxminreturn/MaxMinReturn'
import './doctorSelectExam.less'

import Highlighter from 'react-highlight-words';
import { SearchOutlined } from '@ant-design/icons';
import { FetchEszVet } from '../../utils/FetchEszVet'
import { fetchRequest } from '../../utils/FetchUtil1'
import gender from '../../utils/gender'
import temporaryStorage from '../../utils/temporaryStorage';
import { MTop, mTop, pX, px, win } from '../../utils/px';
import { stopBubble } from './../../utils/current'
import { fetchRequest4 } from '../../utils/FetchUtil4';
import { fetchRhapsody } from '../../utils/FetchUtil5';
import jinggao from './../../assets/img/jinggao.png'
import redclose from './../../assets/img/redclose.png'
import blackTriangle from './../../assets/img/blackTriangle.png'
import refresh from './../../assets/img/Refresh.png'
import SelectionBox from './../../utils/selectionBox/SelectionBox'
import dog from './../../assets/images/pinkdog.png'
import cat from './../../assets/images/pinkcat.png'
import redDog from './../../assets/images/reddog.png'
import redCat from './../../assets/images/redcat.png'
import redother from './../../assets/images/redother.png'
import other from './../../assets/images/other.png'

import electronStore from '../../utils/electronStore';
import { options } from 'less';
import MyModal from '../../utils/myModal/MyModal';

const { SubMenu } = Menu;
const MyIcon = createFromIconfontCN({
  scriptUrl: '//at.alicdn.com/t/font_2326495_7b2bscbhvvt.js'
})
let storage = window.localStorage;

let defaultData = {
  patientId: "",
  wuzhong: 'dog',
  petName: '',
  miaoshu: ''
}


export default class DoctorSelectExam extends Component {
  state = {
    addPetist: [

    ],
    petName: '',
    wuzhong: 'dog',
    patientId: '',
    miaoshu: '',
    loading: false
  }


  componentDidMount () {
    let ipcRenderer = window.electron.ipcRenderer
    let { height, width } = window.screen
    let windowsHeight = height > width ? width : height
    console.log(windowsHeight, height, width);
    if (windowsHeight < 900) {
      ipcRenderer.send('table', win())
    } else {
      ipcRenderer.send('big', win())
    }
    // ipcRenderer.send('big')
    message.destroy()

    ipcRenderer.on('changeFenBianLv', this.changeFenBianLv)



  }
  componentWillUnmount () {
    message.destroy()
    let ipcRenderer = window.electron.ipcRenderer

    ipcRenderer.removeListener('changeFenBianLv', this.changeFenBianLv)
  }
  changeFenBianLv = (e) => {
    console.log(e);
    let ipcRenderer = window.electron.ipcRenderer
    let { height, width } = window.screen
    let windowsHeight = height > width ? width : height
    console.log(windowsHeight, height, width);
    if (windowsHeight < 900) {
      ipcRenderer.send('table', win())
    } else {
      ipcRenderer.send('big', win())
    }
    this.setState({

    })
  }

  selsectwuzhong = (val) => {
    this.setState({
      wuzhong: val
    })
  }
  add = () => {
    message.destroy()
    let { patientId, petName, wuzhong, miaoshu, addPetist } = this.state
    if (!patientId) {
      message.error(`Please enter the pet's patientId`)
      return
    }
    this.setState({
      loading: true
    })

    let petSpeciesBreedId = 12001
    switch (wuzhong) {
      case 'dog': petSpeciesBreedId = 12001; break;
      case 'cat': petSpeciesBreedId = 11001; break;
      case 'other': petSpeciesBreedId = 13001; break;
      default:
        break;
    }
    let params = {
      description: miaoshu,
      doctorId: storage.userId,
      patientId,
      petName,
      petSpeciesBreedId
    }

    if (storage.lastOrganization) {
      params.organizationId = storage.lastOrganization
    }
    console.log('入参', params);
    fetchRequest('/new/petall/subscribe', "POST", params)
      .then(res => {
        if (res.flag) {
          let json = {
            patientId,
            wuzhong,
            petName,
            miaoshu
          }
          let list = [].concat(addPetist)
          list.push(json)
          this.setState({
            loading: false,
            patientId: '',
            wuzhong: 'dog',
            petName: '',
            miaoshu: '',
            addPetist: list
          })
        } else {
          this.setState({
            loading: false
          })
          message.error('add failed')
        }
      })
      .catch(err => {
        console.log('错误原因', err);
        this.setState({
          loading: false
        })
        message.error('add failed')
      })


    // const timer = setTimeout(() => {

    //   let json = {
    //     patientId,
    //     wuzhong,
    //     petName,
    //     miaoshu
    //   }
    //   let list = [].concat(addPetist)
    //   list.push(json)
    //   this.setState({
    //     loading: false,
    //     patientId: '',
    //     wuzhong: 'dog',
    //     petName: '',
    //     miaoshu: '',
    //     addPetist: list
    //   })
    //   clearTimeout(timer)

    // }, 100);
  }
  render () {
    let addPetist = [].concat(this.state.addPetist)
    addPetist.push(defaultData)

    let options = addPetist.map((item, index) => {


      if (index === addPetist.length - 1) {
        let { patientId, wuzhong, petName, miaoshu } = this.state
        return <li key={`${index}`} style={{ width: '100%', }}>
          <div style={{ width: '100%', display: 'flex', flexDirection: 'row', }}>
            <div className='tableHeard' style={{ borderTopWidth: '0px' }}>
              <input type="text" className='tableInput'
                value={patientId}
                onChange={value => {
                  this.setState({
                    patientId: value.target.value
                  })
                }}
              />
            </div>
            <div className='tableHeard' style={{ borderTopWidth: '0px' }}>
              <input type="text" className='tableInput'
                value={petName}
                onChange={value => {
                  this.setState({
                    petName: value.target.value
                  })
                }}
              />
            </div>
            <div className='tableHeard flex' style={{ flexDirection: 'row', paddingTop: px(5), paddingBottom: px(5), justifyContent: 'space-around', borderTopWidth: '0px' }} >
              <div
                style={{ cursor: 'pointer' }}
                onClick={() => {
                  this.selsectwuzhong('dog')
                }}>
                <img src={wuzhong === 'dog' ? redDog : dog} alt="" width={px(40)} />
              </div>
              <div
                style={{ cursor: 'pointer' }}
                onClick={() => {
                  this.selsectwuzhong('cat')
                }}>
                <img src={wuzhong === 'cat' ? redCat : cat} alt="" width={px(40)} />
              </div>

              <div
                style={{ cursor: 'pointer' }}
                onClick={() => {
                  this.selsectwuzhong('other')
                }}>
                <img src={wuzhong === 'other' ? redother : other} alt="" width={px(40)} />
              </div>



            </div>
            <div className='tableHeard' style={{ borderTopWidth: '0px' }}>
              <input type="text" className='tableInput'
                value={miaoshu}
                onChange={value => {
                  this.setState({
                    miaoshu: value.target.value
                  })
                }}

              />
            </div>
            <div className='tableHeard' style={{ borderRight: '#5a5a5a solid 1px', borderTopWidth: '0px' }}>
              <div
                className='add'
                onClick={this.add}
              >
                add
              </div>
            </div>
          </div>
        </li>
      } else {
        let { patientId, wuzhong, petName, miaoshu } = item
        return <li key={`${index}`} style={{ width: '100%', }}>
          <div style={{ width: '100%', display: 'flex', flexDirection: 'row', }}>
            <div className='tableHeard' style={{ borderTopWidth: '0px' }}>
              <div className='tableText'>
                {patientId}
              </div>
            </div>
            <div className='tableHeard' style={{ borderTopWidth: '0px' }}>
              <div className='tableText'> {petName}</div>
            </div>
            <div className='tableHeard flex' style={{ flexDirection: 'row', paddingTop: px(5), paddingBottom: px(5), justifyContent: 'space-around', borderTopWidth: '0px' }} >
              <img src={wuzhong === 'dog' ? redDog : dog} alt="" width={px(40)} />
              <img src={wuzhong === 'cat' ? redCat : cat} alt="" width={px(40)} />
              <img src={wuzhong === 'other' ? redother : other} alt="" width={px(40)} />
            </div>
            <div className='tableHeard' style={{ borderTopWidth: '0px' }}>
              <div className='tableText'>{miaoshu}</div>
            </div>
            <div className='tableHeard' style={{ borderRight: '#5a5a5a solid 1px', borderTopWidth: '0px' }}>

            </div>
          </div>


        </li>
      }


    })






    return (

      <div id="doctorSelectExam" onClick={(e) => {
        console.log('隐藏');
        this.setState({
          showsortBy: false
        })
      }}>
        {/* 关闭缩小 */}
        <Heard
          onReturn={() => {
            this.props.history.goBack()

          }}
          onSearch={(data) => {

            storage.doctorExam = JSON.stringify(data)

            storage.doctorList = JSON.stringify(this.state.data)
            if (storage.isClinical === 'true') {
              this.props.history.push({ pathname: '/page8', identity: storage.identity, patientId: data.patientId })
            } else {
              this.props.history.push({ pathname: '/page10', })
            }
          }}
          blueSearch={true}
        />
        <div style={{ width: '100%', marginTop: px(80), height: px(600), paddingLeft: '5%', paddingRight: '5%' }}>
          <div style={{ width: '100%', display: 'flex', flexDirection: 'row', }}>
            <div className='tableHeard'>Patient Id</div>
            <div className='tableHeard'>Pet Name</div>
            <div className='tableHeard'>species</div>
            <div className='tableHeard'>description</div>
            <div className='tableHeard' style={{ borderRight: '#5a5a5a solid 1px' }}>operate</div>

          </div>
          <ul style={{ width: '100%' }}>
            {options}
          </ul>
        </div>



        <div className='continueBox'>
          <div className='continueBtn'
            style={{ borderRadius: px(50), height: px(45), fontSize: px(20), }}
            onClick={() => {
              this.props.history.goBack()

            }}
          >Continue</div>
        </div>

        <MyModal

          visible={this.state.loading}
        />










      </div>
    )
  }
}
