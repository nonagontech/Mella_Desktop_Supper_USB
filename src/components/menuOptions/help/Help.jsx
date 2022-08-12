import React, { Component } from 'react'

import Heard from './../../../utils/heard/Heard'
import using from './../../../assets/images/using.png'
import measuring from './../../../assets/images/measuring.png'
import unassigned from './../../../assets/images/unassigned.png'
import adding from './../../../assets/images/adding.png'
import email from './../../../assets/images/email.png'
import phone from './../../../assets/images/phone.png'
import './help.less'
import { px } from './../../../utils/px'
let storage = window.localStorage;

export default class Help extends Component {

  componentDidMount() {
    let ipcRenderer = window.electron.ipcRenderer
    ipcRenderer.send('big')

    //监听屏幕分辩率是否变化，变化就去更改界面内容距离大小
    ipcRenderer.on('changeFenBianLv', this.changeFenBianLv)


  }
  componentWillUnmount() {
    let ipcRenderer = window.electron.ipcRenderer
    ipcRenderer.removeListener('changeFenBianLv', this.changeFenBianLv)
  }
  changeFenBianLv = (e) => {
    console.log(e);
    let ipcRenderer = window.electron.ipcRenderer
    ipcRenderer.send('big')
    this.setState({

    })
  }



  render() {
    let list = [
      {
        img: using,
        title: 'Using the app'
      }, {
        img: measuring,
        title: 'Measuring with Mella'
      }, {
        img: unassigned,
        title: 'Unassigned Readings'
      },
      {
        img: adding,
        title: 'Adding New Users'
      },
    ]
    let num = 150 / list.length
    let mar = num + 'px'
    return (
      <div id="help">
        <div className="heard">
          <Heard
            menu8Click={() => {
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
            onReturn={() => {
              this.props.history.goBack()
            }}
          />
        </div>

        <div className="body">
          <div className="title">How can we help you?</div>
          <div className="input">
            <input
              type="text"
              placeholder="Describe you issue     &#xe63f;"

            />
          </div>

          <div className="list">
            <ul>
              {list.map((data, index) => (
                <li key={index}
                  // style={{ width: px(150), height: px(150) }}
                >

                  <>
                    <img src={data.img} alt="" />
                    <p>{data.title}</p>
                  </>
                </li>
              ))}
            </ul>
          </div>

          <div className="popularArticles">
            <div className="text">Popular Articles</div>
            <span className=" iconfont  icon-jiantou3 dropDown" />
          </div>
          <div className="popularArticles tutorials">
            <div className="text">Tutorials</div>
            <span className=" iconfont  icon-jiantou3 dropDown" />
          </div>

          <div className="time">
            <p style={{ fontSize: px(24) }}>Still need help?</p>
            <div className="line" style={{ height: px(6) }}></div>
            <p style={{ fontSize: px(24) }}>Monday - Friday: 9am - 5pm (ET)</p>
          </div>


        </div>

        <div className="foot">
          <div className="l">
            <img src={email} alt=""/>
            <div className="text">Drop us a line</div>
            <a href="mailto:support@mella.ai"
              // style={{ fontSize: px(18) }}
              onClick={(e) => {
                // e.preventDefault();
                // let electron = window.electron
                // electron.shell.openExternal(' https://www.mella.ai/')
                // return false;
              }}
            >support@mella.ai</a>
          </div>

          <div className="l r">
            <img src={phone} alt=""/>
            <div className="text">Bark at Us!</div>
            <div className="text">201.977.6411</div>
          </div>
        </div>
      </div>
    )
  }
}
