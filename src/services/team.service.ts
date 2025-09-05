import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { employeeNotFoundError, supervisorNotFoundError, teamNotFoundError, vehicleNotFoundError } from "src/errors/errors";
import { Empleado } from "src/models/empleado.model";
import { Equipo } from "src/models/equipo.model";
import { Supervisor } from "src/models/supervisor.model";
import { Vehiculo } from "src/models/vehiculo.model";
import { SignInPayload } from "src/types/types";
import { Repository } from "typeorm";

@Injectable()
export class TeamService {
    constructor(
        @InjectRepository(Equipo)
        private readonly teamsRepo: Repository<Equipo>,
        @InjectRepository(Empleado)
        private readonly employeeRepo: Repository<Empleado>,
        @InjectRepository(Supervisor)
        private readonly supervisorRepo: Repository<Supervisor>,
        @InjectRepository(Vehiculo)
        private readonly vehicleRepo: Repository<Vehiculo>
    ){};

    async CreateTeam(team: Partial<Equipo>, supervisorID: number): Promise<Equipo> {
        const supervisor = await this.supervisorRepo.findOneBy({id: supervisorID});
        if(!supervisor) throw supervisorNotFoundError;
        const newTeam = this.teamsRepo.create({
            ...team,
            supervisor: supervisor
        });
        return this.teamsRepo.save(newTeam);
    }

    async AddEmployee(employeeID: number, teamID: number): Promise<Equipo> {
        const employee = await this.employeeRepo.findOneBy({id: employeeID});
        if(!employee) throw employeeNotFoundError;
        const team = await this.teamsRepo.findOne({
            where: {
                id: teamID
            },
            relations: ["empleados"]
        });
        if(!team) throw teamNotFoundError;
        employee.equipo = team;
        await this.employeeRepo.save(employee);
        return this.teamsRepo.findOne({
            where: {
                id: teamID
            },
            relations: ["empleados", "supervisores", "vehiculos"]
        });
    }

    async AddVehicle(vehicleID: number, teamID: number): Promise<Equipo> {
        const vehicle = await this.vehicleRepo.findOneBy({id: vehicleID});
        if(!vehicle) throw vehicleNotFoundError;
        const team = await this.teamsRepo.findOne({
            where: {
                id: teamID
            },
            relations: ["vehiculos"]
        });
        if(!team) throw teamNotFoundError;
        vehicle.equipo = team;
        await this.vehicleRepo.save(vehicle);
        return this.teamsRepo.findOne({
            where: {
                id: teamID
            },
            relations: ["empleados", "supervisor", "vehiculo"]
        });
    }

    async GetAllTeams(): Promise<Array<Equipo>> {
        return this.teamsRepo.find({
            relations: ["empleados", "supervisor", "vehiculo"]
        });
    }

    async FindByID(id: number): Promise<Equipo> {
        const team = await this.teamsRepo.findOne({
            where: {id},
            relations: ["empleados", "supervisor", "vehiculo"]
        });
        if(!team) throw teamNotFoundError;
        return team;
    }

    async UpdateTeam(team: Partial<Equipo>): Promise<Equipo> {
        return this.teamsRepo.save(team);
    }

    async SignIn(data: SignInPayload): Promise<Equipo> {
        const supervisor = await this.supervisorRepo.findOne({
            where: {
                rut: data.rut
            }
        });
        const vehiculo = await this.vehicleRepo.findOne({
            where: {
                patente: data.patente
            }
        });
        const equipo = await this.teamsRepo.findOne({
            where: {
                vehiculoID: vehiculo.id,
                supervisorID: supervisor.id
            },
            relations: ["supervisor", "vehiculo"]
        });

        if(!supervisor || !vehiculo || !equipo) {
            throw teamNotFoundError;
        }

        return equipo;
    }
};