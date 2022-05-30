
import React, { Component } from 'react'
import {
  Table,
  Popconfirm,
  Modal,
  Input,
  message,
  Select

} from 'antd'
import moment from 'moment'
import Draggable from "react-draggable";


import './unassigned.less'
import Heard from './../../../utils/heard/Heard'
import { fetchRequest } from '../../../utils/FetchUtil1'


import del from './../../../assets/images/del.png'
import Close from './../../../assets/img/close.png'

import UploadImg from './../../../utils/uploadImg/UploadImg'
import { mTop, px, MTop } from '../../../utils/px';
import electronStore from './../../../utils/electronStore'
import MyModal from '../../../utils/myModal/MyModal';
import Button from './../../../utils/button/Button'

let storage = window.localStorage;
const { Option } = Select;

export default class Unassigned extends Component {

  state = {
    historyData: [],        //列表的数据集合
    units: '℉',
    searchText: '',         //搜索测试记录框输入的内容
    serchExamData: [],       //搜索到的测量记录
    seleceEmergencies: {},  //分配的这条记录里的所有内容，比如温度、id、时间等
    visible: false,       //nodel框是否显示
    disabled: true,       //model是否可拖拽
    imgId: -1,            //上传后返回的图像id号

    assignPatientId: '',
    assignPetName: '',
    assignOwnerName: '',
    assignBreed: '',
    assignBreedId: '',
    assignPetAge: '',
    assignPetWeight: '',
    assignPetId: '',
    assignPetImgUrl: '',
    inputDisabled: false,

    breedArr: [],          //猫、狗品种集合

    loading: false,



    disabled: true,       //model是否可拖拽
    search: '',        //分配宠物搜索框
    petListData: [],
    searchPetList: [],
    assignVisible: false,//点击assign按钮后跳出的选择宠物的弹框
    selectPetId: ''




  }

  componentDidMount () {
    let ipcRenderer = window.electron.ipcRenderer
    let { height, width } = window.screen
    let windowsHeight = height > width ? width : height
    ipcRenderer.send('Lowbig')
    // if (windowsHeight < 1000) {
    //   ipcRenderer.send('table')
    // } else {
    //   ipcRenderer.send('big')
    // }
    let getBreed = electronStore.get('getBreed')
    console.log('------', getBreed);
    if (getBreed) {
      this.setState({
        breedArr: getBreed
      })
    }
    ipcRenderer.on('changeFenBianLv', this.changeFenBianLv)
    this._getEmergencyHistory()
    const timer = setTimeout(() => {
      this._getBreed()
      clearTimeout(timer)
    }, 3000);

    let list = electronStore.get('doctorExam')
    this.setState({
      petListData: list
    })




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
    ipcRenderer.send('Lowbig')
    // if (windowsHeight < 1000) {
    //   ipcRenderer.send('table')
    // } else {
    //   ipcRenderer.send('big')
    // }
    this.setState({

    })
  }



  _getEmergencyHistory = () => {

    //封装的日期排序方法
    function ForwardRankingDate (data, p) {
      for (let i = 0; i < data.length - 1; i++) {
        for (let j = 0; j < data.length - 1 - i; j++) {
          if (Date.parse(data[j][p]) < Date.parse(data[j + 1][p])) {
            var temp = data[j];
            data[j] = data[j + 1];
            data[j + 1] = temp;
          }
        }
      }
      return data;
    }
    let historys = []
    this.setState({
      loading: true,

    })
    fetchRequest(`/pet/getPetExamByDoctorId/${storage.userId}`, 'GET', '')  //userID要自动的
      .then(res => {
        console.log('---res', res);
        if (res.flag === true) {
          let datas = res.data
          for (let i = datas.length - 1; i >= 0; i--) {
            if (datas[i].petId === null) {
              let { petId, examId, userId, petVitalTypeId, temperature, roomTemperature, bloodPressure, memo, clinicalDatagroupId,
                bodyConditionScore, heartRate, respiratoryRate, referenceRectalTemperature, furLength, createTime, clinicalDataEntity, } = datas[i]
              let day = moment().diff(moment(createTime), 'day')
              // console.log(day);
              if (day > 3) {
                continue
              }

              let Tem = temperature
              try {
                if (clinicalDataEntity) {
                  Tem = temperature || clinicalDataEntity.data0
                }

              } catch (error) {
                console.log('抛出的异常', error);
              }
              let str = {
                clinicalDatagroupId,
                createTime,
                date: moment(createTime).format('MMM DD'),
                time: moment(createTime).format('hh:mm A'),
                temp: parseInt(Tem * 10) / 10,
                placement: petVitalTypeId,
                note: memo,
                historyId: examId,
                bodyConditionScore, heartRate, respiratoryRate, referenceRectalTemperature, furLength, roomTemperature, bloodPressure, petId, userId,
                day
              }

              historys.push(str)
            }
          }

          //把所有数据拿完后做个排序

          let historyData = ForwardRankingDate(historys, "createTime");
          console.log('historyData:', historyData);
          this.setState({
            historyData,
            loading: false
          })
        } else {
          this.setState({
            loading: false
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
  _getBreed = () => {
    fetchRequest(`/pet/selectBreedBySpeciesId`, 'POST', { speciesId: 1 })
      .then(res => {
        if (res.code === 0) {
          let arr = []
          res.petlist.map((item, index) => {
            let data = {
              petSpeciesBreedId: item.petSpeciesBreedId,
              breedName: item.breedName,
              speciesId: 1
            }

            arr.push(data)
          })

          fetchRequest(`/pet/selectBreedBySpeciesId`, 'POST', { speciesId: 2 })
            .then(res => {
              if (res.code === 0) {

                res.petlist.map((item, index) => {
                  let data = {
                    petSpeciesBreedId: item.petSpeciesBreedId,
                    breedName: item.breedName,
                    speciesId: 2
                  }
                  arr.push(data)
                })



                console.log('----品种集合：', arr);
                electronStore.set('getBreed', arr)
                this.setState({
                  breedArr: arr
                })
              }
            })
            .catch(err => {
              console.log(err);
            })

        }
      })
      .catch(err => {
        console.log(err);
      })

  }

  _search = (value = '') => {
    console.log('我要去搜索了');
    let list = this.state.historyData
    let searchData = []
    let keyWord = value || this.state.searchText
    for (let i = 0; i < list.length; i++) {


      let note = list[i].note ? list[i].note.toLowerCase() : ''
      if (
        `${note}`.indexOf(keyWord.toLowerCase()) !== -1

      ) {
        searchData.push(list[i])
      }
    }

    this.setState({
      serchExamData: searchData
    })

  }
  _searchPet = (value = '') => {
    console.log('我要去搜索了', this.state.petListData);
    let list = this.state.petListData
    let searchData = []
    let keyWord = value || this.state.searchText
    for (let i = 0; i < list.length; i++) {


      let name = list[i].petName ? list[i].petName.toLowerCase() : ''
      let rfid = list[i].rfid ? list[i].rfid.toLowerCase() : ''
      let patientId = list[i].patientId ? list[i].patientId.toLowerCase() : ''

      if (
        `${name}`.indexOf(keyWord.toLowerCase()) !== -1
        || `${rfid}`.indexOf(keyWord.toLowerCase()) !== -1
        || `${patientId}`.indexOf(keyWord.toLowerCase()) !== -1

      ) {
        searchData.push(list[i])
      }
    }

    this.setState({
      searchPetList: searchData
    })

  }

  draggleRef = React.createRef();



  handleOk = (e) => {
    console.log(e);
    this.setState({
      visible: false,
      assignPatientId: '',
      assignPetName: '',
      assignOwnerName: '',
      assignBreed: '',
      assignBreedId: '',
      assignPetAge: '',
      assignPetWeight: '',
      assignPetId: '',
      assignPetImgUrl: ''
    });
  };

  handleCancel = (e) => {
    console.log('取消');
    this.setState({
      visible: false,
      assignPatientId: '',
      assignPetName: '',
      assignOwnerName: '',
      assignBreed: '',
      assignBreedId: '',
      assignPetAge: '',
      assignPetWeight: '',
      assignPetId: '',
      assignPetImgUrl: ''
    });
  };

  onStart = (event, uiData) => {
    const { clientWidth, clientHeight } = window?.document?.documentElement;
    const targetRect = this.draggleRef?.current?.getBoundingClientRect();
    this.setState({
      bounds: {
        left: -targetRect?.left + uiData?.x,
        right: clientWidth - (targetRect?.right - uiData?.x),
        top: -targetRect?.top + uiData?.y,
        bottom: clientHeight - (targetRect?.bottom - uiData?.y)
      }
    });
  };
  _select = (value, data) => {
    console.log(value, data);  //value的值为id
    this.setState({
      assignBreedId: value,
      assignBreed: data.children
    })
  }

  _modal = () => {
    let that = this

    function getPetInfoByPatientId () {


      switch (storage.identity) {
        case '1':
          console.log('我是vetspire查找');

          break;

        case '2':
          console.log('我是ezyVet查找');
          let params = {
            animalId: that.state.assignPatientId,
            organizationId: 4
          }
          let paramsArray = [];
          Object.keys(params).forEach(key =>
            paramsArray.push(key + "=" + params[key])
          );
          let url = 'http://ec2-3-214-224-72.compute-1.amazonaws.com:8080/mellaserver/petall/getPetInfoByAnimalId'
          // 判断是否地址拼接的有没有 ？,当没有的时候，使用 ？拼接第一个参数，如果有参数拼接，则用&符号拼接后边的参数   
          if (url.search(/\?/) === -1) {
            url = url + "?" + paramsArray.join("&");
          } else {
            url = url + "&" + paramsArray.join("&");
          }
          console.log('ezyVet集成查找宠物入参-请求地址', params, url);
          fetch(url, {
            method: "GET",
            headers: {
              'authorization': `Bearer ${storage.ezyVetToken}`,
            }
          }).then((response) => response.json())
            .then((res) => {
              console.log('res', res);
              this.setState({
                spin: false
              })
              if (res.flag === true) {
                //有宠物，进入1
                let petArr = res.data
                if (petArr.length > 1) {
                  petArr.sort(function (a, b) {
                    return a.createTime > b.createTime ? -1 : -1;
                  })
                }
                console.log(petArr);

                let { petId } = petArr
                // assign(petId)

              } else {
                //没有宠物
                message.error('There are no pets under this patientID')
              }
            })
            .catch((err) => {
              console.log(err);
              message.error('There are no pets under this patientID')
            });

          break;

        case '3':
          console.log('我是一般医生查找');
          let datas = {
            patientId: that.state.assignPatientId,
            doctorId: storage.userId,
          }
          if (storage.lastWorkplaceId) {
            datas.workplaceId = storage.lastWorkplaceId
          }
          console.log('入参：', datas);
          fetchRequest('/pet/getPetInfoByPatientIdAndPetId', 'POST', datas)
            .then(res => {
              if (res.flag === true) {
                //有宠物，进入1
                let petArr = res.data
                if (petArr.length > 1) {
                  petArr.sort(function (a, b) {
                    return a.createTime > b.createTime ? -1 : -1;
                  })
                }

                console.log('获取到宠物信息', petArr);

                let { petId, petName, firstName, lastName, breedName, age, weight, url, birthday } = petArr[0]

                let assignPetName = petName ? petName : '';
                let assignOwnerName = lastName ? lastName : ''
                assignOwnerName = firstName ? `${assignOwnerName} ${firstName}` : assignOwnerName;
                let assignBreed = breedName ? breedName : '';
                let assignPetAge = age ? age : '';
                let assignPetWeight = weight ? weight : ''
                let assignPetImgUrl = url ? url : ''

                if (!assignPetAge) {
                  let now = moment(new Date())
                  let year = now.diff(moment(birthday), 'years')
                  assignPetAge = year
                }


                that.setState({
                  assignPetName,
                  assignBreed,
                  assignPetAge,
                  assignPetWeight,
                  assignPetId: petId,
                  assignPetImgUrl,
                  inputDisabled: true
                })


                // assign(petId)
              } else {
                that.setState({
                  inputDisabled: false,
                  assignPetName: '',
                  assignOwnerName: '',
                  assignBreed: '',
                  assignBreedId: '',
                  assignPetAge: '',
                  assignPetWeight: '',
                  assignPetId: '',
                  assignPetImgUrl: ''
                })
                message.error('There are no pets under this patientID')
              }
            })
            .catch(err => {
              that.setState({
                inputDisabled: false,
                assignPetName: '',
                assignOwnerName: '',
                assignBreed: '',
                assignBreedId: '',
                assignPetAge: '',
                assignPetWeight: '',
                assignPetId: '',
                assignPetImgUrl: ''
              })
              message.error('There are no pets under this patientID')
              console.log(err);
            })
          break;

        default:
          break;
      }
    }
    const assignPet = () => {
      let parmes = {
        petId: this.state.assignPetId,
        clinicalDatagroupId: that.state.seleceEmergencies.clinicalDatagroupId
      }
      console.log('分配的数据信息', parmes);
      fetchRequest(`/pet/addAndSavePetExam/${that.state.seleceEmergencies.historyId}`, 'POST', parmes)
        .then(res => {
          console.log('----------', res);
          if (res.flag === true) {
            console.log('分配成功');
            message.success('Assigned successfully')
            that._getEmergencyHistory()
            that.setState({
              visible: false,
              assignPatientId: '',
              assignPetName: '',
              assignOwnerName: '',
              assignBreed: '',
              assignBreedId: '',
              assignPetAge: '',
              assignPetWeight: '',
              assignPetId: '',
              assignPetImgUrl: ''
            })
          } else {
            message.error('Assignment failed')
          }

        })
        .catch(err => {
          console.log(err);
          message.error('Assignment failed')
        })
    }



    let { disabled, bounds, visible } = this.state
    let options = this.state.breedArr.map(d => <Option key={d.petSpeciesBreedId}>{d.breedName}</Option>);
    return (
      <Modal
        wrapClassName={'web'}//对话框外部的类名，主要是用来修改这个modal的样式的
        destroyOnClose={true}
        title={
          <div
            style={{
              width: '100%',
              cursor: 'move',
              height: '30px',
              textAlign: 'center',

            }}
            onMouseOver={() => {
              if (disabled) {
                this.setState({
                  disabled: false,
                });
              }
            }}
            onMouseOut={() => {
              this.setState({
                disabled: true,
              });
            }}

            onFocus={() => { }}
            onBlur={() => { }}
          // end
          >

          </div>
        }
        visible={visible}
        // visible={true}
        onOk={this.handleOk}
        onCancel={this.handleCancel}

        modalRender={(modal) => (
          <Draggable
            disabled={disabled}
            bounds={bounds}
            onStart={(event, uiData) => this.onStart(event, uiData)}
          >
            <div ref={this.draggleRef}>{modal}</div>
          </Draggable>
        )}
        footer={[]} // 设置footer为空，去掉 取消 确定默认按钮
      >
        <div id="unassignedModal">
          <div className="title">
            Assign <br />
            Measurement to
          </div>

          <div className="addPhoto">
            <UploadImg

              getImg={(val) => {
                console.log('hahahahahahah我获得了', val);
                this.setState({
                  imgId: val.imageId
                })
              }}
              imgUrl={this.state.assignPetImgUrl}
              disable={this.state.inputDisabled}
            />
          </div>






          <div className="item">
            <p >Patient ID:</p>
            <Input
              value={this.state.assignPatientId}
              bordered={false}
              onChange={(item) => {
                this.setState({
                  assignPatientId: item.target.value
                })

              }}
              onKeyDown={(e) => {
                if (e.keyCode === 13) {
                  getPetInfoByPatientId()
                }
                if (e.keyCode === 27) {
                  console.log('清空');
                  this.setState({
                    assignPatientId: ''
                  })
                }
              }}
              onBlur={() => {
                if (this.state.assignPatientId.length > 0) {
                  getPetInfoByPatientId()
                }

              }}

            />
          </div>




          <div className="item">
            <p >Pet Name:</p>
            <Input
              disabled={this.state.inputDisabled}
              value={this.state.assignPetName}
              bordered={false}
              onChange={(item) => {
                this.setState({
                  assignPetName: item.target.value
                })

              }}

            />
          </div>

          <div className="item">
            <p >Owner Name:</p>
            <Input
              disabled={this.state.inputDisabled}
              value={this.state.assignOwnerName}
              bordered={false}
              onChange={(item) => {
                this.setState({
                  assignOwnerName: item.target.value
                })

              }}

            />
          </div>
          <div className="item">
            <p >Breed:</p>
            <div className="infoInput">
              {/* <Input bordered={false} /> */}
              <Select
                disabled={this.state.inputDisabled}
                showSearch
                style={{ width: '100%' }}
                bordered={false}
                value={this.state.assignBreed}
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
            </div>
          </div>
          <div className="item">
            <p >Pet Age:</p>
            <Input
              disabled={this.state.inputDisabled}
              value={this.state.assignPetAge}
              bordered={false}
              onChange={(item) => {
                this.setState({
                  assignPetAge: item.target.value
                })

              }}
            />

          </div>
          <div className="item">
            <p >Pet Weight:</p>
            <Input
              disabled={this.state.inputDisabled}
              value={this.state.assignPetWeight}
              bordered={false}
              onChange={(item) => {
                this.setState({
                  assignPetWeight: item.target.value
                })

              }}

            />

            <div className="unit">{`kg`}</div>
          </div>

          <div className="btnF">
            <div className="btn" onClick={this.handleCancel}>Cancel</div>
            <div className="btn" onClick={() => {
              if (this.state.assignPetId) {
                assignPet()
              } else {
                message.error('Did not find this pet')
              }

            }}>Confirm</div>
          </div>

        </div>

      </Modal>

    )

  }
  _list = () => {
    const { search, petListData, searchPetList } = this.state
    let data = (search.length > 0) ? searchPetList : petListData
    let option = data.map((item, index) => {
      let male = item.gender === 'F' ? 'Female' : 'Male'
      return <li key={item.organizationId}
        onClick={() => {
          this.setState({
            selectPetId: item.petId
          })
          console.log(item);


        }}

      >
        <div className="item">
          <span className="petName" style={{ margin: `${px(5)}px 0` }}>{item.petName}</span>        &nbsp;&nbsp;
          <span className="petName" style={{ margin: `${px(5)}px 0` }}>{`${item.age} yrs,`}</span>  &nbsp;&nbsp;
          <span className="petName" style={{ margin: `${px(5)}px 0` }}>{male}</span>
        </div>

        {(this.state.selectPetId === item.petId ? <span className="search">&#xe614;</span> : null)}

        {/* <div className="dui">
          <img src={} alt=""/>
        </div> */}




      </li>
    })
    return (
      <ul>
        {option}
      </ul>
    )
  }

  render () {
    let { loading, disabled, historyData, searchText, serchExamData } = this.state
    const _del = (key, record) => {
      console.log('删除', key, record);

      fetchRequest(`/pet/deletePetExamByExamId/${key}`, 'DELETE')
        .then(res => {
          if (res.flag === true) {
            console.log('删除成功');
            const historyData = [...this.state.historyData];
            console.log(historyData);
            this.setState({
              historyData: historyData.filter((item) => item.historyId !== key)
            });
          } else {
            console.log('删除失败');
          }
        })
    }

    const columns = [
      {
        title: '',
        dataIndex: 'operation',
        key: 'operation',
        width: '10%',
        render: (text, record, index) => {
          // console.log('狩猎:', text, record, index);
          //record:
          return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', margin: `${px(8)}px 0` }} >
              <Popconfirm title="Sure to delete?" onConfirm={() => _del(record.historyId, record)}>
                <img src={del} alt="" style={{ marginRight: '8px' }} />
              </Popconfirm>
            </div>
          )

        }
      },
      {
        title: 'Date',
        dataIndex: 'date',
        key: 'date',
        width: '10%',
        render: (text, record, index) => {

          return (
            <p style={{ textAlign: 'center' }}>{text}</p>
          )

        }
      },
      {
        title: 'Time',
        dataIndex: 'time',
        key: 'time',
        width: '10%',
        render: (text, record, index) => {

          return (
            <p style={{ textAlign: 'center' }}>{text}</p>
          )

        }
      },
      // {
      //   // title: `Temp(${this.state.units})`,
      //   title: `Temp(℉)`,
      //   key: 'temp',
      //   dataIndex: 'temp',
      //   render: (text, record, index) => {
      //     // console.log(text, record);
      //     /**
      //      * bag：温度数值前的圆圈的背景颜色
      //      * tem：展示的温度
      //      * endvalue:将从后台得到的数据全部转化成华氏度
      //      * min：猫的正常体温的左区间,单位℉，后期要做的猫狗都行，这需要告诉我此宠物是猫还是狗
      //      * max：猫的正常体温的右区间,单位℉，后期要做的猫狗都行，这需要告诉我此宠物是猫还是狗
      //      * 
      //      */

      //     let bag = '', tem = ''

      //     let endValue = text > 55 ? text : parseInt((text * 1.8 + 32) * 10) / 10
      //     let min = 100.4, max = 102.56






      //     if (endValue > max) {
      //       bag = '#E1206D'
      //     } else if (endValue < min) {
      //       bag = '#98DA86'
      //     } else {
      //       bag = '#58BDE6'
      //     }

      //     if (this.state.units === '℃') {
      //       if (text) {
      //         tem = `${text}${this.state.units}`
      //       }
      //     } else {
      //       if (text) {
      //         if (text > 55) {
      //           tem = `${text}${this.state.units}`
      //         } else {
      //           tem = `${parseInt((text * 1.8 + 32) * 10) / 10}${this.state.units}`
      //         }

      //       }
      //     }
      //     return (
      //       <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      //         {tem ? <div style={{ width: '8px', height: '8px', borderRadius: '8px', backgroundColor: bag, marginRight: '3px' }} /> : null}
      //         <p style={{ margin: 0, padding: 0 }}>{tem}</p>
      //       </div>
      //     )

      //   }
      // },

      {

        title: ' Pet Description',
        dataIndex: 'description',
        key: 'description',
        width: '20%',
        render: (text, record, index) => {

          return (
            <p style={{ width: '70px' }}>{text}</p>
          )

        }
      },
      // Species

      {
        title: 'Species',
        dataIndex: 'species',
        key: 'species',
        width: '10%',
        render: (text, record, index) => {

          return (
            <p style={{ width: '70px' }}>{text}</p>
          )

        }
      },




      {
        title: 'Note',
        dataIndex: 'note',
        key: 'note',
        width: '20%',
        render: (text, record, index) => {

          return (
            <p style={{ width: '70px' }}>{text}</p>
          )

        }
      },


      {
        title: '',
        dataIndex: 'assign',
        key: 'assign',
        width: '10%',
        render: (text, record, index) => {

          return (
            <div className="assign"
              style={{ fontSize: px(16), paddingTop: px(5), paddingBottom: px(5), }}
              onClick={() => {
                console.log(text, record, index);
                this.setState({
                  // visible: true,
                  assignVisible: true,
                  seleceEmergencies: record
                })
              }}>Assign</div>

          )

        }
      },

    ];

    let tableData = searchText.length > 0 ? serchExamData : historyData


    return (
      <div id="unassigned">
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
          menu8Click={() => {
            console.log('--', storage.identity);
            switch (storage.identity) {
              case '2': this.props.history.push({ pathname: '/EzyVetSelectExam', listDate: storage.ezyVetList, defaultCurrent: storage.defaultCurrent })

                break;
              case '1': this.props.history.push('/VetSpireSelectExam')

                break;
              case '3': this.props.history.push({ pathname: '/uesr/selectExam', listDate: storage.doctorList, defaultCurrent: storage.defaultCurrent })

                break;

              default:
                break;
            }
          }}

        />

        <div className="body">
          <div className="title" style={{ marginTop: px(30), fontSize: px(30), marginBottom: px(40) }}>Unassigned Measurements </div>
          <div className="input" style={{ marginBottom: px(10) }}>
            <input
              type="text"
              // className="iconfont search"
              placeholder="&#xe628; Search Pet Name or Description"
              value={this.state.searchText}
              onChange={e => {
                this.setState({
                  searchText: e.target.value
                })
                this._search(e.target.value)
              }}
              onKeyUp={(e) => {
                // console.log(e);
                if (e.keyCode === 13) {
                  this._search()
                }
                if (e.keyCode === 27) {
                  this.setState({
                    searchText: ''
                  })

                }
              }}

            />
            <div className="searchBtn"
              style={{ height: px(35), fontSize: px(18) }}
              onClick={this._search}

            ><p>Search</p></div>
          </div>

          <div className="table">
            <Table
              style={{
                // border: ' #979797 1px solid',
                padding: 0,
                margin: 0,
                width: '95%',
                height: MTop(280),
                // backgroundColor: 'pink'
              }}
              loading={loading}
              columns={columns}
              dataSource={tableData}

              rowKey={columns => columns.historyId}
              // pagination={{ pageSize: 8, showSizeChanger: false, showQuickJumper: true }}
              pagination={false}
              scroll={{
                y: MTop(260)
              }}
            />
          </div>


          {this._modal()}





        </div>
        <MyModal
          visible={this.state.assignVisible}
          // visible={true}
          element={
            <div className='myfindOrg' >
              <div className="orgHeard">
                <div className="titleicon" style={{ marginTop: px(5) }}>
                  <div
                  // className=" iconfont icon-left return"
                  // onClick={() => { this.setState({ isWorkplace: false, isOrg: true }) }}
                  >
                    {/* <img src={left1} alt="" style={{ height: px(25) }} /> */}
                  </div>
                  <div
                    onClick={() => { this.setState({ assignVisible: false, }) }}
                  >
                    <img src={Close} alt="" style={{ width: px(25) }} />
                  </div>
                </div>
                <div className="text"
                  onMouseOver={() => {
                    if (disabled) {
                      this.setState({
                        disabled: false,
                      });
                    }
                  }}
                  onMouseOut={() => {
                    this.setState({
                      disabled: true,
                    });
                  }}

                >Assign Measurement</div>

                <div className="searchBox">

                  <Input
                    placeholder=" &#xe61b; Search Pet"
                    bordered={false}
                    allowClear={true}
                    value={this.state.search}
                    onChange={(item) => {
                      this.setState({
                        search: item.target.value
                      })
                      this._searchPet(item.target.value)

                    }}
                  />

                </div>
              </div>


              <div className="list"

              >
                {this._list()}
              </div>

              <div className="foot">
                <div className="btnn flex" style={{ height: px(45) }}
                  onClick={() => {
                    this.setState({
                      assignVisible: false,
                      visible: true
                    })
                  }}

                >
                  <p>+Add New Pet</p>
                </div>
                <div className="btnn flex" style={{ height: px(45) }}
                  onClick={() => {
                    if (!this.state.selectPetId) {
                      message.error('Please select a pet to assign')
                    } else {
                      let { selectPetId, seleceEmergencies, historyData } = this.state
                      let parmes = {
                        petId: selectPetId,
                        clinicalDatagroupId: seleceEmergencies.clinicalDatagroupId
                      }
                      console.log('分配的数据信息', parmes);
                      fetchRequest(`/pet/addAndSavePetExam/${seleceEmergencies.historyId}`, 'POST', parmes)
                        .then(res => {
                          console.log('----------', res);
                          if (res.flag === true) {
                            console.log('分配成功');
                            message.success('Assigned successfully')
                            let arr = []
                            for (let i = 0; i < historyData.length; i++) {
                              const element = historyData[i];
                              if (seleceEmergencies.clinicalDatagroupId !== element.clinicalDatagroupId) {
                                arr.push(element)
                              }

                            }

                            this.setState({
                              assignVisible: false,
                              historyData: arr

                            })
                          } else {
                            message.error('Assignment failed')
                          }

                        })
                        .catch(err => {
                          console.log(err);
                          message.error('Assignment failed')
                        })
                    }
                  }}
                >
                  <p>Confirm</p>
                </div>
                {/* <Button
                  text={'+Add New Pet'}
                  onClick={() => {
                    this.setState({
                      assignVisible: false,
                      visible: true
                    })
                  }}
                />
                <Button
                  text={'Confirm'}
                  
                /> */}

              </div>

            </div>
          }

        />
      </div>
    )
  }
}