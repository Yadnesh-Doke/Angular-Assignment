import { Pipe, PipeTransform } from '@angular/core';
import { Task } from 'src/app/Models/task.model';
import { TodoListComponent } from './todo-list.component';

@Pipe({
  name: 'filterDropdown'
})
export class FilterDropdownPipe implements PipeTransform {

  constructor(private todoList: TodoListComponent){}

  transform(value: Task[], dropDownValue: string) {
    if(value.length === 0){
      this.todoList.showEmptyError = true;
      return value;
    }
    else{
      this.todoList.showEmptyError = false;
    }

    if(dropDownValue === "All"){
      this.todoList.showEmptyError = false;
      return value;
    }

    let flag: boolean = false;
    let resultArray = [];
    for(let task of value){
      if(task.category === dropDownValue){
        this.todoList.showEmptyError = false;
        flag = true;
        resultArray.push(task);
      }
    }

    if(!flag){
      this.todoList.showEmptyError = true;
    }
    else{
      this.todoList.showEmptyError = false;
    }

    return resultArray;
  }

}
