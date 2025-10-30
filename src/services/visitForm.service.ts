import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { VisitForm } from "src/models/visitForms.model";
import { Repository } from "typeorm";
import { S3Client, PutObjectCommand, PutObjectCommandInput } from "@aws-sdk/client-s3";
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
        const region = this.env.get<string>("AWS_REGION");
        this.bucket = this.env.get<string>("BUCKET_NAME") || "";
        this.publicBaseUrl = this.env.get<string>("S3_PUBLIC_URL_BASE") || (this.bucket && region ? `https://${this.bucket}.s3.${region}.amazonaws.com` : "");
        this.s3 = new S3Client({ region });
    };

    // configuracion S3
    private s3: S3Client;
    private bucket: string;
    private publicBaseUrl: string;

    async CreateVisitForm(
        data: Partial<VisitForm>,
        file?: { buffer: Buffer; mimetype?: string; originalname?: string }
    ): Promise<VisitForm> {
        // If a photo is provided via Multer, prefer that; otherwise, if a base64/dataURL string is provided, upload it
        let fotoUrl: string | undefined = data.foto || undefined;
        if (file && file.buffer) {
            fotoUrl = await this.uploadMulterFileToS3(file, data.zona_id, data.supervisor_id);
        } else if (data.foto) {
            fotoUrl = await this.uploadPhotoToS3(data.foto, data.zona_id, data.supervisor_id);
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
            relations: ["supervisor", "zona"]
        });
    }

    async FindAllForms(): Promise<VisitForm[]> {
        return await this.repository.find({
            relations: ["supervisor", "zona"]
        });
    }

    // Helpers
    private async uploadMulterFileToS3(
        file: { buffer: Buffer; mimetype?: string; originalname?: string },
        zonaId?: number,
        supervisorId?: number
    ): Promise<string> {
        if (!this.bucket) {
            throw new Error("S3_BUCKET_NAME no está configurado en las variables de entorno");
        }

        const mimeType = file.mimetype || "application/octet-stream";
        const ext = (getExtension(mimeType) as string) || (file.originalname?.split(".").pop() ?? "bin");
        const key = `visit-forms/${zonaId ?? "unknown-zone"}/${supervisorId ?? "unknown-supervisor"}/${randomUUID()}.${ext}`;

        const putParams: PutObjectCommandInput = {
            Bucket: this.bucket,
            Key: key,
            Body: file.buffer,
            ContentType: mimeType,
        };

        const acl = this.env.get("S3_OBJECT_ACL") as PutObjectCommandInput["ACL"] | undefined;
        if (acl) putParams.ACL = acl;

        await this.s3.send(new PutObjectCommand(putParams));

        return this.publicBaseUrl
            ? `${this.publicBaseUrl}/${key}`
            : `https://${this.bucket}.s3.amazonaws.com/${key}`;
    }
    private async uploadPhotoToS3(foto: string, zonaId?: number, supervisorId?: number): Promise<string> {
        // If already a URL, just store it as-is
        if (/^https?:\/\//i.test(foto)) return foto;

        if (!this.bucket) {
            throw new Error("S3_BUCKET_NAME no está configurado en las variables de entorno");
        }

        // Detect if 'foto' is a data URL or raw base64
        let mimeType = "image/jpeg";
        let base64Data: string | null = null;

        const dataUrlMatch = /^data:([^;]+);base64,(.*)$/i.exec(foto);
        if (dataUrlMatch) {
            mimeType = dataUrlMatch[1];
            base64Data = dataUrlMatch[2];
        } else {
            // Assume it's base64 (without header)
            base64Data = foto;
        }

        const buffer = Buffer.from(base64Data, "base64");
        const ext = getExtension(mimeType) || "jpg";
    const key = `visit-forms/${zonaId ?? "unknown-zone"}/${supervisorId ?? "unknown-supervisor"}/${randomUUID()}.${ext}`;

        const putParams: PutObjectCommandInput = {
            Bucket: this.bucket,
            Key: key,
            Body: buffer,
            ContentType: mimeType
        };

        // Optionally set ACL if provided (e.g., 'public-read')
        const acl = this.env.get("S3_OBJECT_ACL") as PutObjectCommandInput["ACL"] | undefined;
        if (acl) {
            putParams.ACL = acl;
        }

        await this.s3.send(new PutObjectCommand(putParams));

        // Prefer a custom public base if provided, else default S3 public URL style
        const url = this.publicBaseUrl
            ? `${this.publicBaseUrl}/${key}`
            : `https://${this.bucket}.s3.${this.env.get<string>("AWS_REGION")}.amazonaws.com/${key}`;

        return url;
    }
}