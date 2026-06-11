import { cn } from '@/utils/format';
import { Bell, User, ChevronDown, LogOut, Settings } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import type { User as UserType } from '@/types';

interface HeaderProps {
  user: UserType;
  enterpriseName: string;
  className?: string;
}

export function Header({ user, enterpriseName, className }: HeaderProps) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 h-64 bg-white border-b border-gray-100',
        'flex items-center justify-between px-24 z-40',
        className
      )}
    >
      <div className="flex items-center gap-16">
        <Link to="/" className="flex items-center gap-12">
          <div className="w-40 h-40 bg-[#1E3A5F] rounded-8 flex items-center justify-center">
            <span className="text-white font-bold text-lg">OP</span>
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-semibold text-[#1E3A5F]">开放能力伙伴门户</span>
            <span className="text-xs text-gray-400">{enterpriseName}</span>
          </div>
        </Link>
      </div>

      <div className="flex items-center gap-16">
        <button className="p-8 rounded-full hover:bg-gray-100 transition-colors">
          <Bell className="w-20 h-20 text-gray-500" />
        </button>

        <div ref={dropdownRef} className="relative">
          <button
            className={cn(
              'flex items-center gap-8 px-12 py-8 rounded-8',
              'hover:bg-gray-100 transition-colors'
            )}
            onClick={() => setDropdownOpen(!dropdownOpen)}
          >
            {user.avatar ? (
              <img
                src={user.avatar}
                alt={user.name}
                className="w-32 h-32 rounded-full"
              />
            ) : (
              <div className="w-32 h-32 rounded-full bg-[#38B2AC] flex items-center justify-center">
                <User className="w-16 h-16 text-white" />
              </div>
            )}
            <span className="text-sm font-medium text-gray-700">{user.name}</span>
            <ChevronDown className={cn(
              'w-16 h-16 text-gray-400 transition-transform',
              dropdownOpen && 'rotate-180'
            )} />
          </button>

          {dropdownOpen && (
            <div className={cn(
              'absolute right-0 top-48 w-200 bg-white rounded-12 shadow-lg',
              'border border-gray-100 py-8 animate-in fade-in slide-in-from-top-2 duration-200'
            )}>
              <div className="px-16 py-12 border-b border-gray-100">
                <div className="text-sm font-medium text-gray-700">{user.name}</div>
                <div className="text-xs text-gray-400">{user.email}</div>
              </div>
              
              <Link
                to="/settings"
                className="flex items-center gap-12 px-16 py-12 hover:bg-gray-50 transition-colors"
              >
                <Settings className="w-16 h-16 text-gray-500" />
                <span className="text-sm text-gray-600">设置</span>
              </Link>
              
              <button
                className="flex items-center gap-12 px-16 py-12 hover:bg-gray-50 transition-colors w-full"
              >
                <LogOut className="w-16 h-16 text-gray-500" />
                <span className="text-sm text-gray-600">退出登录</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}