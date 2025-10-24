import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post } from "@nestjs/common";
import { WorkOrder } from "src/models/workOrder.models";
import { WorkOrderService } from "src/services/workOrder.service";
import { responsePayload } from "src/types/types";

@Controller("ordenes")
export class WorkOrderController {
    constructor(
        private readonly service: WorkOrderService
    ){};

    @Get()
    async GetAllOrders(): Promise<responsePayload<WorkOrder[]>> {
        try {
            return {
                message: "Ordenes de trabajo",
                data: await this.service.GetAllOrders(),
                error: false
            };
        } catch(err) {
            return {
                message: (err as Error).message,
                error: true
            };
        }
    }

    @Post()
    async CreateOrUpdateOrder(
        @Body()
        data: Partial<WorkOrder>
    ): Promise<responsePayload<WorkOrder>> {
        try {
            return {
                message: "Orden creada/actualizada",
                data: await this.service.CreateOrUpdateOrder(data),
                error: false
            };
        } catch(err) {
            return {
                message: (err as Error).message,
                error: true
            };
        }
    }

    @Delete(":id")
    async DeleteOrderByID(
        @Param("id", ParseIntPipe)
        ID: number
    ): Promise<responsePayload<WorkOrder>> {
        try {
            return {
                message: "Orden de trabajo eliminada",
                data: await this.service.DeletOrderByID(ID),
                error: false
            };
        } catch(err) {
            return {
                message: (err as Error).message,
                error: true
            };
        }
    }

    @Get("equipo/:teamID")
    async GetOrdersByTeamID(
        @Param("teamID", ParseIntPipe)
        teamID: number
    ): Promise<responsePayload<WorkOrder[]>> {
        try {
            return {
                message: `Ordenes completadas por el equipo ${teamID}`,
                data: await this.service.GetTeamOrders(teamID),
                error: false
            };
        } catch(err) {
            return {
                message: (err as Error).message,
                error: true
            };
        }
    }

    @Get("formulario/:formID")
    async GetOrderByFormID(
        @Param("formID", ParseIntPipe)
        formID: number
    ): Promise<responsePayload<WorkOrder>> {
        try {
            return {
                message: `Orden correspondiente al formulario ${formID}`,
                data: await this.service.GetOrderByForm(formID),
                error: false
            };
        } catch(err) {
            return {
                message: (err as Error).message,
                error: true
            }
        }
    }
};