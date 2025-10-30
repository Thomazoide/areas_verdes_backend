import { PutObjectCommand, PutObjectCommandInput, S3Client } from "@aws-sdk/client-s3";
import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { InjectRepository } from "@nestjs/typeorm";
import { superFormNotFoundError } from "src/errors/errors";
import { SuperForm } from "src/models/superForm.model";
import { Repository } from "typeorm";
import { extension as getExtension } from "mime-types";
import { randomUUID } from "crypto";

@Injectable()
export class SuperFormService {

    private s3: S3Client;
    private bucket: string;
    private publicBaseURL: string;

    constructor(
        @InjectRepository(SuperForm)
        private readonly repo: Repository<SuperForm>,
        private readonly env: ConfigService
    ){
        const region = this.env.get<string>("AWS_REGION");
        this.bucket = this.env.get<string>("BUCKET_NAME");
        this.publicBaseURL = this.env.get<string>("S3_PUBLIC_URL_BASE") || (this.bucket && region ? `https://${this.bucket}.s3.${region}.amazonaws.com` : "");
        this.s3 = new S3Client({region});
    }

    async UploadMulterFileToS3(
        file: {
            buffer: Buffer;
            mimetype?: string;
            originalname?: string}
    ): Promise<string> {
        if(!this.bucket) {
            throw new Error("error al obtener variables de entorno del bucket");
        }
        const mimeType = file.mimetype || "application/octet-stream";
        const ext = (getExtension(mimeType) as string) || (file.originalname?.split(".").pop() ?? "bin");
        const key = `super-forms/${randomUUID()}.${ext}`;
        const putParams: PutObjectCommandInput = {
            Bucket: this.bucket,
            Key: key,
            Body: file.buffer,
            ContentType: mimeType
        };
        const acl = this.env.get("S3_OBJECT_ACL") as PutObjectCommandInput["ACL"] | undefined;
        if(acl) putParams.ACL = acl;
        await this.s3.send(new PutObjectCommand(putParams));
        return this.publicBaseURL
            ? `${this.publicBaseURL}/${key}`
            : `https://${this.bucket}.s3.amazonaws.com/${key}`;
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