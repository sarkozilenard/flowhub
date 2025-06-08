import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { motion } from 'framer-motion';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/ThemeToggle';
import { LanguageSelector } from '@/components/LanguageSelector';
import { 
  Book, 
  Zap, 
  CheckCircle, 
  FileText, 
  Link as LinkIcon, 
  Calculator, 
  MessageSquare, 
  Calendar,
  Upload,
  Download,
  Shield,
  User,
  Settings,
  LogOut,
  ArrowLeft,
  ExternalLink,
  Code,
  Database,
  Cloud,
  Lock,
  Smartphone,
  Globe,
  Palette,
  Cpu,
  HardDrive
} from 'lucide-react';
import Link from 'next/link';

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.3 }
};

export default function Wiki() {
  const { user, userProfile, signOut } = useAuth();
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <motion.header 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="border-b bg-background/80 backdrop-blur-sm sticky top-0 z-50"
      >
        <div className="container-mobile nav-mobile">
          <div className="flex items-center space-x-2 sm:space-x-4">
            <Link href="/dashboard">
              <Button variant="ghost" size="sm" className="button-mobile">
                <ArrowLeft className="w-4 h-4 sm:mr-2" />
                <span className="hidden sm:inline">Back to Dashboard</span>
              </Button>
            </Link>
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 sm:w-8 sm:h-8 bg-primary rounded-lg flex items-center justify-center">
                <Zap className="w-4 h-4 sm:w-5 sm:h-5 text-primary-foreground" />
              </div>
              <span className="text-lg sm:text-2xl font-bold text-primary">FlowHub Wiki</span>
            </div>
          </div>
          
          <div className="flex items-center space-x-2 sm:space-x-4">
            <div className="hidden sm:flex items-center space-x-2">
              <LanguageSelector />
              <ThemeToggle />
            </div>
            
            {user && (
              <Button variant="ghost" size="sm" onClick={signOut} className="button-mobile">
                <LogOut className="w-4 h-4 sm:mr-2" />
                <span className="hidden sm:inline">{t('message.signOut')}</span>
              </Button>
            )}
          </div>
        </div>
      </motion.header>

      {/* Main Content */}
      <main className="container-mobile py-4 sm:py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="mb-6 sm:mb-8">
            <h1 className="heading-mobile-xl flex items-center">
              <Book className="w-6 h-6 sm:w-10 sm:h-10 mr-2 sm:mr-3 text-primary" />
              FlowHub System Documentation
            </h1>
            <p className="text-muted-foreground text-sm sm:text-lg">
              Complete guide to using FlowHub's productivity features and tools
            </p>
          </div>

          <Tabs defaultValue="overview" className="space-y-4 sm:space-y-6">
            <TabsList className="grid w-full grid-cols-3 sm:grid-cols-6 h-auto">
              <TabsTrigger value="overview" className="text-xs sm:text-sm">Overview</TabsTrigger>
              <TabsTrigger value="features" className="text-xs sm:text-sm">Features</TabsTrigger>
              <TabsTrigger value="tools" className="text-xs sm:text-sm">Tools</TabsTrigger>
              <TabsTrigger value="technical" className="text-xs sm:text-sm hidden sm:flex">Technical</TabsTrigger>
              <TabsTrigger value="admin" className="text-xs sm:text-sm hidden sm:flex">Admin</TabsTrigger>
              <TabsTrigger value="faq" className="text-xs sm:text-sm hidden sm:flex">FAQ</TabsTrigger>
            </TabsList>

            {/* Mobile-only additional tabs */}
            <div className="sm:hidden">
              <TabsList className="grid w-full grid-cols-3 h-auto">
                <TabsTrigger value="technical" className="text-xs">Technical</TabsTrigger>
                <TabsTrigger value="admin" className="text-xs">Admin</TabsTrigger>
                <TabsTrigger value="faq" className="text-xs">FAQ</TabsTrigger>
              </TabsList>
            </div>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-4 sm:space-y-6">
              <motion.div variants={fadeInUp}>
                <Card className="card-mobile">
                  <CardHeader>
                    <CardTitle className="heading-mobile-lg flex items-center">
                      <Zap className="w-5 h-5 sm:w-6 sm:h-6 mr-2 text-primary" />
                      What is FlowHub?
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-muted-foreground text-sm sm:text-base">
                      FlowHub is a modern, all-in-one productivity web application designed to streamline your daily workflow. 
                      Built with cutting-edge technologies, it provides a comprehensive suite of tools for task management, 
                      note-taking, file conversion, and much more.
                    </p>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <h4 className="font-semibold text-sm sm:text-base">Key Benefits:</h4>
                        <ul className="space-y-1 text-xs sm:text-sm text-muted-foreground">
                          <li>• Unified productivity platform</li>
                          <li>• Secure user data isolation</li>
                          <li>• Modern, responsive design</li>
                          <li>• Multi-language support</li>
                          <li>• Dark/Light theme modes</li>
                          <li>• Mobile-optimized interface</li>
                        </ul>
                      </div>
                      
                      <div className="space-y-2">
                        <h4 className="font-semibold text-sm sm:text-base">Target Users:</h4>
                        <ul className="space-y-1 text-xs sm:text-sm text-muted-foreground">
                          <li>• Individual professionals</li>
                          <li>• Students and researchers</li>
                          <li>• Content creators</li>
                          <li>• Small team collaborators</li>
                          <li>• Anyone seeking productivity tools</li>
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div variants={fadeInUp}>
                <Card className="card-mobile">
                  <CardHeader>
                    <CardTitle className="heading-mobile-lg flex items-center">
                      <Code className="w-5 h-5 sm:w-6 sm:h-6 mr-2 text-primary" />
                      Technology Stack
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
                      <div className="space-y-3">
                        <h4 className="font-semibold text-sm sm:text-base flex items-center">
                          <Globe className="w-4 h-4 mr-2" />
                          Frontend
                        </h4>
                        <div className="space-y-2">
                          <Badge variant="outline" className="text-xs">Next.js 14</Badge>
                          <Badge variant="outline" className="text-xs">React 18</Badge>
                          <Badge variant="outline" className="text-xs">TypeScript</Badge>
                          <Badge variant="outline" className="text-xs">Tailwind CSS</Badge>
                          <Badge variant="outline" className="text-xs">shadcn/ui</Badge>
                          <Badge variant="outline" className="text-xs">Framer Motion</Badge>
                        </div>
                      </div>
                      
                      <div className="space-y-3">
                        <h4 className="font-semibold text-sm sm:text-base flex items-center">
                          <Database className="w-4 h-4 mr-2" />
                          Backend
                        </h4>
                        <div className="space-y-2">
                          <Badge variant="outline" className="text-xs">Supabase</Badge>
                          <Badge variant="outline" className="text-xs">PostgreSQL</Badge>
                          <Badge variant="outline" className="text-xs">Prisma ORM</Badge>
                          <Badge variant="outline" className="text-xs">Next.js API Routes</Badge>
                        </div>
                      </div>
                      
                      <div className="space-y-3">
                        <h4 className="font-semibold text-sm sm:text-base flex items-center">
                          <Cloud className="w-4 h-4 mr-2" />
                          Services
                        </h4>
                        <div className="space-y-2">
                          <Badge variant="outline" className="text-xs">DeepL API</Badge>
                          <Badge variant="outline" className="text-xs">OpenAI API</Badge>
                          <Badge variant="outline" className="text-xs">CloudConvert API</Badge>
                          <Badge variant="outline" className="text-xs">Vercel Hosting</Badge>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </TabsContent>

            {/* Features Tab */}
            <TabsContent value="features" className="space-y-4 sm:space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                <motion.div variants={fadeInUp}>
                  <Card className="card-mobile">
                    <CardHeader>
                      <CardTitle className="heading-mobile-lg flex items-center">
                        <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 mr-2 text-green-500" />
                        Task Management
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <p className="text-xs sm:text-sm text-muted-foreground">
                        Comprehensive to-do list system with advanced features.
                      </p>
                      <ul className="space-y-1 text-xs sm:text-sm">
                        <li>• Create, edit, and delete tasks</li>
                        <li>• Set priority levels (Low, Medium, High)</li>
                        <li>• Add due dates and descriptions</li>
                        <li>• Filter by status and search</li>
                        <li>• Mark tasks as complete</li>
                        <li>• Track completion rates</li>
                      </ul>
                    </CardContent>
                  </Card>
                </motion.div>

                <motion.div variants={fadeInUp}>
                  <Card className="card-mobile">
                    <CardHeader>
                      <CardTitle className="heading-mobile-lg flex items-center">
                        <FileText className="w-5 h-5 sm:w-6 sm:h-6 mr-2 text-blue-500" />
                        Notes System
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <p className="text-xs sm:text-sm text-muted-foreground">
                        Rich note-taking with organization features.
                      </p>
                      <ul className="space-y-1 text-xs sm:text-sm">
                        <li>• Create and manage notes</li>
                        <li>• Rich text content support</li>
                        <li>• Tag-based organization</li>
                        <li>• Search and filter notes</li>
                        <li>• Timestamp tracking</li>
                        <li>• Markdown support</li>
                      </ul>
                    </CardContent>
                  </Card>
                </motion.div>

                <motion.div variants={fadeInUp}>
                  <Card className="card-mobile">
                    <CardHeader>
                      <CardTitle className="heading-mobile-lg flex items-center">
                        <LinkIcon className="w-5 h-5 sm:w-6 sm:h-6 mr-2 text-purple-500" />
                        Link Shortener
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <p className="text-xs sm:text-sm text-muted-foreground">
                        Create and manage custom short links with analytics.
                      </p>
                      <ul className="space-y-1 text-xs sm:text-sm">
                        <li>• Shorten long URLs</li>
                        <li>• Custom short codes</li>
                        <li>• Click tracking and analytics</li>
                        <li>• Link titles and descriptions</li>
                        <li>• Easy copy and share</li>
                        <li>• Delete unwanted links</li>
                      </ul>
                    </CardContent>
                  </Card>
                </motion.div>

                <motion.div variants={fadeInUp}>
                  <Card className="card-mobile">
                    <CardHeader>
                      <CardTitle className="heading-mobile-lg flex items-center">
                        <Calendar className="w-5 h-5 sm:w-6 sm:h-6 mr-2 text-orange-500" />
                        Calendar & Events
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <p className="text-xs sm:text-sm text-muted-foreground">
                        Integrated calendar system for scheduling and events.
                      </p>
                      <ul className="space-y-1 text-xs sm:text-sm">
                        <li>• Create and manage events</li>
                        <li>• Set reminders and notifications</li>
                        <li>• Multiple view modes</li>
                        <li>• Event categories and colors</li>
                        <li>• Recurring events support</li>
                        <li>• Integration with tasks</li>
                      </ul>
                    </CardContent>
                  </Card>
                </motion.div>
              </div>
            </TabsContent>

            {/* Tools Tab */}
            <TabsContent value="tools" className="space-y-4 sm:space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                <motion.div variants={fadeInUp}>
                  <Card className="card-mobile">
                    <CardHeader>
                      <CardTitle className="heading-mobile-lg flex items-center">
                        <Calculator className="w-5 h-5 sm:w-6 sm:h-6 mr-2 text-green-500" />
                        Text & Unit Converters
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <p className="text-xs sm:text-sm text-muted-foreground">
                        Comprehensive conversion tools for various formats.
                      </p>
                      <div className="space-y-2">
                        <h5 className="font-medium text-sm">Text Converters:</h5>
                        <ul className="space-y-1 text-xs sm:text-sm">
                          <li>• UPPERCASE conversion</li>
                          <li>• lowercase conversion</li>
                          <li>• Title Case conversion</li>
                          <li>• Sentence case conversion</li>
                        </ul>
                        
                        <h5 className="font-medium text-sm">Unit Converters:</h5>
                        <ul className="space-y-1 text-xs sm:text-sm">
                          <li>• Temperature (°C, °F, K)</li>
                          <li>• Length (m, ft, in, km, mi)</li>
                          <li>• Weight (kg, lb, g, oz)</li>
                          <li>• File sizes (B, KB, MB, GB, TB)</li>
                        </ul>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>

                <motion.div variants={fadeInUp}>
                  <Card className="card-mobile">
                    <CardHeader>
                      <CardTitle className="heading-mobile-lg flex items-center">
                        <Upload className="w-5 h-5 sm:w-6 sm:h-6 mr-2 text-blue-500" />
                        File Converters
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <p className="text-xs sm:text-sm text-muted-foreground">
                        Powered by CloudConvert API for comprehensive file conversion.
                      </p>
                      <div className="space-y-2">
                        <h5 className="font-medium text-sm">Supported Formats:</h5>
                        <div className="grid grid-cols-2 gap-2 text-xs sm:text-sm">
                          <div>
                            <strong>Documents:</strong>
                            <ul className="text-xs text-muted-foreground">
                              <li>• PDF, DOCX, TXT</li>
                              <li>• HTML, RTF, ODT</li>
                            </ul>
                          </div>
                          <div>
                            <strong>Images:</strong>
                            <ul className="text-xs text-muted-foreground">
                              <li>• JPG, PNG, GIF</li>
                              <li>• SVG, WEBP, BMP</li>
                            </ul>
                          </div>
                          <div>
                            <strong>Audio:</strong>
                            <ul className="text-xs text-muted-foreground">
                              <li>• MP3, WAV, FLAC</li>
                              <li>• AAC, OGG, M4A</li>
                            </ul>
                          </div>
                          <div>
                            <strong>Video:</strong>
                            <ul className="text-xs text-muted-foreground">
                              <li>• MP4, AVI, MOV</li>
                              <li>• WEBM, MKV, FLV</li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>

                <motion.div variants={fadeInUp}>
                  <Card className="card-mobile">
                    <CardHeader>
                      <CardTitle className="heading-mobile-lg flex items-center">
                        <Globe className="w-5 h-5 sm:w-6 sm:h-6 mr-2 text-purple-500" />
                        Language Translator
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <p className="text-xs sm:text-sm text-muted-foreground">
                        Powered by DeepL API for high-quality translations.
                      </p>
                      <div className="space-y-2">
                        <h5 className="font-medium text-sm">Features:</h5>
                        <ul className="space-y-1 text-xs sm:text-sm">
                          <li>• 30+ supported languages</li>
                          <li>• High-quality DeepL translations</li>
                          <li>• Fallback to LibreTranslate</li>
                          <li>• Offline basic translations</li>
                          <li>• Bidirectional translation</li>
                          <li>• Copy translated text</li>
                        </ul>
                        
                        <h5 className="font-medium text-sm">Primary Languages:</h5>
                        <div className="flex flex-wrap gap-1">
                          <Badge variant="secondary" className="text-xs">English</Badge>
                          <Badge variant="secondary" className="text-xs">Hungarian</Badge>
                          <Badge variant="secondary" className="text-xs">German</Badge>
                          <Badge variant="secondary" className="text-xs">French</Badge>
                          <Badge variant="secondary" className="text-xs">Spanish</Badge>
                          <Badge variant="secondary" className="text-xs">Italian</Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>

                <motion.div variants={fadeInUp}>
                  <Card className="card-mobile">
                    <CardHeader>
                      <CardTitle className="heading-mobile-lg flex items-center">
                        <MessageSquare className="w-5 h-5 sm:w-6 sm:h-6 mr-2 text-orange-500" />
                        AI Chat Assistant
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <p className="text-xs sm:text-sm text-muted-foreground">
                        Integrated ChatGPT for productivity assistance.
                      </p>
                      <ul className="space-y-1 text-xs sm:text-sm">
                        <li>• Productivity tips and advice</li>
                        <li>• Task organization help</li>
                        <li>• Note-taking strategies</li>
                        <li>• General assistance</li>
                        <li>• Context-aware responses</li>
                        <li>• Quick action buttons</li>
                      </ul>
                      
                      <div className="mt-3 p-2 bg-orange-50 dark:bg-orange-950 rounded text-xs text-orange-700 dark:text-orange-300">
                        <strong>Note:</strong> AI chat may be limited by API quotas
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </div>
            </TabsContent>

            {/* Technical Tab */}
            <TabsContent value="technical" className="space-y-4 sm:space-y-6">
              <motion.div variants={fadeInUp}>
                <Card className="card-mobile">
                  <CardHeader>
                    <CardTitle className="heading-mobile-lg flex items-center">
                      <Lock className="w-5 h-5 sm:w-6 sm:h-6 mr-2 text-green-500" />
                      Security & Privacy
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                      <div className="space-y-3">
                        <h4 className="font-semibold text-sm sm:text-base">Authentication:</h4>
                        <ul className="space-y-1 text-xs sm:text-sm text-muted-foreground">
                          <li>• Email/password authentication</li>
                          <li>• Google OAuth integration</li>
                          <li>• Apple OAuth integration</li>
                          <li>• Two-factor authentication (2FA)</li>
                          <li>• Magic link login</li>
                          <li>• Password reset functionality</li>
                          <li>• Remember me option</li>
                        </ul>
                      </div>
                      
                      <div className="space-y-3">
                        <h4 className="font-semibold text-sm sm:text-base">Data Protection:</h4>
                        <ul className="space-y-1 text-xs sm:text-sm text-muted-foreground">
                          <li>• Complete user data isolation</li>
                          <li>• Encrypted data transmission</li>
                          <li>• Secure API endpoints</li>
                          <li>• Role-based access control</li>
                          <li>• Regular security updates</li>
                          <li>• GDPR compliance ready</li>
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div variants={fadeInUp}>
                <Card className="card-mobile">
                  <CardHeader>
                    <CardTitle className="heading-mobile-lg flex items-center">
                      <Smartphone className="w-5 h-5 sm:w-6 sm:h-6 mr-2 text-blue-500" />
                      Responsive Design
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-muted-foreground text-xs sm:text-sm">
                      FlowHub is fully optimized for all device types and screen sizes.
                    </p>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <h4 className="font-semibold text-sm">Mobile (&lt; 640px):</h4>
                        <ul className="space-y-1 text-xs text-muted-foreground">
                          <li>• Touch-optimized interface</li>
                          <li>• Responsive navigation</li>
                          <li>• Optimized form inputs</li>
                          <li>• Swipe gestures support</li>
                        </ul>
                      </div>
                      
                      <div className="space-y-2">
                        <h4 className="font-semibold text-sm">Tablet (641px - 1024px):</h4>
                        <ul className="space-y-1 text-xs text-muted-foreground">
                          <li>• Adaptive grid layouts</li>
                          <li>• Enhanced touch targets</li>
                          <li>• Optimized spacing</li>
                          <li>• Portrait/landscape support</li>
                        </ul>
                      </div>
                      
                      <div className="space-y-2">
                        <h4 className="font-semibold text-sm">Desktop (&gt; 1024px):</h4>
                        <ul className="space-y-1 text-xs text-muted-foreground">
                          <li>• Full feature access</li>
                          <li>• Keyboard shortcuts</li>
                          <li>• Multi-column layouts</li>
                          <li>• Enhanced productivity</li>
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div variants={fadeInUp}>
                <Card className="card-mobile">
                  <CardHeader>
                    <CardTitle className="heading-mobile-lg flex items-center">
                      <Palette className="w-5 h-5 sm:w-6 sm:h-6 mr-2 text-purple-500" />
                      Theming & Accessibility
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                      <div className="space-y-3">
                        <h4 className="font-semibold text-sm sm:text-base">Theme Support:</h4>
                        <ul className="space-y-1 text-xs sm:text-sm text-muted-foreground">
                          <li>• Light and dark modes</li>
                          <li>• System preference detection</li>
                          <li>• Smooth theme transitions</li>
                          <li>• Consistent color schemes</li>
                          <li>• High contrast support</li>
                        </ul>
                      </div>
                      
                      <div className="space-y-3">
                        <h4 className="font-semibold text-sm sm:text-base">Accessibility:</h4>
                        <ul className="space-y-1 text-xs sm:text-sm text-muted-foreground">
                          <li>• WCAG 2.1 compliance</li>
                          <li>• Keyboard navigation</li>
                          <li>• Screen reader support</li>
                          <li>• Focus indicators</li>
                          <li>• Reduced motion support</li>
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </TabsContent>

            {/* Admin Tab */}
            <TabsContent value="admin" className="space-y-4 sm:space-y-6">
              <motion.div variants={fadeInUp}>
                <Card className="card-mobile">
                  <CardHeader>
                    <CardTitle className="heading-mobile-lg flex items-center">
                      <Shield className="w-5 h-5 sm:w-6 sm:h-6 mr-2 text-red-500" />
                      Admin Panel Features
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-muted-foreground text-xs sm:text-sm">
                      Comprehensive administration tools for system management.
                    </p>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                      <div className="space-y-3">
                        <h4 className="font-semibold text-sm sm:text-base">User Management:</h4>
                        <ul className="space-y-1 text-xs sm:text-sm text-muted-foreground">
                          <li>• View all registered users</li>
                          <li>• Promote/demote admin privileges</li>
                          <li>• User activity monitoring</li>
                          <li>• Account status management</li>
                          <li>• User statistics and analytics</li>
                        </ul>
                      </div>
                      
                      <div className="space-y-3">
                        <h4 className="font-semibold text-sm sm:text-base">System Monitoring:</h4>
                        <ul className="space-y-1 text-xs sm:text-sm text-muted-foreground">
                          <li>• System status overview</li>
                          <li>• Feature toggle controls</li>
                          <li>• Performance metrics</li>
                          <li>• Error logging and tracking</li>
                          <li>• API usage statistics</li>
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div variants={fadeInUp}>
                <Card className="card-mobile">
                  <CardHeader>
                    <CardTitle className="heading-mobile-lg flex items-center">
                      <Settings className="w-5 h-5 sm:w-6 sm:h-6 mr-2 text-blue-500" />
                      Admin Setup Guide
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-4">
                      <div className="p-3 sm:p-4 bg-blue-50 dark:bg-blue-950 rounded-lg">
                        <h4 className="font-medium mb-2 text-blue-800 dark:text-blue-200 text-sm sm:text-base">Setting up the first admin user:</h4>
                        <ol className="list-decimal list-inside space-y-2 text-xs sm:text-sm">
                          <li>Ensure the user has signed up and created an account</li>
                          <li>Use the admin setup API endpoint: <code className="bg-background px-2 py-1 rounded text-xs">/api/admin/setup</code></li>
                          <li>Send a POST request with the user's email or username</li>
                          <li>Example payload: <code className="bg-background px-2 py-1 rounded text-xs">{`{ "email": "admin@example.com" }`}</code></li>
                        </ol>
                      </div>
                      
                      <div className="p-3 sm:p-4 bg-green-50 dark:bg-green-950 rounded-lg">
                        <h4 className="font-medium mb-2 text-green-800 dark:text-green-200 text-sm sm:text-base">API Endpoint Details:</h4>
                        <div className="text-xs sm:text-sm space-y-1">
                          <p><strong>URL:</strong> <code className="bg-background px-2 py-1 rounded text-xs">/api/admin/setup</code></p>
                          <p><strong>Method:</strong> POST</p>
                          <p><strong>Content-Type:</strong> application/json</p>
                          <p><strong>Body:</strong> <code className="bg-background px-2 py-1 rounded text-xs">{`{ "email": "user@example.com" }`}</code></p>
                        </div>
                      </div>
                      
                      <div className="p-3 sm:p-4 bg-yellow-50 dark:bg-yellow-950 rounded-lg">
                        <h4 className="font-medium mb-2 text-yellow-800 dark:text-yellow-200 text-sm sm:text-base">Security Notes:</h4>
                        <ul className="text-xs sm:text-sm space-y-1">
                          <li>• Only use this endpoint for initial setup</li>
                          <li>• Subsequent admin promotions should be done through the admin panel</li>
                          <li>• Always verify the user's identity before granting admin access</li>
                          <li>• Consider implementing additional security measures for production</li>
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </TabsContent>

            {/* FAQ Tab */}
            <TabsContent value="faq" className="space-y-4 sm:space-y-6">
              <motion.div variants={fadeInUp}>
                <Card className="card-mobile">
                  <CardHeader>
                    <CardTitle className="heading-mobile-lg">Frequently Asked Questions</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4 sm:space-y-6">
                    <div className="space-y-4">
                      <div className="border-l-4 border-primary pl-4">
                        <h4 className="font-semibold text-sm sm:text-base">How do I get started with FlowHub?</h4>
                        <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                          Simply sign up for an account using your email or social login (Google/Apple). 
                          Once registered, you'll have access to all productivity features immediately.
                        </p>
                      </div>
                      
                      <div className="border-l-4 border-primary pl-4">
                        <h4 className="font-semibold text-sm sm:text-base">Is my data secure and private?</h4>
                        <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                          Yes, FlowHub implements complete user data isolation. Your tasks, notes, and files 
                          are only accessible to you. We use industry-standard encryption and security practices.
                        </p>
                      </div>
                      
                      <div className="border-l-4 border-primary pl-4">
                        <h4 className="font-semibold text-sm sm:text-base">Can I use FlowHub on mobile devices?</h4>
                        <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                          Absolutely! FlowHub is fully responsive and optimized for mobile devices, tablets, 
                          and desktops. You can access all features from any device with a web browser.
                        </p>
                      </div>
                      
                      <div className="border-l-4 border-primary pl-4">
                        <h4 className="font-semibold text-sm sm:text-base">What file formats are supported for conversion?</h4>
                        <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                          FlowHub supports dozens of file formats including documents (PDF, DOCX), images (JPG, PNG), 
                          audio (MP3, WAV), and video (MP4, AVI) files through the CloudConvert API integration.
                        </p>
                      </div>
                      
                      <div className="border-l-4 border-primary pl-4">
                        <h4 className="font-semibold text-sm sm:text-base">How accurate is the translation feature?</h4>
                        <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                          FlowHub uses DeepL API for high-quality translations, which is known for its accuracy. 
                          If DeepL is unavailable, it falls back to LibreTranslate and basic offline translations.
                        </p>
                      </div>
                      
                      <div className="border-l-4 border-primary pl-4">
                        <h4 className="font-semibold text-sm sm:text-base">Can I export my data?</h4>
                        <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                          Currently, you can copy and download individual items. We're working on comprehensive 
                          data export features for future releases.
                        </p>
                      </div>
                      
                      <div className="border-l-4 border-primary pl-4">
                        <h4 className="font-semibold text-sm sm:text-base">Is there a limit to how much I can use FlowHub?</h4>
                        <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                          FlowHub is designed for personal use with reasonable limits. Some features like AI chat 
                          and file conversion may have API-based limitations, but these are generous for typical usage.
                        </p>
                      </div>
                      
                      <div className="border-l-4 border-primary pl-4">
                        <h4 className="font-semibold text-sm sm:text-base">How do I become an admin?</h4>
                        <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                          Admin privileges are granted by existing administrators or through the initial setup API. 
                          Contact your system administrator or refer to the Admin section in this wiki.
                        </p>
                      </div>

                      <div className="border-l-4 border-primary pl-4">
                        <h4 className="font-semibold text-sm sm:text-base">Can I delete my shortened links?</h4>
                        <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                          Yes! You can now delete any of your shortened links from the link shortener tool. 
                          Simply click the delete button next to any link you want to remove.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div variants={fadeInUp}>
                <Card className="card-mobile">
                  <CardHeader>
                    <CardTitle className="heading-mobile-lg flex items-center">
                      <ExternalLink className="w-5 h-5 sm:w-6 sm:h-6 mr-2 text-primary" />
                      Need More Help?
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-muted-foreground text-xs sm:text-sm">
                      If you can't find the answer to your question here, don't hesitate to reach out for support.
                    </p>
                    
                    <div className="flex flex-col sm:flex-row gap-4">
                      <Link href="/contact">
                        <Button className="button-mobile w-full sm:w-auto">
                          <MessageSquare className="w-4 h-4 mr-2" />
                          Contact Support
                        </Button>
                      </Link>
                      
                      <Button variant="outline" className="button-mobile w-full sm:w-auto" asChild>
                        <a href="mailto:flowhub@sarkozilenard.hu">
                          <ExternalLink className="w-4 h-4 mr-2" />
                          Email Us
                        </a>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </TabsContent>
          </Tabs>
        </motion.div>
      </main>
    </div>
  );
}