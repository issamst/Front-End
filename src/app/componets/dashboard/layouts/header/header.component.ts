import { Component, OnInit, Input, HostListener, PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { languages, notification, userItems } from './header-dummy-data';
import { ApiService } from '../../../../services/api.service';
import { AuthService } from '../../../../services/auth.service';
import { UserStoreService } from '../../../../services/user-store.service';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { LanguageService } from '../../../../services/language-service.service';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  @Input() collapsed = false;
  @Input() screenWidth = 0;
  canShowSearchAsOverlay = false;
  lang = 'en'; // default language

  selectedLanguage: any;
  languages = languages;

  notifications = notification;
  userItem = userItems;
  @Input() fullName: string = '';
  isUserOverlayOpen: boolean = false;

  constructor(@Inject(PLATFORM_ID) private platformId: Object,
              private api: ApiService,
              private auth: AuthService,
              private userStore: UserStoreService,
              private translate: TranslateService,
              private router: Router,
              private languageService: LanguageService // Inject the LanguageService
  ) {
    this.translate.setDefaultLang(this.lang);
    this.translate.use(this.lang);
  }

  expand: boolean = true;
  isFullscreen: boolean = false;

  toggleFullscreen(): void {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(err => {
        console.log(`Error attempting to enable full-screen mode: ${err.message} (${err.name})`);
      });
      this.isFullscreen = true;
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
      this.isFullscreen = false;
    }
  }

  toggleDropdown1() {
    this.isUserOverlayOpen = !this.isUserOverlayOpen;
  }

  public role!: string;

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.checkCanShowSearshAsOverlay(window.innerWidth);
    }
    this.selectedLanguage = this.languages[0];
    this.userStore.getFullNameFromStore().subscribe((val) => {
      const fullNameFromToken = this.auth.getfullNameFromToken();
      this.fullName = val || fullNameFromToken;
    });
    this.userStore.getRoleFromStore().subscribe((val) => {
      const roleFromToken = this.auth.getRoleFromToken();
      this.role = val || roleFromToken;
    });
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    if (isPlatformBrowser(this.platformId)) {
      this.checkCanShowSearshAsOverlay(window.innerWidth);
    }
  }

  getHeadClass(): string {
    let styleClass = '';
    if (this.collapsed && this.screenWidth > 768) {
      styleClass = 'head-trimmed';
    } else {
      styleClass = 'head-md-screen';
    }
    return styleClass;
  }

  checkCanShowSearshAsOverlay(innerWidth: number): void {
    if (innerWidth < 845) {
      this.canShowSearchAsOverlay = true;
    } else {
      this.canShowSearchAsOverlay = false;
    }
  }

  getAvatarStyle() {
    if (!this.fullName) return {};
    const initials = this.getInitials();
    return {
      'background-color': this.getColor(initials),
    };
  }

  getAvatarImage(): string {
    if (!this.fullName) return '';
    const initials = this.getInitials();
    return `https://ui-avatars.com/api/?name=${initials}&size=32&rounded=true`;
  }

  getInitials(): string {
    if (!this.fullName) return '';
    const nameParts = this.fullName.trim().split(' ');
    return nameParts.map(part => part.charAt(0).toUpperCase()).join('');
  }

  getColor(str: string): string {
    const colors = ['#FF5733', '#3498DB', '#27AE60', '#F1C40F', '#8E44AD', '#E74C3C'];
    const charCodeSum = str.split('').reduce((sum, char) => sum + char.charCodeAt(0), 0);
    return colors[charCodeSum % colors.length];
  }

  logout() {
    Swal.fire({
      title: 'Good By ',
      text: 'Thans You For You',
      icon: 'success',
    });
    this.auth.signOut();
  }

  dropdownOpen = false;
  dropdownOpenList = false;
  langOptions = [
    { value: 'en', label: 'English' },
    { value: 'fr', label: 'French' },
    { value: 'es', label: 'Spanish' },
    { value: 'ar', label: 'Arabic' }
  ];

  getFlag(lang: string): string {
    switch(lang) {
      case 'en': return 'assets/flags/uk-flag.png';
      case 'fr': return 'assets/flags/france.png';
      case 'es': return 'assets/flags/spain.png';
      case 'ar': return 'assets/flags/maroc.jpg';
      default: return '';
    }
  }

  toggleDropdown() {
    this.dropdownOpen = !this.dropdownOpen;
  }

  toggleDropdownList(){
    this.dropdownOpenList = !this.dropdownOpenList;
  }

  toggleDropdownTraduction() {
    this.dropdownOpen = !this.dropdownOpen;
  }

  closeDropdown() {
    this.dropdownOpen = false;
  }

  getLangName(lang: string): string {
    const option = this.langOptions.find(opt => opt.value === lang);
    return option ? option.label : '';
  }

  changeLang(event: Event, lang: string) {
    event.stopPropagation();
    this.lang = lang;
    this.translate.use(lang);
    this.languageService.changeLanguage(lang); // Notify the LanguageService
    this.dropdownOpen = false;
  }
}
