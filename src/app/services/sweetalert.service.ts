import { Injectable } from '@angular/core';
import Swal, { SweetAlertIcon } from 'sweetalert2';


@Injectable({ providedIn: 'root' })
export class SwalAlertDialogService {
  
  constructor() { }

  // Método para mostrar una alerta básica
  showAlert(title: string, message: string, icon: SweetAlertIcon = 'info'): void {
    Swal.fire({
      icon: icon,
      title: title,
      text: message
    });
  }

  // Método para mostrar una alerta de confirmación
  showConfirmation(title: string): Promise<any> {
    return Swal.fire({
      icon: 'success',
      title: title,
      showCancelButton: true,
      confirmButtonText: 'Aceptar',
      cancelButtonText: 'Cancelar'
    });
  }

  // Método para mostrar una alerta de confirmación
  showError(title: string, message: string): Promise<any> {
    return Swal.fire({
      icon: 'error',
      title: title,
      text: message,
      showCancelButton: false,
      showConfirmButton:true,
      confirmButtonText: 'Aceptar',
    });
  }


  showLoader(message?: string){
    return Swal.fire({
      allowEscapeKey: true,
      allowOutsideClick: false,
      didOpen: () => Swal.showLoading(),
      ...(message && { text: message }),
    });
  }

  hideLoader(){
    return Swal.close()
  }
}
