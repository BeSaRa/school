import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FaceRepoComponent } from './face-repo.component';

describe('FaceRepoComponent', () => {
  let component: FaceRepoComponent;
  let fixture: ComponentFixture<FaceRepoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FaceRepoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FaceRepoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
