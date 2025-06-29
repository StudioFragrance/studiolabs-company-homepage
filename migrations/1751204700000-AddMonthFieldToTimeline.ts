import { MigrationInterface, QueryRunner } from "typeorm";

export class AddMonthFieldToTimeline1751204700000 implements MigrationInterface {
    name = 'AddMonthFieldToTimeline1751204700000'

    public async up(queryRunner: QueryRunner): Promise<void> {
        // 회사 연혁 데이터에서 date 필드를 year, month로 분리
        const companyHistoryResult = await queryRunner.query(`
            SELECT id, data FROM site_content WHERE key = 'companyHistory'
        `);

        if (companyHistoryResult.length > 0) {
            const companyHistory = companyHistoryResult[0];
            const data = companyHistory.data;
            
            if (data.timeline && Array.isArray(data.timeline)) {
                // timeline의 각 항목에 month 필드 추가 및 date에서 추출
                data.timeline = data.timeline.map((event: any) => {
                    let month = null;
                    
                    // date에서 월 정보 추출 (예: "2024.05" -> 5)
                    if (event.date && typeof event.date === 'string' && event.date.includes('.')) {
                        const dateParts = event.date.split('.');
                        if (dateParts.length >= 2) {
                            month = parseInt(dateParts[1], 10);
                        }
                    }
                    
                    return {
                        ...event,
                        month: month,
                        // date 필드는 제거하지 않고 유지 (호환성 위해)
                    };
                });

                // 업데이트된 데이터 저장
                await queryRunner.query(`
                    UPDATE site_content 
                    SET data = $1, "updatedAt" = CURRENT_TIMESTAMP 
                    WHERE id = $2
                `, [JSON.stringify(data), companyHistory.id]);
            }
        }
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // 회사 연혁 데이터에서 month 필드 제거
        const companyHistoryResult = await queryRunner.query(`
            SELECT id, data FROM site_content WHERE key = 'companyHistory'
        `);

        if (companyHistoryResult.length > 0) {
            const companyHistory = companyHistoryResult[0];
            const data = companyHistory.data;
            
            if (data.timeline && Array.isArray(data.timeline)) {
                // timeline의 각 항목에서 month 필드 제거
                data.timeline = data.timeline.map((event: any) => {
                    const { month, ...eventWithoutMonth } = event;
                    return eventWithoutMonth;
                });

                // 되돌린 데이터 저장
                await queryRunner.query(`
                    UPDATE site_content 
                    SET data = $1, "updatedAt" = CURRENT_TIMESTAMP 
                    WHERE id = $2
                `, [JSON.stringify(data), companyHistory.id]);
            }
        }
    }
}