import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService, User } from '../authentification/auth.service';
import { ItemModel, ItemsService } from '../services/items.service';

@Component({
  selector: 'app-detailed-page',
  templateUrl: './detailed-page.component.html',
  styleUrls: ['./detailed-page.component.scss']
})
export class DetailedPageComponent implements OnInit {
item: ItemModel | undefined; 
trailer!: string
activeUser: any
averageRating!: number;
sum = 0;
currentRating = 0;
one = new FormControl(1)
two = new FormControl(2)
three = new FormControl(3)
four = new FormControl(4)
five = new FormControl(5)
six = new FormControl(6)
seven = new FormControl(7)
eight = new FormControl(8)
nine = new FormControl(9)
ten = new FormControl(10)
constructor(private itemsService: ItemsService, private route: ActivatedRoute, private router: Router, private auth: AuthService){}
  ngOnInit(): void {
    this.itemsService.getItem(this.route.snapshot.params['id']).subscribe(item => 
      { 
        this.trailer = item.trailer.slice(0, 24) + 'embed/' +item.trailer.slice(32)
        this.item = item
        for(let i=0; i<this.item!.rating.length; i++){
          this.sum = this.sum + this.item!.rating[i].rating
        } 
        this.averageRating = this.sum/this.item!.rating.length
        for(let i=0; i<this.item.rating.length; i++){
          if(this.item.rating[i].id === localStorage.getItem('id')){ 
            this.currentRating = this.item.rating[i].rating
          }
    }})
    this.auth.getUser().subscribe(user => this.activeUser = user)
    
  }

  
  logout(): void {
    this.auth.signOut()
  }

  ratingMethod(name: any){
    let replace = false
    this.sum = 0
 if(this.item?.rating){
  for(let i=0; i<this.item.rating.length; i++){
    if(this.item.rating[i].id === localStorage.getItem('id')){ 
      this.item.rating[i] = {id: localStorage.getItem('id')!, rating: +name.value}
      this.itemsService.rateItem(this.route.snapshot.params['id'], this.item!.rating).subscribe()
      replace = true
    }
    this.sum = this.sum + this.item!.rating[i].rating
    }
    if(!replace){
      this.item.rating.push({id: localStorage.getItem('id')!, rating: +name.value})
      this.itemsService.rateItem(this.route.snapshot.params['id'], this.item.rating).subscribe()
      this.averageRating = (this.averageRating + +name.value)/2
    }
  }else {
      this.itemsService.rateItem(this.route.snapshot.params['id'], [{id: localStorage.getItem('id')!, rating: +name.value}]).subscribe()
      this.averageRating = +name
  }
  this.averageRating = this.sum/this.item!.rating.length
  }

}
