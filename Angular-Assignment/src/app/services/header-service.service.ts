import { Injectable } from '@angular/core';
import { HeaderLinks } from '../Models/header-links.model';
import { Subject } from 'rxjs';

@Injectable({providedIn: 'root'})
export class HeaderService{
    hLinks: HeaderLinks;
    headerLinks = new Subject<HeaderLinks>();
}