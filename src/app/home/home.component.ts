import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { debounceTime, distinctUntilChanged, map, Observable, of, startWith, switchMap } from 'rxjs';
import { ItemsService } from '../services/items.service';
import { AuthService } from '../authentication/auth.service';
import { ItemModel } from '../interfaces/interfaces';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  items: ItemModel[] = []
  searchForm: FormControl = new FormControl()
  categories: FormControl = new FormControl()
  startYear: FormControl = new FormControl(1970)
  endYear: FormControl = new FormControl(2022)
  startTime: FormControl = new FormControl(100)
  endTime: FormControl = new FormControl(300)
  categoriesOptions: string[] = ['Action', 'Comedy', 'Drama', 'Crime', 'Fantasy', 'Adventure', 'Sci-Fi', 'Horror', 'Thriller', 'Historic', 'Epic'];
  filterbytime: FormGroup = new FormGroup({})
  activeUser: any;
  savedMovies: string[] = [];
  constructor(private authService: AuthService, private itemsService: ItemsService) { }

  ngOnInit(): void {
    this.getAllItems()
    this.getAvtiveUser()
  }

  getAvtiveUser(){
    this.authService.getUser(localStorage.getItem('id')!).get().subscribe(user => {
      this.activeUser = user.data()
      for(let movie of this.activeUser.savedMovies){
        this.savedMovies.push(movie.id)   
      }
    })
  }

  getAllItems(){
    this.itemsService.getItems().pipe(map((res: any) => {
      const products = []
      for (const key in res) {
        if (res.hasOwnProperty(key)) {
          products.push({ ...res[key], id: key })
        }
      }
      return products
    })).subscribe((res) => {
      this.items = res;
    })
  }

  logout(): void {
    this.authService.signOut()
  }

  filteredMovies: Observable<ItemModel[]> = this.searchForm?.valueChanges.pipe(startWith(''), debounceTime(200),
    switchMap(searchValue => {
      return of(this.items).
        pipe(map(movies => {
          return movies.filter(movies => movies.name.toLowerCase().includes(searchValue))
        }))
    }))

  filteredByStartYear: Observable<ItemModel[]> = this.startYear?.valueChanges.pipe(distinctUntilChanged(), startWith(1970), debounceTime(100),
    switchMap(searchValue => {
      return this.filteredMovies.
        pipe(map(movies => {
          return movies.filter(movies =>
            movies.year >= searchValue
          )
        }))

    }))

  filteredByEndYear: Observable<ItemModel[]> = this.endYear?.valueChanges.pipe(distinctUntilChanged(), startWith(2022), debounceTime(100),
    switchMap(searchValue => {
      return this.filteredByStartYear.
        pipe(map(movies => {
          return movies.filter(movies => movies.year <= searchValue && movies.year >= this.startYear?.value)
        }))
    }))

  filteredByStartTime: Observable<ItemModel[]> = this.startTime?.valueChanges.pipe(distinctUntilChanged(), startWith(100), debounceTime(100),
    switchMap(searchValue => {
      return this.filteredByEndYear.
        pipe(map(movies => {
          return movies.filter(movies => movies.runTime >= searchValue && movies.runTime <= this.endTime?.value && movies.year <= this.endYear.value && movies.year >= this.startYear?.value)
        }))
    }))

  filteredByEndTime: Observable<ItemModel[]> = this.endTime?.valueChanges.pipe(distinctUntilChanged(), startWith(300), debounceTime(100),
    switchMap(searchValue => {
      return this.filteredByStartTime.
        pipe(map(movies => {
          return movies.filter(movies => movies.runTime <= searchValue && movies.runTime >= this.startTime?.value && movies.year <= this.endYear.value && movies.year >= this.startYear?.value)
        }))
    }))

  finalFilter: Observable<ItemModel[]> = this.categories?.valueChanges.pipe(distinctUntilChanged(), startWith(''), debounceTime(100),
    switchMap(searchValue => {
      if (searchValue) {
        return this.filteredByEndTime.
          pipe(map(movies => {
            return movies.filter(movies => movies.category.includes(searchValue) && movies.runTime <= this.endTime.value && movies.runTime >= this.startTime?.value && movies.year <= this.endYear.value && movies.year >= this.startYear?.value)
          }))
      }
      return this.filteredByEndTime.pipe(map(movies => { return movies }))
    }))

  addToSavedList(item: ItemModel) {
      if (!this.activeUser?.savedMovies) {
        this.authService.getUser(localStorage.getItem('id')!).update({ savedMovies: [item] })
      }
      else {
        let check = false
        for (let movie of this.activeUser!.savedMovies) {
          if (item.id === movie.id) {
            check = true
          }
        }
        if (!check) {
          this.activeUser.savedMovies.push(item)
          this.authService.getUser(localStorage.getItem('id')!).update({ savedMovies: this.activeUser!.savedMovies })
        }

      }
    this.savedMovies.push(item.id!)
  }
  
  remove(item: ItemModel){
       for(let i = 0; i< this.activeUser.savedMovies.length; i++){
        if(this.activeUser.savedMovies[i].id === item.id){
          this.activeUser.savedMovies.splice(i, 1)
          this.authService.getUser(localStorage.getItem('id')!).update({ savedMovies: this.activeUser.savedMovies })
          this.savedMovies.splice(i,1)
        }
       }
  }
}