import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VisitorDialogComponent } from './visitor-dialog.component';

describe('VisitorDialogComponent', () => {
  let component: VisitorDialogComponent;
  let fixture: ComponentFixture<VisitorDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VisitorDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VisitorDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
