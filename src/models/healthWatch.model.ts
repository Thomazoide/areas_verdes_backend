import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Empleado } from "./empleado.model";

@Entity("health_watch")
export class HealthWatch {
    @PrimaryGeneratedColumn()
    id: number;
    @Column()
    mac: string;
    @Column({default: 0.0})
    temperatura: number;
    @Column({default: null})
    bpm: number;
    @Column({default: null})
    empleado_id: number;
    @OneToOne( () => Empleado, empleado => empleado.healthWatch )
    @JoinColumn({name: "empleado_id"})
    empleado: Empleado;
    @Column({default: false})
    danger: boolean;
}