import React, { Component } from 'react'
import { Menu, message, Select, Button, Spin, Avatar } from 'antd';
import { createFromIconfontCN } from '@ant-design/icons';

import reddog from '../../assets/images/reddog.png'
import redcat from '../../assets/images/redcat.png'
import redother from '../../assets/images/redother.png'
import selectphoto from '../../assets/images/sel.png'

import { mTop, px } from '../../utils/px';
import MyModal from '../../utils/myModal/MyModal';
import Heard from '../../utils/heard/Heard';
import AvatarUpload from '../../components/avatar/Avatar';
import { petPicture } from '../../utils/commonFun';

import { connect } from 'react-redux'
import { petDetailInfoFun } from '../../store/actions';
import { getUserInfoByUserId, updateUserInfo, selectPetInfoByUserId } from '../../api/mellaserver/user';

import { getPersonPetByUserId } from '../../api/mellaserver/petall';

import moment from 'moment';
import _ from 'lodash';

import './index.less';

let storage = window.localStorage;
class EditParent extends Component {
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
    loading: false,//加载
  }
  componentDidMount() {
    let ipcRenderer = window.electron.ipcRenderer
    ipcRenderer.send('Lowbig')
    ipcRenderer.on('changeFenBianLv', this.changeFenBianLv)


    if (this.props.history.location.userId) { //接受入参
      let userId = this.props.history.location.userId
      this.getPersonPet(userId);
      this._getParent(userId);
      this.setState({
        userId,
      })
    }
  }
  componentWillUnmount() {
    let ipcRenderer = window.electron.ipcRenderer
    ipcRenderer.removeListener('changeFenBianLv', this.changeFenBianLv)
  }
  changeFenBianLv = (e) => {
    let ipcRenderer = window.electron.ipcRenderer
    ipcRenderer.send('Lowbig')
    this.setState({
    })
  }
  //获取用户详情信息
  _getParent = (data) => {
    this.setState({
      spin: true
    })
    getUserInfoByUserId(data)
      .then(res => {
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
  //获取用户当前组织下的所有宠物
  getPersonPet = (userId) => {
    this.setState({ loading: true });
    let newData = {
      orgId: storage.lastOrganization,
      userId: userId,
    }
    getPersonPetByUserId(newData)
      .then((res) => {
        this.setState({ loading: false });
        if (res.msg === 'success') {
          this.setState({ petList: res.data })
        } else {
          message.error('Failed to obtain pet information');
        }
      })
      .catch((err) => {
        message.error('Failed to obtain pet information');
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
            <AvatarUpload
              init={
                <div className="ciral ">
                  <img src={this.avatar} alt="" id="touxiang" height="280px" />
                  <p style={{ fontSize: px(14), height: mTop(35) }}>Upload Photo</p>
                </div>
              }
              getinfo={(val) => {
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
  //宠物列表
  petList = () => {
    let { petList } = this.state
    let options = petList.map((item, index) => {
      let { url, breedName, birthday, gender, petName, imageId, petSpeciesBreedId } = item
      let images = `url(${url}?download=0&width=150)`
      let petAge = moment(new Date()).diff(moment(birthday), 'years')
      return (
        <li
          key={`${index}`}
          style={{ margin: `  0 0 ${px(15)}px 0`, }}
        >
          <div className='item' style={{ padding: `${px(15)}px 0 ${px(15)}px  ${px(20)}px`, }}>
            <div className="itemL">
              <Avatar src={this.shoePetPicture(petSpeciesBreedId, url)} size={50} />
              <p
                onClick={(e) => {
                  let location = {
                    pet: { ...item },
                    userId: this.props.history.location.userId
                  }
                  this.props.history.push({ pathname: '/page9', ...location });
                }}
              >
                {petName}
              </p>
            </div>
            <div className="itemC">
              <p>{`${petAge} years old, ${gender === 0 ? 'Male' : 'Female'}`}</p>
            </div>
            <div className="itemR">
              <p>{`${breedName}`}</p>
            </div>
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
  //保存
  save = () => {
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
    updateUserInfo(parames)
      .then(res => {
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
  }
  //选择宠物头像
  shoePetPicture = (petSpeciesBreedId, url) => {
    if (_.isEmpty(url)) {
      switch (petPicture(petSpeciesBreedId)) {
        case 'cat':
          return redcat
        case 'dog':
          return reddog
        case 'other':
          return redother
        default:
          return redother
      }
    } else {
      return url
    }
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
              {/* <Button type="primary" shape="round">+ Add New Pet</Button> */}
            </div>
            <div className="petList">
              {this.petList()}
            </div>
          </div>
        </div>
        <div className="editPetInfo_foot">
          <Button
            type="primary"
            shape="round"
            onClick={() => {
              message.destroy()
              this.props.history.push('/menuOptions/petAndParents');
            }}
          >
            cancel
          </Button>
          <Button
            type="primary"
            shape="round"
            onClick={() => {
              this.save();
            }}
          >
            Save Changes
          </Button>
        </div>
        <MyModal
          visible={this.state.spin}
        />
      </div>
    )
  }
};

export default connect(
  (state) => ({

  }),
  {
    petDetailInfoFun
  }
)(EditParent);


