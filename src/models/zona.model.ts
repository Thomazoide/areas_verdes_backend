import { Punto } from "src/types/types";
import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Beacon } from "./beacon.model";

@Entity("zonas")
export class Zona {
    @PrimaryGeneratedColumn()
    id: number;
    @Column()
    name: string;
    @Column({type: "json"})
    coordinates: Punto[];
    @Column({type: "date"})
    lastVisited: Date;
    @Column()
    info: string;
    @OneToOne( () => Beacon, beacon => beacon.zona )
    beacon: Beacon;
};