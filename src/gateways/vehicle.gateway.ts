import { MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer, WsException } from "@nestjs/websockets";
import { Server } from "socket.io";
import { Vehiculo } from "src/models/vehiculo.model";
import { VehicleService } from "src/services/vehicle.service";
import { vehiclePosition } from "src/types/types";
import { UseFilters } from "@nestjs/common";
import { WebSocketExceptionFilter } from "src/exceptions/websocket-exceptions.filter";

@WebSocketGateway({namespace: "/position"})
@UseFilters(WebSocketExceptionFilter)
export class VehicleGateway {
    @WebSocketServer()
    server: Server;
    constructor(
        private readonly service: VehicleService
    ){};

    private parseTimestamp(timestamp: any): Date | null {
        if (!timestamp) return null;
        
        if (timestamp instanceof Date) {
            return timestamp;
        }
        
        if (typeof timestamp === 'string') {
            // Intentar parsear diferentes formatos de timestamp
            const parsedDate = new Date(timestamp);
            
            if (!isNaN(parsedDate.getTime())) {
                return parsedDate;
            }
            
            // Si falla, intentar con formato ISO
            try {
                const isoDate = new Date(timestamp.replace(/GMT([+-]\d{2}):(\d{2})/, 'GMT$1$2'));
                if (!isNaN(isoDate.getTime())) {
                    return isoDate;
                }
            } catch (error) {
                console.error('Error parsing ISO timestamp:', error);
            }
        }
        
        return null;
    }

    @SubscribeMessage("actualizar-posicion")
    async UpdatePosition(
        @MessageBody()
        data: Partial<Vehiculo>
    ): Promise<Vehiculo> {
        try {
            // Validar que los datos sean válidos
            if (!data || typeof data !== 'object') {
                throw new Error('Datos inválidos para actualizar posición');
            }
            
            // Procesar el timestamp si viene como string
            if (data.timestamp) {
                const originalTimestamp = data.timestamp;
                data.timestamp = this.parseTimestamp(data.timestamp);
                
                if (!data.timestamp) {
                    console.error('Error parseando timestamp:', originalTimestamp);
                    throw new Error('Formato de timestamp inválido');
                }
            }
            
            const updated = await this.service.UpdateVehicle(data);
            this.server.emit("Posición actualizada", updated);
            return updated;
        } catch (error) {
            console.error('Error en UpdatePosition:', error);
            throw new WsException(error instanceof Error ? error.message : 'Error actualizando posición');
        }
    }

    @SubscribeMessage("obtener-posicion")
    async GetPosition(
        @MessageBody()
        data: {id: number}
    ): Promise<vehiclePosition> {
        try {
            // Validar que los datos sean válidos
            if (!data || typeof data.id !== 'number') {
                throw new Error('ID del vehículo inválido');
            }
            
            const vehiculo = await this.service.FindByID(data.id);
            const positionData = vehiculo.GetPositionData();
            console.log(positionData);
            this.server.emit("posicion-actualizada", positionData);
            return positionData;
        } catch (error) {
            console.error('Error en GetPosition:', error);
            throw new WsException(error instanceof Error ? error.message : 'Error obteniendo posición');
        }
    }
};