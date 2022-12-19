import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { debounceTime, map, Observable, of, startWith, switchMap, take, tap, windowWhen } from 'rxjs';
import { ItemModel, ItemsService } from '../services/items.service';
import { AuthService } from '../authentification/auth.service';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  items: ItemModel[]= []
  addoredit: FormGroup = new FormGroup({})
  toggle: boolean = false
  itemId?: string
  searchForm: FormControl = new FormControl()
constructor(private auth: AuthService, private itemsService: ItemsService){}
 
  ngOnInit(): void {
    this.itemsService.getItems().pipe(map((res: any) => {
      const products = []
      for(const key in res){
        if(res.hasOwnProperty(key)){
          products.push({...res[key], id: key})
        }
      }
      return products
    })).subscribe((res)=> {
this.items = res;
    })
    this.addoredit = new FormGroup({
      'name': new FormControl(null, Validators.required),
      'director': new FormControl(null, Validators.required),
      'year': new FormControl(null, Validators.required),
      'runtime': new FormControl(null, Validators.required),
      'photo': new FormControl(null, Validators.required),
      'trailer': new FormControl(null, Validators.required),
      'description': new FormControl(null, Validators.required),
      'getCategories': new FormArray([], [Validators.required, Validators.maxLength(3)])
    })
  }

  getCategories(): FormArray {
    return this.addoredit.get('getCategories') as FormArray
  }

  onCategories() {
    const control = new FormControl('', Validators.required);
    (<FormArray>this.addoredit.get('getCategories')).push(control)
  }

logout(): void{
  this.auth.signOut()
}

filteredMovies: Observable<ItemModel[]> = this.searchForm?.valueChanges.pipe(startWith(''),debounceTime(200),
    switchMap(searchValue => {
      return of(this.items).
        pipe(map(movies => {
          return movies.filter(movies => movies.name.toLowerCase().includes(searchValue))
        }))
    }))

addNewItem(){
  let newMovie: ItemModel = {
    name: this.addoredit.get('name')?.value, 
    runTime: this.addoredit.get('runtime')?.value,
    comments: [], 
    description: this.addoredit.get('description')?.value, 
    director: this.addoredit.get('director')?.value, 
    photo: this.addoredit.get('photo')?.value, 
    rating: 0, 
    trailer: this.addoredit.get('trailer')?.value,
    category: this.addoredit.get('getCategories')?.value,
    year: this.addoredit.get('year')?.value
  }
 
  this.itemsService.createItem(newMovie).subscribe(()=>{
this.filteredMovies = this.filteredMovies.pipe(tap(result =>{
  result.push(newMovie)
}
  ))
  })




  
  // this.items.push(newMovie)
  this.itemsService.getItems().pipe(map((res: any) => {
    const products = []
    for(const key in res){
      if(res.hasOwnProperty(key)){
        products.push({...res[key], id: key})
      }
    }
    return products
  })).subscribe((res)=> {
this.items = res;
  })
  this.addoredit.reset()
}

itemToEdit(item: ItemModel){
  this.addoredit.get('name')?.setValue(item.name)
  this.addoredit.get('director')?.setValue(item.director)
  this.addoredit.get('year')?.setValue(item.year)
  this.addoredit.get('runtime')?.setValue(item.runTime)
  this.addoredit.get('photo')?.setValue(item.photo)
  this.addoredit.get('description')?.setValue(item.description)
  this.addoredit.get('trailer')?.setValue(item.trailer)
  for(let category of item.category){
    const control = new FormControl(category,[Validators.required, Validators.maxLength(3)]);
    (<FormArray>this.addoredit.get('getCategories')).push(control)
  }
  this.itemId = item.id
}

editItem(){
  let newMovie: ItemModel = {
    name: this.addoredit.get('name')?.value, 
    runTime: this.addoredit.get('runtime')?.value,
    comments: [], 
    description: this.addoredit.get('description')?.value, 
    director: this.addoredit.get('director')?.value, 
    photo: this.addoredit.get('photo')?.value, 
    rating: 0, 
    trailer: this.addoredit.get('trailer')?.value,
    category: this.addoredit.get('getCategories')?.value,
    year: this.addoredit.get('year')?.value,
    id: this.itemId
  }
  this.itemsService.editItem(newMovie).subscribe()
}

deleteItem(item: ItemModel){
  if(window.confirm("Are you sure you want to delete this movie?")){
    this.itemsService.delete(item).subscribe()
  }

}

getItem(item: ItemModel){
  this.itemsService.getItem(item).subscribe(res => 
    console.log(res))
}
}


