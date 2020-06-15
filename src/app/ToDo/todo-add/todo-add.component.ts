import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { TodoService } from 'src/app/services/todo.service';
import { Task } from 'src/app/Models/task.model';
import { Router } from '@angular/router';
import { HeaderLinks } from 'src/app/Models/header-links.model';
import { HeaderService } from 'src/app/services/header-service.service';
import { AuthService } from 'src/app/services/auth.service';
import { User } from 'src/app/Models/user.model';

@Component({
  selector: 'app-todo-add',
  templateUrl: './todo-add.component.html',
  styleUrls: ['./todo-add.component.css']
})
export class TodoAddComponent implements OnInit {
  todoAddForm: FormGroup;
  usersArray: User[] = [];
  userIndex: number;
  today;
  minDate;
  maxRemDate;
  minDue: boolean = false;
  showRemiderDate: boolean = false;
  reminderEmpty: boolean = false;
  startDateSet: boolean = false;
  dueDateSet: boolean = false;
  disableReminderDate: boolean = (this.startDateSet && this.dueDateSet) ? false : true;
  isLoading: boolean = false;
  header: HeaderLinks = new HeaderLinks();

  constructor(private todoService: TodoService,private authService: AuthService, private router: Router, private headerService: HeaderService) { }

  ngOnInit(): void {
    this.header.profileLink = false;  this.header.todoLink = true;
    this.header.logoutLink = true;   this.header.loginLink = false;

    this.authService.loggedInUser.subscribe(lUser => {
      this.header.imgSrc = lUser.imagePath;
      this.headerService.headerLinks.next(this.header);
    });

    this.today = new Date().toISOString().substr(0, 10);
    this.todoAddForm = new FormGroup({
      "title" : new FormControl(null,Validators.required),
      "category" : new FormControl("Office",Validators.required),
      "startDate" : new FormControl(null,Validators.required),
      "dueDate" : new FormControl(null,Validators.required),
      "reminderValue" : new FormControl("no",Validators.required),
      "reminderDate" : new FormControl({value:'', disabled:this.disableReminderDate}),
    });

    this.authService.fetchUsers().subscribe(
      users => {
        this.usersArray = users.map((user) => {
          return { ...user, todoArray: user.todoArray ? user.todoArray : [] };
        });
        let currUser = JSON.parse(localStorage.getItem("user"));
        let currentUser = this.usersArray.find(user => user.email === currUser.email);
        console.log("Current user from TODO LIST");
        console.log(currentUser);
        this.header.imgSrc = currentUser.imagePath;
        this.headerService.headerLinks.next(this.header);
        this.userIndex = this.usersArray.indexOf(currentUser);
        console.log("Current user index from TODO ADD: " + this.userIndex);
      }
    );  

  }

  setMinDate(){
    this.startDateSet = true;
    // this.disableReminderDate = (this.startDateSet && this.dueDateSet) ? false : true;
    if(this.startDateSet && this.dueDateSet)
    {
      this.todoAddForm.controls['reminderDate'] .enable();
    }
    else{
      this.todoAddForm.controls['reminderDate'] .disable();
    }
    this.minDate = this.todoAddForm.value.startDate;
    if(this.todoAddForm.value.dueDate === null)
    {}
    else if(this.todoAddForm.value.dueDate < this.todoAddForm.value.startDate){
      this.minDue = true;
    }
    else {
      this.minDue = false;
    }
  }

  setMaxRem(){
    this.dueDateSet = true;
    // this.disableReminderDate = (this.startDateSet && this.dueDateSet) ? false : true;
    if(this.startDateSet && this.dueDateSet)
    {
      this.todoAddForm.controls['reminderDate'] .enable();
    }
    else{
      this.todoAddForm.controls['reminderDate'] .disable();
    }
    this.minDue = false;
    this.maxRemDate = this.todoAddForm.value.dueDate;
  }

  isReminder(event: any){
    this.todoAddForm.value.reminderValue = event.target.value;
    this.reminderEmpty = false;
    if(this.todoAddForm.value.reminderValue === "yes"){
      this.showRemiderDate = true;
      this.todoAddForm.value.reminderDate = "";
    }

    if(this.todoAddForm.value.reminderValue === "no"){
      this.showRemiderDate = false;
      this.todoAddForm.value.reminderDate = "";
    }
  }

  isPublicStatus(event: any) {
    this.todoAddForm.value.isPublic = event.target.value;
  }

  onSubmit() {
    this.isLoading = true;
    console.log(this.todoAddForm);
    if(this.todoAddForm.value.reminderValue === "yes")
    {
        if(this.todoAddForm.value.reminderDate === "")
        {
          this.reminderEmpty = true;
          this.isLoading = false;
        }
        else{
          this.reminderEmpty = false;
          this.addTask();
        }
    }
    else{
      this.reminderEmpty = false;
      this.todoAddForm.value.reminderDate = "No";
      this.addTask();
    }

  }   

  addTask(){
    let task: Task;
    task = new Task(this.todoAddForm.value.title,
                    this.todoAddForm.value.category,
                    this.todoAddForm.value.startDate,
                    this.todoAddForm.value.dueDate,
                    this.todoAddForm.value.reminderValue,
                    this.todoAddForm.value.reminderDate,
                    "Pending");

    this.todoService.addTaskToArray(task);
    this.usersArray[this.userIndex].todoArray.push(task);
    this.todoService.sendDataToServer(this.usersArray);
    // this.router.navigate(["/todoList"]);
  }

  checkRadio(value){
    if(value === 1){
      (<HTMLInputElement>document.querySelector("#yes")).checked = true;
    }
    else if(value === 2){
      (<HTMLInputElement>document.querySelector("#no")).checked = true;
    }
  }

}
