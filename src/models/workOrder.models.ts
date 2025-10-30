import { Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Equipo } from "./equipo.model";
import { VisitForm } from "./visitForms.model";
import { WorkOrderType } from "src/types/types";
import { Zona } from "./zona.model";
import { SuperForm } from "./superForm.model";

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
    @Column({default: "Areas verdes"})
    tipo: WorkOrderType
    @Column({nullable: true})
    zonaID: number | null;
    @ManyToOne( () => Zona, zona => zona.workOrders, {nullable: true} )
    @JoinColumn({name: "zonaID"})
    zona: Zona;
    @Column({nullable: true, default: null})
    superFormID: number | null;
    @OneToOne( () => SuperForm, sf => sf.workOrder, {nullable: true} )
    @JoinColumn({name: "superFormID"})
    superForm: SuperForm | null;
};