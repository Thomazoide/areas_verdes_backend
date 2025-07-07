import { Column, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Supervisor } from "./supervisor.model";
import { Empleado } from "./empleado.model";
import { Vehiculo } from "./vehiculo.model";

@Entity("equipos")
export class Equipo {
    @PrimaryGeneratedColumn()
    id: number;
    @Column()
    nombre: string;
    @Column()
    supervisorID: number;
    @OneToOne( () => Supervisor, supervisor => supervisor.equipo )
    @JoinColumn({name: "supervisorID"})
    supervisor: Supervisor;
    @OneToMany( () => Empleado, empleado => empleado.equipo )
    empleados: Empleado[];
    @Column()
    vehiculoID: number;
    @OneToOne( () => Vehiculo, vehiculo => vehiculo.equipo )
    @JoinColumn({name: "vehiculoID"})
    vehiculo: Vehiculo;
}