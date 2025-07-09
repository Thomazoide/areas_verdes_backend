import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Equipo } from "./equipo.model";
import { Beacon } from "./beacon.model";

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
    @Column()
    latitud: number;
    @Column()
    longitud: number;
    @Column()
    altitud: number;
    @Column({default: 0.00})
    velocidad: number;
    @Column()
    equipoID: number;
    @OneToOne( () => Equipo, equipo => equipo.vehiculo )
    @JoinColumn({name: "equipoID"})
    equipo: Equipo;
    @OneToOne( () => Beacon, beacon => beacon.vehiculo )
    beacon: Beacon
}