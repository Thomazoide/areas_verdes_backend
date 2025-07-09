import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { VehicleController } from "src/controllers/vehicle.controller";
import { VehicleGateway } from "src/gateways/vehicle.gateway";
import { Vehiculo } from "src/models/vehiculo.model";
import { VehicleService } from "src/services/vehicle.service";

@Module({
    imports: [TypeOrmModule.forFeature([Vehiculo])],
    controllers: [VehicleController],
    providers: [VehicleService, VehicleGateway]
})
export class VehicleModule {};