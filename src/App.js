import React, { Component } from 'react'
import { BrowserRouter, Switch, Route, HashRouter } from 'react-router-dom'
import Home from './pages/home/index'

import MaxMinReturn from './utils/maxminreturn/MaxMinReturn'

import EditPetInfo from './pages/editPetInfo/index'
import DoctorAddPet from './pages/doctorAddPet/index'
//登录部分
import SignIn from './pages/signIn/index'
import ForgotPassword from './pages/forgotPassword/index'
import ResetPassword from './pages//resetPassword/index'
import ScanCodeLogin from './pages/scanCodeLogin/index'
//邮箱注册的整体部分
import VetPrifile from './pages/signUpVetProfile'
import JoinOrganizationByOption from './pages/joinOrganizationByOption/index'
import VerifyEmail from './pages/signUpVerifyEmail/index'
import NewOrganization from './pages/newOrganization/index'
import InviteTeam from './pages/inviteTeam/index'
//options
import Help from './pages/help/index'
import Unassigned from './pages/unassigned/index'
import Settings from './pages/settings/index'
import AdvancedSettings from './pages/advancedSettings/index'
import PetAndParents from './pages/petAndParents/index'
import EditParent from './pages/editParent/index'
import MyAccount from './pages/myAccount/index'
import Veterinarians from './pages/admin_VetProfile/index'
import AddDevice from './pages/addDevice/index'
import ConnectWorkplace from './pages/connectWorkplace'
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


          <Route exact path="/page7" component={MaxMinReturn} />
          <Route exact path="/page9" component={EditPetInfo} />
          <Route exact path="/MainBody" component={MainBody} />
          <Route exact path="/page11" component={SignIn} />
          <Route exact path="/user/login/forgotPassword" component={ForgotPassword} />
          <Route exact path="/user/login/resetPassword" component={ResetPassword} />
          <Route exact path="/user/login/scanCodeLogin" component={ScanCodeLogin} />

          <Route exact path="/uesr/logUp/VetPrifile" component={VetPrifile} />
          <Route exact path="/uesr/logUp/JoinOrganizationByOption" component={JoinOrganizationByOption} />
          <Route exact path="/uesr/logUp/VerifyEmail" component={VerifyEmail} />
          <Route exact path="/uesr/logUp/NewOrganization" component={NewOrganization} />
          <Route exact path="/uesr/logUp/InviteTeam" component={InviteTeam} />


          <Route exact path="/pet/doctorAddPet" component={DoctorAddPet} />
          <Route exact path="/menuOptions/help" component={Help} />
          <Route exact path="/menuOptions/unassigned" component={Unassigned} />
          <Route exact path="/menuOptions/settings" component={Settings} />
          <Route exact path="/menuOptions/advancedsettings" component={AdvancedSettings} />
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
