import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { IonicModule } from "@ionic/angular";

import { Myenquiries } from "./my-enquiries.page";

describe("Myenquiries", () => {
  let component: Myenquiries;
  let fixture: ComponentFixture<Myenquiries>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [Myenquiries],
      imports: [IonicModule.forRoot()],
    }).compileComponents();

    fixture = TestBed.createComponent(Myenquiries);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
