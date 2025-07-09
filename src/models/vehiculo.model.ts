import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Equipo } from "./equipo.model";
import { Beacon } from "./beacon.model";

@Entity("vehiculos")
export class Vehiculo {
    @PrimaryGeneratedColumn()
    id: number;
    @Column({unique: true})
    patente: string;
    @Column()
    marca: string;
    @Column()
    modelo: string;
    @Column({nullable: true})
    latitud: number;
    @Column({nullable: true})
    longitud: number;
    @Column({nullable: true})
    altitud: number;
    @Column({default: 0.00})
    velocidad: number;
    @Column({nullable: true})
    equipoID: number;
    @Column({nullable: true})
    beaconID: number;
    @OneToOne( () => Equipo, equipo => equipo.vehiculo )
    @JoinColumn({name: "equipoID"})
    equipo: Equipo;
    @OneToOne( () => Beacon, beacon => beacon.vehiculo )
    @JoinColumn({name: "beaconID"})
    beacon: Beacon
}