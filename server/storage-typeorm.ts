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
  private contentCache = new Map<string, { data: SiteContent, timestamp: number }>();
  private readonly CACHE_TTL = 5 * 60 * 1000; // 5분 캐시

  private get userRepository() {
    return AppDataSource.getRepository(User);
  }

  private get siteContentRepository() {
    return AppDataSource.getRepository(SiteContent);
  }

  private isCacheValid(timestamp: number): boolean {
    return Date.now() - timestamp < this.CACHE_TTL;
  }

  private getCachedContent(key: string): SiteContent | null {
    const cached = this.contentCache.get(key);
    if (cached && this.isCacheValid(cached.timestamp)) {
      return cached.data;
    }
    this.contentCache.delete(key);
    return null;
  }

  private setCachedContent(key: string, data: SiteContent): void {
    this.contentCache.set(key, { data, timestamp: Date.now() });
  }

  private clearCache(): void {
    this.contentCache.clear();
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
    // 캐시에서 먼저 확인
    const cached = this.getCachedContent(key);
    if (cached) {
      return cached;
    }

    const content = await this.siteContentRepository.findOne({ where: { key } });
    if (content) {
      this.setCachedContent(key, content);
    }
    return content || undefined;
  }

  async getAllSiteContent(): Promise<SiteContent[]> {
    // 전체 콘텐츠는 캐시하지 않음 (변경 빈도가 낮고 크기가 작음)
    return await this.siteContentRepository.find({
      order: { key: 'ASC' } // 일관된 순서로 반환
    });
  }

  async createSiteContent(insertContent: InsertSiteContent): Promise<SiteContent> {
    const content = this.siteContentRepository.create(insertContent);
    const saved = await this.siteContentRepository.save(content);
    
    // 캐시에 추가
    this.setCachedContent(saved.key, saved);
    return saved;
  }

  async updateSiteContent(key: string, data: any): Promise<SiteContent | undefined> {
    const content = await this.siteContentRepository.findOne({ where: { key } });
    if (!content) return undefined;
    
    content.data = data;
    content.updatedAt = new Date(); // 수동으로 업데이트 시간 설정
    const updated = await this.siteContentRepository.save(content);
    
    // 캐시 무효화 및 갱신
    this.setCachedContent(key, updated);
    return updated;
  }
}

export const storage = new DatabaseStorage();