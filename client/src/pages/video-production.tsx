import { useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import { apiRequest } from "@/lib/queryClient";
import Sidebar from "@/components/layout/sidebar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Video, Play, Edit3, CheckCircle, Clock, AlertCircle } from "lucide-react";
import { useState } from "react";

export default function VideoProduction() {
  const { toast } = useToast();
  const { isAuthenticated, isLoading } = useAuth();
  const queryClient = useQueryClient();
  const [editingVideo, setEditingVideo] = useState<string | null>(null);
  const [editOptions, setEditOptions] = useState({
    script: false,
    voiceover: false,
    avatar: false,
    customInstruction: false,
  });

  // Redirect to home if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      toast({
        title: "Unauthorized",
        description: "You are logged out. Logging in again...",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/api/login";
      }, 500);
      return;
    }
  }, [isAuthenticated, isLoading, toast]);

  const { data: videos, isLoading: videosLoading } = useQuery({
    queryKey: ["/api/videos"],
    enabled: isAuthenticated,
    refetchInterval: 10000, // Refresh every 10 seconds
  });

  const approveVideoMutation = useMutation({
    mutationFn: async (videoId: string) => {
      await apiRequest("PUT", `/api/videos/${videoId}/approve`);
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Video approved and queued for publishing",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/videos"] });
    },
    onError: (error: any) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Unauthorized",
          description: "You are logged out. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return;
      }
      toast({
        title: "Error",
        description: "Failed to approve video",
        variant: "destructive",
      });
    },
  });

  const regenerateVideoMutation = useMutation({
    mutationFn: async ({ videoId, options }: { videoId: string; options: any }) => {
      await apiRequest("PUT", `/api/videos/${videoId}/regenerate`, { options });
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Video regeneration triggered",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/videos"] });
      setEditingVideo(null);
      setEditOptions({ script: false, voiceover: false, avatar: false, customInstruction: false });
    },
    onError: (error: any) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Unauthorized",
          description: "You are logged out. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return;
      }
      toast({
        title: "Error",
        description: "Failed to regenerate video",
        variant: "destructive",
      });
    },
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-chart-3 text-background';
      case 'generating': return 'bg-primary text-primary-foreground';
      case 'ready': return 'bg-accent text-accent-foreground';
      case 'approved': return 'bg-chart-2 text-background';
      case 'published': return 'bg-chart-4 text-background';
      case 'failed': return 'bg-destructive text-destructive-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="h-4 w-4" />;
      case 'generating': return <Play className="h-4 w-4" />;
      case 'ready': return <Video className="h-4 w-4" />;
      case 'approved': return <CheckCircle className="h-4 w-4" />;
      case 'published': return <CheckCircle className="h-4 w-4" />;
      case 'failed': return <AlertCircle className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const handleProcessEdit = () => {
    if (editingVideo) {
      regenerateVideoMutation.mutate({
        videoId: editingVideo,
        options: editOptions,
      });
    }
  };

  if (isLoading || !isAuthenticated) {
    return null;
  }

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <Sidebar />
      
      <main className="flex-1 overflow-y-auto">
        {/* Header */}
        <header className="bg-card border-b border-border p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-foreground">Video Production</h2>
              <p className="text-muted-foreground">Monitor and manage video generation pipeline</p>
            </div>
          </div>
        </header>

        {/* Videos Grid */}
        <div className="p-6">
          {videosLoading ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <Card key={i} className="bg-card border-border">
                  <CardHeader>
                    <div className="h-4 bg-muted rounded animate-pulse mb-2"></div>
                    <div className="h-3 bg-muted rounded animate-pulse w-3/4"></div>
                  </CardHeader>
                  <CardContent>
                    <div className="aspect-video bg-muted rounded animate-pulse mb-4"></div>
                    <div className="space-y-2">
                      <div className="h-3 bg-muted rounded animate-pulse"></div>
                      <div className="h-3 bg-muted rounded animate-pulse w-2/3"></div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : videos && videos.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {videos.map((video: any) => (
                <Card key={video.id} className="bg-card border-border" data-testid={`card-video-${video.id}`}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg font-semibold text-foreground mb-2 line-clamp-2">
                          {video.title}
                        </CardTitle>
                        <div className="flex items-center space-x-2">
                          <Badge className={getStatusColor(video.status)}>
                            {getStatusIcon(video.status)}
                            <span className="ml-1 capitalize">{video.status}</span>
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {video.language}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent>
                    {/* Video Thumbnail Placeholder */}
                    <div className="aspect-video bg-gradient-to-br from-primary/20 to-accent/20 rounded-lg mb-4 flex items-center justify-center border border-border">
                      <div className="text-center">
                        <Video className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                        <p className="text-sm text-muted-foreground">Video Preview</p>
                      </div>
                    </div>

                    {/* Video Info */}
                    <div className="space-y-2 text-sm text-muted-foreground">
                      <div className="flex justify-between">
                        <span>Avatar:</span>
                        <span className="text-foreground capitalize">{video.avatarTemplate.replace('_', ' ')}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Created:</span>
                        <span className="text-foreground">
                          {new Date(video.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      {video.views > 0 && (
                        <div className="flex justify-between">
                          <span>Views:</span>
                          <span className="text-foreground">{video.views.toLocaleString()}</span>
                        </div>
                      )}
                    </div>

                    {/* Action Buttons */}
                    {video.status === 'ready' && (
                      <div className="flex items-center space-x-2 mt-4">
                        <Button
                          size="sm"
                          onClick={() => approveVideoMutation.mutate(video.id)}
                          disabled={approveVideoMutation.isPending}
                          className="bg-accent hover:bg-accent/80 text-accent-foreground flex-1"
                          data-testid={`button-approve-${video.id}`}
                        >
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Approve
                        </Button>
                        
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              size="sm"
                              variant="secondary"
                              onClick={() => setEditingVideo(video.id)}
                              className="bg-secondary hover:bg-secondary/80 text-secondary-foreground"
                              data-testid={`button-edit-${video.id}`}
                            >
                              <Edit3 className="h-4 w-4 mr-1" />
                              Edit
                            </Button>
                          </DialogTrigger>
                          
                          <DialogContent className="bg-card border-border">
                            <DialogHeader>
                              <DialogTitle className="text-foreground">Edit Content Options</DialogTitle>
                            </DialogHeader>
                            
                            <div className="space-y-4">
                              <div className="space-y-3">
                                <label className="flex items-center space-x-3 cursor-pointer">
                                  <Checkbox
                                    checked={editOptions.script}
                                    onCheckedChange={(checked) => 
                                      setEditOptions(prev => ({ ...prev, script: checked as boolean }))
                                    }
                                    data-testid="checkbox-regenerate-script"
                                  />
                                  <span className="text-sm text-foreground">Regenerate Script</span>
                                </label>
                                
                                <label className="flex items-center space-x-3 cursor-pointer">
                                  <Checkbox
                                    checked={editOptions.voiceover}
                                    onCheckedChange={(checked) => 
                                      setEditOptions(prev => ({ ...prev, voiceover: checked as boolean }))
                                    }
                                    data-testid="checkbox-regenerate-voiceover"
                                  />
                                  <span className="text-sm text-foreground">Regenerate Voiceover</span>
                                </label>
                                
                                <label className="flex items-center space-x-3 cursor-pointer">
                                  <Checkbox
                                    checked={editOptions.avatar}
                                    onCheckedChange={(checked) => 
                                      setEditOptions(prev => ({ ...prev, avatar: checked as boolean }))
                                    }
                                    data-testid="checkbox-change-avatar"
                                  />
                                  <span className="text-sm text-foreground">Change Avatar/Template</span>
                                </label>
                                
                                <label className="flex items-center space-x-3 cursor-pointer">
                                  <Checkbox
                                    checked={editOptions.customInstruction}
                                    onCheckedChange={(checked) => 
                                      setEditOptions(prev => ({ ...prev, customInstruction: checked as boolean }))
                                    }
                                    data-testid="checkbox-custom-instruction"
                                  />
                                  <span className="text-sm text-foreground">Custom Instruction</span>
                                </label>
                              </div>
                              
                              <div className="flex items-center justify-end space-x-3 pt-4">
                                <Button
                                  variant="secondary"
                                  onClick={() => {
                                    setEditingVideo(null);
                                    setEditOptions({ script: false, voiceover: false, avatar: false, customInstruction: false });
                                  }}
                                  data-testid="button-cancel-edit"
                                >
                                  Cancel
                                </Button>
                                <Button
                                  onClick={handleProcessEdit}
                                  disabled={regenerateVideoMutation.isPending || Object.values(editOptions).every(v => !v)}
                                  className="bg-primary hover:bg-primary/80 text-primary-foreground"
                                  data-testid="button-process-edit"
                                >
                                  Process Changes
                                </Button>
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>
                      </div>
                    )}

                    {video.youtubeVideoId && (
                      <div className="mt-3 pt-3 border-t border-border">
                        <a 
                          href={`https://youtube.com/watch?v=${video.youtubeVideoId}`}
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-primary hover:underline text-sm"
                          data-testid={`link-youtube-${video.id}`}
                        >
                          View on YouTube →
                        </a>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="bg-card border-border">
              <CardContent className="p-8 text-center">
                <Video className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">No Videos Found</h3>
                <p className="text-muted-foreground">
                  No videos have been generated yet. Videos will appear here as they are processed from approved news articles.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  );
}
