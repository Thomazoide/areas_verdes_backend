import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { VisitForm } from "src/models/visitForms.model";
import { IsNull, Repository } from "typeorm";
import { Storage } from "@google-cloud/storage";
import { randomUUID } from "crypto";
import { extension as getExtension } from "mime-types";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class VisitFormService {
    constructor(
        @InjectRepository(VisitForm)
        private readonly repository: Repository<VisitForm>,
        private readonly env: ConfigService
    ){
        const serviceKey = this.env.get<string>("GCP_SERVICE_KEY");
        const serviceEmail = this.env.get<string>("GCP_SERVICE_EMAIL");
        const projectId = this.env.get<string>("GOOGLE_CLOUD_PROJECT");
        this.bucketName = this.env.get<string>("GCS_BUCKET_NAME") || "";
        this.publicBaseUrl = this.env.get<string>("GCS_PUBLIC_URL_BASE");
        this.storage = new Storage({
            projectId,
            credentials: {
                private_key: serviceKey,
                client_email: serviceEmail
            }
        });
    };

    // configuracion S3
    private storage: Storage;
    private bucketName: string;
    private publicBaseUrl: string;

    async CreateVisitForm(
        data: Partial<VisitForm>,
        file?: { buffer: Buffer; mimetype?: string; originalname?: string }
    ): Promise<VisitForm> {
        let fotoUrl: string | undefined = data.foto || undefined;
        if (file && file.buffer) {
            fotoUrl = await this.uploadMulterFileToGCS(file, data.zona_id, data.supervisor_id);
        } else if (data.foto) {
            fotoUrl = await this.uploadPhotoToGCS(data.foto, data.zona_id, data.supervisor_id);
        }

        const newVisitForm = this.repository.create({
            ...data,
            foto: fotoUrl ?? null
        });
        return await this.repository.save(newVisitForm);
    }

    async FindByZoneID(zona_id: number): Promise<VisitForm[]> {
        return await this.repository.find({
            where: {
                zona_id
            },
            relations: ["supervisor", "zona", "ordenTrabajo"]
        });
    }

    async FindWithoutZone(): Promise<VisitForm[]> {
        return await this.repository.find({
            where: {
                zona_id: IsNull(),
            },
            relations: ["supervisor", "ordenTrabajo"]
        })
    }

    async FindAllForms(): Promise<VisitForm[]> {
        return await this.repository.find({
            relations: ["supervisor", "zona", "ordenTrabajo"]
        });
    }

    private async uploadMulterFileToGCS(
        file: { buffer: Buffer; mimetype?: string; originalname?: string },
        zonaId?: number,
        supervisorId?: number
    ): Promise<string> {
        if (!this.bucketName) {
            throw new Error("GCS_BUCKET_NAME no está configurado en las variables de entorno");
        }

        const mimeType = file.mimetype || "application/octet-stream";
        const ext = (getExtension(mimeType) as string) || (file.originalname?.split(".").pop() ?? "bin");
        const fileName = `visit-forms/${zonaId ?? "unknown-zone"}/${supervisorId ?? "unknown-supervisor"}/${randomUUID()}.${ext}`;
        const bucket = this.storage.bucket(this.bucketName);
        const fileRef = bucket.file(fileName);

        await fileRef.save(file.buffer, {
            metadata: {
                contentType: mimeType
            },
            public: true
        });

        return this.publicBaseUrl
            ? `${this.publicBaseUrl}/${fileName}`
            : `https://storage.googleapis.com/${this.bucketName}/${fileName}`;
    }
    private async uploadPhotoToGCS(foto: string, zonaId?: number, supervisorId?: number): Promise<string> {
        // SI ya es URL lo devuelve tal cual
        if (/^https?:\/\//i.test(foto)) return foto;

        if (!this.bucketName) {
            throw new Error("GCS_BUCKET_NAME no está configurado en las variables de entorno");
        }
        let mimeType = "image/jpeg";
        let base64Data: string | null = null;

        const dataUrlMatch = /^data:([^;]+);base64,(.*)$/i.exec(foto);
        if (dataUrlMatch) {
            mimeType = dataUrlMatch[1];
            base64Data = dataUrlMatch[2];
        } else {
            base64Data = foto;
        }

        const buffer = Buffer.from(base64Data, "base64");
        const ext = getExtension(mimeType) || "jpg";
        const fileName = `visit-forms/${zonaId ?? "unknown-zone"}/${supervisorId ?? "unknown-supervisor"}/${randomUUID()}.${ext}`;

        const bucket = this.storage.bucket(this.bucketName);
        const fileRef = bucket.file(fileName);

        await fileRef.save(buffer, {
            metadata: {
                contentType: mimeType
            },
            public: true
        });
        const url = this.publicBaseUrl
            ? `${this.publicBaseUrl}/${fileName}`
            : `https://storage.googleapis.com/${this.bucketName}/${fileName}`;

        return url;
    }
}