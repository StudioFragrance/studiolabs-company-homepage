import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity("users")
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: "text", unique: true })
  username!: string;

  @Column({ type: "text" })
  password!: string;
}

export interface InsertUser {
  username: string;
  password: string;
}