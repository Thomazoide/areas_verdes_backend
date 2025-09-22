export type Punto = {
    lat: number;
    lng: number;
};

export interface responsePayload<T> {
    message: string;
    data?: T;
    error: boolean;
}

export interface checkMACReqBody {
    mac: string
}

export interface vehiclePosition {
    vehiculoId: number;
    lat: number;
    lng: number;
    timestamp: Date;
    speed: number;
    heading: number;
}

export interface SignInPayload {
    rut: string;
    patente: string;
}

export enum NIVEL_DE_BASURA {
    ALTO = "ALTO",
    MEDIO = "MEDIO",
    BAJO = "BAJO"
};