import { message, Tag, Space, Table  } from 'antd'
import moment from 'moment/moment'
import React, { Component } from 'react'

import Icon, { DownOutlined, UpOutlined } from '@ant-design/icons';

import { px } from '../../utils/px';

import { buy, getOrderInfo, getPreOrderById, payForOrder, reFund  } from '../../api'
import BuySub from '../../components/buySub'
import MyModal from '../../utils/myModal/MyModal'
import { win } from '../../utils/px'
import defaultUserIcon from './../../assets/img/defaultUserIcon.png'

import down from '../../assets/img/xia.png'
import expand from '../../assets/img/expand.png'

import "./index.less"

let storage = window.localStorage;

let num = 0


export default class Subscriptions extends Component {
    state = {
        subscriptionData: [],   // 订阅列表的数据集合
        userUrl: '',
        userName: '',
        endDate: '',
        selectListIndex: 0,
        buyModal: false,
        loadings: [false, false, false]

    }
    componentDidMount() {
        let ipcRenderer = window.electron.ipcRenderer
        ipcRenderer.send('big', win())
        this.getOrderInfo()
    }
    componentWillUnmount() {
        this.timer && clearInterval(this.timer);
    }
    getOrderInfo = () => {
        getOrderInfo(storage.userId)
            .then(res => {
                console.log('res', res);
                let { msg, success, code } = res
                if (code === 0 && msg === 'success') {
                    let { firstName, imageUrl, isExpired, lastName, preOrderId, endTime } = success[0]
                    let tempData = success
                    let endDate = moment(endTime).format('MMMM D, YYYY')
                    endDate = isExpired === 0 ? endDate : ''
                    console.log('tempData', tempData);
                    this.setState({
                        subscriptionData: tempData,
                        userName: `${lastName} ${firstName}`,
                        userUrl: imageUrl,
                        endDate
                    })
                }
            })
            .catch(err => {
                console.log("🚀 ~ file: index.jsx ~ line 21 ~ Subscriptions ~ err", err)
            })
    }
    buyFun = (item) => {

        let loadings = [].concat(this.state.loadings)
        let params = {
            count: 1,
            details: '测试'
        }
        switch (item.type) {
            case 'month':
                loadings[0] = true
                params.productId = 1
                break;
            case 'year':
                loadings[1] = true
                params.productId = 2

                break;
            case 'free':
                params.productId = 3
                loadings[2] = true
                break;

            default:
                break;
        }
        this.setState({
            loadings
        })
        console.log('params:', params);
        console.log('storage', storage);
        buy(storage.userId, params)
            .then(res => {
                console.log(res);
                let buyItem = item.type
                let payParams  = {
                  organizationId: storage.lastOrganization || null,
                  userId: storage.userId
                }
                if (res.code === 0 && res.msg === 'success') {
                    let { preOrderId } = res.data
                    let buyItem1 = buyItem
                    payForOrder(preOrderId, payParams)

                        .then(res => {
                            let { code, message, url } = res
                            if (code === 0) {
                                window.open(url)
                                this.timer = setInterval(() => {

                                    num++;
                                    this._polling(preOrderId, buyItem1);

                                    if (num > 280) {
                                        //超过280秒则去显示二维码过期，要重新获取

                                        num = 0;
                                        this.timer && clearInterval(this.timer);
                                    }
                                }, 1500);
                            } else {
                                this.changeLoadings(buyItem1)
                                message.destroy()
                                message.error('Bill generation failed')
                            }

                        })
                        .catch(err => {
                            this.changeLoadings(buyItem1)
                            message.destroy()
                            message.error('Bill generation failed')
                            console.log(err);
                        })
                } else {
                    this.changeLoadings(buyItem)
                    message.destroy()
                    message.error('Order acquisition failed')
                }
            })
            .catch(err => {
                message.destroy()
                message.error('Order acquisition failed')
                console.log(err);
            })
    }
    changeLoadings = (buyItem) => {
        let arr = [].concat(this.state.loadings)
        switch (buyItem) {
            case 'month':
                arr[0] = false
                break;
            case 'year':
                arr[1] = false
                break;
            case 'free':
                arr[2] = false
                break;
        }
        this.setState({
            loadings: arr
        })
    }
    _polling = (preOrderId, buyItem) => {
        getPreOrderById(preOrderId)
            .then(res => {
                console.log(res);
                let { code, data } = res
                if (code === 0) {
                    let { status } = data
                    if (status && status !== 1) {
                        let arr = [].concat(this.state.loadings)
                        switch (buyItem) {
                            case 'month':
                                arr[0] = false
                                break;
                            case 'year':
                                arr[1] = false
                                break;
                            case 'free':
                                arr[2] = false
                                break;
                        }
                        this.setState({
                            loadings: arr
                        })
                    }
                    switch (status) {
                        case 1:
                            //待支付
                            break;
                        case 2:
                            //取消支付
                            message.destroy()
                            message.warn('User cancels payment')
                            this.timer && clearInterval(this.timer);
                            break;
                        case 3:
                            message.destroy()
                            message.success('The user paid successfully')
                            this.timer && clearInterval(this.timer);

                            //支付成功
                            break;
                        case 6:
                        //待退款
                        case 7:
                        //已退款
                        case 8:
                            //已过期
                            this.timer && clearInterval(this.timer);
                    }
                }
            })

            .catch(err => {
                console.log(err);
            })
    }

    // 取消订阅，退款
    cancelSub = (value) => {
      reFund(value).then(res => {
        console.log('cancelRes', res);
      })
    }

    typeText = (text) => {
      switch (text) {
        case 1:
          return 'Premium Monthly';
        case 2:
          return 'Premium Yearly';
        case 3:
          return 'Free Trial';
        default:
          return '';
      }
    }



    render() {
        let { userUrl, userName, endDate, selectListIndex, subscriptionData } = this.state
        let url = !userUrl ? defaultUserIcon : userUrl

        let bodyHeight = '90%'
        try {
          bodyHeight = document.getElementById('subscriptions').clientHeight
        } catch (error) {

        }
        const expandedRowRender = (record) => {
          let expandList = []
          expandList.push(record)
          console.log('record111', expandList);
          const columns = [
            {
              title: '',
              dataIndex: 'quotaType',
              key: 'quotaType',
              width: '30%',
              align: "left",
              render: (text, record, index) => {
                return <>
                  <p style={{ textAlign: "left" }}>{record.quotaType}</p>
                  <p style={{ textAlign: "left" }}>{text}</p>
                  <p style={{ textAlign: "left" }}>{text}</p>
                  <p style={{ textAlign: "left" }}>{text}</p>
                </>
              },
            },
            {
              title: '',
              dataIndex: 'startTime',
              key: 'name',
              render: (text, record) => <p style={{ textAlign: "left" }}>Start Date: {moment(text).format("MMM D, YYYY")}</p>,
            },
          ];
          return <Table className="expandTable" border={false} showHeader={false} columns={columns} dataSource={expandList} pagination={false} />;
        };
        const columns = [
          {
            title: '',
            dataIndex: 'quotaType',
            key: 'quotaType',
            width: '30%',
            render: (text, record, index) => {
              if (text === 1) {
                return <p>Premium Monthly</p>;
              } else if (text === 2) {
                return <p>Premium Yearly</p>;
              } else if (text === 3) {
                return <p>Free Trialy</p>;
              } else {
                return '';
              }
            },
          },
          {
            title: '',
            dataIndex: 'endTime',
            key: 'endTime',
            align: "left",
            render: (text, record) => <p>Expires {moment(text).format("MMM D, YYYY")}</p>,
          },
          {
            title: '',
            dataIndex: 'isExpired',
            width: '20%',
            key: 'isExpired',
            render: (text, index) => {
              if (text === 0) {
                return <Tag color="#87d068" style={{width: px(65), height: px(22), fontSize: 18}}>Active</Tag>
              } else {
                return <Tag color="#4a4a4a" style={{width: px(65), height: px(22), fontSize: 18}}>Expired</Tag>

              }
            }
          },

        ];
        let tableData = subscriptionData;
        return (
            <div id="subscriptions">
                <div className="top">
                  <div className="TitleItem flex" style={{ fontSize: 26, paddingLeft: px(20) }}>
                    <div className="title">Billing & Subscriptions</div>
                  </div>

                </div>

                <div className="content flex">
                  <div className="TitleItem flex" style={{ paddingLeft: px(20) }}>
                    <div className="title" style={{ fontSize: 26 }}>My Subscriptions</div>
                    <div className="subTitle">
                      <p>View and manage</p>
                      <p>the subscriptions you’ve purchased</p>
                    </div>
                  </div>

                  <div className="walkBtn1" style={{ marginLeft: px(50) }}>
                    <div
                      className="walkbtnBox"
                      style={{ height: px(40), width: px(200) }}
                      onClick={() => this.setState({ buyModal: true })}
                    >
                      <div className="walkText">Change Subscription</div>
                    </div>
                    <div className="sub" style={{ marginTop: px(12) }} onClick={() => this.cancelSub('13f215776b104325a6ba23b0c5931d14')}>Cancel Subscription</div>

                  </div>
                </div>

                <div className="tableDiv" style={{ height: bodyHeight - px(250) }} >
                <Table
                    className='mainTable'
                    showHeader={false}
                    columns={columns}
                    pagination={false}
                    rowKey={(columns) => columns.orderId}
                    expandable={{
                      expandedRowRender,
                      defaultExpandedRowKeys: ['0'],
                      // columnWidth: '100px',
                      expandIconColumnIndex: '4',
                      expandIcon: ({ expanded, onExpand, record }) =>
                                expanded ? (
                                  <Icon component={() => (<img src={expand} />)} onClick={e => onExpand(record, e)}  />
                                ) : (
                                  <Icon component={() => (<img src={down} />)} onClick={e => onExpand(record, e)} />
                                )
                    }}
                    dataSource={tableData}
                    size="small"
                  />
                </div>

                <MyModal
                    visible={this.state.buyModal}
                    // visible={true}

                    element={
                        <div className='buyModal'>
                            <BuySub
                                cancleFun={() => this.setState({ buyModal: false })}
                                buyFun={(item) => {
                                    // window.open('https://www.baidu.com')
                                    this.buyFun(item)
                                }}
                                loadings={this.state.loadings}
                            />
                        </div>
                    }
                />


            </div>
        )
    }
}


