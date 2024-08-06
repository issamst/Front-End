import { NgModule } from '@angular/core';
import {
  BrowserModule,
  provideClientHydration,
} from '@angular/platform-browser';

import { MatMenuModule } from '@angular/material/menu';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './componets/login/login.component';
import { SignupComponent } from './componets/signup/signup.component';
//import { Committee } from './models/committee.model';
import { CommitteesComponent } from './componets/dashboard/pages/Manager Resources/committees/committees.component';
import { TeamLeaderComponent } from './componets/dashboard/pages/Manager Resources/team-leader/team-leader.component';
import {
  HTTP_INTERCEPTORS,
  HttpClient,
  HttpClientModule,
} from '@angular/common/http';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { NgToastModule } from 'ng-angular-popup';
import { TokenInterceptor } from './interceptors/token.interceptor';
// import { FilterPipe } from './filter.pipe';
import { ResetPasswordComponent } from './componets/reset-password/reset-password.component';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { FilterPipe } from './filter.pipe';
//import { ModalModule } from 'ngx-bootstrap/modal';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { ButtonModule } from 'primeng/button';
import { FloatLabelModule } from "primeng/floatlabel";
import { InputTextModule } from "primeng/inputtext";
import { TableModule } from 'primeng/table';
import { MultiSelectModule } from 'primeng/multiselect';
import { TagModule } from 'primeng/tag';
import { CdkMenuModule } from '@angular/cdk/menu';

import { DropdownModule } from 'primeng/dropdown';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { RadioButtonModule } from 'primeng/radiobutton';
// import { sortIcon } from 'primeng/sortIcon';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { TableRowCollapseEvent, TableRowExpandEvent } from 'primeng/table';
import { RatingModule } from 'primeng/rating';
import { SidebarModule } from 'primeng/sidebar';
import { TitlesComponent } from './componets/dashboard/pages/Master Data/titles/titles.component';
import { RolesComponent } from './componets/dashboard/pages/Master Data/roles/roles.component';
import { PlantsComponent } from './componets/dashboard/pages/Master Data/plants/plants.component';
import { AreasComponent } from './componets/dashboard/pages/Master Data/areas/areas.component';
import { ProjectComponent } from './componets/dashboard/pages/Master Data/project/project.component';
import { DashboardComponent } from './componets/dashboard/dashboard.component';
import { NewPasswordComponent } from './componets/new-password/new-password.component';



export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}
@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    SignupComponent,
    DashboardComponent,
    ResetPasswordComponent,
   
    NewPasswordComponent,
    
   

  

  ],
  imports: [
    FloatLabelModule,//done
    RadioButtonModule,//done
    ButtonModule, // Import ButtonModule here
    InputTextModule,//done
    ProgressSpinnerModule,//done
    TableModule,//done
    TagModule,//done
    MultiSelectModule,//done
    DropdownModule,//done
     MatMenuModule,
     CdkMenuModule,
     ToastModule,//done
     SidebarModule,//done
     RatingModule,
    BrowserModule,
    CommonModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    RouterModule,
    ReactiveFormsModule,
    FormsModule,
    NgToastModule,
    HttpClientModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient],
      },
    }),
    // import materModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA], // Add CUSTOM_ELEMENTS_SCHEMA here

  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi: true,
    },
    HttpClient,MessageService,
    
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
