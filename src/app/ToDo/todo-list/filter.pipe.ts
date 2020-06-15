import { Pipe, PipeTransform } from '@angular/core';
import { Task } from 'src/app/Models/task.model';
import { TodoListComponent } from './todo-list.component';

@Pipe({
  name: 'filter'
})
export class FilterPipe implements PipeTransform {

  constructor(private todoList: TodoListComponent){}

  transform(value: Task[], filterTitle: string) {
    if(value.length === 0){
      this.todoList.showEmptyError = true;
      return value;
    }

    if(filterTitle === ""){
      this.todoList.showEmptyError = false;
      return value;
    }

    let resultArray = [];
    for(let task of value){
      if(task.title.toLowerCase().search(filterTitle.toLowerCase()) !== -1){
        this.todoList.showEmptyError = false;
        resultArray.push(task);
      }
      else{
        this.todoList.showEmptyError = true;
      }
    }
    return resultArray;
  }

}
