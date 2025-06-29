// Studio Fragrance 웹사이트 설정 파일
// 이 파일을 수정하여 웹사이트 내용을 업데이트할 수 있습니다.

export const siteConfig = {
  // 사이트 기본 정보
  siteName: "Studio fragrance",
  siteUrl: "https://www.studiofragrance.co.kr",
  companyEmail: "contact@studiolabs.co.kr",
  
  // 히어로 섹션 설정
  hero: {
    subtitle: "손쉽게 찾는 나를 위한 향",
    mainTitle: {
      line1: "당신의 취향을 읽다,",
      line2: "완벽한 향을 건네다"
    },
    ctaButton: {
      text: "향수 추천 받기",
      url: "https://www.studiofragrance.co.kr"
    },
    backgroundImage: "https://images.unsplash.com/photo-1615611563049-e9c2d5c19bd8?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&h=1080"
  },

  // 브랜드 스토리 섹션 설정
  brandStory: {
    title: "AI가 골라주는 딱 맞는 향",
    quote: "이게 나에게 맞는 향기일까?",
    content: [
      "수많은 기대와 망설임 속에서 나에게 꼭 맞는 향을 찾는 여정은 늘 쉽지 않았습니다.",
      "어렵게 느껴졌던 향수의 세계, 그 막막함을 저희는 이해합니다.",
      "Studio fragrance는 당신의 감각과 취향에 귀 기울입니다. 흩어져 있던 향들 속에서 당신만을 위한 향을 찾아, 당신의 손에 건네 드립니다."
    ],
    ctaButton: {
      text: "Studio fragrance 바로가기",
      url: "https://www.studiofragrance.co.kr"
    },
    image: "https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
    statistics: [
      {
        icon: "fa-users",
        title: "7,000명 이상 사람들이",
        description: "향수를 추천받았어요"
      },
      {
        icon: "fa-home",
        title: "무료시향으로 집에서도",
        description: "간편하게 체험"
      }
    ]
  },

  // 회사 연혁 설정
  companyHistory: {
    title: "회사 연혁",
    subtitle: "Studio fragrance의 성장 여정",
    timeline: [
      {
        date: "2024.01",
        title: "업무협약 체결",
        description: "JEON",
        icon: "fa-handshake",
        year: 2024
      },
      {
        date: "2024.02",
        title: "창업진흥원 창업지원사업 선정",
        description: "정에하드 창업물굴 사무실자리",
        icon: "fa-building",
        year: 2024
      },
      {
        date: "2024.02",
        title: "1인창조기업 등록",
        description: "CENTOP",
        icon: "fa-certificate",
        year: 2024
      },
      {
        date: "2024.05",
        title: "사업자등록",
        description: "개인사업자 등록",
        icon: "fa-stamp",
        year: 2024
      },
      {
        date: "2024.10",
        title: "Outsourcing 서비스 개시",
        description: "외주 서비스 시작",
        icon: "fa-rocket",
        year: 2024
      },
      {
        date: "2024.11",
        title: "업무협약 체결",
        description: "CHELP",
        icon: "fa-handshake",
        year: 2024
      },
      {
        date: "2025.02",
        title: "Fragrance BETA 서비스 출시",
        description: "https://www.studiofragrance.co.kr/",
        icon: "fa-flask",
        year: 2025,
        isFuture: false
      }
    ]
  },

  // Mission, Vision, Core Value 설정
  mvc: {
    title: "Mission · Vision · Core Value",
    subtitle: "우리의 가치와 비전",
    mission: {
      title: "사람들의 취향을 발견하고 이를 통해 행복한 삶을 추구하는 사회를 만들기",
      description: "개인의 취향이 곧 세상의 트렌드를 만들어 낸다는 것에 공감합니다. 개인의 취향이 모여 모두가 행복한 사회를 만들기 위해 끊임 없이 고민하고 나아갑니다."
    },
    vision: {
      title: "향 정보의 기준을 분석하여 누구나 향을 쉽게 선택할 수 있도록 하기",
      description: "후각으로 전달되는 향은 취향에 민감합니다. 우리는 후각 취향을 선택하는 것을 도와 향기롭고 아름다운 공간과 나를 만들기 위해 노력합니다."
    },
    coreValues: [
      {
        title: "존중 커뮤니케이션",
        description: "사람들의 취향과 의견을 진심으로 존중하며, 이는 곧 새로운 생각의 접근과 발견이 가능하다고 믿습니다"
      },
      {
        title: "발견",
        description: "새로운 아이디어를 끊임 없이 발견하고, 이를 통해 끊임 없이 발전 할 것이라 믿습니다"
      },
      {
        title: "발전과 상생",
        description: "고객과 임직원 그리고 파트너와의 동반 발전을 통해 모두가 상생할 수 있는 세상으로 나아갑니다"
      },
      {
        title: "지속 가능",
        description: "고객과 기업 그리고 지구가 함께 살아갈 수 있는 지속 가능한 세계를 꿈꿉니다"
      }
    ]
  },

  // 연락처 섹션 설정
  contact: {
    title: "함께 성장하실 여러분들의 연락을 기다립니다",
    email: "contact@studiolabs.co.kr",
    businessInquiry: {
      title: "협업/입점 문의",
      description: "비즈니스 파트너십 및 제휴 문의",
      buttonText: "문의하기",
      icon: "fa-handshake"
    },
    recruitment: {
      title: "채용 공고 보기",
      description: "함께 성장할 팀원을 찾고 있습니다",
      buttonText: "채용 정보 확인",
      icon: "fa-users",
      isActive: false,
      inactiveMessage: "현재 진행 중인 공고가 없습니다"
    },
    teamImage: "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400"
  },

  // 회사 정보
  company: {
    name: "스튜디오랩스",
    ceo: "배성준",
    address: "부산광역시 해운대구<br />센텀동로 45, 1층",
    businessNumber: "751-16-02446",
    ecommerceNumber: "2024-부산해운대-1007",
    hosting: "AWS"
  }
};

// 타입 정의
export type SiteConfig = typeof siteConfig;
export type TimelineItem = typeof siteConfig.companyHistory.timeline[0];
export type CoreValue = typeof siteConfig.mvc.coreValues[0];
export type Statistic = typeof siteConfig.brandStory.statistics[0];