import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Supervisor } from "./supervisor.model";

@Entity("registros")
export class Registro {
    @PrimaryGeneratedColumn()
    id: number;
    @Column()
    fecha: string; //fecha en formato DD-MM-YYYY
    @Column()
    id_zona: number;
    @Column()
    hora_llegada: string; //hora en formato HH:mm
    @Column()
    hora_salida: string; //hora en formato HH:mm
    @Column({default: null})
    supervisor_id: number;
    @ManyToOne( () => Supervisor, supervisor => supervisor.registros )
    @JoinColumn({name: "supervisor_id"})
    supervisor: Supervisor;
}