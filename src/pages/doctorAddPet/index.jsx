import React, { Component } from 'react'
import { Input, message, Select, Calendar, Col, Row, Spin, Modal } from 'antd';

import dog from '../../assets/images/pinkdog.png'
import cat from '../../assets/images/pinkcat.png'
import redDog from '../../assets/images/reddog.png'
import redCat from '../../assets/images/redcat.png'
import redother from '../../assets/images/redother.png'
import other from '../../assets/images/other.png'
import nextImg from '../../assets/img/nextImg.png'
import selectphoto from '../../assets/images/sel.png'
import dui from '../../assets/images/dui.png'
import female from '../../assets/images/female.png'
import male from '../../assets/images/male.png'

import electronStore from '../../utils/electronStore';
import { mTop, px, win } from '../../utils/px';
import Heard from '../../utils/heard/Heard';
import Avatar from '../../components/avatar/Avatar';
import SelectPetBreed from "../../components/selectPetBreedModal";

import { connect } from 'react-redux';
import { petDetailInfoFun, setMenuNum, } from '../../store/actions';
import moment from 'moment';

import './index.less';
import { addDeskPet, checkPatientId, getPetInfoByPatientIdAndPetId, selectBreedBySpeciesId } from '../../api';

const { Option } = Select;
let storage = window.localStorage;
let errPatientId = ''
class DoctorAddPet extends Component {
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
    catData: [],
    petSpeciesBreedId: '',
    dogData: [],
    breedArr: [],
    birthday: moment(new Date()).format('MMMM D, YYYY'),
    patientId: '',
    petName: '',
    petId: '',
    lastName: '',
    firstName: '',
    breedName: '',
    owner: '',
    intFlog: false,
    spin: false,
    visible: false,
    dogBreed: [],
    catBreed: [],
    searchBreed: '',
    selectBreedJson: {},
    confirmSelectBreedJson: {},
    selectBreed: false,
    isModalVisible: false,
    confirmLoading: false,
    selectBreedVisible: false,
  }
  componentDidMount() {
    let ipcRenderer = window.electron.ipcRenderer
    ipcRenderer.send('big', win())
    ipcRenderer.on('changeFenBianLv', this.changeFenBianLv)
    let dogBreed = electronStore.get('dogBreed') || []
    let catBreed = electronStore.get('catBreed') || []
    this.setState({
      dogBreed,
      catBreed
    })
  }
  componentWillUnmount() {
    let ipcRenderer = window.electron.ipcRenderer
    ipcRenderer.removeListener('changeFenBianLv', this.changeFenBianLv)
  }
  changeFenBianLv = (e) => {
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

    selectBreedBySpeciesId(data)
      .then(res => {
        console.log('---', res);
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
  _getData = (val) => {
    this.setState({
      petSpecies: val,
      breedName: ''
    })
    let data = {
      speciesId: val
    }
    selectBreedBySpeciesId(data)
      .then(res => {
        console.log('--获取品种返回的数据-', res);
        if (res.code === 0) {
          let arr = []
          res.petlist.map((item, index) => {
            let data = {
              petSpeciesBreedId: item.petSpeciesBreedId,
              breedName: item.breedName
            }
            arr.push(data)
          })
          console.log(arr);
          this.setState({
            breedArr: arr
          })
        }
      })
      .catch(err => {
        console.log(err);
      })

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
  handleClick = e => {
    console.log('click ', e);
    const { api, id, seleceID } = this.state
    if (e.key === '1') {
      this.props.history.push({ pathname: '/page6', query: { api, id, seleceID } })
    }
    if (e.key === '2') {
      this.props.history.push('/')
    }

  };
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
    this.avatar = selectphoto
    return (
      <div className="petSpecies">
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
            />
          </div>

        </div>

      </div>

    )
  }
  _petName = () => {
    let birthday = this.state.birthday
    let birthdayValue = birthday ? moment(birthday) : moment(new Date())
    return (
      <div className="petName"
        style={{ marginTop: mTop(18) }}
      >
        <div className="r">
          <p >Pet Name</p>
          <div className="infoInput">
            <Input
              bordered={false}
              value={this.state.petName}
              onChange={(item) => {

                this.setState({
                  petName: item.target.value
                })
              }}
            />
          </div>
        </div>
        <div className="r">
          <p >Pet Birthday</p>
          <div className="infoInput" >
            <p
              style={{ weight: '60px', height: '27px', padding: 0, margin: 0 }}
              onClick={() => {
                document.getElementById('calendar').style.display = 'block'
              }}
            >
              {this.state.birthday}
            </p>
            <div className="calendar" id="calendar" style={{ left: px(-50), top: px(-50) }}>
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
                  for (let i = moment(new Date()).year(); i > moment(new Date()).year() - 40; i -= 1) {
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
                      </Row>
                    </div>
                  );
                }}
                value={birthdayValue}
                onSelect={(value) => {
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
    return (
      <div className="petName" style={{ marginTop: mTop(18) }}
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
                if (this.state.patientId === '') {
                  message.error('The pet ID cannot be empty');
                  return
                }
                this.setState({
                  spin: true
                });
                let params = {
                  patientId: this.state.patientId,
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
                      errPatientId = params.patientId;
                      this.setState({
                        isModalVisible: true,
                        spin: false,
                      })
                    } else {
                      errPatientId = '';
                      message.success('This pet ID will work');
                      this.setState({
                        spin: false,
                      })
                    }
                  })
                  .catch(err => {
                    this.setState({
                      spin: false
                    });
                  })
              }}
            />
          </div>
        </div>
        <div className="r">
          <div className="infoInput flex"
            style={{ marginTop: px(8), flexDirection: 'row', justifyContent: 'space-between', cursor: 'pointer' }}
            onClick={() => {
              // this.setState({
              //     selectBreed: true
              // })
            }}
          >

            <div className="myBreed" style={{ width: '90%', height: px(25) }}>{'My Parents'}</div>
            <div className="nextimg" >
              <img src={nextImg} style={{ height: px(15) }} />
            </div>
          </div>
        </div>
      </div>
    )
  }
  _select = (value, data) => {
    console.log(value, data);  //value的值为id
    this.setState({
      petSpeciesBreedId: value,
      breedName: data.children
    })
  }
  //选择宠物品种
  _primaryBreed = () => {
    let { confirmSelectBreedJson } = this.state
    return (
      <div className="petName" style={{ marginTop: mTop(18) }}>
        <div className="l" >
          <div className="infoInput flex"
            style={{ marginTop: px(8), flexDirection: 'row', justifyContent: 'space-between', cursor: 'pointer' }}
            onClick={() => {
              this.setState({
                selectBreedVisible: true
              })
            }}
          >
            <div className="myBreed" style={{ width: '90%', height: px(25) }}>{confirmSelectBreedJson.name ? confirmSelectBreedJson.name : 'My Breed'}</div>
            <div className="nextimg" >
              <img src={nextImg} style={{ height: px(15) }} />
            </div>
          </div>
        </div>
        <div className="r" style={{ paddingTop: mTop(40) }}>
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
      <div className="petName" style={{ marginTop: mTop(18) }}>
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
  handleOk = (petId) => {
    let params = {
      patientId: this.state.patientId,
      doctorId: storage.userId,
      petId: petId,
    }
    if (storage.lastWorkplaceId) {
      params.workplaceId = storage.lastWorkplaceId
    }
    if (storage.lastOrganization) {
      params.org = storage.lastOrganization
    }
    this.setState({
      confirmLoading: true
    });
    getPetInfoByPatientIdAndPetId(params)
      .then((res) => {
        this.setState({
          confirmLoading: false,
          isModalVisible: false
        });
        if (res.flag === true) {
          let oldList = res.data[0];
          let {
            age, url, createTime, patientId, speciesId, petName, firstName, birthday, lastName, breedName, gender,
            petId, weight, rfid, l2rarmDistance, neckCircumference, upperTorsoCircumference, lowerTorsoCircumference, pethubId, macId,
            h2tLength, torsoLength
          } = oldList;
          const isUnKnow = (val) => {
            if (val) {
              return val
            } else {
              return 'unknown'
            }
          }
          let owner = ''
          patientId = isUnKnow(patientId)
          petName = isUnKnow(petName)
          breedName = isUnKnow(breedName)
          age = isUnKnow(age)
          weight = isUnKnow(weight)
          if (!firstName) {
            firstName = ''
          }
          if (!lastName) {
            lastName = ''
          }
          if (lastName === '' && firstName === '') {
            owner = 'unknown'
          } else {
            owner = `${lastName} ${firstName}`
          }
          createTime = moment(createTime).format('X')
          let petGender = ''
          switch (`${gender}`) {
            case '1': petGender = 'F'
              break;
            case '0': petGender = "M"
              break;
            default: petGender = 'unknown'
              break;
          }
          let petAge = 'unknown'
          if (birthday) {
            petAge = moment(new Date()).diff(moment(birthday), 'years')
          }

          let json = {
            insertedAt: createTime,
            patientId: this.state.patientId,
            petName,
            owner,
            breed: breedName,
            gender: petGender,
            age: petAge,
            petId,
            weight,
            rfid,
            url,
            speciesId,
            l2rarmDistance,
            neckCircumference,
            upperTorsoCircumference,
            lowerTorsoCircumference,
            h2tLength,
            torsoLength,
            pethubId,
            macId,
          }
          this.props.setMenuNum('1');
          this.props.petDetailInfoFun(json);
          this.props.history.push("/MainBody");
        } else {
          message.error(res.msg);
        }
      })
      .catch(err => {
        this.setState({
          confirmLoading: false,
          isModalVisible: false
        });
        message.error('Jump Failure');
      })
  };
  handleCancel = () => {
    this.setState({
      isModalVisible: false,
      confirmLoading: false,
    })
  };

  render() {
    const { isModalVisible, confirmLoading } = this.state
    return (

      <div id="doctorAddPet">
        <Spin spinning={this.state.spin} size="large" className='doctorAddPetSpin'>
          <div className="heard">
            <Heard />
          </div>
          <div className="editPetInfo_top" >
            <div className="title" style={{ marginBottom: px(20), marginTop: px(20) }}>{`New Pet`}</div>
            {this._petSpecies()}
            {this._petName()}
            {this._ownName()}
            {this._primaryBreed()}
            {this._weight()}
          </div>
          <div className="editPetInfo_foot"  >
            <div className='save'
              onClick={() => { this.props.history.goBack() }}
            >
              cancel
            </div>
            <div className="save"
              onClick={() => {
                if (!this.state.patientId) {
                  message.error('Please enter patient ID')
                  return
                }
                let params = {
                  patientId: this.state.patientId,
                  doctorId: storage.userId
                }
                if (storage.lastWorkplaceId) {
                  params.workplaceId = storage.lastWorkplaceId
                }
                if (storage.lastOrganization) {
                  params.organizationId = storage.lastOrganization
                }

                this.setState({
                  spin: true
                })
                checkPatientId(params)
                  .then(res => {
                    if (res.flag === false) {
                      this.setState({
                        spin: false
                      }, () => {
                        errPatientId = params.patientId
                        message.error('This patient ID is already occupied, please change to a new one')
                      })
                    } else {
                      let { petSpecies, petName, birthday, petSpeciesBreedId, isMix, weight, gender, unit, imageId, confirmSelectBreedJson, owner, patientId, selectWZ } = this.state
                      let species = null
                      if (petSpeciesBreedId) {
                        species = petSpeciesBreedId
                      } else {
                        // 11001 是cat 12001是dog 13001是other
                        switch (selectWZ) {
                          case 'cat': species = 11001; break;
                          case 'dog': species = 12001; break;
                          default: species = 13001;
                            break;
                        }
                      }
                      let data = {
                        petName,
                        birthday: moment(birthday).format('YYYY-MM-DD'),
                        gender,
                        owner,
                        petSpeciesBreedId: species,
                        doctorId: storage.userId
                      }
                      if (weight) {
                        if (unit === 1) {
                          weight = (0.45359 * weight).toFixed(2)
                        }
                        data.weight = parseFloat(weight)
                      }
                      if (imageId !== -1 && imageId) {
                        data.imageId = imageId
                      }
                      if (storage.lastWorkplaceId) {
                        data.workplaceId = storage.lastWorkplaceId
                      }
                      if (storage.lastOrganization) {
                        data.organizationId = storage.lastOrganization
                      }
                      addDeskPet(patientId, data)
                        .then(res => {
                          this.setState({
                            spin: false
                          })
                          if (res.flag === true) {
                            message.success('Added successfully')
                            this.handleOk(res.data.petId);
                          }
                          else {
                            message.error('add failed')
                          }
                        })
                        .catch(err => {
                          this.setState({
                            spin: false
                          })
                          message.error('add failed')
                        })
                    }
                  })
                  .catch(err => {
                    this.setState({
                      spin: false
                    })
                    console.log(err);
                  })
              }}
            >
              Save
            </div>
          </div>
          <Modal
            title=""
            open={isModalVisible}
            onOk={this.handleOk}
            onCancel={this.handleCancel}
            centered
            destroyOnClose
            maskClosable={false}
            confirmLoading={confirmLoading}
          >
            <div style={{ padding: px(24), fontSize: px(16) }}>
              This patient ID is already occupied ! <br />Whether to switch to the pet measurement screen ?
            </div>
          </Modal>
          <SelectPetBreed
            visible={this.state.selectBreedVisible}
            destroyOnClose
            width={400}
            value={this.state.petSpeciesBreedId}
            onSelect={(value) => {
              this.setState({
                selectBreedVisible: false,
                selectBreedJson: value,
                petSpeciesBreedId: value.petSpeciesBreedId,
                confirmSelectBreedJson: value,
              })
            }}
            onCancel={() => {
              this.setState({
                selectBreedVisible: false,
              })
            }}
          />
        </Spin>
      </div>

    )
  }
}

export default connect(
  state => ({

  }),
  { petDetailInfoFun, setMenuNum, }
)(DoctorAddPet)
