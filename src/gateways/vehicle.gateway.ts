import { MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Server } from "socket.io";
import { Vehiculo } from "src/models/vehiculo.model";
import { VehicleService } from "src/services/vehicle.service";

@WebSocketGateway({namespace: "/position"})
export class VehicleGateway {
    @WebSocketServer()
    server: Server;
    constructor(
        private readonly service: VehicleService
    ){};

    @SubscribeMessage("actualizar-posicion")
    async UpdatePosition(
        @MessageBody()
        data: Partial<Vehiculo>
    ): Promise<Vehiculo> {
        const updated = await this.service.UpdateVehicle(data);
        this.server.emit("Posición actualizada", updated);
        return updated;
    }

    @SubscribeMessage("obtener-posicion")
    async GetPosition(
        @MessageBody()
        data: {id: number}
    ): Promise<Vehiculo> {
        const vehiculo = await this.service.FindByID(data.id);
        return vehiculo;
    }
};