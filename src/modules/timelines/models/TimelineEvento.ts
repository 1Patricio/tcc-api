import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from "typeorm";
import { Processo } from "../../processos/models/Processo";
import { TipoEventoEnum } from "./TipoEventoEnum";
import { Empresa } from "../../empresas/models/Empresa";

@Entity('timeline_eventos')
export class TimelineEvento {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @ManyToOne(() => Processo)
  @JoinColumn({ name: "processoId" })
  processo!: Processo;

  @Column({ type: "uuid" })
  processoId!: string;

  @Column({ type: "text" })
  titulo!: string;

  @Column({ type: "text", nullable: true })
  descricao?: string;

  @Column({
    type: "enum",
    enum: TipoEventoEnum,
    default: TipoEventoEnum.OUTROS,
  })
  tipo!: TipoEventoEnum;

  @Column({ type: "date" })
  data!: Date;

  @Column({ type: "uuid", nullable: true })
  tenantId?: string;

  @ManyToOne(() => Empresa)
  @JoinColumn({ name: "tenantId" })
  empresa?: Empresa;

  @CreateDateColumn()
  createdAt!: Date;
}
