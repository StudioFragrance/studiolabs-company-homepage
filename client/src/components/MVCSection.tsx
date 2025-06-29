import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { useSiteContent } from '@/hooks/useSiteContent';



export default function MVCSection() {
  const [isVisible, setIsVisible] = useState(false);
  const { data: mvcContent, isLoading, error } = useSiteContent('mvc');
  
  const mvcData = {
    title: mvcContent?.data?.title || "Mission · Vision · Core Value",
    subtitle: mvcContent?.data?.subtitle || "우리의 가치와 비전",
    mission: mvcContent?.data?.mission || {
      title: "사람들의 취향을 발견하고 이를 통해 행복한 삶을 추구하는 사회를 만들기",
      description: "개인의 취향이 곧 세상의 트렌드를 만들어 낸다는 것에 공감합니다."
    },
    vision: mvcContent?.data?.vision || {
      title: "향 정보의 기준을 분석하여 누구나 향을 쉽게 선택할 수 있도록 하기",
      description: "후각으로 전달되는 향은 취향에 민감합니다."
    },
    coreValues: mvcContent?.data?.coreValues || []
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

    const element = document.getElementById('mvc');
    if (element) observer.observe(element);

    return () => observer.disconnect();
  }, []);

  return (
    <section id="mvc" className="py-20 bg-white">
      <div className="max-w-6xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <div className="text-center mb-16">
            <h2 className="text-4xl font-korean font-bold gradient-text mb-4">
              {mvcData.title}
            </h2>
            <p className="text-lg text-gray-600">{mvcData.subtitle}</p>
          </div>
          
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Mission */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={isVisible ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0, duration: 0.6 }}
              whileHover={{ scale: 1.02, y: -5 }}
              className="bg-brand-cream p-8 rounded-xl shadow-lg hover:shadow-xl transition-all"
            >
              <div className="text-center mb-6">
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  className="w-16 h-16 bg-brand-coral rounded-full flex items-center justify-center mx-auto mb-4"
                >
                  <i className="fas fa-bullseye text-white text-2xl" />
                </motion.div>
                <h3 className="text-2xl font-bold gradient-text mb-4">Mission</h3>
              </div>
              <div className="space-y-4">
                <h4 className="text-lg font-semibold">{mvcData.mission.title}</h4>
                <p className="text-gray-600 text-sm leading-relaxed">{mvcData.mission.description}</p>
              </div>
            </motion.div>

            {/* Vision */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={isVisible ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.2, duration: 0.6 }}
              whileHover={{ scale: 1.02, y: -5 }}
              className="bg-brand-cream p-8 rounded-xl shadow-lg hover:shadow-xl transition-all"
            >
              <div className="text-center mb-6">
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  className="w-16 h-16 bg-brand-coral rounded-full flex items-center justify-center mx-auto mb-4"
                >
                  <i className="fas fa-eye text-white text-2xl" />
                </motion.div>
                <h3 className="text-2xl font-bold gradient-text mb-4">Vision</h3>
              </div>
              <div className="space-y-4">
                <h4 className="text-lg font-semibold">{mvcData.vision.title}</h4>
                <p className="text-gray-600 text-sm leading-relaxed">{mvcData.vision.description}</p>
              </div>
            </motion.div>

            {/* Core Values */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={isVisible ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.4, duration: 0.6 }}
              whileHover={{ scale: 1.02, y: -5 }}
              className="bg-brand-cream p-8 rounded-xl shadow-lg hover:shadow-xl transition-all"
            >
              <div className="text-center mb-6">
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  className="w-16 h-16 bg-brand-coral rounded-full flex items-center justify-center mx-auto mb-4"
                >
                  <i className="fas fa-heart text-white text-2xl" />
                </motion.div>
                <h3 className="text-2xl font-bold gradient-text mb-4">Core Values</h3>
              </div>
              <div className="space-y-6">
                {mvcData.coreValues.map((value, valueIndex) => (
                  <motion.div
                    key={valueIndex}
                    initial={{ opacity: 0, x: -20 }}
                    animate={isVisible ? { opacity: 1, x: 0 } : {}}
                    transition={{ delay: 0.4 + (valueIndex * 0.1), duration: 0.4 }}
                  >
                    <h4 className="font-semibold mb-2">{value.title}</h4>
                    <p className="text-gray-600 text-sm">{value.description}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
