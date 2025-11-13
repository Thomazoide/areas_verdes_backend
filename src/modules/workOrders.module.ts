import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { WorkOrderController } from "src/controllers/workOrder.controller";
import { SuperForm } from "src/models/superForm.model";
import { WorkOrder } from "src/models/workOrder.models";
import { WorkOrderService } from "src/services/workOrder.service";

@Module({
    imports: [TypeOrmModule.forFeature([WorkOrder, SuperForm])],
    controllers: [WorkOrderController],
    providers: [WorkOrderService]
})
export class WorkOrdersModule {};