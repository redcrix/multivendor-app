import { NgModule, ModuleWithProviders } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { RouteReuseStrategy } from "@angular/router";

import { IonicModule, IonicRouteStrategy } from "@ionic/angular";
import { SplashScreen } from "@ionic-native/splash-screen/ngx";
import { StatusBar } from "@ionic-native/status-bar/ngx";
import { OneSignal } from "@ionic-native/onesignal/ngx";
import { NativeStorage } from "@ionic-native/native-storage/ngx";
//import { ScrollingModule } from '@angular/cdk/scrolling/ngx';
//import { DragDropModule } from '@angular/cdk/drag-drop/ngx';
import { InAppBrowser } from "@ionic-native/in-app-browser/ngx";
import { SocialSharing } from "@ionic-native/social-sharing/ngx";
import { AppRate } from "@ionic-native/app-rate/ngx";
import { AppMinimize } from "@ionic-native/app-minimize/ngx";
import { EmailComposer } from "@ionic-native/email-composer/ngx";
//import { CardIO } from '@ionic-native/card-io/ngx';

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";

import { FormsModule, FormBuilder } from "@angular/forms";
import { ReactiveFormsModule } from "@angular/forms";
import { HttpClientModule, HttpClient } from "@angular/common/http";

import { KeysPipeModule } from "../app/pipes/pipe.module";
import { HttpModule } from "@angular/http";
import { TranslateModule, TranslateLoader } from "@ngx-translate/core";
import { TranslateHttpLoader } from "@ngx-translate/http-loader";
//import { Braintree } from '@ionic-native/braintree/ngx';
import { HomePage } from "./home/home.page";
import { HTTP } from "@ionic-native/http/ngx";

//Uncomment when you use Google Login
import { GooglePlus } from "@ionic-native/google-plus/ngx";
import { Facebook } from "@ionic-native/facebook/ngx";

//vendor
import { ImagePicker } from "@ionic-native/image-picker/ngx";
import { Crop } from "@ionic-native/crop/ngx";
import {
  FileTransfer,
  FileUploadOptions,
  FileTransferObject,
} from "@ionic-native/file-transfer/ngx";

//pages
import { FilterPage } from "../app/filter/filter.page";
import { OrderSummaryPage } from "./checkout/order-summary/order-summary.page";
// import { CountdownTimerModule } from "angular-countdown-timer";
import { CountdownModule } from "ngx-countdown";

// import { CountdownTimerModule } from "ngx-countdown-time";
// import { BsDropdownModule } from "./cus.module";

import { IonicRatingModule } from "ionic4-rating";
// import { CountdownTimerModule } from "ngx-countdown-timer";

// import { CountdownModule } from "ng2-date-countdown";

// import { CountdownModule } from "ng2-date-countdown";
// import { CountdownTimerModule } from 'ngx-countdown-timer';

// import { CountdownModule } from 'ngx-countdown';
// import { CountDown } from "../../node_modules/angular2-simple-countdown/countdown";

export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, "./assets/i18n/", ".json");
}

@NgModule({
  declarations: [
    AppComponent,
    FilterPage,
    OrderSummaryPage,
    //HomePage
    // CountdownTimerModule,
    // CountDown,
  ],
  entryComponents: [
    FilterPage,
    OrderSummaryPage,
    //HomePage
  ],
  imports: [
    BrowserModule,
    IonicRatingModule,
    FormsModule,
    CountdownModule,
    HttpClientModule,
    KeysPipeModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    // CountdownModule,
    // BsDropdownModule.forRoot(),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: createTranslateLoader,
        deps: [HttpClient],
      },
    }),
  ],

  providers: [
    StatusBar,
    SplashScreen,
    HomePage,
    //Braintree,
    GooglePlus,
    Facebook,
    OneSignal,
    NativeStorage,
    InAppBrowser,
    FormBuilder,
    //CardIO,
    ReactiveFormsModule,
    AppMinimize,
    EmailComposer,
    AppRate,
    ImagePicker,
    Crop,
    FileTransfer,
    SocialSharing,
    HTTP,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    // CountdownTimerModule,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
