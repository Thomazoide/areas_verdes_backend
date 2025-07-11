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
        try {
            if (!id || isNaN(id)) {
                throw new Error('ID del vehículo inválido');
            }
            
            const vehicle = await this.vehicleRepo.findOneBy({id});
            if(!vehicle) throw vehicleNotFoundError;
            return vehicle;
        } catch (error) {
            // Asegurar que el error sea un objeto Error válido
            if (error instanceof Error) {
                throw error;
            }
            throw new Error('Error desconocido al buscar vehículo');
        }
    }

    async FindByPlate(plate: string): Promise<Vehiculo> {
        const vehicle = await this.vehicleRepo.findOneBy({patente: plate});
        if(!vehicle) throw vehicleNotFoundError;
        return vehicle;
    }

    async UpdateVehicle(vehicle: Partial<Vehiculo>): Promise<Vehiculo> {
        try {
            if (!vehicle.id) {
                throw new Error('ID del vehículo es requerido');
            }
            
            const exists = await this.vehicleRepo.findOneBy({id: vehicle.id});
            if(!exists) throw vehicleNotFoundError;
            
            const updated = await this.vehicleRepo.save(vehicle);
            return updated;
        } catch (error) {
            // Asegurar que el error sea un objeto Error válido
            if (error instanceof Error) {
                throw error;
            }
            throw new Error('Error desconocido al actualizar vehículo');
        }
    }

    async FindAll(): Promise<Array<Vehiculo>> {
        return this.vehicleRepo.find();
    }
};