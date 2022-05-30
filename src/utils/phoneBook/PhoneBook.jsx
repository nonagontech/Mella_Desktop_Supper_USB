import React, { useState, useEffect } from 'react'
import { useHistory } from "react-router-dom";
import {
    Menu,
    Popover,
    Button,
    Modal
} from 'antd';
import PropTypes from 'prop-types';
import pinyin from 'pinyin';


//import 'antd/dist/antd.css';
import './phoneBook.less'
import { mTop, px, MTop } from '../px';
import electronStore from '../electronStore';


/**
 * 
 * @param {function} onReturn  点击返回按钮后调用的函数
 * @param {function} onSearch  点击搜索到的宠物后把宠物信息传回去
 * @returns 
 */


const PhoneBook = ({ listDate, selectFun, searchText, confirmSelectBreed }) => {
    const [phoneList, setPhoneList] = useState([])          //电话簿主题列表
    const [letterList, setLetterList] = useState([])        //电话簿右侧字母列表

    const [phoneListCopy, setPhoneListCopy] = useState([])          //电话簿主题列表
    const [letterListCopy, setLetterListCopy] = useState([])        //电话簿右侧字母列表

    const [selectBreed, setSelectBreed] = useState(-1)      //选中的品种列表

    useEffect(() => {
        if (confirmSelectBreed !== -1) {
            setSelectBreed(confirmSelectBreed)
        }
    }, [confirmSelectBreed])


    console.log('listsDate', phoneList)

    useEffect(() => {
        // console.log('listsDate', listDate)
        console.log('进来了');
        let test = []
        listDate.map((item, index) => {
            let data = {
                name: item.breedName,
                hidden: false,
                petSpeciesBreedId: item.petSpeciesBreedId
            }
            test.push(data)
        })
        // 暂时静态数据替换
        //获取联系人列表
        console.log('11111111111', test)
        let list = test;
        let sections = [], letterArr = [];
        // console.log('原始的数据:',list)

        // 右侧字母栏数据处理
        list.map((item, index) => {
            letterArr.push(pinyin(item.name.substring(0, 1), {
                style: pinyin.STYLE_FIRST_LETTER,
            })[0][0].toUpperCase());

            letterArr = [...new Set(letterArr)].sort();
        });

        // 分组数据处理
        letterArr.map((item, index) => {
            sections.push({
                title: item,
                data: []
            })
        });
        list.map(item => {
            let listItem = item;
            sections.map(item => {
                // console.log('}}}}}}}}}}}}}}',item)
                let first = listItem.name.substring(0, 1);
                let test = pinyin(first, { style: pinyin.STYLE_FIRST_LETTER })[0][0].toUpperCase();
                if (item.title == test) {
                    item.data.push({
                        firstName: first,
                        name: listItem.name,
                        hidden: listItem.hidden,
                        petSpeciesBreedId: listItem.petSpeciesBreedId
                    });
                }
            })
        });

        //letterArr:["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "R", "S", "T", "U", "V", "W", "X", "Y"]
        //sections   [{title: "A", data:[ {firstName: "C", name: "Canaan Dog", hidden: false, petSpeciesBreedId: 201}} ]]
        // console.log('-1----', sections, letterArr);
        setPhoneList(sections)
        setPhoneListCopy(sections)
        setLetterList(letterArr)
        setLetterListCopy(letterArr)
    }, [])
    useEffect(() => {
        // if (searchText) {
        console.log('搜索内容', searchText, letterListCopy);
        if (letterListCopy.length > 0) {

            let allData = phoneListCopy
            let newArr = []
            let arr = []
            if (searchText.length > 0) {
                allData.map((item, i) => {
                    item.data.map((data, index) => {
                        // console.log(index)
                        let dataName = data.name ? data.name.toUpperCase() : ''
                        let keyData = searchText ? searchText.toUpperCase() : ''
                        if (dataName.search(keyData) !== -1) {
                            newArr.push(data)
                        }
                    })
                    // console.log('一组数据：', newArr)
                    if (newArr.length != 0) {
                        let oneGreep = {
                            title: item.title,
                            data: newArr
                        }
                        //   console.log('一11组数据：', oneGreep)
                        arr.push(oneGreep)
                    }

                    newArr = []
                })
                //   console.log('--------------------------', arr)
                let letterArr = []
                arr.map((item, index) => {
                    letterArr.push(item.title)
                })
                // newArr = []
                // // console.log('---||-----',newArr)
                setPhoneList(arr)
                setLetterList(letterArr)
            } else {

                setPhoneList(phoneListCopy)
                setLetterList(letterListCopy)
            }
        }


    }, [searchText])



    const _phoneList = () => {

        let option = phoneList.map((item, index) => {
            let data = item.data
            let option1 = data.map((value, index1) => {
                return (
                    <li
                        key={`option1${index1}`}
                        onClick={() => {
                            // console.log(value.petSpeciesBreedId);
                            setSelectBreed(value.petSpeciesBreedId)
                            selectFun(value)
                        }}>
                        {value.name}
                        {(selectBreed === value.petSpeciesBreedId ? <span className="search">&#xe614;</span> : null)}
                    </li>
                )
            })

            return (
                <div className="phoneBody">
                    <div className="title" id={`${item.title}`} >{item.title} </div>
                    <ul>
                        {option1}
                    </ul>
                </div>
            )

        })

        return (
            <ul>
                {option}
            </ul>
        )
    }
    const _letterList = () => {

        let option = letterList.map((item, index) => {


            return (
                <li
                    key={`${index}`}

                    style={{ fontSize: px(12), padding: 0, margin: 0, border: 0 }}>
                    <a

                        onClick={() => {
                            litterClick(item)
                        }}
                    >{item}</a>
                </li>
            )

        })

        return (
            <ul className="letterUL">
                {option}
            </ul>
        )
    }
    const litterClick = (anchorName) => {
        // console.log(anchorName);
        if (anchorName) {
            // 找到锚点
            let anchorElement = document.getElementById(anchorName);
            // console.log(anchorElement);
            // 如果对应id的锚点存在，就跳转到锚点
            if (anchorElement) { anchorElement.scrollIntoView({ block: 'start', behavior: 'smooth' }); }
        }
        // e.preventDefault();
    }



    return (
        <div id="phoneBook">
            <div className="phone">
                {_phoneList()}
            </div>
            <div className="litter">
                {_letterList()}
            </div>
        </div >
    )
}

PhoneBook.propTypes = {

    listDate: PropTypes.array,
    selectFun: PropTypes.func,
    searchText: PropTypes.string,
    confirmSelectBreed: PropTypes.number
}
PhoneBook.defaultProps = {
    listDate: [],
    selectFun: () => { },
    searchText: '',
    confirmSelectBreed: -1,
}

export default PhoneBook