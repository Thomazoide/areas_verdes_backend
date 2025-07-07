import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Empleado } from "src/models/empleado.model";
import { Equipo } from "src/models/equipo.model";
import { Supervisor } from "src/models/supervisor.model";
import { Vehiculo } from "src/models/vehiculo.model";
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

    employeeNotFoundError: Error = new Error("empleado no encontrado");
    supervisorNotFoundError: Error = new Error("supervisor no encontrado");
    teamNotFoundError: Error = new Error("equipo no encontrado");
    vehicleNotFoundError: Error = new Error("vehiculo no encontrado");

    async CreateTeam(team: Partial<Equipo>, supervisorID: number): Promise<Equipo> {
        const supervisor = await this.supervisorRepo.findOneBy({id: supervisorID});
        if(!supervisor) throw this.supervisorNotFoundError;
        const newTeam = this.teamsRepo.create({
            ...team,
            supervisor: supervisor
        });
        return this.teamsRepo.save(newTeam);
    }

    async AddEmployee(employeeID: number, teamID: number): Promise<Equipo> {
        const employee = await this.employeeRepo.findOneBy({id: employeeID});
        if(!employee) throw this.employeeNotFoundError;
        const team = await this.teamsRepo.findOne({
            where: {
                id: teamID
            },
            relations: ["empleados"]
        });
        if(!team) throw this.teamNotFoundError;
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
        if(!vehicle) throw this.vehicleNotFoundError;
        const team = await this.teamsRepo.findOne({
            where: {
                id: teamID
            },
            relations: ["vehiculos"]
        });
        if(!team) throw this.teamNotFoundError;
        vehicle.equipo = team;
        await this.vehicleRepo.save(vehicle);
        return this.teamsRepo.findOne({
            where: {
                id: teamID
            },
            relations: ["empleados", "supervisores", "vehiculos"]
        });
    }

    async GetAllTeams(): Promise<Array<Equipo>> {
        return this.teamsRepo.find({
            relations: ["empleados", "supervisores", "vehiculos"]
        });
    }

    async FindByID(id: number): Promise<Equipo> {
        const team = await this.teamsRepo.findOne({
            where: {id},
            relations: ["empleados", "supervisores", "vehiculos"]
        });
        if(!team) throw this.teamNotFoundError;
        return team;
    }
};