import { Component, Inject, Input, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { VisitorResponse } from 'src/app/models/visitor';
import { VisitorService } from 'src/app/services/visitor.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { EmployeeService } from 'src/app/services/employee.service';
import { LocationService } from 'src/app/services/location.service';
import { DeliveriesComponent } from 'src/app/breezie-dashboard/deliveries/deliveries.component';
import { DeliveriesService } from 'src/app/services/deliveries.service';
import { EmployeeResponse } from 'src/app/models/employeeResponse';

@Component({
  selector: 'app-deliveries-update',
  templateUrl: './deliveries-update.component.html',
  styleUrls: ['./deliveries-update.component.css']
})
export class DeliveriesUpdateComponent implements OnInit {
  deliveryForm: FormGroup;
  filteredOptions;
  fullName: string;
  display: boolean = true;
  nodata: boolean = false;
  employee: EmployeeResponse[] = [];
  deliveryData:any;
  spinner: boolean = false;

  constructor(private fb: FormBuilder,
    private employeeService: EmployeeService,
    private deliveryService: DeliveriesService,
    private toastr: ToastrService,
    private delivaryService: DeliveriesService,
    @Inject(MAT_DIALOG_DATA) public editData: any,
    private dialogRef: MatDialogRef<DeliveriesUpdateComponent>) {


     }

  ngOnInit(): void {
    this.deliveryForm = this.fb.group({
      empId: new FormControl('', [Validators.required]),
      emailNote: new FormControl('', [Validators.pattern(/^[a-zA-Z0-9._]+@[a-zA-Z0-9.]+\.[a-zA-Z]{2,4}$/), Validators.email]),

    });

    // if (this.editData) {
    //   this.deliveryForm.controls['empId'].setValue(this.editData.empId);
    // }
    this.getEmployee();
    this.initForm();
    this.getDeliveryData();
    this.disableButton= false;

  }

  getDeliveryData() {
    this.deliveryService.serviceData.subscribe(res => {
      this.deliveryData = res;
      // console.log(this.deliveryData.recepient.split(" ")[0])
      let reciepient_name = this.deliveryData.recepient

      this.deliveryForm.patchValue({
        empId: reciepient_name,
        emailNote: this.deliveryData.Note
       })
    })
  }

  onUpdateDelivery() {
    this.spinner = true
    let finalDate = new Date();
    this.deliveryForm.get('deliveryTime').setValue(finalDate);
    if(this.empIds === undefined) {
      let data = {
        empId: this.editData.empId,
        emailNote: this.deliveryForm.get('emailNote').value,
        deliveryTime: this.deliveryForm.get('deliveryTime').value,
        signatureRequired: this.deliveryForm.get('signatureRequired').value
      }
      this.deliveryService.updateDelivery(this.editData._id, data).subscribe((res) => {
        if (!res.error) {
          this.spinner = false
          this.toastr.success(res.message);
          this.deliveryForm.reset();
          this.dialogRef.close(true);
        } else {
          this.toastr.error(res.message);
        }
      }, err => {
        if (err.status) {
          this.toastr.error(err.error.message);
        } else {
          this.toastr.error("CONNECTION_ERROR");
        }
      });

    } else {
      let data = {
        empId: this.empIds,
        emailNote: this.deliveryForm.get('emailNote').value,
        deliveryTime: this.deliveryForm.get('deliveryTime').value,
        signatureRequired: this.deliveryForm.get('signatureRequired').value
      }
      this.deliveryService.updateDelivery(this.editData._id, data).subscribe((res) => {
        if (!res.error) {
          this.spinner = false
          this.toastr.success(res.message);
          this.deliveryForm.reset();
          this.dialogRef.close(true);
        } else {
          this.toastr.error(res.message);
        }
      }, err => {
        if (err.status) {
          this.toastr.error(err.error.message);
        } else {
          this.toastr.error("CONNECTION_ERROR");
        }
      });
    }

  }


  _id: string
  searchData:any
  initForm() {
    this.deliveryForm = this.fb.group({
      empId: ['', Validators.required],
      emailNote: ['', Validators.required],
      deliveryTime: [''],
      signatureRequired: [false]
    })
    this.deliveryForm.get('empId').valueChanges.subscribe(response => {
      this.searchData = response?.toLowerCase()
      if (response && response.length > 2) {
        this.filterData(response);
      } else {
        this.filteredOptions = [];
      }
    })
  }

  empIds: any
  disableButton:Boolean=false
  filterData(enterData) {
    this.filteredOptions = this.employee.filter(item => {
      if (item.fullName.toLowerCase().indexOf(enterData.toLowerCase()) > -1) {
        this.empIds = item._id
      }
      return item.fullName.toLowerCase().indexOf(enterData.toLowerCase()) > -1
    });
    this.nodata = true;
    if(this.searchData === this.filteredOptions[0]?.fullName.toLowerCase()){
      this.disableButton= false;
    }else{
    this.disableButton= true
  }
  }

  getEmployee() {
    this.employeeService.getEmployee().subscribe(res => {
      this.employee = res.employeeData;
    });
  }
}
