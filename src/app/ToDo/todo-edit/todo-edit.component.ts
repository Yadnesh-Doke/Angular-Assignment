import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { TodoService } from '../../services/todo.service';
import { Task } from '../../Models/task.model';
import { User } from '../../Models/user.model';
import { AuthService } from '../../services/auth.service';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { TodoListComponent } from '../todo-list/todo-list.component';
import { HeaderLinks } from 'src/app/Models/header-links.model';
import { HeaderService } from 'src/app/services/header-service.service';


@Component({
  selector: 'app-todo-edit',
  templateUrl: './todo-edit.component.html',
  styleUrls: ['./todo-edit.component.css']
})
export class TodoEditComponent implements OnInit {
  editForm: FormGroup;
  usersArray: User[] = [];
  userIndex: number;
  today;
  minDate;
  maxRemDate;
  minDue: boolean = false;
  showRemiderDate: boolean = false;
  reminderEmpty: boolean = false;
  editingTask: Task;
  user: User;
  editIndex: number;
  isLoading: boolean = false;
  header: HeaderLinks = new HeaderLinks();

  constructor(private todoService: TodoService,
              private authService: AuthService,
              private currRoute: ActivatedRoute,
              private router: Router,
              private headerService: HeaderService) { }

  ngOnInit(): void {
    this.header.profileLink = false;  this.header.todoLink = true;
    this.header.logoutLink = true;   this.header.loginLink = false;
    
     console.log("in edit page");
     this.authService.loggedInUser.subscribe(lUser => {
      this.user = lUser;
      this.header.imgSrc = lUser.imagePath;
      this.headerService.headerLinks.next(this.header);

      console.log("subscribing to current user");
      console.log(this.user);
    });

    this.editIndex = this.currRoute.snapshot.params["id"];
    console.log("index from outside: " + this.editIndex);
    this.currRoute.params.subscribe((params: Params) => {
      this.editIndex = params["id"];
      console.log("index from observable: " + this.editIndex);
    });

    console.log(this.user.todoArray[this.editIndex]);
    this.editingTask = this.user.todoArray[this.editIndex];

    this.setRanges();
    this.createForm();
   
    this.authService.fetchUsers().subscribe(
      users => {
        this.usersArray = users.map((user) => {
          return { ...user, todoArray: user.todoArray ? user.todoArray : [] };
        });
        console.log("users array from TODO LIST: ");
        console.log(this.usersArray);
        let currUser = JSON.parse(localStorage.getItem("user"));
        let currentUser = this.usersArray.find(user => user.email === currUser.email);
        console.log("Current user from TODO LIST");
        console.log(currentUser);
        this.userIndex = this.usersArray.indexOf(currentUser);
        console.log("Current user index from TODO ADD: " + this.userIndex);
      }
    );
  }

  setRanges(){
    console.log("in setRange()");
    this.today = this.user.todoArray[this.editIndex].startDate;
    this.minDate = this.user.todoArray[this.editIndex].startDate;
    this.maxRemDate = this.user.todoArray[this.editIndex].dueDate;

    if(this.editingTask.reminderValue === "no"){
      this.showRemiderDate = false;
    }
    else if(this.editingTask.reminderValue === "yes"){
      this.showRemiderDate = true;
    }
  }

  createForm(){
    this.editForm = new FormGroup({
      "title": new FormControl(this.editingTask.title, Validators.required),
      "category": new FormControl(this.editingTask.category, Validators.required),
      "startDate": new FormControl(this.editingTask.startDate, Validators.required),
      "dueDate": new FormControl(this.editingTask.dueDate, Validators.required),
      "reminderValue": new FormControl(this.editingTask.reminderValue, Validators.required),
      "reminderDate": new FormControl(this.editingTask.reminderDate),
      // "isPublic": new FormControl(this.editingTask.isPublic, Validators.required)
    });
  }

  setMinDate() {
    this.minDate = this.editForm.value.startDate;
    if (this.editForm.value.dueDate === null) { }
    else if (this.editForm.value.dueDate < this.editForm.value.startDate) {
      this.minDue = true;
    }
    else {
      this.minDue = false;
    }
  }

  setMaxRem() {
    this.minDue = false;
    this.maxRemDate = this.editForm.value.dueDate;
  }

  isReminder(event: any) {
    this.editForm.value.reminderValue = event.target.value;
    console.log("isReminder: " + this.editForm.value.reminderValue);
    this.reminderEmpty = false;
    if (this.editForm.value.reminderValue === "yes") {
      this.showRemiderDate = true;
      this.editForm.value.reminderDate = "";
    }

    if (this.editForm.value.reminderValue === "no") {
      this.showRemiderDate = false;
      this.editForm.value.reminderDate = "";
    }
  }

  isPublicStatus(event: any) {
    this.editForm.value.isPublic = event.target.value;
  }

  onSubmit() {
    this.isLoading = true;
    console.log(this.editForm.value);
    if(this.editForm.value.reminderValue === "no"){
      this.editForm.value.reminderDate = "No";
    }
    let task: Task;
    task = new Task(this.editForm.value.title,
                    this.editForm.value.category,
                    this.editForm.value.startDate,
                    this.editForm.value.dueDate,
                    this.editForm.value.reminderValue,
                    this.editForm.value.reminderDate,
                    // this.editForm.value.isPublic,
                    "Pending");
    this.todoService.updateTask(this.editIndex,task);
    this.usersArray[this.userIndex].todoArray[this.editIndex] = task;
    this.todoService.sendDataToServer(this.usersArray);
    // this.router.navigate(["/todoList"]);
  }

}
