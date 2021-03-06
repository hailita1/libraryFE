import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {AuthGuard} from '../../helper/auth-guard';
import {ChartComponent} from './chart/chart.component';


const routes: Routes = [
  {
    path: '',
    component: ChartComponent,
    canActivate: [AuthGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ChartRoutingModule { }
