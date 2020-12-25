import { Component, OnInit } from "@angular/core";

import {
  InAppBrowser,
  InAppBrowserOptions,
} from "@ionic-native/in-app-browser/ngx";

@Component({
  selector: "app-help",
  templateUrl: "./help.page.html",
  styleUrls: ["./help.page.scss"],
})
export class HelpPage implements OnInit {
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

  constructor(private theInAppBrowser: InAppBrowser) {}

  ngOnInit() {}

  goTo() {
    this.openWithInAppBrowser("https://opyix.com/contact");
  }
  public openWithInAppBrowser(url: string) {
    let target = "_blank";
    this.theInAppBrowser.create(url, target, this.options);
  }
}
