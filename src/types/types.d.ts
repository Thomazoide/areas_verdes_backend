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