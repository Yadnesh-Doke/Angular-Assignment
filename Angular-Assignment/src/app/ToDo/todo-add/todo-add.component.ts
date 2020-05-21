import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { TodoService } from 'src/app/services/todo.service';
import { Task } from 'src/app/Models/task.model';
import { Router } from '@angular/router';
import { HeaderLinks } from 'src/app/Models/header-links.model';
import { HeaderService } from 'src/app/services/header-service.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-todo-add',
  templateUrl: './todo-add.component.html',
  styleUrls: ['./todo-add.component.css']
})
export class TodoAddComponent implements OnInit {
  todoAddForm: FormGroup;
  today;
  minDate;
  maxRemDate;
  minDue: boolean = false;
  showRemiderDate: boolean = false;
  reminderEmpty: boolean = false;
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
      "reminderValue" : new FormControl("No",Validators.required),
      "reminderDate" : new FormControl(null),
      // "isPublic" : new FormControl("No",Validators.required)
    });

  }

  setMinDate(){
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
    this.minDue = false;
    this.maxRemDate = this.todoAddForm.value.dueDate;
  }

  isReminder(event: any){
    this.todoAddForm.value.reminderValue = event.target.value;
    console.log("isReminder: "+ this.todoAddForm.value.reminderValue);
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
      console.log("inside if yes");
        if(this.todoAddForm.value.reminderDate === null)
        {
          console.log("in if empty");
          this.reminderEmpty = true;
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
    console.log("task will be added to the array...");
    let task: Task;
    task = new Task(this.todoAddForm.value.title,
                    this.todoAddForm.value.category,
                    this.todoAddForm.value.startDate,
                    this.todoAddForm.value.dueDate,
                    this.todoAddForm.value.reminderValue,
                    this.todoAddForm.value.reminderDate,
                    // this.todoAddForm.value.isPublic,
                    "Pending");

    this.todoService.addTaskToArray(task);
    this.router.navigate(["/todoList"]);
  }

}
