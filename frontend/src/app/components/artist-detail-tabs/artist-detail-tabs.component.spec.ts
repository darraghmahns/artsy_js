import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArtistDetailTabsComponent } from './artist-detail-tabs.component';

describe('ArtistDetailTabsComponent', () => {
  let component: ArtistDetailTabsComponent;
  let fixture: ComponentFixture<ArtistDetailTabsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ArtistDetailTabsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ArtistDetailTabsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
