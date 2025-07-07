import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Empleado } from "./empleado.model";
import { Supervisor } from "./supervisor.model";
import { Vehiculo } from "./vehiculo.model";

@Entity("beacons")
export class Beacon {
    @PrimaryGeneratedColumn()
    id: number;
    @Column()
    mac: string;
    @Column()
    bateria: number;
    @OneToOne( () => Empleado )
    empleado: Empleado;
    @OneToOne( () => Supervisor )
    supervisor: Supervisor;
    @OneToOne( () => Vehiculo )
    vehiculo: Vehiculo;
};