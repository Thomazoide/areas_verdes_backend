import { Body, Controller, Get, Param, ParseIntPipe, Post } from "@nestjs/common";
import { Registro } from "src/models/registros.model";
import { RegistroService } from "src/services/registro.service";
import { responsePayload } from "src/types/types";

@Controller("/registros")
export class RegistroController {
    constructor(
        private readonly service: RegistroService
    ){}

    @Get()
    async FindAll(): Promise<responsePayload<Registro[]>> {
        try {
            return {
                message: "Todos los registros",
                data: await this.service.GetAll(),
                error: false
            };
        } catch(e) {
            return {
                message: (e as Error).message,
                error: true
            };
        }
    }

    @Post()
    async AddRegistro(
        @Body()
        data: Partial<Registro>
    ): Promise<responsePayload<Registro>> {
        try {
            return {
                message: "Registro agregado",
                data: await this.service.AddRegistro(data),
                error: false
            };
        } catch(e) {
            return {
                message: (e as Error).message,
                error: true
            };
        }
    }

    @Get(":supervisor_id")
    async GetBySupervisorID(
        @Param("supervisor_id", ParseIntPipe)
        supervisor_id: number
    ): Promise<responsePayload<Registro[]>> {
        try {
            return {
                message: "Registros encontrados",
                data: await this.service.GetBySupervisorID(supervisor_id),
                error: false
            };
        } catch(e) {
            return {
                message: (e as Error).message,
                error: true
            };
        }
    }
}