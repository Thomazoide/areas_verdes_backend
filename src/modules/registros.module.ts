import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { RegistroController } from "src/controllers/registro.controller";
import { Registro } from "src/models/registros.model";
import { RegistroService } from "src/services/registro.service";

@Module({
    imports: [
        TypeOrmModule.forFeature([
            Registro
        ])
    ],
    controllers: [RegistroController],
    providers: [RegistroService]
})
export class RegistrosModule {}