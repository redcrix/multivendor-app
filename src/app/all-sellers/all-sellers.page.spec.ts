import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { IonicModule } from "@ionic/angular";

import { AllSellersPage } from "./all-sellers.page";

describe("AllSellersPage", () => {
  let component: AllSellersPage;
  let fixture: ComponentFixture<AllSellersPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AllSellersPage],
      imports: [IonicModule.forRoot()],
    }).compileComponents();

    fixture = TestBed.createComponent(AllSellersPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
