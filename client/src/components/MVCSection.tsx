import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { siteConfig } from '@shared/siteConfig';



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
              {siteConfig.mvc.title}
            </h2>
            <p className="text-lg text-gray-600">{siteConfig.mvc.subtitle}</p>
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
                <h4 className="text-lg font-semibold">{siteConfig.mvc.mission.title}</h4>
                <p className="text-gray-600 text-sm leading-relaxed">{siteConfig.mvc.mission.description}</p>
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
                <h4 className="text-lg font-semibold">{siteConfig.mvc.vision.title}</h4>
                <p className="text-gray-600 text-sm leading-relaxed">{siteConfig.mvc.vision.description}</p>
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
                {siteConfig.mvc.coreValues.map((value, valueIndex) => (
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
