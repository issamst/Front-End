import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LayoutsModule } from './layouts/layouts.module';
import { LayoutsComponent } from './layouts/layouts.component';
import { PagesModule } from './pages/pages.module';

const routes: Routes = [
  { path: '', component: LayoutsComponent, loadChildren: () => PagesModule },
];

@NgModule({
  imports: [RouterModule.forChild(routes), LayoutsModule],
  exports: [RouterModule],
})
export class DashboardRoutingModule {}
