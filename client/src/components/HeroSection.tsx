import { motion } from 'framer-motion';
import { siteConfig } from '@shared/siteConfig';

export default function HeroSection() {
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="min-h-screen flex items-center justify-center relative overflow-hidden bg-brand-cream">
      {/* Background with elegant botanical elements */}
      <div 
        className="absolute inset-0 parallax opacity-10"
        style={{
          backgroundImage: `url('${siteConfig.hero.backgroundImage}')`,
        }}
      />
      
      <div className="relative z-10 text-center max-w-4xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="text-lg text-gray-600 mb-4 font-light"
          >
            {siteConfig.hero.subtitle}
          </motion.p>
          
          <motion.h1
            className="text-5xl md:text-7xl font-korean font-bold mb-8 overflow-visible"
            style={{ 
              lineHeight: '1.3',
              paddingTop: '0.5rem',
              paddingBottom: '0.5rem',
              minHeight: 'fit-content'
            }}
          >
            <motion.span 
              className="gradient-text block"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.6 }}
            >
              {Array.from(siteConfig.hero.mainTitle.line1).map((char, index) => (
                <motion.span
                  key={index}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 + index * 0.05, duration: 0.05 }}
                >
                  {char}
                </motion.span>
              ))}
            </motion.span>
            <motion.span 
              className="text-gray-900 block"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2, duration: 0.6 }}
            >
              {Array.from(siteConfig.hero.mainTitle.line2).map((char, index) => (
                <motion.span
                  key={index}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.2 + index * 0.05, duration: 0.05 }}
                >
                  {char}
                </motion.span>
              ))}
            </motion.span>
          </motion.h1>
          

          
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >

            <motion.a
              href={siteConfig.hero.ctaButton.url}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              className="border-2 border-brand-coral text-brand-coral px-8 py-4 rounded-full hover:bg-brand-coral hover:text-white transition-all font-medium shadow-lg hover:shadow-xl inline-block"
            >
              <i className="fas fa-robot mr-2" />
              {siteConfig.hero.ctaButton.text}
            </motion.a>
          </motion.div>
        </motion.div>
      </div>
      
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 0.6 }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
      >
        <motion.button
          animate={{ y: [0, -10, 0] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
          onClick={() => scrollToSection('story')}
          className="text-brand-coral text-2xl hover:text-brand-coral/80 transition-colors"
        >
          <i className="fas fa-chevron-down" />
        </motion.button>
      </motion.div>
    </section>
  );
}
