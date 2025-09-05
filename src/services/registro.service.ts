import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Registro } from "src/models/registros.model";
import { Repository } from "typeorm";

@Injectable()
export class RegistroService {
    constructor(
        @InjectRepository(Registro)
        private readonly repo: Repository<Registro>
    ){};

    async GetAll(): Promise<Registro[]> {
        return this.repo.find();
    }

    async AddRegistro(data: Partial<Registro>): Promise<Registro> {
        return this.repo.save(this.repo.create(data));
    }

    async GetBySupervisorID(supervisor_id: number): Promise<Registro[]> {
        return this.repo.find({
            where: {
                supervisor_id
            }
        });
    }

}