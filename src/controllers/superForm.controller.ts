import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post } from "@nestjs/common";
import { superFormNotFoundError } from "src/errors/errors";
import { SuperForm } from "src/models/superForm.model";
import { SuperFormService } from "src/services/superForm.service";
import { responsePayload } from "src/types/types";

@Controller("super-form")
export class SuperFormController {
    constructor(
        private readonly service: SuperFormService
    ){}

    @Post()
    async CreateOrUpdateSuperForm(
        @Body()
        data: Partial<SuperForm>
    ): Promise<responsePayload<SuperForm>> {
        try {
            return {
                message: "Super formulario creado/actualizado",
                data: await this.service.CreateOrUpdateSuperForm(data),
                error: false
            };
        } catch(err) {
            return {
                message: (err as Error).message,
                error: true
            };
        }
    }

    @Get()
    async GetAllSuperForms(): Promise<responsePayload<SuperForm[]>> {
        try {
            return {
                message: "super formularios encontrados",
                data: await this.service.GetAllSuperForms(),
                error: false
            };
        } catch(err) {
            return {
                message: (err as Error).message,
                error: true
            };
        }
    }

    @Get("by-id/:id")
    async GetSuperFormByID(
        @Param("id", ParseIntPipe)
        id: number
    ): Promise<responsePayload<SuperForm>> {
        try {
            const found = await this.service.FindSuperFormByID(id);
            if(!found) throw superFormNotFoundError;
            return {
                message: "Super formulario encontrado",
                data: found,
                error: false
            };
        } catch(err) {
            return {
                message: (err as Error).message,
                error: true
            };
        }
    }

    @Get("by-order-id/:id")
    async GetSuperFormByWorkOrderID(
        @Param("id", ParseIntPipe)
        id: number
    ): Promise<responsePayload<SuperForm>> {
        try {
            const found = await this.service.FindSuperFormByWorkOrderID(id);
            if(!found) throw superFormNotFoundError;
            return {
                message: "Super formulario encontrado",
                data: found,
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
    async DeletSuperFormByID(
        @Param("id", ParseIntPipe)
        id: number
    ): Promise<responsePayload<SuperForm>> {
        try {
            return {
                message: "Super formulario eliminado",
                data: await this.service.DeleteSuperFormByID(id),
                error: false
            };
        } catch(err) {
            return {
                message: (err as Error).message,
                error: true
            };
        }
    }
}