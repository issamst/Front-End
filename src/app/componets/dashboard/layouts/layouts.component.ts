import { Component, OnInit } from '@angular/core';
interface SideNavToggle {
  screenWith: number;
  collapsed: boolean;
}
@Component({
  selector: 'app-layouts',
  templateUrl: './layouts.component.html',
  styleUrls: ['./layouts.component.css'],
})
export class LayoutsComponent {
  title = 'test';
  screenWith = 0;
  isSideNavCollapsed = false;
  onToggleSideNav(data: SideNavToggle): void {
    this.screenWith = data.screenWith;
    this.isSideNavCollapsed = data.collapsed;
  }
}
