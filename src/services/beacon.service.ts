import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { beaconNotFoundError } from "src/errors/errors";
import { Beacon } from "src/models/beacon.model";
import { Repository } from "typeorm";

@Injectable()
export class BeaconService {
    constructor(
        @InjectRepository(Beacon)
        private readonly repo: Repository<Beacon>
    ){};

    async CreateBeacon(data: Partial<Beacon>): Promise<Beacon> {
        const beacon = this.repo.create(data);
        return this.repo.save(beacon);
    }

    async FindByMAC(mac: string): Promise<Beacon> {
        const beacon = await this.repo.findOne({
            where: {mac},
            relations: ["zona"]
        });
        if(!beacon) throw beaconNotFoundError;
        return beacon;
    }

    async FindAll(): Promise<Array<Beacon>> {
        return this.repo.find({
            relations: [
                "zona",
            ],
        });
    }
};