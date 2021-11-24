import {Component, OnInit, ViewChild} from '@angular/core';
import {UserToken} from '../../../model/user-token';
import {AuthenticationService} from '../../../service/auth/authentication.service';
import {House} from '../../../model/house';

import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {ItemProductComponent} from '../item-product/item-product.component';
import { DocumentService } from 'src/app/service/document/document.service';

declare var $: any;
declare var Swal: any;

@Component({
  selector: 'app-list-product',
  templateUrl: './list-product.component.html',
  styleUrls: ['./list-product.component.css']
})
export class ListProductComponent implements OnInit {
  // @ts-ignore
  @ViewChild(ItemProductComponent) view!: ItemProductComponent;
  listHouse: any[];
  currentUser: UserToken;
  hasRoleUser = false;
  hasRoleAdmin = false;
  isDelete = true;
  id: number;
  listFilterResult: any[] = [];
  listDelete: number[] = [];
  isSelected = true;

  constructor(private modalService: NgbModal,
              private authenticationService: AuthenticationService, private service: DocumentService) {
    this.authenticationService.currentUser.subscribe(value => this.currentUser = value);
    if (this.currentUser) {
      const roleList = this.currentUser.roles;
      for (const role of roleList) {
        if (role.authority === 'ROLE_USER') {
          this.hasRoleUser = true;
        }
        if (role.authority === 'ROLE_ADMIN') {
          this.hasRoleAdmin = true;
        }
      }
    }
  }


  ngOnInit() {
    this.getAllCategory();
  }

  getHouseId(id: number) {
    this.id = id;
  }

  initModal(model: any, type = null): void {
    this.view.view(model, type);
  }

  checkAllCheckBox(ev) {
    this.listHouse.forEach((x) => (x.checked = ev.target.checked));
    this.changeModel();
  }

  changeModel() {
    const selectedHouse = [...this.listHouse]
      .filter((house) => house.checked)
      .map((p) => p.id);
    if (selectedHouse.length > 0) {
      this.isDelete = false;
    } else {
      this.isDelete = true;
    }
  }
  deleteCategory() {
    this.service.delete(this.id).subscribe(() => {
      this.service.getAll().subscribe(listHouse => {
        this.listHouse = listHouse;
      });
      // tslint:disable-next-line:only-arrow-functions
      $(function() {
        $('#modal-delete').modal('hide');
      });
      // tslint:disable-next-line:only-arrow-functions
      $(function() {
        const Toast = Swal.mixin({
          toast: true,
          position: 'top-end',
          showConfirmButton: false,
          timer: 3000
        });

        Toast.fire({
          type: 'success',
          title: 'Xóa thành công'
        });
      });
    }, () => {
      // tslint:disable-next-line:only-arrow-functions
      $(function() {
        const Toast = Swal.mixin({
          toast: true,
          position: 'top-end',
          showConfirmButton: false,
          timer: 3000
        });

        Toast.fire({
          type: 'error',
          title: 'Xóa thất bại'
        });
      });
    });
  }

  getAllCategory() {
    this.service.getAll().subscribe(listHouse => {
      this.listHouse = listHouse;
      this.listFilterResult = this.listHouse;
      // tslint:disable-next-line:only-arrow-functions
      $(function() {
        $('#table-category').DataTable({
          paging: true,
          lengthChange: true,
          retrieve: true,
          searching: true,
          ordering: false,
          info: false,
          autoWidth: false
        });
      });
    });
  }

  deletelistHouse() {
    // tslint:disable-next-line:prefer-for-of
    for (let i = 0; i < this.listHouse.length; i++) {
      if (this.listHouse[i].checked === true) {
        this.listDelete.push(this.listHouse[i].id);
      }
    }
    this.service.deleteList(this.listDelete).subscribe(res => {
        this.getAllCategory();
        // tslint:disable-next-line:only-arrow-functions
        $(function() {
          $('#modal-delete-list').modal('hide');
        });
        // tslint:disable-next-line:only-arrow-functions
        $(function() {
          const Toast = Swal.mixin({
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 3000
          });

          Toast.fire({
            type: 'success',
            title: 'Xóa thành công'
          });
        });
        this.listDelete = [];
        this.isDelete = true;
      },
      err => {
        // tslint:disable-next-line:only-arrow-functions
        $(function() {
          const Toast = Swal.mixin({
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 3000
          });

          Toast.fire({
            type: 'error',
            title: 'Xóa thất bại'
          });
        });
      });
    this.getAllCategory();
  }
  changeStatus(event: any) {
    let list = [];
    // tslint:disable-next-line: radix
    switch (parseInt(event)) {
      case -1:
        this.listHouse = [...this.listFilterResult];
        break;
      case 1:
        list = [...this.listFilterResult];
        this.listHouse = list.filter(item => item.status === true);
        break;
      case 0:
        list = [...this.listFilterResult];
        this.listHouse = list.filter(item => item.status === false);
        break;
      default:
        break;
    }
  }
}
