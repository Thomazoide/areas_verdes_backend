import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { BeaconController } from "src/controllers/beacon.controller";
import { Beacon } from "src/models/beacon.model";
import { BeaconService } from "src/services/beacon.service";

@Module({
    imports: [
        TypeOrmModule.forFeature([
            Beacon
        ])
    ],
    controllers: [BeaconController],
    providers: [BeaconService]
})
export class BeaconModule {};