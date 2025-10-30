import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { superFormNotFoundError } from "src/errors/errors";
import { SuperForm } from "src/models/superForm.model";
import { Repository } from "typeorm";

@Injectable()
export class SuperFormService {
    constructor(
        @InjectRepository(SuperForm)
        private readonly repo: Repository<SuperForm>
    ){}

    async CreateOrUpdateSuperForm(data: Partial<SuperForm>): Promise<SuperForm> {
        return await this.repo.save(data);
    }

    async GetAllSuperForms(): Promise<SuperForm[]> {
        return await this.repo.find({
            relations: [
                "workOrder"
            ]
        });
    }

    async FindSuperFormByID(ID: number): Promise<SuperForm> {
        return await this.repo.findOne({
            where: {
                id: ID
            },
            relations: [
                "workOrder"
            ]
        });
    }

    async FindSuperFormByWorkOrderID(workOrderID: number): Promise<SuperForm> {
        return await this.repo.findOne({
            where: {
                workOrderID
            }
        })
    }

    async DeleteSuperFormByID(ID: number): Promise<SuperForm> {
        const exists = await this.repo.findOneBy({
            id: ID
        })
        if(!exists) throw superFormNotFoundError;
        await this.repo.delete(ID);
        return exists;
    }
}