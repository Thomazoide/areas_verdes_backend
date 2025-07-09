import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { vehicleNotFoundError } from "src/errors/errors";
import { Vehiculo } from "src/models/vehiculo.model";
import { Repository } from "typeorm";

@Injectable()
export class VehicleService {
    constructor(
        @InjectRepository(Vehiculo)
        private readonly vehicleRepo: Repository<Vehiculo>
    ){};

    async CreateVehicle(vehicle: Partial<Vehiculo>): Promise<Vehiculo> {
        const newVehicle = this.vehicleRepo.create(vehicle);
        return this.vehicleRepo.save(newVehicle);
    }

    async FindByID(id: number): Promise<Vehiculo> {
        const vehicle = await this.vehicleRepo.findOneBy({id});
        if(!vehicle) throw vehicleNotFoundError;
        return vehicle;
    }

    async FindByPlate(plate: string): Promise<Vehiculo> {
        const vehicle = await this.vehicleRepo.findOneBy({patente: plate});
        if(!vehicle) throw vehicleNotFoundError;
        return vehicle;
    }

    async UpdateVehicle(vehicle: Partial<Vehiculo>): Promise<Vehiculo> {
        const exists = await this.vehicleRepo.findOneBy({id: vehicle.id});
        if(!exists) throw vehicleNotFoundError;
        return this.vehicleRepo.save(vehicle);
    }
};