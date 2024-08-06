import { Component, Input, OnInit } from '@angular/core';
import { INavbarData, fadeInOut } from './helper';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { ApiService } from '../../../../services/api.service';
import { AuthService } from '../../../../services/auth.service';
import { UserStoreService } from '../../../../services/user-store.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sublevel-menu',
  template: `
  <ul *ngIf="collapsed && data.items && data.items.length > 0"
    [@submenu]="expanded ? {value:'visible', params:{transitionParams:'400ms cubic-bezier(0.86,0,0.07,1)'}} : {value:'hidden', params:{transitionParams:'400ms cubic-bezier(0.86,0,0.07,1)'}}"
    class="sublevel-nav">
    <li *ngFor="let item of data.items" class="sublevel-nav-item">
        <a class="sublevel-nav-link" *ngIf="item.items && item.items.length > 0" (click)="handleClick(item)">
            <i class="sublevel-link-icon fa fa-circle"></i>
            <span class="sublevel-link-text" @fadeInOut *ngIf="collapsed">{{item.label}}</span>
            <i *ngIf="item.items && collapsed" class="menu-collapse-icon"
               [ngClass]="!item.expanded ? 'fal fa-angle-right' : 'fal fa-angle-down'"></i>
        </a>
        <a class="sublevel-nav-link" *ngIf="!item.items || (item.items && item.items.length === 0)"
           [routerLink]="[item.routeLink]"
           routerLinkActive="active-sublevel"
           [routerLinkActiveOptions]="{exact: true}">
            <i class="sublevel-link-icon fa fa-circle"></i>
            <span class="sublevel-link-text" @fadeInOut *ngIf="collapsed">{{item.label}}</span>
        </a>
        <div *ngIf="item.items && item.items.length > 0">
            <app-sublevel-menu
                [data]="item"
                [collapsed]="collapsed"
                [multiple]="multiple"
                [expanded]="item.expanded">
            </app-sublevel-menu>
        </div>
    </li>
  </ul>
  `,
  styleUrls: ['./sidenav.component.scss'],
  animations: [
    fadeInOut,
    trigger('submenu', [
      state('hidden', style({
        height: '0',
        maxHeight: '0',
        opacity: 0
      })),
      state('visible', style({
        height: '*',
        maxHeight: '1000px',
        opacity: 1
      })),
      transition('visible <=> hidden', animate('{{transitionParams}}')),
      transition('void => *', animate(0))
    ])
  ]
})
export class SublevelMenuComponent implements OnInit {
  @Input() data: INavbarData = {
    routeLink: '',
    icon: '',
    label: '',
    items: []
  }

  @Input() collapsed = false;
  @Input() animating: boolean | undefined;
  @Input() expanded: boolean | undefined;
  @Input() multiple: boolean = false;

  public role!: string;

  constructor(
    private api: ApiService,
    private auth: AuthService,
    private userStore: UserStoreService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.userStore.getRoleFromStore().subscribe((val) => {
      const roleFromToken = this.auth.getRoleFromToken();
      this.role = val || roleFromToken;
    });
  }

  handleClick(item: INavbarData): void {
    if (this.data.items && this.data.items.length > 0) {
      for (let modelItem of this.data.items) {
        if (item !== modelItem && modelItem.expanded) {
          modelItem.expanded = false;
        }
      }
    }
    item.expanded = !item.expanded;
  }
}
