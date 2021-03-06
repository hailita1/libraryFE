import {Component, OnInit} from '@angular/core';
import {CategoryService} from '../../service/category/category.service';
import {ActivatedRoute, Router} from '@angular/router';
import {Category} from '../../model/category';
import {FormControl, FormGroup} from '@angular/forms';
import {Item} from '../../model/item';
import {AuthenticationService} from '../../service/auth/authentication.service';
import {UserToken} from '../../model/user-token';
import {TopicService} from '../../service/topic/topic.service';
import {DocumentService} from '../../service/document/document.service';

declare var $: any;

@Component({
  selector: 'app-favorite',
  templateUrl: './favorite.component.html',
  styleUrls: ['./favorite.component.scss']
})
export class FavoriteComponent implements OnInit {
  listTopic: any[] = [];
  searchForm: FormGroup = new FormGroup({
    name: new FormControl('')
  });
  items: Item[] = [];
  currentUser: UserToken;

  constructor(private categoryService: CategoryService,
              private activatedRoute: ActivatedRoute,
              private authenticationService: AuthenticationService,
              private documentService: DocumentService,
              private topicService: TopicService,
              private router: Router) {
    this.authenticationService.currentUser.subscribe(value => {
      this.currentUser = value;
    });
  }

  ngOnInit() {
    this.getAllTopic();
    $(document).ready(function() {
      $('.hero__categories__all').on('click', function() {
        $('.hero__categories ul').slideToggle(400);
      });
      var proQty = $('.pro-qty');
      proQty.on('click', '.qtybtn', function() {
        var $button = $(this);
        var oldValue = $button.parent().find('input').val();
        if ($button.hasClass('inc')) {
          var newVal = parseFloat(oldValue) + 1;
        } else {
          // Don't allow decrementing below zero
          if (oldValue > 0) {
            var newVal = parseFloat(oldValue) - 1;
          } else {
            newVal = 0;
          }
        }
        $button.parent().find('input').val(newVal);
      });
    });

    this.loadFavorite();
    this.activatedRoute.params.subscribe(async params => {
      var id = params['id'];
      if (id) {
        const document = await this.getDocument(id);
        var item: Item = {
          product: document
        };
        if (localStorage.getItem('heart-' + this.currentUser.id) == null) {
          let heart: any = [];
          heart.push(JSON.stringify(item));
          localStorage.setItem('heart-' + this.currentUser.id, JSON.stringify(heart));
        } else {
          this.addProductToFavorite(id, item);
        }
        this.loadFavorite();
      } else {
        this.loadFavorite();
      }
    });
  }

  getAllTopic() {
    this.topicService.getAllTopic().subscribe(listTopic => {
      this.listTopic = listTopic;
    });
  }

  remove(id: number): void {
    let heart: any = JSON.parse(localStorage.getItem('heart-' + this.currentUser.id));
    let index: number = -1;
    for (var i = 0; i < heart.length; i++) {
      let item: Item = JSON.parse(heart[i]);
      if (item.product.id == id) {
        heart.splice(i, 1);
        break;
      }
    }
    localStorage.setItem('heart-' + this.currentUser.id, JSON.stringify(heart));
    this.loadFavorite();
  }

  addProductToFavorite(id: number, item: Item) {
    let heart: any = JSON.parse(localStorage.getItem('heart-' + this.currentUser.id));
    let index: number = -1;
    for (var i = 0; i < heart.length; i++) {
      let item: Item = JSON.parse(heart[i]);
      if (item.product.id == id) {
        index = i;
        break;
      }
    }
    if (index == -1) {
      heart.push(JSON.stringify(item));
      localStorage.setItem('heart-' + this.currentUser.id, JSON.stringify(heart));
      this.loadFavorite();
    }
  }


  loadFavorite(): void {
    this.items = [];
    let heart = JSON.parse(localStorage.getItem('heart-' + this.currentUser.id));
    if (heart != null) {
      for (var i = 0; i < heart.length; i++) {
        let item = JSON.parse(heart[i]);
        this.items.push({
          product: item.product
        });
      }
    }
  }

  search() {
    const name = this.searchForm.value.name;
    this.router.navigate(['../document'], {queryParams: {name: name}});
  }

  getDocument(id: number) {
    return this.documentService.get(id).toPromise();
  }
}
