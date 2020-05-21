import { Injectable } from '@angular/core';
import { User } from '../Models/user.model';
import { AuthService } from './auth.service';
import { Task } from '../Models/task.model';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: "root" })
export class TodoService {
    loggedInUser: User;
    currentLoggedInUser = new BehaviorSubject<User>(null);
    currentUser: User;
    usersArray: User[] = [];
    userIndex: number;

    constructor(private authService: AuthService, private router: Router, private http: HttpClient) {
        this.authService.loggedInUser.subscribe(user => {
            this.loggedInUser = user;
            // console.log("current user from TODO service:");
            // console.log(this.loggedInUser);
        });
        console.log("\n IN THE CONSTRUCTOR OF TODO SERVICE.\n")
        this.authService.fetchUsers().subscribe(
            users => {
               this.usersArray = users.map((user) => {
                    return {...user,todoArray: user.todoArray ? user.todoArray : []};
                });
                console.log("users array from ToDo service: ");
                // // this.usersChanged.next(this.usersArray.slice());
                console.log(this.usersArray);

                // this.userIndex = this.usersArray.indexOf(this.loggedInUser);
                // console.log("current user index: "+this.userIndex);
                let currUser = JSON.parse(localStorage.getItem("user"));
                let currentUser = this.usersArray.find(user => user.email === currUser.email);
                console.log("Current user from TODO service");
                console.log(currentUser);
                this.currentUser = currentUser;
                // this.currentLoggedInUser.next(this.currentUser);
                this.userIndex = this.usersArray.indexOf(currentUser);
                console.log("Current user index from TODO service: "+this.userIndex);
            }
        );
    }

    addTaskToArray(task: Task) {
        console.log("newly created task is: ");
        console.log(task);
        this.loggedInUser.todoArray.push(task);
        this.currentUser.todoArray.push(task);
        this.usersArray[this.userIndex].todoArray.push(task);
        console.log("\nafter a task added:");
        console.log(this.loggedInUser.todoArray);
        // console.log(this.loggedInUser);
        console.log(this.usersArray[this.userIndex]);
        this.authService.loggedInUser.next(this.loggedInUser);
        this.currentLoggedInUser.next(this.currentUser);
        
        this.sendDataToServer();
    }

    updateTask(index: number, task: Task) {
        this.loggedInUser.todoArray[index] = task;
        this.currentUser.todoArray[index] = task;
        this.usersArray[this.userIndex].todoArray[index] = task;
        console.log("After updating task, array is: ");
        console.log(this.currentUser.todoArray);
        this.authService.loggedInUser.next(this.loggedInUser);
        this.currentLoggedInUser.next(this.currentUser);
        this.sendDataToServer();
    }

    deleteRow(index: number) {
        console.log("index to  be deleted: " + index);
        this.loggedInUser.todoArray.splice(index, 1);
        this.currentUser.todoArray.splice(index,1);
        this.usersArray[this.userIndex].todoArray.splice(index,1);
        this.authService.loggedInUser.next(this.loggedInUser);
        this.currentLoggedInUser.next(this.currentUser);
        console.log("task deleted");
        this.UpdateDataToServer();
    }

    markAsDone(index: number) {
        console.log("In mark as done() method");
        console.log("index: " + index);
        this.loggedInUser.todoArray[index].status = "Done";
        this.currentUser.todoArray[index].status = "Done";
        this.usersArray[this.userIndex].todoArray[index].status = "Done";
        console.log("status changed to done");
        // console.log(this.loggedInUser.todoArray[index].status);
        this.authService.loggedInUser.next(this.loggedInUser);
        this.currentLoggedInUser.next(this.currentUser);
        this.UpdateDataToServer();
    }

    deleteMultiple(arr) {
        for (let i = 0; i < arr.length; i++) 
        {
            let ele = arr[i] as HTMLInputElement;
            if (ele.checked == true) 
            {
                console.log("matched: "+i);
                delete this.loggedInUser.todoArray[i];
                delete this.usersArray[this.userIndex].todoArray[i];
                delete this.currentUser.todoArray[i];
            }
        }

        this.loggedInUser.todoArray = this.loggedInUser.todoArray.filter((element) => {
            return element !== null;
        });

        this.usersArray[this.userIndex].todoArray = this.usersArray[this.userIndex].todoArray.filter((element) => {
            return element !== null;
        }); 
        this.currentUser.todoArray = this.currentUser.todoArray.filter((element) => {
            return element !== null;
        });

        console.log("deleted multiple");
        this.authService.loggedInUser.next(this.loggedInUser);
        this.currentLoggedInUser.next(this.currentUser);
        this.UpdateDataToServer();
    }

    sendDataToServer(){
        this.http.put("https://angular-assignment-7635b.firebaseio.com/users.json",this.usersArray).subscribe(
            putResponse => {
                console.log("response from Put reuest: ");
                console.log(putResponse);
                console.log(this.usersArray);
                // this.usersChanged.next(this.usersArray.slice());
                // this.router.navigate(["/todoList"]);
            }, error => {
                console.log("ERROR FROM PUT REQUEST!!!");
                console.log(error);
            }
        );
    }

    UpdateDataToServer(){
        console.log("In UpdateDataToServer()");
        this.http.put("https://angular-assignment-7635b.firebaseio.com/users.json",this.usersArray).subscribe(
            putResponse => {
                console.log("response from Update Put reuest: ");
                console.log(putResponse);
                console.log(this.usersArray);
            }, error => {
                console.log("ERROR FROM PUT REQUEST!!!");
                console.log(error);
            }
        );
    }

}