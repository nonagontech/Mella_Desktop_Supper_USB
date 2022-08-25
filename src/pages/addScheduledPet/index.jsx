import React, { useState } from 'react'
import { connect } from 'react-redux'
import { message } from 'antd';
import { createFromIconfontCN } from '@ant-design/icons';

import dog from '../../assets/images/pinkdog.png'
import cat from '../../assets/images/pinkcat.png'
import redDog from '../../assets/images/reddog.png'
import redCat from '../../assets/images/redcat.png'
import redother from '../../assets/images/redother.png'
import other from '../../assets/images/other.png'
import redJinggao from '../../assets/img/redjinggao.png'

import { setMenuNum } from '../../store/actions';
import MyModal from '../../utils/myModal/MyModal';
import { px } from '../../utils/px';
import MYButton from '../../utils/button/Button';
import './index.less';
import { petall_subscribe } from '../../api/mellaserver/new';

const MyIcon = createFromIconfontCN({
    scriptUrl: '//at.alicdn.com/t/font_2326495_7b2bscbhvvt.js'
})

let defaultData = {
    patientId: "",
    wuzhong: 'dog',
    petName: '',
    miaoshu: ''
}

let storage = window.localStorage;
const AddScheduledPet = ({ bodyHeight, setMenuNum }) => {
    const [addPetist1, setAddPetist] = useState([]);
    const [petName, setPetName] = useState('');
    const [wuzhong, setWuzhong] = useState('dog');
    const [patientId, setPatientId] = useState('');
    const [miaoshu, setMiaoshu] = useState('');
    const [loading, setLoading] = useState(false);
    const [isSave, setIsSave] = useState(false);

    const selsectwuzhong = (val) => {
        setWuzhong(val);

    }
    console.log('addPetist1', addPetist1);

    const add = () => {
        message.destroy()
        if (!patientId) {
            message.error(`Please enter the pet's patientId`)
            return
        }
        setLoading(true)

        let petSpeciesBreedId = 12001
        switch (wuzhong) {
            case 'dog': petSpeciesBreedId = 12001; break;
            case 'cat': petSpeciesBreedId = 11001; break;
            case 'other': petSpeciesBreedId = 13001; break;
            default:
                break;
        }
        let params = {
            description: miaoshu,
            doctorId: storage.userId,
            patientId,
            petName,
            petSpeciesBreedId
        }

        if (storage.lastOrganization) {
            params.organizationId = storage.lastOrganization
        }
        if (storage.lastWorkplaceId) {
            params.workplaceId = storage.lastWorkplaceId
        }
        console.log('入参', params);
        petall_subscribe(params)
            .then(res => {
                console.log(res);
                if (res.flag) {
                    let json = {
                        patientId,
                        wuzhong,
                        petName,
                        miaoshu
                    }
                    let list = [].concat(addPetist1)
                    list.push(json)
                    setAddPetist(list)
                    setLoading(false)
                    setPatientId('')
                    setWuzhong('')
                    setPetName('')
                    setMiaoshu('')

                } else {

                    setLoading(false)
                    message.error('add failed')
                }
            })
            .catch(err => {
                console.log('错误原因', err);
                setLoading(false)
                message.error('add failed')
            })

    }
    const body = () => {
        let addPetist = [].concat(addPetist1)
        addPetist.push(defaultData)
        console.log('新的:', addPetist);

        let options = addPetist.map((item, index) => {


            if (index === addPetist.length - 1) {
                return <li key={`${index}`} style={{ width: '100%', }}>
                    <div style={{ width: '100%', display: 'flex', flexDirection: 'row', }}>
                        <div className='tableHeard' style={{ borderTopWidth: '0px' }}>
                            <input type="text" className='tableInput'
                                value={patientId}
                                onChange={value => {
                                    setPatientId(value.target.value)

                                }}
                            />
                        </div>
                        <div className='tableHeard' style={{ borderTopWidth: '0px' }}>
                            <input type="text" className='tableInput'
                                value={petName}
                                onChange={value => {

                                    setPetName(value.target.value)
                                }}
                            />
                        </div>
                        <div className='tableHeard flex' style={{ flexDirection: 'row', paddingTop: px(5), paddingBottom: px(5), justifyContent: 'space-around', borderTopWidth: '0px' }} >
                            <div
                                style={{ cursor: 'pointer' }}
                                onClick={() => {
                                    selsectwuzhong('dog')
                                }}>
                                <img src={wuzhong === 'dog' ? redDog : dog} alt="" width={px(40)} />
                            </div>
                            <div
                                style={{ cursor: 'pointer' }}
                                onClick={() => {
                                    selsectwuzhong('cat')
                                }}>
                                <img src={wuzhong === 'cat' ? redCat : cat} alt="" width={px(40)} />
                            </div>

                            <div
                                style={{ cursor: 'pointer' }}
                                onClick={() => {
                                    selsectwuzhong('other')
                                }}>
                                <img src={wuzhong === 'other' ? redother : other} alt="" width={px(40)} />
                            </div>



                        </div>
                        <div className='tableHeard' style={{ borderTopWidth: '0px', width: '30%' }}>
                            <input type="text" className='tableInput'
                                value={miaoshu}
                                onChange={value => {

                                    setMiaoshu(value.target.value)
                                }}

                            />
                        </div>
                        <div className='tableHeard' style={{ borderRight: '#5a5a5a solid 1px', borderTopWidth: '0px', width: '10%' }}>
                            <div
                                className='flex'
                                style={{ width: px(30), height: px(30), borderRadius: px(30), backgroundColor: '#e1206d', cursor: 'pointer' }}
                                onClick={add}

                            >

                                <MyIcon type={'icon-baocun-copy'} className="icon " style={{ color: '#fff', fontSize: px(16) }} />
                            </div>







                        </div>

                    </div>
                </li>
            } else {
                let { patientId, wuzhong, petName, miaoshu } = item
                return <li key={`${index}`} style={{ width: '100%', }}>
                    <div style={{ width: '100%', display: 'flex', flexDirection: 'row', }}>
                        <div className='tableHeard' style={{ borderTopWidth: '0px' }}>
                            <div className='tableText'>
                                {patientId}
                            </div>
                        </div>
                        <div className='tableHeard' style={{ borderTopWidth: '0px' }}>
                            <div className='tableText'> {petName}</div>
                        </div>
                        <div className='tableHeard flex' style={{ flexDirection: 'row', paddingTop: px(5), paddingBottom: px(5), justifyContent: 'space-around', borderTopWidth: '0px' }} >
                            <img src={wuzhong === 'dog' ? redDog : dog} alt="" width={px(40)} />
                            <img src={wuzhong === 'cat' ? redCat : cat} alt="" width={px(40)} />
                            <img src={wuzhong === 'other' ? redother : other} alt="" width={px(40)} />
                        </div>
                        <div className='tableHeard' style={{ borderTopWidth: '0px', width: '30%' }}>
                            <div className='tableText'>{miaoshu}</div>
                        </div>
                        <div className='tableHeard' style={{ borderRight: '#5a5a5a solid 1px', borderTopWidth: '0px', width: '10%' }}>

                        </div>
                    </div>


                </li>
            }


        })

        return (
            <div style={{ width: '100%', marginTop: px(30), height: px(500), overflowY: 'auto', paddingLeft: '5%', paddingRight: '5%', }}>
                <div style={{ width: '100%', display: 'flex', flexDirection: 'row', }}>
                    <div className='tableHeard'>Patient Id</div>
                    <div className='tableHeard'>Pet Name</div>
                    <div className='tableHeard'>species</div>
                    <div className='tableHeard' style={{ width: '30%' }}>description</div>
                    <div className='tableHeard' style={{ borderRight: '#5a5a5a solid 1px', width: '10%' }}></div>

                </div>
                <ul >
                    {options}
                </ul>
            </div>
        )
    }
    return (
        <div className='addScjediled' style={{ height: bodyHeight }}>
            <div className="addDeviceTitle" style={{ height: px(100), fontSize: 26, paddingLeft: px(20) }}>Create New Scheduled </div>
            <div className='addSBody' style={{ width: '100%', height: bodyHeight - px(100), }}>
                {body()}


                <div className='continueBox'>
                    <div className='continueBtn'
                        style={{ borderRadius: px(50), height: px(45), fontSize: px(20), }}
                        onClick={() => {

                            if (!patientId) {
                                setMenuNum('3')
                            } else {
                                setIsSave(true)
                            }
                        }}
                    >Continue</div>
                </div>

            </div>

            <MyModal
                visible={loading}
            />
            <MyModal
                visible={isSave}
                element={
                    <div className='isSave'
                    //  style={{ borderRadius: `${px(20)}px`, backgroundColor: '#fff' }}
                    >
                        <img src={redJinggao} alt="" style={{ width: px(50), margin: `${px(25)}px 0` }} />
                        <p style={{ textAlign: 'center' }}>There are unsaved patient appointments, <br />are you sure you want to exit?</p>
                        <div className="btn" style={{ margin: `${px(30)}px 0` }} >
                            <MYButton
                                text={'Cancel'}
                                onClick={() => {
                                    setIsSave(false)

                                }}
                                textBoxStyle={{
                                    width: '40%',
                                    height: px(40)
                                }}
                            />
                            <MYButton
                                text={'Exit'}
                                onClick={() => {
                                    setIsSave(false)
                                    setMenuNum('3')
                                }}
                                textBoxStyle={{
                                    width: '40%',
                                    height: px(40)
                                }}
                            />
                        </div>
                    </div>
                }
            />







        </div >

    )
}


AddScheduledPet.propTypes = {

}
//默认值
AddScheduledPet.defaultProps = {

}
export default connect(
    state => ({

    }),
    { setMenuNum }
)(AddScheduledPet)
