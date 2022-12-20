import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ItemModel, ItemsService } from 'src/app/services/items.service';

@Component({
  selector: 'app-add-or-edit-form',
  templateUrl: './add-or-edit-form.component.html',
  styleUrls: ['./add-or-edit-form.component.scss']
})
export class AddOrEditFormComponent implements OnInit {
  toppingList: string[] = ['Action', 'Comedy', 'Drama', 'Crime', 'Fantasy', 'Adventure', 'Sci-Fi', 'Horror', 'Thriller', 'Historic', 'Epic'];
  addoredit: FormGroup = new FormGroup({})

  constructor(private itemsService: ItemsService){}
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
  }

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
      category: this.addoredit.get('categories')?.value,
      year: this.addoredit.get('year')?.value
    }
   
    this.itemsService.createItem(newMovie).subscribe()
    }
}
