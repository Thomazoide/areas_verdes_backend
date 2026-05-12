import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { InjectRepository } from "@nestjs/typeorm";
import { superFormNotFoundError } from "src/errors/errors";
import { SuperForm } from "src/models/superForm.model";
import { Repository } from "typeorm";
import { extension as getExtension } from "mime-types";
import { randomUUID } from "crypto";
import { Storage } from "@google-cloud/storage";

@Injectable()
export class SuperFormService {

    private storage: Storage;
    private bucketName: string;
    private publicBaseURL: string;

    constructor(
        @InjectRepository(SuperForm)
        private readonly repo: Repository<SuperForm>,
        private readonly env: ConfigService
    ){
        const serviceKey = this.env.get<string>("GCP_SERVICE_KEY");
        const serviceEmail = this.env.get<string>("GCP_SERVICE_EMAIL");
        const projectId = this.env.get<string>("GOOGLE_CLOUD_PROJECT");
        this.bucketName = this.env.get<string>("BUCKET_NAME");
        this.publicBaseURL = this.env.get<string>("GCS_PUBLIC_URL_BASE");
        this.storage = new Storage({
            projectId,
            credentials: {
                private_key: serviceKey,
                client_email: serviceEmail
            }
        });
    }

    async UploadMulterFileToS3(
        file: {
            buffer: Buffer;
            mimetype?: string;
            originalname?: string}
    ): Promise<string> {
        if(!this.bucketName) {
            throw new Error("error al obtener variables de entorno del bucket");
        }
        const mimeType = file.mimetype || "application/octet-stream";
        const ext = (getExtension(mimeType) as string) || (file.originalname?.split(".").pop() ?? "bin");
        const fileName = `super-forms/${randomUUID()}.${ext}`;
        const bucket = this.storage.bucket(this.bucketName);
        const fileRef = bucket.file(fileName);
        await fileRef.save(file.buffer, {
            metadata: {
                contentType: mimeType
            },
            public: true
        });
        return this.publicBaseURL
            ? `${this.publicBaseURL}/${fileName}`
            : `https://storage.googleapis.com/${this.bucketName}/${fileName}`;
    }

    async CreateOrUpdateSuperForm(data: Partial<SuperForm>, file: {
        buffer: Buffer;
        mimetype?: string;
        originalname?: string;
    }): Promise<SuperForm> {
        const auxData = data;
        const picURL = await this.UploadMulterFileToS3(file);
        auxData.pictureUrl = picURL;
        return await this.repo.save(auxData);
    }

    async GetAllSuperForms(): Promise<SuperForm[]> {
        return await this.repo.find({
            relations: [
                "workOrder"
            ]
        });
    }

    async FindSuperFormByID(ID: number): Promise<SuperForm> {
        return await this.repo.findOne({
            where: {
                id: ID
            },
            relations: [
                "workOrder"
            ]
        });
    }

    async FindSuperFormByWorkOrderID(workOrderID: number): Promise<SuperForm> {
        return await this.repo.findOne({
            where: {
                workOrderID
            }
        })
    }

    async DeleteSuperFormByID(ID: number): Promise<SuperForm> {
        const exists = await this.repo.findOneBy({
            id: ID
        })
        if(!exists) throw superFormNotFoundError;
        await this.repo.delete(ID);
        return exists;
    }
}