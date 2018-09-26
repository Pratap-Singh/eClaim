import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

import * as constants from '../../app/config/constants';


/**
 * Generated class for the ClaimReportPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-claim-report',
  templateUrl: 'claim-report.html',
})
export class ClaimReportPage {
  public page: number = 1;
  baseResourceUrl: string;
  baseResourceUrlSummary: string;
  baseResourceUrlSocSummary: string;
  claimsList: any[];
  claimsListPrint: any[];
  claimsListPrintTemp: any[] = [];
  claimsListSummary: any[];
  deptList: any[];
  employeeList: any[];
  empData: any;
  totalClaimAmount: number = 0;
  travelClaimType: boolean = false;
  overTimeClaim: boolean = false;
  todayDate: Date = new Date();
  month: any;
  year: any;
  claimsSocSummary: any[];

  constructor(public navCtrl: NavController, public navParams: NavParams, public http: Http) {

    // this.baseResourceUrl = constants.DREAMFACTORY_INSTANCE_URL + '/api/v2/zcs/_table/vw_claim_report?filter=(CLAIM_REF_GUID='+this.claimrefguid + ')&api_key=' + constants.DREAMFACTORY_API_KEY;
    this.BindDepartment();
    // this.BindClaimTypes();

  }

  BindData() {
    this.totalClaimAmount = 0;
    this.http
      .get(this.baseResourceUrl)
      .map(res => res.json())
      .subscribe(data => {
        this.claimsListPrint = data["resource"];
        this.claimsList = this.claimsListPrint;
        this.totalClaimAmount = 0;
        this.claimsListPrintTemp = [];
        // this.claimsList.forEach(element => {

        // });
        //console.log(this.claimsSocSummary);
        this.claimsListPrint.forEach(element => {
          element.TRAVEL_DATE = new Date(element.TRAVEL_DATE.replace(/-/g, "/"))
          if (element.TYPE === 'TRV') {
            element.RowNum = "1";
            this.claimsListPrintTemp.push(element);
            for (let i = 2; i <= 7; i++) {
              let flag = false;
              if (i <= 3)
                flag = true;
              else if (i == 4 && element.TollAmount != 0)
                flag = true;
              else if (i == 5 && element.ParkingAmount != 0)
                flag = true;
              else if (i == 6 && element.MealAmount != 0)
                flag = true;
              else if (i == 7 && element.AccAmount != 0)
                flag = true;
              if (flag) {
                const myClonedObject = Object.assign({}, element);
                myClonedObject.RowNum = i.toString();
                this.claimsListPrintTemp.push(myClonedObject);
              }
            }
          }
          else if (element.TYPE === 'OT') {
            element.RowNum = "1";
            this.claimsListPrintTemp.push(element);
            for (let i = 2; i <= 4; i++) {
              const myClonedObject = Object.assign({}, element);
              myClonedObject.RowNum = i.toString();
              this.claimsListPrintTemp.push(myClonedObject);
            }
          }
          else {
            element.RowNum = "1";
            this.claimsListPrintTemp.push(element);
            const myClonedObject = Object.assign({}, element);
            myClonedObject.RowNum = "2";
            this.claimsListPrintTemp.push(myClonedObject);
          }

          this.totalClaimAmount = this.totalClaimAmount + element.Total;
        });
      });
  }

  BindSummaryData() {
    this.http
      .get(this.baseResourceUrlSummary)
      .map(res => res.json())
      .subscribe(data => {
        this.claimsListSummary = data["resource"];
      });
  }

  BindDepartment() {
    this.http
      .get(constants.DREAMFACTORY_INSTANCE_URL + '/api/v2/zcs/_table/main_department?api_key=' + constants.DREAMFACTORY_API_KEY)
      .map(res => res.json())
      .subscribe(data => {
        this.deptList = data["resource"];
      });
    //console.log(this.deptList);
  }

  BindEmpDetails(user_guid: string) {
    debugger;
    this.http
      .get(constants.DREAMFACTORY_INSTANCE_URL + '/api/v2/zcs/_table/view_user_display?filter=(USER_GUID=' + user_guid + ')&api_key=' + constants.DREAMFACTORY_API_KEY)
      .map(res => res.json())
      .subscribe(data => {
        this.empData = data["resource"];
      });
  }

  BindEmployeesbyDepartment(dept: string) {
    //alert(dept);
    this.http
      .get(constants.DREAMFACTORY_INSTANCE_URL + '/api/v2/zcs/_table/view_user_display_new?filter=(DEPT_GUID=' + dept + ')&api_key=' + constants.DREAMFACTORY_API_KEY)
      .map(res => res.json())
      .subscribe(data => {
        this.employeeList = data["resource"];
      });

  }
  GetSocSummaryData() {
    this.http
      .get(this.baseResourceUrlSocSummary)
      .map(res => res.json())
      .subscribe(data => {
        this.claimsSocSummary = data["resource"];
      });
  }


  // BindClaimTypes() {
  //   this.http
  //     .get(constants.DREAMFACTORY_INSTANCE_URL + '/api/v2/zcs/_table/main_claim_type?api_key=' + constants.DREAMFACTORY_API_KEY)
  //     .map(res => res.json())
  //     .subscribe(data => {
  //       this.claimTypeList = data["resource"];
  //     });
  // }

  SearchClaimsData(dept: string, emp: string, month: string) {
    // alert(dept);
    // alert(emp);
    // alert(month);
    // alert(claimType);
    this.year = new Date().getFullYear();
    this.month = month;
    this.baseResourceUrl = constants.DREAMFACTORY_INSTANCE_URL + '/api/v2/zcs/_table/vw_claim_report?filter=(DEPT_GUID=' + dept + ')AND(USER_GUID=' + emp + ')AND(MONTH=' + month + ')AND(YEAR=' + this.year + ')&api_key=' + constants.DREAMFACTORY_API_KEY;
    this.baseResourceUrlSummary = constants.DREAMFACTORY_INSTANCE_URL + '/api/v2/zcs/_table/vw_claim_report_summary?filter=(DEPARTMENT_GUID=' + dept + ')AND(USER_GUID=' + emp + ')AND(MONTH=' + month + ')AND(YEAR=' + this.year + ')&api_key=' + constants.DREAMFACTORY_API_KEY;
    this.baseResourceUrlSocSummary = constants.DREAMFACTORY_INSTANCE_URL + '/api/v2/zcs/_table/vw_claim_report_soc_summary?filter=(DEPT_GUID=' + dept + ')AND(USER_GUID=' + emp + ')AND(MONTH=' + month + ')AND(YEAR=' + this.year + ')&api_key=' + constants.DREAMFACTORY_API_KEY;
    //this.baseResourceUrl = constants.DREAMFACTORY_INSTANCE_URL + '/api/v2/zcs/_table/vw_claim_report?api_key=' + constants.DREAMFACTORY_API_KEY;
    this.BindEmpDetails(emp);
    this.BindData();
    this.BindSummaryData();
    this.GetSocSummaryData();
    // if (claimType == "58c59b56-289e-31a2-f708-138e81a9c823")
    //   this.travelClaimType = true;
    // else
    //   this.travelClaimType = false;

    // if (claimType == "37067b3d-1bf4-33a3-2b60-3ca40baf589a")
    //   this.overTimeClaim = true;
    // else
    //   this.overTimeClaim = false;
    //console.log(this.baseResourceUrl);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ClaimReportPage');
  }


  // navigatePrint()
  // {
  //  this.navCtrl.push(ClaimReportPrintPage);
  // }
  printToCart(printSectionId: any) {
    document.getElementById(printSectionId).hidden = false;
    var innerContents = document.getElementById(printSectionId).innerHTML;
    var popupWinindow = window.open('', '_blank', 'width=600,height=700,scrollbars=no,menubar=no,toolbar=no,location=no,status=no,titlebar=no');
    popupWinindow.document.open();
    popupWinindow.document.write('<html><head><link rel="stylesheet" type="text/css" href="style.css" /></head><body onload="window.print()">' + innerContents + '</html>');
    popupWinindow.document.close();
    document.getElementById(printSectionId).hidden = true;
  }
}
