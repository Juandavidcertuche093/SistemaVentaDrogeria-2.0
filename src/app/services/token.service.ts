import { Injectable } from '@angular/core';
import { getCookie, setCookie, removeCookie } from 'typescript-cookie';

@Injectable({
  providedIn: 'root'
})
export class TokenService {

  constructor() { }

  saveToken(token: string){
    if (typeof document !== 'undefined') {
      setCookie('token', token, {expires: 1, path: '/'});
    }
  }

  getToken(){
    if (typeof document !== 'undefined') {
      return getCookie('token')
    }
    return null;
  }

  removeToken(){
    if (typeof document !== 'undefined') {
      removeCookie('token')
    }
  }

}

