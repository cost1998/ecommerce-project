import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { City } from 'src/app/common/city';
import { Country } from 'src/app/common/country';
import { FormService } from 'src/app/services/form.service';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {

  checkoutFormGroup: FormGroup;

  totalPrice: number = 0;
  totalQuantity: number = 0;

  creditCardYears: number[] = [];
  creditCardMonths: number[] = [];

  countries: Country[] = [];

  shippingAddressCities: City[] = [];
  billingAddressCities: City[] = [];

  constructor(private formBuidler: FormBuilder,
    private formService: FormService) { }

  ngOnInit(): void {

    this.checkoutFormGroup = this.formBuidler.group({
      customer: this.formBuidler.group({
        firstName: [' '],
        lastName: [' '],
        email: [' '],
        phoneNumber: [' ']
      }),
      shippingAddress: this.formBuidler.group({
        street: [' '],
        city: [' '],
        country: [' '],
        zipCode: [' '],
        county: [' ']
      }),
      billingAddress: this.formBuidler.group({
        street: [' '],
        city: [' '],
        country: [' '],
        zipCode: [' '],
        county: [' ']
      }),
      creditCard: this.formBuidler.group({
        cardType: [' '],
        nameOnCard: [' '],
        cardNumber: [' '],
        securityCode: [' '],
        expirationMonth: [' '],
        expirationYear: [' ']
      })
    });
    //populate credit card months

    const startMonth: number = new Date().getMonth() + 1;

    this.formService.getCreditCardMonths(startMonth).subscribe(
      data => {
        this.creditCardMonths = data;
      }
    );

    // populate credit card years

    this.formService.getCreditCardYears().subscribe(
      data => {
        this.creditCardYears = data;
      }
    );

    // populate countries

    this.formService.getCountries().subscribe(
      data => {
        this.countries = data;
      }
    );

  }

  copyShippingAddressToBillingAddress(event) {
    if (event.target.checked) {
      this.checkoutFormGroup.controls.billingAddress
        .setValue(this.checkoutFormGroup.controls.shippingAddress.value);
    }
    else {
      this.checkoutFormGroup.controls.billingAddress.reset();
    }
  }

  onSubmit() {
    console.log("Handling the submit button")
    console.log(this.checkoutFormGroup.get('customer').value);
  }

  handleMonthAndYears() {

    const creditCardFormGroup = this.checkoutFormGroup.get('creditCard');

    const currentYear: number = new Date().getFullYear();
    const selectedYear: number = Number(creditCardFormGroup.value.expirationYear);

    // if current year equals the selected year, then start with the current month

    let startMonth: number;

    if (currentYear === selectedYear) {
      startMonth = new Date().getMonth() + 1;
    }
    else {
      startMonth = 1;
    }

    this.formService.getCreditCardMonths(startMonth).subscribe(
      data => {
        this.creditCardMonths = data;
      }
    );
  }

  getCities(formGroupName: string) {

    const formGroup = this.checkoutFormGroup.get(formGroupName);

    const countryCode = formGroup.value.country.code;
    const countryName = formGroup.value.country.code;

    this.formService.getCities(countryCode).subscribe(
      data => {

        if (formGroupName === 'shippingAddress') {

          this.shippingAddressCities = data;
        }
        else {
          this.billingAddressCities = data;
        }

        //select first item by default
        formGroup.get('city').setValue(data[0]);
      }
    );


  }

}
