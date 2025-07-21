import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { beaconNotFoundError, relationError, zoneNotFoundError } from "src/errors/errors";
import { Zona } from "src/models/zona.model";
import { Beacon } from "src/models/beacon.model";
import { Repository } from "typeorm";

@Injectable()
export class ZoneService {
    constructor(
        @InjectRepository(Zona)
        private readonly repo: Repository<Zona>,
        @InjectRepository(Beacon)
        private readonly bRepo: Repository<Beacon>
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

    async AsignBeacon(beaconID: number, zoneID: number): Promise<Zona> {
        const zona = await this.repo.findOne({
            where: {
                id: zoneID
            },
            relations: [
                "beacon"
            ]
        });
        if(!zona) throw zoneNotFoundError;
        if(zona.beacon) throw relationError;
        const beacon = await this.bRepo.findOneBy({id: beaconID});
        if(!beacon) throw beaconNotFoundError;
        zona.beacon = beacon;
        return this.repo.save(zona);
    }

    async FindAll(): Promise<Array<Zona>> {
        return this.repo.find();
    }
};