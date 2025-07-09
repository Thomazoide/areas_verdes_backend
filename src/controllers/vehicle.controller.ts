import { Body, Controller, Post } from "@nestjs/common";
import { Vehiculo } from "src/models/vehiculo.model";
import { VehicleService } from "src/services/vehicle.service";
import { responsePayload } from "src/types/types";

@Controller("vehiculos")
export class VehicleController {
    constructor(
        private readonly service: VehicleService
    ){};

    @Post()
    async CreateVehicle(
        @Body()
        data: Partial<Vehiculo>
    ): Promise<responsePayload<Vehiculo>> {
        try{
            return {
                message: "Vehiculo creado",
                data: await this.service.CreateVehicle(data),
                error: false
            };
        }catch(e){
            return {
                message: (e as Error).message,
                error: true
            };
        }
    }
};