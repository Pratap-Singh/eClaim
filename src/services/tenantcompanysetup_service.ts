import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, URLSearchParams } from '@angular/http';

import * as constants from '../app/config/constants';
import { TenantCompanySetup_Model } from '../models/tenantcompanysetup_model';
import { BaseHttpService } from './base-http';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { Observable } from 'rxjs/Observable';
import { NavController } from 'ionic-angular';

class ServerResponse {
    constructor(public resource: any) {
    }
};

@Injectable()
export class TenantCompanySetup_Service {
    baseResourceUrl: string = constants.DREAMFACTORY_INSTANCE_URL + '/api/v2/zcs/_table/tenant_company';
    baseResource_Url: string = constants.DREAMFACTORY_INSTANCE_URL + '/api/v2/zcs/_table/';

    constructor(private httpService: BaseHttpService, private nav: NavController) { };

    private handleError(error: any) {
        let errMsg = (error.message) ? error.message :
        error.status ? `${error.status} - ${error.statusText}` : 'Server error';
        console.log(errMsg); // log to console instead   
        return Observable.throw(errMsg);
    }
    
    save(tenant_company: TenantCompanySetup_Model): Observable<any> {
        var queryHeaders = new Headers();
        queryHeaders.append('Content-Type', 'application/json');
        queryHeaders.append('X-Dreamfactory-API-Key', constants.DREAMFACTORY_API_KEY);
        let options = new RequestOptions({ headers: queryHeaders });//alert(JSON.stringify(tenant_company));
        return this.httpService.http.post(this.baseResourceUrl, tenant_company.toJson(true), options)
            .map((response) => {
                return response;
            });
    }

    update(tenant_main: TenantCompanySetup_Model): Observable<any> {       
        var queryHeaders = new Headers();
        queryHeaders.append('Content-Type', 'application/json');
        queryHeaders.append('X-Dreamfactory-API-Key', constants.DREAMFACTORY_API_KEY);
        let options = new RequestOptions({ headers: queryHeaders });
        return this.httpService.http.patch(this.baseResourceUrl, tenant_main.toJson(true), options)
            .map((response) => {
                return response;
            });
    }

    get_tenant(params?: URLSearchParams): Observable<TenantCompanySetup_Model[]> {
        var queryHeaders = new Headers();
        queryHeaders.append('Content-Type', 'application/json');
        queryHeaders.append('X-Dreamfactory-API-Key', constants.DREAMFACTORY_API_KEY);
        return this.httpService.http
            .get(this.baseResourceUrl, { search: params, headers: queryHeaders })
            .map((response) => {
                var result: any = response.json();
                let branches: Array<TenantCompanySetup_Model> = [];
                return branches;
            }).catch(this.handleError);
    };

    remove(id: string) {
        var queryHeaders = new Headers();
        queryHeaders.append('Content-Type', 'application/json');
        queryHeaders.append('X-Dreamfactory-API-Key', constants.DREAMFACTORY_API_KEY);
        return this.httpService.http
            .delete(this.baseResourceUrl + '/' + id, { headers: queryHeaders })
            .map((response) => {
                var result: any = response.json();
                return result.TENANT_COMPANY_SITE_GUID;
            });
    }

    get(id: string, params?: URLSearchParams): Observable<TenantCompanySetup_Model> {        
        var queryHeaders = new Headers();
        queryHeaders.append('Content-Type', 'application/json');
        queryHeaders.append('X-Dreamfactory-API-Key', constants.DREAMFACTORY_API_KEY);
        return this.httpService.http
            .get(this.baseResourceUrl + '/' + id, { search: params, headers: queryHeaders })
            .map((response) => {
                var result: any = response.json();
                let tenanttype: TenantCompanySetup_Model = TenantCompanySetup_Model.fromJson(result);
                return tenanttype;
            }).catch(this.handleError);
    };
}




