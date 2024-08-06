import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RouterModule } from '@angular/router';
import { PagesRoutingModule } from './pages-routing.module';
import { FormsModule,ReactiveFormsModule  } from '@angular/forms';

import {MatTabsModule} from '@angular/material/tabs';

import { MatDialogModule } from '@angular/material/dialog';
import { OverlayModule } from '@angular/cdk/overlay'
import { CdkMenuModule } from '@angular/cdk/menu';
// import { ProposeIdeaComponent, TruncatePipe } from './Propose Idea/propose-idea/propose-idea.component';
import { TooltipModule } from 'primeng/tooltip';
import { ProposeIdeaComponent } from './Propose Idea/propose-idea/propose-idea.component';
import { FilterPipe } from '../../../filter.pipe';
import { CharacterCountDirective } from './character-count.directive';
import { FloatLabelModule } from 'primeng/floatlabel';
import { RadioButtonModule } from 'primeng/radiobutton';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { MultiSelectModule } from 'primeng/multiselect';
import { DropdownModule } from 'primeng/dropdown';
import { MatMenuModule } from '@angular/material/menu';
import { ToastModule } from 'primeng/toast';
import { SplitterModule } from 'primeng/splitter';
import { DialogModule } from 'primeng/dialog';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { CardModule } from 'primeng/card';
import { FileUploadModule } from 'primeng/fileupload';
import { TabViewModule } from 'primeng/tabview';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { DividerModule } from 'primeng/divider';






export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}



@NgModule({
  declarations: [

    ProposeIdeaComponent,
    // TruncatePipe,

    CharacterCountDirective
   
    
   

  ],
  imports: [
    FormsModule,
    CommonModule,
    FormsModule, 
    RouterModule, 
    PagesRoutingModule,
    MatTabsModule,MatDialogModule,ReactiveFormsModule ,  OverlayModule ,CdkMenuModule,
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
     SplitterModule,

     DialogModule,InputTextareaModule,TooltipModule,CardModule,FileUploadModule,TabViewModule ,DividerModule,
     TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient],
      },
    }),
  
  ],
})
export class PagesModule {}
