import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from "typeorm";

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

  @CreateDateColumn()
  createdAt!: Date;
}