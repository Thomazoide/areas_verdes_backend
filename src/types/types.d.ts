export type Punto = {
    lat: number;
    lng: number;
};

export interface responsePayload<T> {
    message: string;
    data?: T;
    error: boolean;
}