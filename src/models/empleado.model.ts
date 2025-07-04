import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Equipo } from "./equipo.model";

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
    @ManyToOne( () => Equipo, equipo => equipo.empleados, {nullable: true} )
    equipo: Equipo
}