import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { VisitFormController } from "src/controllers/visitForm.controller";
import { VisitForm } from "src/models/visitForms.model";
import { VisitFormService } from "src/services/visitForm.service";

@Module({
    imports: [TypeOrmModule.forFeature([VisitForm])],
    controllers: [VisitFormController],
    providers: [VisitFormService],
})
export class VisitFormModule {}
