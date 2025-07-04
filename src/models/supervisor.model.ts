import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

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
    @Column({type: "float", nullable: true})
    longitud: number
    @Column({type: "float", nullable: true})
    latitud: number
    @Column({type: "float", nullable: true})
    altitud: number
    @Column({type: "float", nullable: true})
    velocidad: number
}