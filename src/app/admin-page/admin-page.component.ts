import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { map } from 'rxjs';
import { AuthService, User } from '../authentification/auth.service';
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
  constructor(private itemsService: ItemsService, private auth: AuthService){}
  ngOnInit(): void {
    this.auth.getUsers().subscribe((res: any) => {
      for(let user of res){
        if(user.role === 'admin'){
          res.splice(res.indexOf(user), 1)
        }
      }
      this.dataSource = new MatTableDataSource<User[]>(res)
    })
  
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
    })
  }
  

  applyItemFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.itemsSource.filter = filterValue.trim().toLowerCase();
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  deleteUser(user: User){
    this.auth.deleteUser(user).then()
  }

}
