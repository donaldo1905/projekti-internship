import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ItemModel, ItemsService } from '../services/items.service';

@Component({
  selector: 'app-detailed-page',
  templateUrl: './detailed-page.component.html',
  styleUrls: ['./detailed-page.component.scss']
})
export class DetailedPageComponent implements OnInit {
item: ItemModel | undefined; 
trailer!: string
constructor(private itemsService: ItemsService, private route: ActivatedRoute, private router: Router){}
  ngOnInit(): void {
    this.itemsService.getItem(this.route.snapshot.params['id']).subscribe(item => 
      { 
        this.trailer = item.trailer.slice(0, 24) + 'embed/' +item.trailer.slice(32)
        this.item = item
    })
  }

}
