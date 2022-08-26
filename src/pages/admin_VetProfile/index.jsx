
import React, { Component } from 'react'
import {
  Select,
  message
} from 'antd'

import parent from '../../assets/img/parent.png'
import selectphoto from '../../assets/images/sel.png'
import close from '../../assets/img/close.png'
import dui from '../../assets/images/dui.png'

import Heart from '../../utils/heard/Heard'
import { mTop, px } from '../../utils/px';
import MyModal from '../../utils/myModal/MyModal'
import Avatar from '../../components/avatar/Avatar'
import moment from 'moment'
import './index.less';
import { listDoctorsByAdmin } from '../../api/mellaserver/organization'
import { admin_users } from '../../api/mellaserver/new'

const { Option } = Select;
let storage = window.localStorage;

export default class Veterinarians extends Component {

  state = {
    parentList: [],
    petList: [],
    loading: false,
    parentSearchArr: [],
    petSearchArr: [],
    searchText: '',
    clickVet: false,
    userList: [],
    clickUserItem: {},
    isAdmin: false,
    imageId: null,
    imgUrl: '',
    doctorArr: [],
    dockerSearchArr: []
  }
  componentDidMount() {
    let ipcRenderer = window.electron.ipcRenderer
    let { height, width } = window.screen
    ipcRenderer.send('Lowbig')
    ipcRenderer.on('changeFenBianLv', this.changeFenBianLv)

    this._getExam()

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
    ipcRenderer.send('Lowbig')
    this.setState({

    })
  }

  _getExam = async () => {
    console.log('进来了');
    this.setState({
      loading: true,
      spin: false
    })
    let params = {
      doctorId: storage.userId,
    }
    if (storage.lastWorkplaceId) {
      params.workplaceId = storage.lastWorkplaceId
    }
    if (storage.lastOrganization) {
      params.organizationId = storage.lastOrganization
    }

    console.log('查询宠物的入参', params);


    listDoctorsByAdmin(storage.lastOrganization, params)
      .then(res => {
        console.log('人员列表', res);
        this.setState({
          loading: false
        })
        if (res.flag === true && res.code === 20000) {
          let data = []
          for (let i = 0; i < res.data.length; i++) {
            let { birthday, email, firstName, lastName, isLimit, isDeleted, phone, url, userId, createTime, roleId } = res.data[i]

            let json = {
              insertedAt: createTime,
              name: `${lastName} ${firstName}`,
              userId,
              email,
              birthday,
              isLimit,
              isDeleted,
              phone,
              url,
              firstName, lastName, roleId
            }
            data.push(json)
          }
          data.sort((a, b) => {
            return moment(parseInt(a.insertedAt) * 1000).format('YYYY-MM-DD HH:mm') > moment(parseInt(b.insertedAt) * 1000).format('YYYY-MM-DD HH:mm') ? -1 : 1
          })
          this.setState({
            doctorArr: data,
            // parentList: data //这里只是测试，后期删除

          })

        }
      })
      .catch(err => {
        console.log(err);
        this.setState({
          loading: false
        })
      })



  }



  list = () => {
    let { doctorArr, dockerSearchArr, searchText } = this.state
    let data = searchText.length > 0 ? dockerSearchArr : doctorArr




    let options = data.map((item, index) => {
      let { url, firstName, lastName } = item
      let images = `url(${url}?download=0&width=150)`
      if (!url) {
        images = `url(${parent})`
      }


      return (
        <li
          key={`${index}`}
          style={{ margin: `0 0 ${px(15)}px 0`, borderRadius: px(20), float: `${index % 2 === 0 ? 'left' : 'right'}` }}
          onClick={() => {
            console.log(item);
            let { name, email, phone, roleId } = item
            let isAdmin = roleId === '3' ? true : false

            this.setState({
              clickVet: true,
              clickUserItem: item,
              name,
              email,
              phone,
              isAdmin,
              imgUrl: ''
            })

          }}
        >
          <div className='item' style={{ padding: `${px(15)}px 0 ${px(15)}px  ${px(20)}px`, }}>
            <div
              className='img'
              style={{
                width: px(50),
                height: px(50),
                marginRight: px(20),
                borderRadius: px(60),
                backgroundImage: images,
              }}>

              <div
                className="green"
                style={{
                  width: px(8),
                  height: px(8),
                  borderRadius: px(8),
                  backgroundColor: '#7ED266',
                  right: px(-5),
                  top: px(-3)

                }}

              />

            </div>

            <div className='petInfo' >
              <p style={{ color: '#141414', fontWeight: 600, fontSize: px(20) }}>{item.name}</p>
            </div>
          </div>
        </li >
      )

    })

    let liStyle = { backgroundColor: '#fff', }
    if (this.state.petList.length > 16) {
      liStyle = { height: px(750), overflowY: 'auto', }
    }


    return (
      <div className='petList'>
        <ul style={liStyle}>
          {options}
        </ul>
      </div>
    )

  }
  inputChange = (text) => {
    let search = text.target.value
    this.setState({
      searchText: search
    })

    let { doctorArr } = this.state

    let keyWord = search

    let parentSearchData = []

    for (let i = 0; i < doctorArr.length; i++) {
      let { email, phone, name, } = doctorArr[i]
      email = email ? email.toLowerCase() : ''
      phone = phone ? phone.toLowerCase() : ''
      name = name ? name.toLowerCase() : ''
      let keyLower = keyWord.toLowerCase()
      if (`${email}`.indexOf(keyLower) !== -1 || `${phone}`.indexOf(keyLower) !== -1 || `${name}`.indexOf(keyLower) !== -1) {
        parentSearchData.push(doctorArr[i])
      }
    }


    this.setState({

      dockerSearchArr: parentSearchData
    })


  }
  _petSpecies = () => {


    let { clickUserItem, isAdmin } = this.state
    let { url } = clickUserItem
    this.avatar = url ? url : selectphoto
    return (
      <div className="petSpecies">

        <div className="r">

          <div className="img">
            <Avatar
              init={
                <div className="ciral ">
                  <img src={this.avatar} alt="" id="touxiang" style={{ height: px(100) }} />
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
              getAllInfo={(val) => {
                console.log('图片信息', val);
                this.setState({
                  imgUrl: val.url
                })
              }}
            />
          </div>

        </div>

        <div className="l">
          <div className="firstName" style={{ marginBottom: px(30) }}>
            <p>Set Role:</p>

            <div className="ones" style={{ marginTop: px(8) }}>
              {/* <div className="one">
                <div className="chect" style={{ width: px(18), height: px(18), marginRight: px(15) }}>
                  <img src={dui} alt="" />
                </div>
                <p>User</p>
              </div> */}
              <div className="one"
                onClick={() => {
                  this.setState({
                    isAdmin: !this.state.isAdmin
                  })
                }}
              >
                <div
                  className="chect"
                  style={{ width: px(18), height: px(18), marginRight: px(15) }}

                >
                  {isAdmin && <img src={dui} alt="" />}

                </div>
                <p>Admin</p>
              </div>

              {/* <div className="one">
                <div className="chect" style={{ width: px(18), height: px(18), marginRight: px(15) }}>
                  <img src={dui} alt="" />
                </div>
                <p>Owner</p>
              </div> */}
            </div>



          </div>




        </div>

      </div>

    )
  }

  _petName = () => {
    let { name, email } = this.state

    return (
      <div className="petSpecies" style={{ marginTop: px(60) }}>
        <div className="l">
          <div className="firstName" style={{ marginBottom: px(50), }}>
            <p>Name</p>
            <input
              type="text"
              value={name}
              onChange={(item) => {

                this.setState({
                  name: item.target.value
                })
              }}
            />
          </div>
        </div>

        <div className="l">
          <div className="firstName" style={{ marginBottom: px(50) }}>
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
      </div>

    )
  }
  _phone = () => {
    let { areas, phone } = this.state

    return (
      <div className="petSpecies">
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

        <div className="l">
          <div className="firstName" style={{ marginBottom: px(30) }}>
            <p>Areas of Expertise</p>
            <input
              type="text"
              value={areas}
              onChange={(item) => {

                this.setState({
                  areas: item.target.value
                })
              }}

            />
          </div>
        </div>
      </div>

    )
  }

  changeUserInfo = () => {
    let { name, email, phone, clickUserItem, imageId, isAdmin, petList, imgUrl } = this.state
    let { userId } = clickUserItem
    let roleId = isAdmin ? '3' : '2'
    let params = {
      firstName: '',
      lastName: name,
      email,
      phone,

      roleId
    }
    if (imageId) {
      params.imageId = imageId
    }
    message.destroy()
    this.setState({
      clickVet: false,
      loading: true
    })
    console.log('入参', params);
    admin_users(userId, params)
      .then(res => {
        console.log(res);
        if (res.flag && res.code === 20000) {
          for (let i = 0; i < petList.length; i++) {
            const element = petList[i];
            if (clickUserItem.userId === element.userId) {
              element.name = name
              element.email = email
              element.phone = phone
              if (imageId) {
                element.url = imgUrl
              }

              break
            }

          }
          this.setState({
            loading: false,
            petList
          })
          message.success('User information changed successfully')
        } else {
          this.setState({
            loading: false
          })
          message.error('User information change failed')
        }
      })
      .catch(err => {
        this.setState({
          loading: false
        })
        message.error('User information change failed')
        console.log(err);
      })
  }

  render() {
    let bodyHeight = '92%'
    try {
      bodyHeight = document.getElementById('settings').clientHeight - document.querySelectorAll('#settings .heard')[0].clientHeight
    } catch (error) {

    }
    return (
      <div id="veterinarians">
        <div className="heard">
          <Heart />
        </div>


        <div className="body" style={{ height: bodyHeight, padding: `0 ${px(35)}px` }}>
          <div className="title">
            <h1 style={{ fontSize: px(38) }}>{`Veterinarians`}</h1>
            <div className="btn" style={{ fontSize: px(24), height: px(45) }}>+ New Vet</div>
          </div>

          <div className="search">
            <div className="searchL">
              <input
                type="text"
                style={{ paddingLeft: px(25), height: px(34) }}
                placeholder="&#xe62c; Search "
                value={this.state.searchText}
                onChange={(text) => {
                  this.inputChange(text)
                }}
              />
            </div>
            <div className="searchr" style={{ fontSize: px(18), height: px(40) }}>
              Search
            </div>
          </div>


          <div className="lists">
            {/* <div className="listsL"> */}
            {this.list()}
            {/* </div> */}


          </div>
        </div>


        <MyModal visible={this.state.loading} />

        <MyModal
          visible={this.state.clickVet}
          element={
            <div className='vetInfo'>

              <div className="info" >
                <div className="close" style={{ height: px(50) }}>
                  <img
                    onClick={() => {
                      this.setState({
                        clickVet: false
                      })
                    }}

                    src={close} style={{ width: px(20) }} />
                </div>
                {this._petSpecies()}
                {this._petName()}
                {this._phone()}
              </div>
              <div className="fotBtn">
                <div className="text">
                  <a
                    onClick={(e) => {
                      e.preventDefault();
                      this.setState({
                        clickVet: false
                      })
                    }}

                    href="#">Delete </a>
                  &nbsp;<p>{` ${this.state.name} from Workplace`}</p>
                </div>
                <div className="btn"
                  style={{ marginTop: px(10) }}
                  onClick={this.changeUserInfo}

                >Save </div>

              </div>
            </div>
          }
        />





      </div>
    )
  }
}
