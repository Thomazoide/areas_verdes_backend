import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Equipo } from "./equipo.model";
import { Beacon } from "./beacon.model";
import { vehiclePosition } from "../types/types";

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
    @Column({type: "double", nullable: true})
    latitud: number;
    @Column({type: "double", nullable: true})
    longitud: number;
    @Column({type: "double", nullable: true})
    altitud: number;
    @Column({type: "float", default: 0.00})
    velocidad: number;
    @Column({type: "float", default: 0.00})
    heading: number;
    @Column({type: "datetime", nullable: true})
    timestamp: Date;
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

    GetPositionData(): vehiclePosition {
        return {
            vehiculoId: this.id,
            lat: this.latitud ?? 0,
            lng: this.longitud ?? 0,
            speed: this.velocidad ?? 0,
            heading: this.heading ?? 0,
            timestamp: this.timestamp ?? new Date()
        }
    }
}