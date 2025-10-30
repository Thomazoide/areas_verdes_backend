import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { WorkOrder } from "./workOrder.models";

@Entity("super_form")
export class SuperForm {
    @PrimaryGeneratedColumn()
    id: number;
    @Column({nullable: true, default: null})
    description: string | null;
    @Column()
    pictureUrl: string;
    @Column({nullable: true, default: null})
    workOrderID: number | null;
    @OneToOne( () => WorkOrder, wo => wo.superForm, {nullable: true} )
    @JoinColumn({name: "workOrderID"})
    workOrder: WorkOrder | null;
}