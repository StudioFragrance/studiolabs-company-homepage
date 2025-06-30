import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from "typeorm";

@Entity("admin_users")
export class AdminUser {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column("varchar", { unique: true })
  email!: string;

  @Column("boolean", { default: true })
  isActive!: boolean;

  @Column("varchar", { nullable: true })
  name?: string;

  @Column("text", { nullable: true })
  note?: string; // 관리자 추가 이유나 메모

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}

export interface InsertAdminUser {
  email: string;
  isActive?: boolean;
  name?: string;
  note?: string;
}