import React, { useState, useEffect } from 'react'

import { connect } from 'react-redux'

import { } from 'antd';

import { SyncOutlined } from '@ant-design/icons';

import { px } from '../../utils/px';

import PetTable from '../../components/petTable';

import { petDetailInfoFun, setMenuNum, setPetListArrFun } from '../../store/actions';

import moment from 'moment';

import _ from 'lodash';

import { useGetState } from 'ahooks';

import './index.less';

import { listAllPetInfo, getPetByPetNameOrPatientId } from '../../api';



let storage = window.localStorage;

const AllPet = ({ bodyHeight, petDetailInfoFun, setMenuNum, setPetListArrFun }) => {



  //初始化获取宠物列表数据

  const [petListArr, setPetListArr] = useState([]);

  //定义宠物列表是否加载中

  const [loading, setLoading] = useState(false);

  const [spin, setSpin] = useState(false);

  const [pageSize, setPageSize] = useState(20); // 每页20条

  const [total, setTotal] = useState(0);//宠物列表数据的总条数

  const [currPage, setCurrPage, getCurrPage] = useGetState(1);//页码





  const _getExam = async (currPageValue) => {

    setLoading(true);

    let params = {

      doctorId: storage.userId,

      pageSize: pageSize,

      currPage: currPageValue,

    }

    if (storage.lastWorkplaceId) {

      params.workplaceId = storage.lastWorkplaceId

    }

    if (storage.lastOrganization) {

      params.organizationId = storage.lastOrganization

    }
    const isUnKnow = (val) => {

      if (val) {

        return val

      } else {

        return 'unknown'

      }

    }

    listAllPetInfo(params)

      .then((res) => {

        setLoading(false);

        setSpin(false);

        if (res.flag === true) {

          setTotal(res.data.count);

          let newArr = [];

          let data = [];

          if (currPageValue === 1) {

            newArr = res.data.data;

          } else {

            let oldArr = petListArr;

            let arr = res.data.data;

            newArr = [...oldArr, ...arr];

          }

          // setPetListArrFun(newArr);

          for (let i = 0; i < newArr.length; i++) {

            let {

              age,

              url,

              createTime,

              patientId,

              speciesId,

              petName,

              firstName,

              birthday,

              lastName,

              breedName,

              gender,

              petId,

              weight,

              rfid,

              l2rarmDistance,

              neckCircumference,

              upperTorsoCircumference,

              lowerTorsoCircumference,

              pethubId,

              macId,

              h2tLength,

              torsoLength

            } = newArr[i];

            let owner = '';

            patientId = isUnKnow(patientId);

            petName = isUnKnow(petName);

            breedName = isUnKnow(breedName);

            age = isUnKnow(age);

            weight = isUnKnow(weight);

            if (!firstName) {

              firstName = '';

            }

            if (!lastName) {

              lastName = '';

            }

            if (lastName === '' && firstName === '') {

              owner = 'unknown';

            } else {

              owner = `${lastName} ${firstName}`;

            }

            createTime = moment(createTime).format('X');

            let petGender = '';

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

            data.push(json);

          }

          setPetListArr(data);

        }

      })

      .catch(err => {

        setLoading(false)

        setSpin(false)

      })

  }

  const _refresh = () => {

    setSpin(true);

    setCurrPage(1);

    setPetListArr([]);

    setTotal(0);

    _getExam(1);

  }



  useEffect(() => {

    //获取宠物列表
    _getExam(1);
    return (() => { });
  }, []);

  return (

    <div id='allPets' style={{ height: bodyHeight }}>

      <div className="allPetHeard">

        <div className="addDeviceTitle flex" style={{ fontSize: 26, paddingLeft: px(20) }}>
          <div className="title">Client Results</div>
          <div className="refresh flex"

            style={{ fontSize: px(25), marginLeft: px(10) }}

          >

            <SyncOutlined onClick={_refresh} spin={spin} />

          </div>



        </div >



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

        petDetailInfoFun(json);

        setMenuNum("1");

      }}

    >

      <p className="walkText">Walk-In</p>

    </div>

  </div>



      </div >



  <PetTable

    bodyHeight={bodyHeight - px(100)}

    petListArr={petListArr}

    loading={loading}

    resetPetList={(val) => setPetListArr(val)}
    onScroll={() => {
      if (currPage === _.ceil(total / pageSize) || total === 0) {
        return;
      }
      setCurrPage(currPage + 1);
      _getExam(currPage + 1);
    }}
  />

    </div >



  )

}



AllPet.propTypes = {

}

//默认值

AllPet.defaultProps = {

  bodyHeight: 0,

}

export default connect(

  state => ({



  }),

  { petDetailInfoFun, setMenuNum, setPetListArrFun }

)(AllPet)

