import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { entityDeleteError, workOrderNotFoundError } from "src/errors/errors";
import { WorkOrder } from "src/models/workOrder.models";
import { Repository } from "typeorm";

@Injectable()
export class WorkOrderService {
    constructor(
        @InjectRepository(WorkOrder)
        private readonly repo: Repository<WorkOrder>
    ){};


    async CreateOrUpdateOrder(data: Partial<WorkOrder>): Promise<WorkOrder>{
        return await this.repo.save(data);
    }

    async GetAllOrders(): Promise<WorkOrder[]> {
        return await this.repo.find({
            relations: [
                "equipo",
                "visitForm"
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
                "visitForm"
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
                "visitForm"
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
        const deleteResult = await this.repo.delete(exists);
        if(deleteResult.affected === 0) throw entityDeleteError;
        return exists;
    }

};