import React, { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { Mail, MessageSquare, HelpCircle, ArrowLeft, Send } from 'lucide-react';

const ContactPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const { toast } = useToast();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        toast({
          title: "Message sent successfully!",
          description: "We'll get back to you as soon as possible.",
        });
        setFormData({ name: '', email: '', subject: '', message: '' });
      } else {
        throw new Error('Failed to send message');
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Failed to send message",
        description: "Please try again or contact us directly at flowhub@sarkozilenard.hu",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fadeInUp = {
    initial: { opacity: 0, y: 60 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  };

  return (
    <>
      <Head>
        <title>Contact & Help - FlowHub</title>
        <meta name="description" content="Get help and support for FlowHub. Contact us with questions, feedback, or technical issues." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/20">
        {/* Header */}
        <motion.header 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="border-b bg-background/80 backdrop-blur-sm"
        >
          <div className="container-mobile nav-mobile">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <HelpCircle className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="text-xl sm:text-2xl font-bold text-primary">FlowHub</span>
            </Link>
            <Link href="/">
              <Button variant="ghost" size="sm" className="gap-1 sm:gap-2 px-2 sm:px-4">
                <ArrowLeft className="w-4 h-4" />
                <span className="hidden sm:inline">Back to Home</span>
                <span className="sm:hidden">Back</span>
              </Button>
            </Link>
          </div>
        </motion.header>

        {/* Main Content */}
        <div className="container-mobile py-8 sm:py-12">
          <motion.div 
            className="max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            {/* Page Header */}
            <div className="text-center mb-8 sm:mb-12">
              <motion.h1 
                className="heading-mobile-xl mb-4 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                Contact & Help
              </motion.h1>
              <motion.p 
                className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto px-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.4 }}
              >
                Need help or have questions? We're here to assist you with FlowHub.
              </motion.p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
              {/* Contact Information */}
              <motion.div variants={fadeInUp} initial="initial" animate="animate">
                <Card className="card-mobile h-full">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                      <Mail className="w-5 h-5 text-primary" />
                      Get in Touch
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4 sm:space-y-6">
                    <div>
                      <h3 className="font-semibold mb-2 text-sm sm:text-base">Email Support</h3>
                      <p className="text-muted-foreground mb-2 text-sm">
                        For technical support, feature requests, or general inquiries:
                      </p>
                      <a 
                        href="mailto:flowhub@sarkozilenard.hu"
                        className="text-primary hover:text-primary/80 transition-colors font-medium text-sm sm:text-base break-all"
                      >
                        flowhub@sarkozilenard.hu
                      </a>
                    </div>

                    <div>
                      <h3 className="font-semibold mb-2 text-sm sm:text-base">Response Time</h3>
                      <p className="text-muted-foreground text-sm">
                        We typically respond within 24-48 hours during business days.
                      </p>
                    </div>

                    <div>
                      <h3 className="font-semibold mb-2 text-sm sm:text-base">What to Include</h3>
                      <ul className="text-muted-foreground space-y-1 text-xs sm:text-sm">
                        <li>• Detailed description of your issue</li>
                        <li>• Steps to reproduce the problem</li>
                        <li>• Browser and device information</li>
                        <li>• Screenshots if applicable</li>
                      </ul>
                    </div>

                    <div>
                      <h3 className="font-semibold mb-2 text-sm sm:text-base">Quick Help</h3>
                      <p className="text-muted-foreground text-xs sm:text-sm">
                        For immediate assistance, try checking our FAQ section or 
                        browse the help documentation in your dashboard.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Contact Form */}
              <motion.div 
                variants={fadeInUp} 
                initial="initial" 
                animate="animate"
                transition={{ delay: 0.2 }}
              >
                <Card className="card-mobile h-full">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                      <MessageSquare className="w-5 h-5 text-primary" />
                      Send us a Message
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="name" className="text-sm">Name</Label>
                          <Input
                            id="name"
                            name="name"
                            type="text"
                            placeholder="Your name"
                            value={formData.name}
                            onChange={handleInputChange}
                            className="input-mobile"
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="email" className="text-sm">Email</Label>
                          <Input
                            id="email"
                            name="email"
                            type="email"
                            placeholder="your.email@example.com"
                            value={formData.email}
                            onChange={handleInputChange}
                            className="input-mobile"
                            required
                          />
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="subject" className="text-sm">Subject</Label>
                        <Input
                          id="subject"
                          name="subject"
                          type="text"
                          placeholder="What's this about?"
                          value={formData.subject}
                          onChange={handleInputChange}
                          className="input-mobile"
                          required
                        />
                      </div>

                      <div>
                        <Label htmlFor="message" className="text-sm">Message</Label>
                        <Textarea
                          id="message"
                          name="message"
                          placeholder="Tell us more about your question or issue..."
                          rows={5}
                          value={formData.message}
                          onChange={handleInputChange}
                          className="resize-none text-sm sm:text-base"
                          required
                        />
                      </div>

                      <Button 
                        type="submit" 
                        className="button-mobile w-full gap-2" 
                        disabled={isLoading}
                      >
                        {isLoading ? (
                          <>Sending...</>
                        ) : (
                          <>
                            <Send className="w-4 h-4" />
                            Send Message
                          </>
                        )}
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </motion.div>
            </div>

            {/* Additional Help Section */}
            <motion.div 
              className="mt-8 sm:mt-12"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              <Card className="card-mobile">
                <CardHeader>
                  <CardTitle className="text-lg sm:text-xl">Frequently Asked Questions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                    <div>
                      <h4 className="font-semibold mb-2 text-sm sm:text-base">How do I reset my password?</h4>
                      <p className="text-muted-foreground text-xs sm:text-sm mb-4">
                        Use the "Forgot Password" link on the login page to receive a password reset email.
                      </p>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2 text-sm sm:text-base">Is my data secure?</h4>
                      <p className="text-muted-foreground text-xs sm:text-sm mb-4">
                        Yes, all user data is fully isolated and encrypted. We follow industry-standard security practices.
                      </p>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2 text-sm sm:text-base">Can I export my data?</h4>
                      <p className="text-muted-foreground text-xs sm:text-sm mb-4">
                        Data export features are available in your profile settings for most content types.
                      </p>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2 text-sm sm:text-base">How do I delete my account?</h4>
                      <p className="text-muted-foreground text-xs sm:text-sm mb-4">
                        Account deletion can be done from your profile settings. This action is permanent and cannot be undone.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default ContactPage;