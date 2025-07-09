import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Empleado } from "./empleado.model";
import { Supervisor } from "./supervisor.model";
import { Vehiculo } from "./vehiculo.model";
import { Zona } from "./zona.model";

@Entity("beacons")
export class Beacon {
    @PrimaryGeneratedColumn()
    id: number;
    @Column()
    mac: string;
    @Column()
    bateria: number;
    @OneToOne( () => Empleado, empleado => empleado.beacon )
    empleado: Empleado;
    @OneToOne( () => Supervisor, supervisor => supervisor.beacon )
    supervisor: Supervisor;
    @OneToOne( () => Vehiculo, vehiculo => vehiculo.beacon )
    vehiculo: Vehiculo;
    @OneToOne( () => Zona, zona => zona.beacon )
    zona: Zona;
};