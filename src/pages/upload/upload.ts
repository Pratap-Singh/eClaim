import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { File } from '@ionic-native/file';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer';
import { FilePath } from '@ionic-native/file-path';
import {HttpClient, HttpParams, HttpRequest, HttpEvent} from '@angular/common/http';
import {Observable} from "rxjs";
import { OnInit, ViewChild } from '@angular/core';

/**
 * Generated class for the UploadPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-upload',
  templateUrl: 'upload.html',
})
export class UploadPage {

  @ViewChild('fileInput') fileInput: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, private http: HttpClient) {
  }  

  ngOnInit() {
  }

  // private upload() {
  //   const fileBrowser = this.fileInput.nativeElement;
  //   if (fileBrowser.files && fileBrowser.files[0]) {
  //     const formData = new FormData();
  //     formData.append('files', fileBrowser.files[0]);
  //     const xhr = new XMLHttpRequest();
  //     xhr.open('POST', 'http://api.zen.com.my/api/v2/files/', true);
  //     xhr.onload = function () {
  //       if (this['status'] === 200) {
  //           const responseText = this['responseText'];
  //           const files = JSON.parse(responseText);
  //           //todo: emit event
  //       } else {
  //         //todo: error handling
  //       }
  //     };
  //     xhr.send(formData);
  //   }
  // }
  

  ionViewDidLoad() {
    console.log('ionViewDidLoad UploadPage');
  }

}

