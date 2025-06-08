import React, { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { ThemeToggle } from "@/components/ThemeToggle";
import { LanguageSelector } from "@/components/LanguageSelector";
import { 
  CheckCircle, 
  Calendar, 
  FileText, 
  Link as LinkIcon, 
  Calculator, 
  MessageSquare, 
  Plus, 
  Edit, 
  Trash2, 
  Zap,
  User,
  Settings,
  LogOut,
  Clock,
  Star,
  Search,
  Filter,
  Copy,
  ExternalLink,
  Upload,
  Download,
  Thermometer,
  Ruler,
  DollarSign,
  Send,
  Shield
} from "lucide-react";
import { format } from 'date-fns';

interface Todo {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  priority: string;
  dueDate?: string;
  createdAt: string;
}

interface Note {
  id: string;
  title: string;
  content: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

interface ShortLink {
  id: string;
  originalUrl: string;
  shortCode: string;
  title?: string;
  clicks: number;
  createdAt: string;
}

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.3 }
};

export default function Dashboard() {
  const { user, userProfile, signOut, updateProfile } = useAuth();
  const { t } = useLanguage();
  const { toast } = useToast();
  
  // State management
  const [todos, setTodos] = useState<Todo[]>([]);
  const [notes, setNotes] = useState<Note[]>([]);
  const [shortLinks, setShortLinks] = useState<ShortLink[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Form states
  const [newTodo, setNewTodo] = useState({ title: '', description: '', priority: 'medium', dueDate: '' });
  const [newNote, setNewNote] = useState({ title: '', content: '', tags: '' });
  const [newLink, setNewLink] = useState({ originalUrl: '', title: '', customCode: '' });
  const [profileForm, setProfileForm] = useState({ name: '', username: '' });
  
  // Dialog states
  const [todoDialogOpen, setTodoDialogOpen] = useState(false);
  const [noteDialogOpen, setNoteDialogOpen] = useState(false);
  const [linkDialogOpen, setLinkDialogOpen] = useState(false);
  const [profileDialogOpen, setProfileDialogOpen] = useState(false);
  
  // Filter states
  const [todoFilter, setTodoFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Converter states
  const [textToConvert, setTextToConvert] = useState('');
  const [convertedText, setConvertedText] = useState('');
  const [conversionType, setConversionType] = useState('uppercase');
  
  // Language and other tool states
  const [unitConverter, setUnitConverter] = useState({
    type: 'temperature',
    fromValue: '',
    fromUnit: 'celsius',
    toUnit: 'fahrenheit',
    result: ''
  });
  const [translator, setTranslator] = useState({
    sourceText: '',
    translatedText: '',
    fromLang: 'en',
    toLang: 'hu'
  });
  const [chatMessages, setChatMessages] = useState<Array<{role: 'user' | 'assistant', content: string}>>([]);
  const [chatInput, setChatInput] = useState('');
  const [chatLoading, setChatLoading] = useState(false);

  // Admin states
  const [allUsers, setAllUsers] = useState<any[]>([]);
  const [adminLoading, setAdminLoading] = useState(false);

  // File converter states
  const [fileConverter, setFileConverter] = useState({
    selectedFile: null as File | null,
    outputFormat: '',
    quality: 'medium',
    converting: false,
    convertedFiles: [] as Array<{
      id: string;
      originalName: string;
      outputFormat: string;
      downloadUrl: string;
      createdAt: string;
    }>
  });

  // QR Code states
  const [qrForm, setQrForm] = useState({
    content: '',
    title: '',
    foregroundColor: '#000000',
    backgroundColor: '#FFFFFF',
    size: '200',
    format: 'PNG'
  });
  const [qrCodes, setQrCodes] = useState<any[]>([]);
  const [qrDialogOpen, setQrDialogOpen] = useState(false);
  const [qrGenerating, setQrGenerating] = useState(false);

  // Email states
  const [emailForm, setEmailForm] = useState({
    email: '',
    provider: 'gmail',
    username: '',
    password: ''
  });
  const [emailAccounts, setEmailAccounts] = useState<any[]>([]);
  const [emailDialogOpen, setEmailDialogOpen] = useState(false);
  const [emailLoading, setEmailLoading] = useState(false);

  // YouTube states
  const [youtubeForm, setYoutubeForm] = useState({
    url: '',
    format: 'mp4',
    quality: 'highest'
  });
  const [youtubeProcessing, setYoutubeProcessing] = useState(false);
  const [youtubeResult, setYoutubeResult] = useState<any>(null);

  useEffect(() => {
    if (user) {
      fetchData();
      fetchQrCodes();
      fetchEmailAccounts();
    }
  }, [user]);

  useEffect(() => {
    if (userProfile) {
      setProfileForm({
        name: userProfile.name || '',
        username: userProfile.username || ''
      });
    }
  }, [userProfile]);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Fetch todos
      const todosResponse = await fetch('/api/todos');
      if (todosResponse.ok) {
        const todosData = await todosResponse.json();
        setTodos(todosData);
      }
      
      // Fetch notes
      const notesResponse = await fetch('/api/notes');
      if (notesResponse.ok) {
        const notesData = await notesResponse.json();
        setNotes(notesData);
      }
      
      // Fetch short links
      const linksResponse = await fetch('/api/shortlinks');
      if (linksResponse.ok) {
        const linksData = await linksResponse.json();
        setShortLinks(linksData);
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: t('message.error'),
        description: "Failed to fetch data",
      });
    } finally {
      setLoading(false);
    }
  };

  // QR Code functions
  const fetchQrCodes = async () => {
    try {
      const response = await fetch('/api/qr');
      if (response.ok) {
        const data = await response.json();
        setQrCodes(data);
      }
    } catch (error) {
      console.error('Failed to fetch QR codes:', error);
    }
  };

  const deleteQrCode = async (id: string) => {
    try {
      const response = await fetch('/api/qr', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
      });

      if (response.ok) {
        setQrCodes(qrCodes.filter(qr => qr.id !== id));
        toast({
          title: t('message.success'),
          description: "QR code deleted successfully",
        });
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete QR code');
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: t('message.error'),
        description: error.message || "Failed to delete QR code",
      });
    }
  };

  const downloadQrCode = (qr: any) => {
    if (!qr.qrCodeData) return;
    
    const link = document.createElement('a');
    link.href = qr.qrCodeData;
    link.download = `${qr.title || 'qr-code'}.${qr.format.toLowerCase()}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const generateQrCode = async () => {
    if (!qrForm.content.trim()) {
      toast({
        variant: "destructive",
        title: t('message.error'),
        description: "Please enter content for the QR code",
      });
      return;
    }

    setQrGenerating(true);
    try {
      const response = await fetch('/api/qr/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: qrForm.content,
          title: qrForm.title,
          foregroundColor: qrForm.foregroundColor,
          backgroundColor: qrForm.backgroundColor,
          size: parseInt(qrForm.size),
          format: qrForm.format
        })
      });

      if (response.ok) {
        const data = await response.json();
        setQrCodes([data, ...qrCodes]);
        setQrForm({
          content: '',
          title: '',
          foregroundColor: '#000000',
          backgroundColor: '#FFFFFF',
          size: '200',
          format: 'PNG'
        });
        setQrDialogOpen(false);
        
        toast({
          title: t('message.success'),
          description: "QR code generated successfully",
        });
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to generate QR code');
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: t('message.error'),
        description: error.message || "Failed to generate QR code",
      });
    } finally {
      setQrGenerating(false);
    }
  };

  // Email functions
  const fetchEmailAccounts = async () => {
    try {
      const response = await fetch('/api/email/accounts');
      if (response.ok) {
        const data = await response.json();
        setEmailAccounts(data);
      }
    } catch (error) {
      console.error('Failed to fetch email accounts:', error);
    }
  };

  const addEmailAccount = async () => {
    if (!emailForm.email.trim()) {
      toast({
        variant: "destructive",
        title: t('message.error'),
        description: "Please enter an email address",
      });
      return;
    }

    setEmailLoading(true);
    try {
      const response = await fetch('/api/email/accounts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(emailForm)
      });

      if (response.ok) {
        const data = await response.json();
        setEmailAccounts([data, ...emailAccounts]);
        setEmailForm({
          email: '',
          provider: 'gmail',
          username: '',
          password: ''
        });
        setEmailDialogOpen(false);
        
        toast({
          title: t('message.success'),
          description: "Email account added successfully",
        });
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to add email account');
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: t('message.error'),
        description: error.message || "Failed to add email account",
      });
    } finally {
      setEmailLoading(false);
    }
  };

  // YouTube functions
  const processYouTubeVideo = async () => {
    if (!youtubeForm.url.trim()) {
      toast({
        variant: "destructive",
        title: t('message.error'),
        description: "Please enter a YouTube URL",
      });
      return;
    }

    setYoutubeProcessing(true);
    try {
      const response = await fetch('/api/youtube/download', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(youtubeForm)
      });

      if (response.ok) {
        const data = await response.json();
        setYoutubeResult(data);
        
        toast({
          title: t('message.success'),
          description: "Video processed successfully",
        });
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to process video');
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: t('message.error'),
        description: error.message || "Failed to process YouTube video",
      });
    } finally {
      setYoutubeProcessing(false);
    }
  };

  // Todo functions
  const addTodo = async () => {
    if (!newTodo.title.trim()) return;
    
    try {
      const response = await fetch('/api/todos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newTodo)
      });
      
      if (response.ok) {
        const data = await response.json();
        setTodos([data, ...todos]);
        setNewTodo({ title: '', description: '', priority: 'medium', dueDate: '' });
        setTodoDialogOpen(false);
        
        toast({
          title: t('message.success'),
          description: "Todo added successfully",
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: t('message.error'),
        description: "Failed to add todo",
      });
    }
  };

  const toggleTodo = async (id: string, completed: boolean) => {
    try {
      const response = await fetch(`/api/todos/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ completed: !completed })
      });
      
      if (response.ok) {
        setTodos(todos.map(todo => 
          todo.id === id ? { ...todo, completed: !completed } : todo
        ));
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: t('message.error'),
        description: "Failed to update todo",
      });
    }
  };

  const deleteTodo = async (id: string) => {
    try {
      const response = await fetch(`/api/todos/${id}`, {
        method: 'DELETE'
      });
      
      if (response.ok) {
        setTodos(todos.filter(todo => todo.id !== id));
        
        toast({
          title: t('message.success'),
          description: "Todo deleted successfully",
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: t('message.error'),
        description: "Failed to delete todo",
      });
    }
  };

  // Note functions
  const addNote = async () => {
    if (!newNote.title.trim() || !newNote.content.trim()) return;
    
    try {
      const response = await fetch('/api/notes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...newNote,
          tags: newNote.tags.split(',').map(tag => tag.trim()).filter(tag => tag)
        })
      });
      
      if (response.ok) {
        const data = await response.json();
        setNotes([data, ...notes]);
        setNewNote({ title: '', content: '', tags: '' });
        setNoteDialogOpen(false);
        
        toast({
          title: t('message.success'),
          description: "Note added successfully",
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: t('message.error'),
        description: "Failed to add note",
      });
    }
  };

  const deleteNote = async (id: string) => {
    try {
      const response = await fetch(`/api/notes/${id}`, {
        method: 'DELETE'
      });
      
      if (response.ok) {
        setNotes(notes.filter(note => note.id !== id));
        
        toast({
          title: t('message.success'),
          description: "Note deleted successfully",
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: t('message.error'),
        description: "Failed to delete note",
      });
    }
  };

  // Short link functions
  const addShortLink = async () => {
    if (!newLink.originalUrl.trim()) return;
    
    try {
      const response = await fetch('/api/shortlinks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newLink)
      });
      
      if (response.ok) {
        const data = await response.json();
        setShortLinks([data, ...shortLinks]);
        setNewLink({ originalUrl: '', title: '', customCode: '' });
        setLinkDialogOpen(false);
        
        toast({
          title: t('message.success'),
          description: "Short link created successfully",
        });
      } else {
        const errorData = await response.json();
        toast({
          variant: "destructive",
          title: t('message.error'),
          description: errorData.error || "Failed to create short link",
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: t('message.error'),
        description: "Failed to create short link",
      });
    }
  };

  const copyShortLink = (shortCode: string) => {
    const shortUrl = `${window.location.origin}/s/${shortCode}`;
    navigator.clipboard.writeText(shortUrl);
    toast({
      title: t('message.copied'),
      description: "Short link copied to clipboard",
    });
  };

  const deleteShortLink = async (id: string) => {
    try {
      const response = await fetch(`/api/shortlinks/${id}`, {
        method: 'DELETE'
      });
      
      if (response.ok) {
        setShortLinks(shortLinks.filter(link => link.id !== id));
        
        toast({
          title: t('message.success'),
          description: "Short link deleted successfully",
        });
      } else {
        throw new Error('Failed to delete link');
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: t('message.error'),
        description: "Failed to delete short link",
      });
    }
  };

  const openOriginalUrl = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  // Profile update function
  const updateUserProfile = async () => {
    try {
      await updateProfile(profileForm);
      setProfileDialogOpen(false);
    } catch (error) {
      // Error handling is done in the updateProfile function
    }
  };

  // Admin functions
  const fetchAllUsers = async () => {
    if (!userProfile?.isAdmin) return;
    
    try {
      setAdminLoading(true);
      const response = await fetch('/api/admin/users');
      if (response.ok) {
        const users = await response.json();
        setAllUsers(users);
      } else {
        throw new Error('Failed to fetch users');
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to fetch users",
      });
    } finally {
      setAdminLoading(false);
    }
  };

  const toggleUserAdmin = async (userId: string, isAdmin: boolean) => {
    try {
      const response = await fetch('/api/admin/promote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, isAdmin: !isAdmin })
      });
      
      if (response.ok) {
        const data = await response.json();
        setAllUsers(allUsers.map(user => 
          user.id === userId ? { ...user, isAdmin: !isAdmin } : user
        ));
        
        toast({
          title: "Success",
          description: data.message,
        });
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error);
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to update user",
      });
    }
  };

  // File converter functions
  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setFileConverter({
        ...fileConverter,
        selectedFile: file
      });
    }
  };

  const convertFile = async () => {
    if (!fileConverter.selectedFile || !fileConverter.outputFormat) {
      toast({
        variant: "destructive",
        title: t('message.error'),
        description: "Please select a file and output format",
      });
      return;
    }

    setFileConverter({...fileConverter, converting: true});

    try {
      // Upload file first
      const formData = new FormData();
      formData.append('file', fileConverter.selectedFile);

      const uploadResponse = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      });

      if (!uploadResponse.ok) {
        throw new Error('Failed to upload file');
      }

      const uploadData = await uploadResponse.json();

      // Start conversion
      const convertResponse = await fetch('/api/convert', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fileData: uploadData.fileData,
          fileName: uploadData.fileName,
          inputFormat: fileConverter.selectedFile.name.split('.').pop()?.toLowerCase(),
          outputFormat: fileConverter.outputFormat,
          options: {
            quality: fileConverter.quality
          }
        })
      });

      if (!convertResponse.ok) {
        throw new Error('Failed to start conversion');
      }

      const convertData = await convertResponse.json();

      // Poll for completion
      const pollForCompletion = async (jobId: string) => {
        const statusResponse = await fetch(`/api/convert/status/${jobId}`);
        const statusData = await statusResponse.json();

        if (statusData.status === 'finished') {
          const newConvertedFile = {
            id: Date.now().toString(),
            originalName: fileConverter.selectedFile!.name,
            outputFormat: fileConverter.outputFormat,
            downloadUrl: statusData.downloadUrl,
            createdAt: new Date().toISOString()
          };

          setFileConverter({
            ...fileConverter,
            converting: false,
            convertedFiles: [newConvertedFile, ...fileConverter.convertedFiles],
            selectedFile: null,
            outputFormat: ''
          });

          toast({
            title: t('message.success'),
            description: "File converted successfully! Double-click to download.",
          });
        } else if (statusData.status === 'error') {
          throw new Error('Conversion failed');
        } else {
          // Still processing, poll again
          setTimeout(() => pollForCompletion(jobId), 2000);
        }
      };

      pollForCompletion(convertData.jobId);

    } catch (error) {
      setFileConverter({...fileConverter, converting: false});
      toast({
        variant: "destructive",
        title: t('message.error'),
        description: "File conversion failed. Please try again.",
      });
    }
  };

  const downloadConvertedFile = (downloadUrl: string, fileName: string) => {
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Text converter function
  const convertText = () => {
    let result = textToConvert;
    
    switch (conversionType) {
      case 'uppercase':
        result = textToConvert.toUpperCase();
        break;
      case 'lowercase':
        result = textToConvert.toLowerCase();
        break;
      case 'title':
        result = textToConvert.replace(/\w\S*/g, (txt) => 
          txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
        );
        break;
      case 'sentence':
        result = textToConvert.charAt(0).toUpperCase() + textToConvert.slice(1).toLowerCase();
        break;
    }
    
    setConvertedText(result);
  };

  // Filter todos
  const filteredTodos = todos.filter(todo => {
    const matchesFilter = todoFilter === 'all' || 
      (todoFilter === 'completed' && todo.completed) ||
      (todoFilter === 'pending' && !todo.completed);
    
    const matchesSearch = todo.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (todo.description && todo.description.toLowerCase().includes(searchTerm.toLowerCase()));
    
    return matchesFilter && matchesSearch;
  });

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center mx-auto mb-4">
            <Zap className="w-5 h-5 text-primary-foreground animate-pulse" />
          </div>
          <p className="text-muted-foreground">{t('common.loading')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <motion.header 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="border-b bg-background/80 backdrop-blur-sm sticky top-0 z-50"
      >
        <div className="container-mobile nav-mobile">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Zap className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-xl sm:text-2xl font-bold text-primary">FlowHub</span>
          </div>
          
          <div className="flex items-center space-x-2 sm:space-x-4">
            <div className="hidden sm:flex items-center space-x-2">
              <LanguageSelector />
              <ThemeToggle />
            </div>
            
            {/* Profile Button */}
            <Dialog open={profileDialogOpen} onOpenChange={setProfileDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="ghost" size="sm" className="flex items-center space-x-1 sm:space-x-2 px-2 sm:px-3">
                  <User className="w-4 h-4" />
                  <span className="hidden md:inline text-sm">
                    {userProfile?.name || userProfile?.username || userProfile?.email}
                  </span>
                </Button>
              </DialogTrigger>
              <DialogContent className="dialog-content-mobile">
                <DialogHeader>
                  <DialogTitle>Profile Settings</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="profileName">Name</Label>
                    <Input
                      id="profileName"
                      className="input-mobile"
                      value={profileForm.name}
                      onChange={(e) => setProfileForm({...profileForm, name: e.target.value})}
                      placeholder="Enter your name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="profileUsername">Username</Label>
                    <Input
                      id="profileUsername"
                      className="input-mobile"
                      value={profileForm.username}
                      onChange={(e) => setProfileForm({...profileForm, username: e.target.value})}
                      placeholder="Enter your username"
                    />
                  </div>
                  <div className="flex items-center space-x-2">
                    <User className="w-4 h-4" />
                    <span className="text-sm text-muted-foreground">{userProfile?.email}</span>
                  </div>
                  {userProfile?.isAdmin && (
                    <div className="flex items-center space-x-2">
                      <Shield className="w-4 h-4 text-primary" />
                      <span className="text-sm text-primary font-medium">Administrator</span>
                    </div>
                  )}
                  <Button onClick={updateUserProfile} className="button-mobile w-full">
                    Update Profile
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
            
            <Button variant="ghost" size="sm" onClick={signOut} className="px-2 sm:px-3">
              <LogOut className="w-4 h-4 sm:mr-2" />
              <span className="hidden sm:inline text-sm">{t('message.signOut')}</span>
            </Button>
          </div>
        </div>
        
        {/* Mobile controls row */}
        <div className="sm:hidden border-t bg-background/90 px-4 py-2 flex items-center justify-center space-x-4">
          <LanguageSelector />
          <ThemeToggle />
        </div>
      </motion.header>

      {/* Main Content */}
      <main className="container-mobile py-6 sm:py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="mb-6 sm:mb-8">
            <h1 className="heading-mobile-lg mb-2">{t('dashboard.title')}</h1>
            <p className="text-muted-foreground text-base sm:text-lg">
              {t('dashboard.subtitle')}
            </p>
          </div>

          <Tabs defaultValue="overview" className="space-y-4 sm:space-y-6">
            {/* Mobile-optimized tabs */}
            <div className="w-full">
              <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 xl:grid-cols-12 gap-1 h-auto p-1">
                <TabsTrigger value="overview" className="text-xs sm:text-sm px-2 py-2 sm:px-3">
                  <span className="hidden sm:inline">{t('nav.overview')}</span>
                  <span className="sm:hidden">Overview</span>
                </TabsTrigger>
                <TabsTrigger value="todos" className="text-xs sm:text-sm px-2 py-2 sm:px-3">
                  <span className="hidden sm:inline">{t('nav.todos')}</span>
                  <span className="sm:hidden">Tasks</span>
                </TabsTrigger>
                <TabsTrigger value="notes" className="text-xs sm:text-sm px-2 py-2 sm:px-3">
                  <span className="hidden sm:inline">{t('nav.notes')}</span>
                  <span className="sm:hidden">Notes</span>
                </TabsTrigger>
                <TabsTrigger value="links" className="text-xs sm:text-sm px-2 py-2 sm:px-3">
                  <span className="hidden sm:inline">{t('nav.links')}</span>
                  <span className="sm:hidden">Links</span>
                </TabsTrigger>
                <TabsTrigger value="email" className="text-xs sm:text-sm px-2 py-2 sm:px-3">
                  <span className="hidden sm:inline">Email</span>
                  <span className="sm:hidden">Mail</span>
                </TabsTrigger>
                <TabsTrigger value="qr" className="text-xs sm:text-sm px-2 py-2 sm:px-3">
                  <span className="hidden sm:inline">QR Codes</span>
                  <span className="sm:hidden">QR</span>
                </TabsTrigger>
                <TabsTrigger value="youtube" className="text-xs sm:text-sm px-2 py-2 sm:px-3">
                  <span className="hidden sm:inline">YouTube</span>
                  <span className="sm:hidden">YT</span>
                </TabsTrigger>
                <TabsTrigger value="tools" className="text-xs sm:text-sm px-2 py-2 sm:px-3">
                  <span className="hidden sm:inline">{t('nav.tools')}</span>
                  <span className="sm:hidden">Tools</span>
                </TabsTrigger>
                <TabsTrigger value="timetables" className="text-xs sm:text-sm px-2 py-2 sm:px-3">
                  <span className="hidden sm:inline">Timetables</span>
                  <span className="sm:hidden">Schedule</span>
                </TabsTrigger>
                <TabsTrigger value="chat" className="text-xs sm:text-sm px-2 py-2 sm:px-3">
                  <span className="hidden sm:inline">{t('nav.chat')}</span>
                  <span className="sm:hidden">Chat</span>
                </TabsTrigger>
                <TabsTrigger value="help" className="text-xs sm:text-sm px-2 py-2 sm:px-3">
                  <span className="hidden sm:inline">Help</span>
                  <span className="sm:hidden">Help</span>
                </TabsTrigger>
                {userProfile?.isAdmin && (
                  <TabsTrigger value="admin" className="text-xs sm:text-sm px-2 py-2 sm:px-3">
                    <Shield className="w-3 h-3 sm:w-4 sm:h-4 sm:mr-1" />
                    <span className="hidden sm:inline">Admin</span>
                  </TabsTrigger>
                )}
              </TabsList>
            </div>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-4 sm:space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                <motion.div variants={fadeInUp}>
                  <Card className="card-mobile">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Total Tasks</CardTitle>
                      <CheckCircle className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-xl sm:text-2xl font-bold">{todos.length}</div>
                      <p className="text-xs text-muted-foreground">
                        {todos.filter(t => t.completed).length} completed
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>

                <motion.div variants={fadeInUp}>
                  <Card className="card-mobile">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">{t('nav.notes')}</CardTitle>
                      <FileText className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-xl sm:text-2xl font-bold">{notes.length}</div>
                      <p className="text-xs text-muted-foreground">
                        Total notes created
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>

                <motion.div variants={fadeInUp}>
                  <Card className="card-mobile">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Short Links</CardTitle>
                      <LinkIcon className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-xl sm:text-2xl font-bold">{shortLinks.length}</div>
                      <p className="text-xs text-muted-foreground">
                        {shortLinks.reduce((sum, link) => sum + link.clicks, 0)} total clicks
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>

                <motion.div variants={fadeInUp}>
                  <Card className="card-mobile">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Productivity</CardTitle>
                      <Star className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-xl sm:text-2xl font-bold">
                        {todos.length > 0 ? Math.round((todos.filter(t => t.completed).length / todos.length) * 100) : 0}%
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Completion rate
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              </div>

              {/* Recent Activity */}
              <Card className="card-mobile">
                <CardHeader>
                  <CardTitle className="text-lg sm:text-xl">Recent Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 sm:space-y-4">
                    {todos.slice(0, 3).map((todo) => (
                      <div key={todo.id} className="flex items-center space-x-3">
                        <CheckCircle className={`w-4 h-4 flex-shrink-0 ${todo.completed ? 'text-green-500' : 'text-gray-400'}`} />
                        <span className={`flex-1 text-sm sm:text-base ${todo.completed ? 'line-through text-muted-foreground' : ''}`}>
                          {todo.title}
                        </span>
                        <Badge variant="outline" className={`${getPriorityColor(todo.priority)} text-xs`}>
                          {t(`todos.priority.${todo.priority}`)}
                        </Badge>
                      </div>
                    ))}
                    {todos.length === 0 && (
                      <p className="text-muted-foreground text-center py-6 text-sm sm:text-base">
                        No tasks yet. Create your first task to get started!
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Todos Tab */}
            <TabsContent value="todos" className="space-y-6">
              <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                <div className="flex flex-col sm:flex-row gap-4 flex-1">
                  <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                    <Input
                      placeholder={t('todos.searchPlaceholder')}
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <Select value={todoFilter} onValueChange={setTodoFilter}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Filter tasks" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">{t('todos.all')}</SelectItem>
                      <SelectItem value="pending">{t('todos.pending')}</SelectItem>
                      <SelectItem value="completed">{t('todos.completed')}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <Dialog open={todoDialogOpen} onOpenChange={setTodoDialogOpen}>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="w-4 h-4 mr-2" />
                      {t('todos.add')}
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Add New Task</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="title">{t('form.title')}</Label>
                        <Input
                          id="title"
                          value={newTodo.title}
                          onChange={(e) => setNewTodo({...newTodo, title: e.target.value})}
                          placeholder="Enter task title"
                        />
                      </div>
                      <div>
                        <Label htmlFor="description">{t('form.description')}</Label>
                        <Textarea
                          id="description"
                          value={newTodo.description}
                          onChange={(e) => setNewTodo({...newTodo, description: e.target.value})}
                          placeholder="Enter task description"
                        />
                      </div>
                      <div>
                        <Label htmlFor="priority">{t('form.priority')}</Label>
                        <Select value={newTodo.priority} onValueChange={(value) => setNewTodo({...newTodo, priority: value})}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="low">{t('todos.priority.low')}</SelectItem>
                            <SelectItem value="medium">{t('todos.priority.medium')}</SelectItem>
                            <SelectItem value="high">{t('todos.priority.high')}</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="dueDate">{t('form.dueDate')}</Label>
                        <Input
                          id="dueDate"
                          type="date"
                          value={newTodo.dueDate}
                          onChange={(e) => setNewTodo({...newTodo, dueDate: e.target.value})}
                        />
                      </div>
                      <Button onClick={addTodo} className="w-full">
                        Add Task
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>

              <div className="space-y-4">
                {filteredTodos.map((todo) => (
                  <motion.div key={todo.id} variants={fadeInUp}>
                    <Card>
                      <CardContent className="p-4">
                        <div className="flex items-start space-x-3">
                          <Checkbox
                            checked={todo.completed}
                            onCheckedChange={() => toggleTodo(todo.id, todo.completed)}
                            className="mt-1"
                          />
                          <div className="flex-1 space-y-2">
                            <div className="flex items-center justify-between">
                              <h3 className={`font-medium ${todo.completed ? 'line-through text-muted-foreground' : ''}`}>
                                {todo.title}
                              </h3>
                              <div className="flex items-center space-x-2">
                                <Badge variant="outline" className={getPriorityColor(todo.priority)}>
                                  {t(`todos.priority.${todo.priority}`)}
                                </Badge>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => deleteTodo(todo.id)}
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>
                            </div>
                            {todo.description && (
                              <p className={`text-sm ${todo.completed ? 'line-through text-muted-foreground' : 'text-muted-foreground'}`}>
                                {todo.description}
                              </p>
                            )}
                            <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                              <span>Created {format(new Date(todo.createdAt), 'MMM d, yyyy')}</span>
                              {todo.dueDate && (
                                <span className="flex items-center">
                                  <Clock className="w-3 h-3 mr-1" />
                                  Due {format(new Date(todo.dueDate), 'MMM d, yyyy')}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
                
                {filteredTodos.length === 0 && (
                  <Card>
                    <CardContent className="p-8 text-center">
                      <CheckCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-medium mb-2">{t('todos.noTasks')}</h3>
                      <p className="text-muted-foreground mb-4">
                        {searchTerm ? 'Try adjusting your search or filter.' : 'Create your first task to get started!'}
                      </p>
                      {!searchTerm && (
                        <Button onClick={() => setTodoDialogOpen(true)}>
                          <Plus className="w-4 h-4 mr-2" />
                          {t('todos.addFirst')}
                        </Button>
                      )}
                    </CardContent>
                  </Card>
                )}
              </div>
            </TabsContent>

            {/* Notes Tab */}
            <TabsContent value="notes" className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">{t('notes.title')}</h2>
                <Dialog open={noteDialogOpen} onOpenChange={setNoteDialogOpen}>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="w-4 h-4 mr-2" />
                      {t('notes.add')}
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>Add New Note</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="noteTitle">{t('form.title')}</Label>
                        <Input
                          id="noteTitle"
                          value={newNote.title}
                          onChange={(e) => setNewNote({...newNote, title: e.target.value})}
                          placeholder="Enter note title"
                        />
                      </div>
                      <div>
                        <Label htmlFor="noteContent">{t('form.content')}</Label>
                        <Textarea
                          id="noteContent"
                          value={newNote.content}
                          onChange={(e) => setNewNote({...newNote, content: e.target.value})}
                          placeholder="Write your note here..."
                          rows={8}
                        />
                      </div>
                      <div>
                        <Label htmlFor="noteTags">{t('form.tags')} (comma separated)</Label>
                        <Input
                          id="noteTags"
                          value={newNote.tags}
                          onChange={(e) => setNewNote({...newNote, tags: e.target.value})}
                          placeholder="work, personal, ideas"
                        />
                      </div>
                      <Button onClick={addNote} className="w-full">
                        Add Note
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {notes.map((note) => (
                  <motion.div key={note.id} variants={fadeInUp}>
                    <Card className="h-full">
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <CardTitle className="text-lg">{note.title}</CardTitle>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => deleteNote(note.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
                          {note.content}
                        </p>
                        <div className="space-y-2">
                          {note.tags.length > 0 && (
                            <div className="flex flex-wrap gap-1">
                              {note.tags.map((tag, index) => (
                                <Badge key={index} variant="secondary" className="text-xs">
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                          )}
                          <p className="text-xs text-muted-foreground">
                            Updated {format(new Date(note.updatedAt), 'MMM d, yyyy')}
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
                
                {notes.length === 0 && (
                  <div className="col-span-full">
                    <Card>
                      <CardContent className="p-8 text-center">
                        <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                        <h3 className="text-lg font-medium mb-2">{t('notes.noNotes')}</h3>
                        <p className="text-muted-foreground mb-4">
                          Create your first note to start organizing your thoughts!
                        </p>
                        <Button onClick={() => setNoteDialogOpen(true)}>
                          <Plus className="w-4 h-4 mr-2" />
                          {t('notes.addFirst')}
                        </Button>
                      </CardContent>
                    </Card>
                  </div>
                )}
              </div>
            </TabsContent>

            {/* Links Tab */}
            <TabsContent value="links" className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">{t('links.title')}</h2>
                <Dialog open={linkDialogOpen} onOpenChange={setLinkDialogOpen}>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="w-4 h-4 mr-2" />
                      {t('links.create')}
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Create Short Link</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="originalUrl">{t('form.originalUrl')}</Label>
                        <Input
                          id="originalUrl"
                          value={newLink.originalUrl}
                          onChange={(e) => setNewLink({...newLink, originalUrl: e.target.value})}
                          placeholder="https://example.com/very-long-url"
                        />
                      </div>
                      <div>
                        <Label htmlFor="linkTitle">{t('form.title')} (optional)</Label>
                        <Input
                          id="linkTitle"
                          value={newLink.title}
                          onChange={(e) => setNewLink({...newLink, title: e.target.value})}
                          placeholder="My awesome link"
                        />
                      </div>
                      <div>
                        <Label htmlFor="customCode">{t('form.customCode')} (optional)</Label>
                        <Input
                          id="customCode"
                          value={newLink.customCode}
                          onChange={(e) => setNewLink({...newLink, customCode: e.target.value})}
                          placeholder="my-custom-link"
                        />
                        <p className="text-xs text-muted-foreground mt-1">
                          Leave empty for random code. Only letters, numbers, and hyphens allowed.
                        </p>
                      </div>
                      <Button onClick={addShortLink} className="w-full">
                        Create Short Link
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>

              <div className="space-y-4">
                {shortLinks.map((link) => (
                  <motion.div key={link.id} variants={fadeInUp}>
                    <Card>
                      <CardContent className="p-4">
                        <div className="space-y-3">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <h3 className="font-medium">
                                {link.title || 'Untitled Link'}
                              </h3>
                              <p className="text-sm text-muted-foreground truncate">
                                {link.originalUrl}
                              </p>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Badge variant="outline">
                                {link.clicks} clicks
                              </Badge>
                            </div>
                          </div>
                          
                          <div className="flex items-center justify-between bg-muted p-2 rounded">
                            <code className="text-sm flex-1 mr-2 truncate">
                              {window.location.origin}/s/{link.shortCode}
                            </code>
                            <div className="flex items-center space-x-1">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => copyShortLink(link.shortCode)}
                                title="Copy link"
                              >
                                <Copy className="w-4 h-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => openOriginalUrl(link.originalUrl)}
                                title="Open original URL"
                              >
                                <ExternalLink className="w-4 h-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => deleteShortLink(link.id)}
                                title="Delete link"
                                className="text-destructive hover:text-destructive"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                          
                          <p className="text-xs text-muted-foreground">
                            Created {format(new Date(link.createdAt), 'MMM d, yyyy')}
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
                
                {shortLinks.length === 0 && (
                  <Card>
                    <CardContent className="p-8 text-center">
                      <LinkIcon className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-medium mb-2">{t('links.noLinks')}</h3>
                      <p className="text-muted-foreground mb-4">
                        Create your first short link to start tracking clicks!
                      </p>
                      <Button onClick={() => setLinkDialogOpen(true)}>
                        <Plus className="w-4 h-4 mr-2" />
                        {t('links.createFirst')}
                      </Button>
                    </CardContent>
                  </Card>
                )}
              </div>
            </TabsContent>

            {/* Email Tab */}
            <TabsContent value="email" className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">Email Client</h2>
                <Dialog open={emailDialogOpen} onOpenChange={setEmailDialogOpen}>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="w-4 h-4 mr-2" />
                      Add Email Account
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Add Email Account</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="emailAddress">Email Address</Label>
                        <Input
                          id="emailAddress"
                          type="email"
                          value={emailForm.email}
                          onChange={(e) => setEmailForm({...emailForm, email: e.target.value})}
                          placeholder="your.email@example.com"
                        />
                      </div>
                      <div>
                        <Label htmlFor="emailProvider">Provider</Label>
                        <Select value={emailForm.provider} onValueChange={(value) => setEmailForm({...emailForm, provider: value})}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select email provider" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="gmail">Gmail</SelectItem>
                            <SelectItem value="outlook">Outlook</SelectItem>
                            <SelectItem value="imap">IMAP/SMTP</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="p-4 bg-blue-50 dark:bg-blue-950 rounded-lg">
                        <h4 className="font-medium mb-2">Setup Instructions:</h4>
                        <ul className="text-sm space-y-1">
                          <li>• <strong>Gmail:</strong> Enable 2FA and create an App Password</li>
                          <li>• <strong>Outlook:</strong> Use OAuth authentication</li>
                          <li>• <strong>IMAP:</strong> Enter server settings manually</li>
                        </ul>
                      </div>
                      <Button 
                        onClick={addEmailAccount} 
                        className="w-full"
                        disabled={emailLoading}
                      >
                        {emailLoading ? 'Adding...' : 'Add Account'}
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>

              {emailAccounts.length > 0 ? (
                <div className="space-y-4">
                  {emailAccounts.map((account) => (
                    <Card key={account.id}>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="font-medium">{account.email}</h3>
                            <p className="text-sm text-muted-foreground">
                              {account.provider} • {account._count?.emails || 0} emails
                            </p>
                          </div>
                          <Badge variant={account.isActive ? "default" : "secondary"}>
                            {account.isActive ? "Active" : "Inactive"}
                          </Badge>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <Card>
                  <CardContent className="p-8 text-center">
                    <MessageSquare className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-medium mb-2">No email accounts configured</h3>
                    <p className="text-muted-foreground mb-4">
                      Add your first email account to start managing emails directly from FlowHub!
                    </p>
                    <Button onClick={() => setEmailDialogOpen(true)}>
                      <Plus className="w-4 h-4 mr-2" />
                      Add First Email Account
                    </Button>
                  </CardContent>
                </Card>
              )}

              {/* Email Setup Guide */}
              <Card>
                <CardHeader>
                  <CardTitle>Email Setup & Usage Guide</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="p-4 bg-yellow-50 dark:bg-yellow-950 rounded-lg">
                      <h4 className="font-medium mb-2 text-yellow-800 dark:text-yellow-200">⚠️ Current Status</h4>
                      <p className="text-sm text-yellow-700 dark:text-yellow-300">
                        The email client is currently in development. Basic account management is available, but full email reading/sending functionality requires additional setup and configuration.
                      </p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <h4 className="font-semibold">How to Read Emails</h4>
                        <div className="space-y-3 text-sm">
                          <div className="border-l-4 border-blue-500 pl-4">
                            <h5 className="font-medium">1. Add Email Account</h5>
                            <p className="text-muted-foreground">
                              Click "Add Email Account" and configure your email provider settings.
                            </p>
                          </div>
                          <div className="border-l-4 border-green-500 pl-4">
                            <h5 className="font-medium">2. Configure IMAP/OAuth</h5>
                            <p className="text-muted-foreground">
                              For Gmail: Enable 2FA and create an App Password. For others: Use IMAP settings.
                            </p>
                          </div>
                          <div className="border-l-4 border-purple-500 pl-4">
                            <h5 className="font-medium">3. Sync Emails</h5>
                            <p className="text-muted-foreground">
                              Once configured, emails will be synced and displayed in your inbox.
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <h4 className="font-semibold">How to Send Emails</h4>
                        <div className="space-y-3 text-sm">
                          <div className="border-l-4 border-orange-500 pl-4">
                            <h5 className="font-medium">1. Configure SMTP</h5>
                            <p className="text-muted-foreground">
                              SMTP settings are required for sending emails through FlowHub.
                            </p>
                          </div>
                          <div className="border-l-4 border-red-500 pl-4">
                            <h5 className="font-medium">2. Compose Interface</h5>
                            <p className="text-muted-foreground">
                              Use the built-in compose interface to write and send emails.
                            </p>
                          </div>
                          <div className="border-l-4 border-teal-500 pl-4">
                            <h5 className="font-medium">3. Email Management</h5>
                            <p className="text-muted-foreground">
                              Organize emails with folders, labels, and search functionality.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h4 className="font-semibold">Provider-Specific Setup</h4>
                      <div className="grid md:grid-cols-3 gap-4">
                        <div className="p-4 border rounded-lg">
                          <h5 className="font-medium mb-2">Gmail Setup</h5>
                          <ul className="text-sm space-y-1 text-muted-foreground">
                            <li>• Enable 2-Factor Authentication</li>
                            <li>• Generate App Password</li>
                            <li>• Use IMAP: imap.gmail.com:993</li>
                            <li>• Use SMTP: smtp.gmail.com:587</li>
                          </ul>
                        </div>
                        <div className="p-4 border rounded-lg">
                          <h5 className="font-medium mb-2">Outlook Setup</h5>
                          <ul className="text-sm space-y-1 text-muted-foreground">
                            <li>• Use OAuth2 authentication</li>
                            <li>• IMAP: outlook.office365.com:993</li>
                            <li>• SMTP: smtp-mail.outlook.com:587</li>
                            <li>• Enable modern authentication</li>
                          </ul>
                        </div>
                        <div className="p-4 border rounded-lg">
                          <h5 className="font-medium mb-2">Custom IMAP</h5>
                          <ul className="text-sm space-y-1 text-muted-foreground">
                            <li>• Get IMAP/SMTP settings from provider</li>
                            <li>• Configure ports and security</li>
                            <li>• Test connection settings</li>
                            <li>• Enable less secure apps if needed</li>
                          </ul>
                        </div>
                      </div>
                    </div>

                    <div className="p-4 bg-blue-50 dark:bg-blue-950 rounded-lg">
                      <h4 className="font-medium mb-2 text-blue-800 dark:text-blue-200">💡 Development Note</h4>
                      <p className="text-sm text-blue-700 dark:text-blue-300">
                        Full email functionality requires implementing IMAP/SMTP clients, OAuth flows, and email parsing. 
                        The current implementation provides the database structure and basic account management. 
                        For immediate email needs, consider using your regular email client alongside FlowHub.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* QR Codes Tab */}
            <TabsContent value="qr" className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">QR Code Generator</h2>
                <Dialog open={qrDialogOpen} onOpenChange={setQrDialogOpen}>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="w-4 h-4 mr-2" />
                      Generate QR Code
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Generate QR Code</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="qrContent">Content</Label>
                        <Textarea
                          id="qrContent"
                          value={qrForm.content}
                          onChange={(e) => setQrForm({...qrForm, content: e.target.value})}
                          placeholder="Enter URL, text, or any content..."
                          rows={3}
                        />
                      </div>
                      <div>
                        <Label htmlFor="qrTitle">Title (optional)</Label>
                        <Input
                          id="qrTitle"
                          value={qrForm.title}
                          onChange={(e) => setQrForm({...qrForm, title: e.target.value})}
                          placeholder="QR Code title"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="qrForeground">Foreground Color</Label>
                          <Input
                            id="qrForeground"
                            type="color"
                            value={qrForm.foregroundColor}
                            onChange={(e) => setQrForm({...qrForm, foregroundColor: e.target.value})}
                          />
                        </div>
                        <div>
                          <Label htmlFor="qrBackground">Background Color</Label>
                          <Input
                            id="qrBackground"
                            type="color"
                            value={qrForm.backgroundColor}
                            onChange={(e) => setQrForm({...qrForm, backgroundColor: e.target.value})}
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="qrSize">Size</Label>
                          <Select value={qrForm.size} onValueChange={(value) => setQrForm({...qrForm, size: value})}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="100">100x100</SelectItem>
                              <SelectItem value="200">200x200</SelectItem>
                              <SelectItem value="300">300x300</SelectItem>
                              <SelectItem value="500">500x500</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label htmlFor="qrFormat">Format</Label>
                          <Select value={qrForm.format} onValueChange={(value) => setQrForm({...qrForm, format: value})}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="PNG">PNG</SelectItem>
                              <SelectItem value="SVG">SVG</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <Button 
                        onClick={generateQrCode} 
                        className="w-full"
                        disabled={qrGenerating}
                      >
                        {qrGenerating ? 'Generating...' : 'Generate QR Code'}
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>

              {qrCodes.length > 0 ? (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {qrCodes.map((qr) => (
                    <Card key={qr.id}>
                      <CardContent className="p-4">
                        <div className="space-y-3">
                          <div className="flex items-center justify-center bg-muted p-4 rounded">
                            {qr.qrCodeData && (
                              qr.format.toLowerCase() === 'svg' ? (
                                <div dangerouslySetInnerHTML={{ __html: qr.qrCodeData }} />
                              ) : (
                                <img src={qr.qrCodeData} alt="QR Code" className="max-w-full h-auto" />
                              )
                            )}
                          </div>
                          <div className="space-y-2">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <h3 className="font-medium">{qr.title || 'QR Code'}</h3>
                                <p className="text-sm text-muted-foreground truncate">{qr.content}</p>
                                <p className="text-xs text-muted-foreground">
                                  {qr.size}x{qr.size} • {qr.format}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => downloadQrCode(qr)}
                                className="flex-1"
                              >
                                <Download className="w-4 h-4 mr-2" />
                                Download
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => deleteQrCode(qr.id)}
                                className="text-destructive hover:text-destructive"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <Card>
                    <CardContent className="p-8 text-center">
                      <div className="w-16 h-16 bg-muted rounded-lg flex items-center justify-center mx-auto mb-4">
                        <div className="w-8 h-8 bg-foreground rounded-sm"></div>
                      </div>
                      <h3 className="text-lg font-medium mb-2">No QR codes yet</h3>
                      <p className="text-muted-foreground mb-4">
                        Generate your first QR code for links, text, or any content!
                      </p>
                      <Button onClick={() => setQrDialogOpen(true)}>
                        <Plus className="w-4 h-4 mr-2" />
                        Generate First QR Code
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              )}

              <Card>
                <CardHeader>
                  <CardTitle>QR Code Features</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <h4 className="font-semibold">Automatic Generation</h4>
                      <p className="text-sm text-muted-foreground">
                        QR codes are automatically generated for all your short links
                      </p>
                    </div>
                    <div className="space-y-3">
                      <h4 className="font-semibold">Custom QR Codes</h4>
                      <p className="text-sm text-muted-foreground">
                        Create QR codes for any content with custom colors and sizes
                      </p>
                    </div>
                    <div className="space-y-3">
                      <h4 className="font-semibold">Multiple Formats</h4>
                      <p className="text-sm text-muted-foreground">
                        Download as PNG for images or SVG for scalable graphics
                      </p>
                    </div>
                    <div className="space-y-3">
                      <h4 className="font-semibold">Easy Sharing</h4>
                      <p className="text-sm text-muted-foreground">
                        Perfect for business cards, posters, or digital sharing
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* YouTube Downloader Tab */}
            <TabsContent value="youtube" className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">YouTube Downloader</h2>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Download className="w-5 h-5 mr-2" />
                    Download YouTube Videos & Playlists
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="youtubeUrl">YouTube URL</Label>
                    <Input
                      id="youtubeUrl"
                      value={youtubeForm.url}
                      onChange={(e) => setYoutubeForm({...youtubeForm, url: e.target.value})}
                      placeholder="https://www.youtube.com/watch?v=..."
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Supports individual videos and playlists
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="downloadFormat">Format</Label>
                      <Select value={youtubeForm.format} onValueChange={(value) => setYoutubeForm({...youtubeForm, format: value})}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="mp4">MP4 (Video)</SelectItem>
                          <SelectItem value="mp3">MP3 (Audio)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="downloadQuality">Quality</Label>
                      <Select value={youtubeForm.quality} onValueChange={(value) => setYoutubeForm({...youtubeForm, quality: value})}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="highest">Highest</SelectItem>
                          <SelectItem value="720p">720p</SelectItem>
                          <SelectItem value="480p">480p</SelectItem>
                          <SelectItem value="360p">360p</SelectItem>
                          <SelectItem value="lowest">Lowest</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <Button 
                    onClick={processYouTubeVideo} 
                    className="w-full"
                    disabled={youtubeProcessing}
                  >
                    {youtubeProcessing ? (
                      <>
                        <div className="w-4 h-4 mr-2 animate-spin rounded-full border-2 border-background border-t-transparent" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <Download className="w-4 h-4 mr-2" />
                        Process Video
                      </>
                    )}
                  </Button>
                  
                  <div className="p-4 bg-yellow-50 dark:bg-yellow-950 rounded-lg">
                    <h4 className="font-medium mb-2 text-yellow-800 dark:text-yellow-200">Important Notice:</h4>
                    <ul className="text-sm space-y-1 text-yellow-700 dark:text-yellow-300">
                      <li>• Only download content you have permission to use</li>
                      <li>• Respect copyright laws and YouTube's Terms of Service</li>
                      <li>• Large files may take time to process</li>
                      <li>• This tool is for personal use and educational purposes</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>

              {youtubeResult && (
                <Card>
                  <CardHeader>
                    <CardTitle>Processing Result</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div>
                        <h3 className="font-medium">{youtubeResult.title}</h3>
                        <p className="text-sm text-muted-foreground">
                          Duration: {youtubeResult.duration} • Format: {youtubeResult.format}
                        </p>
                      </div>
                      {youtubeResult.downloadUrl && (
                        <Button asChild className="w-full">
                          <a href={youtubeResult.downloadUrl} download>
                            <Download className="w-4 h-4 mr-2" />
                            Download {youtubeResult.format.toUpperCase()}
                          </a>
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}

              <Card>
                <CardHeader>
                  <CardTitle>Download History</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8">
                    <Download className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-medium mb-2">No downloads yet</h3>
                    <p className="text-muted-foreground">
                      Your download history will appear here once you start downloading videos.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Tools Tab */}
            <TabsContent value="tools" className="space-y-6">
              <h2 className="text-2xl font-bold">{t('tools.title')}</h2>
              
              <div className="grid md:grid-cols-2 gap-6">
                {/* Text Case Converter */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Calculator className="w-5 h-5 mr-2" />
                      {t('tools.textConverter')}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Textarea
                      placeholder="Enter text to convert..."
                      value={textToConvert}
                      onChange={(e) => setTextToConvert(e.target.value)}
                      rows={4}
                    />
                    
                    <Select value={conversionType} onValueChange={setConversionType}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="uppercase">UPPERCASE</SelectItem>
                        <SelectItem value="lowercase">lowercase</SelectItem>
                        <SelectItem value="title">Title Case</SelectItem>
                        <SelectItem value="sentence">Sentence case</SelectItem>
                      </SelectContent>
                    </Select>
                    
                    <Button onClick={convertText} className="w-full">
                      Convert Text
                    </Button>
                    
                    {convertedText && (
                      <div className="space-y-2">
                        <Label>Converted Text:</Label>
                        <Textarea
                          value={convertedText}
                          readOnly
                          rows={4}
                          className="bg-muted"
                        />
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => navigator.clipboard.writeText(convertedText)}
                        >
                          <Copy className="w-4 h-4 mr-2" />
                          {t('common.copy')} Result
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Unit Converter */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Thermometer className="w-5 h-5 mr-2" />
                      {t('tools.unitConverter')}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Select value={unitConverter.type} onValueChange={(value) => setUnitConverter({...unitConverter, type: value, result: ''})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="temperature">Temperature</SelectItem>
                        <SelectItem value="length">Length</SelectItem>
                        <SelectItem value="weight">Weight</SelectItem>
                      </SelectContent>
                    </Select>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>From</Label>
                        <Input
                          type="number"
                          placeholder="Enter value"
                          value={unitConverter.fromValue}
                          onChange={(e) => setUnitConverter({...unitConverter, fromValue: e.target.value, result: ''})}
                        />
                        <Select value={unitConverter.fromUnit} onValueChange={(value) => setUnitConverter({...unitConverter, fromUnit: value, result: ''})}>
                          <SelectTrigger className="mt-2">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {unitConverter.type === 'temperature' && (
                              <>
                                <SelectItem value="celsius">Celsius</SelectItem>
                                <SelectItem value="fahrenheit">Fahrenheit</SelectItem>
                                <SelectItem value="kelvin">Kelvin</SelectItem>
                              </>
                            )}
                            {unitConverter.type === 'length' && (
                              <>
                                <SelectItem value="meters">Meters</SelectItem>
                                <SelectItem value="feet">Feet</SelectItem>
                                <SelectItem value="inches">Inches</SelectItem>
                                <SelectItem value="kilometers">Kilometers</SelectItem>
                                <SelectItem value="miles">Miles</SelectItem>
                              </>
                            )}
                            {unitConverter.type === 'weight' && (
                              <>
                                <SelectItem value="kilograms">Kilograms</SelectItem>
                                <SelectItem value="pounds">Pounds</SelectItem>
                                <SelectItem value="grams">Grams</SelectItem>
                                <SelectItem value="ounces">Ounces</SelectItem>
                              </>
                            )}
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div>
                        <Label>To</Label>
                        <Input
                          value={unitConverter.result}
                          readOnly
                          placeholder="Result"
                          className="bg-muted"
                        />
                        <Select value={unitConverter.toUnit} onValueChange={(value) => setUnitConverter({...unitConverter, toUnit: value, result: ''})}>
                          <SelectTrigger className="mt-2">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {unitConverter.type === 'temperature' && (
                              <>
                                <SelectItem value="celsius">Celsius</SelectItem>
                                <SelectItem value="fahrenheit">Fahrenheit</SelectItem>
                                <SelectItem value="kelvin">Kelvin</SelectItem>
                              </>
                            )}
                            {unitConverter.type === 'length' && (
                              <>
                                <SelectItem value="meters">Meters</SelectItem>
                                <SelectItem value="feet">Feet</SelectItem>
                                <SelectItem value="inches">Inches</SelectItem>
                                <SelectItem value="kilometers">Kilometers</SelectItem>
                                <SelectItem value="miles">Miles</SelectItem>
                              </>
                            )}
                            {unitConverter.type === 'weight' && (
                              <>
                                <SelectItem value="kilograms">Kilograms</SelectItem>
                                <SelectItem value="pounds">Pounds</SelectItem>
                                <SelectItem value="grams">Grams</SelectItem>
                                <SelectItem value="ounces">Ounces</SelectItem>
                              </>
                            )}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    
                    <Button onClick={() => {
                      const value = parseFloat(unitConverter.fromValue);
                      if (isNaN(value)) return;
                      
                      let result = 0;
                      
                      if (unitConverter.type === 'temperature') {
                        if (unitConverter.fromUnit === 'celsius' && unitConverter.toUnit === 'fahrenheit') {
                          result = (value * 9/5) + 32;
                        } else if (unitConverter.fromUnit === 'fahrenheit' && unitConverter.toUnit === 'celsius') {
                          result = (value - 32) * 5/9;
                        } else if (unitConverter.fromUnit === 'celsius' && unitConverter.toUnit === 'kelvin') {
                          result = value + 273.15;
                        } else if (unitConverter.fromUnit === 'kelvin' && unitConverter.toUnit === 'celsius') {
                          result = value - 273.15;
                        } else if (unitConverter.fromUnit === 'fahrenheit' && unitConverter.toUnit === 'kelvin') {
                          result = (value - 32) * 5/9 + 273.15;
                        } else if (unitConverter.fromUnit === 'kelvin' && unitConverter.toUnit === 'fahrenheit') {
                          result = (value - 273.15) * 9/5 + 32;
                        } else {
                          result = value;
                        }
                      } else if (unitConverter.type === 'length') {
                        // Convert to meters first, then to target unit
                        let meters = value;
                        if (unitConverter.fromUnit === 'feet') meters = value * 0.3048;
                        else if (unitConverter.fromUnit === 'inches') meters = value * 0.0254;
                        else if (unitConverter.fromUnit === 'kilometers') meters = value * 1000;
                        else if (unitConverter.fromUnit === 'miles') meters = value * 1609.34;
                        
                        if (unitConverter.toUnit === 'meters') result = meters;
                        else if (unitConverter.toUnit === 'feet') result = meters / 0.3048;
                        else if (unitConverter.toUnit === 'inches') result = meters / 0.0254;
                        else if (unitConverter.toUnit === 'kilometers') result = meters / 1000;
                        else if (unitConverter.toUnit === 'miles') result = meters / 1609.34;
                      } else if (unitConverter.type === 'weight') {
                        // Convert to grams first, then to target unit
                        let grams = value;
                        if (unitConverter.fromUnit === 'kilograms') grams = value * 1000;
                        else if (unitConverter.fromUnit === 'pounds') grams = value * 453.592;
                        else if (unitConverter.fromUnit === 'ounces') grams = value * 28.3495;
                        
                        if (unitConverter.toUnit === 'grams') result = grams;
                        else if (unitConverter.toUnit === 'kilograms') result = grams / 1000;
                        else if (unitConverter.toUnit === 'pounds') result = grams / 453.592;
                        else if (unitConverter.toUnit === 'ounces') result = grams / 28.3495;
                      }
                      
                      setUnitConverter({...unitConverter, result: result.toFixed(4)});
                    }} className="w-full">
                      Convert
                    </Button>
                  </CardContent>
                </Card>
              </div>
              
              {/* CloudConvert File Converter */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Upload className="w-5 h-5 mr-2" />
                    File Converter
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="fileToConvert">Select File</Label>
                    <Input
                      id="fileToConvert"
                      type="file"
                      accept="*/*"
                      onChange={handleFileSelect}
                      disabled={fileConverter.converting}
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      {fileConverter.selectedFile ? `Selected: ${fileConverter.selectedFile.name}` : 'Supports documents, images, audio, video, and more'}
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Convert to</Label>
                      <Select value={fileConverter.outputFormat} onValueChange={(value) => setFileConverter({...fileConverter, outputFormat: value})}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select format" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pdf">PDF</SelectItem>
                          <SelectItem value="docx">DOCX</SelectItem>
                          <SelectItem value="txt">TXT</SelectItem>
                          <SelectItem value="jpg">JPG</SelectItem>
                          <SelectItem value="png">PNG</SelectItem>
                          <SelectItem value="gif">GIF</SelectItem>
                          <SelectItem value="mp3">MP3</SelectItem>
                          <SelectItem value="wav">WAV</SelectItem>
                          <SelectItem value="mp4">MP4</SelectItem>
                          <SelectItem value="avi">AVI</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <Label>Quality</Label>
                      <Select value={fileConverter.quality} onValueChange={(value) => setFileConverter({...fileConverter, quality: value})}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="low">Low</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="high">High</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <Button 
                    onClick={convertFile} 
                    className="w-full" 
                    disabled={!fileConverter.selectedFile || !fileConverter.outputFormat || fileConverter.converting}
                  >
                    {fileConverter.converting ? (
                      <>
                        <div className="w-4 h-4 mr-2 animate-spin rounded-full border-2 border-background border-t-transparent" />
                        Converting...
                      </>
                    ) : (
                      <>
                        <Upload className="w-4 h-4 mr-2" />
                        Convert File
                      </>
                    )}
                  </Button>

                  {/* Converted Files List */}
                  {fileConverter.convertedFiles.length > 0 && (
                    <div className="space-y-2">
                      <Label>Converted Files (Double-click to download):</Label>
                      <div className="space-y-2 max-h-40 overflow-y-auto">
                        {fileConverter.convertedFiles.map((file) => (
                          <div
                            key={file.id}
                            className="flex items-center justify-between p-2 bg-muted rounded cursor-pointer hover:bg-muted/80 transition-colors"
                            onDoubleClick={() => downloadConvertedFile(file.downloadUrl, `${file.originalName.split('.')[0]}.${file.outputFormat}`)}
                          >
                            <div className="flex-1">
                              <p className="text-sm font-medium">{file.originalName}</p>
                              <p className="text-xs text-muted-foreground">
                                Converted to {file.outputFormat.toUpperCase()} • {format(new Date(file.createdAt), 'MMM d, yyyy')}
                              </p>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                downloadConvertedFile(file.downloadUrl, `${file.originalName.split('.')[0]}.${file.outputFormat}`);
                              }}
                            >
                              <Download className="w-4 h-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  <div className="p-3 bg-blue-50 dark:bg-blue-950 rounded text-sm">
                    <strong>Supported formats:</strong>
                    <div className="grid grid-cols-2 gap-2 mt-2 text-xs">
                      <div>
                        <strong>Documents:</strong> PDF, DOCX, TXT, HTML, RTF
                      </div>
                      <div>
                        <strong>Images:</strong> JPG, PNG, GIF, SVG, WEBP
                      </div>
                      <div>
                        <strong>Audio:</strong> MP3, WAV, FLAC, AAC, OGG
                      </div>
                      <div>
                        <strong>Video:</strong> MP4, AVI, MOV, WEBM, MKV
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <div className="grid md:grid-cols-2 gap-6">
                {/* Language Translator */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <MessageSquare className="w-5 h-5 mr-2" />
                      {t('tools.translator')}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <Select value={translator.fromLang} onValueChange={(value) => setTranslator({...translator, fromLang: value})}>
                        <SelectTrigger className="flex-1">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="en">🇺🇸 English</SelectItem>
                          <SelectItem value="hu">🇭🇺 Hungarian</SelectItem>
                        </SelectContent>
                      </Select>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setTranslator({
                          ...translator,
                          fromLang: translator.toLang,
                          toLang: translator.fromLang,
                          sourceText: translator.translatedText,
                          translatedText: translator.sourceText
                        })}
                      >
                        ⇄
                      </Button>
                      <Select value={translator.toLang} onValueChange={(value) => setTranslator({...translator, toLang: value})}>
                        <SelectTrigger className="flex-1">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="en">🇺🇸 English</SelectItem>
                          <SelectItem value="hu">🇭🇺 Hungarian</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <Textarea
                      placeholder="Enter text to translate..."
                      value={translator.sourceText}
                      onChange={(e) => setTranslator({...translator, sourceText: e.target.value})}
                      rows={4}
                    />
                    
                    <Button onClick={async () => {
                      if (!translator.sourceText.trim()) return;
                      
                      try {
                        const response = await fetch('/api/translate', {
                          method: 'POST',
                          headers: {
                            'Content-Type': 'application/json',
                          },
                          body: JSON.stringify({
                            text: translator.sourceText,
                            from: translator.fromLang,
                            to: translator.toLang
                          })
                        });
                        
                        if (response.ok) {
                          const data = await response.json();
                          setTranslator({...translator, translatedText: data.translatedText});
                          
                          if (data.fallback) {
                            toast({
                              title: "Translation",
                              description: "Using offline translation. For better results, try again later.",
                            });
                          }
                        } else {
                          throw new Error('Translation failed');
                        }
                      } catch (error) {
                        toast({
                          variant: "destructive",
                          title: t('message.error'),
                          description: "Translation failed. Please try again.",
                        });
                      }
                    }} className="w-full">
                      Translate
                    </Button>
                    
                    {translator.translatedText && (
                      <div className="space-y-2">
                        <Label>Translation:</Label>
                        <Textarea
                          value={translator.translatedText}
                          readOnly
                          rows={4}
                          className="bg-muted"
                        />
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => navigator.clipboard.writeText(translator.translatedText)}
                        >
                          <Copy className="w-4 h-4 mr-2" />
                          {t('common.copy')} Translation
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* File Size Converter */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Calculator className="w-5 h-5 mr-2" />
                      {t('tools.fileSizeConverter')}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>From</Label>
                        <Input
                          type="number"
                          placeholder="Enter size"
                          value={unitConverter.fromValue}
                          onChange={(e) => setUnitConverter({...unitConverter, fromValue: e.target.value, result: ''})}
                        />
                        <Select value={unitConverter.fromUnit} onValueChange={(value) => setUnitConverter({...unitConverter, fromUnit: value, result: ''})}>
                          <SelectTrigger className="mt-2">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="bytes">Bytes</SelectItem>
                            <SelectItem value="kb">KB</SelectItem>
                            <SelectItem value="mb">MB</SelectItem>
                            <SelectItem value="gb">GB</SelectItem>
                            <SelectItem value="tb">TB</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div>
                        <Label>To</Label>
                        <Input
                          value={unitConverter.result}
                          readOnly
                          placeholder="Result"
                          className="bg-muted"
                        />
                        <Select value={unitConverter.toUnit} onValueChange={(value) => setUnitConverter({...unitConverter, toUnit: value, result: ''})}>
                          <SelectTrigger className="mt-2">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="bytes">Bytes</SelectItem>
                            <SelectItem value="kb">KB</SelectItem>
                            <SelectItem value="mb">MB</SelectItem>
                            <SelectItem value="gb">GB</SelectItem>
                            <SelectItem value="tb">TB</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    
                    <Button onClick={() => {
                      const value = parseFloat(unitConverter.fromValue);
                      if (isNaN(value)) return;
                      
                      // Convert to bytes first
                      let bytes = value;
                      if (unitConverter.fromUnit === 'kb') bytes = value * 1024;
                      else if (unitConverter.fromUnit === 'mb') bytes = value * 1024 * 1024;
                      else if (unitConverter.fromUnit === 'gb') bytes = value * 1024 * 1024 * 1024;
                      else if (unitConverter.fromUnit === 'tb') bytes = value * 1024 * 1024 * 1024 * 1024;
                      
                      let result = bytes;
                      if (unitConverter.toUnit === 'kb') result = bytes / 1024;
                      else if (unitConverter.toUnit === 'mb') result = bytes / (1024 * 1024);
                      else if (unitConverter.toUnit === 'gb') result = bytes / (1024 * 1024 * 1024);
                      else if (unitConverter.toUnit === 'tb') result = bytes / (1024 * 1024 * 1024 * 1024);
                      
                      setUnitConverter({...unitConverter, result: result.toFixed(4)});
                    }} className="w-full">
                      Convert
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* AI Chat Tab */}
            <TabsContent value="chat" className="space-y-6">
              <Card className="h-[600px] flex flex-col">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <MessageSquare className="w-5 h-5 mr-2" />
                    {t('nav.chat')} Assistant
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col space-y-4">
                  {/* Chat Messages */}
                  <div className="flex-1 overflow-y-auto space-y-4 p-4 bg-muted/30 rounded-lg">
                    {chatMessages.length === 0 ? (
                      <div className="text-center text-muted-foreground py-8">
                        <MessageSquare className="w-12 h-12 mx-auto mb-4 opacity-50" />
                        <p>Start a conversation with your AI assistant!</p>
                        <p className="text-sm mt-2">Ask about productivity tips, task management, or anything else.</p>
                        <p className="text-sm mt-2 text-orange-600">Note: AI chat is currently unavailable due to API quota limits.</p>
                      </div>
                    ) : (
                      chatMessages.map((message, index) => (
                        <div
                          key={index}
                          className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                          <div
                            className={`max-w-[80%] p-3 rounded-lg ${
                              message.role === 'user'
                                ? 'bg-primary text-primary-foreground'
                                : 'bg-background border'
                            }`}
                          >
                            <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                          </div>
                        </div>
                      ))
                    )}
                    {chatLoading && (
                      <div className="flex justify-start">
                        <div className="bg-background border p-3 rounded-lg">
                          <div className="flex items-center space-x-2">
                            <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"></div>
                            <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                            <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  {/* Chat Input */}
                  <div className="flex space-x-2">
                    <Input
                      placeholder="Type your message..."
                      value={chatInput}
                      onChange={(e) => setChatInput(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          if (chatInput.trim() && !chatLoading) {
                            const sendMessage = async () => {
                              const userMessage = chatInput.trim();
                              const newMessages = [...chatMessages, { role: 'user' as const, content: userMessage }];
                              
                              setChatMessages(newMessages);
                              setChatInput('');
                              setChatLoading(true);
                              
                              try {
                                const response = await fetch('/api/chat', {
                                  method: 'POST',
                                  headers: {
                                    'Content-Type': 'application/json',
                                  },
                                  body: JSON.stringify({
                                    messages: newMessages.map(msg => ({
                                      role: msg.role,
                                      content: msg.content
                                    }))
                                  }),
                                });
                                
                                if (!response.ok) {
                                  throw new Error('Failed to get response');
                                }
                                
                                const data = await response.json();
                                setChatMessages([...newMessages, { role: 'assistant', content: data.message }]);
                              } catch (error) {
                                console.error('Chat error:', error);
                                setChatMessages([...newMessages, { 
                                  role: 'assistant', 
                                  content: 'Sorry, I encountered an error. The AI service is currently unavailable due to quota limits.' 
                                }]);
                                toast({
                                  variant: "destructive",
                                  title: t('message.error'),
                                  description: "AI service is currently unavailable",
                                });
                              } finally {
                                setChatLoading(false);
                              }
                            };
                            sendMessage();
                          }
                        }
                      }}
                      disabled={chatLoading}
                    />
                    <Button
                      onClick={async () => {
                        if (chatInput.trim() && !chatLoading) {
                          const userMessage = chatInput.trim();
                          const newMessages = [...chatMessages, { role: 'user' as const, content: userMessage }];
                          
                          setChatMessages(newMessages);
                          setChatInput('');
                          setChatLoading(true);
                          
                          try {
                            const response = await fetch('/api/chat', {
                              method: 'POST',
                              headers: {
                                'Content-Type': 'application/json',
                              },
                              body: JSON.stringify({
                                messages: newMessages.map(msg => ({
                                  role: msg.role,
                                  content: msg.content
                                }))
                              }),
                            });
                            
                            if (!response.ok) {
                              throw new Error('Failed to get response');
                            }
                            
                            const data = await response.json();
                            setChatMessages([...newMessages, { role: 'assistant', content: data.message }]);
                          } catch (error) {
                            console.error('Chat error:', error);
                            setChatMessages([...newMessages, { 
                              role: 'assistant', 
                              content: 'Sorry, I encountered an error. The AI service is currently unavailable due to quota limits.' 
                            }]);
                            toast({
                              variant: "destructive",
                              title: t('message.error'),
                              description: "AI service is currently unavailable",
                            });
                          } finally {
                            setChatLoading(false);
                          }
                        }
                      }}
                      disabled={!chatInput.trim() || chatLoading}
                    >
                      <Send className="w-4 h-4" />
                    </Button>
                  </div>
                  
                  {/* Quick Actions */}
                  <div className="flex flex-wrap gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setChatInput("How can I be more productive?")}
                      disabled={chatLoading}
                    >
                      Productivity Tips
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setChatInput("Help me organize my tasks")}
                      disabled={chatLoading}
                    >
                      Task Organization
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setChatInput("What's a good note-taking strategy?")}
                      disabled={chatLoading}
                    >
                      Note-taking Tips
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setChatMessages([]);
                        setChatInput('');
                      }}
                      disabled={chatLoading}
                    >
                      Clear Chat
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Timetables Tab */}
            <TabsContent value="timetables" className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">Timetables & Schedules</h2>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button>
                      <Upload className="w-4 h-4 mr-2" />
                      Upload Timetable
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Upload New Timetable</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="timetableTitle">Title</Label>
                        <Input
                          id="timetableTitle"
                          placeholder="Enter timetable title"
                        />
                      </div>
                      <div>
                        <Label htmlFor="timetableDescription">Description (optional)</Label>
                        <Textarea
                          id="timetableDescription"
                          placeholder="Enter description"
                          rows={3}
                        />
                      </div>
                      <div>
                        <Label htmlFor="timetableFile">File</Label>
                        <Input
                          id="timetableFile"
                          type="file"
                          accept=".pdf,.jpg,.jpeg,.png,.doc,.docx,.xls,.xlsx"
                        />
                        <p className="text-xs text-muted-foreground mt-1">
                          Supported formats: PDF, Images, Word, Excel (Max 10MB)
                        </p>
                      </div>
                      <Button className="w-full">
                        Upload Timetable
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Card>
                  <CardContent className="p-8 text-center">
                    <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-medium mb-2">No timetables yet</h3>
                    <p className="text-muted-foreground mb-4">
                      Upload your first timetable or schedule to get started!
                    </p>
                    <Button>
                      <Upload className="w-4 h-4 mr-2" />
                      Upload First Timetable
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Help Tab */}
            <TabsContent value="help" className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <motion.div variants={fadeInUp}>
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <FileText className="w-6 h-6 mr-2 text-blue-500" />
                        System Wiki
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p className="text-muted-foreground">
                        Complete documentation and guides for using FlowHub's features.
                      </p>
                      <div className="space-y-2">
                        <h4 className="font-semibold">What you'll find:</h4>
                        <ul className="space-y-1 text-sm text-muted-foreground">
                          <li>• Feature overviews and tutorials</li>
                          <li>• Technical specifications</li>
                          <li>• Admin setup guides</li>
                          <li>• Frequently asked questions</li>
                          <li>• Troubleshooting tips</li>
                        </ul>
                      </div>
                      <Button asChild className="w-full">
                        <a href="/wiki" target="_blank" rel="noopener noreferrer">
                          <FileText className="w-4 h-4 mr-2" />
                          Open Wiki
                        </a>
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>

                <motion.div variants={fadeInUp}>
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <MessageSquare className="w-6 h-6 mr-2 text-green-500" />
                        Contact Support
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p className="text-muted-foreground">
                        Need help? Get in touch with our support team.
                      </p>
                      <div className="space-y-2">
                        <h4 className="font-semibold">Support options:</h4>
                        <ul className="space-y-1 text-sm text-muted-foreground">
                          <li>• Contact form for detailed inquiries</li>
                          <li>• Direct email support</li>
                          <li>• FAQ section</li>
                          <li>• Community guidelines</li>
                        </ul>
                      </div>
                      <div className="flex flex-col gap-2">
                        <Button asChild className="w-full">
                          <a href="/contact" target="_blank" rel="noopener noreferrer">
                            <MessageSquare className="w-4 h-4 mr-2" />
                            Contact Form
                          </a>
                        </Button>
                        <Button variant="outline" asChild className="w-full">
                          <a href="mailto:flowhub@sarkozilenard.hu">
                            <ExternalLink className="w-4 h-4 mr-2" />
                            Email Support
                          </a>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </div>

              <motion.div variants={fadeInUp}>
                <Card>
                  <CardHeader>
                    <CardTitle>Quick Help</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <h4 className="font-semibold">Getting Started</h4>
                        <div className="space-y-3">
                          <div className="border-l-4 border-blue-500 pl-4">
                            <h5 className="font-medium">Create your first task</h5>
                            <p className="text-sm text-muted-foreground">
                              Go to the To-Dos tab and click "Add Task" to create your first productivity item.
                            </p>
                          </div>
                          <div className="border-l-4 border-green-500 pl-4">
                            <h5 className="font-medium">Take notes</h5>
                            <p className="text-sm text-muted-foreground">
                              Use the Notes tab to create and organize your thoughts with tags and rich content.
                            </p>
                          </div>
                          <div className="border-l-4 border-purple-500 pl-4">
                            <h5 className="font-medium">Shorten links</h5>
                            <p className="text-sm text-muted-foreground">
                              Create custom short links in the Links tab and track their performance.
                            </p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="space-y-4">
                        <h4 className="font-semibold">Advanced Features</h4>
                        <div className="space-y-3">
                          <div className="border-l-4 border-orange-500 pl-4">
                            <h5 className="font-medium">Use productivity tools</h5>
                            <p className="text-sm text-muted-foreground">
                              Access text converters, unit converters, and translation tools in the Tools tab.
                            </p>
                          </div>
                          <div className="border-l-4 border-red-500 pl-4">
                            <h5 className="font-medium">AI assistance</h5>
                            <p className="text-sm text-muted-foreground">
                              Chat with the AI assistant for productivity tips and task organization help.
                            </p>
                          </div>
                          <div className="border-l-4 border-teal-500 pl-4">
                            <h5 className="font-medium">Manage timetables</h5>
                            <p className="text-sm text-muted-foreground">
                              Upload and organize your schedules and timetables for easy access.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </TabsContent>

            {/* Admin Tab */}
            {userProfile?.isAdmin && (
              <TabsContent value="admin" className="space-y-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-bold">Admin Panel</h2>
                  <Button onClick={fetchAllUsers} disabled={adminLoading}>
                    {adminLoading ? 'Loading...' : 'Refresh Users'}
                  </Button>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                      <User className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{allUsers.length}</div>
                      <p className="text-xs text-muted-foreground">
                        {allUsers.filter(u => u.isAdmin).length} admins
                      </p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Active Users</CardTitle>
                      <CheckCircle className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{allUsers.filter(u => !u.isAdmin).length}</div>
                      <p className="text-xs text-muted-foreground">
                        Regular users
                      </p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">System Status</CardTitle>
                      <Zap className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-green-600">Online</div>
                      <p className="text-xs text-muted-foreground">
                        All systems operational
                      </p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Features</CardTitle>
                      <Settings className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">6</div>
                      <p className="text-xs text-muted-foreground">
                        Active modules
                      </p>
                    </CardContent>
                  </Card>
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle>User Management</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {allUsers.length === 0 ? (
                      <div className="text-center py-8">
                        <User className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                        <p className="text-muted-foreground">No users loaded. Click "Refresh Users" to load user data.</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {allUsers.map((user) => (
                          <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg">
                            <div className="flex-1">
                              <div className="flex items-center space-x-3">
                                <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                                  <User className="w-5 h-5 text-primary-foreground" />
                                </div>
                                <div>
                                  <h3 className="font-medium">
                                    {user.name || user.username || 'Unnamed User'}
                                  </h3>
                                  <p className="text-sm text-muted-foreground">{user.email}</p>
                                  {user.username && (
                                    <p className="text-xs text-muted-foreground">@{user.username}</p>
                                  )}
                                </div>
                              </div>
                            </div>
                            
                            <div className="flex items-center space-x-4">
                              <div className="text-right">
                                <p className="text-sm">
                                  Joined {format(new Date(user.createdAt), 'MMM d, yyyy')}
                                </p>
                                <div className="flex items-center space-x-2 mt-1">
                                  {user.isAdmin ? (
                                    <Badge variant="default" className="bg-primary">
                                      <Shield className="w-3 h-3 mr-1" />
                                      Admin
                                    </Badge>
                                  ) : (
                                    <Badge variant="secondary">User</Badge>
                                  )}
                                </div>
                              </div>
                              
                              {user.id !== userProfile?.id && (
                                <Button
                                  variant={user.isAdmin ? "destructive" : "default"}
                                  size="sm"
                                  onClick={() => toggleUserAdmin(user.id, user.isAdmin)}
                                >
                                  {user.isAdmin ? 'Remove Admin' : 'Make Admin'}
                                </Button>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Admin Setup Instructions</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="p-4 bg-muted rounded-lg">
                        <h4 className="font-medium mb-2">Setting up the first admin user:</h4>
                        <ol className="list-decimal list-inside space-y-2 text-sm">
                          <li>Make sure the user has signed up and created an account</li>
                          <li>Use the admin setup API endpoint: <code className="bg-background px-2 py-1 rounded">/api/admin/setup</code></li>
                          <li>Send a POST request with the user's email or username</li>
                          <li>Example: <code className="bg-background px-2 py-1 rounded">{"{ \"email\": \"admin@example.com\" }"}</code></li>
                        </ol>
                      </div>
                      
                      <div className="p-4 bg-blue-50 dark:bg-blue-950 rounded-lg">
                        <h4 className="font-medium mb-2 text-blue-800 dark:text-blue-200">API Endpoint Details:</h4>
                        <div className="text-sm space-y-1">
                          <p><strong>URL:</strong> <code className="bg-background px-2 py-1 rounded">{window.location.origin}/api/admin/setup</code></p>
                          <p><strong>Method:</strong> POST</p>
                          <p><strong>Body:</strong> <code className="bg-background px-2 py-1 rounded">{"{ \"email\": \"user@example.com\" }"}</code> or <code className="bg-background px-2 py-1 rounded">{"{ \"username\": \"username\" }"}</code></p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            )}
          </Tabs>
        </motion.div>
      </main>
    </div>
  );
}