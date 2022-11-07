import React, { Component } from "react";
import { Select, Input, Button } from "antd";
import Heart from "../../utils/heard/Heard";
import { px } from "../../utils/px";
import "./index.less";

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
    this.setState({
      orgArr,
      workplaceJson,
      connectionKey: storage.connectionKey,
      selectRoleId: storage.roleId,
    });
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
  //

  render() {
    let { orgArr, selectOrgId } = this.state;
    let option = orgArr.map((item, index) => {
      let bac =
        `${selectOrgId}` === `${item.organizationId}` ? "#e1206d" : "#fff";
      let col = `${selectOrgId}` === `${item.organizationId}` ? "#fff" : "#000";
      return (
        <li
          key={`${item.organizationId}`}
          style={{ background: bac, color: col }}
          onClick={() => {
            this.setState({
              selectOrgId: item.organizationId,
              connectionKey: item.connectionKey,
              selectRoleId: item.roleId,
            });
          }}
        >
          <div className="org" style={{ fontSize: px(16) }}>
            {item.organizationName}
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
                onClick={() => this.props.history.push("/menuOptions/NewOrg")}
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
          {
            this.state.selectRoleId === '3' && (
              <div className="middle">
                <div className="middleTitle">
                  <p style={{ fontSize: px(28), fontWeight: "700" }}>
                    Integration
                  </p>
                </div>
                <div className="switchBox">
                  <div
                    className="left"
                    onClick={() => this.onSwitchIntegration('vetspire')}
                    style={{ backgroundColor: this.state.switchType === 'vetspire' ? '#e1206d' : '#ed4784' }}
                  >
                    Vetspire
                  </div>
                  <div
                    className="right"
                    onClick={() => this.onSwitchIntegration('ezyvet')}
                    style={{ backgroundColor: this.state.switchType === 'ezyvet' ? '#e1206d' : '#ed4784' }}

                  >
                    Ezyvet
                  </div>
                </div>
                <div className="middleItemBox">
                  <div className="middleItemLeft">
                    <div className="left">
                      <p>Test PMS Connection</p>
                    </div>
                    <div className="right">
                      {
                        this.state.switchType === 'vetspire' ? (
                          <Input placeholder="Insert API Key" />
                        ) : (
                          <>
                            <Input placeholder="Insert clientId" />
                            <Input placeholder="Insert clientSecret" />
                            <Input placeholder="Insert partnerId" />
                          </>
                        )
                      }
                    </div>
                  </div>
                  <div className="middleItemRight">
                    <Button type="primary" shape="round" block >Test</Button>
                    <p>Help me connect to a PMS</p>
                    <Button type="primary" shape="round" block >Disconnect PMS</Button>
                  </div>


                </div>
              </div>
            )
          }

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
      </div>
    );
  }
}
