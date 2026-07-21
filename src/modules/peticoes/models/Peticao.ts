import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from "typeorm";
import { Empresa } from "../../empresas/models/Empresa";

@Entity('peticoes')
export class Peticao{
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ type: "text" })
  nome!: string;

  @Column({ type: "text", nullable: true })
  tipo?: string;

  @Column({ type: "text", nullable: true })
  createdByUser?: string;

  @Column({ type: "text", nullable: true })
  conteudo?: string;

  @Column({ type: "uuid", nullable: true })
  tenantId?: string;

  @ManyToOne(() => Empresa)
  @JoinColumn({ name: "tenantId" })
  empresa?: Empresa;
}