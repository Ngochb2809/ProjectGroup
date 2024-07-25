import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmptComponentsComponent } from './empt-components.component';

describe('EmptComponentsComponent', () => {
  let component: EmptComponentsComponent;
  let fixture: ComponentFixture<EmptComponentsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EmptComponentsComponent]
    });
    fixture = TestBed.createComponent(EmptComponentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
