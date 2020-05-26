import { Injectable, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User } from '../Models/user.model';
import { Router } from '@angular/router';
import { catchError, map } from 'rxjs/operators'
import { throwError, Subject, BehaviorSubject } from 'rxjs';

export interface AuthResponseData{
    idToken: string,
    email: string,
    refreshToken: string,
    expiresIn: string,
    localId: string,
    registered?: boolean	
}

@Injectable({providedIn: 'root'})
export class AuthService implements OnInit{
    usersArray: User[] = [];
    usersChanged = new Subject<User[]>();
    loggedInUser = new BehaviorSubject<User>(null);

    constructor(private http: HttpClient,private router: Router){}

    ngOnInit(){
        console.log("from auth service: ");
        console.log(this.usersArray);
    }

    signup(email: string, password: string)
    {
       return this.http.post<AuthResponseData>(
            "https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyA5P6e5XKwvbmUWM4vGe3r4P4RvdAawTWE",
            {
                email: email,
                password: password,
                returnSecureToken: true 
            })
            .pipe(catchError(errorRes => {
                let errorMessage = "An Error Occured!";
                switch(errorRes.error.error.message){
                    case "EMAIL_EXISTS":
                        errorMessage = "This email already exists!"
                }
                return throwError(errorMessage);
            })
        );
    }

    storeUser(user: User){
        this.http.post(
            "https://todo-angular-assignment.firebaseio.com/users.json",user).subscribe(
                (response) => {
                    console.log(response);
                    this.router.navigate(["/login"]);
                }, error => {
                    console.log(error);
                }
            );
    }

    login(email: string, password: string){
        return this.http.post<AuthResponseData>(
            "https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyA5P6e5XKwvbmUWM4vGe3r4P4RvdAawTWE",
            {
                email: email,
                password: password,
                returnSecureToken: true
            }
        )
        .pipe(catchError(errorRes => {
            let errorMessage = "Please enter valid credentials!"
            if(errorRes.error.error.message){
                return throwError(errorMessage);
            }
        }));
    }

    fetchUsers(){
        // this.usersChanged.subscribe((users: User[]) => {
        //     this.usersArray = users;
        // })
       return this.http.get<AuthResponseData>(
            "https://todo-angular-assignment.firebaseio.com/users.json"
         ).pipe(map(responseData => {
            let usersArray = [];
            for(let key in responseData)
            {
                if(responseData.hasOwnProperty(key))
                {
                    console.log("if hasOwnProperty");
                    usersArray.push({ ...responseData[key], id:key});
                }
            }
            return usersArray;
        }));
    }

    fetchUsersArray(){
        this.fetchUsers().subscribe(
            users => {
               this.usersArray = users.map((user) => {
                    return {...user,todoArray: user.todoArray ? user.todoArray : []};
                });
                console.log("users array: ");
                // this.usersChanged.next(this.usersArray.slice());
                console.log(this.usersArray);
            }
        );
    }

    addUserToArray(user: User) {
        // this.usersChanged.subscribe((users: User[]) => {
        //     this.usersArray = users;
        // });
        this.usersArray.push(user);
        console.log("in add user to array");
        // this.usersChanged.next(this.usersArray.slice());
    }

    getUsers(){
        return this.usersArray.slice();
    }

    updateData(firstName: string,lastName: string,gender: string,address: string,password: string,imagePath: string){
        // this.usersChanged.subscribe((users: User[]) => {
        //     this.usersArray = users;
        // });
        let currUser = JSON.parse(localStorage.getItem("user"));
        console.log("currUser: "+currUser);
        // let currentUser = this.usersArray.find(user => user.loginStatus === true);
        let currentUser = this.usersArray.find(user => user.email === currUser.email);
        console.log("current User is: ");
        console.log(currentUser);
        let index: number = this.usersArray.indexOf(currentUser);
        console.log("index: ");
        console.log(index);
        this.usersArray[index].firstName = firstName;
        this.usersArray[index].lastName = lastName;
        this.usersArray[index].gender = gender;
        this.usersArray[index].address = address;
        this.usersArray[index].password = password;
        this.usersArray[index].imagePath = imagePath;

        this.http.put("https://todo-angular-assignment.firebaseio.com/users.json",this.usersArray).subscribe(
            putResponse => {
                console.log("response from Put reuest: ");
                console.log(putResponse);
                console.log(this.usersArray);
                // this.usersChanged.next(this.usersArray.slice());
                // this.router.navigate(["../"]);
            }, error => {
                console.log("ERROR FROM PUT REQUEST!!!");
                console.log(error);
            }
        );
    }
}