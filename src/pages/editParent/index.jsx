import React, { Component } from 'react'
import { Menu, message, Select } from 'antd';
import { createFromIconfontCN } from '@ant-design/icons';

import dog from '../../assets/images/reddog.png'
import cat from '../../assets/images/redcat.png'
import other from '../../assets/images/redother.png'
import selectphoto from '../../assets/images/sel.png'


import { mTop, px } from '../../utils/px';
import MyModal from '../../utils/myModal/MyModal';
import Heard from '../../utils/heard/Heard';
import Avatar from '../../components/avatar/Avatar'

import moment from 'moment';

import './index.less';
import { getUserInfoByUserId, updateUserInfo } from '../../api/mellaserver/user';

const { SubMenu } = Menu;
const { Option } = Select;
const MyIcon = createFromIconfontCN({
  scriptUrl: '//at.alicdn.com/t/font_2326495_7b2bscbhvvt.js'
})
let storage = window.localStorage;
let errPatientId = ''
let url = 'https://www.mellaserver.com/api/mellaserver'
// let url = 'http://192.168.0.36:8080/mellaserver'
export default class EditParent extends Component {
  state = {
    lastName: '',       //宠物主人性
    firstName: '',      //宠物主人名
    email: '',          //邮箱号
    phone: '',          //电话号码
    spin: false,        //加载中
    imageId: null,      //图片的ID值
    petList: [],         //当前这个宠物主人下的所有宠物
    userId: '',          //当前这个宠物主人的userId
    userImageUrl: '',
  }

  componentDidMount() {
    let ipcRenderer = window.electron.ipcRenderer
    ipcRenderer.send('Lowbig')
    ipcRenderer.on('changeFenBianLv', this.changeFenBianLv)
    console.log(this.props.history.location.parent);

    if (this.props.history.location.parent) { //接受入参
      let { parent, pets } = this.props.history.location.parent
      let { firstName, lastName, userId } = parent
      this._getParent(userId)

      this.setState({
        firstName,
        lastName,
        userId,
        petList: pets


      })

    }
  }
  componentWillUnmount() {
    let ipcRenderer = window.electron.ipcRenderer

    ipcRenderer.removeListener('changeFenBianLv', this.changeFenBianLv)
  }
  changeFenBianLv = (e) => {
    console.log(e);
    let ipcRenderer = window.electron.ipcRenderer
    ipcRenderer.send('Lowbig')
    this.setState({

    })
  }
  _getParent = (data) => {
    this.setState({
      spin: true
    })
    getUserInfoByUserId(data)
      .then(res => {
        console.log('获取到了用户信息', res);
        if (res.msg === 'success') {
          let { firstName, phone, lastName, email, imageId, url, userImage } = res.data
          let userImageUrl = res.data.userImage ? res.data.userImage.url : null
          firstName = firstName ? firstName : ''
          phone = phone ? phone : ''
          email = email ? email : ''
          lastName = lastName ? lastName : ''


          this.setState({
            userImageUrl,
            firstName,
            lastName,
            phone,
            email,
            imageId,
            spin: false

          })
        } else {
          this.setState({
            spin: false
          })
        }
      })
      .catch(err => {
        console.log(err);
        this.setState({
          spin: false
        })
      })
  }

  _petSpecies = () => {
    let { userImageUrl } = this.state
    this.avatar = userImageUrl ? userImageUrl : selectphoto
    let { firstName, lastName } = this.state
    return (
      <div className="petSpecies">
        <div className="l">
          <div className="firstName" style={{ marginBottom: px(30) }}>
            <p>First Name</p>
            <input
              type="text"
              value={firstName}
              onChange={(item) => {

                this.setState({
                  firstName: item.target.value
                })
              }}

            />
          </div>

          <div className="firstName" style={{ marginBottom: px(30) }}>
            <p>Last Name</p>
            <input
              type="text"
              value={lastName}
              onChange={(item) => {

                this.setState({
                  lastName: item.target.value
                })
              }}
            />
          </div>


        </div>
        <div className="r">

          <div className="img">
            <Avatar
              init={
                <div className="ciral ">
                  <img src={this.avatar} alt="" id="touxiang" height="280px" />
                  <p style={{ fontSize: px(14), height: mTop(35) }}>Upload Photo</p>
                </div>
              }
              getinfo={(val) => {
                console.log('我是父组件，从子组件获取到的数据位：', val);
                if (val) {
                  this.setState({
                    imageId: val
                  })
                }

              }}
            />
          </div>

        </div>

      </div>

    )
  }
  _petName = () => {
    let { email, phone } = this.state

    return (
      <div className="petSpecies">
        <div className="l">
          <div className="firstName" style={{ marginBottom: px(30) }}>
            <p>Email</p>
            <input
              type="text"
              value={email}
              disabled={true}
              onChange={(item) => {

                this.setState({
                  email: item.target.value
                })
              }}
            />
          </div>
        </div>

        <div className="l">
          <div className="firstName" style={{ marginBottom: px(30) }}>
            <p>Phone</p>
            <input
              type="text"
              value={phone}
              onChange={(item) => {

                this.setState({
                  phone: item.target.value
                })
              }}
            />
          </div>
        </div>
      </div>

    )
  }
  petList = () => {

    let { petList } = this.state
    console.log(petList);
    let options = petList.map((item, index) => {
      let { speciesId, url, breedName, petBirthday, gender, name, } = item
      let images = `url(${url}?download=0&width=150)`

      let petAge = moment(new Date()).diff(moment(petBirthday), 'years')

      if (!url) {

        switch (speciesId) {
          case 1: images = `url(${cat})`

            break;
          case 2: images = `url(${dog})`
            break
          default: images = `url(${other})`
            break;

        }

      }


      return (
        <li
          key={`${index}`}
          style={{ margin: `  0 0 ${px(15)}px 0`, }}
          onClick={() => {

          }}
        >
          <div className='item' style={{ padding: `${px(15)}px 0 ${px(15)}px  ${px(20)}px`, }}>
            <div className="itemL">
              <div
                className='img'
                style={{
                  width: px(50),
                  height: px(50),
                  marginRight: px(20),
                  borderRadius: px(60),
                  backgroundImage: images,
                }}>
              </div>
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  console.log(item);
                }}
              >{name}</a>
            </div>
            <div className="itemC">
              <p>{`${petAge} years old, ${gender === 0 ? 'Male' : 'Female'}`}</p>
            </div>
            <div className="itemR">
              <p>{`${breedName}`}</p>
            </div>


            {/* <div className='petInfo' >
              <p style={{ color: '#141414', fontWeight: 600, fontSize: px(20) }}>{item.name}</p>
            </div> */}
          </div>
        </li >
      )

    })



    let liStyle = { backgroundColor: '#fff', marginTop: px(15) }
    if (petList.length > 3) {
      liStyle = { height: px(305), overflowY: 'auto', marginTop: px(15) }
    }

    return (
      <ul style={liStyle}>
        {options}
      </ul>
    )
  }


  render() {

    return (
      <div id="editParent">

        <div className="heard">
          <Heard />
        </div>
        <div className="editPetInfo_top" >
          <div className="parentInfo">
            <div className="title" >{`Parent Information`}</div>
            <div className="info">
              {this._petSpecies()}
              {this._petName()}
            </div>

          </div>
          <div className="pets">
            <div className="petsTitle">
              <h2 style={{ fontSize: px(24), marginRight: px(40) }}>Pets</h2>
              <div className="btn" style={{ fontSize: px(22) }}>+ Add New Pet</div>
            </div>
            <div className="petList">
              {this.petList()}
            </div>

          </div>
        </div>
        <div className="editPetInfo_foot"  >
          <div className="save"
            onClick={() => {
              message.destroy()
              let { firstName, lastName, email, phone, imageId, userId } = this.state
              console.log({ firstName, lastName, email, phone, imageId });
              let parames = {
                userId,
                email,
                phone,
                firstName,
                lastName,
                imageId
              }
              this.setState({
                spin: true
              })
              message.destroy()
              console.log('修改的宠物信息:', parames);
              updateUserInfo(parames)
                .then(res => {
                  console.log('保存所有信息', res);
                  this.setState({
                    spin: false
                  })
                  if (res.flag === true) {
                    this.props.history.goBack()
                  } else {
                    message.error('fail to edit')
                  }
                })
                .catch(err => {
                  this.setState({
                    spin: false
                  })
                  message.error('fail to edit')
                  console.log(err);
                })

            }}

          >Edit Profile</div>
          <div className="save"
            onClick={() => {
              message.destroy()
              this.props.history.goBack()
            }}

          >OK</div>

        </div>
        <MyModal
          visible={this.state.spin}
        />
      </div >
    )
  }
}
