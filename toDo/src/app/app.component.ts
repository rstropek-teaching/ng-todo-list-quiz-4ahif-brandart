import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/filter';

interface IPerson {
  name: string;
}

interface ITodoItem {
  id: number;
  assignedTo?: string;
  description: string;
  done?: boolean
}


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  public people: Observable<IPerson[]>;
  public items: Observable<ITodoItem[]>;
  public client: HttpClient;
  public status: string;
  public name: string;

  public newPerson: string;
  public newDescription: string = "";
  constructor(private httpClient: HttpClient) {
    this.client = httpClient;
    this.people = httpClient.get<IPerson[]>('http://localhost:8080/api/people');
    this.getItems();
  }

  filterItems(newValue) {
    this.items = this.client.get<ITodoItem[]>('http://localhost:8080/api/todos').
      map(todo => todo.filter(element => element.assignedTo === newValue));
  }

  filterItemsDone() {
    this.items = this.client.get<ITodoItem[]>('http://localhost:8080/api/todos').
      map(todo => todo.filter(element => element.done === true));
  }

  filterItemsOpen() {
    this.items = this.client.get<ITodoItem[]>('http://localhost:8080/api/todos').
      map(todo => todo.filter(element => element.done === false || element.done == null));
  }

  filterItemsOpenAndPeople(newValue) {
    this.items = this.client.get<ITodoItem[]>('http://localhost:8080/api/todos').
      map(todo => todo.filter(element => element.done === false || element.done == null)).
      map(todo => todo.filter(element => element.assignedTo === newValue));
  }

  filterItemsDoneAndPeople(newValue) {
    this.items = this.client.get<ITodoItem[]>('http://localhost:8080/api/todos').
      map(todo => todo.filter(element => element.done === true)).
      map(todo => todo.filter(element => element.assignedTo === newValue));
  }



  getItems() {
    this.items = this.client.get<ITodoItem[]>('http://localhost:8080/api/todos');
  }

  onChangePerson(newValue) {
    if (newValue === "1") {
      this.name = null;
      this.getItems();
      if (this.status != null) {
        if (this.status === "open") {
          this.filterItemsOpen();
        } else {
          this.filterItemsDone();
        }
      }
    } else {
      this.name = newValue;
      this.filterItems(newValue);
      if (this.status != null) {
        if (this.status === "open") {
          this.filterItemsOpenAndPeople(newValue);
        } else {
          this.filterItemsDoneAndPeople(newValue);
        }
      }
    }

  }
  setPerson(newValue) {
    this.newPerson = newValue;
  }

  onCompleteTodo(n, id) {
    if (n === undefined) {
      this.client.patch('http://localhost:8080/api/todos/' + id,
        {
          "done": true
        }

      ).subscribe(
        (val) => {
          console.log('Done successful');
        });
      this.getItems();
    }
  }

  onSave() {
    this.client.post('http://localhost:8080/api/todos',
      {
        "description": this.newDescription,
        "assignedTo": this.newPerson
      }

    ).subscribe(
      (val) => {
        console.log('Post successful');
      });
    this.getItems();
  }

  showAddItem() {
    document.getElementById('addItem').style.visibility = "visible";
  }

  hideAddItem() {
    document.getElementById('addItem').style.visibility = "hidden";
  }

  onChangeStatus(newValue) {
    if (newValue === "1") {
      this.status = null;
      this.getItems()
      if (this.people != null) {
        this.filterItems(this.people);
      }
    } else {
      this.status = newValue;
      if (newValue === "open") {
        if (this.people != null) {
          this.filterItemsOpenAndPeople(this.people);
        }
      } else {
        this.filterItemsDoneAndPeople(this.people);
      }

    }
  }
}
