import { Body, Controller, Param, ParseIntPipe, Post, Get } from "@nestjs/common";
import { Equipo } from "src/models/equipo.model";
import { TeamService } from "src/services/team.service";
import { responsePayload, SignInPayload } from "src/types/types";

@Controller("equipos")
export class TeamsController {
    constructor(
        private readonly service: TeamService
    ){};

    @Post("sign-in")
    async SignIn(
        @Body()
        data: SignInPayload
    ): Promise<responsePayload<Equipo>> {
        try {
            return {
                message: "Sesión iniciada con éxito",
                data: await this.service.SignIn(data),
                error: false
            };
        } catch(e) {
            return {
                message: (e as Error).message,
                error: true
            };
        }
    }

    @Post(":id")
    async CreateTeam(
        @Body()
        data: Partial<Equipo>,
        @Param("id", ParseIntPipe)
        id: number
    ): Promise<responsePayload<Equipo>> {
        try{
            return {
                message: "Equipo creado",
                data: await this.service.CreateTeam(data, id),
                error: false
            };
        }catch(e){
            return {
                message: (e as Error).message,
                error: true
            };
        }
    }

    @Get()
    async FindAll(): Promise<responsePayload<Array<Equipo>>> {
        try {
            return {
                message: "equipos encontrados",
                data: await this.service.GetAllTeams(),
                error: false
            }
        } catch(e) {
            return {
                message: (e as Error).message,
                error: true
            }
        }
    }

    
};