import React, { Component } from 'react'
import { Input, Menu, message, Select, Calendar, Col, Row, Spin } from 'antd';
import Draggable from "react-draggable";
import moment from 'moment'
//import 'antd/dist/antd.css';
import { createFromIconfontCN, SyncOutlined, LoadingOutlined } from '@ant-design/icons';
import { fetchRequest } from './../../utils/FetchUtil1'
import dog from './../../assets/images/pinkdog.png'
import cat from './../../assets/images/pinkcat.png'
import redDog from './../../assets/images/reddog.png'
import redCat from './../../assets/images/redcat.png'
import redother from './../../assets/images/redother.png'
import other from './../../assets/images/other.png'
import selectphoto from './../../assets/images/sel.png'

import Close from './../../assets/img/close.png'
import nextImg from './../../assets/img/nextImg.png'

import dui from './../../assets/images/dui.png'
import female from './../../assets/images/female.png'
import male from './../../assets/images/male.png'
import { mTop, px, win } from '../../utils/px';
import Avatar from './../avatar/Avatar'
import './editPetInfo.less'
import MyModal from '../../utils/myModal/MyModal';
import electronStore from '../../utils/electronStore';
import PhoneBook from '../../utils/phoneBook/PhoneBook';
import Button from './../../utils/button/Button'
import { connect } from 'react-redux';
import { petDetailInfoFun } from '../../store/actions';
const { SubMenu } = Menu;
const { Option } = Select;
const MyIcon = createFromIconfontCN({
  scriptUrl: '//at.alicdn.com/t/font_2326495_7b2bscbhvvt.js'
})
let storage = window.localStorage;
let errPatientId = ''
let url = 'https://www.mellaserver.com/api/mellaserver'
// let url = 'http://192.168.0.36:8080/mellaserver'
class EditPetInfo extends Component {
  state = {
    dogImg: dog,
    catImg: cat,
    otherImg: other,
    selectWZ: '',
    closebgc: '',
    minbgc: '',
    closeColor: '',
    api: '',
    id: '',
    seleceID: '',//医生id
    petSpecies: 0,
    unit: 1,
    gender: 0,
    isMix: false,
    imageId: -1,
    imgurl: '',
    breedArr: [],
    petSpeciesBreedId: '',
    dogData: [],
    birthday: moment(new Date()).format('MMMM D, YYYY'),
    patientId: '',
    petName: '',

    petId: '',
    lastName: '',
    firstName: '',
    breedName: '',

    initpetName: '',
    initpetId: '',
    initlastName: '',
    initfirstName: '',
    initbreedName: '',
    spin: false,
    dogBreed: [],
    catBreed: [],

    oldPatientId: '',
    searchBreed: '',
    selectBreedJson: {},
    confirmSelectBreedJson: {},
    selectBreed: false,

    doctorArr: [],
    selectUser: false,
    selectUserJson: {},
    selectUserId: '',
    confirmSelectUserJson: {},
    petUrl: ''


  }

  componentDidMount() {
    let ipcRenderer = window.electron.ipcRenderer
    ipcRenderer.send('big', win())




    // if (this.props.location.participate) {
    //   let props = this.props.location.participate
    //   console.log(props);
    //   this.setState({
    //     patientId: props.patientId,
    //     petId: props.petId,
    //     oldPatientId: props.patientId,

    //   }, () => {
    //     this._getPetInfo()
    //   })
    //   console.log(props);
    // } else {
    //   this._getPetInfo()
    // }
    let { petDetailInfo } = this.props
    let { petId, patientId, petName, lastName, firstName, breedName, isWalkIn } = petDetailInfo
    if (!isWalkIn) {
      if (!patientId || patientId === 'unknown') {
        patientId = null
      }
      this.setState({
        patientId,
        petId,
        oldPatientId: patientId,

      }, () => {
        this._getPetInfo()
      })
    }


    let dogBreed = electronStore.get('dogBreed') || []
    let catBreed = electronStore.get('catBreed') || []
    this.setState({
      dogBreed,
      catBreed
    })
    this.getBreed('cat')
    this.getBreed('dog')
    this.getUser()

    ipcRenderer.on('changeFenBianLv', this.changeFenBianLv)
  }
  componentWillUnmount() {
    let ipcRenderer = window.electron.ipcRenderer

    ipcRenderer.removeListener('changeFenBianLv', this.changeFenBianLv)
  }
  changeFenBianLv = (e) => {
    console.log(e);
    let ipcRenderer = window.electron.ipcRenderer
    ipcRenderer.send('big', win())
    this.setState({

    })
  }
  getBreed = (val) => {
    let data = {}
    switch (val) {
      case 'dog':
        data.speciesId = 2; break;

      case 'cat':
        data.speciesId = 1; break;
    }

    fetchRequest(`/pet/selectBreedBySpeciesId`, 'POST', data)
      .then(res => {
        // console.log('---', res);
        if (res.code === 0) {
          let arr = []
          res.petlist.map((item, index) => {
            let data = {
              petSpeciesBreedId: item.petSpeciesBreedId,
              breedName: item.breedName
            }
            arr.push(data)
          })
          if (val === 'dog') {
            this.setState({
              dogBreed: arr
            })
            electronStore.set('dogBreed', arr)
          } else if (val === 'cat') {
            this.setState({
              catBreed: arr
            })
            electronStore.set('catBreed', arr)
          }

        }
      })
      .catch(err => {
        console.log(err);
      })
  }
  getUser = () => {
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


    fetchRequest(`/organization/listDoctorsByAdmin/${storage.lastOrganization}`, 'GET', params)
      .then(res => {
        console.log('人员列表', res);

        if (res.flag === true && res.code === 20000) {
          let data = []
          for (let i = 0; i < res.data.length; i++) {
            let { birthday, email, firstName, lastName, isLimit, isDeleted, phone, url, userId, createTime, roleId } = res.data[i]

            let json = {
              insertedAt: createTime,
              breedName: `${lastName} ${firstName}`,
              petSpeciesBreedId: userId,
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

      })
  }

  _getPetInfo = () => {
    let { patientId, petId } = this.state
    let datas = {
      doctorId: storage.userId,
    }
    if (storage.lastWorkplaceId) {
      datas.workplaceId = storage.lastWorkplaceId
    }
    if (storage.lastOrganization) {
      datas.org = storage.lastOrganization
    }
    if (patientId && patientId !== 'undefined') {
      datas.patientId = patientId
    }
    if (petId) {
      datas.petId = petId
    }
    this.setState({
      spin: true
    })



    console.log('入参：', datas);
    fetchRequest('/pet/getPetInfoByPatientIdAndPetId', 'POST', datas)
      .then(res => {
        this.setState({
          spin: false
        })
        console.log('>>>>>>>>>>>>>>', res);
        if (res.flag === true) {
          //有宠物，进入1
          let datas = []
          for (let i = 0; i < res.data.length; i++) {
            if (res.data[i].petId === this.state.petId) {
              datas = res.data[i]
              break
            }
          }
          console.log('获取到宠物', datas);
          let { petId, petName, lastName, firstName, breedName, isMix, birthday, weight, url, gender, speciesId, petSpeciesBreedId } = datas

          if (isMix !== true) {
            isMix = false
          }
          petName = isNull(petName)
          lastName = isNull(lastName)
          firstName = isNull(firstName)
          breedName = isNull(breedName)

          let confirmSelectBreedJson = {}
          if (petSpeciesBreedId || petSpeciesBreedId === 0) {
            confirmSelectBreedJson = {
              name: breedName,
              petSpeciesBreedId
            }
          }

          url = isNull(url)
          if (birthday != null) {
            birthday = moment(birthday).format('MMMM D, YYYY')
          }
          else {
            birthday = ''
          }
          if (gender === null || gender === NaN || `${gender}` === 'null' || `${gender}` === 'NaN') {
            gender = 0
          }
          if (weight) {
            weight = (weight * 2.2046).toFixed(1)
          } else {
            weight = ''
          }


          this.setState({
            petId,
            petName,
            lastName,
            firstName,
            breedName,
            isMix,
            birthday,
            weight,
            imgurl: url,
            gender,
            petSpecies: speciesId,


            initpetName: petName,
            initlastName: lastName,
            initfirstName: firstName,
            confirmSelectBreedJson,
            petSpeciesBreedId
          })
          switch (speciesId) {
            case 1: this.selectWZ('cat'); break;
            case 2: this.selectWZ('dog'); break;

            default: this.selectWZ('other'); break;
          }

        } else {
          message.destroy()
          message.error('data load failed')
        }
      })
      .catch(err => {
        this.setState({
          spin: false
        })
        console.log(err);
        message.destroy()
        message.error('data load failed')
      })
    const isNull = (value) => {
      if (value === null || value === NaN || `${value}` === 'null' || `${value}` === 'NaN') {
        return ''
      } else {
        return value
      }
    }

  }

  /**------------------顶部start------------------------ */
  _close = () => {
    let ipcRenderer = window.electron.ipcRenderer
    console.log('关闭程序');
    ipcRenderer.send('window-close')
  }
  _min = () => {
    let ipcRenderer = window.electron.ipcRenderer
    console.log('最小化程序');
    ipcRenderer.send('window-min')
    this.setState({
      minbgc: '',
    })
  }
  _minMove = () => {

    this.setState({
      minbgc: 'rgb(211, 205, 205)'
    })
  }
  _minLeave = () => {
    this.setState({
      minbgc: ''
    })
  }
  _closeMove = () => {
    this.setState({
      closeColor: 'red',
      closebgc: '#fff'
    })
  }
  _closeLeave = () => {
    this.setState({
      closeColor: '#fff',
      closebgc: ''
    })
  }

  /**------------------顶部end------------------------ */
  selectWZ = (val) => {
    let { catBreed, dogBreed } = this.state
    switch (val) {
      case 'dog':
        this.setState({
          catImg: cat,
          dogImg: redDog,
          otherImg: other,
          selectWZ: val,
          breedArr: [].concat(dogBreed)
        })

        break;

      case 'cat':
        this.setState({
          catImg: redCat,
          dogImg: dog,
          otherImg: other,
          selectWZ: val,
          breedArr: [].concat(catBreed)
        })

        break;

      case 'other':
        this.setState({
          catImg: cat,
          dogImg: dog,
          otherImg: redother,
          selectWZ: val,
          breedArr: []
        })
        break;

      default:
        break;
    }
  }
  _petSpecies = () => {
    let { petSpecies, dogImg, catImg, otherImg, imgurl } = this.state

    this.avatar = imgurl ? imgurl : selectphoto

    return (
      <div className="petSpecies"
        style={{ marginTop: mTop(30) }}
      >
        <div className="l">
          <p style={{ color: '#A0A0A0', fontSize: '16px' }}>Pet Species</p>
          <div className="selectSpecies">
            <ul>
              <li >
                <div className='speciesChild' >
                  <div className='dog'

                    onClick={() => { this.selectWZ('dog') }}>
                    <img src={dogImg} alt="" style={{ width: px(40) }} />
                  </div>
                  Dog
                </div>
              </li>
              <li>
                <div className='speciesChild' >
                  <div className='dog' onClick={() => { this.selectWZ('cat') }} >
                    <img src={catImg} alt="" style={{ width: px(40) }} />
                  </div>
                  Cat
                </div>
              </li>
              <li >
                <div className='speciesChild' >
                  <div className='dog' onClick={() => { this.selectWZ('other') }} >
                    <img src={otherImg} alt="" style={{ width: px(40) }} />
                  </div>
                  Other
                </div>
              </li>

            </ul>
          </div>



        </div>
        <div className="r">
          {/* <div className="img"
                    style={{ width: px(110), height: px(110) }}
                >
                    <div className="ciral" onClick={() => {
                        let file = document.getElementById('f')
                        file.click();
                    }}>
                        <img src={this.avatar} alt="" id="touxiang" height="280px" />
                        <input type="file" accept="image/gif,image/jpeg,image/jpg,image/png,image/svg" className="uploadImg" id="f" onChange={(e) => {
                            console.log(e);
                            let $target = e.target || e.srcElement
                            if ($target.files.length === 0) {
                                return;
                            }
                            let file = $target.files[0]
                            var reader = new FileReader()                   //创建文件阅读器实例
                            reader.readAsDataURL(file)
                            reader.onload = (data) => {
                                let res = data.target || data.srcElement
                                console.dir(document.getElementById('touxiang'));
                                document.getElementById('touxiang').src = res.result


                                const formData = new FormData();
                                formData.append('img', file);
                                fetch(`${url}/image/uploadImage`, {
                                    method: 'POST',
                                    headers: {
                                    },
                                    body: formData
                                })
                                    .then((response) => response.json())
                                    .then((res) => {
                                        console.log(res);
                                        if (res.flag === true) {
                                            this.setState({
                                                imageId: res.data.imageId,
                                                imgurl: res.data.url
                                            })
                                        }
                                    })
                                    .catch((err) => {
                                        console.log(err);
                                    });
                            }

                        }} />
                        <p style={{ fontSize: px(14), height: mTop(35) }}>Upload Photo</p>
                    </div>
                </div> */}
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
              getAllInfo={(val) => {
                console.log('所有的信息', val);
                if (val.url) {
                  this.setState({
                    petUrl: val.url
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

    const onPanelChange = (value, mode) => {
      console.log('-----', value, mode);
    }
    let birthday = this.state.birthday
    let birthdayValue = birthday ? moment(birthday) : moment(new Date())
    return (
      <div className="petName" style={{ marginTop: mTop(30) }}>
        <div className="l">
          <p >Pet Name</p>
          <div className="infoInput">
            <Input
              bordered={false}
              value={this.state.initpetName}
              onChange={(item) => {

                this.setState({
                  petName: item.target.value.replace(/(^\s*)|(\s*$)/g, ""),
                  initpetName: item.target.value
                })
              }}
            />
          </div>
        </div>

        <div className="r">
          <p >Pet Birthday</p>
          <div className="infoInput" >
            <p style={{ weight: '60px', height: '27px', padding: 0, margin: 0 }} onClick={() => {
              document.getElementById('calendar').style.display = 'block'
            }}>{this.state.birthday}</p>
            <div className="calendar" id="calendar">
              <Calendar
                fullscreen={false}
                headerRender={({ value, type, onChange, onTypeChange }) => {
                  const start = 0;
                  const end = 12;
                  const monthOptions = [];

                  const current = value.clone();
                  const localeData = value.localeData();
                  const months = [];
                  for (let i = 0; i < 12; i++) {
                    current.month(i);
                    months.push(localeData.monthsShort(current));
                  }

                  for (let index = start; index < end; index++) {
                    monthOptions.push(
                      <Select.Option className="month-item" key={`${index}`}>
                        {months[index]}
                      </Select.Option>
                    );
                  }
                  const month = value.month();

                  const year = value.year();
                  const options = [];
                  for (let i = year - 10; i < year + 10; i += 1) {
                    options.push(
                      <Select.Option key={i} value={i} className="year-item">
                        {i}
                      </Select.Option>
                    );
                  }
                  return (
                    <div style={{ padding: 8 }}>
                      <Row gutter={8}>
                        <Col>
                          <Select
                            size="small"
                            dropdownMatchSelectWidth={false}
                            className="my-year-select"
                            onChange={(newYear) => {
                              const now = value.clone().year(newYear);
                              onChange(now);
                            }}
                            value={String(year)}
                          >
                            {options}
                          </Select>
                        </Col>
                        <Col>
                          <Select
                            size="small"
                            dropdownMatchSelectWidth={false}
                            value={String(month)}
                            onChange={(selectedMonth) => {
                              const newValue = value.clone();
                              newValue.month(parseInt(selectedMonth, 10));
                              onChange(newValue);
                            }}
                          >
                            {monthOptions}
                          </Select>
                        </Col>
                        {/* <Col>
                          <div className="btn" onClick={() => {
                            document.getElementById('calendar').style.display = 'none'
                          }}>
                            Choose this date
                          </div>

                        </Col> */}
                      </Row>
                    </div>
                  );
                }}
                value={birthdayValue}
                onSelect={(value) => {
                  console.log(value);
                  this.setState({
                    birthday: moment(value).format('MMMM D, YYYY')
                  })
                  document.getElementById('calendar').style.display = 'none'
                }}
              />
            </div>
          </div>
        </div>
      </div>

    )
  }
  _ownName = () => {
    let { confirmSelectUserJson } = this.state
    return (
      <div className="petName" style={{ marginTop: mTop(18), alignItems: 'flex-end' }}
      >
        <div className="l">

          <p ><span style={{ color: 'red' }}>*</span> Patient ID</p>
          <div className="infoInput">
            <Input bordered={false}
              value={this.state.patientId}
              onChange={(item) => {

                this.setState({
                  patientId: item.target.value.replace(/\s/g, ""),
                  intFlog: true

                })
                if (item.target.value !== errPatientId) {
                  message.destroy()
                }
              }}
              onBlur={() => {
                message.destroy()
                console.log('我离开光标了');
                if (this.state.patientId === this.state.oldPatientId) {
                  return
                }

                let params = {
                  patientId: this.state.patientId,
                  doctorId: storage.userId
                }
                if (storage.lastWorkplaceId) {
                  params.workplaceId = storage.lastWorkplaceId
                }

                fetchRequest(`/pet/checkPatientId`, "GET", params)
                  .then(res => {
                    console.log(res);
                    if (res.flag === false) {
                      errPatientId = params.patientId
                      message.destroy()
                      message.error('This patient ID is already occupied, please change to a new one', 0)
                    } else {
                      errPatientId = ''
                    }

                  })
                  .catch(err => {
                    console.log(err);

                  })
              }}
            />
          </div>

        </div>


        <div className="r">
          <div className="infoInput flex"
            style={{ marginTop: px(8), flexDirection: 'row', justifyContent: 'space-between', cursor: 'pointer', }}
            onClick={() => {

              this.setState({
                // selectUser: true
              })
            }}
          >

            <div className="myBreed" style={{ width: '90%', height: px(25) }}>{confirmSelectUserJson.name ? confirmSelectUserJson.name : 'My Parents'}</div>
            <div className="nextimg" >
              <img src={nextImg} style={{ height: px(15) }} />
            </div>


          </div>


        </div>

      </div>

    )

    // return (
    //   <div className="petName" style={{ marginTop: mTop(30) }}>
    //     <div className="l">
    //       <p >Owner First Name</p>
    //       <div className="infoInput">
    //         <Input bordered={false}
    //           value={this.state.initfirstName}
    //           onChange={(item) => {

    //             this.setState({
    //               firstName: item.target.value.replace(/(^\s*)|(\s*$)/g, ""),
    //               initfirstName: item.target.value
    //             })
    //           }}

    //         />
    //       </div>
    //     </div>

    //     <div className="r">
    //       <p >Owner Last Name</p>
    //       <div className="infoInput">
    //         <Input bordered={false}
    //           value={this.state.initlastName}
    //           onChange={(item) => {

    //             this.setState({
    //               lastName: item.target.value.replace(/(^\s*)|(\s*$)/g, ""),
    //               initlastName: item.target.value
    //             })
    //           }}
    //         />
    //       </div>
    //     </div>
    //   </div>

    // )
  }
  _select = (value, data) => {
    console.log(value, data);  //value的值为id
    this.setState({
      petSpeciesBreedId: value,
      breedName: data.children
    })
  }
  _primaryBreed = () => {
    let options = null
    // switch (this.state.petSpecies) {
    //     case 2: options = this.state.catData.map(d => <Option key={d.petSpeciesBreedId}>{d.breedName}</Option>); break;
    //     case 1: options = this.state.dogData.map(d => <Option key={d.petSpeciesBreedId}>{d.breedName}</Option>); break;
    // }
    options = this.state.breedArr.map(d => <Option key={d.petSpeciesBreedId}>{d.breedName}</Option>);
    let { breedName, confirmSelectBreedJson } = this.state
    // console.log('-----breedName:', confirmSelectBreedJson);

    return (
      <div className="petName" style={{ marginTop: mTop(30), alignItems: 'flex-end', }}>
        <div className="l">
          {/* <p >Primary Breed</p>
          <div className="infoInput">
            <Select
              showSearch
              style={{ width: '100%' }}
              bordered={false}
              value={breedName}
              // size = {'small'}        
              placeholder="Search to Select"
              optionFilterProp="children"
              listHeight={256}
              onSelect={(value, data) => this._select(value, data)}
              filterOption={(input, option) => option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
              filterSort={(optionA, optionB) => optionA.children.toLowerCase().localeCompare(optionB.children.toLowerCase())}
            >
              {options}
            </Select>
          </div> */}
          <div className="infoInput flex"
            style={{ marginTop: px(8), flexDirection: 'row', justifyContent: 'space-between', cursor: 'pointer' }}
            onClick={() => {
              this.setState({
                selectBreed: true
              })
            }}
          >

            <div className="myBreed" style={{ width: '90%', height: px(25) }}>{confirmSelectBreedJson.name ? confirmSelectBreedJson.name : 'My Breed'}</div>
            <div className="nextimg" >
              <img src={nextImg} style={{ height: px(15) }} />
            </div>


          </div>


        </div>



        <div className="r" >
          <div className="max">
            Mix?
            <div className="selected"
              onClick={() => this.setState({
                isMix: !this.state.isMix
              })}
            >
              {(this.state.isMix) ? (<img src={dui} alt="" width='20px' />) : (null)}

            </div>
          </div>

        </div>
      </div>

    )
  }
  _weight = () => {
    let ibBgcColor = '', ibCor = '', kgBgcColor = '', kgCor = '', femaleBgc = '', maleBgc = '';
    switch (this.state.unit) {
      case 1: ibBgcColor = '#E1206D'; ibCor = '#fff'; kgBgcColor = '#fff'; kgCor = '#E1206D'; break;
      case 2: ibBgcColor = '#fff'; ibCor = '#E1206D'; kgBgcColor = '#E1206D'; kgCor = '#fff'; break;
    }

    switch (this.state.gender) {
      case 1: femaleBgc = '#E1206D'; maleBgc = '#F08FB6'; break;
      case 0: femaleBgc = '#F08FB6'; maleBgc = '#E1206D'; break;
    }

    return (
      <div className="petName" style={{ marginTop: mTop(30) }}>
        <div className="l">
          <p >Pet Weight</p>
          <div className="infoInput">
            <Input bordered={false}
              value={this.state.weight}
              onChange={(item) => {

                this.setState({
                  weight: item.target.value
                })
              }}

            />
            <div className="ibKg">
              <div className="ibs"
                style={{ backgroundColor: ibBgcColor, color: ibCor }}
                onClick={() => {
                  if (this.state.unit === 2) {

                    this.setState({
                      unit: 1,
                      weight: (this.state.weight * 2.2046).toFixed(1)
                    })
                  }
                }}
              >Ibs</div>
              <div className="kgs"
                style={{ backgroundColor: kgBgcColor, color: kgCor }}
                onClick={() => {

                  if (this.state.unit === 1) {

                    this.setState({
                      unit: 1,
                      weight: (this.state.weight / 2.2046).toFixed(1)
                    })
                  }
                  this.setState({ unit: 2 })
                }}
              >kgs</div>

            </div>

          </div>
        </div>

        <div className="r">
          <p style={{ color: '#4a4a4a', fontSize: '17px', marginTop: '20px' }}>Pet Gender</p>
          <div className="gender">
            <div className="selectGender">
              <div className="female" style={{ marginRight: px(8), fontSize: px(18) }}>
                <div className="femaleCiral"
                  style={{ backgroundColor: femaleBgc, width: px(40), height: px(40), }}
                  onClick={() => this.setState({ gender: 1 })}
                >
                  <img src={female} alt="" style={{ width: px(15) }} />
                </div>
                Female
              </div>
              <div className="male" style={{ fontSize: px(18) }}>
                <div className="maleCiral"
                  style={{ backgroundColor: maleBgc, width: px(40), height: px(40), }}
                  onClick={() => this.setState({ gender: 0 })}
                >
                  <img src={male} alt="" style={{ width: px(20) }} />
                </div>
                Male
              </div>
            </div>
          </div>
        </div>
      </div>

    )
  }

  render() {
    const { closeColor, closebgc, minbgc } = this.state

    return (
      <div id="editPetInfo">
        {/* 头部 */}
        <div className="close1">
          {/* 菜单 */}
          <div className="menu">

            <MyIcon type='icon-fanhui4' className="icon" onClick={() => {
              // if (storage.goEditPet === "mesasure") {
              //   this.props.history.push({ pathname: 'page8', participate: { patientId: this.state.patientId } })
              // } else {
              //   this.props.history.goBack()
              // }
              this.props.history.goBack()
            }} />
          </div>
          <div className="text">mella</div>
          <div className='maxmin'>
            <div
              className="min iconfont icon-64"
              onClick={this._min}
              onMouseEnter={this._minMove}
              onMouseLeave={this._minLeave}
              style={{ backgroundColor: minbgc }}
            ></div>

            <div
              className="max iconfont icon-guanbi2"
              onClick={this._close}
              onMouseEnter={this._closeMove}
              onMouseLeave={this._closeLeave}
              style={{ backgroundColor: closebgc, color: closeColor }}
            ></div>
          </div>


        </div>



        <div className="editPetInfo_top">
          <div className="title">{`${this.state.patientId}, ${this.state.petName}`}</div>
          {this._petSpecies()}
          {this._petName()}
          {this._ownName()}
          {this._primaryBreed()}
          {this._weight()}
        </div>
        <div className="editPetInfo_foot">
          <div className="save"
            onClick={() => {
              let { petName, birthday, firstName, lastName, petSpeciesBreedId, isMix, weight, gender, unit, imageId, breedName, petId, confirmSelectBreedJson, confirmSelectUserJson } = this.state
              console.log('生日：', birthday);
              if (unit === 1) {
                weight = (0.45359 * weight).toFixed(2)
              }

              let data = {
                petName,
                weight: parseFloat(weight),
                gender,
                firstName,
                lastName,
              }
              if (birthday) {
                data.birthday = moment(birthday).format('YYYY-MM-DD')
              }
              if (imageId !== -1) {
                data.imageId = imageId
              }
              // if (breedName) {
              //   data.breedName = breedName
              // }
              if (confirmSelectBreedJson.name) {
                data.breedName = confirmSelectBreedJson.name
              }
              if (confirmSelectUserJson.petSpeciesBreedId) {
                data.userId = confirmSelectUserJson.petSpeciesBreedId
              }

              console.log('------', data);
              this.setState({
                spin: true
              })
              fetchRequest(`/pet/updatePetInfo/${petId}`, 'POST', data)
                .then(res => {
                  this.setState({
                    spin: false
                  })
                  console.log(res);
                  if (res.flag === true) {
                    try {
                      if (storage.identity === '3') {
                        let data = JSON.parse(storage.doctorExam)
                        data.petName = petName
                        data.weight = weight
                        data.gender = gender
                        data.patientId = this.state.patientId
                        if (birthday) {
                          data.age = moment(new Date()).diff(moment(birthday), 'years')
                        }
                        if (confirmSelectBreedJson.name) {
                          data.breed = confirmSelectBreedJson.name
                        }
                        if (this.state.petUrl) {
                          data.url = this.state.petUrl
                        }

                        storage.doctorExam = JSON.stringify(data)
                      }
                    } catch (error) {

                    }
                    console.log('从哪来', storage.goEditPet);
                    // if (storage.goEditPet === "mesasure") {
                    //   this.props.history.replace({ pathname: 'page8', participate: { patientId: this.state.patientId } })
                    // } else {
                    //   this.props.history.goBack()
                    // }

                    this.props.petDetailInfoFun({ ...this.props.petDetailInfo, petName, birthday, patientId: this.state.patientId })
                    this.props.history.goBack()



                  } else {
                    message.error('Update failed')
                  }
                })
                .catch(err => {
                  this.setState({
                    spin: false
                  })
                  console.log(err);
                })
            }}

          >Save Changes</div>

        </div>
        <MyModal
          visible={this.state.spin}
        />
        <MyModal
          // visible={true}
          visible={this.state.selectBreed}
          element={
            <div className='myfindOrg' >
              <div className="orgHeard">
                <div className="titleicon" style={{ marginTop: px(5) }}>
                  <div>

                  </div>
                  <div
                    onClick={() => {
                      this.setState({
                        selectBreed: false,
                        selectBreedJson: {}
                      })
                    }}
                  >
                    <img src={Close} alt="" style={{ width: px(25) }} />
                  </div>
                </div>
                <div className="text" >Choose Breed</div>

                <div className="searchBox">

                  <Input
                    placeholder=" &#xe61b; Search name"
                    bordered={false}
                    allowClear={true}
                    value={this.state.searchBreed}
                    onChange={(item) => {

                      this.setState({
                        searchBreed: item.target.value
                      })
                    }}

                  />

                </div>
              </div>


              <div className="list" >
                <PhoneBook
                  listDate={this.state.breedArr}
                  confirmSelectBreed={this.state.petSpeciesBreedId}
                  selectFun={(val) => {
                    // console.log('从子组件传来的数据', val);
                    this.setState({
                      selectBreedJson: val,
                      petSpeciesBreedId: val.petSpeciesBreedId
                    })


                  }}
                  searchText={this.state.searchBreed}
                />
              </div>

              <div className="foot">
                <Button
                  text={'Select'}
                  onClick={() => {
                    this.setState({
                      confirmSelectBreedJson: this.state.selectBreedJson,
                      selectBreed: false
                    })
                  }}
                />

              </div>

            </div>
          }
        />

        <MyModal
          visible={this.state.selectUser}
          element={
            <div className='myfindOrg' >
              <div className="orgHeard">
                <div className="titleicon" style={{ marginTop: px(5) }}>
                  <div>

                  </div>
                  <div
                    onClick={() => {
                      this.setState({
                        selectUser: false,
                        selectUserJson: {}
                      })
                    }}
                  >
                    <img src={Close} alt="" style={{ width: px(25) }} />
                  </div>
                </div>
                <div className="text" >Choose Parents</div>

                <div className="searchBox">

                  <Input
                    placeholder=" &#xe61b; Search name"
                    bordered={false}
                    allowClear={true}
                    value={this.state.searchBreed}
                    onChange={(item) => {

                      this.setState({
                        searchBreed: item.target.value
                      })
                    }}

                  />

                </div>
              </div>


              <div className="list" >
                <PhoneBook
                  listDate={this.state.doctorArr}
                  confirmSelectBreed={this.state.selectUserId}
                  selectFun={(val) => {

                    this.setState({
                      selectUserJson: val,
                      selectUserId: val.petSpeciesBreedId
                    })


                  }}
                  searchText={this.state.searchBreed}
                />
              </div>

              <div className="foot">
                <Button
                  text={'Select'}
                  onClick={() => {
                    this.setState({
                      confirmSelectUserJson: this.state.selectUserJson,
                      selectUser: false
                    })
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
export default connect(
  state => ({
    petDetailInfo: state.petReduce.petDetailInfo
  }),
  { petDetailInfoFun }
)(EditPetInfo)