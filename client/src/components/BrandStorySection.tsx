import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { siteConfig } from '@shared/siteConfig';
import { useSiteContent } from '@/hooks/useSiteContent';

export default function BrandStorySection() {
  const [isVisible, setIsVisible] = useState(false);
  const { data: brandStoryContent, isLoading, error } = useSiteContent('brandStory');

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    const element = document.getElementById('story');
    if (element) observer.observe(element);

    return () => observer.disconnect();
  }, []);

  // Fallback to siteConfig if database content is not available
  const content = brandStoryContent?.data || siteConfig.brandStory;
  
  // Ensure all required fields exist with proper fallbacks
  const brandStoryData = {
    title: content?.title || siteConfig.brandStory.title,
    quote: content?.quote || siteConfig.brandStory.quote,
    content: content?.content || siteConfig.brandStory.content,
    ctaButton: {
      text: content?.ctaButton?.text || siteConfig.brandStory.ctaButton.text,
      url: content?.ctaButton?.url || siteConfig.brandStory.ctaButton.url
    },
    image: content?.image || siteConfig.brandStory.image,
    statistics: content?.statistics || siteConfig.brandStory.statistics
  };

  if (isLoading) {
    return (
      <section id="story" className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-primary mx-auto"></div>
          <p className="mt-4 text-brand-primary">로딩 중...</p>
        </div>
      </section>
    );
  }

  if (error) {
    console.warn('Failed to load brand story content from database, using fallback:', error);
  }

  return (
    <section id="story" className="py-20 bg-white">
      <div className="max-w-6xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="grid lg:grid-cols-2 gap-12 items-center"
        >
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={isVisible ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 0.2, duration: 0.8 }}
          >
            <img
              src={brandStoryData.image}
              alt="Professional fragrance laboratory with testing equipment"
              className="rounded-2xl shadow-xl w-full h-auto"
            />
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={isVisible ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="space-y-6"
          >
            <h2 className="text-4xl font-korean font-bold gradient-text">{brandStoryData.title}</h2>
            <div className="space-y-4 text-lg leading-relaxed text-gray-700">
              <p className="italic text-brand-coral font-medium">
                "{brandStoryData.quote}"
              </p>
              {brandStoryData.content.map((paragraph, index) => (
                <p key={index} className={index === brandStoryData.content.length - 1 ? "font-medium" : ""}>
                  {paragraph}
                </p>
              ))}
            </div>
            
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={isVisible ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.6, duration: 0.6 }}
              className="pt-6"
            >
              <motion.a
                href={brandStoryData.ctaButton.url}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className="inline-flex items-center bg-brand-coral text-white px-8 py-4 rounded-full hover:bg-brand-coral/90 transition-all font-medium text-lg shadow-lg hover:shadow-xl"
              >
                <span>{brandStoryData.ctaButton.text}</span>
                <i className="fas fa-external-link-alt ml-3" />
              </motion.a>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={isVisible ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.8, duration: 0.6 }}
              className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-8"
            >
              {brandStoryData.statistics.map((stat: any, index: number) => (
                <motion.div
                  key={index}
                  whileHover={{ scale: 1.02, y: -2 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  className="bg-brand-cream p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300"
                >
                  <div className="flex items-center mb-3">
                    <i className={`fas ${stat.icon} text-brand-coral text-xl mr-3`} />
                    <h4 className="font-semibold">{stat.title}</h4>
                  </div>
                  <p className="text-sm text-gray-600">{stat.description}</p>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
