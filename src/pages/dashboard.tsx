import React, { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
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
  Send
} from "lucide-react";
import { createClient } from '@/util/supabase/component';
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
  const { user, signOut } = useAuth();
  const { toast } = useToast();
  const supabase = createClient();
  
  // State management
  const [todos, setTodos] = useState<Todo[]>([]);
  const [notes, setNotes] = useState<Note[]>([]);
  const [shortLinks, setShortLinks] = useState<ShortLink[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Form states
  const [newTodo, setNewTodo] = useState({ title: '', description: '', priority: 'medium', dueDate: '' });
  const [newNote, setNewNote] = useState({ title: '', content: '', tags: '' });
  const [newLink, setNewLink] = useState({ originalUrl: '', title: '', customCode: '' });
  
  // Dialog states
  const [todoDialogOpen, setTodoDialogOpen] = useState(false);
  const [noteDialogOpen, setNoteDialogOpen] = useState(false);
  const [linkDialogOpen, setLinkDialogOpen] = useState(false);
  
  // Filter states
  const [todoFilter, setTodoFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Converter states
  const [textToConvert, setTextToConvert] = useState('');
  const [convertedText, setConvertedText] = useState('');
  const [conversionType, setConversionType] = useState('uppercase');
  
  // Language and other tool states
  const [currentLanguage, setCurrentLanguage] = useState('en');
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

  useEffect(() => {
    if (user) {
      fetchData();
    }
  }, [user]);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Fetch todos
      const { data: todosData } = await supabase
        .from('Todo')
        .select('*')
        .eq('userId', user?.id)
        .order('createdAt', { ascending: false });
      
      // Fetch notes
      const { data: notesData } = await supabase
        .from('Note')
        .select('*')
        .eq('userId', user?.id)
        .order('updatedAt', { ascending: false });
      
      // Fetch short links
      const { data: linksData } = await supabase
        .from('ShortLink')
        .select('*')
        .eq('userId', user?.id)
        .order('createdAt', { ascending: false });
      
      setTodos(todosData || []);
      setNotes(notesData || []);
      setShortLinks(linksData || []);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to fetch data",
      });
    } finally {
      setLoading(false);
    }
  };

  // Todo functions
  const addTodo = async () => {
    if (!newTodo.title.trim()) return;
    
    try {
      const { data, error } = await supabase
        .from('Todo')
        .insert({
          title: newTodo.title,
          description: newTodo.description || null,
          priority: newTodo.priority,
          dueDate: newTodo.dueDate || null,
          userId: user?.id
        })
        .select()
        .single();
      
      if (error) throw error;
      
      setTodos([data, ...todos]);
      setNewTodo({ title: '', description: '', priority: 'medium', dueDate: '' });
      setTodoDialogOpen(false);
      
      toast({
        title: "Success",
        description: "Todo added successfully",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to add todo",
      });
    }
  };

  const toggleTodo = async (id: string, completed: boolean) => {
    try {
      const { error } = await supabase
        .from('Todo')
        .update({ completed: !completed })
        .eq('id', id);
      
      if (error) throw error;
      
      setTodos(todos.map(todo => 
        todo.id === id ? { ...todo, completed: !completed } : todo
      ));
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update todo",
      });
    }
  };

  const deleteTodo = async (id: string) => {
    try {
      const { error } = await supabase
        .from('Todo')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      setTodos(todos.filter(todo => todo.id !== id));
      
      toast({
        title: "Success",
        description: "Todo deleted successfully",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete todo",
      });
    }
  };

  // Note functions
  const addNote = async () => {
    if (!newNote.title.trim() || !newNote.content.trim()) return;
    
    try {
      const tags = newNote.tags.split(',').map(tag => tag.trim()).filter(tag => tag);
      
      const { data, error } = await supabase
        .from('Note')
        .insert({
          title: newNote.title,
          content: newNote.content,
          tags: tags,
          userId: user?.id
        })
        .select()
        .single();
      
      if (error) throw error;
      
      setNotes([data, ...notes]);
      setNewNote({ title: '', content: '', tags: '' });
      setNoteDialogOpen(false);
      
      toast({
        title: "Success",
        description: "Note added successfully",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to add note",
      });
    }
  };

  const deleteNote = async (id: string) => {
    try {
      const { error } = await supabase
        .from('Note')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      setNotes(notes.filter(note => note.id !== id));
      
      toast({
        title: "Success",
        description: "Note deleted successfully",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete note",
      });
    }
  };

  // Short link functions
  const addShortLink = async () => {
    if (!newLink.originalUrl.trim()) return;
    
    try {
      let shortCode = newLink.customCode.trim();
      
      // If no custom code provided, generate random one
      if (!shortCode) {
        shortCode = Math.random().toString(36).substring(2, 8);
      } else {
        // Check if custom code already exists
        const { data: existingLink } = await supabase
          .from('ShortLink')
          .select('id')
          .eq('shortCode', shortCode)
          .maybeSingle();
        
        if (existingLink) {
          toast({
            variant: "destructive",
            title: "Error",
            description: "This custom code is already taken. Please choose another one.",
          });
          return;
        }
      }
      
      const { data, error } = await supabase
        .from('ShortLink')
        .insert({
          originalUrl: newLink.originalUrl,
          shortCode: shortCode,
          title: newLink.title || null,
          userId: user?.id
        })
        .select()
        .single();
      
      if (error) throw error;
      
      setShortLinks([data, ...shortLinks]);
      setNewLink({ originalUrl: '', title: '', customCode: '' });
      setLinkDialogOpen(false);
      
      toast({
        title: "Success",
        description: "Short link created successfully",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to create short link",
      });
    }
  };

  const copyShortLink = (shortCode: string) => {
    const shortUrl = `${window.location.origin}/s/${shortCode}`;
    navigator.clipboard.writeText(shortUrl);
    toast({
      title: "Copied!",
      description: "Short link copied to clipboard",
    });
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
          <p className="text-muted-foreground">Loading your workspace...</p>
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
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Zap className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-2xl font-bold text-primary">FlowHub</span>
          </div>
          
          <div className="flex items-center space-x-4">
            <LanguageSelector 
              currentLanguage={currentLanguage} 
              onLanguageChange={setCurrentLanguage} 
            />
            <ThemeToggle />
            <span className="text-sm text-muted-foreground hidden sm:inline">
              Welcome back, {user?.email}
            </span>
            <Button variant="ghost" size="sm" onClick={signOut}>
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>
      </motion.header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2">Your Productivity Hub</h1>
            <p className="text-muted-foreground text-lg">
              Manage your tasks, notes, and tools all in one place
            </p>
          </div>

          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList className="grid w-full grid-cols-6">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="todos">To-Dos</TabsTrigger>
              <TabsTrigger value="notes">Notes</TabsTrigger>
              <TabsTrigger value="links">Links</TabsTrigger>
              <TabsTrigger value="tools">Tools</TabsTrigger>
              <TabsTrigger value="chat">AI Chat</TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-6">
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                <motion.div variants={fadeInUp}>
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Total Tasks</CardTitle>
                      <CheckCircle className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{todos.length}</div>
                      <p className="text-xs text-muted-foreground">
                        {todos.filter(t => t.completed).length} completed
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>

                <motion.div variants={fadeInUp}>
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Notes</CardTitle>
                      <FileText className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{notes.length}</div>
                      <p className="text-xs text-muted-foreground">
                        Total notes created
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>

                <motion.div variants={fadeInUp}>
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Short Links</CardTitle>
                      <LinkIcon className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{shortLinks.length}</div>
                      <p className="text-xs text-muted-foreground">
                        {shortLinks.reduce((sum, link) => sum + link.clicks, 0)} total clicks
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>

                <motion.div variants={fadeInUp}>
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Productivity</CardTitle>
                      <Star className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">
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
              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {todos.slice(0, 3).map((todo) => (
                      <div key={todo.id} className="flex items-center space-x-3">
                        <CheckCircle className={`w-4 h-4 ${todo.completed ? 'text-green-500' : 'text-gray-400'}`} />
                        <span className={todo.completed ? 'line-through text-muted-foreground' : ''}>
                          {todo.title}
                        </span>
                        <Badge variant="outline" className={getPriorityColor(todo.priority)}>
                          {todo.priority}
                        </Badge>
                      </div>
                    ))}
                    {todos.length === 0 && (
                      <p className="text-muted-foreground text-center py-4">
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
                      placeholder="Search tasks..."
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
                      <SelectItem value="all">All Tasks</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <Dialog open={todoDialogOpen} onOpenChange={setTodoDialogOpen}>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="w-4 h-4 mr-2" />
                      Add Task
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Add New Task</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="title">Title</Label>
                        <Input
                          id="title"
                          value={newTodo.title}
                          onChange={(e) => setNewTodo({...newTodo, title: e.target.value})}
                          placeholder="Enter task title"
                        />
                      </div>
                      <div>
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                          id="description"
                          value={newTodo.description}
                          onChange={(e) => setNewTodo({...newTodo, description: e.target.value})}
                          placeholder="Enter task description"
                        />
                      </div>
                      <div>
                        <Label htmlFor="priority">Priority</Label>
                        <Select value={newTodo.priority} onValueChange={(value) => setNewTodo({...newTodo, priority: value})}>
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
                      <div>
                        <Label htmlFor="dueDate">Due Date</Label>
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
                                  {todo.priority}
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
                      <h3 className="text-lg font-medium mb-2">No tasks found</h3>
                      <p className="text-muted-foreground mb-4">
                        {searchTerm ? 'Try adjusting your search or filter.' : 'Create your first task to get started!'}
                      </p>
                      {!searchTerm && (
                        <Button onClick={() => setTodoDialogOpen(true)}>
                          <Plus className="w-4 h-4 mr-2" />
                          Add Your First Task
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
                <h2 className="text-2xl font-bold">Your Notes</h2>
                <Dialog open={noteDialogOpen} onOpenChange={setNoteDialogOpen}>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="w-4 h-4 mr-2" />
                      Add Note
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>Add New Note</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="noteTitle">Title</Label>
                        <Input
                          id="noteTitle"
                          value={newNote.title}
                          onChange={(e) => setNewNote({...newNote, title: e.target.value})}
                          placeholder="Enter note title"
                        />
                      </div>
                      <div>
                        <Label htmlFor="noteContent">Content</Label>
                        <Textarea
                          id="noteContent"
                          value={newNote.content}
                          onChange={(e) => setNewNote({...newNote, content: e.target.value})}
                          placeholder="Write your note here..."
                          rows={8}
                        />
                      </div>
                      <div>
                        <Label htmlFor="noteTags">Tags (comma separated)</Label>
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
                        <h3 className="text-lg font-medium mb-2">No notes yet</h3>
                        <p className="text-muted-foreground mb-4">
                          Create your first note to start organizing your thoughts!
                        </p>
                        <Button onClick={() => setNoteDialogOpen(true)}>
                          <Plus className="w-4 h-4 mr-2" />
                          Add Your First Note
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
                <h2 className="text-2xl font-bold">Short Links</h2>
                <Dialog open={linkDialogOpen} onOpenChange={setLinkDialogOpen}>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="w-4 h-4 mr-2" />
                      Create Link
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Create Short Link</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="originalUrl">Original URL</Label>
                        <Input
                          id="originalUrl"
                          value={newLink.originalUrl}
                          onChange={(e) => setNewLink({...newLink, originalUrl: e.target.value})}
                          placeholder="https://example.com/very-long-url"
                        />
                      </div>
                      <div>
                        <Label htmlFor="linkTitle">Title (optional)</Label>
                        <Input
                          id="linkTitle"
                          value={newLink.title}
                          onChange={(e) => setNewLink({...newLink, title: e.target.value})}
                          placeholder="My awesome link"
                        />
                      </div>
                      <div>
                        <Label htmlFor="customCode">Custom Code (optional)</Label>
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
                            <code className="text-sm">
                              {window.location.origin}/s/{link.shortCode}
                            </code>
                            <div className="flex items-center space-x-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => copyShortLink(link.shortCode)}
                              >
                                <Copy className="w-4 h-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => window.open(link.originalUrl, '_blank')}
                              >
                                <ExternalLink className="w-4 h-4" />
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
                      <h3 className="text-lg font-medium mb-2">No short links yet</h3>
                      <p className="text-muted-foreground mb-4">
                        Create your first short link to start tracking clicks!
                      </p>
                      <Button onClick={() => setLinkDialogOpen(true)}>
                        <Plus className="w-4 h-4 mr-2" />
                        Create Your First Link
                      </Button>
                    </CardContent>
                  </Card>
                )}
              </div>
            </TabsContent>

            {/* Tools Tab */}
            <TabsContent value="tools" className="space-y-6">
              <h2 className="text-2xl font-bold">Productivity Tools</h2>
              
              <div className="grid md:grid-cols-2 gap-6">
                {/* Text Case Converter */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Calculator className="w-5 h-5 mr-2" />
                      Text Case Converter
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
                          Copy Result
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
                      Unit Converter
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
              
              <div className="grid md:grid-cols-2 gap-6">
                {/* Language Translator */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <MessageSquare className="w-5 h-5 mr-2" />
                      Language Translator
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
                    
                    <Button onClick={() => {
                      // Simple mock translation - in a real app, you'd use a translation API
                      const mockTranslations: Record<string, Record<string, string>> = {
                        'en-hu': {
                          'hello': 'helló',
                          'goodbye': 'viszlát',
                          'thank you': 'köszönöm',
                          'please': 'kérem',
                          'yes': 'igen',
                          'no': 'nem'
                        },
                        'hu-en': {
                          'helló': 'hello',
                          'viszlát': 'goodbye',
                          'köszönöm': 'thank you',
                          'kérem': 'please',
                          'igen': 'yes',
                          'nem': 'no'
                        }
                      };
                      
                      const key = `${translator.fromLang}-${translator.toLang}`;
                      const text = translator.sourceText.toLowerCase();
                      const translation = mockTranslations[key]?.[text] || `[Translation: ${translator.sourceText}]`;
                      
                      setTranslator({...translator, translatedText: translation});
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
                          Copy Translation
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
                      File Size Converter
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
                    AI Chat Assistant
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
                                  content: 'Sorry, I encountered an error. Please try again.' 
                                }]);
                                toast({
                                  variant: "destructive",
                                  title: "Error",
                                  description: "Failed to get AI response",
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
                              content: 'Sorry, I encountered an error. Please try again.' 
                            }]);
                            toast({
                              variant: "destructive",
                              title: "Error",
                              description: "Failed to get AI response",
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
          </Tabs>
        </motion.div>
      </main>
    </div>
  );
}