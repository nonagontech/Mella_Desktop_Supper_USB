import React, { Component } from 'react'
import { Input, Menu, message, Select, Calendar, Col, Row, Spin } from 'antd';
import Draggable from "react-draggable";
import moment from 'moment'
//import 'antd/dist/antd.css';
import { createFromIconfontCN, LoadingOutlined } from '@ant-design/icons';
import { fetchRequest } from './../../utils/FetchUtil1'
import dog from './../../assets/images/pinkdog.png'
import cat from './../../assets/images/pinkcat.png'
import redDog from './../../assets/images/reddog.png'
import redCat from './../../assets/images/redcat.png'
import redother from './../../assets/images/redother.png'
import other from './../../assets/images/other.png'
import electronStore from '../../utils/electronStore';
import Close from './../../assets/img/close.png'
import nextImg from './../../assets/img/nextImg.png'


// import selectphoto from './../../assets/images/img.png'
import selectphoto from './../../assets/images/sel.png'
import dui from './../../assets/images/dui.png'
import female from './../../assets/images/female.png'
import male from './../../assets/images/male.png'
import './doctorAddPet.less'
import { mTop, px, win } from '../../utils/px';
import Avatar from './../avatar/Avatar'
import MyModal from '../../utils/myModal/MyModal';
import Heard from '../../utils/heard/Heard';
import PhoneBook from '../../utils/phoneBook/PhoneBook';
import Button from './../../utils/button/Button'
const { SubMenu } = Menu;
const { Option } = Select;
const MyIcon = createFromIconfontCN({
    scriptUrl: '//at.alicdn.com/t/font_2326495_7b2bscbhvvt.js'
})
let storage = window.localStorage;
let errPatientId = ''
let url = 'https://www.mellaserver.com/api/mellaserver'
// let url = 'http://192.168.0.36:8080/mellaserver'
export default class DoctorAddPet extends Component {
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
        selectBreed: false


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
        this.getBreed('cat')
        this.getBreed('dog')

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
        fetchRequest(`/pet/selectBreedBySpeciesId`, 'POST', data)
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
            <div className="petSpecies"
                style={{ height: mTop(80), }}
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
                                console.log('我是父组件，从子组件获取到的数据位：', val);
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

        const onPanelChange = (value, mode) => {
            console.log('-----', value, mode);
        }
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
                        <p style={{ weight: '60px', height: '27px', padding: 0, margin: 0 }} onClick={() => {
                            document.getElementById('calendar').style.display = 'block'
                        }}>{this.state.birthday}</p>
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
                                console.log('我离开光标了');

                                let params = {
                                    patientId: this.state.patientId,
                                    doctorId: storage.userId
                                }
                                if (storage.lastWorkplaceId) {
                                    params.workplaceId = storage.lastWorkplaceId
                                }
                                message.destroy()
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
    _primaryBreed = () => {
        let options = null

        options = this.state.breedArr.map(d => <Option key={d.petSpeciesBreedId}>{d.breedName}</Option>);
        let { breedName, confirmSelectBreedJson } = this.state


        return (
            <div className="petName" style={{ marginTop: mTop(18) }}>
                <div className="l" >
                    {/* <p >Primary Breed</p> */}
                    <div className="infoInput flex"
                        style={{ marginTop: px(8), flexDirection: 'row', justifyContent: 'space-between', cursor: 'pointer' }}
                        onClick={() => {
                            this.setState({
                                selectBreed: true
                            })
                        }}
                    >
                        {/* <Input bordered={false} disabled={false} /> */}

                        {/* <Select
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
                        </Select> */}
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

    render() {
        const { closeColor, closebgc, minbgc, disabled, petSpeciesBreedId } = this.state

        return (
            <div id="doctorAddPet">
                <div className="heard">
                    <Heard
                        onReturn={() => {
                            // this.props.history.push({ pathname: '/uesr/selectExam', listDate: storage.doctorList, defaultCurrent: storage.defaultCurrent })
                            this.props.history.goBack()

                        }}
                    />
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
                    <div className="save"
                        onClick={() => {
                            message.destroy()
                            if (!this.state.patientId) {
                                message.error('Please enter patient ID', 0)
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
                            fetchRequest(`/pet/checkPatientId`, "GET", params)
                                .then(res => {
                                    console.log(res);
                                    if (res.flag === false) {
                                        this.setState({
                                            spin: false
                                        }, () => {
                                            errPatientId = params.patientId
                                            message.destroy()
                                            message.error('This patient ID is already occupied, please change to a new one', 0)

                                        })
                                    } else {

                                        let { petSpecies, petName, birthday, petSpeciesBreedId, isMix, weight, gender, unit, imageId, confirmSelectBreedJson, owner, patientId } = this.state


                                        let species = null
                                        if (petSpeciesBreedId) {
                                            species = petSpeciesBreedId
                                        } else {
                                            // 11001 是cat 12001是dog 13001是other
                                            switch (petSpecies) {
                                                case 1: species = 11001; break;
                                                case 2: species = 12001; break;
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
                                        console.log(data);
                                        fetchRequest(`/pet/addDeskPet/${patientId}`, 'POST', data)
                                            .then(res => {
                                                this.setState({
                                                    spin: false
                                                })
                                                console.log(res);
                                                if (res.flag === true) {
                                                    message.success('Added successfully')
                                                    this.props.history.goBack()
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
                                                console.log(err);
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

                    >Save</div>

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
                                    confirmSelectBreed={petSpeciesBreedId}
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


            </div >
        )
    }
}
