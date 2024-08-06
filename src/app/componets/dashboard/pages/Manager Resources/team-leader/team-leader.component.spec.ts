import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TeamLeaderComponent } from './team-leader.component';

describe('TeamLeaderComponent', () => {
  let component: TeamLeaderComponent;
  let fixture: ComponentFixture<TeamLeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TeamLeaderComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TeamLeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
