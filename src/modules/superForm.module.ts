import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { SuperFormController } from "src/controllers/superForm.controller";
import { SuperForm } from "src/models/superForm.model";
import { SuperFormService } from "src/services/superForm.service";

@Module({
    imports: [
        TypeOrmModule.forFeature([
            SuperForm
        ])
    ],
    controllers: [SuperFormController],
    providers: [SuperFormService]
})
export class SuperFormModule {}