export interface Cuenta {
    concepto: string;
    numeroItems: number;
    totalSaldo: number;
    _id: string;
  }
  
  export interface invoice {
    _id?: string;
    fecha: Date;
    totalItems: number;
    totalSaldo: number;
    cuentas: Cuenta[];
    createdAt: Date;
    updatedAt: Date;
  }