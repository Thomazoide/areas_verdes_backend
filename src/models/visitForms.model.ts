import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Supervisor } from "./supervisor.model";
import { Zona } from "./zona.model";

@Entity("formularios")
export class VisitForm {
    @PrimaryGeneratedColumn()
    id: number;
    @Column()
    fecha: string; //ISO string de una fecha
    @Column()
    supervisor_id: number;
    @ManyToOne( () => Supervisor, supervisor => supervisor.formularios )
    @JoinColumn({name: "supervisor_id"})
    supervisor: Supervisor
    @ManyToOne( () => Zona, zona => zona.formularios )
    zona: Zona;
    @Column({nullable: true})
    campo1: string;
    @Column({nullable: true})
    pic1: string;
    @Column({nullable: true})
    campo2: string;
    @Column({nullable: true})
    pic2: string;
    @Column({nullable: true})
    campo3: string;
    @Column({nullable: true})
    pic3: string;
    @Column({nullable: true})
    campo4: string;
    @Column({nullable: true})
    pic4: string;
}