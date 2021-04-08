import { Component, OnInit } from "@angular/core";
import { Settings } from "./../../../data/settings";
import {
  LoadingController,
  NavController,
  ActionSheetController,
  Platform,
} from "@ionic/angular";
import { AlertController } from "@ionic/angular";

import { ActivatedRoute, Router } from "@angular/router";
import { Vendor } from "./../../../data/vendor";
import { ImagePicker } from "@ionic-native/image-picker/ngx";
import { Crop } from "@ionic-native/crop/ngx";
import { Headers } from "@angular/http";
import {
  FileTransfer,
  FileUploadOptions,
  FileTransferObject,
} from "@ionic-native/file-transfer/ngx";
import { Config } from "./../../../config";
import { ApiService } from "../../../api.service";

@Component({
  selector: "app-photos",
  templateUrl: "./photos.page.html",
  styleUrls: ["./photos.page.scss"],
})
export class PhotosPage implements OnInit {
  uploadingImageSpinner: boolean = false;
  photos: any;
  imageresult: any;
  imageIndex: any = 0;
  res: any;
  loading: any;
  constructor(
    public platform: Platform,
    public api: ApiService,
    public actionSheetController: ActionSheetController,
    public config: Config,
    public vendor: Vendor,
    public settings: Settings,
    public loadingController: LoadingController,
    public navCtrl: NavController,
    public router: Router,
    private transfer: FileTransfer,
    private imagePicker: ImagePicker,
    private crop: Crop,
    public alertController: AlertController
  ) {}

  ngOnInit() {}

  picker() {
    let options = {
      maximumImagesCount: 1,
    };
    this.photos = new Array<string>();
    this.imagePicker.getPictures(options).then(
      (results) => {
        this.reduceImages(results).then((results) =>
          this.handleUpload(results)
        );
      },
      (err) => {
        console.log(err);
      }
    );
  }
  handleUpload(results) {
    this.upload();
  }
  reduceImages(selected_pictures: any): any {
    return selected_pictures.reduce((promise: any, item: any) => {
      return promise.then((result) => {
        return this.crop
          .crop(item, {
            quality: 75,
            targetHeight: 100,
            targetWidth: 100,
          })
          .then((cropped_image) => (this.photos = cropped_image));
      });
    }, Promise.resolve());
  }
  upload() {
    this.uploadingImageSpinner = true;
    const fileTransfer: FileTransferObject = this.transfer.create();
    var headers = new Headers();
    headers.append("Content-Type", "multipart/form-data");
    let options: FileUploadOptions = {
      fileKey: "file",
      fileName: "name.jpg",
      headers: {
        headers,
      },
    };
    fileTransfer
      .upload(
        this.photos,
        this.config.url +
          "/wp-admin/admin-ajax.php?action=mstoreapp_upload_image",
        options
      )
      .then(
        (data) => {
          this.uploadingImageSpinner = false;
          this.imageresult = JSON.parse(data.response);
          this.vendor.product.images[this.imageIndex] = {};
          this.vendor.product.images[
            this.imageIndex
          ].src = this.imageresult.url;
          this.imageIndex = this.imageIndex + 1;
          // success
        },
        (err) => {
          //this.functions.showAlert("error", err);
        }
      );
  }
  async replaceImage(index) {
    const actionSheet = await this.actionSheetController.create({
      header: "Albums",
      buttons: [
        {
          text: "Delete Image",
          role: "destructive",
          icon: "trash",
          handler: () => {
            this.vendor.product.images.splice(index, 1);
            this.imageIndex = this.imageIndex - 1;
          },
        },
        {
          text: "Edit Image",
          icon: "create",
          handler: () => {
            let options = {
              maximumImagesCount: 1,
            };
            this.photos = new Array<string>();
            this.imagePicker.getPictures(options).then(
              (results) => {
                this.reduceImages(results).then((results) =>
                  this.replaceUpload(index)
                );
              },
              (err) => {
                //this.functions.showAlert("error", err);
              }
            );
          },
        },
        {
          text: "Cancel",
          icon: "close",
          role: "cancel",
          handler: () => {
            console.log("Cancel clicked");
          },
        },
      ],
    });
    await actionSheet.present();
  }
  replaceUpload(index) {
    this.uploadingImageSpinner = true;
    const fileTransfer: FileTransferObject = this.transfer.create();
    var headers = new Headers();
    headers.append("Content-Type", "multipart/form-data");
    let options: FileUploadOptions = {
      fileKey: "file",
      fileName: "name.jpg",
      headers: {
        headers,
      },
    };
    fileTransfer
      .upload(
        this.photos,
        this.config.url +
          "/wp-admin/admin-ajax.php?action=mstoreapp_upload_image",
        options
      )
      .then(
        (data) => {
          this.uploadingImageSpinner = false;
          this.imageresult = JSON.parse(data.response);
          this.vendor.product.images[index].src = this.imageresult.url;
          // success
        },
        (err) => {
          //this.functions.showAlert("error", err);
        }
      );
  }
  publish() {
    this.vendor.product.status = "publish";

    console.log(JSON.stringify(this.vendor.product["categories"]));

    // console.log(this.vendor.product["categories"].id[0]);

    let str = JSON.stringify(this.vendor.product["categories"]);

    console.log(str);

    // String regex = "\\[|\\]";
    //  s = s.replaceAll(regex, "");
    //  System.out.println(s);

    let id__ = str.replace(/[\[\]']+/g, "");

    console.log(id__);
    console.log(id__.slice(6, 9));

    if (id__.slice(6, 9) == "133") {
      //   alert("Auction product");
      this.submitAunction();
    } else {
      this.submit();
      //   alert("Add Simple product");
    }

    //
  }
  draft() {
    this.vendor.product.status = "draft";
    this.submit();
  }
  async submit() {
    this.vendor.product.vendor = this.settings.customer.id;
    this.loading = await this.loadingController.create({
      spinner: "crescent",
      translucent: true,
      animated: true,
      backdropDismiss: true,
    });
    await this.loading.present();
    if (this.platform.is("hybrid")) {
      this.api.postItemIonic("products", this.vendor.product).then(
        (res) => {
          //DOKAN AND WCFM Plugin
          this.res = res;
          console.log(res);
          this.api
            .postItem("update-vendor-product", {
              id: this.res.id,
            })
            .subscribe(
              (res) => {
                console.log(res);
              },
              (err) => {
                console.log(err);
              }
            );
          //DOKAN AND WCFM Plugin
          this.vendor.product = {};
          this.vendor.product.categories = [];
          this.vendor.product.images = [];
          this.vendor.product.dimensions = {};
          this.loading.dismiss();
          this.navCtrl.navigateBack("tabs/account");
        },
        (err) => {
          this.loading.dismiss();
          console.log(err);
        }
      );
    } else
      this.api.wcpost("products", this.vendor.product).subscribe(
        (res) => {
          //DOKAN AND WCFM Plugin
          this.res = res;
          this.api
            .postItem("update-vendor-product", {
              id: this.res.id,
            })
            .subscribe(
              (res) => {
                console.log(res);
              },
              (err) => {
                console.log(err);
              }
            );
          //DOKAN AND WCFM Plugin
          this.vendor.product = {};
          this.vendor.product.categories = [];
          this.vendor.product.images = [];
          this.vendor.product.dimensions = {};
          this.loading.dismiss();
          this.navCtrl.navigateBack("tabs/account");
        },
        (err) => {
          this.loading.dismiss();
          console.log(err);
        }
      );
  }

  async presentAlert(m) {
    const alert = await this.alertController.create({
      cssClass: "my-custom-class",
      header: "Alert",
      message: m,
      buttons: ["OK"],
    });

    await alert.present();
  }

  async submitAunction() {
    console.log("Auctinnnn----");

    this.vendor.product.title = this.vendor.product.name;
    this.vendor.product.content = this.vendor.product.short_description;
    this.vendor.product.vendor = this.settings.customer.id;

    // this.vendor.product._yith_auction_start_price = this.vendor.product._yith_auction_start_price;
    // this.vendor.product._yith_auction_bid_increment = this.vendor.product._yith_auction_bid_increment;
    // this.vendor.product._yith_auction_minimum_increment_amount = this.vendor.product._yith_auction_minimum_increment_amount;
    // this.vendor.product._yith_auction_reserve_price = this.vendor.product._yith_auction_reserve_price;

    // this.vendor.product._yith_auction_buy_now = this.vendor.product.regular_price;
    // this.vendor.product._yith_auction_for = this.vendor.product.date_on_sale_from;
    // this.vendor.product._yith_auction_to = this.vendor.product.auction_end_date;

    this.vendor.product.start_price = this.vendor.product._yith_auction_start_price;
    this.vendor.product.bid_increment = this.vendor.product._yith_auction_bid_increment;
    this.vendor.product.minimum_increment_amount = this.vendor.product._yith_auction_minimum_increment_amount;
    this.vendor.product.reserver_price = this.vendor.product._yith_auction_reserve_price;
    this.vendor.product.start_price = this.vendor.product.regular_price;
    this.vendor.product.buy_now_price = this.vendor.product.regular_price;
    this.vendor.product.start_date = this.vendor.product.date_on_sale_from;
    this.vendor.product.end_date = this.vendor.product.auction_end_date;

    //     sku:DSDSDSD43424
    // price:120
    // start_date:1606348800
    // end_date:1608768060
    // buy_now_price:60000
    // minimum_increment_amount:5000
    // bid_increment:5000
    // start_price:30000
    // reserver_price:4500

    console.log(JSON.stringify(this.vendor.product));
    // return;
    this.loading = await this.loadingController.create({
      spinner: "crescent",
      translucent: true,
      animated: true,
      backdropDismiss: true,
    });
    await this.loading.present();
    if (this.platform.is("hybrid")) {
      this.api
        .postItemNew("add_auction_product", this.vendor.product)
        .subscribe(
          (res) => {
            //DOKAN AND WCFM Plugin
            this.res = res;
            console.log(res);

            if (res["post_title"]) {
              this.presentAlert("Product added successfully.");
            }
            //   this.api
            //     .postItemNew("update-vendor-product", {
            //       id: this.res.id,
            //     })
            //     .subscribe(
            //       (res) => {
            //         console.log(res);
            //       },
            //       (err) => {
            //         console.log(err);
            //       }
            //     );
            //DOKAN AND WCFM Plugin
            this.vendor.product = {};
            this.vendor.product.categories = [];
            this.vendor.product.images = [];
            this.vendor.product.dimensions = {};
            this.loading.dismiss();
            this.navCtrl.navigateBack("tabs/account");
          },
          (err) => {
            this.loading.dismiss();
            console.log(err);
          }
        );
    } else
      this.api
        .postItemNew("add_auction_product", this.vendor.product)
        .subscribe(
          (res) => {
            //DOKAN AND WCFM Plugin
            this.res = res;
            if (res["post_title"]) {
              this.presentAlert("Product added successfully.");
            }

            //   this.api
            //     .postItem("update-vendor-product", {
            //       id: this.res.id,
            //     })
            //     .subscribe(
            //       (res) => {
            //         console.log(res);
            //       },
            //       (err) => {
            //         console.log(err);
            //       }
            //     );
            //DOKAN AND WCFM Plugin
            this.vendor.product = {};
            this.vendor.product.categories = [];
            this.vendor.product.images = [];
            this.vendor.product.dimensions = {};
            this.loading.dismiss();
            this.navCtrl.navigateBack("tabs/account");
          },
          (err) => {
            this.loading.dismiss();
            console.log(err);
          }
        );
  }
}
