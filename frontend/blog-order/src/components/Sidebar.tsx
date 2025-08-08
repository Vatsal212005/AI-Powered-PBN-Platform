import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from './ui/button';
import { PenTool, Edit3, Eye, Globe, Settings, Sparkles } from 'lucide-react';
import { cn } from '../lib/utils';

const navigation = [
  { name: "Generate Blogs", href: "/", icon: PenTool },
  { name: "Edit Blogs", href: "/edit", icon: Edit3 },
  { name: "View Blogs", href: "/blogs", icon: Eye },
  { name: "Create Domain", href: "/domains/create", icon: Globe },
  { name: "View Domains", href: "/domains", icon: Settings },
];

interface SidebarProps {
  open?: boolean;
  collapsed?: boolean;
  onClose?: () => void;
  onChevronClick?: () => void;
}

const Sidebar: React.FC<SidebarProps> = () => {
  const location = useLocation();

  return (
    <div className="fixed inset-y-0 left-0 z-50 w-64 glass-sidebar">
      <div className="flex flex-col h-full">
        {/* Logo */}
        <div className="flex items-center gap-3 p-6 border-b border-white/20 dark:border-white/10">
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg floating">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-semibold text-foreground">AI BlogGen</h1>
            <p className="text-xs text-muted-foreground">Admin Panel</p>
          </div>
        </div>

        {/* New Blog Post Button */}
        <div className="p-4">
          <Link to="/">
            <Button className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-xl h-11 font-medium shadow-lg">
              <PenTool className="w-4 h-4 mr-2" />
              New Blog Post
            </Button>
          </Link>
        </div>

        {/* Navigation */}
        <div className="flex-1 px-4">
          <nav className="space-y-2">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <Link key={item.name} to={item.href}>
                  <Button
                    variant="ghost"
                    className={cn(
                      "w-full justify-start gap-3 h-11 px-3 rounded-xl transition-all duration-300",
                      isActive
                        ? "bg-gradient-to-r from-indigo-500/20 to-purple-500/20 text-indigo-700 dark:text-indigo-300 font-medium border border-indigo-200/50 dark:border-indigo-400/30 shadow-md"
                        : "text-muted-foreground hover:bg-white/30 dark:hover:bg-white/10 hover:text-foreground"
                    )}
                  >
                    <item.icon className="w-5 h-5" />
                    <span>{item.name}</span>
                  </Button>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* User Profile */}
        <div className="p-4 border-t border-white/20 dark:border-white/10">
          <div className="flex items-center gap-3 p-3 rounded-xl glass dark-gradient-overlay">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-md">
              <span className="text-white text-sm font-medium">A</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground">Admin User</p>
              <p className="text-xs text-muted-foreground truncate">admin@bloggen.ai</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
