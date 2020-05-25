import { Pipe, PipeTransform } from '@angular/core';
import { Task } from 'src/app/Models/task.model';
import { TodoListComponent } from './todo-list.component';

@Pipe({
  name: 'filter'
})
export class FilterPipe implements PipeTransform {

  constructor(private todoList: TodoListComponent){}

  transform(value: Task[], filterTitle: string) {
    console.log("in pipe" );
    if(value.length === 0){
      // alert("No tasks to display!!");
      this.todoList.showEmptyError = true;
      return value;
    }

    if(filterTitle === ""){
      console.log("empty string title");
      this.todoList.showEmptyError = false;
      return value;
    }

    let resultArray = [];
    for(let task of value){
      if(task.title === filterTitle){
        this.todoList.showEmptyError = false;
        resultArray.push(task);
      }
      else{
        console.log("in else");
        this.todoList.showEmptyError = true;
      }
    }
    return resultArray;
  }

}
