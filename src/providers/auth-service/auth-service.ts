import { Http, Headers } from '@angular/http';
import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { AppConfig } from '../../config/app.config';
import 'rxjs/add/operator/map';

@Injectable()
export class AuthServiceProvider {

  isLogin:boolean;
  accountType:any;
  profile:any;
  token:any;

  constructor(public http: Http, public storage:Storage, public appConfig:AppConfig) {
    this.isLogin = false;
    this.accountType = '';
    this.profile = '';
    this.token = '';

    storage.get('token').then((token) => {
      if (token != null) {
        this.isLogin = true;
        this.token = token;
      }
    });
    storage.get('profile').then((data) => {
      this.profile = data;
    });
    storage.get('type').then((t) => {
      this.accountType = t;
    });
  }

  getToken(){
    return new Promise<string>((resolve, reject) => {
      this.storage.get('token').then(token=>{
         resolve(token);
      });
    });
  }

  setAuth(status,type) {
    this.accountType = type;
    this.isLogin = status;
  }

  logoff() {
    this.storage.set('token', null);
    this.storage.set('profile', null);
    this.storage.set('type', null);
  }

  setAccount(rawd) {
    console.log(rawd);
    if (rawd != null) {
      var accountdata = rawd['data'];
      if (rawd.type == 'uport') {
        this.storage.set('token', accountdata['token']);
        this.storage.set('profile', accountdata);
        this.storage.set('type', 'uport');
        this.token = accountdata['token'];
        this.profile = accountdata
      } else if (rawd.type == 'provider') {
        this.storage.set('token', accountdata['token']);
        this.storage.set('profile', accountdata);
        this.storage.set('type', 'provider');
        this.token = accountdata['token'];
        this.profile = accountdata
      }
    }
  }

  refugeeCheck() {
    let body = JSON.stringify({'token':this.token, 'refugee':this.profile['publicKey']});
    let head = new Headers({ 'Content-Type': 'application/json' });
    return this.http.post(this.appConfig.API_URL + "refugee/refugeeCheck", body, { headers : head }).map(res =>  res.json());
  }

  refugeeSet() {
    let body = JSON.stringify({'token':this.token, 'refugee':this.profile});
    let head = new Headers({ 'Content-Type': 'application/json' });
    return this.http.post(this.appConfig.API_URL + "refugee/refugeeSet", body, { headers : head }).map(res =>  res.json());
  }

  authping(token) {
    let body = JSON.stringify({'token':token});
    let head = new Headers({ 'Content-Type': 'application/json' });
    return this.http.post(this.appConfig.API_URL + "user/authping", body, { headers : head }).map(res =>  res.json());
  }

  login(params) {
    let body = JSON.stringify(params);
    let head = new Headers({ 'Content-Type': 'application/json' });
    return this.http.post(this.appConfig.API_URL + "user/authenticate", body, { headers : head }).map(res =>  res.json());
  }

  register(params) {
    let body = JSON.stringify(params);
    let head = new Headers({ 'Content-Type': 'application/json' });
    return this.http.post(this.appConfig.API_URL + "user/register", body, { headers : head }).map(res =>  res.json());
  }

}
