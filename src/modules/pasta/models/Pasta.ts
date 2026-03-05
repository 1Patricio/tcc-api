import { Entity, PrimaryGeneratedColumn, Column, OneToMany, JoinColumn } from "typeorm";
import { Arquivo } from "../../arquivos/models/Arquivo";

@Entity('pastas')
export class Pasta{
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ type: "text", nullable: false})
  nome!: string;

  @Column({ type: "date", nullable: true })
  dataUltimaModificacao?: Date;

  @OneToMany(() => Arquivo, (arquivos) => arquivos.id)
  @JoinColumn({ name: "arquivoId" })
  arquivos?: Arquivo[]
}