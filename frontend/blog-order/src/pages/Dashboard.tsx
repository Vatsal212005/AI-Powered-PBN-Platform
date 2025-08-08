import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { PenTool, Edit3, Eye, Globe, TrendingUp, FileText } from 'lucide-react';
import { Link } from 'react-router-dom';

const quickActions = [
  {
    title: "Generate New Blog",
    description: "Create AI-powered blog content in minutes",
    icon: PenTool,
    href: "/generate",
    gradient: "from-blue-500 to-cyan-500",
  },
  {
    title: "Edit Existing Blogs",
    description: "Modify and enhance your blog posts",
    icon: Edit3,
    href: "/edit",
    gradient: "from-green-500 to-emerald-500",
  },
  {
    title: "View All Blogs",
    description: "Browse and manage your blog library",
    icon: Eye,
    href: "/blogs",
    gradient: "from-purple-500 to-pink-500",
  },
  {
    title: "Create New Domain",
    description: "Set up a new blog domain",
    icon: Globe,
    href: "/domains/create",
    gradient: "from-orange-500 to-red-500",
  },
];

const stats = [
  {
    title: "Total Blogs",
    value: "24",
    icon: FileText,
    color: "text-blue-600 dark:text-blue-400",
    bg: "bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950/50 dark:to-blue-900/30",
  },
  {
    title: "Published",
    value: "18",
    icon: Eye,
    color: "text-green-600 dark:text-green-400",
    bg: "bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950/50 dark:to-green-900/30",
  },
  {
    title: "Total Views",
    value: "12.4K",
    icon: TrendingUp,
    color: "text-purple-600 dark:text-purple-400",
    bg: "bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950/50 dark:to-purple-900/30",
  },
  {
    title: "Active Domains",
    value: "6",
    icon: Globe,
    color: "text-orange-600 dark:text-orange-400",
    bg: "bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-950/50 dark:to-orange-900/30",
  },
];

const recentBlogs = [
  {
    title: "The Future of AI in Content Creation",
    status: "Published",
    views: "2.4K",
    date: "2 hours ago",
  },
  {
    title: "10 SEO Tips for Better Rankings",
    status: "Draft",
    views: "0",
    date: "1 day ago",
  },
  {
    title: "Digital Marketing Trends 2024",
    status: "Published",
    views: "1.8K",
    date: "3 days ago",
  },
];

export default function Dashboard() {
  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="glass-card rounded-2xl p-8 dark-gradient-overlay">
        <h1 className="text-3xl font-bold text-foreground mb-2">
          Welcome to AI BlogGen
        </h1>
        <p className="text-muted-foreground">
          Manage your AI-powered blog content creation and domains
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card key={index} className="glass-card border-white/20 dark:border-white/10 dark-gradient-overlay">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                  <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                </div>
                <div className={`h-12 w-12 ${stat.bg} rounded-lg flex items-center justify-center shadow-lg`}>
                  <stat.icon className={`h-6 w-6 ${stat.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-xl font-semibold text-foreground mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {quickActions.map((action, index) => (
            <Link key={index} to={action.href}>
              <Card className="glass-card border-white/20 dark:border-white/10 hover:shadow-xl transition-all duration-300 cursor-pointer group dark-gradient-overlay">
                <CardContent className="p-6">
                  <div className={`w-12 h-12 bg-gradient-to-br ${action.gradient} rounded-lg flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    <action.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    {action.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {action.description}
                  </p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Blogs */}
        <Card className="glass-card border-white/20 dark:border-white/10 dark-gradient-overlay">
          <CardHeader>
            <CardTitle className="text-foreground">Recent Blogs</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentBlogs.map((blog, index) => (
              <div key={index} className="flex items-center justify-between p-4 glass rounded-lg">
                <div className="flex-1">
                  <h4 className="font-medium text-foreground mb-1">{blog.title}</h4>
                  <div className="flex items-center gap-2">
                    <span className={`inline-flex px-2 py-1 text-xs rounded-full ${
                      blog.status === "Published" 
                        ? "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400" 
                        : "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400"
                    }`}>
                      {blog.status}
                    </span>
                    <span className="text-xs text-muted-foreground">{blog.views} views</span>
                  </div>
                </div>
                <span className="text-xs text-muted-foreground">{blog.date}</span>
              </div>
            ))}
            <Link to="/blogs">
              <Button variant="outline" className="w-full glass border-white/30 dark:border-white/20">
                View All Blogs
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <Card className="glass-card border-white/20 dark:border-white/10 dark-gradient-overlay">
          <CardHeader>
            <CardTitle className="text-foreground">This Month</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-4 glass rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950/50 dark:to-blue-900/30 rounded-lg flex items-center justify-center shadow-md">
                  <PenTool className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <p className="font-medium text-foreground">Blogs Created</p>
                  <p className="text-sm text-muted-foreground">This month</p>
                </div>
              </div>
              <span className="text-2xl font-bold text-foreground">8</span>
            </div>
            
            <div className="flex items-center justify-between p-4 glass rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950/50 dark:to-green-900/30 rounded-lg flex items-center justify-center shadow-md">
                  <TrendingUp className="w-5 h-5 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <p className="font-medium text-foreground">Total Views</p>
                  <p className="text-sm text-muted-foreground">This month</p>
                </div>
              </div>
              <span className="text-2xl font-bold text-foreground">3.2K</span>
            </div>

            <div className="flex items-center justify-between p-4 glass rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950/50 dark:to-purple-900/30 rounded-lg flex items-center justify-center shadow-md">
                  <Globe className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <p className="font-medium text-foreground">Active Domains</p>
                  <p className="text-sm text-muted-foreground">Currently running</p>
                </div>
              </div>
              <span className="text-2xl font-bold text-foreground">6</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
