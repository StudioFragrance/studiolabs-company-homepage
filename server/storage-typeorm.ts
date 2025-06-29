import { User, type InsertUser } from "./entities/User";
import { SiteContent, type InsertSiteContent } from "./entities/SiteContent";
import { AppDataSource } from "./db";

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Site Content CRUD
  getSiteContent(key: string): Promise<SiteContent | undefined>;
  getAllSiteContent(): Promise<SiteContent[]>;
  createSiteContent(content: InsertSiteContent): Promise<SiteContent>;
  updateSiteContent(key: string, data: any): Promise<SiteContent | undefined>;
}

export class DatabaseStorage implements IStorage {
  private get userRepository() {
    return AppDataSource.getRepository(User);
  }

  private get siteContentRepository() {
    return AppDataSource.getRepository(SiteContent);
  }

  async getUser(id: number): Promise<User | undefined> {
    const user = await this.userRepository.findOne({ where: { id } });
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const user = await this.userRepository.findOne({ where: { username } });
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const user = this.userRepository.create(insertUser);
    return await this.userRepository.save(user);
  }

  async getSiteContent(key: string): Promise<SiteContent | undefined> {
    const content = await this.siteContentRepository.findOne({ where: { key } });
    return content || undefined;
  }

  async getAllSiteContent(): Promise<SiteContent[]> {
    return await this.siteContentRepository.find();
  }

  async createSiteContent(insertContent: InsertSiteContent): Promise<SiteContent> {
    const content = this.siteContentRepository.create(insertContent);
    return await this.siteContentRepository.save(content);
  }

  async updateSiteContent(key: string, data: any): Promise<SiteContent | undefined> {
    const content = await this.siteContentRepository.findOne({ where: { key } });
    if (!content) return undefined;
    
    content.data = data;
    return await this.siteContentRepository.save(content);
  }
}

export const storage = new DatabaseStorage();