import { Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Equipo } from "./equipo.model";
import { VisitForm } from "./visitForms.model";

@Entity("ordened_trabajo")
export class WorkOrder {
    @PrimaryGeneratedColumn()
    id: number;
    @Column({type: "text", nullable: true})
    descripcion: string;
    @Column({type: "timestamp", default: () => "CURRENT_TIMESTAMP"})
    creada_en: Date;
    @Column({default: false})
    completada: boolean;
    @Column({type: "timestamp", nullable: true})
    completada_en: Date | null;
    @Column({nullable: true})
    equipoID: number | null;
    @ManyToOne( () => Equipo, equipo => equipo.ordenes, {nullable: true} )
    @JoinColumn({name: "equipoID"})
    equipo: Equipo | null;
    @Column({nullable: true})
    visitFormID: number | null;
    @OneToOne( () => VisitForm, form => form.ordenTrabajo, {nullable: true} )
    @JoinColumn({name: "visitFormID"})
    visitForm: VisitForm | null;
};