import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { InjectRepository } from "@nestjs/typeorm";
import { incorrectPasswordError, invalidCredentialsError, userEmailNotFoundError, userNameNotFoundError, userNotFoundError, userRutNotFoundError } from "src/errors/errors";
import { Usuario } from "src/models/usuario.model";
import { Encrypter } from "src/utils/encrypter";
import { Repository } from "typeorm";

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(Usuario)
        private readonly repo: Repository<Usuario>,
        private readonly encrypter: Encrypter,
        private readonly env: ConfigService
    ){
        this.encrypter = new Encrypter(this.env.get<string>("SECRET"), this.env.get<string>("PEPPER"));
    };

    async CreateOne(data: Partial<Usuario>): Promise<Usuario> {
        const newUser = this.repo.create(data);
        newUser.password = this.encrypter.EncryptPassword(newUser.password);
        return await this.repo.save(newUser);
    }

    async LogIn(password: string, username?: string, rut?: string, email?: string): Promise<string> {
        if(!username && !rut && !email) {
            throw invalidCredentialsError;
        }
        let userFound: Usuario | null = null;

        if (username) {
            userFound = await this.repo.findOne({where:{username}});
            if(!userFound) throw userNameNotFoundError;
        } else if (rut) {
            userFound = await this.repo.findOne({where:{username}});
            if(!rut) throw userRutNotFoundError;
        } else if (email) {
            userFound = await this.repo.findOne({where:{username}});
            if(!userFound) throw userEmailNotFoundError;
        }

        if(!userFound) throw userNotFoundError;
        if(!this.encrypter.VerifyPassword(password, userFound.password)) throw incorrectPasswordError;

        const payload = {
            sub: userFound.id,
            username: userFound.username,
            email: userFound.email,
            rut: userFound.rut
        };
        return this.encrypter.CreateJWT(payload);
    }
}