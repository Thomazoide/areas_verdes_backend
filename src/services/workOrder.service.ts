import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { workOrderNotFoundError } from "src/errors/errors";
import { WorkOrder } from "src/models/workOrder.models";
import { SuperForm } from "src/models/superForm.model";
import { Repository } from "typeorm";

@Injectable()
export class WorkOrderService {
    constructor(
        @InjectRepository(WorkOrder)
        private readonly repo: Repository<WorkOrder>,
        @InjectRepository(SuperForm)
        private readonly sfRepo: Repository<SuperForm>
    ){};


    async CreateOrUpdateOrder(data: Partial<WorkOrder>): Promise<WorkOrder>{
        if(data.superFormID) {
            const sf = await this.sfRepo.findOneBy({
                id: data.superFormID
            });
            if(!sf) throw new Error("super formulario no existente");
            data.superForm = sf;
            return await this.repo.save(data)
        }
        return await this.repo.save(data);
    }

    async GetAllOrders(): Promise<WorkOrder[]> {
        return await this.repo.find({
            relations: [
                "equipo",
                "visitForm",
                "zona",
                "superForm"
            ]
        });
    }

    async GetTeamOrders(teamID: number): Promise<WorkOrder[]> {
        return await this.repo.find({
            where: {
                equipoID: teamID
            },
            relations: [
                "equipo",
                "visitForm",
                "zona",
                "superForm"
            ]
        });
    }

    async GetOrderByForm(formID: number): Promise<WorkOrder> {
        return await this.repo.findOne({
            where: {
                visitFormID: formID
            },
            relations: [
                "equipo",
                "visitForm",
                "zona",
                "superForm"
            ]
        })
    }

    async DeletOrderByID(ID: number): Promise<WorkOrder> {
        const exists = await this.repo.findOne({
            where: {
                id: ID
            }
        });
        if(!exists) throw workOrderNotFoundError;
        await this.repo.delete(ID);
        return exists;
    }

};