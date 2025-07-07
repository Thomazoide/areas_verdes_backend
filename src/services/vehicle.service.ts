import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Vehiculo } from "src/models/vehiculo.model";
import { Repository } from "typeorm";

@Injectable()
export class VehicleService {
    constructor(
        @InjectRepository(Vehiculo)
        private readonly vehicleRepo: Repository<Vehiculo>
    ){};

    notFoundError: Error = new Error("vehiculo no encontrado");

    async CreateVehicle(vehicle: Partial<Vehiculo>): Promise<Vehiculo> {
        const newVehicle = this.vehicleRepo.create(vehicle);
        return this.vehicleRepo.save(newVehicle);
    }

    async FindByID(id: number): Promise<Vehiculo> {
        const vehicle = await this.vehicleRepo.findOneBy({id});
        if(!vehicle) throw this.notFoundError;
        return vehicle;
    }

    async FindByPlate(plate: string): Promise<Vehiculo> {
        const vehicle = await this.vehicleRepo.findOneBy({patente: plate});
        if(!vehicle) throw this.notFoundError;
        return vehicle;
    }

    async UpdateVehicle(vehicle: Partial<Vehiculo>): Promise<Vehiculo> {
        const exists = await this.vehicleRepo.findOneBy({id: vehicle.id});
        if(!exists) throw this.notFoundError;
        return this.vehicleRepo.save(vehicle);
    }
};