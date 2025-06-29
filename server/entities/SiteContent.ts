import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from "typeorm";

@Entity("site_content")
export class SiteContent {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: "text", unique: true })
  key!: string; // 'hero', 'brandStory', 'companyHistory', etc.

  @Column({ type: "jsonb" })
  data!: any; // JSON 형태로 콘텐츠 저장

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}

export interface InsertSiteContent {
  key: string;
  data: any;
}