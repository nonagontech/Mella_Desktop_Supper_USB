import React, { Component } from "react";
import { Select, Input, message, Modal, } from "antd";
import Heart from "../../utils/heard/Heard";
import { px } from "../../utils/px";
import "./index.less";
import Integration from "./components/Integration";
import { CloseCircleOutlined } from "@ant-design/icons";

import temporaryStorage from '../../utils/temporaryStorage';
import { SearchOutlined } from '@ant-design/icons';
import Close from '../../assets/img/close.png'
import left1 from '../../assets/img/left1.png'
import MyModal from '../../utils/myModal/MyModal';
import { listAll } from '../../api';
import { listAllWorkplaceByOrganizationId } from '../../api/mellaserver/workplace';
import { addOrganization } from '../../api';

import Draggable from "react-draggable";

import Button from '../../utils/button/Button'


const { Option } = Select;
let storage = window.localStorage;
console.log('storage: ', storage);

export default class ConnectWorkplace extends Component {
  state = {
    orgArr: [],
    workplaceJson: {},
    connectionKey: "",
    selectOrgId: -1,
    selectRoleId: "",
    switchType: 'vetspire',//选择是哪种集成
    roleId: '',//权限id

    search: '',
    listData: [],
    selectId: {},
    searchData: [],
    selectworkplace: [],
    workplaceList: [],  // 工作场所列表
    isOrg: false,     // 选择组织弹窗
    isWorkplace: false,   // 选择工作场所弹窗
    visible: false,       //model框是否显示
    disabled: true,       //model是否可拖拽
    loadVisible: false,
    bounds: { left: 0, top: 0, bottom: 0, right: 0 },
  };
  componentDidMount() {
    let ipcRenderer = window.electron.ipcRenderer;
    let { height, width } = window.screen;
    ipcRenderer.send("big");
    ipcRenderer.on("changeFenBianLv", this.changeFenBianLv);
    let userWorkplace = [];
    try {
      userWorkplace = JSON.parse(storage.userWorkplace) || [];
    } catch (error) {
      console.log("字符串转对象失败", error);
    }
    let orgArr = [],
      workplaceJson = {};
    for (let i = 0; i < userWorkplace.length; i++) {
      let element = userWorkplace[i];
      if (element.organizationEntity && element.workplaceEntity) {
        let { organizationEntity, workplaceEntity, roleId } = element;
        const { name, organizationId, connectionKey } = organizationEntity;
        const { workplaceName, workplaceId } = workplaceEntity;

        if (`${workplaceId}` === storage.lastWorkplaceId) {
          this.setState({
            workplaceName,
            workplaceId: storage.lastWorkplaceId,
          });
        }

        if (`${organizationId}` === storage.lastOrganization) {
          this.setState({
            organizationName: name,
            organizationId: storage.lastOrganization,
            selectOrgId: storage.lastOrganization,
          });
        }

        let orgRepeatFlog = false,
          repeatFlogNum = -1;
        for (let j = 0; j < orgArr.length; j++) {
          if (orgArr[j].organizationId === organizationId) {
            orgRepeatFlog = true;
            repeatFlogNum = j;
            break;
          }
        }
        if (orgRepeatFlog) {
          let workplace = {
            workplaceName,
            workplaceId,
          };
          let id = orgArr[repeatFlogNum].organizationId;
          workplaceJson[`${id}`] = workplace;
        } else {
          let connectKey = connectionKey || "";
          let json = {
            organizationId,
            organizationName: name,
            connectionKey: connectKey,
            roleId,
          };
          let workplace = [
            {
              workplaceName,
              workplaceId,
            },
          ];
          workplaceJson[`${organizationId}`] = workplace;

          orgArr.push(json);
        }
      }
    }
    listAll().then((res) => {
        console.log(res);
        if (res.msg === 'success') {
          this.setState({
            listData: res.data
          })
        }
      })
      .catch((err) => {
        console.log(err);
      })
    console.log('temporaryStorage.logupSelectOrganization', temporaryStorage.logupSelectOrganization);
    this.setState({
      orgArr,
      workplaceJson,
      connectionKey: storage.connectionKey,
      selectRoleId: storage.roleId,
      selectId: temporaryStorage.logupSelectOrganization
    });
    temporaryStorage.logupSelectOrganization = {}
  }
  componentWillUnmount() {
    let ipcRenderer = window.electron.ipcRenderer;
    ipcRenderer.removeListener("changeFenBianLv", this.changeFenBianLv);
  }
  changeFenBianLv = (e) => {
    let ipcRenderer = window.electron.ipcRenderer;
    let { height, width } = window.screen;
    let windowsHeight = height > width ? width : height;
    ipcRenderer.send("Lowbig");
    this.setState({});
  };
  //选择集成
  onSwitchIntegration = (type) => {
    this.setState({
      switchType: type
    });
  }
  clickItem = () => {

  }

  getAllList = () => {
    listAll().then((res) => {
      console.log(res);
      if (res.msg === 'success') {
        this.setState({
          listData: res.data
        })
      }
    })
    .catch((err) => {
      console.log(err);
    })
  }

  deleteWorkPlace = (item) => {
    console.log('@',item);
  }

  // 选择组织列表
  _list = () => {
    const { search, listData, searchData } = this.state
    let data = (search.length > 0) ? searchData : listData
    let option = data.map((item, index) => {
      return <li key={item.organizationId}
      className={ this.state.selectId.organizationId === item.organizationId ? 'highlight' : null }
        onClick={() => {
          this.setState({
            selectId: item
          })
          console.log(item);
          temporaryStorage.logupSelectOrganization = item
        }}
      >
        <div className="item">{item.name}</div>
        {(this.state.selectId.organizationId === item.organizationId ? <span className="search">&#xe614;</span> : null)}
      </li>
    })
    return (
      <ul>
        {option}
      </ul>
    )
  }

  // 工作场所列表
  _list1 = () => {
    const { search, workplaceList, searchData } = this.state
    let data = (search.length > 0) ? searchData : workplaceList
    let option = data.map((item, index) => {
      return <li key={item.workplaceId}
        className={ this.state.selectworkplace === item ? 'highlight' : null }
        onClick={() => {
          this.setState({
            selectworkplace: item
        })
        }}

      >

        {item.workplaceName}
        {(this.state.selectworkplace === item ? <span className="search">&#xe614;</span> : null)}
      </li>

    })
    return (
      <ul>
        {option}
      </ul>
    )
  }

  // 搜索组织
  _search = (val) => {
    let search = val.target.value
    let { listData } = this.state
    let searchData = []
    for (let i = 0; i < listData.length; i++) {
      if (listData[i].name.toLowerCase().indexOf(search.toLowerCase()) !== -1) {
        searchData.push(listData[i])
      }
    }
    this.setState({
      search,
      searchData
    })

  }

  // 搜索工作场所
  _searchworkPlace = (val) => {
    let search = val.target.value
    let listData = this.state.workplaceList
    console.log('----------------', listData);
    let searchData = []
    for (let i = 0; i < listData.length; i++) {
      if (listData[i].workplaceName.toLowerCase().indexOf(search.toLowerCase()) !== -1) {
        searchData.push(listData[i])
      }
    }
    this.setState({
      search,
      searchData
    })

  }

  // 创建组织
  _goNewOrg = (e) => {
    e.preventDefault();
    this.setState({
      isOrg: false,
      isWorkplace: false
    })
    this.props.history.push("/menuOptions/NewOrg")
  }

  // 创建组织
  _goNewWorkplace = (e) => {
    e.preventDefault();
    this.setState({
      isOrg: false,
      isWorkplace: false
    })
    // this.props.history.push('/uesr/logUp/NewOrganization')
    this.props.history.push("/menuOptions/NewOrg")
  }

  // 跳转工作场所
  _goWorkplace = () => {
    listAllWorkplaceByOrganizationId(temporaryStorage.logupSelectOrganization.organizationId)
      .then((res) => {
        console.log(res);
        if (res.msg === 'success') {
          this.setState({
            workplaceList: res.data,
            isOrg: false,

          }, () => {
            this.setState({
              isWorkplace: true
            })
          })
        } else {
          console.log('请求错误');
        }
      })
      .catch((err) => {
        console.log(err);
      })
  }

  // 添加组织
  _addworkplaced = () => {
    let { selectworkplace } = this.state || {};
    console.log(selectworkplace);
    console.log(temporaryStorage.logupSelectOrganization);
    console.log(storage.userId);
    let params = {
      name: temporaryStorage.logupSelectOrganization.name,
      workplaceName: selectworkplace.workplaceName,
      workplaceTypeId: selectworkplace.workplaceTypeId,
      address1: selectworkplace.address1,
      address2: selectworkplace.address2,
      // phone: `+${code}${phone}`,
      country: selectworkplace.country,
      city: selectworkplace.city,
      state: selectworkplace.state,
      zipcode: selectworkplace.zipcode,
      email: selectworkplace.email
    }
    this.setState({
      loadVisible: true
    })
    addOrganization(storage.userId, params)
      .then(res => {
        // console.log('添加组织返回的信息', res);
        this.setState({
          loadVisible: false
        })
        if (res.flag === true) {
          if (res.code === 11030) {
            this.setState({ visible: true })
          }
          if (res.code === 20000) {
            console.log('添加成功，跳转');
            // temporaryStorage.logupOrganization = res.data
            // this.props.history.push('/uesr/logUp/InviteTeam')
            this.setState({
              isOrg: false,
              isWorkplace: false,
            }, this.getAllList())
          }

        }
      })
      .catch(err => {
        console.log('添加组织接口失败', err);
        this.setState({
          loadVisible: false
        })
        message.error(err.message, 3)
      })
  }

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

  render() {
    let { orgArr, selectOrgId,  bounds, visible, disabled, isOrg, isWorkplace } = this.state;
    let option = orgArr.map((item, index) => {
      let bac =
        `${selectOrgId}` === `${item.organizationId}` ? "#e1206d" : "#fff";
      let col = `${selectOrgId}` === `${item.organizationId}` ? "#fff" : "#000";
      // console.log('---', this.state.selectRoleId);
      return (
        <li
          key={`${item.organizationId}`}
          style={{ background: bac, color: col }}
          onClick={() => {
            console.log(item);
            this.setState({
              selectOrgId: item.organizationId,
              connectionKey: item.connectionKey,
              selectRoleId: item.roleId,
            });
          }}
        >
          <div className="org" style={{ fontSize: px(16) }}>
            {item.organizationName}
            <span style={{ marginRight: px(20) }} onClick={(e) => {
              e.stopPropagation();
              e.nativeEvent.stopImmediatePropagation();
              this.deleteWorkPlace(item)
              }}><CloseCircleOutlined /></span>
          </div>
        </li>
      );
    });
    return (
      <div id="connectworkplace">
        <div className="heard">
          <Heart />
        </div>

        <div className="body">
          <div className="top">
            <div className="title flex">
              <p style={{ fontSize: px(28), fontWeight: "700" }}>
                Connected Workplaces
              </p>
              <div
                className="addbtn flex"
                style={{ height: px(45) }}
                onClick={() => {
                  this.setState({
                    isOrg: true
                  })
                  console.log('搜索组织');
                  console.log(isOrg);
                }}
              >
                <p>+ Add Workplace</p>
              </div>
            </div>
            <div className="tablebox">
              <div className="table" style={{ height: px(220) }}>
                <ul>{option}</ul>
              </div>
            </div>
          </div>
          {`${this.state.selectRoleId}` !== '4' && <Integration />}
          <div className="footer flex">
            <div
              className="saveBtn flex"
              style={{ height: px(45) }}
              onClick={() => {
                let {
                  selectOrgId,
                  selectRoleId,
                  connectionKey,
                  workplaceJson,
                } = this.state;
                storage.roleId = selectRoleId;
                storage.lastOrganization = selectOrgId;
                try {
                  let key = parseInt(selectOrgId);
                  let lastWorkplaceId = workplaceJson[key][0].workplaceId;
                  storage.lastWorkplaceId = lastWorkplaceId;
                } catch (error) { }
                storage.connectionKey = connectionKey;
                this.props.history.goBack();
              }}
            >
              <p style={{ fontSize: px(18) }}>Save Changes</p>
            </div>
          </div>
        </div>

        {/* // 组织 */}
        <MyModal
          visible={isOrg}
          element={
            <div className='myfindOrg' >
              <div className="orgHeard">
                <div className="titleicon" style={{ marginTop: px(5) }}>
                  <div></div>
                  <div
                    onClick={() => { this.setState({ isWorkplace: false, isOrg: false }) }}
                  >
                    <img src={Close} alt="" style={{ width: px(16) }} />
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

                >Find my organization</div>
                <div className="searchBox">
                  <Input
                    placeholder="Type Organization Name"
                    prefix={<SearchOutlined />}
                    bordered={false}
                    allowClear={true}
                    value={this.state.search}
                    onChange={this._search}
                  />
                </div>
              </div>
              <div className="list">
                {this._list()}
              </div>
              <div className="foot">
                <Button
                  text={'Join Organization'}
                  onClick={this._goWorkplace}
                />
                <span style={{ marginTop: px(20) }}>{`Don’t see your organization? `}</span>
                <a href="#" onClick={this._goNewOrg}>Create a new organization</a>
              </div>
            </div>
          }
        />

        {/* // 工作场所 */}
        <MyModal
          visible={isWorkplace}
          element={
            <div className='myfindOrg' >
              <div className="orgHeard">
                <div className="titleicon" style={{ marginTop: px(5) }}>
                  <div
                    // className=" iconfont icon-left return"
                    onClick={() => { this.setState({ isWorkplace: false, isOrg: true }) }}
                  >
                    <img src={left1} alt="" style={{ height: px(16) }} />
                  </div>
                  <div
                    onClick={() => { this.setState({ isWorkplace: false, isOrg: false }) }}
                  >
                    <img src={Close} alt="" style={{ width: px(16) }} />
                  </div>
                </div>


                <div className="text" style={{ fontSize: px(35) }}>Find my workplace</div>

                <div className="searchBox" style={{ borderRadius: px(15) }} >
                  <Input
                    placeholder="Search workplace"
                    prefix={<SearchOutlined />}
                    bordered={false}
                    allowClear={true}
                    value={this.state.search}
                    onChange={this._searchworkPlace}
                  />

                </div>
              </div>


              <div className="list">
                {this._list1()}
              </div>

              <div className="foot">
                <Button
                  text={'Join Workplace'}
                  onClick={this._addworkplaced}
                />
                <span style={{ marginTop: px(20) }}>{`Don’t see your workplace? `}</span>
                <a href="#" onClick={this._goNewWorkplace}>Create a new workplace</a>
              </div>

            </div>
          }
        />


        <Modal
          title={
            <div
              style={{
                width: '100%',
                cursor: 'move',
                height: '20px',
                fontWeight: '700'
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
              onClick={() => {
                this.setState({
                  visible: false
                })
              }}
            >
              remind
            </div>
          }
          open={visible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          width={330}
          modalRender={(modal) => (
            <Draggable
              disabled={disabled}
              bounds={bounds}
              onStart={(event, uiData) => this.onStart(event, uiData)}
            >
              <div ref={this.draggleRef}>{modal}</div>
            </Draggable>
          )}
          footer={[
            <button
              style={{ width: '110px', height: '40px', border: 0, backgroundColor: '#E1206D', color: '#fff', borderRadius: '60px', fontSize: '18px' }}
              onClick={() => {
                this.setState({
                  visible: false,
                  organizationName: ''
                })
              }}
            >Cancel</button>,
            <button
              style={{ width: '110px', height: '40px', border: 0, backgroundColor: '#E1206D', color: '#fff', borderRadius: '60px', fontSize: '18px' }}
              onClick={() => {
                this.setState({
                  visible: false,
                  isOrg: false,
                  isWorkplace: false,
                })
                // this.props.history.replace('/uesr/logUp/JoinOrganizationByOption')
              }}
            >Join</button>

          ]}
          destroyOnClose={true}
        >
          <div id='vetPrifileModal'>
            <p>This organization has already been registered, do you want to join?</p>
          </div>
        </Modal>

        <MyModal
          visible={this.state.loadVisible}
        />
      </div>
    );
  }
}
