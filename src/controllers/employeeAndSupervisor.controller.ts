import { Body, Controller, Post } from "@nestjs/common";
import { Empleado } from "src/models/empleado.model";
import { Supervisor } from "src/models/supervisor.model";
import { employeeAndSupervisorService } from "src/services/employeeAndSupervisor.service";
import { responsePayload } from "src/types/types";

@Controller()
export class EmployeeAndSupervisorController {
    constructor(
        private readonly service: employeeAndSupervisorService
    ){};

    @Post("trabajadores")
    async CreateEmployee(
        @Body()
        data: Partial<Empleado>
    ): Promise<responsePayload<Empleado>> {
        try {
            return {
                message: "Trabajador creado",
                data: await this.service.CreateEmployee(data),
                error: false
            };
        }catch(e){
            return {
                message: (e as Error).message,
                error: true
            };
        }
    }

    @Post("supervisores")
    async CreateSupervisor(
        @Body()
        data: Partial<Supervisor>
    ): Promise<responsePayload<Supervisor>> {
        try{
            return {
                message: "Supervisor creado",
                data: await this.service.CreateSupervisor(data),
                error: false
            };
        }catch(e){
            return {
                message: (e as Error).message,
                error: true
            };
        }
    }
};