import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Equipo } from "./equipo.model";
import { Beacon } from "./beacon.model";

@Entity("supervisores")
export class Supervisor {
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
    @Column({nullable: true})
    equipoID: number;
    @OneToOne( () => Equipo, equipo => equipo.supervisor )
    equipo: Equipo;
    @OneToOne( () => Beacon, beacon => beacon.supervisor )
    beacon: Beacon
}