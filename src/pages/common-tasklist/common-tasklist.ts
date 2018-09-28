import { Component,Input,OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

import * as constants from '../../app/config/constants';
import { ClaimapprovertasklistPage } from '../claimapprovertasklist/claimapprovertasklist';

/**
 * Generated class for the CommonTasklistPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-common-tasklist',
  templateUrl: 'common-tasklist.html',
})
export class CommonTasklistPage implements OnInit {

  
  //ClaimHistory_Model = new ClaimHistory_Model();
  @Input() role:any;
  claimTaskLists: any[];
  claimTaskLists1: any[] = [];
  claimTaskListTotal: any[];
  searchboxValue: string;
  baseResourceUrl: string;
  deptList: any[];
  employeeList: any[] = [];
  employeeList1: any[] = [];
  yearsList: any[] = [];
  currentYear: number = new Date().getFullYear();
  loginUserRole = localStorage.getItem("g_ROLE_NAME");
  //baseResourceUrl: string = constants.DREAMFACTORY_INSTANCE_URL + '/api/v2/zcs/_table/vw_claimreftasklist?filter=(ASSIGNED_TO='+localStorage.getItem("g_USER_GUID") + ')&api_key=' + constants.DREAMFACTORY_API_KEY;
  //baseResourceUrl: string = constants.DREAMFACTORY_INSTANCE_URL + '/api/v2/zcs/_table/vw_claimreftasklist?api_key=' + constants.DREAMFACTORY_API_KEY;
  public page: number = 1;
  btnSearch: boolean = false;
  constructor(public navCtrl: NavController, public navParams: NavParams, public http: Http) {
    // if (this.loginUserRole === "Finance Admin") {
    //   this.baseResourceUrl = constants.DREAMFACTORY_INSTANCE_URL + '/api/v2/zcs/_table/vw_claimrequestlist?filter=(STATUS=Approved)AND(PROFILE_LEVEL=3)AND(YEAR=' + this.currentYear + ')AND(EMAIL=' + localStorage.getItem("g_EMAIL").toString().split('@')[1] + ')&api_key=' + constants.DREAMFACTORY_API_KEY;
    // }
    // else {
    //   this.baseResourceUrl = constants.DREAMFACTORY_INSTANCE_URL + '/api/v2/zcs/_table/vw_claimrequestlist?filter=(STATUS=Pending)AND(PROFILE_LEVEL=2)AND(YEAR=' + this.currentYear + ')AND(EMAIL=' + localStorage.getItem("g_EMAIL").toString().split('@')[1] + ')&api_key=' + constants.DREAMFACTORY_API_KEY;
    // }
    
  }

  ngOnInit()
  {
    if (this.role == "Payment") {
      this.baseResourceUrl = constants.DREAMFACTORY_INSTANCE_URL + '/api/v2/zcs/_table/vw_claimrequestlist?filter=(STATUS=Approved)AND(PROFILE_LEVEL=3)AND(YEAR=' + this.currentYear + ')AND(EMAIL=' + localStorage.getItem("g_EMAIL").toString().split('@')[1] + ')&api_key=' + constants.DREAMFACTORY_API_KEY;
    }
    else {
      this.baseResourceUrl = constants.DREAMFACTORY_INSTANCE_URL + '/api/v2/zcs/_table/vw_claimrequestlist?filter=(STATUS=Pending)AND(PROFILE_LEVEL=2)AND(YEAR=' + this.currentYear + ')AND(EMAIL=' + localStorage.getItem("g_EMAIL").toString().split('@')[1] + ')&api_key=' + constants.DREAMFACTORY_API_KEY;
    }
    this.BindDepartment();
    this.BindEmployeesbyDepartment("All");
    this.BindYears();
    this.BindData("All", "All", "All");

  }

  BindData(ddlDept: string, ddlEmployee: string, ddlmonth: string) {
    this.http
      .get(this.baseResourceUrl)
      .map(res => res.json())
      .subscribe(data => {
        this.claimTaskListTotal = data["resource"];
        this.claimTaskLists = this.claimTaskLists1 = [];
        this.claimTaskListTotal.forEach(element => {
          if (this.claimTaskLists1.length === 0 || (this.claimTaskLists1.length > 0 && this.claimTaskLists1.find(e => e.CLAIM_REF_GUID == element.CLAIM_REF_GUID) === undefined)) {
            this.claimTaskLists1.push(element);
          }
          else {
            this.claimTaskLists1.find(e => e.CLAIM_REF_GUID === element.CLAIM_REF_GUID).CLAIM_AMOUNT += element.CLAIM_AMOUNT;
          }
        });
        this.claimTaskLists = this.claimTaskLists1;
        if (this.claimTaskLists.length != 0) {
          if (ddlDept.toString() !== "All") { this.claimTaskLists = this.claimTaskLists.filter(s => s.DEPT_GUID.toString() === ddlDept.toString()) }
          if (ddlEmployee.toString() !== "All") { this.claimTaskLists = this.claimTaskLists.filter(s => s.USER_GUID.toString() === ddlEmployee.toString()) }
          if (ddlmonth.toString() !== "All") { this.claimTaskLists = this.claimTaskLists.filter(s => s.MONTH.toString() === ddlmonth.toString()) }

        }
        this.btnSearch = true;
      });
  }

  onSearchInput() {
    // alert('hi')
    let val = this.searchboxValue;
    if (val && val.trim() != '') {
      this.claimTaskLists = this.claimTaskLists1.filter((item) => {
        let fullname: number;
        let month: number;
        let dept: number;
        let amount: number;
        console.log(item);
        if (item.FULLNAME != null) { fullname = item.FULLNAME.toLowerCase().indexOf(val.toLowerCase()) }
        if (item.DEPARTMENT != null) { dept = item.DEPARTMENT.toString().toLowerCase().indexOf(val.toLowerCase()) }
        if (item.MONTH != null) { month = item.MONTH.toString().toLowerCase().indexOf(val.toLowerCase()) }
        if (item.CLAIM_AMOUNT != null) { amount = item.CLAIM_AMOUNT.toString().toLowerCase().indexOf(val.toLowerCase()) }
        return (
          (fullname > -1)
          || (dept > -1)
          || (month > -1)
          || (amount > -1)
        );
      })
    }
    else {

      this.claimTaskLists = this.claimTaskLists1;
    }
  }
  goToClaimApproverTaskList(claimrefguid: any) {
    this.navCtrl.push(ClaimapprovertasklistPage, {
      claimRefGuid: claimrefguid,
      role:this.role
    })
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

  BindEmployeesbyDepartment(dept: string) {
    //alert(dept);
    this.http
      .get(constants.DREAMFACTORY_INSTANCE_URL + '/api/v2/zcs/_table/view_user_display_new?api_key=' + constants.DREAMFACTORY_API_KEY)
      .map(res => res.json())
      .subscribe(data => {
        this.employeeList1 = data["resource"];
        this.employeeList = this.employeeList1;
        if (dept !== "All") {
          this.employeeList = this.employeeList1.filter(s => s.DEPT_GUID.toString() === dept.toString());
        }
      });
  }

  BindYears() {
    for (let i = 2016; i <= new Date().getFullYear(); i++) {
      this.yearsList.push(i);
    }
  }

  SearchClaimsData(ddlDept: string, ddlEmployee: string, ddlmonth: string, ddlYear: number) {
    this.btnSearch = false;
    if (this.role == "Payment") {
      this.baseResourceUrl = constants.DREAMFACTORY_INSTANCE_URL + '/api/v2/zcs/_table/vw_claimrequestlist?filter=(STATUS=Approved)AND(PROFILE_LEVEL=3)AND(YEAR=' + ddlYear + ')AND(EMAIL=' + localStorage.getItem("g_EMAIL").toString().split('@')[1] + ')&api_key=' + constants.DREAMFACTORY_API_KEY;
    }
    else {
      this.baseResourceUrl = constants.DREAMFACTORY_INSTANCE_URL + '/api/v2/zcs/_table/vw_claimrequestlist?filter=(STATUS=Pending)AND(PROFILE_LEVEL=2)AND(YEAR=' + ddlYear + ')AND(EMAIL=' + localStorage.getItem("g_EMAIL").toString().split('@')[1] + ')&api_key=' + constants.DREAMFACTORY_API_KEY;
    }
    this.BindData(ddlDept, ddlEmployee, ddlmonth);

  }


  ionViewDidLoad() {
    console.log('ionViewDidLoad CommonTasklistPage');
  }

}
