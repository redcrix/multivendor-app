import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { ApiService } from "../api.service";
import { md5 } from "./md5";
import { Settings } from "../data/settings";
import { FormBuilder, Validators } from "@angular/forms";
import {
  LoadingController,
  NavController,
  ToastController,
} from "@ionic/angular";

@Component({
  selector: "app-review",
  templateUrl: "./review.page.html",
  styleUrls: ["./review.page.scss"],
})
export class ReviewPage implements OnInit {
  id: any;
  reviews: any;
  tempReviews: any;
  hasMoreItems: boolean = true;
  filter: any = {};
  showReviews: boolean = false;
  count: any;
  count5: number = 0;
  count4: number = 0;
  count3: number = 0;
  count2: number = 0;
  count1: number = 0;
  count5Percentage: number = 0;
  count4Percentage: number = 0;
  count3Percentage: number = 0;
  count2Percentage: number = 0;
  count1Percentage: number = 0;
  form: any;
  disableSubmit: boolean = false;
  isLoggedIn: boolean = false;
  add_comment: any;
  starRating = 5;
  newReview = false;
  All_reviews_visible = false;
  constructor(
    public loadingController: LoadingController,
    public toastController: ToastController,
    public api: ApiService,
    public router: Router,
    public route: ActivatedRoute,
    public settings: Settings,
    private fb: FormBuilder,
    public navCtrl: NavController
  ) {
    console.log(this.settings.customer.id);
    if (this.settings.customer && this.settings.customer.id > 0) {
      this.isLoggedIn = true;
    }
  }
  ngOnInit() {
    this.filter.page = 1;
    this.id = this.route.snapshot.paramMap.get("id");
    this.filter.product_id = this.id;

    this.form = this.fb.group({
      rating: [5, Validators.required],
      author: ["", this.isLoggedIn ? "" : Validators.required],
      email: ["", this.isLoggedIn ? "" : Validators.email],
      comment: ["", Validators.required],
      comment_post_ID: [this.id, Validators.required],
    });

    this.getReviews();
  }
  ionViewDidLoad() {
    this.reviewchn();
  }

  ionViewDidEnter() {
    this.reviewchn();
  }

  reviewchn() {
    if (this.settings.customer.Is_add_review_visible == true) {
      this.All_reviews_visible = true;
    } else {
      this.All_reviews_visible = false;
    }
  }
  async loadData(event) {
    this.filter.page = this.filter.page + 1;
    await this.api.postFlutterItem("product_reviews", this.filter).subscribe(
      (res) => {
        this.tempReviews = res;
        this.reviews.push.apply(this.reviews, this.tempReviews);
        event.target.complete();
        if (!res) this.hasMoreItems = false;
        for (let item in this.reviews) {
          this.reviews[item].avatar = md5(this.reviews[item].email);
        }
      },
      (err) => {
        event.target.complete();
      }
    );
  }
  async getReviews() {
    this.reviewchn();
    await this.api.postFlutterItem("product_reviews", this.filter).subscribe(
      (res) => {
        this.reviews = res;
        for (let item in this.reviews) {
          this.reviews[item].avatar = md5(this.reviews[item].email);
        }

        this.count = this.reviews.length;

        this.reviews.forEach((review) => {
          if (parseInt(review.rating) == 5) {
            this.count5 = this.count5 + 1;
          } else if (parseInt(review.rating) >= 4) {
            this.count4 = this.count4 + 1;
          } else if (parseInt(review.rating) >= 3) {
            this.count3 = this.count3 + 1;
          } else if (parseInt(review.rating) >= 2) {
            this.count2 = this.count2 + 1;
          } else if (parseInt(review.rating) == 1) {
            this.count1 = this.count1 + 1;
          }
        });
        this.showReviews = true;
        this.count5Percentage = (this.count5 / this.count) * 100;
        this.count4Percentage = (this.count4 / this.count) * 100;
        this.count3Percentage = (this.count3 / this.count) * 100;
        this.count2Percentage = (this.count2 / this.count) * 100;
        this.count1Percentage = (this.count1 / this.count) * 100;
      },
      (err) => {}
    );
  }
  yourRating(rating) {
    this.form.value.rating = rating;
  }
  async onSubmit() {
    this.disableSubmit = true;
    await this.api.ajaxCall("/wp-comments-post.php", this.form.value).subscribe(
      (res) => {
        this.disableSubmit = false;
      },
      (err) => {
        this.disableSubmit = false;
      }
    );
  }

  onRateChange(event) {
    console.log("Your rate:", event);
  }

  Add_review() {
    console.log(this.settings.customer.id);

    if (this.settings.customer.id == undefined) {
      this.presentToast("Login to send an enquiry");
      return;
    }

    let data = {
      note: this.add_comment,
      user_id: parseInt(this.settings.customer.id),
      rating: this.starRating,
      product_id: parseInt(this.settings.customer.new_pro_id),
    };
    this.api.postItemNew("add_product_review", data).subscribe(
      (res) => {
        this.presentToast(res["message"]);
        console.log(JSON.stringify(res));
      },
      (err) => {
        console.log(err);
      }
    );
  }

  backNow() {
    this.navCtrl.navigateForward("/tabs/account/orders");
  }

  async presentToast(message) {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000,
      position: "top",
    });
    toast.present();
  }
}
