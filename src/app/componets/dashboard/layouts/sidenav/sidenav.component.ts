import { Component,Input, Output, EventEmitter, OnInit, HostListener, PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { navbarData } from './nav-data';
import { animate, transition, trigger, style, keyframes } from '@angular/animations';
import { INavbarData, fadeInOut} from './helper';
import { ApiService } from '../../../../services/api.service';
import { AuthService } from '../../../../services/auth.service';
import { UserStoreService } from '../../../../services/user-store.service';
import { Router } from '@angular/router';
interface SideNavToggle {
  screenWith: number;
  collapsed: boolean;
}

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss'],
  animations: [
    fadeInOut,
    trigger('rotate', [transition(':enter', [
      animate('1000ms',
        keyframes([
          style({ transform: 'rotate(0deg)', offset: '0' }), style({ transform: 'rotate(2turn)', offset: '1' }),
        ]))
    ])])
  ]
})
export class SidenavComponent implements OnInit {

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private api: ApiService,
    private auth: AuthService,
    private userStore: UserStoreService,
    private router: Router

) {
   
  }
  
  


  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    if (isPlatformBrowser(this.platformId)) {
      this.screenWith = window.innerWidth;
      if (this.screenWith <= 768) {
        this.collapsed = false;
        this.onToggleSideNav.emit({ collapsed: this.collapsed, screenWith: this.screenWith });
      }
    }
  }

  

  @Output() onToggleSideNav: EventEmitter<SideNavToggle> = new EventEmitter();
  collapsed = false;
  navData = navbarData;
  screenWith = 0;
  public role!: string;
  multiple:boolean=false;
  @Input() roles: string = '';
  backgroundColor!: string;
  updateBackgroundColor() {
    if (this.roles === 'Operator') {
      this.backgroundColor = '#E98300';
    } else {
      this.backgroundColor = '#263238';
    }
  }
  ngOnInit(): void {


    this.userStore.getTeidFromStore().subscribe((val) => {
      const roleFromToken = this.auth.getRoleFromToken();
      this.roles = val || roleFromToken;
      this.updateBackgroundColor();
    });

    if (isPlatformBrowser(this.platformId)) {
      this.screenWith = window.innerWidth;
    };
    this.userStore.getRoleFromStore().subscribe((val) => {
      this.role = val ;
      
      this.navData = navbarData.filter(
        (item: INavbarData) => {
        if (item.role ) {
           return item.role.split(',').includes(this.role) ;
         }
        return false; 
        });

    });
    
  }
  toggleCollapse(): void {
    this.collapsed = !this.collapsed;
    this.onToggleSideNav.emit({ collapsed: this.collapsed, screenWith: this.screenWith });
  }

  closeSidenav(): void {
    this.collapsed = false;
    this.onToggleSideNav.emit({ collapsed: this.collapsed, screenWith: this.screenWith });
  }

  handleClick(item:INavbarData):void{
 
    if(!this.multiple){
      for(let modelItem of this.navData){
        if(item !== modelItem && modelItem.expanded){
          modelItem.expanded = false;
        }
      }
    }
    item.expanded=!item.expanded;
  }
}