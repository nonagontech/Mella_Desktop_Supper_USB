import React, { useState, useEffect } from 'react'
import { } from 'antd';
import { SyncOutlined } from '@ant-design/icons';

import { px } from '../../utils/px';
import PetTable from '../../components/petTable';
import { fetchRequest } from '../../utils/FetchUtil1';

import moment from 'moment'
import { connect } from 'react-redux'
import {
  petDetailInfoFun,
  setMenuNum,
  setPetListArrFun
} from '../../store/actions';

import './index.less'

let storage = window.localStorage;
const ScheduledPetPage = ({ bodyHeight, petDetailInfoFun, setMenuNum, setPetListArrFun }) => {

  //初始化获取宠物列表数据
  const [petListArr, setPetListArr] = useState([])
  //定义宠物列表是否加载中
  const [loading, setLoading] = useState(true)

  const [spin, setSpin] = useState(false)


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

    fetchRequest('/new/pet/subscribe/page', 'POST', params)

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
          <div className="title">Scheduled Patients</div>
          <div className="refresh flex"
            style={{ fontSize: px(25), marginLeft: px(10) }}
          >
            <SyncOutlined onClick={_refresh} spin={spin} />
          </div>

        </div>

        <div className="walkBtn1" style={{ marginRight: px(80) }}>
          <div
            className="walkbtnBox"
            style={{ height: px(40), width: px(200) }}
            onClick={() => {
              let json = {
                isWalkIn: true,
                petId: null,
                petName: null,
                owner: null,
                breed: null,

              }
              petDetailInfoFun(json)
              setMenuNum("1")
            }}
          >
            <div className="walkText">Walk-In</div>
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
        <div className="hread flex" style={{ alignItem: 'center' }}>
          <div className="hread1" style={{ marginTop: px(10), justifyContent: 'flex-end', display: 'flex', }}>
            <div className="walkin flex"
              style={{ borderRadius: px(50), height: px(45), fontSize: px(20), marginRight: px(10) }}
              onClick={() => {
                setMenuNum('AddScheduledPet')

              }}
            >Create New Scheduled</div>

          </div>
        </div>
      </div>

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
