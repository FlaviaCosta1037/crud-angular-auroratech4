import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Person } from './person';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { map } from 'rxjs/operators';

@Injectable()
export class PersonService {
  constructor(private http: HttpClient, private db: AngularFireDatabase) {}

  getPerson() {
    return this.http
      .get<any>('assets/person.json')
      .toPromise()
      .then((res) => <Person[]>res.data)
      .then((data) => {
        return data;
      });
  }

  savePerson(person:Person){
    this.db.list("persons").push(person).then((result: any) =>{
      console.log(result.key);
    })
  }
}
