import { Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Supervisor } from "./supervisor.model";
import { Zona } from "./zona.model";
import { NIVEL_DE_BASURA } from "../types/types";
import { WorkOrder } from "./workOrder.models";

@Entity("formularios")
export class VisitForm {
    @PrimaryGeneratedColumn()
    id: number;
    @Column()
    fecha: string; //ISO string de una fecha
    @Column()
    zona_id: number;
    @Column()
    supervisor_id: number;
    @ManyToOne( () => Supervisor, supervisor => supervisor.formularios )
    @JoinColumn({name: "supervisor_id"})
    supervisor: Supervisor
    @ManyToOne( () => Zona, zona => zona.formularios )
    @JoinColumn({name: "zona_id"})
    zona: Zona;
    @Column()
    comentarios: string;
    @Column({default: false})
    requiere_corte_cesped: boolean;
    @Column({default: false})
    hay_gente_acampando: boolean;
    @Column({default: false})
    mobiliario_danado: boolean;
    @Column({default: NIVEL_DE_BASURA.BAJO})
    nivel_de_basura: NIVEL_DE_BASURA;
    @Column({default: null})
    foto: string;
    @Column({nullable: true})
    orderID: number | null;
    @OneToOne( () => WorkOrder, orden => orden.visitForm, {nullable: true} )
    @JoinColumn({name: "orderID"})
    ordenTrabajo: WorkOrder | null;
}