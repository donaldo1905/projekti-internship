import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { map } from 'rxjs';
import { AuthService, User } from '../authentication/auth.service';
import { ItemModel, ItemsService } from '../services/items.service';


@Component({
  selector: 'app-admin-page',
  templateUrl: './admin-page.component.html',
  styleUrls: ['./admin-page.component.scss']
})
export class AdminPageComponent implements OnInit{
  
  displayedColumns: string[] = ['firstName', 'lastName', 'email', 'uid', 'delete'];
  displayedItemColumns: string[] = ['name', 'director', 'year', 'id', 'edit', 'delete'];
  dataSource: any;
  itemsSource: any;
  
  constructor(private itemsService: ItemsService, private authService: AuthService ){}
  ngOnInit(): void {
  this.getAllUsers()
  this.getAllItems()  
  }

  getAllUsers(){
    this.authService.getUsers().pipe(map((res: any) => {
      const tempDoc: any[] = []
      res.forEach((doc: any) => {
         tempDoc.push({ id: doc.id, ...doc.data() })
      })
      return tempDoc})).subscribe((res: any) => {
      for(let user of res){
        if(user.role === 'admin'){
          res.splice(res.indexOf(user), 1)
        }
      }
      this.dataSource = new MatTableDataSource<User[]>(res)
    })
  }

  getAllItems(){
    this.itemsService.getItems().pipe(map((res: any) => {
      const products = []
      for(const key in res){
        if(res.hasOwnProperty(key)){
          products.push({...res[key], id: key})
        }
      }
      return products
    })).subscribe((res)=> {
      this.itemsSource = new MatTableDataSource<User[]>(res)
      this.itemsSource!.filterPredicate = function(data: any, filter: string): boolean{
      return data.name.toLowerCase().includes(filter)
    }
    this.itemsService.itemToAdd.subscribe(movie => {
      const data = this.itemsSource.data;
      let check = false
      for(let i=0; i< data.length; i++){
        if(data[i].id === movie.id){
          data[i] = movie
          check = true
        }
      } 
      if(!check){
        data.push(movie) 
      }
      this.itemsSource.data = data
      })
    })
  }

  deleteItem(item: ItemModel){
    if(window.confirm('Are you sure you want to delete this item?')){
    this.itemsService.delete(item).subscribe()
    this.authService.getUsers().pipe(map((res: any) => {
      const tempDoc: any[] = []
      res.forEach((doc: any) => {
         tempDoc.push({ id: doc.id, ...doc.data() })
      })
      return tempDoc
  })).subscribe( res => {
      for(let user of res){
        for(let i=0; i<user.savedMovies?.length; i++){
          if(user.savedMovies[i].id === item.id){
            let array1 = user.savedMovies.splice(0, i)
          let array2 = user.savedMovies.splice(i+1, user.savedMovies.length)
            this.authService.getUser(user.uid).update({ savedMovies: array1.concat(array2) })
          }
        }
      }
  })
     this.itemsSource.data.splice(this.itemsSource.data.indexOf(item), 1)
     this.itemsSource._updateChangeSubscription()
  }}

  applyItemFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.itemsSource.filter = filterValue.trim().toLowerCase();
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  logout(): void {
    this.authService.signOut()
  }
}
