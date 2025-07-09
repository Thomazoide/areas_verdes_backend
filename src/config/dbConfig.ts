import { ConfigService } from "@nestjs/config";
import { TypeOrmModuleOptions } from "@nestjs/typeorm";
import { Beacon } from "src/models/beacon.model";
import { Empleado } from "src/models/empleado.model";
import { Equipo } from "src/models/equipo.model";
import { Supervisor } from "src/models/supervisor.model";
import { Vehiculo } from "src/models/vehiculo.model";
import { Zona } from "src/models/zona.model";

export const typeOrmConfig = (env: ConfigService): TypeOrmModuleOptions => ({
    type: "mariadb",
    port: Number(env.get<string>("DBPORT")),
    host: env.get<string>("DBHOST"),
    database: env.get<string>("DBNAME"),
    username: env.get<string>("DBUSER"),
    password: env.get<string>("DBPASS"),
    entities: [Supervisor, Empleado, Vehiculo, Equipo, Beacon, Zona],
    synchronize: true
})