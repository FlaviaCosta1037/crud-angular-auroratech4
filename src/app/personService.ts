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
  
  update(person: Person, key: string) {
    this.db.list('persons').update(key, person)
      .then((result: any) => {
        console.log(result.key);
      }).catch(err => console.log(err));
  }

  getAll() {
    return this.db.list('persons')
      .snapshotChanges()
      .pipe(
        map(changes => {
          return changes.map(c => ({ key: c.payload.key, ...c.payload.val }));
        })
      )
  }
  delete(key: string) {
    this.db.object(`persons/${key}`).remove()
      .catch(err => console.log(err));
  }
}


