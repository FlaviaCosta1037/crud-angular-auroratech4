import { Component, OnInit, Input } from '@angular/core';
import { Product } from './product';
import { ProductService } from './productservice';
import { ConfirmationService } from 'primeng/api';
import { MessageService } from 'primeng/api';
import { PersonService } from './personService';
import { Person } from './person';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styles: [
    `
        :host ::ng-deep .p-dialog .product-image {
            width: 150px;
            margin: 0 auto 2rem auto;
            display: block;
        }
    `,
  ],
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  productDialog: boolean;

  products: Product[];

  product: Product;

  selectedProducts: Product[];

  submitted: boolean;

  persons: Observable<any>;
  person: Person;
  personDialog: boolean;


  //variavel login para aparecer para o usuário a próxima tela após logar
  login: boolean = false;
  //objeto usuário
  usuario = {
    nome: "",
    senha: ""
  }
  zipCode: string = '';
  address: any;
  key: string = "";



  constructor(
    private productService: ProductService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private personService: PersonService,
    private http: HttpClient
  ) { }

  ngOnInit() {
    this.persons = this.personService.getAll();
  }

  openNew() {
    this.person = {};
    this.submitted = false;
    this.personDialog = true;
  }

  //criada função realizar login
  realizarLogin() {
    if (this.usuario.nome == "admin" && this.usuario.senha == "admin") {
      this.login = true;
    } else if (this.usuario.nome == "" || this.usuario.senha == "") {
      return alert('Os campos precisam ser preenchidos');
    } else {
      return alert('Usuário ou senha inválidos, tente novamente!')
    }
  }
  buscarCEP(zipcode: string) {
    if (zipcode.length === 8) {
      this.http.get(`https://viacep.com.br/ws/${zipcode}/json/`)
        .subscribe((dadosCep: any) => {
          this.address = dadosCep;
          console.log(this.address)
          this.person.street = this.address.logradouro;
          this.person.neighborhood = this.address.bairro;
          this.person.city = this.address.localidade;
          this.person.state = this.address.uf;
          console.log(dadosCep)
        });
    }
  }

  editPerson(person: Person, key: string) {
    this.person = { ...person };

    this.key = key;
    this.person.born = new Date(this.person.born)
    this.personDialog = true;
    console.log(this.person)
  }


  hideDialog() {
    this.productDialog = false;
    this.submitted = false;
    this.personDialog = false;
  }

  savePerson() {
    this.submitted = true;

    if (this.person.name.trim()) {
      if (this.key) {
        this.personService.update(this.person, this.key)
        console.log(`updated ${this.person.name}`)
      } else {
        this.personService.savePerson(this.person);
        console.log(`saved ${this.person.name} `);
      }
      this.person = {};
      this.key = "";
      this.personDialog = false;
      this.submitted = false;
    }
  }

  deletePerson(key: string) {
    this.personService.delete(key);
  }


}
