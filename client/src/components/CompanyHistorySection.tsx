import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { siteConfig } from '@shared/siteConfig';
import { useSiteContent } from '@/hooks/useSiteContent';

export default function CompanyHistorySection() {
  const [isVisible, setIsVisible] = useState(false);
  const { data: companyHistoryContent, isLoading, error } = useSiteContent('companyHistory');
  
  const content = companyHistoryContent?.data || siteConfig.companyHistory;
  const companyHistoryData = {
    title: content?.title || siteConfig.companyHistory.title,
    subtitle: content?.subtitle || siteConfig.companyHistory.subtitle,
    timeline: content?.timeline || siteConfig.companyHistory.timeline
  };

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
            <h2 className="text-4xl font-korean font-bold gradient-text mb-4">{companyHistoryData.title}</h2>
            <p className="text-lg text-gray-600">{companyHistoryData.subtitle}</p>
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
                {companyHistoryData.timeline.filter((item: any) => item.year === 2024).map((item: any, index: number) => (
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
                {companyHistoryData.timeline.filter((item: any) => item.year === 2025).map((item: any, index: number) => (
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
