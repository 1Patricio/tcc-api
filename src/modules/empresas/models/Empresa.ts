import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from "typeorm";

@Entity('empresas')
export class User {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ type: "text" })
  fantasia!: string;

  @Column({ type: "text" })
  razaoSocial!: string;

  @Column({ type: "text", unique: true })
  cnpj!: string;

  @CreateDateColumn()
  createdAt!: Date;
}