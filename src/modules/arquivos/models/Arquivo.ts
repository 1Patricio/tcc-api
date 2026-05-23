import { Entity, PrimaryGeneratedColumn, Column, JoinColumn, ManyToOne, CreateDateColumn } from "typeorm";
import { Pasta } from "../../pasta/models/Pasta";

@Entity('arquivos')
export class Arquivo{
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ type: "text", nullable: false})
  nome!: string;

  @Column({ type: "text", nullable: false})
  url!: string;

  @Column({ type: "text", nullable: false})
  nomeFisico!: string;

  @Column({ type: "uuid", nullable: false })
  pastaId!: string;

  @CreateDateColumn()
  createdAt!: Date;

  @ManyToOne(() => Pasta, (pasta) => pasta.id)
  @JoinColumn({ name: "pastaId" })
  Pasta?: Pasta
}