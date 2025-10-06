import { Body, Controller, Post } from "@nestjs/common";
import { Usuario } from "src/models/usuario.model";
import { UserService } from "src/services/usuario.service";
import { logInPayload, responsePayload } from "src/types/types";

@Controller("users")
export class UsersController {
    constructor(
        private readonly service: UserService
    ){};

    @Post("sign-up")
    async SignUp(
        @Body()
        data: Partial<Usuario>
    ): Promise<responsePayload<Usuario>> {
        try {
            return {
                message: "Usuario creado",
                data: await this.service.CreateOne(data),
                error: false
            };
        } catch(error) {
            return {
                message: (error as Error).message,
                error: true
            };
        }
    }

    @Post("log-in")
    async LogIn(
        @Body()
        data: logInPayload
    ): Promise<responsePayload<string>> {
        try {
            return {
                message: "Sesión iniciada",
                data: await this.service.LogIn(data.password, data.username, data.rut, data.email),
                error: false
            };
        } catch(error) {
            return {
                message: (error as Error).message,
                error: true
            };
        }
    }
} 