import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

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
}