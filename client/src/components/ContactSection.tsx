import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { useSiteContent } from '@/hooks/useSiteContent';

export default function ContactSection() {
  const [isVisible, setIsVisible] = useState(false);
  const { data: contactContent, isLoading, error } = useSiteContent('contact');
  
  const contactData = {
    title: contactContent?.data?.title || "함께 성장하실 여러분들의 연락을 기다립니다",
    email: contactContent?.data?.email || "contact@studiolabs.co.kr",
    businessInquiry: contactContent?.data?.businessInquiry || {
      title: "협업/입점 문의",
      description: "비즈니스 파트너십 및 제휴 문의",
      buttonText: "문의하기",
      icon: "fa-handshake"
    },
    recruitment: contactContent?.data?.recruitment || {
      title: "채용 공고 보기",
      description: "함께 성장할 팀원을 찾고 있습니다",
      buttonText: "채용 정보 확인",
      icon: "fa-users",
      isActive: false,
      inactiveMessage: "현재 진행 중인 공고가 없습니다"
    },
    teamImage: contactContent?.data?.teamImage || "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400"
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
            {contactData.title}
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
                  className={`fas ${contactData.businessInquiry.icon} text-brand-coral text-4xl mb-4`}
                />
                <h3 className="text-xl font-semibold mb-2">{contactData.businessInquiry.title}</h3>
                <p className="text-gray-600">{contactData.businessInquiry.description}</p>
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => window.location.href = `mailto:${contactData.email}?subject=협업/입점 문의`}
                className="w-full bg-brand-coral text-white py-3 px-6 rounded-full hover:bg-brand-coral/90 transition-all font-medium shadow-md hover:shadow-lg"
              >
                {contactData.businessInquiry.buttonText}
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
                  className={`fas ${contactData.recruitment.icon} text-brand-coral text-4xl mb-4`}
                />
                <h3 className="text-xl font-semibold mb-2">{contactData.recruitment.title}</h3>
                <p className="text-gray-600">{contactData.recruitment.description}</p>
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  if (contactData.recruitment.isActive) {
                    // Handle active recruitment
                    alert('채용 페이지로 이동합니다.');
                  } else {
                    alert(contactData.recruitment.inactiveMessage);
                  }
                }}
                className="w-full border-2 border-brand-coral text-brand-coral py-3 px-6 rounded-full hover:bg-brand-coral hover:text-white transition-all font-medium shadow-md hover:shadow-lg"
              >
                {contactData.recruitment.buttonText}
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
              src={contactData.teamImage}
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
