import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard,
  User, 
  Sliders, 
  Bell, 
  Moon, 
  Sun, 
  Monitor, 
  Check, 
  ChevronRight, 
  LogOut,
  Sparkles
} from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { useProfileStore } from '../../store/useProfileStore';
import { useAuth } from '../../hooks/useAuth';
import toast from 'react-hot-toast';

interface ProfileDropdownProps {
  isOpen: boolean;
  onClose: () => void;
  positionClass?: string;
}

export default function ProfileDropdown({ isOpen, onClose, positionClass = 'right-0 mt-3' }: ProfileDropdownProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const isLanding = location.pathname === '/';
  const { user } = useAuthStore();
  const { profile, preferences, updatePreferences } = useProfileStore();
  const { logout, isLoggingOut } = useAuth();
  
  const [showAppearanceSideCard, setShowAppearanceSideCard] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const hoverTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Close when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        onClose();
        setShowAppearanceSideCard(false);
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSetTheme = (theme: 'light' | 'dark' | 'system') => {
    updatePreferences({ themeMode: 'light' });
    
    // Enforce light theme directly to DOM root
    const root = document.documentElement;
    root.classList.remove('dark');
    root.style.colorScheme = 'light';

    toast.success('Theme preference saved');
  };

  const displayName = profile.name || user?.name || 'Jaswanth Reddy';
  const username = profile.username || 'Jaswanth_Reddy_2006';
  const userInitial = displayName.charAt(0).toUpperCase() || 'J';

  const handleMouseEnterAppearance = () => {
    if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
    setShowAppearanceSideCard(true);
  };

  const handleMouseLeaveAppearance = () => {
    hoverTimeoutRef.current = setTimeout(() => {
      setShowAppearanceSideCard(false);
    }, 200);
  };

  return (
    <div ref={dropdownRef} className={`absolute z-50 ${positionClass}`}>
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: -6 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: -6 }}
        transition={{ duration: 0.15, ease: 'easeOut' }}
        className="w-72 sm:w-80 rounded-3xl bg-white text-[#11183D] border border-[#DCE7F2] shadow-2xl p-4 space-y-3 font-sans relative"
      >
        {/* 1. Header Profile Box with Initial J (White background in light theme) */}
        <Link 
          to="/profile"
          onClick={onClose}
          className="flex items-center gap-3.5 p-2 rounded-2xl hover:bg-[#EFFAFD] transition-colors group"
        >
          <div className="relative shrink-0">
            <div className="h-11 w-11 rounded-2xl bg-gradient-to-tr from-[#2459A8] to-[#4A8BDF] flex items-center justify-center text-white font-bold text-lg font-sans shadow-md border border-[#DCE7F2] group-hover:scale-105 transition-transform">
              {userInitial}
            </div>
            <div className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full bg-emerald-500 border-2 border-white" />
          </div>
          <div className="min-w-0 flex-1">
            <h4 className="text-sm font-bold text-[#11183D] tracking-tight truncate group-hover:text-[#4A8BDF] transition-colors">
              {displayName}
            </h4>
            <p className="text-[11px] text-[#526078] font-medium leading-tight mt-0.5 truncate font-mono">
              @{username}
            </p>
          </div>
        </Link>

        {/* 2. Action Menu Items: Dashboard, Profile, Settings, Notifications, Appearance, Sign Out */}
        <div className="space-y-1 pt-2 border-t border-[#DCE7F2] text-xs">
          
          {/* Item 1: Dashboard (Only shown on landing page) */}
          {isLanding && (
            <Link
              to="/dashboard"
              onClick={onClose}
              className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl hover:bg-[#EFFAFD] text-[#11183D] transition-colors"
            >
              <LayoutDashboard size={17} className="text-[#4A8BDF]" />
              <span className="font-semibold text-xs">Dashboard</span>
            </Link>
          )}

          {/* Item 2: Profile */}
          <Link
            to="/profile"
            onClick={onClose}
            className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl hover:bg-[#EFFAFD] text-[#11183D] transition-colors"
          >
            <User size={17} className="text-[#4A8BDF]" />
            <span className="font-semibold text-xs">Profile</span>
          </Link>

          {/* Item 3: Settings */}
          <Link
            to="/settings"
            onClick={onClose}
            className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl hover:bg-[#EFFAFD] text-[#11183D] transition-colors"
          >
            <Sliders size={17} className="text-[#4A8BDF]" />
            <span className="font-semibold text-xs">Settings</span>
          </Link>

          {/* Item 4: Notifications */}
          <Link
            to="/settings?tab=notifications"
            onClick={onClose}
            className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl hover:bg-[#EFFAFD] text-[#11183D] transition-colors"
          >
            <Bell size={17} className="text-[#4A8BDF]" />
            <span className="font-semibold text-xs">Notifications</span>
          </Link>

          {/* Item 5: Appearance with Side Flyout Card on Hover & Click */}
          <div 
            className="relative"
            onMouseEnter={handleMouseEnterAppearance}
            onMouseLeave={handleMouseLeaveAppearance}
          >
            <button
              type="button"
              onClick={() => setShowAppearanceSideCard(!showAppearanceSideCard)}
              className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl hover:bg-[#EFFAFD] text-[#11183D] transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <Moon size={17} className="text-[#4A8BDF]" />
                <span className="font-semibold text-xs">Appearance</span>
              </div>
              <ChevronRight size={14} className="text-[#7B8799]" />
            </button>

            {/* SIDE FLYOUT CARD: System Default, Light Mode */}
            <AnimatePresence>
              {showAppearanceSideCard && (
                <motion.div
                  initial={{ opacity: 0, x: 6, scale: 0.96 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  exit={{ opacity: 0, x: 6, scale: 0.96 }}
                  transition={{ duration: 0.12 }}
                  className="absolute left-full top-0 ml-2.5 w-52 rounded-2xl bg-white border border-[#DCE7F2] shadow-2xl p-2 space-y-1 z-50 text-[#11183D]"
                  onMouseEnter={handleMouseEnterAppearance}
                  onMouseLeave={handleMouseLeaveAppearance}
                >
                  <div className="px-2.5 py-1.5 text-[10px] font-bold uppercase tracking-wider text-[#7B8799] font-mono">
                    Theme Mode
                  </div>

                  {[
                    { id: 'light', label: 'Light Mode (Default)', icon: Sun },
                    { id: 'system', label: 'System Default', icon: Monitor },
                  ].map((item) => {
                    const isSelected = item.id === 'light';
                    const Icon = item.icon;

                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => {
                          handleSetTheme(item.id as any);
                        }}
                        className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-colors cursor-pointer ${
                          isSelected
                            ? 'bg-[#EFFAFD] text-[#4A8BDF] font-bold'
                            : 'text-[#526078] hover:bg-[#EFFAFD]'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <Icon size={14} className={isSelected ? 'text-[#4A8BDF]' : 'text-[#7B8799]'} />
                          <span>{item.label}</span>
                        </div>
                        {isSelected && (
                          <Check size={14} className="text-[#4A8BDF]" />
                        )}
                      </button>
                    );
                  })}
                </motion.div>
              )}
            </AnimatePresence>

          </div>

          {/* Item 6: Sign Out */}
          <button
            type="button"
            onClick={() => {
              onClose();
              logout();
            }}
            disabled={isLoggingOut}
            className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl hover:bg-rose-50 text-[#D64545] hover:text-[#C53030] transition-colors cursor-pointer text-left pt-2 mt-1 border-t border-[#DCE7F2] font-semibold"
          >
            <LogOut size={16} />
            <span>{isLoggingOut ? 'Signing out...' : 'Sign Out'}</span>
          </button>

        </div>
      </motion.div>
    </div>
  );
}