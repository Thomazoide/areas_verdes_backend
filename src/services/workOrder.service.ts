import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
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

};