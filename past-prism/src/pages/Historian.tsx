// Historian.tsx
import { useState } from 'react';
import { Navigation } from '@/components/Navigation';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Search, Upload, GitBranch, Clock } from 'lucide-react';
import { toast } from 'sonner';
import { TimelineFlow } from '@/components/Historian/TimelineFlow';
import { queryMindmap, QueryResponse } from '@/api'; // Import the API function

const Historian = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [mindmapJSON, setMindmapJSON] = useState(''); // store raw Gemini JSON mindmap string
  const [uploadContent, setUploadContent] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      toast.error('Please enter a search query');
      return;
    }

    setIsLoading(true);
    toast.loading('Querying Gemini...');

    try {
      const data: QueryResponse = await queryMindmap(searchQuery);

      if (data.nodes && data.edges) {
        setMindmapJSON(JSON.stringify(data)); // valid JSON mindmap
        toast.success('Mindmap received from Gemini');
      } else if (data.raw) {
        setMindmapJSON(''); // Gemini gave malformed JSON
        toast.error('Gemini returned invalid JSON');
        console.error('Gemini raw output:\n', data.raw);
      } else {
        setMindmapJSON('');
        toast.error(data.error || 'No valid mindmap received');
      }
    } catch (err) {
      setMindmapJSON('');
      toast.error('Error connecting to backend');
      console.error(err);
    }

    setIsLoading(false);
  };

  const handleUpload = async () => {
    if (!uploadContent.trim()) {
      toast.error('Please provide historical content to upload');
      return;
    }
    setIsLoading(true);
    toast.loading('Processing historical content...');
    setTimeout(() => {
      setIsLoading(false);
      toast.success('Historical content processed and added to database');
      setUploadContent('');
    }, 3000);
  };

  const mockEvents = [
    { name: 'World War II', date: '1939-1945', category: 'Military Conflict' },
    { name: 'Renaissance', date: '14th-17th Century', category: 'Cultural Movement' },
    { name: 'Industrial Revolution', date: '1760-1840', category: 'Economic Transformation' },
  ];

  return (
    <div className="min-h-screen bg-gradient-surface">
      <Navigation />

      <div className="container mx-auto px-4 pt-24 pb-12">
        {/* Header */}
        <div className="text-center mb-12 animate-fade-in">
          <div className="flex items-center justify-center mb-4">
            <Clock className="w-8 h-8 text-primary mr-3" />
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              Timeless Historian
            </h1>
          </div>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Explore historical events through interactive visualizations and discover the connections that shaped our world
          </p>
        </div>

        {/* Main Interface */}
        <div className="grid lg:grid-cols-2 gap-8 mb-12">
          {/* Search Section */}
          <Card className="p-6 bg-card/50 backdrop-blur-sm border-border hover:shadow-elegant transition-all duration-300">
            <div className="flex items-center mb-4">
              <Search className="w-6 h-6 text-primary mr-2" />
              <h2 className="text-2xl font-bold">Event Search & Explore</h2>
            </div>
            <p className="text-muted-foreground mb-6">
              Search for historical events and explore them through interactive timelines and mind maps
            </p>

            <div className="space-y-4">
              <div className="flex gap-2">
                <Input
                  placeholder="Search historical events (e.g., World War II, Renaissance)"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  className="flex-1"
                  disabled={isLoading}
                />
                <Button onClick={handleSearch} disabled={isLoading} className="bg-gradient-primary hover:shadow-glow">
                  <Search className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </Card>

          {/* Upload Section */}
          <Card className="p-6 bg-card/50 backdrop-blur-sm border-border hover:shadow-elegant transition-all duration-300">
            <div className="flex items-center mb-4">
              <Upload className="w-6 h-6 text-accent mr-2" />
              <h2 className="text-2xl font-bold">Upload Context</h2>
            </div>
            <p className="text-muted-foreground mb-6">
              Contribute new historical context, documents, or structured information to expand our knowledge base
            </p>
            <div className="space-y-4">
              <Textarea
                placeholder="Paste text, describe an event, or provide historical context..."
                value={uploadContent}
                onChange={(e) => setUploadContent(e.target.value)}
                className="min-h-[120px] resize-none"
                disabled={isLoading}
              />
              <Button
                onClick={handleUpload}
                disabled={isLoading}
                className="w-full bg-gradient-accent hover:shadow-accent"
              >
                <Upload className="w-4 h-4 mr-2" />
                Process & Add to Database
              </Button>
            </div>
          </Card>
        </div>

        {/* Show TimelineFlow only if mindmap data exists */}
        {mindmapJSON.trim() !== '' && (
          <div className="mb-12">
            <TimelineFlow searchQuery={mindmapJSON} />
          </div>
        )}

        {/* Recent Events Preview */}
        <Card className="p-6 bg-card/30 backdrop-blur-sm border-border">
          <h3 className="text-xl font-bold mb-4 flex items-center">
            <GitBranch className="w-5 h-5 text-primary mr-2" />
            Popular Historical Events
          </h3>
          <div className="grid md:grid-cols-3 gap-4">
            {mockEvents.map((event, index) => (
              <Card
                key={index}
                className="p-4 bg-muted/30 hover:bg-muted/50 transition-all duration-300 cursor-pointer group"
              >
                <h4 className="font-semibold group-hover:text-primary transition-colors">{event.name}</h4>
                <p className="text-sm text-muted-foreground">{event.date}</p>
                <p className="text-xs text-accent mt-1">{event.category}</p>
              </Card>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Historian;