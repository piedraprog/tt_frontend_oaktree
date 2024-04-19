import { Component, Inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { InvoicesService } from './services/invoices.service';
import { SwalAlertDialogService } from './services/sweetalert.service';
import { CommonModule } from '@angular/common';
import { Observable, map, switchMap, tap } from 'rxjs';
import Swal from 'sweetalert2'; // Importa SweetAlert
import { invoice } from './interfaces/invoice.interface';
import moment from 'moment';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {



  invoices: Observable<any[]> = this.invoiceService.getInvoices();

  constructor(
    public invoiceService: InvoicesService,
    private readonly alertService: SwalAlertDialogService
  ) {}

  onSubmit(event: any, fileInput: any): void {
    // this.alertService.showLoader("Cargando Archivo")
    const file = fileInput.files[0];

    if (fileInput.files && fileInput.files.length > 0) {
      // Verificar si la extensión del archivo es .xlsx
      if (file.name.endsWith('.xlsx')) {
        // Si la extensión es .xlsx, proceder con la subida del archivo
        this.invoiceService
          .uploadFile(file)
          .pipe
          // tap(()=>this.alertService.showLoader())
          ()
          .subscribe(
            (response) => {
              // Maneja la respuesta del servidor
              console.log('Archivo subido exitosamente:', response);

              // this.alertService.hideLoader()
              this.alertService.showConfirmation('Archivo subido exitosamente');
            },
            (error) => {
              // Maneja los errores
              // this.alertService.hideLoader();
              this.alertService.showError('Error al subir el archivo:', error);
            }
          );
      } else {
        // Si la extensión no es .xlsx, mostrar un mensaje de error
        console.error('Error: El archivo debe tener extensión .xlsx');
      }
    } else {
      // Maneja los errores
      this.alertService.hideLoader();
      this.alertService.showError(
        'Error',
        'Debe selecciona un archivo para subir'
      );
    }


  }

  showInvoice(invoice: invoice) {
    Swal.fire({
      title: 'Detalles de la Factura',
      width: 600,
      html: `
      <div class="bg-white border rounded-lg shadow-lg px-6 py-8 max-w-md mx-auto mt-8">
          <h1 class="font-bold text-2xl mb-2 text-center text-blue-600">Factura</h1>
          <hr class="mb-2">
          <div class="flex justify-between mb-6 text-left">
              <div class="text-gray-700">
                  <div><strong>Fecha:</strong> ${moment(invoice.fecha).format("DD/MM/YYYY")}</div>
                  <div><strong>Factura nro:</strong> ${invoice._id}</div>
              </div>
          </div>
          <table class="w-full mb-8">
              <thead>
                  <tr>
                  <th class="text-left font-bold text-gray-700">Concepto</th>
                      <th class="text-left font-bold text-gray-700">Elementos</th>
                      <th class="text-right font-bold text-gray-700">Total</th>
                  </tr>
              </thead>
              <tbody
                ${invoice.cuentas.map((cuenta) => `
                  <tr>
                    <td class="text-left text-gray-700">
                      ${cuenta.concepto}
                    </td>
                    <td class="text-left">
                      ( ${cuenta.numeroItems} )
                    </td>
                    <td class="text-right"> 
                      ${cuenta.totalSaldo}
                    </td>
                  </tr>
                `).join('')}
              </tbody>
              <tfoot>
                  <tr>
                  <td class="text-left font-bold text-gray-700">Total</td>
                      <td class="text-left font-bold text-gray-700">( ${invoice.totalItems} )</td>
                      <td class="text-right font-bold text-gray-700">${invoice.totalSaldo.toFixed(2)}</td>
                  </tr>
              </tfoot>
          </table>
          <div class="text-gray-700 mb-2">Gracias por su confianza.</div>
        </div>
      `,
      confirmButtonText: 'Cerrar',
    });
  }


  generateInvoice() {

    this.invoiceService.generateInvoice().pipe(
      tap((data: any) => {
        if (data.length === 0) {
          throw new Error("No se han recibido datos del servicio de generación de facturas. Por favor suba un archivo.");
        }
      }),
      switchMap((data: any) => this.invoiceService.saveInvoice(data[0]))
    ).subscribe(
      () => {
        this.invoices = this.invoiceService.getInvoices();
        this.alertService.showConfirmation("Factura Guardada con exito");
      },
      (error) => {
        console.error("Error:", error);
        // Manejar errores
        this.alertService.showError("Error", error.message);
      }
    );
  }
}
