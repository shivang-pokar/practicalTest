import { Injectable } from '@angular/core';
import { Registration } from 'src/app/model/registration';
import * as moment from 'moment';

@Injectable({
  providedIn: 'root'
})
export class RegisterUserService {

  constructor() { }

  createRegisterUserObj(userData: Registration): Registration {
    let createUserobj = new Registration();
    if (!userData.id) {
      createUserobj.id = this.genrateId()
    }
    else {
      createUserobj.id = userData.id
    }
    createUserobj.dob = moment(userData.dob).format('YYYY-MM-DD')
    createUserobj.email = userData.email
    createUserobj.firstName = userData.firstName
    createUserobj.gender = userData.gender
    createUserobj.lastName = userData.lastName
    createUserobj.password = userData.password
    return createUserobj;

  }

  genrateId(): string {
    return '_' + Math.random().toString(36).substr(2, 9);
  }

}
