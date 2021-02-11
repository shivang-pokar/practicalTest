import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { Registration } from 'src/app/model/registration';
import * as moment from 'moment';
import { CustomValidators } from 'src/app/services/customValidators/custom-validators.service';
import { RegisterUserService } from 'src/app/services/registerUser/register-user.service';
import { GetStorageConflig, NgStorage, StorageConfig, StorageTypeUnit } from 'ng-storage-local';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AlertComponent } from 'src/app/components/alert/alert.component';
import { MatDialog } from '@angular/material/dialog';

const nonWhitespaceRegExp: RegExp = new RegExp("\\S");
const USERDATA = 'USERDATA';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {


  displayedColumns: string[] = ['delete', 'firstName', 'lastName', 'email', 'gender', 'dob', 'password'];
  dataSource = new MatTableDataSource<Registration>();
  registrationData: Array<Registration> = [];
  registerForm: FormGroup;
  startDate;

  firstName
  lastName
  email
  gender
  dob
  password;
  confirmPassword;

  resultsLength = 0;
  storageOption: StorageConfig = {
    storageData: "",
    storageKey: USERDATA,
    storageType: StorageTypeUnit.JSON
  };
  getStorageOption: GetStorageConflig;

  constructor(
    private formBuilder: FormBuilder,
    private registerUserService: RegisterUserService,
    public ngStorage: NgStorage,
    private snackBar: MatSnackBar,
    public dialog: MatDialog
  ) {


    this.startDate = moment().subtract(15, 'years').toISOString();

    this.registerForm = this.formBuilder.group({
      firstName: [null, Validators.compose([Validators.required, Validators.pattern(nonWhitespaceRegExp)])],
      lastName: [null, Validators.compose([Validators.required, Validators.pattern(nonWhitespaceRegExp)])],
      email: [null, Validators.compose([Validators.required])],
      gender: [null, Validators.compose([Validators.required])],
      dob: [null, Validators.required],
      password: [null,
        [
          Validators.required,
          CustomValidators.patternValidator(/\d/, {
            hasNumber: true
          }),
          CustomValidators.patternValidator(/[A-Z]/, {
            hasCapitalCase: true
          }),
          CustomValidators.patternValidator(/[a-z]/, {
            hasSmallCase: true
          }),
          CustomValidators.patternValidator(
            /[ !@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/,
            {
              hasSpecialCharacters: true
            }
          ),
          Validators.minLength(8),
        ]],
      confirmPassword: [null, [Validators.required]]
    }, {
      validator: CustomValidators.passwordMatchValidator
    });

    this.firstName = this.registerForm.controls['firstName'];
    this.lastName = this.registerForm.controls['lastName'];
    this.email = this.registerForm.controls['email'];
    this.gender = this.registerForm.controls['gender'];
    this.dob = this.registerForm.controls['dob'];
    this.password = this.registerForm.controls['password'];
    this.confirmPassword = this.registerForm.controls['confirmPassword'];

  }

  ngOnInit(): void {

    this.getStorageOption = {
      storageKey: USERDATA,
      storageType: StorageTypeUnit.JSON
    }
    this.ngStorage.getLocalStorage(this.getStorageOption).then(resp => {
      this.dataSource.data = JSON.parse(resp);
    }).catch(error => {
      console.log(error)
    });
  }

  onSubmit(form) {
    if (this.registerForm.valid) {
      let currentData = this.dataSource.data;
      currentData.push(this.registerUserService.createRegisterUserObj(this.registerForm.value))
      this.storeAndUpdteStorageData(currentData);
      form.resetForm();
      this.openTost('Data added successfully')
    }
    else {
      this.openTost('Something went wrong please check all fileds')
    }
  }

  delete(data) {
    let index = this.dataSource.data.findIndex(user => user.id == data.id)
    let currentData = this.dataSource.data;
    currentData.splice(index, 1);
    this.dataSource.data = currentData
    this.storeAndUpdteStorageData(currentData);
    this.openTost('Data removed successfully')
  }


  storeAndUpdteStorageData(currentData) {
    this.storageOption.storageData = JSON.stringify(currentData)
    this.ngStorage.setLocalStorage(this.storageOption).then(resp => {
      this.dataSource.data = currentData;
    }).catch(error => {
      console.log(error)
    });
  }

  openTost(message) {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
    });
  }

  openConfirmationDailog(row) {
    const dialogRef = this.dialog.open(AlertComponent);

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.delete(row)
      }
    });
  }

}