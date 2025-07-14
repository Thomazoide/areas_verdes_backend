import { Body, Controller, Get, Post } from "@nestjs/common";
import { Beacon } from "src/models/beacon.model";
import { BeaconService } from "src/services/beacon.service";
import { checkMACReqBody, responsePayload } from "src/types/types";

@Controller("beacons")
export class BeaconController {
    constructor(
        private readonly service: BeaconService
    ){};

    @Post()
    async CreateBeacon(
        @Body()
        data: Partial<Beacon>
    ): Promise<responsePayload<Beacon>> {
        try{
            return {
                message: "Beacon creado",
                data: await this.service.CreateBeacon(data),
                error: false
            };
        }catch(e){
            return {
                message: (e as Error).message,
                error: true
            }
        }
    }

    @Post("find-by-mac")
    async FindByMAC(
        @Body()
        data: checkMACReqBody
    ): Promise<responsePayload<Beacon>> {
        try{
            return {
                message: "encontrado",
                data: await this.service.FindByMAC(data.mac),
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
    async FindAll(): Promise<responsePayload<Array<Beacon>>> {
        try {
            return {
                message: "beacons enontrados",
                data: await this.service.FindAll(),
                error: false
            };
        } catch (e) {
            return {
                message: (e as Error).message,
                error: true
            };
        }
    }
};