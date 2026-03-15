import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToMany, JoinColumn } from "typeorm";
import { User } from "../../users/models/User";

@Entity('empresas')
export class Empresa {
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
  
  @OneToMany(() => User, (usuario) => usuario.empresa)
  @JoinColumn({ name: "usuarioId" })
  usuarios?: User[]
}