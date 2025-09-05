import { Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Equipo } from "./equipo.model";
import { Beacon } from "./beacon.model";
// import { HealthWatch } from "./healthWatch.model";

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
    @Column({nullable: true})
    equipoID: number;
    @Column({default: null})
    health_watch_id: number;
    //timestamp pero guardado como un ISO string para evitar problemas de tipos
    @Column()
    fechaIngreso: string;
    @ManyToOne( () => Equipo, equipo => equipo.empleados, {nullable: true} )
    @JoinColumn({name: "equipoID"})
    equipo: Equipo;
    @OneToOne( () => Beacon, beacon => beacon.empleado )
    beacon: Beacon;
    // @OneToOne( () => HealthWatch, healthWatch => healthWatch.empleado )
    // @JoinColumn({name: "health_watch_id"})
    // healthWatch: HealthWatch;
}