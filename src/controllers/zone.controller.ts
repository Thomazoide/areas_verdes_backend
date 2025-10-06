import { Body, Controller, Get, Param, ParseIntPipe, Post, Put } from "@nestjs/common";
import { Zona } from "src/models/zona.model";
import { ZoneService } from "src/services/zone.service";
import { responsePayload } from "../types/types";

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

    @Get()
    async FindAll(): Promise<responsePayload<Array<Zona>>> {
        try {
            return {
                message: "zonas encontradas",
                data: await this.service.FindAll(),
                error: false
            };
        } catch(e) {
            return {
                message: (e as Error).message,
                error: true
            };
        }
    }

    @Post("add-multiple")
    async AddMultiple(
        @Body()
        data: Array<Partial<Zona>>
    ): Promise<responsePayload<Array<Zona>>> {
        try {
            return {
                message: "zonas agregadas",
                data: await this.service.CreateMultiple(data),
                error: false
            };
        } catch(err) {
            return {
                message: (err as Error).message,
                error:true
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

    @Put("asignar-beacon/:bid/:zid")
    async AssignBeacon(
        @Param("bid", ParseIntPipe)
        beaconID: number,
        @Param("zid", ParseIntPipe)
        zoneID: number
    ): Promise<responsePayload<Zona>> {
        try {
            return {
                message: "Beacon asignado",
                data: await this.service.AsignBeacon(beaconID, zoneID),
                error: false
            };
        }catch(e) {
            return {
                message: (e as Error).message,
                error: true
            };
        }
    }

    @Get(":id")
    async FindByID(
        @Param("id", ParseIntPipe)
        id: number
    ): Promise<responsePayload<Zona>> {
        try {
            return {
                message: "Zona encontrada",
                data: await this.service.GetByID(id),
                error: false
            };
        } catch(e) {
            return {
                message: (e as Error).message,
                error: true
            }
        }
    }
};