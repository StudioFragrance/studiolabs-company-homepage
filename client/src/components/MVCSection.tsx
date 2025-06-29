import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

const mvcData = [
  {
    type: 'Mission',
    icon: 'fa-bullseye',
    title: '사람들의 취향을 발견하고 이를 통해 행복한 삶을 추구하는 사회를 만들기',
    description:
      '개인의 취향이 곧 세상의 트렌드를 만들어 낸다는 것에 공감합니다. 개인의 취향이 모여 모두가 행복한 사회를 만들기 위해 끊임 없이 고민하고 나아갑니다.',
  },
  {
    type: 'Vision',
    icon: 'fa-eye',
    title: '향 정보의 기준을 분석하여 누구나 향을 쉽게 선택할 수 있도록 하기',
    description:
      '후각으로 전달되는 향은 취향에 민감합니다. 우리는 후각 취향을 선택하는 것을 도와 향기롭고 아름다운 공간과 나를 만들기 위해 노력합니다.',
  },
  {
    type: 'Core Value',
    icon: 'fa-heart',
    values: [
      {
        title: '존중 커뮤니케이션',
        description:
          '사람들의 취향과 의견을 진심으로 존중하며, 이는 곧 새로운 생각의 접근과 발견이 가능하다고 믿습니다',
      },
      {
        title: '발견',
        description:
          '새로운 아이디어를 끊임 없이 발견하고, 이를 통해 끊임 없이 발전 할 것이라 믿습니다',
      },
      {
        title: '발전과 상생',
        description:
          '고객과 임직원 그리고 파트너와의 동반 발전을 통해 모두가 상생할 수 있는 세상으로 나아갑니다',
      },
      {
        title: '지속 가능',
        description:
          '고객과 기업 그리고 지구가 함께 살아갈 수 있는 지속 가능한 세계를 꿈꿉니다',
      },
    ],
  },
];

export default function MVCSection() {
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
              Mission · Vision · Core Value
            </h2>
            <p className="text-lg text-gray-600">우리의 가치와 비전</p>
          </div>
          
          <div className="grid lg:grid-cols-3 gap-8">
            {mvcData.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                animate={isVisible ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: index * 0.2, duration: 0.6 }}
                whileHover={{ scale: 1.02, y: -5 }}
                className="bg-brand-cream p-8 rounded-xl shadow-lg hover:shadow-xl transition-all"
              >
                <div className="text-center mb-6">
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    className="w-16 h-16 bg-brand-coral rounded-full flex items-center justify-center mx-auto mb-4"
                  >
                    <i className={`fas ${item.icon} text-white text-2xl`} />
                  </motion.div>
                  <h3 className="text-2xl font-bold gradient-text mb-4">{item.type}</h3>
                </div>
                
                {item.type === 'Core Value' ? (
                  <div className="space-y-6">
                    {item.values?.map((value, valueIndex) => (
                      <motion.div
                        key={valueIndex}
                        initial={{ opacity: 0, x: -20 }}
                        animate={isVisible ? { opacity: 1, x: 0 } : {}}
                        transition={{ delay: (index * 0.2) + (valueIndex * 0.1), duration: 0.4 }}
                      >
                        <h4 className="font-semibold mb-2">{value.title}</h4>
                        <p className="text-gray-600 text-sm">{value.description}</p>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-4">
                    <h4 className="text-lg font-semibold">{item.title}</h4>
                    <p className="text-gray-600 text-sm leading-relaxed">{item.description}</p>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
