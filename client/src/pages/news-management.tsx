import { useEffect, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import { apiRequest } from "@/lib/queryClient";
import Sidebar from "@/components/layout/sidebar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, RefreshCw, CheckCircle, XCircle } from "lucide-react";

export default function NewsManagement() {
  const { toast } = useToast();
  const { isAuthenticated, isLoading } = useAuth();
  const queryClient = useQueryClient();

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

  const { data: news, isLoading: newsLoading } = useQuery({
    queryKey: ["/api/news"],
    enabled: isAuthenticated,
  });

  const fetchNewsMutation = useMutation({
    mutationFn: async () => {
      await apiRequest("POST", "/api/news/fetch");
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "News fetch triggered successfully",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/news"] });
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
        description: "Failed to trigger news fetch",
        variant: "destructive",
      });
    },
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      await apiRequest("PUT", `/api/news/${id}/status`, { status });
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "News status updated",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/news"] });
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
        description: "Failed to update news status",
        variant: "destructive",
      });
    },
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'discovered': return 'bg-chart-3 text-background';
      case 'processed': return 'bg-primary text-primary-foreground';
      case 'approved': return 'bg-accent text-accent-foreground';
      case 'rejected': return 'bg-destructive text-destructive-foreground';
      default: return 'bg-muted text-muted-foreground';
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
              <h2 className="text-2xl font-bold text-foreground">News Management</h2>
              <p className="text-muted-foreground">Manage and review discovered news articles</p>
            </div>
            <div className="flex items-center space-x-4">
              <Button 
                onClick={() => fetchNewsMutation.mutate()}
                disabled={fetchNewsMutation.isPending}
                className="bg-primary hover:bg-primary/80 text-primary-foreground"
                data-testid="button-fetch-news"
              >
                <Search className="h-4 w-4 mr-2" />
                {fetchNewsMutation.isPending ? 'Fetching...' : 'Fetch News'}
              </Button>
            </div>
          </div>
        </header>

        {/* News List */}
        <div className="p-6">
          {newsLoading ? (
            <div className="grid grid-cols-1 gap-4">
              {[...Array(5)].map((_, i) => (
                <Card key={i} className="bg-card border-border">
                  <CardHeader>
                    <div className="h-4 bg-muted rounded animate-pulse"></div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="h-3 bg-muted rounded animate-pulse"></div>
                      <div className="h-3 bg-muted rounded animate-pulse w-3/4"></div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : news && news.length > 0 ? (
            <div className="grid grid-cols-1 gap-4">
              {news.map((article: any) => (
                <Card key={article.id} className="bg-card border-border" data-testid={`card-news-${article.id}`}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg font-semibold text-foreground mb-2">
                          {article.title}
                        </CardTitle>
                        <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                          <span>Source: {article.source}</span>
                          <span>Score: {article.viralScore}/100</span>
                          <span>
                            {new Date(article.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge className={getStatusColor(article.status)}>
                          {article.status}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-4 line-clamp-3">
                      {article.content}
                    </p>
                    
                    {article.status === 'processed' && (
                      <div className="flex items-center space-x-2">
                        <Button
                          size="sm"
                          onClick={() => updateStatusMutation.mutate({ 
                            id: article.id, 
                            status: 'approved' 
                          })}
                          disabled={updateStatusMutation.isPending}
                          className="bg-accent hover:bg-accent/80 text-accent-foreground"
                          data-testid={`button-approve-${article.id}`}
                        >
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Approve
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => updateStatusMutation.mutate({ 
                            id: article.id, 
                            status: 'rejected' 
                          })}
                          disabled={updateStatusMutation.isPending}
                          data-testid={`button-reject-${article.id}`}
                        >
                          <XCircle className="h-4 w-4 mr-1" />
                          Reject
                        </Button>
                      </div>
                    )}

                    {article.url && (
                      <div className="mt-3 pt-3 border-t border-border">
                        <a 
                          href={article.url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-primary hover:underline text-sm"
                          data-testid={`link-source-${article.id}`}
                        >
                          View Original Article →
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
                <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">No News Articles Found</h3>
                <p className="text-muted-foreground mb-4">
                  No news articles have been discovered yet. Click the "Fetch News" button to start discovering content.
                </p>
                <Button 
                  onClick={() => fetchNewsMutation.mutate()}
                  disabled={fetchNewsMutation.isPending}
                  className="bg-primary hover:bg-primary/80 text-primary-foreground"
                  data-testid="button-fetch-news-empty"
                >
                  <Search className="h-4 w-4 mr-2" />
                  Fetch News
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  );
}
