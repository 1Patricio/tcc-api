import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";
import { TipoClienteEnum } from "./TipoClienteEnum";

@Entity('clientes')
export class Cliente{
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ type: "text", nullable: false})
  nome!: string;

  @Column({ type: "text"})
  email?: string;

  @Column({ type: "text"})
  telefone?: string;

  @Column({ 
    type:"enum", 
    enum: TipoClienteEnum,
    default: TipoClienteEnum.PESSOA_FISICA
  })
  tipoCliente!: TipoClienteEnum

  @Column({ 
    type: "boolean",
    default: true
  })
  status!: boolean

  @Column({type: "text"})
  observacoes?: string

  @Column({ type: "text", nullable: true })
  createdByUser!: string;
}