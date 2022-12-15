import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface ItemModel{
  name: string,
  runTime: number,
  category: string[],
  rating: number,
  comments: string[],
  description: string,
  director: string,
  photo: string,
  trailer: string,
  year: number
}

@Injectable({
  providedIn: 'root'
})
export class ItemsService {

  constructor(private http: HttpClient) { }

  createItem(item: ItemModel): Observable<ItemModel>{
    return this.http.post<ItemModel>("https://projekt-internship-default-rtdb.europe-west1.firebasedatabase.app/items.json",item)
  }

  getItems(): Observable<ItemModel[]>{
    return this.http.get<ItemModel[]>("https://projekt-internship-default-rtdb.europe-west1.firebasedatabase.app/items.json")
  }
}
