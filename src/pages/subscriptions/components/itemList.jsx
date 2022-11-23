import React, { useState } from 'react'
import PropTypes from "prop-types";

const listArr = [{
    link: '/subInfo',
    value: 'Subscription information'
}, {
    link: '/subHistory',
    value: 'Subscription History'
}]
const ItemList = ({ listIndex, onClick }) => {

    const list = () => {
        let options = listArr.map((item, index) => {


            return <li
                style={{ backgroundColor: `${index === listIndex ? '#e1206D' : '#fff'}`, color: `${index === listIndex ? '#fff' : '#000'}` }}
                onClick={() => {

                    onClick(index)
                }}
                key={`${index}`}
            >{item.value} </li>
        })
        return <ul>
            {options}
        </ul>
    }
    return (
        <div className="subLeftList">
            {list()}
        </div>
    )
}
ItemList.propTypes = {
    listIndex: PropTypes.number,
    onClick: PropTypes.func
};
ItemList.defaultProps = {
    listIndex: 0,
    onClick: () => { }
}
export default ItemList;