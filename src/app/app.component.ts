import { Component } from "@angular/core";
import { Platform } from "@ionic/angular";
import { SplashScreen } from "@ionic-native/splash-screen/ngx";
import { StatusBar } from "@ionic-native/status-bar/ngx";
import { AppMinimize } from "@ionic-native/app-minimize/ngx";
import { TranslateService } from "@ngx-translate/core";
import { NativeStorage } from "@ionic-native/native-storage/ngx";
import { Config } from "./config";

declare var wkWebView: any;

@Component({
  selector: "app-root",
  templateUrl: "app.component.html",
})
export class AppComponent {
  constructor(
    private config: Config,
    private nativeStorage: NativeStorage,
    public translateService: TranslateService,
    public platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private appMinimize: AppMinimize
  ) {
    this.initializeApp();
  }
  initializeApp() {
    this.platform.ready().then(() => {
      setTimeout(() => {
        this.splashScreen.hide();
      }, 1000);

      this.statusBar.styleDefault();

      document.addEventListener("deviceready", () => {
        wkWebView.injectCookie(this.config.url + "/");
      });

      this.statusBar.backgroundColorByHexString("#ffffff");

      /* Add your translation file in src/assets/i18n/ and set your default language here */
      this.translateService.setDefaultLang("en");
      //document.documentElement.setAttribute('dir', 'rtl');

      //document.documentElement.setAttribute('dir', 'rtl');

      //this.statusBar.backgroundColorByHexString('#004a91');
      //this.statusBar.backgroundColorByHexString('#ffffff');
      //this.statusBar.styleBlackTranslucent();
      //this.statusBar.styleLightContent();

      //this.minimize();
      this.platform.backButton.subscribeWithPriority(0, () => {
        this.appMinimize.minimize();
      });
    });
  }
}
