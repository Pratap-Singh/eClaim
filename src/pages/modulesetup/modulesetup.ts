import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core';

import { FormControlDirective, FormBuilder, Validators, FormGroup, FormControl } from '@angular/forms';
import { Http, Headers, RequestOptions, URLSearchParams } from '@angular/http';
import 'rxjs/add/operator/map';

import * as constants from '../../app/config/constants';
import { ModuleSetup_Model } from '../../models/modulesetup_model';
import { ModuleSetup_Service } from '../../services/modulesetup_service';

import { ModulePageSetup_Model } from '../../models/modulepagesetup_model';
import { ModulePageSetup_Service } from '../../services/modulepagesetup_service';

import { BaseHttpService } from '../../services/base-http';

import { UUID } from 'angular2-uuid';
import { LoginPage } from '../login/login';

/**
 * Generated class for the ModulesetupPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-modulesetup',
  templateUrl: 'modulesetup.html', providers: [ModuleSetup_Service, ModulePageSetup_Service, BaseHttpService]
})
export class ModulesetupPage {
  module_entry: ModuleSetup_Model = new ModuleSetup_Model();
  modulepage_entry: ModulePageSetup_Model = new ModulePageSetup_Model();
  bindModules: ModuleSetup_Model[] = [];

  Moduleform: FormGroup;
  public pages: any;

  //baseResourceUrl: string = constants.DREAMFACTORY_INSTANCE_URL + '/api/v2/zcs/_table/main_module' + '?api_key=' + constants.DREAMFACTORY_API_KEY;
  baseResourceUrl: string = constants.DREAMFACTORY_INSTANCE_URL + '/api/v2/zcs/_table/vw_mainmodule' + '?api_key=' + constants.DREAMFACTORY_API_KEY;
  baseResource_modulepage_Url: string = constants.DREAMFACTORY_INSTANCE_URL + '/api/v2/zcs/_table/vw_mainmodulepage' + '?api_key=' + constants.DREAMFACTORY_API_KEY;
  baseResource_Url: string = constants.DREAMFACTORY_INSTANCE_URL + '/api/v2/zcs/_table/';

  baseResourceUrl_page: string = constants.DREAMFACTORY_INSTANCE_URL + '/api/v2/zcs/_table/main_rolepage' + '?order=NAME&api_key=' + constants.DREAMFACTORY_API_KEY;
  PageUrl: string = "";

  public modules: ModuleSetup_Model[] = [];
  public modulepages: ModuleSetup_Model[] = [];
  public module_s: any;
  public AddModuleClicked: boolean = false;
  public EditModuleClicked: boolean = false;
  public Exist_Record: boolean = false;

  public module_details: any;
  public module_page_details: any;
  public exist_record_details: any;

  //Set the Model Name for Add------------------------------------------
  public NAME_ngModel_Add: any;
  public DESCRIPTION_ngModel_Add: any;
  public PAGE_ngModel_Add: any;
  //---------------------------------------------------------------------

  //Set the Model Name for edit------------------------------------------
  public NAME_ngModel_Edit: any;
  public DESCRIPTION_ngModel_Edit: any;
  public PAGE_ngModel_Edit: any;
  //---------------------------------------------------------------------
  public Module_New: any = [];
  public Module_Page_Multiple: any = [];
  public strPage_Name: string = "";

  public AddModuleClick() {
    this.AddModuleClicked = true;
  }

  public CloseModuleClick() {

    if (this.AddModuleClicked == true) {
      this.AddModuleClicked = false;
    }
    if (this.EditModuleClicked == true) {
      this.EditModuleClicked = false;
    }
  }

  public EditClick(MODULE_GUID: any) {

    //this.ClearControls();
    this.EditModuleClicked = true;
    var self = this;

    //------------Bind Controls-------------------------------------- 
    this.modulesetupservice
      .get(MODULE_GUID)
      .subscribe((data) => {
        self.module_details = data;
        this.NAME_ngModel_Edit = self.module_details.NAME; localStorage.setItem('Prev_module_NAME', self.module_details.NAME);

        this.DESCRIPTION_ngModel_Edit = self.module_details.DESCRIPTION;
        //this.PAGE_ngModel_Edit = self.module_details.PAGE_GUID; //console.log(self.module_details.PAGE_GUID);
      });

    //-------------Bind Page Dropdownlist--------------------------
    let CheckModulePage: any = [];
    let url = this.baseResource_Url + "vw_mainmodulepage?filter=(MODULE_GUID=" + MODULE_GUID + ')&api_key=' + constants.DREAMFACTORY_API_KEY;

    this.http
      .get(url)
      .map(res => res.json())
      .subscribe(data => {
        this.modules = data.resource;
        this.modulepages = data.resource;
        for (var itemA in this.modulepages) {
          CheckModulePage.push(this.modulepages[itemA]["PAGE_GUID"]);
        }
        this.PAGE_ngModel_Edit = CheckModulePage;
      });
  }

  public DeleteClick(MODULE_GUID: any) {
    let alert = this.alertCtrl.create({
      title: 'Remove Confirmation',
      message: 'Do you want to remove ?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'OK',
          handler: () => {
            console.log('OK clicked');
            var self = this;

            //Remove details from main_module---------------------------
            this.modulesetupservice.remove(MODULE_GUID)
              .subscribe(() => {
                self.modules = self.modules.filter((item) => {
                  return item.MODULE_GUID != MODULE_GUID
                });
              });

            //Remove page details from main_modulepage----------------
            this.DeleteModulePage(MODULE_GUID);

            this.navCtrl.setRoot(this.navCtrl.getActive().component);
          }
        }
      ]
    }); alert.present();
  }

  constructor(public navCtrl: NavController, public navParams: NavParams, fb: FormBuilder, public http: Http, private httpService: BaseHttpService, private modulesetupservice: ModuleSetup_Service, private modulepagesetupservice: ModulePageSetup_Service, private alertCtrl: AlertController) {
    if (localStorage.getItem("g_USER_GUID") == "sva") {

      //Bind Page Dropdownlist------------------
      this.GetPage();

      //Bind Front Grid-------------------------
      var Previous_MODULE_GUID: string
      this.http
        .get(this.baseResourceUrl)
        .map(res => res.json())
        .subscribe(data => {
          for (var itemA in data.resource) {
            if (Previous_MODULE_GUID != data.resource[itemA]["MODULE_GUID"]) {

              let Main_Current_Module_Guid: string = data.resource[itemA]["MODULE_GUID"];
              this.strPage_Name = "";

              for (var itemB in data.resource) {
                let Child_Current_Module_Guid: string = data.resource[itemB]["MODULE_GUID"];

                if (Main_Current_Module_Guid == Child_Current_Module_Guid) {
                  if (this.strPage_Name != "" && this.strPage_Name != undefined) {
                    this.strPage_Name = this.strPage_Name + ', ' + data.resource[itemB]["PAGE_NAME"];
                  }
                  else {
                    this.strPage_Name = data.resource[itemB]["PAGE_NAME"];
                  }
                }
              }
              this.Module_New.push({ MODULE_GUID: data.resource[itemA]["MODULE_GUID"], MODULE_NAME: data.resource[itemA]["MOUDLE_NAME"], DESCRIPTION: data.resource[itemA]["DESCRIPTION"], PAGE_GUID: data.resource[itemA]["PAGE_GUID"], PAGE_NAME: this.strPage_Name });
            }
            Previous_MODULE_GUID = data.resource[itemA]["MODULE_GUID"];
          }
        });
      //----------------------------------------

      this.Moduleform = fb.group({
        NAME: ["", Validators.required],
        DESCRIPTION: ["", Validators.required],
        PAGE: ["", Validators.required]
      });
    }
    else {
      alert("Sorry !! This is for only Super Admin.");
      this.navCtrl.push(LoginPage);
    }
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ModulesetupPage');
  }

  GetPage() {
    this.http
      .get(this.baseResourceUrl_page)
      .map(res => res.json())
      .subscribe(data => {
        this.pages = data["resource"];
      });
  }

  Save() {
    if (this.Moduleform.valid) {
      let headers = new Headers();
      headers.append('Content-Type', 'application/json');
      let options = new RequestOptions({ headers: headers });
      let url: string;
      url = this.baseResource_Url + "main_module?filter=(NAME=" + this.NAME_ngModel_Add.trim() + ')&api_key=' + constants.DREAMFACTORY_API_KEY;
      this.http.get(url, options)
        .map(res => res.json())
        .subscribe(
        data => {
          let res = data["resource"];
          if (res.length == 0) {
            console.log("No records Found");
            if (this.Exist_Record == false) {

              this.module_entry.NAME = this.NAME_ngModel_Add.trim();
              this.module_entry.DESCRIPTION = this.DESCRIPTION_ngModel_Add.trim();
              this.module_entry.PAGE_GUID = this.PAGE_ngModel_Add[0];
              this.module_entry.MODULE_GUID = UUID.UUID();
              this.module_entry.CREATION_TS = new Date().toISOString();
              this.module_entry.CREATION_USER_GUID = localStorage.getItem("g_USER_GUID");
              this.module_entry.UPDATE_TS = new Date().toISOString();
              this.module_entry.UPDATE_USER_GUID = "";

              this.modulesetupservice.save(this.module_entry)
                .subscribe((response) => {
                  if (response.status == 200) {
                    this.SaveMoulePage(this.module_entry.MODULE_GUID);

                    alert('Module Registered successfully');
                    //location.reload();
                    this.navCtrl.setRoot(this.navCtrl.getActive().component);
                  }
                });
            }
          }
          else {
            console.log("Records Found");
            alert("This Module already Exist.")
          }
        },
        err => {
          this.Exist_Record = false;
          console.log("ERROR!: ", err);
        });
    }
  }

  SaveMoulePage(MODULE_GUID: any) {
    for (var PAGE_GUID of this.PAGE_ngModel_Add) {
      this.modulepage_entry.ID = UUID.UUID();
      this.modulepage_entry.MODULE_GUID = MODULE_GUID;
      this.modulepage_entry.PAGE_GUID = PAGE_GUID;
      this.modulepage_entry.CREATION_TS = this.module_entry.CREATION_TS;
      this.modulepage_entry.CREATION_USER_GUID = localStorage.getItem("g_USER_GUID");
      this.modulepage_entry.UPDATE_TS = this.module_entry.UPDATE_TS;
      this.modulepage_entry.UPDATE_USER_GUID = "";
      this.modulepagesetupservice.save(this.modulepage_entry)
        .subscribe((response) => {
          if (response.status == 200) {

            this.navCtrl.setRoot(this.navCtrl.getActive().component);
          }
        });
    }
  }
  Update(MODULE_GUID: any) {
    if (this.Moduleform.valid) {
      if (this.module_entry.NAME == null) { this.module_entry.NAME = this.NAME_ngModel_Edit; }
      if (this.module_entry.DESCRIPTION == null) { this.module_entry.DESCRIPTION = this.DESCRIPTION_ngModel_Edit; }
      // if (this.module_entry.PAGE_GUID == null) { this.module_entry.PAGE_GUID = this.PAGE_ngModel_Edit; }
      this.module_entry.PAGE_GUID = this.PAGE_ngModel_Edit[0];

      this.module_entry.CREATION_TS = this.module_details.CREATION_TS;
      this.module_entry.CREATION_USER_GUID = this.module_details.CREATION_USER_GUID;
      this.module_entry.MODULE_GUID = MODULE_GUID;
      this.module_entry.UPDATE_TS = new Date().toISOString();
      this.module_entry.UPDATE_USER_GUID = localStorage.getItem("g_USER_GUID");

      if (this.NAME_ngModel_Edit.trim() != localStorage.getItem('Prev_module_NAME')) {
        let url: string;
        url = this.baseResource_Url + "main_module?filter=(NAME=" + this.NAME_ngModel_Edit.trim() + ')&api_key=' + constants.DREAMFACTORY_API_KEY;
        this.http.get(url)
          .map(res => res.json())
          .subscribe(
          data => {
            let res = data["resource"];
            //console.log('Current Name : ' + this.NAME_ngModel_Edit + ', Previous Name : ' + localStorage.getItem('Prev_module_NAME'));
            if (res.length == 0) {
              console.log("No records Found");
              this.module_entry.NAME = this.NAME_ngModel_Edit.trim();

              //**************Update service if it is new details*************************
              this.modulesetupservice.update(this.module_entry)
                .subscribe((response) => {
                  if (response.status == 200) {

                    //-------Delete Module Pages---------------- 
                    this.DeleteModulePage(this.module_entry.MODULE_GUID);

                    //-------Update Module Pages----------------
                    //this.UpdateMoulePage(this.module_entry.MODULE_GUID);
                    this.UpdateMoulePageMultiple(this.module_entry.MODULE_GUID);
                    //------------------------------------------

                    // alert('Module updated successfully');
                    // this.navCtrl.setRoot(this.navCtrl.getActive().component);
                  }
                });
              //**************************************************************************
            }
            else {
              console.log("Records Found");
              alert("The Module is already Exist. ");
            }
          },
          err => {
            this.Exist_Record = false;
            console.log("ERROR!: ", err);

          });
      }
      else {
        if (this.module_entry.NAME == null) { this.module_entry.NAME = localStorage.getItem('Prev_module_NAME'); }
        this.module_entry.NAME = this.NAME_ngModel_Edit.trim();

        //**************Update service if it is old details*************************

        this.modulesetupservice.update(this.module_entry)
          .subscribe((response) => {
            if (response.status == 200) {

              //-------Delete Module Pages---------------- 
              this.DeleteModulePage(this.module_entry.MODULE_GUID);

              //-------Update Module Pages----------------
              //this.UpdateMoulePage(this.module_entry.MODULE_GUID);
              this.UpdateMoulePageMultiple(this.module_entry.MODULE_GUID);
              //------------------------------------------

              // alert('Module updated successfully');
              // this.navCtrl.setRoot(this.navCtrl.getActive().component);
            }
          });
      }
    }
  }

  DeleteModulePage(MODULE_GUID: any) {
    this.modulepagesetupservice.remove(MODULE_GUID)
      .subscribe(() => {
        this.modulepages = this.modulepages.filter((item) => {
          return item.MODULE_GUID != MODULE_GUID;
        });
        this.navCtrl.setRoot(this.navCtrl.getActive().component);
      });
  }

  UpdateMoulePage(MODULE_GUID: any) {
    //console.table(this.PAGE_ngModel_Edit);
    for (var PAGE_GUID of this.PAGE_ngModel_Edit) {
      this.modulepage_entry.ID = UUID.UUID();
      this.modulepage_entry.MODULE_GUID = MODULE_GUID;
      this.modulepage_entry.PAGE_GUID = PAGE_GUID;
      this.modulepage_entry.CREATION_TS = this.module_entry.CREATION_TS;
      this.modulepage_entry.CREATION_USER_GUID = this.module_entry.CREATION_USER_GUID;
      this.modulepage_entry.UPDATE_TS = this.module_entry.UPDATE_TS;
      this.modulepage_entry.UPDATE_USER_GUID = this.module_entry.UPDATE_USER_GUID;
      this.modulepagesetupservice.save(this.modulepage_entry)
        .subscribe((response) => {
          if (response.status == 200) {
            //alert('ID: ' + this.modulepage_entry.ID + ', ' + 'Module ID: ' + this.modulepage_entry.MODULE_GUID+ ', ' + 'PAGE ID: ' + this.modulepage_entry.PAGE_GUID);
            //this.navCtrl.setRoot(this.navCtrl.getActive().component);

          }
        });
    }
    this.navCtrl.setRoot(this.navCtrl.getActive().component);
  }

  UpdateMoulePageMultiple(MODULE_GUID: any) {
    //console.table(this.PAGE_ngModel_Edit);    
    for (var PAGE_GUID of this.PAGE_ngModel_Edit) {
      this.modulepage_entry.ID = UUID.UUID();
      this.modulepage_entry.MODULE_GUID = MODULE_GUID;
      this.modulepage_entry.PAGE_GUID = PAGE_GUID;
      this.modulepage_entry.CREATION_TS = this.module_entry.CREATION_TS;
      this.modulepage_entry.CREATION_USER_GUID = this.module_entry.CREATION_USER_GUID;
      this.modulepage_entry.UPDATE_TS = this.module_entry.UPDATE_TS;
      this.modulepage_entry.UPDATE_USER_GUID = this.module_entry.UPDATE_USER_GUID;
      this.Module_Page_Multiple.push({ ID: this.modulepage_entry.ID, MODULE_GUID: this.modulepage_entry.MODULE_GUID, PAGE_GUID: this.modulepage_entry.PAGE_GUID, CREATION_USER_GUID: this.modulepage_entry.CREATION_USER_GUID, CREATION_TS: this.modulepage_entry.CREATION_TS, UPDATE_USER_GUID: this.modulepage_entry.UPDATE_USER_GUID, UPDATE_TS: this.modulepage_entry.UPDATE_TS });
    }
    //console.log(this.Module_Page_Multiple);
    this.modulepagesetupservice.save_multiple_recocrd(this.Module_Page_Multiple)
      .subscribe((response) => {
        if (response.status == 200) {

        }
      });
    alert('Module updated successfully');
    this.navCtrl.setRoot(this.navCtrl.getActive().component);
  }
}