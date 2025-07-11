import { Body, Controller, Get, Param, ParseIntPipe, Post } from "@nestjs/common";
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

    @Get(":id")
    async FindByID(
        @Param("id", ParseIntPipe)
        id: number
    ): Promise<responsePayload<Vehiculo>> {
        try {
            return {
                message: "Vehiculo encontrado",
                data: await this.service.FindByID(id),
                error: false
            }
        } catch(e) {
            return {
                message: (e as Error).message,
                error: true
            }
        }
    }

    @Get()
    async FindAll(): Promise<responsePayload<Array<Vehiculo>>> {
        try {
            return {
                message: "Vehiculos encontrados",
                data: await this.service.FindAll(),
                error: false
            };
        } catch(e) {
            return {
                message: (e as Error).message,
                error: true
            };
        }
    }
};