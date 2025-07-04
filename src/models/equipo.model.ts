import { Column, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Supervisor } from "./supervisor.model";
import { Empleado } from "./empleado.model";

@Entity("equipos")
export class Equipo {
    @PrimaryGeneratedColumn()
    id: number;
    @Column()
    nombre: string;
    @Column()
    supervisorID: number;
    @OneToOne( () => Supervisor )
    @JoinColumn({name: "supervisorID"})
    supervisor: Supervisor
    @OneToMany( () => Empleado, empleado => empleado.equipo )
    empleados: Empleado[]
}