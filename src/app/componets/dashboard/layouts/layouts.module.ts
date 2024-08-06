import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LayoutsComponent } from './layouts.component';
import { HeaderComponent } from './header/header.component';
import { BodyComponent } from './body/body.component';
import { SidenavComponent } from './sidenav/sidenav.component';
import { AppRoutingModule } from '../../../app-routing.module';
import { CdkMenuModule } from '@angular/cdk/menu';
import { SublevelMenuComponent } from './sidenav/sublevel-menu.component';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    LayoutsComponent,
    HeaderComponent,
    BodyComponent,
    SidenavComponent,
    SublevelMenuComponent,
    
  ],
  imports: [
    CommonModule,
    AppRoutingModule,
    CdkMenuModule,
    TranslateModule,
    RouterModule,
    
  ],
})
export class LayoutsModule {}
