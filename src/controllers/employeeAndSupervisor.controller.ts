import { Body, Controller, Get, Param, ParseIntPipe, Post } from "@nestjs/common";
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

    @Get("supervisores")
    async FindAllSupervisors(): Promise<responsePayload<Array<Supervisor>>> {
        try {
            return {
                message: "supervisores encontrados",
                data: await this.service.GetAllSupervisors(),
                error: false
            };
        } catch(e) {
            return {
                message: (e as Error).message,
                error: true
            };
        };
    }

    @Get("trabajadores")
    async FindAllEmployees(): Promise<responsePayload<Array<Empleado>>> {
        try {
            return {
                message: "trabajadores encontrados",
                data: await this.service.GetAllEmployees(),
                error: false
            };
        } catch(e) {
            return {
                message: (e as Error).message,
                error: true
            };
        };
    }

    @Post("trabajadores/add-many")
    async AddManyEmployees(
        @Body()
        data: Array<Empleado>
    ): Promise<responsePayload<Array<Empleado>>> {
        try {
            return {
                message: "trabajdores agregados",
                data: await this.service.AddManyEmployees(data),
                error: false
            };
        } catch(e) {
            return {
                message: (e as Error).message,
                error: true
            };
        };
    }

    @Get("supervisor/:id")
    async GetSupervisorByID(
        @Param("id", ParseIntPipe)
        id: number
    ): Promise<responsePayload<Supervisor>> {
        try {
            return {
                message: "Supervisor/a encontrado/a!",
                data: await this.service.FindSupervisorByID(id),
                error: false
            };
        } catch(e) {
            return {
                message: (e as Error).message,
                error: true
            };
        }
    }
};