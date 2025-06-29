import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { useSiteContent } from '@/hooks/useSiteContent';

export default function CompanyHistorySection() {
  const [isVisible, setIsVisible] = useState(false);
  const { data: companyHistoryContent, isLoading, error } = useSiteContent('companyHistory');
  
  const companyHistoryData = {
    title: companyHistoryContent?.data?.title || "회사 연혁",
    subtitle: companyHistoryContent?.data?.subtitle || "Studio fragrance의 성장 여정",
    timeline: companyHistoryContent?.data?.timeline || []
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
          
          {/* 타임라인 */}
          <div className="relative">
            {/* 중앙 선 */}
            <div className="absolute left-1/2 transform -translate-x-1/2 w-0.5 bg-brand-coral h-full"></div>
            
            <div className="space-y-8">
              {companyHistoryData.timeline.map((event: any, index: number) => (
                <motion.div 
                  key={index}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                  animate={isVisible ? { opacity: 1, x: 0 } : {}}
                  transition={{ delay: 0.2 + index * 0.1, duration: 0.6 }}
                  className={`flex items-center ${index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'}`}
                >
                  <div className={`w-5/12 ${index % 2 === 0 ? 'text-right pr-8' : 'text-left pl-8'}`}>
                    <motion.div 
                      whileHover={event.isFuture ? {} : { scale: 1.02, y: -2 }}
                      className={`border rounded-lg p-4 shadow-md transition-all duration-300 ${
                        event.isFuture 
                          ? 'bg-gray-50 border-gray-300 opacity-60' 
                          : 'bg-white border-gray-200 hover:shadow-lg'
                      }`}
                    >
                      <div className={`text-sm font-medium mb-2 ${
                        event.isFuture ? 'text-gray-400' : 'text-brand-coral'
                      }`}>
                        {event.date}
                      </div>
                      <h3 className={`font-semibold mb-2 ${
                        event.isFuture ? 'text-gray-500' : 'text-gray-900'
                      }`}>
                        {event.title}
                      </h3>
                      <p className={`text-sm ${
                        event.isFuture ? 'text-gray-400' : 'text-gray-600'
                      }`}>
                        {event.description}
                      </p>
                      {event.isFuture && (
                        <div className="mt-2">
                          <span className="inline-block bg-gray-200 text-gray-600 text-xs px-2 py-1 rounded">
                            예정
                          </span>
                        </div>
                      )}
                    </motion.div>
                  </div>
                  
                  {/* 중앙 아이콘 */}
                  <motion.div 
                    whileHover={event.isFuture ? {} : { scale: 1.1, rotate: 5 }}
                    className={`relative z-10 flex items-center justify-center w-10 h-10 rounded-full border-4 border-white shadow-lg ${
                      event.isFuture ? 'bg-gray-400' : 'bg-brand-coral'
                    }`}
                  >
                    <i className={`fas ${event.icon} text-white text-sm`}></i>
                  </motion.div>
                  
                  <div className="w-5/12"></div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
