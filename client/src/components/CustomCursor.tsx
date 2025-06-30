import { useEffect, useState, useRef } from 'react';

export default function CustomCursor() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [followerPosition, setFollowerPosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const animationRef = useRef<number>();

  // 관리자 페이지에서는 커스텀 커서 비활성화
  const isAdminPage = window.location.pathname.includes('/admin') || window.location.pathname.includes('/login');
  
  if (isAdminPage) {
    return null;
  }

  useEffect(() => {
    const updateMousePosition = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    const handleMouseEnter = () => setIsHovering(true);
    const handleMouseLeave = () => setIsHovering(false);

    document.addEventListener('mousemove', updateMousePosition);

    // Add hover effects to interactive elements
    const interactiveElements = document.querySelectorAll('a, button, .hover-target');
    interactiveElements.forEach(element => {
      element.addEventListener('mouseenter', handleMouseEnter);
      element.addEventListener('mouseleave', handleMouseLeave);
    });

    return () => {
      document.removeEventListener('mousemove', updateMousePosition);
      interactiveElements.forEach(element => {
        element.removeEventListener('mouseenter', handleMouseEnter);
        element.removeEventListener('mouseleave', handleMouseLeave);
      });
    };
  }, []);

  useEffect(() => {
    const animateFollower = () => {
      setFollowerPosition(prev => {
        const dx = mousePosition.x - prev.x;
        const dy = mousePosition.y - prev.y;
        
        return {
          x: prev.x + dx * 0.1,
          y: prev.y + dy * 0.1
        };
      });
      
      animationRef.current = requestAnimationFrame(animateFollower);
    };

    animationRef.current = requestAnimationFrame(animateFollower);
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [mousePosition]);

  return (
    <>
      <div
        className={`custom-cursor ${isHovering ? 'cursor-hover' : ''}`}
        style={{
          left: mousePosition.x - 10,
          top: mousePosition.y - 10,
        }}
      />
      <div
        className={`custom-cursor-follower ${isHovering ? 'cursor-hover' : ''}`}
        style={{
          left: followerPosition.x - 20,
          top: followerPosition.y - 20,
        }}
      />
    </>
  );
}
