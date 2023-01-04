import { Component, OnInit } from '@angular/core';
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
constructor(private itemsService: ItemsService, private route: ActivatedRoute, private router: Router, private auth: AuthService){}
  ngOnInit(): void {
    this.itemsService.getItem(this.route.snapshot.params['id']).subscribe(item => 
      { 
        this.trailer = item.trailer.slice(0, 24) + 'embed/' +item.trailer.slice(32)
        this.item = item
    })
    this.auth.getUser().subscribe(user => this.activeUser = user)
  }

  
  logout(): void {
    this.auth.signOut()
  }

}
