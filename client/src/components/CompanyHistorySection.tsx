import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

const timelineData = [
  {
    date: '2024.01',
    title: '업무협약 체결',
    description: 'JEON',
    icon: 'fa-handshake',
    year: 2024,
  },
  {
    date: '2024.02',
    title: '창업진흥원 창업지원사업 선정',
    description: '정에하드 창업물굴 사무실자리',
    icon: 'fa-building',
    year: 2024,
  },
  {
    date: '2024.02',
    title: '1인창조기업 등록',
    description: 'CENTOP',
    icon: 'fa-certificate',
    year: 2024,
  },
  {
    date: '2024.05',
    title: '사업자등록',
    description: '개인사업자 등록',
    icon: 'fa-stamp',
    year: 2024,
  },
  {
    date: '2024.10',
    title: 'Outsourcing 서비스 개시',
    description: '외주 서비스 시작',
    icon: 'fa-rocket',
    year: 2024,
  },
  {
    date: '2024.11',
    title: '업무협약 체결',
    description: 'CHELP',
    icon: 'fa-handshake',
    year: 2024,
  },
  {
    date: '2025.02',
    title: 'Fragrance BETA 서비스 출시',
    description: 'https://www.studiofragrance.co.kr/',
    icon: 'fa-flask',
    year: 2025,
    isFuture: false,
  },
];

export default function CompanyHistorySection() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    const element = document.getElementById('history');
    if (element) observer.observe(element);

    return () => observer.disconnect();
  }, []);

  return (
    <section id="history" className="py-20 bg-brand-cream">
      <div className="max-w-6xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <div className="text-center mb-16">
            <h2 className="text-4xl font-korean font-bold gradient-text mb-4">회사 연혁</h2>
            <p className="text-lg text-gray-600">Studio fragrance의 성장 여정</p>
          </div>
          
          <div className="relative">
            <div className="timeline-line"></div>
            
            {/* 2024년 섹션 */}
            <div className="mb-16">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={isVisible ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.2, duration: 0.6 }}
                className="text-center mb-8"
              >
                <h3 className="text-3xl font-korean font-bold text-brand-coral bg-white inline-block px-6 py-2 rounded-full shadow-md">2024</h3>
              </motion.div>
              <div className="space-y-8">
                {timelineData.filter(item => item.year === 2024).map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -50 }}
                    animate={isVisible ? { opacity: 1, x: 0 } : {}}
                    transition={{ delay: 0.3 + index * 0.1, duration: 0.6 }}
                    className="timeline-item relative pl-12 ml-6 bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all hover:scale-105"
                  >
                    <div className="flex flex-col md:flex-row md:items-center justify-between">
                      <div>
                        <span className="font-bold text-lg text-brand-coral">
                          {item.date}
                        </span>
                        <h3 className="text-xl font-semibold mt-2">{item.title}</h3>
                        <p className="mt-1 text-gray-600">
                          {item.description}
                        </p>
                      </div>
                      <div className="text-right mt-4 md:mt-0">
                        <motion.i
                          whileHover={{ scale: 1.2, rotate: 5 }}
                          className={`fas ${item.icon} text-brand-coral text-2xl`}
                        />
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* 2025년 섹션 */}
            <div>
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={isVisible ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.8, duration: 0.6 }}
                className="text-center mb-8"
              >
                <h3 className="text-3xl font-korean font-bold text-white bg-gradient-to-r from-brand-coral to-orange-400 inline-block px-6 py-2 rounded-full shadow-md">2025</h3>
              </motion.div>
              <div className="space-y-8">
                {timelineData.filter(item => item.year === 2025).map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -50 }}
                    animate={isVisible ? { opacity: 1, x: 0 } : {}}
                    transition={{ delay: 0.9 + index * 0.1, duration: 0.6 }}
                    className="timeline-item relative pl-12 ml-6 bg-gradient-to-r from-brand-coral to-orange-400 text-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all hover:scale-105"
                  >
                    <div className="flex flex-col md:flex-row md:items-center justify-between">
                      <div>
                        <span className="font-bold text-lg opacity-90">
                          {item.date}
                        </span>
                        <h3 className="text-xl font-semibold mt-2">{item.title}</h3>
                        <p className="mt-1 opacity-90">
                          {item.description}
                        </p>
                      </div>
                      <div className="text-right mt-4 md:mt-0">
                        <motion.i
                          whileHover={{ scale: 1.2, rotate: 5 }}
                          className={`fas ${item.icon} text-white text-2xl`}
                        />
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
