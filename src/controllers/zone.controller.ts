import { Body, Controller, Get, Param, ParseIntPipe, Post } from "@nestjs/common";
import { Zona } from "src/models/zona.model";
import { ZoneService } from "src/services/zone.service";
import { responsePayload } from "src/types/types";

@Controller("plazas")
export class ZoneController {
    constructor(
        private readonly service: ZoneService
    ){};

    @Post()
    async CreateZone(
        @Body()
        data: Partial<Zona>
    ): Promise<responsePayload<Zona>> {
        try{
            return {
                message: "Zona creada",
                data: await this.service.CreateZona(data),
                error: false
            };
        }catch(e){
            return {
                message: (e as Error).message,
                error: true
            };
        }
    }

    @Get("by-beacon-id/:id")
    async GetByBeaconID(
        @Param("id", ParseIntPipe)
        id: number
    ): Promise<responsePayload<Zona>> {
        try{
            return {
                message: "plaza encontrada",
                data: await this.service.GetZoneByBeaconID(id),
                error: false
            }
        }catch(e){
            return {
                message: (e as Error).message,
                error: false
            }
        }
    }
};