import { Component, ElementRef, EventEmitter, HostListener, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { TransitionCheckState } from '@angular/material/checkbox';
import { MatTabGroup } from "@angular/material/tabs";
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { RegisterService } from 'src/app/services/register.service';
import { country } from '../../breezie-dashboard/account/country';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  registerForm1: FormGroup;
  registerForm2: FormGroup;
  submitted = false;
  disableSwitching: boolean;
  country = country;
  spinner: boolean = false;
  @Input('ng2TelInputOptions') ng2TelInputOptions: any;
  @Output('hasError') hasError: EventEmitter<boolean> = new EventEmitter();
  @Output('ng2TelOutput') ng2TelOutput: EventEmitter<any> = new EventEmitter();
  @Output('intlTelInputObject') intlTelInputObject: EventEmitter<any> = new
    EventEmitter(); ngTelInput: any;
  constructor(
    private fb: FormBuilder,
    private registerService: RegisterService,
    private toastr: ToastrService,
    private router: Router,
    private el: ElementRef
  ) { }

  @HostListener('blur') onBlur() {
    let isInputValid: boolean = this.isInputValid();
    if (isInputValid) {
      let telOutput = this.ngTelInput.intlTelInput("getNumber");
      this.hasError.emit(isInputValid);
      this.ng2TelOutput.emit(telOutput);
    } else {
      this.hasError.emit(isInputValid);
    }
  }

  onError(obj) {
    this.hasError = obj;
    console.log('hasError: ', obj);
  }
  isInputValid(): boolean {
    return this.ngTelInput.intlTelInput('isValidNumber') ? true : false;
  }
  public demo1TabIndex = 0;
  public demo1BtnClick() {
    this.spinner = false
    const tabCount = 2;
    this.demo1TabIndex = (this.demo1TabIndex + 1) % tabCount;
  }
  keyPressNumbers(event) {
    var charCode = (event.which) ? event.which : event.keyCode;
    // Only Numbers 0-9
    if ((charCode < 32 || charCode > 57)) {
      event.preventDefault();
      return false;
    }
    else {
      return true;
    }
  }
  ngOnInit(): void {
    this.registerForm1 = this.fb.group({
      firstName: new FormControl('', [Validators.required, Validators.minLength(3), Validators.pattern(/^[a-zA-Z][a-zA-Z ]*$/), Validators.maxLength(30)]),
      lastName: new FormControl('', [Validators.required, Validators.minLength(1), Validators.pattern(/^[a-zA-Z][a-zA-Z ]*$/), Validators.maxLength(30)]),
      emailId: new FormControl('', [Validators.required, Validators.pattern(/^[a-zA-Z0-9._]+@[a-zA-Z0-9.]+\.[a-zA-Z]{2,4}$/),
      Validators.email
      ]),
      phone: new FormControl('', [Validators.required, Validators.pattern("^((\\+[0-9][0-9]-?)|0)?[0-9]{5,13}$")]),
      companyName: new FormControl('', [Validators.required, Validators.minLength(2), Validators.pattern(/^[.@&]?[a-zA-Z0-9]+[ !.@&()]?[a-zA-Z0-9!()/._ ]*$/), Validators.maxLength(50)]),
      country: new FormControl('', [Validators.required, Validators.minLength(2), Validators.maxLength(30)]),
      address: new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(150), Validators.pattern(/^[#.@&-]?[a-zA-Z0-9]+[ #!,.@&()-]?[a-zA-Z0-9!(),-/._ ]*$/)]),
      agreeTerms: [false]
    })
  }

  get registerFormControl() {
    return this.registerForm1.controls;
  }
  submit() {
    this.submitted = true
    this.spinner = true;
    this.registerService.registerNewUser(this.registerForm1.value).subscribe(res => {
      if (!res.error) {
        this.spinner = false;
        this.router.navigate(['/auth/register-thankyou'])
      } else {
        this.toastr.error(res.message)
        this.spinner = false;
      }
    }, err => {
      if (err.status) {
        this.toastr.error(err.error.message);
        this.spinner = false;
      } else {
        this.toastr.error("CONNECTION_ERROR");
        this.spinner = false;
      }
    });
  }

  private goToNextTabIndex(tabGroup: MatTabGroup) {
    if (!tabGroup || !(tabGroup instanceof MatTabGroup)) return;
    const tabCount = tabGroup._tabs.length;
    tabGroup.selectedIndex = (tabGroup.selectedIndex + 1) % tabCount;
  }

  countryCode: any
  onCountryChange(e: any) {
    this.countryCode = e.dialCode
  }
  telInputObject(obj) {
    console.log(obj);
    obj.setCountry('in');
  }
}
