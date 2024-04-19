import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map, of, pluck } from 'rxjs';
import { invoice } from '../interfaces/invoice.interface';
import moment from 'moment';

@Injectable({
  providedIn: 'root'
})
export class InvoicesService {

  constructor(
    private readonly http: HttpClient,
  ) { }


  url : string = "http://localhost:3000/api/invoice";

  uploadFile(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);

    const headers = new HttpHeaders();
    headers.append('Content-Type', 'multipart/form-data');

    return this.http.post<any>(`${this.url}/upload`, formData, { headers: headers });
  }

  generateInvoice() {
    return this.http
      .get(`${this.url}/generate`)
      .pipe(
        map((data: any) => data.data)
      );
  }

  saveInvoice(invoice: any) {

    invoice['fecha'] = moment().format()

    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };

    return this.http.post<any>(`${this.url}/save`, invoice, options);
  }

  getInvoices() {
    return this.http
      .get(`${this.url}/invoices?page=0&size=100`)
      .pipe(
        // pluck('data'),
        map((data: any) => data.results.reverse())
      );
  }
  
}

