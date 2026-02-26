import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from "typeorm";
import { TipoAcaoProcessoEnum } from "./TipoAcaoProcessoEnum";
import { StatusProcessoEnum } from "./StatusProcessoEnum";

@Entity('processos')
export class Processo{
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ type: "text", nullable: false})
  numeroProcesso!: string;

  @Column({ 
    type:"enum", 
    enum: StatusProcessoEnum,
    default: StatusProcessoEnum.ANDAMENTO
  })
  status!: StatusProcessoEnum

  @Column({ 
    type:"enum", 
    enum: TipoAcaoProcessoEnum,
    default: TipoAcaoProcessoEnum.OUTROS
  })
  tipoAcaoProcesso!: TipoAcaoProcessoEnum

  @Column({type: "text"})
  observacoes?: string

  @Column({ type: "text", nullable: true })
  createdByUser!: string;

  @CreateDateColumn()
  createdAt!: Date;
}