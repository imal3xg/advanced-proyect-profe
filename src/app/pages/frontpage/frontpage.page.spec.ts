import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FrontpagePage } from './frontpage.page';

describe('FrontpagePage', () => {
  let component: FrontpagePage;
  let fixture: ComponentFixture<FrontpagePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(FrontpagePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
