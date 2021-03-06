import {Injectable} from '@angular/core';
import {Http, Headers,RequestOptions, URLSearchParams} from '@angular/http';

import * as constants from '../app/config/constants';
//import {EntertainmentClaim_Model} from '../models/entertainment_model';
import {OvertimeClaim_Model} from '../models/overtimeclaim_model';
//import {MasterClaim_Model} from '../models/masterclaim_model';
import {BaseHttpService} from './base-http';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import {Observable} from 'rxjs/Observable';
//import 'rxjs/add/observable/throw';

import { NavController } from 'ionic-angular';

class ServerResponse {
	constructor(public resource: any) {
        
	}
};
@Injectable()
export class OvertimeClaim_Service 
{	

    baseResourceUrl1: string = constants.DREAMFACTORY_INSTANCE_URL + '/api/v2/zcs/_table/main_claim_request';
    baseResource_Url1: string = constants.DREAMFACTORY_INSTANCE_URL + '/api/v2/zcs/_table/';
    
	baseResourceUrl: string = constants.DREAMFACTORY_INSTANCE_URL + '/api/v2/zcs/_table/claim_request_detail';
	baseResource_Url: string = constants.DREAMFACTORY_INSTANCE_URL + '/api/v2/zcs/_table/';

	
	
	constructor(private httpService: BaseHttpService, private nav: NavController) {};
	
    private handleError (error: any) {
	   let errMsg = (error.message) ? error.message :
	   error.status ? `${error.status} - ${error.statusText}` : 'Server error';
	   console.log(errMsg); // log to console instead
	   //localStorage.setItem('session_token', '');       
	  return Observable.throw(errMsg);
    }
    
    query (params?:URLSearchParams): Observable<OvertimeClaim_Model[]> 
    {       
        //let bank :any;
		var queryHeaders = new Headers();
    	queryHeaders.append('Content-Type', 'application/json');
    	//queryHeaders.append('X-Dreamfactory-Session-Token', localStorage.getItem('session_token'));
    	queryHeaders.append('X-Dreamfactory-API-Key', constants.DREAMFACTORY_API_KEY);    	
		return this.httpService.http
			.get(this.baseResourceUrl, { search: params, headers: queryHeaders})
			.map((response) => {
				var result: any = response.json();
				let banks: Array<OvertimeClaim_Model> = [];
				
				// result.resource.forEach((bank) => {
				// 	banks.push(BankSetup_Model.fromJson(bank));
				// });  
				return banks;
				
			}).catch(this.handleError);
    };

    // save_main_claim_request (master_main: MasterClaim_Model): Observable<any> 
	// {
	// 	var queryHeaders = new Headers();
    // 	queryHeaders.append('Content-Type', 'application/json');
    // 	//queryHeaders.append('X-Dreamfactory-Session-Token', localStorage.getItem('session_token'));
    // 	queryHeaders.append('X-Dreamfactory-API-Key', constants.DREAMFACTORY_API_KEY);
	// 	let options = new RequestOptions({ headers: queryHeaders });
	// 	return this.httpService.http.post(this.baseResourceUrl1, master_main.toJson(true),options)
	// 		.map((response) => {
	// 			return response;
	// 		});
    // }
    
    save_claim_request_detail (travel_main: OvertimeClaim_Model): Observable<any> 
	{
		var queryHeaders = new Headers();
    	queryHeaders.append('Content-Type', 'application/json');
    	//queryHeaders.append('X-Dreamfactory-Session-Token', localStorage.getItem('session_token'));
    	queryHeaders.append('X-Dreamfactory-API-Key', constants.DREAMFACTORY_API_KEY);
		let options = new RequestOptions({ headers: queryHeaders });
		return this.httpService.http.post(this.baseResourceUrl, travel_main.toJson(true),options)
			.map((response) => {
				return response;
			});
	}
	
	
}