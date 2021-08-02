import { Component } from "@angular/core";
import { NavController, Platform } from "@ionic/angular";
import { Settings } from "./../data/settings";
import { ApiService } from "./../api.service";
import { AppRate } from "@ionic-native/app-rate/ngx";
import { SocialSharing } from "@ionic-native/social-sharing/ngx";
import { EmailComposer } from "@ionic-native/email-composer/ngx";
import { Config } from "./../config";
import { StatusBar } from "@ionic-native/status-bar/ngx";

import {
  InAppBrowser,
  InAppBrowserOptions,
} from "@ionic-native/in-app-browser/ngx";
@Component({
  selector: "app-account",
  templateUrl: "account.page.html",
  styleUrls: ["account.page.scss"],
})
export class AccountPage {
  toggle: any;
  options: InAppBrowserOptions = {
    location: "yes", //Or 'no'
    hidden: "no", //Or  'yes'
    clearcache: "yes",
    clearsessioncache: "yes",
    zoom: "yes", //Android only ,shows browser zoom controls
    hardwareback: "yes",
    mediaPlaybackRequiresUserAction: "no",
    shouldPauseOnSuspend: "no", //Android only
    closebuttoncaption: "Close", //iOS only
    disallowoverscroll: "no", //iOS only
    toolbar: "yes", //iOS only
    enableViewportScale: "no", //iOS only
    allowInlineMediaPlayback: "no", //iOS only
    presentationstyle: "pagesheet", //iOS only
    fullscreen: "yes", //Windows only
  };
  constructor(
    private statusBar: StatusBar,
    private theInAppBrowser: InAppBrowser,
    private config: Config,
    public api: ApiService,
    public navCtrl: NavController,
    public settings: Settings,
    public platform: Platform,
    private appRate: AppRate,
    private emailComposer: EmailComposer,
    private socialSharing: SocialSharing
  ) {}

  goTo(path) {
    if (path === "11") {
      this.openWithInAppBrowser("https://opyix.com/become-a-vendor/");
    }
    localStorage.clear();
    if (path === "tabs/account/address/edit-address") {
      console.log("setState");
      localStorage.setItem("accountEdit", "true");
    }
    this.navCtrl.navigateForward(path);
  }
  async log_out() {
    this.settings.customer.id = undefined;
    this.settings.vendor = false;
    this.settings.wishlist = [];
    await this.api.postItem("logout").subscribe(
      (res) => {},
      (err) => {
        console.log(err);
      }
    );
    if ((<any>window).AccountKitPlugin) (<any>window).AccountKitPlugin.logout();
  }
  rateApp() {
    if (this.platform.is("cordova")) {
      this.appRate.preferences.storeAppURL = {
        ios: this.settings.settings.rate_app_ios_id,
        android: this.settings.settings.rate_app_android_id,
        windows:
          "ms-windows-store://review/?ProductId=" +
          this.settings.settings.rate_app_windows_id,
      };
      this.appRate.promptForRating(false);
    }
  }
  shareApp() {
    if (this.platform.is("cordova")) {
      var url = "";
      if (this.platform.is("android")) url = this.settings.playstorelink;
      else url = this.settings.playstorelink;
      var options = {
        message: "Opyix Shopping App",
        subject: "Download Opyix",
        files: ["", ""],
        url: url,
        chooserTitle: "Explore",
      };
      this.socialSharing.shareWithOptions(options);
    }
  }
  email(contact) {
    let email = {
      to: contact,
      attachments: [],
      subject: "",
      body: "",
      isHtml: true,
    };
    this.emailComposer.open(email);
  }
  ngOnInit() {
    // this.toggle = document.querySelector('#themeToggle');
    // this.toggle.addEventListener('ionChange', (ev) => {
    //   document.body.classList.toggle('dark', ev.detail.checked);

    //   if(ev.detail.checked) {
    //     this.statusBar.backgroundColorByHexString('#121212');
    //     this.statusBar.styleLightContent();
    //   } else {
    //     this.statusBar.backgroundColorByHexString('#ffffff');
    //     this.statusBar.styleDefault();
    //   }

    // });
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)");
    prefersDark.addListener((e) => checkToggle(e.matches));
    function loadApp() {
      checkToggle(prefersDark.matches);
    }
    function checkToggle(shouldCheck) {
      this.toggle.checked = shouldCheck;
    }
  }

  public openWithInAppBrowser(url: string) {
    let target = "_blank";
    this.theInAppBrowser.create(url, target, this.options);
  }

  chVendr() {
    console.log(JSON.stringify(this.settings.vendor));
  }
}
