import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { siteConfig } from '@shared/siteConfig';

export default function ContactSection() {
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

    const element = document.getElementById('contact');
    if (element) observer.observe(element);

    return () => observer.disconnect();
  }, []);

  return (
    <section id="contact" className="py-20 bg-brand-cream">
      <div className="max-w-4xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center"
        >
          <h2 className="text-4xl font-korean gradient-text mb-8">
            {siteConfig.contact.title}
          </h2>
          
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isVisible ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="grid md:grid-cols-2 gap-6 mt-12"
          >
            {/* Business Inquiry */}
            <motion.div
              whileHover={{ scale: 1.02, y: -5 }}
              className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-all"
            >
              <div className="mb-6">
                <motion.i
                  whileHover={{ scale: 1.2, rotate: 5 }}
                  className={`fas ${siteConfig.contact.businessInquiry.icon} text-brand-coral text-4xl mb-4`}
                />
                <h3 className="text-xl font-semibold mb-2">{siteConfig.contact.businessInquiry.title}</h3>
                <p className="text-gray-600">{siteConfig.contact.businessInquiry.description}</p>
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => window.location.href = `mailto:${siteConfig.contact.email}?subject=협업/입점 문의`}
                className="w-full bg-brand-coral text-white py-3 px-6 rounded-full hover:bg-brand-coral/90 transition-all font-medium shadow-md hover:shadow-lg"
              >
                {siteConfig.contact.businessInquiry.buttonText}
              </motion.button>
            </motion.div>
            
            {/* Recruitment */}
            <motion.div
              whileHover={{ scale: 1.02, y: -5 }}
              className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-all"
            >
              <div className="mb-6">
                <motion.i
                  whileHover={{ scale: 1.2, rotate: 5 }}
                  className={`fas ${siteConfig.contact.recruitment.icon} text-brand-coral text-4xl mb-4`}
                />
                <h3 className="text-xl font-semibold mb-2">{siteConfig.contact.recruitment.title}</h3>
                <p className="text-gray-600">{siteConfig.contact.recruitment.description}</p>
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  if (siteConfig.contact.recruitment.isActive) {
                    // Handle active recruitment
                    alert('채용 페이지로 이동합니다.');
                  } else {
                    alert(siteConfig.contact.recruitment.inactiveMessage);
                  }
                }}
                className="w-full border-2 border-brand-coral text-brand-coral py-3 px-6 rounded-full hover:bg-brand-coral hover:text-white transition-all font-medium shadow-md hover:shadow-lg"
              >
                {siteConfig.contact.recruitment.buttonText}
              </motion.button>
            </motion.div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isVisible ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="mt-12 p-8 bg-white rounded-xl shadow-lg"
          >
            <img
              src={siteConfig.contact.teamImage}
              alt="Professional Korean business team collaborating in modern office space"
              className="w-full h-64 object-cover rounded-lg mb-6"
            />
            <div className="text-center">
              <motion.div
                initial={{ opacity: 0, y: -30 }}
                animate={isVisible ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.6, duration: 0.4 }}
              >
                <h4 className="font-semibold mb-2 text-brand-coral text-lg">이메일</h4>
                <p className="text-gray-600 text-lg">contact@studiolabs.co.kr</p>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
