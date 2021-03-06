import { BrowserModule } from '@angular/platform-browser';
import { Component, ViewChild } from '@angular/core';
import { Events, MenuController, Nav, Platform } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { Storage } from '@ionic/storage';
import { AboutPage } from '../pages/about/about';
import { AccountPage } from '../pages/account/account';
import { LoginPage } from '../pages/login/login';
import { SignupPage } from '../pages/signup/signup';
import { TabsPage } from '../pages/tabs/tabs';
import { SchedulePage } from '../pages/schedule/schedule';
import { SetupPage } from '../pages/setup/setup';
import { SpeakerListPage } from '../pages/home/home';
import { MedicalclaimPage } from '../pages/medicalclaim/medicalclaim';
import { PrintclaimPage } from '../pages/printclaim/printclaim';
import { GiftclaimPage } from '../pages/giftclaim/giftclaim';
import { OvertimeclaimPage } from '../pages/overtimeclaim/overtimeclaim';
import { EntertainmentclaimPage } from '../pages/entertainmentclaim/entertainmentclaim';
import { TravelclaimPage } from '../pages/travel-claim/travel-claim.component';
import { ConferenceData } from '../providers/conference-data';
import { UserData } from '../providers/user-data';
import { UserPage } from '../pages/user/user';
import { SocRegistrationPage } from '../pages/soc-registration/soc-registration';
import { AdminsetupPage } from '../pages/adminsetup/adminsetup';
import { PeermissionPage } from'../pages/peermission/peermission';
import { RolemodulesetupPage } from'../pages/rolemodulesetup/rolemodulesetup';
import { PagesetupPage } from'../pages/pagesetup/pagesetup';
import { ModulesetupPage } from'../pages/modulesetup/modulesetup';
import { SubmodulesetupPage } from'../pages/submodulesetup/submodulesetup';

import { ClaimhistoryPage } from'../pages/claimhistory/claimhistory';
import { ClaimhistorydetailPage } from'../pages/claimhistorydetail/claimhistorydetail';
import{ClaimapprovertasklistPage} from '../pages/claimapprovertasklist/claimapprovertasklist'
import{ClaimtasklistPage} from '../pages/claimtasklist/claimtasklist'
import{UserclaimslistPage} from '../pages/userclaimslist/userclaimslist'

import { UploadPage } from'../pages/upload/upload';
import { CountrysetupPage } from '../pages/countrysetup/countrysetup';
import { StatesetupPage } from '../pages/statesetup/statesetup';

import { ApproverTaskListPage } from '../pages/approver-task-list/approver-task-list';
//import { TravelClaimViewPage } from '../pages/travel-claim-view/travel-claim-view';


import { SetupguidePage } from '../pages/setupguide/setupguide';

import { TranslateService } from '@ngx-translate/core';

import { TranslateModule,TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

import { ProfileSetupPage } from'../pages/profile-setup/profile-setup.component';


export interface PageInterface {

  title: string;
  name: string;
  component: any;
  icon: string;
  logsOut?: boolean;
  index?: number;
  tabName?: string;
  tabComponent?: any;
}

@Component({
  templateUrl: 'app.template.html'
})
export class ConferenceApp {

  public setupPageClicked: boolean = false;

  //public setupPageClick() {
  //  this.setupPageClicked = !this.setupPageClicked;
  //}

  // the root nav is a child of the root app component
  // @ViewChild(Nav) gets a reference to the app's root nav
  @ViewChild(Nav) nav: Nav;

  // List of pages that can be navigated to from the left menu
  // the left menu only works after login
  // the login page disables the left menu
  appPages: PageInterface[] = [
    { title: 'HOME', name: 'TabsPage', component: TabsPage, tabComponent: SpeakerListPage, index: 0, icon: 'apps' },
    { title: 'SETUP', name: 'TabsPage', component: TabsPage, tabComponent: SetupPage, index: 1, icon: 'settings'},  
    { title: 'ADMIN SETUP', name: 'TabsPage', component: TabsPage, tabComponent: AdminsetupPage, index: 4, icon: 'settings' },
    { title: 'APPROVER TASK', name: 'TabsPage', component: TabsPage, tabComponent: AboutPage, index: 3, icon: 'checkbox-outline' },

  ];
  loggedInPages: PageInterface[] = [
    { title: 'ACCOUNT', name: 'AccountPage', component: AccountPage, icon: 'person' },
    { title: 'LOGOUT', name: 'TabsPage', component: TabsPage, icon: 'log-out', logsOut: true }
  ];
  loggedOutPages: PageInterface[] = [
    { title: 'LOGIN', name: 'LoginPage', component: LoginPage, icon: 'log-in' },
    { title: 'SIGNUP', name: 'SignupPage', component: SignupPage, icon: 'person-add' }
  ];


  // rootPage: any = LoginPage;
  rootPage = 'LoginPage';
  
  constructor(

    public events: Events,
    public userData: UserData,
    public menu: MenuController,
    public platform: Platform,
    public confData: ConferenceData,
     storage: Storage,
     statusbar:StatusBar,
     splashScreen: SplashScreen, public translate: TranslateService
  ) {
    
    this.translateToEnglish();
    this.translate.setDefaultLang('en'); //Fallback language

    platform.ready().then(() => {
    });

    

    translate.setDefaultLang('en');
    platform.ready().then(()=> { statusbar.styleDefault();splashScreen.hide();});



    // Check if the user has already seen the tutorial


    // load the conference data
    confData.load();

    // decide which menu items should be hidden by current login status stored in local storage
    this.userData.hasLoggedIn().then((hasLoggedIn) => {
      this.enableMenu(hasLoggedIn === true);
    });
    this.enableMenu(true);

    this.listenToLoginEvents();
  }




  openPage(page: PageInterface) {
    let params = {};

    // the nav component was found using @ViewChild(Nav)
    // setRoot on the nav to remove previous pages and only have this page
    // we wouldn't want the back button to show in this scenario
    if (page.index) {
      params = { tabIndex: page.index };
    }

    // If we are already on tabs just change the selected tab
    // don't setRoot again, this maintains the history stack of the
    // tabs even if changing them from the menu
    if (this.nav.getActiveChildNav() && page.index != undefined) {
      this.nav.getActiveChildNav().select(page.index);
    // Set the root of the nav with params if it's a tab index
  } else {
      this.nav.setRoot(page.name, params).catch((err: any) => {
        console.log(`Didn't set nav root: ${err}`);
      });
    }

    if (page.logsOut === true) {
      // Give the menu time to close before changing to logged out
      this.userData.logout();
    }
  }

  listenToLoginEvents() {
    this.events.subscribe('user:login', () => {
      this.enableMenu(true);
    });

    this.events.subscribe('user:signup', () => {
      this.enableMenu(true);
    });

    this.events.subscribe('user:logout', () => {
      this.enableMenu(false);
    });
  }

  enableMenu(loggedIn: boolean) {
    this.menu.enable(loggedIn, 'loggedInMenu');
    this.menu.enable(!loggedIn, 'loggedOutMenu');
  }

  isActive(page: PageInterface) {
    let childNav = this.nav.getActiveChildNav();

    // Tabs are a special case because they have their own navigation
    if (childNav) {
      if (childNav.getSelected() && childNav.getSelected().root === page.tabComponent) {
        return 'primary';
      }
      return;
    }

    if (this.nav.getActive() && this.nav.getActive().name === page.name) {
      return 'primary';
    }
    return;
  }

  public translateToMalayClicked: boolean = false;
  public translateToEnglishClicked: boolean = true;

  public translateToEnglish() {   
    this.translate.use('en');
    this.translateToMalayClicked = !this.translateToMalayClicked;
    this.translateToEnglishClicked = !this.translateToEnglishClicked;
  }

  public translateToMalay() {
    this.translate.use('ms');
    this.translateToEnglishClicked = !this.translateToEnglishClicked;
    this.translateToMalayClicked = !this.translateToMalayClicked;
  }
}
