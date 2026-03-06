import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from "typeorm";
import { Processo } from "../../processos/models/Processo";

@Entity('jurisprudencias')
export class Jurisprudencia{
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ type: "text", nullable: true })
  tribunal?: string;

  @Column({ type: "text", nullable: true })
  processo?: string;

  @Column({ type: "text", nullable: true })
  link?: string;

  @Column({ type: "text", nullable: true })
  tipo?: string;

  @Column({ type: "text", nullable: true })
  resumo?: string;

  @Column({ type: "text", nullable: true })
  fundamento?: string;

  @Column({ type: "uuid", nullable: false })
  processoId!: string;

  @ManyToOne(() => Processo, (processo) => processo.id)
  @JoinColumn({ name: "processoId" })
  Processo?: Processo
}