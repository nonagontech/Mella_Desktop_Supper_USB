import React, { Component } from 'react'
import { BrowserRouter, Switch, Route, HashRouter } from 'react-router-dom'
import Home from './pages/home/index'
import Choose from './pages/choose/index'
import EzyVetLogin from './pages/ezyVetLogin/index'
import EzyVetSelectTime from './pages/ezyVetSelectTime/index'
import SelectMella from './pages/selectMella/index'
import APIkey from './pages/apiKey/index'
import VerifyOrganizationInformation from './pages/selectLocation/index'
import EzyVetSelectExam from './pages/ezyVetSelectExam/index'
import DoctorSelectScheduledExam from './pages/doctorSelectScheduledExam/index'
import DoctorSelectAllExam from './pages/doctorSelectAllExam/index'
import SelectExam from "./pages/selectExam/index";
import Mesasure from "./pages/measure/index";
import NorMalMeasurement from "./pages/norMalMeasurement/index";
import MaxMinReturn from './utils/maxminreturn/MaxMinReturn'

import EditPetInfo from './pages/editPetInfo/index'
import WorkPlace from './pages/workPlace/index'
import DoctorAddPet from './pages/doctorAddPet/index'
import AddYuding from './pages/addYuding/index'
//登录部分
import SignIn from './pages/signIn/index'
import ForgotPassword from './pages/forgotPassword/index'
import ResetPassword from './pages//resetPassword/index'
import ScanCodeLogin from './pages/scanCodeLogin/index'
//邮箱注册的整体部分
import VetPrifile from './pages/vetProfile/index'
import JoinOrganizationByOption from './pages/joinOrganizationByOption/index'
import FindMyOrganization from './pages/findMyOrganization/index'
import FindMyWorkplace from './pages/findMyWorkplace/index'
import IsHavePMS from './pages/ishavePMS/index'
import VerifyEmail from './pages/verifyEmail/index'
import NewOrganization from './pages/newOrganization/index'
import NewWorkplace from './pages/newWorkplace/index'
import InviteTeam from './pages/inviteTeam/index'
//options
import Help from './pages/help/index'
import Unassigned from './pages/unassigned/index'
import Settings from './pages/settings/index'
import AdvancedSettings from './pages/advancedSettings/index'
import Invite from './pages/invite/index'
import PetAndParents from './pages/petAndParents/index'
import EditParent from './pages/editParent/index'
import MyAccount from './pages/myAccount/index'
import Veterinarians from './pages/admin_VetProfile/index'
import AddDevice from './pages/addDevice/index'
import ConnectWorkplace from './pages/ConnectWorkplace/index'
import NewOrg from './pages/newOrg/index'
import Team from './pages/team/index'

import MainBody from './pages/mainbody'
import 'bootstrap/dist/css/bootstrap.min.css'
class App extends Component {
  render() {
    return (
      <HashRouter>
        <Switch>
          <Route exact path="/" component={Home} />
          <Route exact path="/page1" component={Choose} />
          <Route exact path="/ezyVetLogin" component={EzyVetLogin} />
          <Route exact path="/EzyVetSelectTime" component={EzyVetSelectTime} />
          <Route exact path="/EzyVetSelectExam" component={EzyVetSelectExam} />
          <Route exact path="/page2" component={APIkey} />
          <Route exact path="/page3" component={VerifyOrganizationInformation} />
          <Route exact path="/page4" component={SelectMella} />
          <Route exact path="/VetSpireSelectExam" component={SelectExam} />
          <Route exact path="/page7" component={MaxMinReturn} />
          <Route exact path="/page8" component={Mesasure} />
          <Route exact path="/page9" component={EditPetInfo} />
          <Route exact path="/page10" component={NorMalMeasurement} />
          <Route exact path="/MainBody" component={MainBody} />
          <Route exact path="/page12" component={WorkPlace} />
          <Route exact path="/AddYuding" component={AddYuding} />
          <Route exact path="/page11" component={SignIn} />
          <Route exact path="/user/login/forgotPassword" component={ForgotPassword} />
          <Route exact path="/user/login/resetPassword" component={ResetPassword} />
          <Route exact path="/user/login/scanCodeLogin" component={ScanCodeLogin} />
          <Route exact path="/uesr/logUp/FindMyOrganization" component={FindMyOrganization} />
          <Route exact path="/uesr/logUp/FindMyWorkplace" component={FindMyWorkplace} />
          <Route exact path="/uesr/logUp/VetPrifile" component={VetPrifile} />
          <Route exact path="/uesr/logUp/JoinOrganizationByOption" component={JoinOrganizationByOption} />
          <Route exact path="/uesr/logUp/isHavePMS" component={IsHavePMS} />
          <Route exact path="/uesr/logUp/VerifyEmail" component={VerifyEmail} />
          <Route exact path="/uesr/logUp/NewOrganization" component={NewOrganization} />
          <Route exact path="/uesr/logUp/NewWorkplace" component={NewWorkplace} />
          <Route exact path="/uesr/logUp/InviteTeam" component={InviteTeam} />
          <Route exact path="/uesr/selectExam" component={DoctorSelectScheduledExam} />
          <Route exact path="/uesr/DoctorSelectAllExam" component={DoctorSelectAllExam} />
          <Route exact path="/pet/doctorAddPet" component={DoctorAddPet} />
          <Route exact path="/menuOptions/help" component={Help} />
          <Route exact path="/menuOptions/unassigned" component={Unassigned} />
          <Route exact path="/menuOptions/settings" component={Settings} />
          <Route exact path="/menuOptions/advancedsettings" component={AdvancedSettings} />
          <Route exact path="/menuOptions/invite" component={Invite} />
          <Route exact path="/menuOptions/petAndParents" component={PetAndParents} />
          <Route exact path="/menuOptions/editParent" component={EditParent} />
          <Route exact path="/MyAccount" component={MyAccount} />
          <Route exact path="/menuOptions/veterinarians" component={Veterinarians} />
          <Route exact path="/menuOptions/AddDevice" component={AddDevice} />
          <Route exact path="/menuOptions/ConnectWorkplace" component={ConnectWorkplace} />
          <Route exact path="/menuOptions/NewOrg" component={NewOrg} />
          <Route exact path="/menuOptions/Team" component={Team} />
        </Switch>
      </HashRouter>
    )
  }
}
export default App
