// src/components/Layout/Layout.jsx
import Sidebar from './Sidebar';
import GlassCard from './GlassCard';
import Toast from './Toast';
import { useToast } from '../../hooks/useToast';
import { useTheme } from '../../contexts/ThemeContext';

const Layout = ({ children }) => {
  const { toast } = useToast();
  const { isDarkMode } = useTheme();

  return (
    <main 
      className="w-screen h-screen p-4 font-sans transition-colors duration-300"
      style={{
        backgroundColor: isDarkMode ? '#0f172a' : '#f9fafb'
      }}
    >
      <div 
        className="absolute inset-0 -z-10 h-full w-full bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]"
        style={{
          backgroundColor: isDarkMode ? '#0f172a' : '#ffffff'
        }}
      ></div>
      <div className="h-full w-full grid grid-cols-[280px_1fr] gap-4">
        <Sidebar />
        <GlassCard className="overflow-hidden">
          {children}
        </GlassCard>
      </div>
      <Toast message={toast.message} visible={toast.visible} type={toast.type} />
    </main>
  );
};

export default Layout;