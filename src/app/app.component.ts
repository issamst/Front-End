import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { TitleServiceService } from './services/title-service.service';
import { response } from 'express';
import { Title } from './models/Title.model';

@Component({
  
  selector: 'app-root',
 
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{

  constructor(private translateService:TranslateService){
    this.translateService.setDefaultLang('en');
    this.translateService.use(localStorage.getItem('lang') || 'en')
    
  }
  title = 'Angular_Good_Idea';
  

  ngOnInit(): void {
    
  }


  

  




}
