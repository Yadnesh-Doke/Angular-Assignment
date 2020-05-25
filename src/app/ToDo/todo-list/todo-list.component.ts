import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router, ActivatedRoute } from '@angular/router';
import { TodoService } from 'src/app/services/todo.service';
import { User } from 'src/app/Models/user.model';
import { Subject, BehaviorSubject } from 'rxjs';
import { Task } from 'src/app/Models/task.model';
import { HeaderLinks } from 'src/app/Models/header-links.model';
import { HeaderService } from 'src/app/services/header-service.service';

@Component({
  selector: 'app-todo-list',
  templateUrl: './todo-list.component.html',
  styleUrls: ['./todo-list.component.css']
})
export class TodoListComponent implements OnInit {
  todoArray: Task[] = [];
  usersArray: User[] = [];
  userIndex: number;
  disableEdit: boolean = false;
  disableDelete: boolean = false;
  disableEditAndDelete: boolean = false;
  showDelete: boolean = true;
  showDone: boolean = false;
  deleteOpacity: number = 0.4;
  deleteRowOpacity: number = 1;
  filterTitle: string = "";
  showEmptyError: boolean = false;
  selectedValue: string = "All";
  currentUser = new BehaviorSubject<User>(null);
  header: HeaderLinks = new HeaderLinks();

  constructor(private authService: AuthService,
    private router: Router,
    private currentRoute: ActivatedRoute,
    private todoService: TodoService,
    private headerService: HeaderService) { }

  ngOnInit(): void {
    this.header.profileLink = true; this.header.todoLink = false;
    this.header.logoutLink = true; this.header.loginLink = false;

    this.authService.loggedInUser.subscribe(loggedInUser => {
      this.todoArray = loggedInUser.todoArray;
      this.header.imgSrc = loggedInUser.imagePath;
      this.headerService.headerLinks.next(this.header);

      console.log("Array: \n" + this.todoArray);
    });

    //   this.authService.fetchUsers().subscribe(
    //     users => {
    //        this.usersArray = users.map((user) => {
    //             return {...user,todoArray: user.todoArray ? user.todoArray : []};
    //         });
    //         console.log("users array from TODO LIST: ");
    //         console.log(this.usersArray);
    //         let currUser = JSON.parse(localStorage.getItem("user"));
    //         let currentUser = this.usersArray.find(user => user.email === currUser.email);
    //         console.log("Current user from TODO LIST");
    //         console.log(currentUser);
    //         this.todoArray = currentUser.todoArray;
    //         this.currentUser.next(currentUser);
    //         this.userIndex = this.usersArray.indexOf(currentUser);
    //         console.log("Current user index from TODO LIST: "+this.userIndex);
    //     }
    // );

  }

  addNewTask() {
    console.log("going to add new task.");
    this.router.navigate(["/todoAdd"]);
  }

  toEditPage(index: number) {
    console.log("\nGoing to Todo Edit page: " + index);
    this.router.navigate([index + "/edit"], { relativeTo: this.currentRoute });
  }

  deleteRow(index: number) {
    this.todoService.deleteRow(index);
  }

  checkThat(i: number) {
    let flag = false;
    // let arr = (document.getElementsByClassName("checkboxes"));
    let arr = document.querySelectorAll(".checkboxes");
    for (let i = 0; i < arr.length; i++) {
      let ele = arr[i] as HTMLInputElement;
      if (ele.checked == true) {
        flag = true;
        break;
      }
    }

    if (flag) {
      this.disable();
      this.showDelete = false;
      this.deleteOpacity = 1;
      this.showDone = true;
    }
    else {
      this.enable();
      this.showDelete = true;
      this.deleteOpacity = 0.4;
      this.showDone = false;
    }
  }

  checkAll() {
    let arr = document.querySelectorAll(".checkboxes");
    let ele;
    let head_check = document.querySelector("#head-checkbox") as HTMLInputElement;
    // alert("head-checkbox: \n"+head_check.checked);
    if (head_check.checked === true) {
      for (let i = 0; i < arr.length; i++) {
        ele = arr[i] as HTMLInputElement;
        ele.checked = true;
      }
      this.disable();
      this.showDelete = false;
      this.deleteOpacity = 1;
      this.showDone = true;
    }
    else {
      for (let i = 0; i < arr.length; i++) {
        ele = arr[i] as HTMLInputElement;
        ele.checked = false;
      }
      this.enable();
      this.showDelete = true;
      this.deleteOpacity = 0.4;
      this.showDone = false;
    }

  }

  disable() {
    this.disableEditAndDelete = true;
    this.disableEdit = true;
    this.disableDelete = true;
    this.deleteRowOpacity = 0.4;
  }

  enable() {
    this.disableEditAndDelete = false;
    this.disableEdit = false;
    this.disableDelete = false;
    this.deleteRowOpacity = 1;
  }

  markDone() {
    let arr = document.querySelectorAll(".checkboxes");
    for (let i = 0; i < arr.length; i++) {
      let ele = arr[i] as HTMLInputElement;
      if (ele.checked == true) {
        this.todoService.markAsDone(i);
        ele.checked = false;
        this.enable();
        this.showDone = false;
        this.showDelete = true;
        let head_check = document.querySelector("#head-checkbox") as HTMLInputElement;
        head_check.checked = true ? false : false;
      }
    }
  }

  deleteTodo() {
    let arr = document.querySelectorAll(".checkboxes");
    this.todoService.deleteMultiple(arr);
    console.log("done deleting multiple");
    for (let i = 0; i < arr.length; i++) {
      let ele = arr[i] as HTMLInputElement;
      if (ele.checked == true) {
        ele.checked = false;
        this.enable();
        this.showDone = false;
        this.showDelete = true;
        let head_check = document.querySelector("#head-checkbox") as HTMLInputElement;
        head_check.checked = true ? false : false;
      }
    }
  }

}
