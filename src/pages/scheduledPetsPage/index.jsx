import React, { useState, useEffect } from 'react'
import {
  Modal,
  Input,
  message,
  Spin,
  Button,
  Form,
  Radio,
  Col,
  Row,
  Checkbox,
  Select,
} from 'antd';
import { SyncOutlined, SearchOutlined } from '@ant-design/icons';
import { px } from '../../utils/px';
import PetTable from '../../components/petTable';

import moment from 'moment'
import { connect } from 'react-redux'
import {
  petDetailInfoFun,
  setMenuNum,
  setPetListArrFun
} from '../../store/actions';

import dog from '../../assets/images/pinkdog.png'
import cat from '../../assets/images/pinkcat.png'
import redDog from '../../assets/images/reddog.png'
import redCat from '../../assets/images/redcat.png'
import redother from '../../assets/images/redother.png'
import other from '../../assets/images/other.png'

import './index.less'
import { pet_subscribe_page } from '../../api';

let storage = window.localStorage;
const ScheduledPetPage = ({ bodyHeight, petDetailInfoFun, setMenuNum, setPetListArrFun }) => {

  //初始化获取宠物列表数据
  const [petListArr, setPetListArr] = useState([])
  //定义宠物列表是否加载中
  const [loading, setLoading] = useState(true)
  // 添加预约宠物弹窗
  const [addModal, setScheduleModal] = useState(false)
  // 选择物种
  const [wuzhong, setWuzhong] = useState('dog');
  const [form] = Form.useForm();

  const [spin, setSpin] = useState(false)

  const selsectwuzhong = (val) => {
    setWuzhong(val);
  }

  const _getExam = async () => {
    console.log('进来了');


    let startDay = moment().startOf('day').format('YYYY-MM-DD HH:mm:ss')
    let endDay = moment().endOf('day').format('YYYY-MM-DD HH:mm:ss')
    let chazhi = new Date().getTimezoneOffset()
    let newstartTime = moment(startDay).add(chazhi, 'm').format('YYYY-MM-DD HH:mm:ss');
    let newendTime = moment(endDay).add(chazhi, 'm').format('YYYY-MM-DD HH:mm:ss');


    let params = {
      doctorId: storage.userId,
      offset: 0,
      size: 100,
      subStartTime: newstartTime,
      subEndTime: newendTime
    }
    if (storage.lastWorkplaceId) {
      params.workplaceId = storage.lastWorkplaceId
    }
    if (storage.lastOrganization) {
      params.organizationId = storage.lastOrganization
    }


    console.log('查询宠物的入参', params);
    const isUnKnow = (val) => {
      if (val) {
        return val
      } else {
        return 'unknown'
      }
    }
    setLoading(true)

    pet_subscribe_page(params)

      .then(res => {
        if (res.flag === true && res.data) {
          let data = []
          let oldList = res.data.list
          for (let i = 0; i < oldList.length; i++) {
            let { age, url, createTime, patientId, speciesId, petName, firstName, birthday, lastName, breedName, gender, petId, weight, rfid, l2rarmDistance, neckCircumference, upperTorsoCircumference, lowerTorsoCircumference, pethubId, macId,
              h2tLength, torsoLength } = oldList[i]
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
              patientId,
              petName,
              owner,
              breed: breedName,
              gender: petGender,
              age: petAge,
              petId,
              id: i,
              weight,
              rfid,
              url,
              speciesId,
              l2rarmDistance, neckCircumference, upperTorsoCircumference, lowerTorsoCircumference,
              h2tLength, torsoLength,
              pethubId, macId,

            }
            data.push(json)

          }
          data.sort((a, b) => {
            return moment(parseInt(a.insertedAt) * 1000).format('YYYY-MM-DD HH:mm') > moment(parseInt(b.insertedAt) * 1000).format('YYYY-MM-DD HH:mm') ? -1 : 1
          })
          console.log('列表的数据：', data);
          setPetListArr(data)
          setLoading(false)
          setSpin(false)




        } else {
          setLoading(false)
          setSpin(false)
        }
      })
      .catch(err => {
        console.log(err);
        setLoading(false)
        setSpin(false)
      })



  }
  const _refresh = () => {
    console.log('点击了');
    setSpin(true)
    _getExam()
  }

  useEffect(() => {
    //获取宠物列表
    _getExam()
  }, [])

  return (
    <div id='scheduled' style={{ height: bodyHeight }}>
      <div className="allPetHeard">
        <div className="addDeviceTitle flex" style={{ fontSize: 26, paddingLeft: px(20) }}>
          <div className="title">December 12, 2012 </div>
          <div className="refresh flex"
            style={{ fontSize: px(25), marginLeft: px(10) }}
          >
            <SyncOutlined onClick={_refresh} spin={spin} />
          </div>
        </div>
        <div className="walkBtn1" style={{ marginRight: px(40) }}>
          <div
            className="walkbtnBox"
            style={{ height: px(40), width: px(160), marginRight: px(40) }}
            onClick={() => {
              setMenuNum('AddScheduledPet')
            }}
          >
            <div className="walkText">Edit Schedule</div>
          </div>
          <div
            className="walkbtnBox"
            style={{ height: px(40), width: px(160) }}
          >
            <div className="walkText"
              onClick={() => {
                setScheduleModal(true)
              }}
            >+Add Appointment</div>
          </div>
        </div>
      </div>
      <div className="body111" style={{ height: bodyHeight - px(100) }}>

        <PetTable
          // bodyHeight={bodyHeight - devicesTitleHeight}
          petListArr={petListArr}
          loading={loading}
          resetPetList={(val) => setPetListArr(val)}
          type={'scheduled'}

        />
      </div>
      <Modal
          title="Assign Measurement"
          centered
          open={addModal}
          // onOk={this.handleOk}
          onCancel={() => setScheduleModal(false)}
          width={430}
          maskClosable={false}
          footer={null}
          className="addScheduleModal"
        >
        <div className="modalContainer">
          <div className="title">
            Search patient or pet species
          </div>
          <div className="searchBox">
            <Input
              placeholder="Search Pet"
              bordered={false}
              allowClear={true}
              prefix={<SearchOutlined />}
              // onChange={onChange}
            />
          </div>
          <div className="petList">
            <div
                style={{ cursor: 'pointer' }}
                onClick={() => {
                    selsectwuzhong('dog')
                }}>
                <img src={wuzhong === 'dog' ? redDog : dog} alt="" width={px(40)} />
                <span style={{marginLeft: '10px'}}>Dog</span>
            </div>
            <div
                style={{ cursor: 'pointer' }}
                onClick={() => {
                    selsectwuzhong('cat')
                }}>
                <img src={wuzhong === 'cat' ? redCat : cat} alt="" width={px(40)} />
                <span style={{marginLeft: '10px'}}>Cat</span>
            </div>
            <div
                style={{ cursor: 'pointer' }}
                onClick={() => {
                    selsectwuzhong('other')
                }}>
                <img src={wuzhong === 'other' ? redother : other} alt="" width={px(40)} />
                <span style={{marginLeft: '10px'}}>Other</span>
            </div>

          </div>
          <div className="formList">
            <Form
              form={form}
              layout="vertical"
              // onFinish={onFinish}
              className="accountForm"
            >
              <Row>
                <Col flex={1} >
                  <Form.Item label="Pet Name" name="PetName">
                    <Input placeholder="input placeholder" bordered={false} className="accountInput" />
                  </Form.Item>
                  <Form.Item label="Patient ID" name="PatientID">
                    <Input placeholder="input placeholder" bordered={false} className="accountInput" />
                  </Form.Item>
                </Col>
              </Row>
              <Form.Item className="expertiseFormItem" label="Procedure:" name="domain">
                <Checkbox.Group>
                  <Row>
                    <Col span={8}>
                      <Checkbox
                        value='0'
                        style={{
                          lineHeight: '32px',
                        }}
                      >
                        Check-Up
                      </Checkbox>
                    </Col>
                    <Col span={8}>
                      <Checkbox
                        value='1'
                        style={{
                          lineHeight: '32px',
                        }}
                      >
                        Follow-Up
                      </Checkbox>
                    </Col>
                    <Col span={8}>
                      <Checkbox
                        value='2'
                        style={{
                          lineHeight: '32px',
                        }}
                      >
                        Vaccination
                      </Checkbox>
                    </Col>
                    <Col span={8}>
                      <Checkbox
                        value='3'
                        style={{
                          lineHeight: '32px',
                        }}
                      >
                        Surgery
                      </Checkbox>
                    </Col>
                    <Col span={8}>
                      <Checkbox
                        value='4'
                        style={{
                          lineHeight: '32px',
                        }}
                      >
                        Dental
                      </Checkbox>
                    </Col>
                    <Col span={8}>
                      <Checkbox
                        value='5'
                        style={{
                          lineHeight: '32px',
                        }}
                      >
                        Other
                      </Checkbox>
                    </Col>
                  </Row>
                </Checkbox.Group>
              </Form.Item>
            </Form>
          </div>
          <div className="btnBox">
            <Button
              type="primary"
              shape="round"
              size="large"
              block
            >
              Save
            </Button>
          </div>
        </div>
      </Modal>
    </div >

  )
}


ScheduledPetPage.propTypes = {

}
//默认值
ScheduledPetPage.defaultProps = {
  bodyHeight: 0,
}
export default connect(
  state => ({

  }),
  { petDetailInfoFun, setMenuNum, setPetListArrFun }
)(ScheduledPetPage)
