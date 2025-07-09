import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { zoneNotFoundError } from "src/errors/errors";
import { Zona } from "src/models/zona.model";
import { Repository } from "typeorm";

@Injectable()
export class ZoneService {
    constructor(
        @InjectRepository(Zona)
        private readonly repo: Repository<Zona>
    ){};

    async CreateZona(data: Partial<Zona>): Promise<Zona> {
        const zona = this.repo.create(data);
        return this.repo.save(zona);
    }

    async GetZoneByBeaconID(beaconID: number): Promise<Zona> {
        const zona = await this.repo.findOneBy({beaconID});
        if(!zona) throw zoneNotFoundError;
        return zona;
    }
};