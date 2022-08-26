import React, { Component } from "react";
import { Select } from "antd";
import Heart from "../../utils/heard/Heard";
import { px } from "../../utils/px";
import "./index.less";

const { Option } = Select;
let storage = window.localStorage;

export default class ConnectWorkplace extends Component {
  state = {
    orgArr: [],
    workplaceJson: {},
    connectionKey: "",
    selectOrgId: -1,
    selectRoleId: "",
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
    // console.log('存储的工作场所和组织id', storage.lastWorkplaceId, storage.lastOrganization);
    for (let i = 0; i < userWorkplace.length; i++) {
      let element = userWorkplace[i];
      // console.log('每一项的值：', element);
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
    // console.log('-----转换后的组织信息--', orgArr, workplaceJson);
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
    // console.log(e);
    let ipcRenderer = window.electron.ipcRenderer;
    let { height, width } = window.screen;
    let windowsHeight = height > width ? width : height;
    ipcRenderer.send("Lowbig");
    this.setState({});
  };

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
            // storage.roleId = item.roleId
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
              <p style={{ fontSize: px(24), fontWeight: "800" }}>
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
          <div className="center"></div>
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
                // console.log({ selectOrgId, selectRoleId, connectionKey, workplaceJson });
                storage.roleId = selectRoleId;
                storage.lastOrganization = selectOrgId;
                try {
                  let key = parseInt(selectOrgId);
                  let lastWorkplaceId = workplaceJson[key][0].workplaceId;
                  // console.log(lastWorkplaceId);
                  storage.lastWorkplaceId = lastWorkplaceId;
                } catch (error) { }
                storage.connectionKey = connectionKey;
                // this.props.history.replace("/menuOptions/settings");
                this.props.history.goBack();
              }}
            >
              <p style={{ fontSize: px(18) }}>Save Changes</p>
            </div>
          </div>
        </div>

        {/* <MyModal visible={this.state.loading} /> */}
      </div>
    );
  }
}
