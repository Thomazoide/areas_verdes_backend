import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { TeamsController } from "src/controllers/teams.controller";
import { Empleado } from "src/models/empleado.model";
import { Equipo } from "src/models/equipo.model";
import { Supervisor } from "src/models/supervisor.model";
import { Vehiculo } from "src/models/vehiculo.model";
import { TeamService } from "src/services/team.service";

@Module({
    imports: [
        TypeOrmModule.forFeature(
            [Equipo, Vehiculo, Empleado, Supervisor]
        )
    ],
    controllers: [TeamsController],
    providers: [TeamService]
})
export class TeamsModule {};