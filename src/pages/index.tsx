import React from "react";
import Head from "next/head";
import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { CheckCircle, Calendar, FileText, Link as LinkIcon, Calculator, MessageSquare, Zap, Shield, Users, ArrowRight, FileAudio, FileVideo, FileImage, FileSpreadsheet, Archive, Code } from "lucide-react";
import { LanguageSelector } from "@/components/LanguageSelector";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useLanguage } from "@/contexts/LanguageContext";

const fadeInUp = {
  initial: { opacity: 0, y: 60 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 }
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

const getFeatures = (t: (key: string) => string) => [
  {
    icon: CheckCircle,
    title: t('home.features.todos.title'),
    description: t('home.features.todos.description')
  },
  {
    icon: Calendar,
    title: t('home.features.calendar.title'),
    description: t('home.features.calendar.description')
  },
  {
    icon: FileText,
    title: t('home.features.notes.title'),
    description: t('home.features.notes.description')
  },
  {
    icon: LinkIcon,
    title: t('home.features.links.title'),
    description: t('home.features.links.description')
  },
  {
    icon: Calculator,
    title: t('home.features.converters.title'),
    description: t('home.features.converters.description')
  },
  {
    icon: MessageSquare,
    title: t('home.features.chat.title'),
    description: t('home.features.chat.description')
  }
];

const fileConverters = [
  {
    icon: FileAudio,
    title: "🔊 Audio Conversion",
    formats: [
      "MP4 → MP3 (audio only from video)",
      "WAV ↔ MP3",
      "MP3 ↔ AAC, OGG, FLAC, M4A"
    ]
  },
  {
    icon: FileVideo,
    title: "🎥 Video Conversion",
    formats: [
      "YouTube link → MP4 / MP3 (download + convert)",
      "MP4 ↔ AVI / MOV / MKV / WebM",
      "Video → GIF"
    ]
  },
  {
    icon: FileImage,
    title: "📷 Image Conversion",
    formats: [
      "JPG ↔ PNG / WebP / BMP / TIFF / HEIC",
      "Image to PDF",
      "SVG ↔ PNG / JPG",
      "GIF ↔ MP4"
    ]
  },
  {
    icon: FileSpreadsheet,
    title: "📄 Document Conversion",
    formats: [
      "PDF ↔ Word (DOCX)",
      "PDF ↔ Excel (XLSX)",
      "PDF ↔ JPG / PNG (pages as images)",
      "DOCX ↔ TXT / ODT",
      "PowerPoint ↔ PDF"
    ]
  },
  {
    icon: FileText,
    title: "📚 E-book Formats",
    formats: [
      "EPUB ↔ MOBI / AZW / PDF",
      "DOCX → EPUB",
      "PDF → EPUB"
    ]
  },
  {
    icon: Archive,
    title: "🗜️ Compression / Archive Files",
    formats: [
      "ZIP ↔ RAR / 7Z / TAR",
      "Remove ZIP password (if legal)",
      "ISO ↔ ZIP"
    ]
  },
  {
    icon: Code,
    title: "💻 Advanced Files",
    formats: [
      "JSON ↔ CSV",
      "CSV ↔ Excel",
      "Markdown ↔ HTML / PDF",
      "XML ↔ JSON",
      "Base64 encode/decode"
    ]
  }
];

export default function Home() {
  const { t } = useLanguage();
  const features = getFeatures(t);
  const benefits = [
    {
      icon: Zap,
      title: t('home.benefits.fast.title'),
      description: t('home.benefits.fast.description')
    },
    {
      icon: Shield,
      title: t('home.benefits.secure.title'),
      description: t('home.benefits.secure.description')
    },
    {
      icon: Users,
      title: t('home.benefits.scalable.title'),
      description: t('home.benefits.scalable.description')
    }
  ];

  return (
    <>
      <Head>
        <title>{t('home.title')}</title>
        <meta name="description" content={t('home.description')} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/20">
        {/* Header */}
        <motion.header 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="border-b bg-background/80 backdrop-blur-sm sticky top-0 z-50"
        >
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <Zap className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="text-2xl font-bold text-primary">FlowHub</span>
            </div>
            <div className="flex items-center space-x-4">
              <LanguageSelector />
              <ThemeToggle />
              <Link href="/contact">
                <Button variant="ghost" size="sm">{t('home.help')}</Button>
              </Link>
              <Link href="/login">
                <Button variant="ghost">{t('home.hero.signIn')}</Button>
              </Link>
              <Link href="/signup">
                <Button>{t('home.getStarted')}</Button>
              </Link>
            </div>
          </div>
        </motion.header>

        {/* Hero Section */}
        <section className="container mx-auto px-4 py-20">
          <motion.div 
            className="text-center max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.h1 
              className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              {t('home.hero.title').split('\n').map((line, index) => (
                <span key={index}>
                  {line}
                  {index === 0 && <br />}
                </span>
              ))}
            </motion.h1>
            
            <motion.p 
              className="text-xl md:text-2xl text-muted-foreground mb-8 leading-relaxed"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              {t('home.hero.subtitle')}
            </motion.p>
            
            <motion.div 
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              <Link href="/signup">
                <Button size="lg" className="text-lg px-8 py-6 group">
                  {t('home.hero.startJourney')}
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link href="/login">
                <Button variant="outline" size="lg" className="text-lg px-8 py-6">
                  {t('home.hero.signIn')}
                </Button>
              </Link>
            </motion.div>
          </motion.div>
        </section>

        {/* Hero Image */}
        <motion.section 
          className="container mx-auto px-4 pb-20"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
        >
          <div className="relative max-w-5xl mx-auto">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-accent/20 rounded-2xl blur-3xl"></div>
            <img 
              src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80"
              alt="Modern workspace with productivity tools"
              className="relative rounded-2xl w-full h-[400px] md:h-[500px] object-cover border"
            />
          </div>
        </motion.section>

        {/* Features Section */}
        <section className="container mx-auto px-4 py-20">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              {t('home.features.title')}
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              {t('home.features.subtitle')}
            </p>
          </motion.div>

          <motion.div 
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
            variants={staggerContainer}
            initial="initial"
            animate="animate"
          >
            {features.map((feature, index) => (
              <motion.div key={index} variants={fadeInUp}>
                <Card className="h-full hover:shadow-lg transition-all duration-300 border-2 hover:border-primary/20">
                  <CardHeader>
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                      <feature.icon className="w-6 h-6 text-primary" />
                    </div>
                    <CardTitle className="text-xl">{feature.title}</CardTitle>
                    <CardDescription className="text-base">
                      {feature.description}
                    </CardDescription>
                  </CardHeader>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </section>

        {/* File Converters Section */}
        <section className="container mx-auto px-4 py-20">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              {t('home.converters.title')}
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              {t('home.converters.subtitle')}
            </p>
          </motion.div>

          <motion.div 
            className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            variants={staggerContainer}
            initial="initial"
            animate="animate"
          >
            {fileConverters.map((converter, index) => (
              <motion.div key={index} variants={fadeInUp}>
                <Card className="h-full hover:shadow-lg transition-all duration-300 border-2 hover:border-primary/20">
                  <CardHeader className="pb-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center mb-3">
                      <converter.icon className="w-5 h-5 text-primary" />
                    </div>
                    <CardTitle className="text-lg">{converter.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <ul className="space-y-2">
                      {converter.formats.map((format, formatIndex) => (
                        <li key={formatIndex} className="text-sm text-muted-foreground flex items-start">
                          <span className="w-1.5 h-1.5 bg-primary rounded-full mt-2 mr-2 flex-shrink-0"></span>
                          {format}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </section>

        {/* Benefits Section */}
        <section className="bg-accent/30 py-20">
          <div className="container mx-auto px-4">
            <motion.div 
              className="text-center mb-16"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-4xl md:text-5xl font-bold mb-4">
                {t('home.benefits.title')}
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                {t('home.benefits.subtitle')}
              </p>
            </motion.div>

            <motion.div 
              className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto"
              variants={staggerContainer}
              initial="initial"
              animate="animate"
            >
              {benefits.map((benefit, index) => (
                <motion.div 
                  key={index} 
                  variants={fadeInUp}
                  className="text-center"
                >
                  <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <benefit.icon className="w-8 h-8 text-primary-foreground" />
                  </div>
                  <h3 className="text-2xl font-bold mb-4">{benefit.title}</h3>
                  <p className="text-muted-foreground text-lg">{benefit.description}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="container mx-auto px-4 py-20">
          <motion.div 
            className="text-center max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              {t('home.cta.title')}
            </h2>
            <p className="text-xl text-muted-foreground mb-8">
              {t('home.cta.subtitle')}
            </p>
            <Link href="/signup">
              <Button size="lg" className="text-lg px-12 py-6 group">
                {t('home.cta.getStartedFree')}
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </motion.div>
        </section>

        {/* Footer */}
        <footer className="border-t bg-background/80 backdrop-blur-sm">
          <div className="container mx-auto px-4 py-8">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 bg-primary rounded-md flex items-center justify-center">
                  <Zap className="w-4 h-4 text-primary-foreground" />
                </div>
                <span className="text-lg font-bold text-primary">FlowHub</span>
              </div>
              <div className="flex flex-col sm:flex-row items-center gap-2 text-muted-foreground text-sm">
                <p>© 2025 FlowHub All rights reserved.</p>
                <span className="hidden sm:inline">•</span>
                <p>
                  Powered by{" "}
                  <a 
                    href="https://sarkozilenard.hu" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-primary hover:text-primary/80 transition-colors font-medium"
                  >
                    Lenard Sarkozi
                  </a>
                </p>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}