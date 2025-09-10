import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { EmployeeAndSupervisorController } from "src/controllers/employeeAndSupervisor.controller";
import { Empleado } from "src/models/empleado.model";
import { Supervisor } from "src/models/supervisor.model";
import { VisitForm } from "src/models/visitForms.model";
import { employeeAndSupervisorService } from "src/services/employeeAndSupervisor.service";

@Module({
    imports: [
        TypeOrmModule.forFeature([
            Empleado,
            Supervisor,
            VisitForm
        ])
    ],
    controllers: [EmployeeAndSupervisorController],
    providers: [employeeAndSupervisorService]
})
export class EmployeeAndServiceModule {};