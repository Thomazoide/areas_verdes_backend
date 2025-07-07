import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Equipo } from "./equipo.model";

@Entity("vehiculos")
export class Vehiculo {
    @PrimaryGeneratedColumn()
    id: number;
    @Column()
    patente: string;
    @Column()
    marca: string;
    @Column()
    modelo: string;
    @Column({default: 0.00})
    velocidad: number;
    @Column()
    equipoID: number;
    @OneToOne( () => Equipo, equipo => equipo.vehiculo )
    @JoinColumn({name: "equipoID"})
    equipo: Equipo;
    
}