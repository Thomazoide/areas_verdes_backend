import { BadRequestException, Controller, Post, Body, UseInterceptors, UploadedFile, Get, Param, ParseIntPipe } from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { VisitForm } from "src/models/visitForms.model";
import { VisitFormService } from "src/services/visitForm.service";
import { responsePayload } from "../types/types";
import { NIVEL_DE_BASURA } from "../types/types";

@Controller("formularios")
export class VisitFormController {
    constructor(private readonly service: VisitFormService) {}

    // Crea un formulario aceptando multipart/form-data con 'foto' como archivo
    @Post()
    @UseInterceptors(FileInterceptor("foto", {
        limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
        fileFilter: (_req, file, cb) => {
            if (file.mimetype && file.mimetype.startsWith("image/")) return cb(null, true);
            return cb(new BadRequestException("Solo se permiten archivos de imagen"), false);
        }
    }))
    async create(
        @UploadedFile() file: { buffer: Buffer; mimetype?: string; originalname?: string },
        @Body() body: any
    ): Promise<responsePayload<VisitForm>> {
        try{
            // Coerción de tipos desde form-data (todo llega como string)
            const toBool = (v: any) => v === true || v === "true" || v === "1" || v === 1;
            const toNum = (v: any) => (v === undefined || v === null || v === "") ? undefined : Number(v);

            const nivelStr = (body?.nivel_de_basura ?? "").toString().toUpperCase();
            const nivelVal = [NIVEL_DE_BASURA.ALTO, NIVEL_DE_BASURA.MEDIO, NIVEL_DE_BASURA.BAJO].includes(nivelStr)
                ? (nivelStr as NIVEL_DE_BASURA)
                : undefined;

            const payload: Partial<VisitForm> = {
                fecha: body?.fecha,
                zona_id: toNum(body?.zona_id),
                supervisor_id: toNum(body?.supervisor_id),
                comentarios: body?.comentarios,
                requiere_corte_cesped: toBool(body?.requiere_corte_cesped),
                hay_gente_acampando: toBool(body?.hay_gente_acampando),
                mobiliario_danado: toBool(body?.mobiliario_danado),
                nivel_de_basura: (nivelVal as any),
                // 'foto' será manejado por Multer; si viene como base64/dataURL en body, el servicio también lo soporta
                foto: body?.foto
            };
            return {
                message: "Formulario creado",
                data: await this.service.CreateVisitForm(payload, file),
                error: false
            }
        } catch(e) {
            return {
                message: (e as Error).message,
                error: true
            }
        }
    }

    // Obtener todos los formularios
    @Get()
    async FindAll(): Promise<responsePayload<VisitForm[]>> {
        try {
            return {
                message: "Todos los formularios",
                data: await this.service.FindAllForms(),
                error: false
            }
        } catch(e) {
            return {
                message: (e as Error).message,
                error: true
            }
        }
    } 

    // Obtener formularios por zona
    @Get("zona/:zonaId")
    async byZona(
        @Param("zonaId", ParseIntPipe) zonaId: number
    ): Promise<responsePayload<VisitForm[]>> {
        try {
            return {
                message: "Formularios encontrados",
                data: await this.service.FindByZoneID(zonaId),
                error: false
            }
        } catch(e) {
            return {
                message: (e as Error).message,
                error: true
            }
        }
    }
}
