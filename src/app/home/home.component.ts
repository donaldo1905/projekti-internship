import { Component, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { map } from 'rxjs';
import { ItemModel, ItemsService } from '../items.service';
import { AuthService } from '../login-form/auth.service';



@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  items: ItemModel[]= []
  addoredit: FormGroup = new FormGroup({})
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
this.items = res
console.log(this.items)
    })
    this.addoredit = new FormGroup({
      'name': new FormControl(null, Validators.required),
      'director': new FormControl(null, Validators.required),
      'year': new FormControl(null, Validators.required),
      'runtime': new FormControl(null, Validators.required),
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

addItem(){
  let item: ItemModel = {name: 'Interstellar', runTime: 139, category: ['Adventure','Sci-Fi'], rating: 8.6, comments: ['This is a comment'], description: 'This is a description', director: 'Christopher Nolan', photo: 'https://m.media-amazon.com/images/M/MV5BZjdkOTU3MDktN2IxOS00OGEyLWFmMjktY2FiMmZkNWIyODZiXkEyXkFqcGdeQXVyMTMxODk2OTU@._V1_.jpg', trailer: '', year: 2018}
  this.itemsService.createItem(item).subscribe()
}

}


