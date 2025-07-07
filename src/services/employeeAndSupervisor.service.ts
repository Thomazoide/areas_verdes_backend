import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Empleado } from "src/models/empleado.model";
import { Supervisor } from "src/models/supervisor.model";
import { Repository } from "typeorm";

@Injectable()
export class employeeAndSupervisorService {
    constructor(
        @InjectRepository(Supervisor)
        private readonly supervisorRepo: Repository<Supervisor>,
        @InjectRepository(Empleado)
        private readonly employeeRepo: Repository<Empleado>
    ){}

    employeeNotFoundError: Error = new Error("empleado no encontrado");
    supervisorNotFoundError: Error = new Error("supervisor no encontrado");

    async CreateEmployee(empl: Partial<Empleado>): Promise<Empleado> {
        const newEmployee = this.employeeRepo.create(empl);
        return this.employeeRepo.save(newEmployee);
    }

    async CreateSupervisor(sup: Partial<Supervisor>): Promise<Supervisor> {
        const newSupervisor = this.supervisorRepo.create(sup);
        return newSupervisor;
    }

    async FindEmployeeByID(id: number): Promise<Empleado> {
        const employee = await this.employeeRepo.findOneBy({id});
        if(!employee) throw this.employeeNotFoundError;
        return employee;
    }

    async FindSupervisorByID(id: number): Promise<Supervisor> {
        const supervisor = await this.supervisorRepo.findOneBy({id});
        if(!supervisor) throw this.supervisorNotFoundError;
        return supervisor;
    }

    async UpdateEmployee(empl: Partial<Empleado>): Promise<Empleado> {
        const employee = await this.employeeRepo.findOneBy({id: empl.id});
        if(!employee) throw this.employeeNotFoundError;
        return this.employeeRepo.save(empl);
    }

    async UpdateSupervisor(sup: Partial<Supervisor>): Promise<Supervisor> {
        const supervisor = await this.supervisorRepo.findOneBy({id: sup.id});
        if(!supervisor) throw this.supervisorNotFoundError;
        return this.supervisorRepo.save(sup);
    }

    async GetAllEmployees(): Promise<Array<Empleado>> {
        return this.employeeRepo.find();
    }

    async GetAllSupervisors(): Promise<Array<Supervisor>> {
        return this.supervisorRepo.find();
    }
};