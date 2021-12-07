import {Component, OnInit, ViewChild} from '@angular/core';
import {Category} from '../../model/category';
import {FormControl, FormGroup} from '@angular/forms';
import {CategoryService} from '../../service/category/category.service';
import {ActivatedRoute, ParamMap, Router} from '@angular/router';
import {Subscription} from 'rxjs';
import {AuthenticationService} from '../../service/auth/authentication.service';
import {UserToken} from '../../model/user-token';
import {House} from '../../model/house';
import {QuickviewComponent} from '../homepage/quickview/quickview.component';
import { environment } from 'src/environments/environment';
import { DocumentService } from 'src/app/service/document/document.service';

declare var $: any;

@Component({
  selector: 'app-category-detail',
  templateUrl: './category-detail.component.html',
  styleUrls: ['./category-detail.component.scss']
})
export class CategoryDetailComponent implements OnInit {
  // @ts-ignore
  @ViewChild(QuickviewComponent) view!: QuickviewComponent;
  listCategory: any[] = [];
  searchForm: FormGroup = new FormGroup({
    name: new FormControl('')
  });
  fileUrl = environment.apiUrl;
  currentCategory: Category;
  listHouse: any[] = [];
  listHouseSaleOff: any[] = [];
  sub: Subscription;
  currentUser: UserToken;
  listHouseLatest: House[] = [];
  isSelected = true;
  page = 1;
  pageDocument = 1;
  pageSize = 10;
  pageSizeDocument = 10;

  constructor(private categoryService: CategoryService,
              private documentService: DocumentService,
              private activatedRoute: ActivatedRoute,
              private authenticationService: AuthenticationService,
              private router: Router) {
    this.sub = this.activatedRoute.paramMap.subscribe(async (paramMap: ParamMap) => {
      const id = +paramMap.get('id');
      this.listCategory = await this.getCategory(id);
      // this.listHouse = await this.getAllHousetByCategory(this.currentCategory);
    });
    this.authenticationService.currentUser.subscribe(value => {
      this.currentUser = value;
    });
  }
  getDocumentByCategory(id:any){
      this.documentService.findCategories(id).subscribe(res => {
        this.listHouseSaleOff = res;
      });
  }
  viewDetail(id:any){
    this.router.navigateByUrl("/document/" + id);
  }
  ngOnInit() {
    $(document).ready(function() {
      $('.latest-product__slider').owlCarousel({
        loop: true,
        margin: 0,
        items: 1,
        dots: false,
        nav: true,
        navText: ['<span class=\'fa fa-angle-left\'><span/>', '<span class=\'fa fa-angle-right\'><span/>'],
        smartSpeed: 1200,
        autoHeight: false,
        autoplay: true
      });
      $('.hero__categories__all').on('click', function() {
        $('.hero__categories ul').slideToggle(400);
      });
      var rangeSlider = $('.price-range'),
        minamount = $('#minamount'),
        maxamount = $('#maxamount'),
        minPrice = rangeSlider.data('min'),
        maxPrice = rangeSlider.data('max');
      rangeSlider.slider({
        range: true,
        min: minPrice,
        max: maxPrice,
        values: [minPrice, maxPrice],
        slide: function(event, ui) {
          minamount.val('$' + ui.values[0]);
          maxamount.val('$' + ui.values[1]);
        }
      });
      minamount.val('$' + rangeSlider.slider('values', 0));
      maxamount.val('$' + rangeSlider.slider('values', 1));
    });
    // this.getAllCategories();
  }

  initModal(model: any): void {
    this.view.view(model);
  }

  // getAllCategories() {
  //   this.categoryService.getAllCategoryStatusTrue().subscribe(listCategory => {
  //     this.listCategory = listCategory;
  //   });
  // }

  // getAllHousetByCategory(category: Category) {
  //   return this.categoryService.getHouseByCategory(category.id).toPromise();
  // }

  getCategory(id: number) {
    return this.categoryService.getCategoryByTopicId(id).toPromise();
  }

  search() {
    const address = this.searchForm.value.name;
    this.router.navigate(['../houses'], {queryParams: {address: address}});
  }

  changeStatus(event: any) {

    // tslint:disable-next-line: radix
    switch (parseInt(event)) {
      case -1:
        break;
      case 1:
        break;
      case 0:
        break;
      default:
        break;
    }
  }
}
