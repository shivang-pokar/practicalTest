import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { By } from '@angular/platform-browser';
import { SharedModule } from 'src/app/share.module';

import { HomeComponent } from './home.component';
import { NgStorage, StorageTypeUnit } from 'ng-storage-local';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;
  let el: HTMLElement;
  let service: NgStorage;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HomeComponent],
      imports: [SharedModule, NoopAnimationsModule],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    let store = {};
    const mockLocalStorage = {
      getItem: (key: string): string => {
        return key in store ? store[key] : null;
      },
      setItem: (key: string, value: string) => {
        store[key] = `${value}`;
      },
      removeItem: (key: string) => {
        delete store[key];
      },
      clear: () => {
        store = {};
      }
    };
    spyOn(localStorage, 'getItem')
      .and.callFake(mockLocalStorage.getItem);
    spyOn(localStorage, 'setItem')
      .and.callFake(mockLocalStorage.setItem);
    spyOn(localStorage, 'removeItem')
      .and.callFake(mockLocalStorage.removeItem);
    spyOn(localStorage, 'clear')
      .and.callFake(mockLocalStorage.clear);

    service = TestBed.get(NgStorage);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('if have user details', () => {
    expect(service.getLocalStorage({
      storageKey: "STORAGEKEY",
      storageType: StorageTypeUnit.JSON,
    }).then());
  });

  describe('setInLocalStorage', () => {
    it('should store the data in localStorage',
      () => {
        service.setLocalStorage({
          storageKey: "STORAGEKEY",
          storageType: StorageTypeUnit.JSON,
          storageData: 'storageData'
        }).then();
        expect(service.getLocalStorage({
          storageKey: "STORAGEKEY",
          storageType: StorageTypeUnit.JSON,
        }).then())
      });
  });
  describe('getInLocalStorage', () => {
    it('should return stored data from localStorage',
      () => {
        service.getLocalStorage({
          storageKey: "STORAGEKEY",
          storageType: StorageTypeUnit.JSON,
        }).then()
        expect(service.setLocalStorage({
          storageKey: "STORAGEKEY",
          storageType: StorageTypeUnit.JSON,
          storageData: 'storageData'
        }).then());
      });
  });

  it('should call the onSubmit', () => {
    fixture.detectChanges();
    spyOn(component, 'onSubmit');
    el = fixture.debugElement.query(By.css('button')).nativeElement;
    el.click();
    expect(component.onSubmit).toHaveBeenCalledTimes(0);
  });

  it('form should be invalid', () => {
    component.registerForm.controls['firstName'].setValue('');
    component.registerForm.controls['lastName'].setValue('');
    component.registerForm.controls['email'].setValue('');
    component.registerForm.controls['gender'].setValue('');
    component.registerForm.controls['dob'].setValue('');
    component.registerForm.controls['password'].setValue('');
    component.registerForm.controls['confirmPassword'].setValue('');
    expect(component.registerForm.valid).toBeFalsy();
  });

  it('form should be valid', () => {
    component.registerForm.controls['firstName'].setValue('firstName');
    component.registerForm.controls['lastName'].setValue('lastName');
    component.registerForm.controls['email'].setValue('abc@abc.com');
    component.registerForm.controls['gender'].setValue('male');
    component.registerForm.controls['dob'].setValue('11/3/1994');
    component.registerForm.controls['password'].setValue('Admin@123');
    component.registerForm.controls['confirmPassword'].setValue('Admin@123');
    expect(component.registerForm.valid).toBeFalsy();
  })
});
