import { Punto } from "src/types/types";
import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Beacon } from "./beacon.model";

@Entity("zonas")
export class Zona {
    @PrimaryGeneratedColumn()
    id: number;
    @Column()
    name: string;
    @Column({type: "json"})
    coordinates: Punto[];
    @Column({type: "date", nullable: true, default: null})
    lastVisited: Date;
    @Column()
    info: string;
    @Column()
    beaconID: number;
    @OneToOne( () => Beacon, beacon => beacon.zona )
    @JoinColumn({name: "beaconID"})
    beacon: Beacon;
};