import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ZoneController } from "src/controllers/zone.controller";
import { Zona } from "src/models/zona.model";
import { ZoneService } from "src/services/zone.service";

@Module({
    imports: [
        TypeOrmModule.forFeature([
            Zona
        ])
    ],
    controllers: [ZoneController],
    providers: [ZoneService]
})
export class ZoneModule {};