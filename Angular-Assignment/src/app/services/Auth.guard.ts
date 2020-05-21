import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Injectable } from '@angular/core';

@Injectable({providedIn: "root"})
export class AuthGuard implements CanActivate{
    constructor(private router: Router){}

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree{
        if(localStorage.getItem("user")){
            return true;
        }
        else{
            console.log("navigating from guard");
            // this.router.createUrlTree(["/login"]);
            this.router.navigate(["/login"]);
        }
    }

}