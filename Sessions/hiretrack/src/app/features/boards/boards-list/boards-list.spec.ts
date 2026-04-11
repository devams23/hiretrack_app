import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BoardsList } from './boards-list';

describe('BoardsList', () => {
  let component: BoardsList;
  let fixture: ComponentFixture<BoardsList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BoardsList],
    }).compileComponents();

    fixture = TestBed.createComponent(BoardsList);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
