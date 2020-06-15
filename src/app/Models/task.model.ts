export class Task{
    constructor(
        public title: string,
        public category: string,
        public startDate: Date,
        public dueDate: Date,
        public reminderValue: string,
        public reminderDate: any,
        // public isPublic: string,
        public status: string)
        {}
}