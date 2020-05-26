import { Task } from './task.model';

export class User {
    constructor(
        public email: string,
        public firstName: string,
        public lastName: string,
        public gender: string,
        public address: string,
        public imagePath: string,
        public password: string,
        public todoArray: Task[],
        public token: string,
        public expirationDate: Date
        //public loginStatus: boolean = false)
        )
    {}
}