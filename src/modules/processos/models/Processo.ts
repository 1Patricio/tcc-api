import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, JoinColumn, ManyToOne } from "typeorm";
import { TipoAcaoProcessoEnum } from "./TipoAcaoProcessoEnum";
import { StatusProcessoEnum } from "./StatusProcessoEnum";
import { Cliente } from "../../clientes/models/Cliente";

@Entity('processos')
export class Processo{
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ type: "text", nullable: false})
  numeroProcesso!: string;

  @ManyToOne(() => Cliente, (cliente) => cliente.processos)
  @JoinColumn({ name: "clienteId" })
  cliente!: Cliente;

  @Column({ 
    type:"enum", 
    enum: TipoAcaoProcessoEnum,
    default: TipoAcaoProcessoEnum.OUTROS
  })
  tipoAcaoProcesso!: TipoAcaoProcessoEnum

  @Column({ 
    type:"enum", 
    enum: StatusProcessoEnum,
    default: StatusProcessoEnum.ANDAMENTO
  })
  status!: StatusProcessoEnum

  @Column({type: "text"})
  vara?: string

  @Column({type: "text"})
  comarca?: string

  @CreateDateColumn()
  dataDistribuicao?: Date;

  @Column({type: "money"})
  valorCausa?: number

  @Column({type: "text"})
  descricao?: string

  @Column({type: "text"})
  observacoes?: string

  @Column({ type: "text", nullable: true })
  createdByUser!: string;

  @CreateDateColumn()
  createdAt!: Date;
}