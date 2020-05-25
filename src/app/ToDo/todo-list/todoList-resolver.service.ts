import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, Resolve } from '@angular/router';
import { User } from '../../Models/user.model';
import { AuthService } from '../../services/auth.service';
import { Task } from 'src/app/Models/task.model';

@Injectable({providedIn : 'root'})
export class TodoListResolver implements Resolve<Task[]> {

    constructor(private authService: AuthService) {}

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        let user: User;
        this.authService.loggedInUser.subscribe(loggedInUser => {
            user = loggedInUser;
        });
        console.log(user);
        return user.todoArray;
    }
}