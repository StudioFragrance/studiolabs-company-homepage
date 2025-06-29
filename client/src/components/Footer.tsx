import { motion } from 'framer-motion';
import studioLogo from '@/assets/studio-logo.png';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-16">
      <div className="max-w-6xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="grid md:grid-cols-2 lg:grid-cols-4 gap-8"
        >
          <div className="lg:col-span-2">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="flex items-center mb-4"
            >
              <img 
                src={studioLogo} 
                alt="Studio Logo" 
                className="h-10 w-auto brightness-0 invert"
              />
            </motion.div>
            <p className="text-gray-400 mb-6">당신의 취향을 읽다, 완벽한 향을 건네다</p>
            <img
              src="https://images.unsplash.com/photo-1497366216548-37526070297c?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=200"
              alt="Clean minimalist office workspace representing Studio fragrance brand values"
              className="rounded-lg w-full h-32 object-cover"
            />
          </div>
          
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h4 className="font-semibold mb-4">회사 정보</h4>
            <div className="space-y-2 text-sm text-gray-400">
              <p>스튜디오랩스</p>
              <p>대표자 배성준</p>
              <p>부산광역시 해운대구<br />센텀동로 45, 1층</p>
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h4 className="font-semibold mb-4">사업자 정보</h4>
            <div className="space-y-2 text-sm text-gray-400">
              <p>사업자등록번호<br />751-16-02446</p>
              <p>통신판매업<br />2024-부산해운대-1007</p>
              <p>호스팅: AWS</p>
            </div>
          </motion.div>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          viewport={{ once: true }}
          className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center"
        >
          <p className="text-gray-400 text-sm">© 2025 Studio fragrance. All rights reserved.</p>
          <div className="flex space-x-4 mt-4 md:mt-0">
            <motion.a
              href="mailto:contact@studiolabs.co.kr"
              whileHover={{ scale: 1.2, y: -2 }}
              className="text-gray-400 hover:text-brand-coral transition-colors"
            >
              <i className="fas fa-envelope" />
            </motion.a>
            <motion.a
              href="https://www.instagram.com/studiofragrance_official/"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.2, y: -2 }}
              className="text-gray-400 hover:text-brand-coral transition-colors"
            >
              <i className="fab fa-instagram" />
            </motion.a>
          </div>
        </motion.div>
      </div>
    </footer>
  );
}
