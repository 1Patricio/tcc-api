import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne, JoinColumn } from "typeorm";
import { Arquivo } from "../../arquivos/models/Arquivo";
import { Empresa } from "../../empresas/models/Empresa";

@Entity('pastas')
export class Pasta {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ type: "text", nullable: false })
  nome!: string;

  @Column({ type: "date", nullable: true })
  dataUltimaModificacao?: Date;

  @Column({ type: 'boolean', default: true })
  status?: boolean;

  @Column({ type: "uuid", nullable: true })
  parentId?: string | null;

  @Column({ type: "uuid", nullable: true })
  tenantId?: string;

  @ManyToOne(() => Empresa)
  @JoinColumn({ name: "tenantId" })
  empresa?: Empresa;

  @ManyToOne(() => Pasta, (pasta) => pasta.subpastas, { onDelete: 'CASCADE' })
  @JoinColumn({ name: "parentId" })
  parent?: Pasta;

  @OneToMany(() => Pasta, (pasta) => pasta.parent)
  subpastas?: Pasta[];

  @OneToMany(() => Arquivo, (arquivo) => arquivo.Pasta)
  arquivos?: Arquivo[];
}