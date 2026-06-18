import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from "typeorm";
import { Empresa } from "../../empresas/models/Empresa";

@Entity('users')
export class User {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ type: "text", nullable: false})
  nome!: string;

  @Column({ type: "text", nullable: false, unique: true })
  email!: string;

  @Column({ type: "text", nullable: false })
  password!: string;

  @Column({ type: "boolean", default: false })
  super!: boolean;

  @Column({ type: "text", nullable: true })
  fotoPerfil?: string;

  @CreateDateColumn()
  createdAt!: Date;

  @ManyToOne(() => Empresa, (empresa) => empresa.usuarios)
  @JoinColumn({ name: "empresaId" })
  empresa?: Empresa;
}