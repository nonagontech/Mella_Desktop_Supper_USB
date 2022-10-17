import React, { Component } from 'react'
import { Input, Menu, message, Select, Calendar, Col, Row, Spin, Modal } from 'antd';
import { createFromIconfontCN, ExclamationCircleOutlined } from '@ant-design/icons';

import dog from '../../assets/images/pinkdog.png'
import cat from '../../assets/images/pinkcat.png'
import redDog from '../../assets/images/reddog.png'
import redCat from '../../assets/images/redcat.png'
import redother from '../../assets/images/redother.png'
import other from '../../assets/images/other.png'
import selectphoto from '../../assets/images/sel.png'
import Close from '../../assets/img/close.png'
import nextImg from '../../assets/img/nextImg.png'
import dui from '../../assets/images/dui.png'
import female from '../../assets/images/female.png'
import male from '../../assets/images/male.png'

import { mTop, px, win } from '../../utils/px';
import MyModal from '../../utils/myModal/MyModal';
import electronStore from '../../utils/electronStore';
import PhoneBook from '../../utils/phoneBook/PhoneBook';
import Button from '../../utils/button/Button';
import Avatar from '../../components/avatar/Avatar';
import SelectPetBreed from "../../components/selectPetBreedModal";

import { connect } from 'react-redux';
import { petDetailInfoFun } from '../../store/actions';
import moment from 'moment';

import {
  checkPatientId,
  getPetInfoByPatientIdAndPetId,
  updatePetInfo,
  deletePetByPetId,
  updatePetInfo1
} from '../../api/mellaserver/pet';
import {
  listDoctorsByAdmin
} from '../../api/mellaserver/organization';

import './index.less';
import _ from 'lodash';

const MyIcon = createFromIconfontCN({
  scriptUrl: '//at.alicdn.com/t/font_2326495_7b2bscbhvvt.js'
})
let storage = window.localStorage;
let errPatientId = ''
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
    selectUserId: -1,
    confirmSelectUserJson: {},
    petUrl: '',
    deletePetModalVisible: false,
  }

  componentDidMount() {
    let ipcRenderer = window.electron.ipcRenderer
    ipcRenderer.send('big', win())
    let { petDetailInfo } = this.props
    let { petId, patientId, petName, lastName, firstName, breedName, isWalkIn } = petDetailInfo
    if (!isWalkIn) {
      //判断是医生诊断宠物还是用户私有宠物
      if (this.props.history.location?.pet) {
        this.setState({
          patientId: this.props.history.location?.pet?.patientId,
          petId: this.props.history.location.pet?.petId,
          oldPatientId: this.props.history.location?.pet?.patientId,
          breedName: this.props.history.location?.pet?.breedName
        }, () => {
          this._getPetInfo();
        })
      } else {
        if (!patientId || patientId === 'unknown') {
          patientId = null
        }
        this.setState({
          patientId,
          petId,
          oldPatientId: patientId,
          breedName: breedName
        }, () => {
          this._getPetInfo();
        })
      }
    }
    let dogBreed = electronStore.get('dogBreed') || []
    let catBreed = electronStore.get('catBreed') || []
    this.setState({
      dogBreed,
      catBreed
    })
    ipcRenderer.on('changeFenBianLv', this.changeFenBianLv)
    //获取工作场所
    // this.getUser()
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
  //获取工作场所
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
    listDoctorsByAdmin(storage.lastOrganization, params)
      .then(res => {
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
          })

        }
      })
      .catch(err => {
        console.log(err);
      })
  }
  //获取宠物详情信息
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
    getPetInfoByPatientIdAndPetId(datas)
      .then(res => {
        this.setState({
          spin: false
        })
        if (res.flag === true) {
          let datas = []
          for (let i = 0; i < res.data.length; i++) {
            if (res.data[i].petId === this.state.petId) {
              datas = res.data[i]
              break
            }
          }
          let { petId, petName, lastName, firstName, breedName, isMix, birthday, weight, url, gender, speciesId, petSpeciesBreedId } = datas
          if (isMix !== true) {
            isMix = false
          }
          lastName = isNull(lastName)
          firstName = isNull(firstName)
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
          if (gender === null || isNaN(gender) || `${gender}` === 'null' || `${gender}` === 'NaN') {
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
            initpetName: petName,
            initlastName: lastName,
            initfirstName: firstName,
            confirmSelectBreedJson,
            petSpeciesBreedId
          })
          // switch (petSpeciesBreedId) {
          //   case 1: this.selectWZ('cat'); break;
          //   case 2: this.selectWZ('dog'); break;

          //   default: this.selectWZ('other'); break;
          // }

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
      if (value === null || isNaN(value) || `${value}` === 'null' || `${value}` === 'NaN') {
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
  //选择宠物默认品种
  selectWZ = (val) => {
    let { catBreed, dogBreed } = this.state
    if (this.state.selectWZ !== val) {
      switch (val) {
        case 'dog':
          this.setState({
            catImg: cat,
            dogImg: redDog,
            otherImg: other,
            selectWZ: val,
            breedArr: [].concat(dogBreed),
            confirmSelectBreedJson: {
              name: "defaultdog",
              petSpeciesBreedId: 12001
            }
          })

          break;

        case 'cat':
          this.setState({
            catImg: redCat,
            dogImg: dog,
            otherImg: other,
            selectWZ: val,
            breedArr: [].concat(catBreed),
            confirmSelectBreedJson: {
              name: "defaultcat",
              petSpeciesBreedId: 11001
            }
          })

          break;

        case 'other':
          this.setState({
            catImg: cat,
            dogImg: dog,
            otherImg: redother,
            selectWZ: val,
            breedArr: [],
            confirmSelectBreedJson: {
              name: "defaultother",
              petSpeciesBreedId: 13001
            }
          })
          break;

        default:
          break;
      }
    }
  }
  //宠物详情第一列
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
          <div className="img">
            <Avatar
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
              getAllInfo={(val) => {
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
  //宠物详情第二列
  _petName = () => {
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
  //宠物详情第三列
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
                if (this.state.patientId === this.state.oldPatientId) {
                  return
                }
                if (this.state.patientId === '' && !this.props.history.location?.pet) {
                  message.error('The pet ID cannot be empty');
                  return
                }
                let params = {
                  patientId: this.state.patientId ? this.state.patientId : null,
                  doctorId: storage.userId
                }
                if (storage.lastWorkplaceId) {
                  params.workplaceId = storage.lastWorkplaceId
                }
                if (storage.lastOrganization) {
                  params.organizationId = storage.lastOrganization
                }
                checkPatientId(params)
                  .then(res => {
                    if (res.flag === false) {
                      errPatientId = params.patientId
                      message.error('This patient ID is already occupied, please change to a new one');
                    } else {
                      errPatientId = '';
                      if (!this.props.history.location?.pet && this.state.patientId !== null) {
                        message.success('This pet ID will work');
                      }
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
  }
  //选择宠物详细品种
  _select = (value, data) => {
    console.log(value, data);  //value的值为id
    this.setState({
      petSpeciesBreedId: value,
      breedName: data.children
    })
  }
  //品种判断
  _primaryBreed = () => {
    let { breedName, confirmSelectBreedJson } = this.state;

    return (
      <div className="petName" style={{ marginTop: mTop(30), alignItems: 'flex-end', }}>
        <div className="l">
          <div className="infoInput flex"
            style={{ marginTop: px(8), flexDirection: 'row', justifyContent: 'space-between', cursor: 'pointer' }}
            onClick={() => {
              this.setState({
                selectBreed: true
              })
            }}
          >
            <div className="myBreed" style={{ width: '90%', height: px(25) }}>
              {
                confirmSelectBreedJson.name ? confirmSelectBreedJson.name : 'My Breed'
              }
            </div>
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
  //体重
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
  //确认删除弹窗
  confirm = () => {
    Modal.confirm({
      title: 'Delete',
      icon: <ExclamationCircleOutlined />,
      content: 'Deleting this pet also deletes all health records associated with this pet. Are you sure?',
      centered: 'true',
      onOk: this.deletPet
    });
  };
  //删除宠物
  deletPet = () => {
    let data = {
      petId: this.state.petId
    }
    deletePetByPetId(data)
      .then(ref => {
        if (ref.flag === true) {
          message.success('Successfully Delete');
          this.props.petDetailInfoFun({});
          this.props.history.goBack();
        } else {
          message.error('Fail to Delete!');
        }
      })
  }
  //更新宠物信息
  save = () => {
    let { petName, birthday, firstName, lastName, petSpeciesBreedId, isMix, weight, gender, unit, imageId, breedName, petId, confirmSelectBreedJson, confirmSelectUserJson } = this.state
    if (unit === 1) {
      weight = (0.45359 * weight).toFixed(2)
    }
    let data = {}
    if (this.state.patientId === this.state.oldPatientId) {
      data = {
        petName,
        weight: parseFloat(weight),
        gender,
        firstName,
        lastName,
      }
    } else {
      data = {
        petName,
        weight: parseFloat(weight),
        gender,
        firstName,
        lastName,
        patientId: this.state.patientId,
      }
    }
    if (birthday) {
      data.birthday = moment(birthday).format('YYYY-MM-DD')
    }
    if (imageId !== -1) {
      data.imageId = imageId
    }
    if (confirmSelectBreedJson.name) {
      data.breedName = confirmSelectBreedJson.name
    }
    if (confirmSelectUserJson.petSpeciesBreedId) {
      data.userId = confirmSelectUserJson.petSpeciesBreedId
    }
    if (storage.lastOrganization) {
      data.organizationId = storage.lastOrganization
    }
    if (this.state.patientId === '' && !this.props.history.location?.pet) {
      message.error('The pet ID cannot be empty');
    } else {
      this.setState({
        spin: true
      })
      //判断是用户更新宠物还是医生更新宠物
      if (this.props.history.location?.pet) {
        updatePetInfo1(this.props.history.location.userId, petId, data)
          .then((res) => {
            this.setState({
              spin: false
            })
            if (res.flag === true) {
              message.success('update successfully');
              this.props.history.push({ pathname: '/menuOptions/editParent', userId: this.props.history.location.userId })
            } else {
              message.error('This patient ID is already occupied, please change to a new one')
            }
          })
          .catch((err) => {
            message.error(err)
          })
      } else {
        updatePetInfo(petId, data)
          .then(res => {
            this.setState({
              spin: false
            })
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
              this.props.petDetailInfoFun({ ...this.props.petDetailInfo, petName, birthday, patientId: this.state.patientId, weight: weight })
              this.props.history.goBack()
            } else {
              message.error('This patient ID is already occupied, please change to a new one')
            }
          })
          .catch(err => {
            this.setState({
              spin: false
            })
          })
      }
    }
  }
  render() {
    const { closeColor, closebgc, minbgc } = this.state
    return (
      <div id="editPetInfo">
        {/* 头部 */}
        <div className="close1">
          {/* 菜单 */}
          <div className="menu">
            <MyIcon
              type='icon-fanhui4'
              className="icon"
              onClick={() => {
                if (!_.isEmpty(this.props.history.location.userId)) {
                  this.props.history.push({ pathname: '/menuOptions/editParent', userId: this.props.history.location.userId })
                } else {
                  this.props.history.goBack()
                }
              }}
            />
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
          <div className='deletePet'
            onClick={this.confirm}
          >
            Delete Pet
          </div>
          <div className="save"
            onClick={() => {
              this.save();
            }}
          >Save Changes</div>
        </div>
        <MyModal
          visible={this.state.spin}
        />
        {
          this.state.selectBreed && (
            <SelectPetBreed
              visible={this.state.selectBreed}
              destroyOnClose
              width={400}
              value={this.state.petSpeciesBreedId}
              onSelect={(value) => {
                this.setState({
                  selectBreed: false,
                  selectBreedJson: value,
                  petSpeciesBreedId: value.petSpeciesBreedId,
                  confirmSelectBreedJson: value,
                })
              }}
              onCancel={() => {
                this.setState({
                  selectBreed: false,
                })
              }}
            />
          )
        }
        {
          this.state.selectUser && (
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
          )
        }
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
