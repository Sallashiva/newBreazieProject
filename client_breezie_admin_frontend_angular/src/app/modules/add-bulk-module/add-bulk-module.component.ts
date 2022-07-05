import {
  Component,
  OnInit,
  VERSION
} from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators
} from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import {
  MatStepperModule
} from '@angular/material/stepper';
import { ToastrService } from 'ngx-toastr';
import { zip } from 'rxjs';
import { EmployeesComponent } from 'src/app/breezie-dashboard/employees/employees.component';
import { EmployeeService } from 'src/app/services/employee.service';
import { LocationService } from 'src/app/services/location.service';
import * as XLSX from 'xlsx';
@Component({
  selector: 'app-add-bulk-module',
  templateUrl: './add-bulk-module.component.html',
  styleUrls: ['./add-bulk-module.component.css']
})
export class AddBulkModuleComponent implements OnInit {
  locationId: any
  location: any
  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;
  thirdFormGroup: FormGroup;
  fourFormGroup: FormGroup;
  constructor(
    private formBuilder: FormBuilder,
    private locationService: LocationService,
    private employeeService: EmployeeService,
    private toastr: ToastrService,
    private dialogRef: MatDialogRef<EmployeesComponent>
  ) { }

  ngOnInit(): void {

    this.firstFormGroup = this.formBuilder.group({
      firstCtrl: [''],
    });
    this.secondFormGroup = this.formBuilder.group({
      secondCtrl: [''],
      location: new FormControl('', [Validators.required]),

    });
    this.thirdFormGroup = this.formBuilder.group({
      thirdCtrl: [''],
      file: new FormControl('', [Validators.required]),
      // employeeArray: new FormControl('', [
      //   Validators.required
      // ]),
      // file:new FormControl(''),
      // location: new FormControl('', [Validators.required]),
    });
    this.fourFormGroup = this.formBuilder.group({
      fourCtrl: [''],
    });
    this.getDeviceLOcatoion()
  }
  file
  // fileUpload(e){
  //   if(e.target.files.length>0){
  //     const file=e.target.files[0].name;
  //     this.file=file;

  //   }
  // }

  locationDataId: any

  getLocationId(id) {

    this.locationDataId = id
  }

  data1
  spinner: boolean = true
  inserted: number = 0
  updated: number = 0
  issue: number = 0
  resultData: boolean = false
  errorMessage: string = ""
  erroShow: Boolean = false;

  validateEmail = (ele) => {
    if (String(ele).toLowerCase().match(/^[a-zA-Z0-9._]+@[a-zA-Z0-9.]+\.[a-zA-Z]{2,4}$/)) {
      return true
    }else{
      console.log("Email",ele);
      
      return false
    }
  };
  //  validateAssistantEmail = (ele) => {
  //   if(String(ele).toLowerCase().match(/^[a-zA-Z0-9._]+@[a-zA-Z0-9.]+\.[a-zA-Z]{1,6}$/)){
  //     return true
  //   }else{
  //     console.log(ele);
  //     return false
  //   }
  // };
   validateFirstName = (ele) => {
    if(String(ele).toLowerCase().match(/^[a-zA-Z][a-zA-Z ]*$/)){
      return true
    } else {
      return false
    }
  };
  validateLastName = (ele) => {
    if (String(ele).toLowerCase().match(/^[a-zA-Z][a-zA-Z ]*$/)) {
      return true
    }else{
      console.log("LastName",ele);
      return false
    }
  };
  validatePhone = (ele) => {
    if (String(ele).toLowerCase().match(/^(\+\d{1,3}[- ])?\d{5,13}$/)) {
      return true
    } else {
      return false
    }
  };
  //  validateAssistSms = (ele) => {
  //   if(String(ele).toLowerCase().match(/^(\+\d{1,3}[- ])?\d{5,13}$/)){
  //     return true
  //   }else{
  //     return false
  //   }
  // };
  // validateIsBoolean = (ele) => {
  //   if(String(ele).toLowerCase().match(/^(\+\d{1,3}[- ])?\d{5,13}$/)){
  //         return true
  //       }else{
  //         return false
  //       }
  // }
  employeeForm: FormGroup

  prepareForm(){
    this.employeeForm = this.formBuilder.group({
      fullName: new FormControl(''),
      lastName: new FormControl(''),
      email: new FormControl(''),
      phone: new FormControl(''),
      location: new FormControl('', [Validators.required]),
      assistantEmail: new FormControl(''),
      assistSms: new FormControl(''),
      isRemoteUser: new FormControl(''),
    })
  }
  arra = []
  Insert = 0
  update = 0
  error = 0

  empArr = []
  uplodeFile(){
    this.error = 0
    this.csvResult.forEach((ele,index)=>{
      if( this.validateEmail(ele.email) === true &&
        // this.validateAssistantEmail(ele.assistantEmail) === true &&
        this.validateFirstName(ele.firstName) === true &&
        this.validateLastName(ele.lastName) === true &&
        this.validatePhone(ele.phone) === true 
        // this.validateIsBoolean(ele.isRemoteUser)
        // this.validateAssistSms(ele.assistSms) === true
        ){
          this.empArr.push(ele)
        } else {
          this.error = this.error +1 
        }
    })
    console.log(this.empArr.length);
    let data={
      locationId:this.locationDataId,
      employeeArray:this.empArr
    }
    console.log(data);
    
    this.employeeService.uploadXlSheet(data).subscribe(res=>{
          if(res) {
            this.inserted=res.Data.Inserted;
            this.updated=res.Data.Upadted;
            this.issue = res.Data.Issue + this.error
            setTimeout(()=>{
               this.spinner = false;
               this.erroShow= false
               this.resultData = true
              },500)
              this.toastr.success(res.message)
           }
          }, (err) => {
            this.spinner = false;
            this.erroShow= true
             this.resultData = false
             this.errorMessage=err.error.message
            this.toastr.error(err.error.message)
          })

  }
  uplodeFile1() {
    this.Insert = 0
    this.update = 0
    this.error = 0
    // this.spinner = true;
    
    this.csvResult.forEach((ele,index)=>{
      ele.isRemoteUser = ele.isRemoteUser.toLowerCase();
      this.validateEmail(ele.email)
      // this.validateAssistantEmail(ele.assistantEmail)
      this.validateFirstName(ele.firstName)
      this.validateLastName(ele.lastName)
      // this.validatePhone(ele.phone)
      // this.validateAssistSms(ele.assistSms)

    let data={
      locationId:this.locationDataId,
      employeeArray:this.csvResult
    }
    if( this.validateEmail(ele.email) === true &&
        // this.validateAssistantEmail(ele.assistantEmail) === true &&
        this.validateFirstName(ele.firstName) === true &&
        this.validateLastName(ele.lastName) === true &&
        this.validatePhone(ele.phone) === true 
        // this.validateAssistSms(ele.assistSms) === true
        ){
          console.log(ele.firstName);
          
          // this.employeeForm.patchValue({
          //   fullName: ele.firstName
          // })
          console.log(this.employeeForm.value);
          
          // this.employeeForm.get('fullName').patchValue(ele.firstName);
          // this.employeeForm.get('lastName').patchValue(ele.lastName);
          // this.employeeForm.get('email').patchValue(ele.email);
          // this.employeeForm.get('phone').patchValue(ele.phone);
          // this.employeeForm.get('location').patchValue(this.locationDataId);
          // this.employeeForm.get('assistantEmail').patchValue(ele.assistantEmail);
          // this.employeeForm.get('assistSms').patchValue(ele.assistSms);
          // this.employeeForm.get('isRemoteUser').patchValue(ele.isRemoteUser);
        
          this.employeeService.addEmployee(
            this.employeeForm.value.fullName,
            this.employeeForm.value.lastName,
            this.employeeForm.value.email,
            this.employeeForm.value.phone,
            this.employeeForm.value.location,
            this.employeeForm.value.assistantEmail,
            this.employeeForm.value.assistSms,
            this.employeeForm.value.isRemoteUser,
            this.arra
          ).subscribe(res => {
            if (!res.error) {
              this.Insert = this.Insert + 1
            } else {
              this.error = this.error+1
            }
          }, (err) => {
            if (err.status) {
              this.error = this.error+1
            } else {
              this.error = this.error+1
            }
          })
          
        // this.employeeService.uploadXlSheet(data).subscribe(res=>{

        //   if(res) {
        //     this.inserted=res.Data.Inserted;
        //     this.updated=res.Data.Upadted;
        //     this.issue=res.Data.Issue;
        //     setTimeout(()=>{
        //        this.spinner = false;
        //        this.erroShow= false
        //        this.resultData = true
        //       },500)
        //       this.toastr.success(res.message)
        //    }
        //   }, (err) => {
        //     this.spinner = false;
        //     this.erroShow= true
        //      this.resultData = false
        //      this.errorMessage=err.error.message
        //     this.toastr.error(err.error.message)
        //   })
      } else {
        setTimeout(() => {
          this.spinner = false;
          this.errorMessage = "Pattern validation failed ! Please update excel sheet";
          this.toastr.error("Pattern validation failed ! Please update excel sheet")
        }, 2000)

      }
    })

  }

  uploadFileToBackend(event: any) {
    this.employeeService.uploadEmployeeData(this.thirdFormGroup.value).subscribe((res) => {
      if (!res.error) {
        // this.toastr.success(res.message);
        // this.getAllEmployee();
      } else {
        // this.toastr.error(res.message);
      }
    }, err => {
      // this.toastr.error(err.error.message);
    })
    event.target.value = null
  }


  deviceLocation: any = []
  getDeviceLOcatoion() {
    this.locationService.getDeiviceLocation().subscribe(res => {
      // this.deviceLocation.push(res)
      res.deviceData.forEach((deviceData) => {
        let location = {
          officeName: deviceData.locations.officeName,
          locationId: deviceData._id
        }
        this.deviceLocation.push(location);
      })
    })
  }

  companyLocationsData
  locations = []
  getCompanyLocations() {
    this.locationService.getDeiviceLocation().subscribe(res => {
      this.companyLocationsData = res.deviceData
      for (let i = 0; i < this.companyLocationsData.length; i++) {
        if (this.companyLocationsData[i].locations) {
          this.locations.push(this.companyLocationsData[i])
        }
      }
    });
  }

  Done() {
    this.dialogRef.close(true);
  }

  csvFile: Boolean = false
  activationFile: File;
  formDataActivation: FormData;
  csvResult: any[];
  name = 'Angular ' + VERSION.major;
  onChoosingActivationFile(event: Event) {
    this.activationFile = (event.target as HTMLInputElement).files[0];
    let arr = this.activationFile.name.split('.')[1];
    this.file = (event.target as HTMLInputElement).files[0].name;
    if (arr === "csv") {
      this.csvFile = false
      this.formDataActivation = new FormData()
      this.formDataActivation.append('filename', this.activationFile);
      this.formDataActivation.append('document_type', 'xls');
      let reader = new FileReader();
      reader.readAsText(this.activationFile);
      reader.onload = () => {
        this.csvResult = [];
        let csv = reader.result;
        let lines = csv.toString().split('\r\n');
        let headers = lines[0].split(',');
        for (let i = 1; i < lines.length; i++) {
          let obj = {};
          let currentLines = lines[i].split(',');
          for (let j = 0; j < headers.length; j++) {
            obj[headers[j]] = currentLines[j];
          }
          this.csvResult.push(obj);
        }
        this.csvResult.pop();
        this.csvResult.forEach((element, i) => {
          delete element['']
          delete element["\r"]
          return element;
        });
      }
    } else {
      this.csvFile = true
    }
  }

}
