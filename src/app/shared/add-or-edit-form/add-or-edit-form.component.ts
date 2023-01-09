import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { map } from 'rxjs';
import { AuthService, User } from 'src/app/authentification/auth.service';
import { ItemModel, ItemsService } from 'src/app/services/items.service';

@Component({
  selector: 'app-add-or-edit-form',
  templateUrl: './add-or-edit-form.component.html',
  styleUrls: ['./add-or-edit-form.component.scss']
})
export class AddOrEditFormComponent implements OnInit {
  toppingList: string[] = ['Action', 'Comedy', 'Drama', 'Crime', 'Fantasy', 'Adventure', 'Sci-Fi', 'Horror', 'Thriller', 'Historic', 'Epic'];
  addoredit: FormGroup = new FormGroup({})
  id = this.route.snapshot.params['id']
  activeItem!: ItemModel

  constructor(private itemsService: ItemsService, private route: ActivatedRoute, private router: Router, private auth: AuthService, private fireStore: AngularFirestore){}
  ngOnInit(): void {
    this.addoredit = new FormGroup({
      'name': new FormControl(null, Validators.required),
      'director': new FormControl(null, Validators.required),
      'year': new FormControl(null, Validators.required),
      'runtime': new FormControl(null, Validators.required),
      'photo': new FormControl(null, Validators.required),
      'trailer': new FormControl(null, Validators.required),
      'description': new FormControl(null, Validators.required),
      'categories': new FormControl(null, Validators.required)
    })
    if(this.route.snapshot.params['id'] !== 'add'){
      this.itemsService.getItem(this.route.snapshot.params['id']).subscribe( res => {
        this.activeItem = res
        this.addoredit.get('name')?.setValue(res.name)
        this.addoredit.get('director')?.setValue(res.director)
        this.addoredit.get('year')?.setValue(res.year)
        this.addoredit.get('runtime')?.setValue(res.runTime)
        this.addoredit.get('photo')?.setValue(res.photo)
        this.addoredit.get('trailer')?.setValue(res.trailer)
        this.addoredit.get('description')?.setValue(res.description)
        this.addoredit.get('categories')?.setValue(res.category)
      }
      )
    }
  }

  editItem(){
    let edittedMovie: ItemModel = {
      name: this.addoredit.get('name')?.value, 
      runTime: this.addoredit.get('runtime')?.value,
      comments: this.activeItem.comments,
      description: this.addoredit.get('description')?.value, 
      director: this.addoredit.get('director')?.value, 
      photo: this.addoredit.get('photo')?.value, 
      rating: this.activeItem.rating,  
      id: this.route.snapshot.params['id'],
      trailer: this.addoredit.get('trailer')?.value,
      category: this.addoredit.get('categories')?.value,
      year: this.addoredit.get('year')?.value
    }
    this.fireStore.collection('users').get().pipe(map((res: any) => {
        const tempDoc: any[] = []
        res.forEach((doc: any) => {
           tempDoc.push({ id: doc.id, ...doc.data() })
        })
        return tempDoc
    })).subscribe( res => {
        for(let user of res){ 
          console.log(user.uid)
          for(let i=0; i<user.savedMovies.length; i++){
            if(user.savedMovies[i].id === this.route.snapshot.params['id']){

              let array1 = user.savedMovies.splice(0, i)
            let array2 = user.savedMovies.splice(i+1, user.savedMovies.length)
              this.fireStore.collection('users').doc(user.uid).update({ savedMovies: [array1.concat(array2), edittedMovie] })
            }
          }
        }
    })
    this.itemsService.editItem(this.route.snapshot.params['id'], edittedMovie).subscribe()
    this.router.navigate(['/admin'])
  }

  addNewItem(){
    let newMovie: ItemModel = {
      name: this.addoredit.get('name')?.value, 
      runTime: this.addoredit.get('runtime')?.value,
      comments: [], 
      description: this.addoredit.get('description')?.value, 
      director: this.addoredit.get('director')?.value, 
      photo: this.addoredit.get('photo')?.value, 
      rating: [], 
      trailer: this.addoredit.get('trailer')?.value,
      category: this.addoredit.get('categories')?.value,
      year: this.addoredit.get('year')?.value
    }
    this.itemsService.createItem(newMovie).subscribe( res => {
        console.log(res)
        newMovie.id = res.name
        this.itemsService.itemToAdd?.next(newMovie)
      }
    )
    this.router.navigate(['/admin'])
    }
}
