import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {ApiService} from "../../../../services/api.service";
import {ActivatedRoute} from "@angular/router";
import {MessageService} from "primeng/api";
import {DataService} from 'src/app/pages/data.service';
import {ConfigService} from 'src/app/pages/config.service';
import {ToastService} from 'src/app/pages/toast.service';
import {UserService} from 'src/app/services/user.service';


@Component({
  selector: 'app-general-config',
  templateUrl: './general-config.component.html',
  styleUrls: ['./general-config.component.scss']
})
export class GeneralConfigComponent implements OnInit {
  loader = false;
  configs: any;
  sizeRef: any;
  configRef: any = {};
  selectedCritic: any = "";
  selectedMultiJobCritic: any = "";
  selectedCriticJSON: any = {};
  selectedMultiJobCriticJSON: any = {};
  selectedAutoRouteDefaultParamJSON: any = {};
  feedbackCancelObject: any;
  feedbackCompleteObject: any = {};
  selectedDeliveryFeeJSON: any = {};
  selectedServiceFeeJSON: any = {};
  selectedDashboardConfigJSON: any;
  division: any;
  bigData: boolean = false;
  feedbackDataType: any = "";
  feedbackKey: any = "";
  companyId: any;
  selectedRiderOnboardingStepsJSON: any = {};
  ID: any;
  @Input() shareId: any;

  menuConfig = [
    "dashboard",
    "criticality",
    "manage",
    "rider status",
    "live tracking",
    "attendance",
    "route planner",
    "dispatch screen",
    "single job",
    "multi jobs",
    "live streaming",
    "yard management",
    "cash management",
    "payout",
    "report",
    "integrations",
    "route scheduler",
    "roster",
    "inventory",
    "ambulance criticality",
    "hospital criticality",
    "order optimization",
    "geotag",
    "rest room",
    "update profile",
    "t sensor",
  ];
  criticalityConfig = [
    "cancelled",
    "created",
    "assigned",
    "accepted",
    "reached_pick_up",
    "dispatch",
    "reached_destination",
    "delivered",
  ];
  rider_onboarding_steps_config = [
    "basic_details",
    "address",
    "doc_verification",
    "bank_details",
    "payout",
    "additionl_info",
  ];
  deliveryfeeConfig = [
    "Buy and Deliver Anything",
    "Pick-up Anything",
    "Send Anything",
  ];
  servicefeeConfig = [
    "Buy and Deliver Anything",
    "Pick-up Anything",
    "Send Anything",
  ];
  dashboardConfig = [
    "order_status",
    "order_weekly_report",
    "rider_status_report",
    "order_heatmap",
    "geotag_from_report",
    "attendance_report",
  ];
  selectedMenu = "";
  selectedDeliveryFee = "";
  selectedServiceFee = "";
  selectedDashboardConfig = "";
  selectedRiderOnboardingStepsConfig = "";

  message = [
    "company_name",
    "rider_name",
    "rider_number",
    "customer_name",
    "customer_number",
    "track_link",
    "delivery_time",
    "delivered_time",
    "order_otp",
    "company_contact_number",
    "order_no",
    "invoice_no",
    "external_id",
    "pick_up_address1",
    "pick_up_address2",
    "drop_address1",
    "drop_address2",
    "created_on",
    "updated_on",
    "outlet_name",
  ];
  isoCountries = [
    {code: "af", title: "Afghanistan"},
    {code: "ax", title: "Aland Islands"},
    {code: "al", title: "Albania"},
    {code: "dz", title: "Algeria"},
    {code: "as", title: "American Samoa"},
    {code: "ad", title: "Andorra"},
    {code: "ao", title: "Angola"},
    {code: "ai", title: "Anguilla"},
    {code: "aq", title: "Antarctica"},
    {code: "ag", title: "Antigua And Barbuda"},
    {code: "ar", title: "Argentina"},
    {code: "am", title: "Armenia"},
    {code: "aw", title: "Aruba"},
    {code: "au", title: "Australia"},
    {code: "at", title: "Austria"},
    {code: "az", title: "Azerbaijan"},
    {code: "bs", title: "Bahamas"},
    {code: "bh", title: "Bahrain"},
    {code: "bd", title: "Bangladesh"},
    {code: "bb", title: "Barbados"},
    {code: "by", title: "Belarus"},
    {code: "be", title: "Belgium"},
    {code: "bz", title: "Belize"},
    {code: "bj", title: "Benin"},
    {code: "bm", title: "Bermuda"},
    {code: "bt", title: "Bhutan"},
    {code: "bo", title: "Bolivia"},
    {code: "ba", title: "Bosnia And Herzegovina"},
    {code: "bw", title: "Botswana"},
    {code: "bv", title: "Bouvet Island"},
    {code: "br", title: "Brazil"},
    {code: "io", title: "British Indian Ocean Territory"},
    {code: "bn", title: "Brunei Darussalam"},
    {code: "bg", title: "Bulgaria"},
    {code: "bf", title: "Burkina Faso"},
    {code: "bi", title: "Burundi"},
    {code: "kh", title: "Cambodia"},
    {code: "cm", title: "Cameroon"},
    {code: "ca", title: "Canada"},
    {code: "cv", title: "Cape Verde"},
    {code: "ky", title: "Cayman Islands"},
    {code: "cf", title: "Central African Republic"},
    {code: "td", title: "Chad"},
    {code: "cl", title: "Chile"},
    {code: "cn", title: "China"},
    {code: "cx", title: "Christmas Island"},
    {code: "cc", title: "Cocos (Keeling) Islands"},
    {code: "co", title: "Colombia"},
    {code: "km", title: "Comoros"},
    {code: "cg", title: "Congo"},
    {code: "cd", title: "Congo, Democratic Republic"},
    {code: "ck", title: "Cook Islands"},
    {code: "cr", title: "Costa Rica"},
    {code: "ci", title: "Cote D'Ivoire"},
    {code: "hr", title: "Croatia"},
    {code: "cu", title: "Cuba"},
    {code: "cy", title: "Cyprus"},
    {code: "cz", title: "Czech Republic"},
    {code: "dk", title: "Denmark"},
    {code: "dj", title: "Djibouti"},
    {code: "dm", title: "Dominica"},
    {code: "do", title: "Dominican Republic"},
    {code: "ec", title: "Ecuador"},
    {code: "eg", title: "Egypt"},
    {code: "sv", title: "El Salvador"},
    {code: "gq", title: "Equatorial Guinea"},
    {code: "er", title: "Eritrea"},
    {code: "ee", title: "Estonia"},
    {code: "et", title: "Ethiopia"},
    {code: "fk", title: "Falkland Islands (Malvinas)"},
    {code: "fo", title: "Faroe Islands"},
    {code: "fj", title: "Fiji"},
    {code: "fi", title: "Finland"},
    {code: "fr", title: "France"},
    {code: "gf", title: "French Guiana"},
    {code: "pf", title: "French Polynesia"},
    {code: "tf", title: "French Southern Territories"},
    {code: "ga", title: "Gabon"},
    {code: "gm", title: "Gambia"},
    {code: "ge", title: "Georgia"},
    {code: "de", title: "Germany"},
    {code: "gh", title: "Ghana"},
    {code: "gi", title: "Gibraltar"},
    {code: "gr", title: "Greece"},
    {code: "gl", title: "Greenland"},
    {code: "gd", title: "Grenada"},
    {code: "gp", title: "Guadeloupe"},
    {code: "gu", title: "Guam"},
    {code: "gt", title: "Guatemala"},
    {code: "gg", title: "Guernsey"},
    {code: "gn", title: "Guinea"},
    {code: "gw", title: "Guinea-Bissau"},
    {code: "gy", title: "Guyana"},
    {code: "ht", title: "Haiti"},
    {code: "hm", title: "Heard Island & Mcdonald Islands"},
    {code: "va", title: "Holy See (Vatican City State)"},
    {code: "hn", title: "Honduras"},
    {code: "hk", title: "Hong Kong"},
    {code: "hu", title: "Hungary"},
    {code: "is", title: "Iceland"},
    {code: "in", title: "India"},
    {code: "id", title: "Indonesia"},
    {code: "ir", title: "Iran, Islamic Republic Of"},
    {code: "iq", title: "Iraq"},
    {code: "ie", title: "Ireland"},
    {code: "im", title: "Isle Of Man"},
    {code: "il", title: "Israel"},
    {code: "it", title: "Italy"},
    {code: "jm", title: "Jamaica"},
    {code: "jp", title: "Japan"},
    {code: "je", title: "Jersey"},
    {code: "jo", title: "Jordan"},
    {code: "kz", title: "Kazakhstan"},
    {code: "ke", title: "Kenya"},
    {code: "ki", title: "Kiribati"},
    {code: "kr", title: "Korea"},
    {code: "kw", title: "Kuwait"},
    {code: "kg", title: "Kyrgyzstan"},
    {code: "la", title: "Lao People's Democratic Republic"},
    {code: "lv", title: "Latvia"},
    {code: "lb", title: "Lebanon"},
    {code: "ls", title: "Lesotho"},
    {code: "lr", title: "Liberia"},
    {code: "ly", title: "Libyan Arab Jamahiriya"},
    {code: "li", title: "Liechtenstein"},
    {code: "lt", title: "Lithuania"},
    {code: "lu", title: "Luxembourg"},
    {code: "mo", title: "Macao"},
    {code: "mk", title: "Macedonia"},
    {code: "mg", title: "Madagascar"},
    {code: "mw", title: "Malawi"},
    {code: "my", title: "Malaysia"},
    {code: "mv", title: "Maldives"},
    {code: "ml", title: "Mali"},
    {code: "mt", title: "Malta"},
    {code: "mh", title: "Marshall Islands"},
    {code: "mq", title: "Martinique"},
    {code: "mr", title: "Mauritania"},
    {code: "mu", title: "Mauritius"},
    {code: "yt", title: "Mayotte"},
    {code: "mx", title: "Mexico"},
    {code: "fm", title: "Micronesia, Federated States Of"},
    {code: "md", title: "Moldova"},
    {code: "mc", title: "Monaco"},
    {code: "mn", title: "Mongolia"},
    {code: "me", title: "Montenegro"},
    {code: "ms", title: "Montserrat"},
    {code: "ma", title: "Morocco"},
    {code: "mz", title: "Mozambique"},
    {code: "mm", title: "Myanmar"},
    {code: "na", title: "Namibia"},
    {code: "nr", title: "Nauru"},
    {code: "np", title: "Nepal"},
    {code: "nl", title: "Netherlands"},
    {code: "an", title: "Netherlands Antilles"},
    {code: "nc", title: "New Caledonia"},
    {code: "nz", title: "New Zealand"},
    {code: "ni", title: "Nicaragua"},
    {code: "ne", title: "Niger"},
    {code: "ng", title: "Nigeria"},
    {code: "nu", title: "Niue"},
    {code: "nf", title: "Norfolk Island"},
    {code: "mp", title: "Northern Mariana Islands"},
    {code: "no", title: "Norway"},
    {code: "om", title: "Oman"},
    {code: "pk", title: "Pakistan"},
    {code: "pw", title: "Palau"},
    {code: "ps", title: "Palestinian Territory, Occupied"},
    {code: "pa", title: "Panama"},
    {code: "pg", title: "Papua New Guinea"},
    {code: "py", title: "Paraguay"},
    {code: "pe", title: "Peru"},
    {code: "ph", title: "Philippines"},
    {code: "pn", title: "Pitcairn"},
    {code: "pl", title: "Poland"},
    {code: "pt", title: "Portugal"},
    {code: "pr", title: "Puerto Rico"},
    {code: "qa", title: "Qatar"},
    {code: "re", title: "Reunion"},
    {code: "ro", title: "Romania"},
    {code: "ru", title: "Russian Federation"},
    {code: "rw", title: "Rwanda"},
    {code: "bl", title: "Saint Barthelemy"},
    {code: "sh", title: "Saint Helena"},
    {code: "kn", title: "Saint Kitts And Nevis"},
    {code: "lc", title: "Saint Lucia"},
    {code: "mf", title: "Saint Martin"},
    {code: "pm", title: "Saint Pierre And Miquelon"},
    {code: "vc", title: "Saint Vincent And Grenadines"},
    {code: "ws", title: "Samoa"},
    {code: "sm", title: "San Marino"},
    {code: "st", title: "Sao Tome And Principe"},
    {code: "sa", title: "Saudi Arabia"},
    {code: "sn", title: "Senegal"},
    {code: "rs", title: "Serbia"},
    {code: "sc", title: "Seychelles"},
    {code: "sl", title: "Sierra Leone"},
    {code: "sg", title: "Singapore"},
    {code: "sk", title: "Slovakia"},
    {code: "si", title: "Slovenia"},
    {code: "sb", title: "Solomon Islands"},
    {code: "so", title: "Somalia"},
    {code: "za", title: "South Africa"},
    {code: "gs", title: "South Georgia And Sandwich Isl."},
    {code: "es", title: "Spain"},
    {code: "lk", title: "Sri Lanka"},
    {code: "sd", title: "Sudan"},
    {code: "sr", title: "Suriname"},
    {code: "sj", title: "Svalbard And Jan Mayen"},
    {code: "sz", title: "Swaziland"},
    {code: "se", title: "Sweden"},
    {code: "ch", title: "Switzerland"},
    {code: "sy", title: "Syrian Arab Republic"},
    {code: "tw", title: "Taiwan"},
    {code: "tj", title: "Tajikistan"},
    {code: "tz", title: "Tanzania"},
    {code: "th", title: "Thailand"},
    {code: "tl", title: "Timor-Leste"},
    {code: "tg", title: "Togo"},
    {code: "tk", title: "Tokelau"},
    {code: "to", title: "Tonga"},
    {code: "tt", title: "Trinidad And Tobago"},
    {code: "tn", title: "Tunisia"},
    {code: "tr", title: "Turkey"},
    {code: "tm", title: "Turkmenistan"},
    {code: "tc", title: "Turks And Caicos Islands"},
    {code: "tv", title: "Tuvalu"},
    {code: "ug", title: "Uganda"},
    {code: "ua", title: "Ukraine"},
    {code: "ae", title: "United Arab Emirates"},
    {code: "gb", title: "United Kingdom"},
    {code: "us", title: "United States"},
    {code: "um", title: "United States Outlying Islands"},
    {code: "uy", title: "Uruguay"},
    {code: "uz", title: "Uzbekistan"},
    {code: "vu", title: "Vanuatu"},
    {code: "ve", title: "Venezuela"},
    {code: "vn", title: "Viet Nam"},
    {code: "vg", title: "Virgin Islands, British"},
    {code: "vi", title: "Virgin Islands, U.S."},
    {code: "wf", title: "Wallis And Futuna"},
    {code: "eh", title: "Western Sahara"},
    {code: "ye", title: "Yemen"},
    {code: "zm", title: "Zambia"},
    {code: "zw", title: "Zimbabwe"},
  ];

  constructor(
    private http: DataService,
    public configService: ConfigService,
    private toaster: ToastService,
    private user: UserService
  ) {
    this.loader = true;
  }

  ngOnInit(): void {
    this.fetchCompanyConfig().then();
  }

  async fetchCompanyConfig() {
    try {
      const refConfigs = (
        await this.http.query({__company_id__equal: this.shareId}, "auth/company_config_ref", "auth")
      ).data;
      this.configs = (await this.http.query({__company_id__equal: this.shareId}, "auth/company_config", "auth")).data;

      this.companyId = this.configs.find((el: any) => el.company_id).company_id;

      this.sizeRef = 0;
      this.configRef = {};

      refConfigs.forEach((config: any) => {
        if (config.key === "rider_onboarding_steps_config") return;
        this.configRef[config.key] = config;
        if (this.configRef[config.key].data_type === "text") {
          this.configRef[config.key].value = "";
        }

        this.sizeRef = this.sizeRef + 1;
      });
      this.configs.forEach((config: any) => {
        if (this.configRef.hasOwnProperty(config.key)) {
          if (config.value === 1) {
            this.configRef[config.key].value = true;
          } else if (
            this.configRef[config.key].data_type === "text" ||
            this.configRef[config.key].data_type === "json_array" ||
            this.configRef[config.key].data_type === "json"
          ) {
            this.configRef[config.key].value = config.value;
            if (config.key === "criticality_config" && config.value) {
              this.selectedCriticJSON = config.value;
            } else if (
              config.key === "multi_job_criticality_config" &&
              config.value
            ) {
              this.selectedMultiJobCriticJSON = config.value;
            } else if (
              config.key === "auto_route_default_parameters" &&
              config.value
            ) {
              this.selectedAutoRouteDefaultParamJSON = config.value;
            } else if (
              config.key === "feedback_cancel_questions" &&
              config.value
            ) {
              this.feedbackCancelObject = config.value;
            } else if (
              config.key === "feedback_complete_questions" &&
              config.value
            ) {
              this.feedbackCompleteObject = config.value;
            } else if (config.key === "delivery_fee" && config.value) {
              this.selectedDeliveryFeeJSON = config.value;
            } else if (config.key === "service_fee" && config.value) {
              this.selectedServiceFeeJSON = config.value;
            } else if (config.key === "dashboard_config" && config.value) {
              this.selectedDashboardConfigJSON = config.value;
            } else if (
              config.key === "rider_onboarding_steps_config" &&
              config.value
            ) {
              this.selectedRiderOnboardingStepsJSON = config.value;
            }
          }
        }
      });
      this.division = this.sizeRef;
      if (this.sizeRef > 16) {
        this.bigData = true;
        this.division = this.sizeRef / 2 + 1;
      } else {
        this.bigData = false;
      }
      this.loader = false;
    } catch (err) {
      this.loader = false;
    }
  }

  //Add Delivery Fee
  async addDeliveryFee(keyName: any, value: string) {
    if (this.selectedDeliveryFee && value) {
      this.selectedDeliveryFeeJSON[this.selectedDeliveryFee] = value;
      try {
        const configData = this.configs.find((x: any) => x.key === keyName);
        if (configData) {
          this.updateConfiguration(configData.id, this.selectedDeliveryFeeJSON)
          this.toaster.showToast("Updated successfully!", "Success", false);
        } else {
          this.createConfiguration(keyName, this.selectedDeliveryFeeJSON)
          this.toaster.showToast("Added successfully!", "Success", false);
        }
        this.selectedDeliveryFee = "";
      } catch (e: any) {
        this.toaster.showToast(e.message, "Error", true);
        delete this.selectedDeliveryFeeJSON[this.selectedDeliveryFee];
      }
    } else {
      this.toaster.showToast("Provide both details!", "Error", true);
    }
  }

  //Delete Delivery Fee
  async deleteDeliveryJSONValue(keyName: any, jsonKey: any): Promise<any> {
    try {
      delete this.selectedDeliveryFeeJSON[jsonKey];
      const configData = this.configs.find((x: any) => x.key === keyName);
      this.updateConfiguration(configData.id, this.selectedDeliveryFeeJSON)
      this.toaster.showToast("Deleted successfully!", "Success", false);
    } catch (e: any) {
      this.toaster.showToast(e.message, "Error", true);
    }
  }

  //Add Feedback Complete Questions
  async addFeedbackData(type: any) {
    //alert('addFeedbackData')
    //return false
    if (this.feedbackKey && this.feedbackDataType) {
      this.loader = true;
      if (type === "cancel") {
        this.feedbackCancelObject[this.feedbackKey] = {};
        this.feedbackCancelObject[this.feedbackKey].data_type = this.feedbackDataType;
        if (this.feedbackDataType === "dropdown") {
          this.feedbackCancelObject[this.feedbackKey].value = [];
        }
        try {
          const configData = this.configs.find(
            (x: any) => x.key === "feedback_cancel_questions"
          );
          if (configData) {
            this.updateConfiguration(configData.id, this.feedbackCancelObject)
            this.toaster.showToast("Updated successfully!", "Success", false);
          } else {
            this.createConfiguration('feedback_cancel_questions', this.feedbackCancelObject)
            this.toaster.showToast("Added successfully!", "Success", false);
          }
          this.feedbackKey = this.feedbackDataType = "";
        } catch (e: any) {
          this.toaster.showToast(e.message, "Error", true);
          this.loader = false;
        }
      } else if (type === "complete") {
        this.feedbackCompleteObject[this.feedbackKey] = {};
        this.feedbackCompleteObject[this.feedbackKey].data_type =
          this.feedbackDataType;
        if (this.feedbackDataType === "dropdown") {
          this.feedbackCompleteObject[this.feedbackKey].value = [];
        }

        try {
          const configData = this.configs.find(
            (x: any) => x.key === "feedback_complete_questions"
          );
          if (configData) {
            this.updateConfiguration(configData.id, this.feedbackCompleteObject)
            this.toaster.showToast("Updated successfully!", "Success", false);
          } else {
            this.createConfiguration('feedback_complete_questions', this.feedbackCompleteObject)
            this.toaster.showToast("Added successfully!", "Success", false);
          }
          this.feedbackKey = this.feedbackDataType = "";
        } catch (e: any) {
          this.toaster.showToast(e.message, "Error", true);
          this.loader = false;
        }
      }
    } else {
      this.toaster.showToast("Enter all data!", "Insufficent data!", true);
    }
  }

  //Delete Feedback Complete Questions
  async deleteFeedbackKey(key: string, type: any) {
    this.loader = true;
    if (type === "cancel") {
      delete this.feedbackCancelObject[key];
      try {
        const configData = this.configs.find(
          (x: any) => x.key === "feedback_cancel_questions"
        );
        if (configData) {
          this.updateConfiguration(configData.id, this.feedbackCancelObject)
          this.toaster.showToast("Deleted successfully!", "Success", false);
        } else {
          this.toaster.showToast("Could not delete!", "Error", true);
          this.loader = false;
          return;
        }
      } catch (e: any) {
        this.toaster.showToast(e.message, "Error", true);
        this.loader = false;
      }
    } else if (type === "complete") {
      delete this.feedbackCompleteObject[key];
      try {
        const configData = this.configs.find(
          (x: any) => x.key === "feedback_complete_questions"
        );
        if (configData) {
          this.updateConfiguration(configData.id, this.feedbackCompleteObject)
          this.toaster.showToast("Deleted successfully!", "Success", false);
        } else {
          this.toaster.showToast("Could not add value!", "Error", true);
          this.loader = false;
          return;
        }
      } catch (e: any) {
        this.toaster.showToast(e.message, "Error", true);
        this.loader = false;
      }
    }
  }

  async addDashboardConfig(keyName: any, value: string) {
    if (this.selectedDashboardConfig && value) {
      this.selectedDashboardConfigJSON[this.selectedDashboardConfig] = value;
      try {
        const configData = this.configs.find((x: any) => x.key === keyName);
        if (configData) {
          this.updateConfiguration(configData.id, this.selectedDashboardConfigJSON)
          this.toaster.showToast("Updated successfully", "Success", false);
        } else {
          this.createConfiguration(keyName, this.selectedDashboardConfigJSON)
          this.toaster.showToast("Added successfully", "Success", false);
        }
        this.selectedDashboardConfig = "";
      } catch (e: any) {
        this.toaster.showToast(e.message, "Error", true);
        delete this.selectedDashboardConfigJSON[this.selectedDashboardConfig];
      }
    } else {
      this.toaster.showToast("Provide both details!", "Error", true);
    }
  }

  async deleteDashboardConfigJSONValue(keyName: any, jsonKey: any): Promise<any> {
    try {
      delete this.selectedDashboardConfigJSON[jsonKey];
      const configData = this.configs.find((x: any) => x.key === keyName);
      this.updateConfiguration(configData.id, this.selectedDashboardConfigJSON)
      this.toaster.showToast("Deleted successfully", "Success", false);
    } catch (e: any) {
      this.toaster.showToast(e.message, "Error", true);
    }
  }

  //Add service key and name
  async addServiceFee(keyName: any, value: string) {
    if (this.selectedServiceFee && value) {
      this.selectedServiceFeeJSON[this.selectedServiceFee] = value;
      try {
        const configData = this.configs.find((x: any) => x.key === keyName);
        if (configData) {
          this.updateConfiguration(configData.id, this.selectedServiceFeeJSON)
          this.toaster.showToast("Updated successfully", "Success", false);
        } else {
          this.createConfiguration(keyName, this.selectedServiceFeeJSON)
          this.toaster.showToast("Added successfully", "Success", false);
        }
        this.selectedServiceFee = "";
      } catch (e: any) {
        this.toaster.showToast(e.message, "Error", true);
        delete this.selectedServiceFeeJSON[this.selectedServiceFee];
      }
    } else {
      this.toaster.showToast("Provide both details!", "Error", true);
    }
  }

  //Delete Service key and value
  async deleteServiceJSONValue(keyName: any, jsonKey: any): Promise<any> {
    try {
      delete this.selectedServiceFeeJSON[jsonKey];
      const configData = this.configs.find((x: any) => x.key === keyName);
      this.updateConfiguration(configData.id, this.selectedServiceFeeJSON)
      this.toaster.showToast("Deleted successfully", "Success", false);
    } catch (e: any) {
      this.toaster.showToast(e.message, "Error", true);
    }
  }


  //Add for vehicle_model_config
  async addJSONArray(keyName: any, value: string) {
    //alert('addJSONArray')
    if (!value) {
      this.toaster.showToast('Field is important', "Error", true);
    }
    if (!Array.isArray(this.configRef[keyName].value)) {
      this.configRef[keyName].value = [];
    }
    this.configRef[keyName].value.push(value);
    try {
      const configData = this.configs.find((x: any) => x.key === keyName);
      if (configData) {
        this.updateConfiguration(configData.id, this.configRef[keyName].value)
        this.toaster.showToast("Updated successfully", "Success", false);
      } else {
        this.createConfiguration(keyName, this.configRef[keyName].value)
        this.toaster.showToast("Added successfully", "Success", false);
      }
      //this.fetchCompanyConfig().then();
    } catch (e: any) {
      const index = this.configRef[keyName].value.indexOf(value);
      this.configRef[keyName].value.splice(index, 1);
      this.toaster.showToast(e.message, "Error", true);
    }
  }

  //Delete from Menu Config,Vehicle Model Config,Places Country
  async deleteJSONArray(keyName: any, value: any, localArrayIndex: any): Promise<any> {
    try {
      this.configRef[keyName].value.splice(localArrayIndex, 1);
      const configData = this.configs.find((x: any) => x.key === keyName);
      this.updateConfiguration(configData.id, this.configRef[keyName].value)
      this.toaster.showToast("Deleted successfully", "Success", false);
      //this.fetchCompanyConfig().then();
    } catch (e: any) {
      this.configRef[keyName].value.push(value);
      this.toaster.showToast(e.message, "Error", true);
    }
  }

  //Delete value For Auto Route Default Parameters,Criticality Config and Multi Job Criticality Config
  async deleteJSONValue(keyName: any, jsonKey: any, type: string): Promise<any> {
    if (type === "multi") {
      try {
        delete this.selectedMultiJobCriticJSON[jsonKey];
        const configData = this.configs.find((x: any) => x.key === keyName);
        this.updateConfiguration(configData.id, this.selectedMultiJobCriticJSON);
        this.toaster.showToast("Deleted successfully", "Success", false);
      } catch (e: any) {
        this.toaster.showToast(e.message, "Error", true);
      }
    } else if (type === "single") {
      try {
        delete this.selectedCriticJSON[jsonKey];
        const configData = this.configs.find((x: any) => x.key === keyName);
        this.updateConfiguration(configData.id, this.selectedCriticJSON);
        this.toaster.showToast("Deleted successfully", "Success", false);
      } catch (e: any) {
        this.toaster.showToast(e.message, "Error", true);
      }
    } else {
      const configData = this.configs.find((x: any) => x.key === keyName);
      delete this.selectedAutoRouteDefaultParamJSON[jsonKey];
      try {
        this.updateConfiguration(configData.id, this.selectedAutoRouteDefaultParamJSON)
        this.toaster.showToast("Deleted successfully", "Success", false);
      } catch (e: any) {
        this.toaster.showToast(e.message, "Error", true);
      }
    }
  }

  //Add Json value (Auto Route Default Parameters)
  async addJSONValue(keyName: any, key: any, value: any): Promise<any> {
    const configData = this.configs.find((x: any) => x.key === keyName);
    let tempkeyname = this.configService.underscoreConvert(configData.key);
    if (!key || !value) {
      this.toaster.showToast(tempkeyname + ' fields are important', "Error", true);
      return false;
    }
    if (value) {
      if (key.length > 0 && value) {
        let jsonValue: any = {};
        if (this.configRef[keyName].value) {
          this.configRef[keyName].value[key] = value;
          jsonValue = this.configRef[keyName].value;
        } else {
          jsonValue[key] = value;
          this.configRef[keyName].value = jsonValue;
        }
        if (configData) {
          this.updateConfiguration(configData.id, jsonValue)
        } else {
          this.createConfiguration(keyName, jsonValue)
        }
      }
    }
  }

  //Add value For Criticality Config and Multi Job Criticality Config
  async addCritic(keyName: any, value: string, type: string) {
    if (type === "single") {
      if (this.selectedCritic && value) {
        this.selectedCriticJSON[this.selectedCritic] = value;
        try {
          const configData = this.configs.find((x: any) => x.key === keyName);
          if (configData) {
            this.updateConfiguration(configData.id, this.selectedCriticJSON);
            this.toaster.showToast("Updated successfully!", "Success", false);
          } else {
            this.createConfiguration(keyName, this.selectedCriticJSON);
            this.toaster.showToast("Added successfully!", "Success", false);
          }
          this.selectedCritic = "";
        } catch (e: any) {
          this.toaster.showToast(e.message, "Error", true);
          delete this.selectedCriticJSON[this.selectedCritic];
        }
      } else {
        this.toaster.showToast("Provide both details!", "Error", true);
      }
    } else if (type === "multi") {
      if (this.selectedMultiJobCritic && value) {
        this.selectedMultiJobCriticJSON[this.selectedMultiJobCritic] = value;
        try {
          const configData = this.configs.find((x: any) => x.key === keyName);
          if (configData) {
            this.updateConfiguration(configData.id, this.selectedMultiJobCriticJSON);
            this.toaster.showToast("Updated successfully!", "Success", false);
          } else {
            this.createConfiguration(keyName, this.selectedMultiJobCriticJSON);
            this.toaster.showToast("Added successfully!", "Success", false);
          }
          this.selectedMultiJobCritic = "";
        } catch (e: any) {
          this.toaster.showToast(e.message, "Error", true);
          delete this.selectedMultiJobCriticJSON[this.selectedMultiJobCritic];
        }
      } else {
        this.toaster.showToast("Provide both details!", "Error", true);
      }
    }
  }

  //Toggle ON or OFF
  async updateCompanyToggleConfig(key: any, value: any) {
    const config = this.configs
      ? this.configs.find((x: any) => x.key === key)
      : null;
    let selectedValue = 0;
    if (value) {
      selectedValue = 1;
    }
    if (config) {
      this.updateConfiguration(config.id, selectedValue);
    } else {
      this.createConfiguration(key, selectedValue)
    }
    this.toaster.showToast("Saved config successful", "Success", false);
  }

  //Add Menu For Places Country and Menu Config
  async addMenu(keyName: any, value: any): Promise<any> {
    //alert('addMenu'+'='+keyName)
    if (this.selectedMenu) {
      if (!this.configRef[keyName].value) {
        this.configRef[keyName].value = [];
      }
      if (Array.isArray(this.configRef[keyName].value)) {
        this.configRef[keyName].value.push(this.selectedMenu);
      }
      try {
        const configData = this.configs.find((x: any) => x.key === keyName);
        if (configData) {
          this.updateConfiguration(configData.id, this.configRef[keyName].value)
          this.toaster.showToast("Updated successfully", "Success", false);
        } else {
          this.createConfiguration(keyName, this.configRef[keyName].value)
          this.toaster.showToast("Added successfully", "Success", false);
        }
        this.selectedMenu = "";
        //this.fetchCompanyConfig().then();
      } catch (e: any) {
        const index = this.configRef[keyName].value.indexOf(this.selectedMenu);
        this.configRef[keyName].value.splice(index, 1);
        this.toaster.showToast(e.message, "Error", true);
      }
    }
  }

  //Add text which has Update Button (Custom Report,Doc Verify By,External Id Generate,Freshchat Tag,Logo,Razor Account Id,Reconcile Frequency,Rider Minimum Age
  //,Sms Auth Key,Sms Company,Sms Hash Key,Sms Otp Template Id,Sms Sender Id,Vehicle Registration No Format)
  async addTextData(keyName: any, value: any): Promise<any> {
    if (!value) {
      this.toaster.showToast('Field is important', "Error", true);
      return false;
    }
    this.configRef[keyName].value = value;
    const configData = this.configs.find((x: any) => x.key === keyName);
    if (configData) {
      this.updateConfiguration(configData.id, this.configRef[keyName].value)
      this.toaster.showToast("Updated successfully", "Success", false);
    } else {
      this.createConfiguration(keyName, this.configRef[keyName].value)
      this.toaster.showToast("Added successfully", "Success", false);
    }
  }

  async createConfiguration(keyName: any, jsonValue: any) {
    await this.http.create({key: keyName, value: jsonValue}, {}, "auth/company_config");
  }

  //Update Configuration
  async updateConfiguration(configurationID: any, jsonValue: any) {
    await this.http.update(configurationID, {value: jsonValue}, {}, "auth/company_config");
  }

  protected readonly Object = Object;
}
