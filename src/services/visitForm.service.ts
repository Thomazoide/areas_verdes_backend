import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { VisitForm } from "src/models/visitForms.model";
import { Repository } from "typeorm";

@Injectable()
export class VisitFormService {
    constructor(
        @InjectRepository(VisitForm)
        private readonly repository: Repository<VisitForm>
    ){};

    async CreateVisitForm(data: Partial<VisitForm>): Promise<VisitForm> {
        const newVisitForm = this.repository.create(data);
        return await this.repository.save(newVisitForm);
    }

    async FindByZoneID(zona_id: number): Promise<VisitForm[]> {
        return await this.repository.find({
            where: {
                zona_id
            },
            relations: ["supervisor", "zona"]
        });
    }
}