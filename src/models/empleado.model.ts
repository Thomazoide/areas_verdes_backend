import { Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Equipo } from "./equipo.model";
import { Beacon } from "./beacon.model";

@Entity("empleados")
export class Empleado {
    @PrimaryGeneratedColumn()
    id: number;
    @Column()
    fullName: string;
    @Column({unique: true})
    rut: string;
    @Column({unique: true})
    email: string;
    @Column()
    celular: string;
    @Column()
    equipoID: number;
    @ManyToOne( () => Equipo, equipo => equipo.empleados, {nullable: true} )
    @JoinColumn({name: "equipoID"})
    equipo: Equipo
    @OneToOne( () => Beacon, beacon => beacon.empleado )
    beacon: Beacon
}