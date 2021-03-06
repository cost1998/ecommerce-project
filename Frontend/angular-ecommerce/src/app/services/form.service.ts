import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { City } from '../common/city';
import { Country } from '../common/country';

@Injectable({
  providedIn: 'root'
})
export class FormService {

  private countriesUrl = "http://localhost:8080/api/countries";
  private citiessUrl = "http://localhost:8080/api/cities";


  constructor(private httpClient: HttpClient) { }

  getCountries(): Observable<Country[]> {

    return this.httpClient.get<GetResponseCountries>(this.countriesUrl).pipe(
      map(response => response._embedded.countries)
    );
  }

  getCities(theCountryCode: string): Observable<City[]> {
    //search url
    const searchCitiesUrl = `${this.citiessUrl}/search/findByCountryCode?code=${theCountryCode}`;
  
    return this.httpClient.get<GetResponseCities>(searchCitiesUrl).pipe(
      map(response => response._embedded.cities)
    );
  }

  getCreditCardMonths(startMonth: number): Observable<number[]> {

    let data: number[]=[];

    //build an array for "Month" dropdown list
    //start at current month and lopp until

    for(let theMonth = startMonth; theMonth <=12; theMonth++) {
      data.push(theMonth);
    }
    return of(data);
  }

  getCreditCardYears(): Observable<number[]> {

    let data: number[] = [];

    //build an array for "Year" downlist
    // start at current year and loop for next 10 years

    const startYear: number = new Date().getFullYear();
    const endYear: number = startYear +10;

    for(let theYear = startYear; theYear <= endYear; theYear++){
      data.push(theYear);
    }

    return of(data);
  }
}

interface GetResponseCountries {
  _embedded: {
    countries: Country[];
  }
}

interface GetResponseCities {
  _embedded: {
    cities: City[];
  }
}
