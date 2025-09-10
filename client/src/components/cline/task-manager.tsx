import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  CheckCircle2,
  Circle,
  Clock,
  AlertCircle,
  Play,
  Pause,
  RotateCcw,
  Trash2,
  Plus
} from "lucide-react";

interface Task {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'running' | 'completed' | 'error';
  progress: number;
  dependencies: string[];
  agent: string;
  createdAt: Date;
  completedAt?: Date;
}

interface TaskManagerProps {
  tasks?: Task[];
  onTaskUpdate?: (taskId: string, updates: Partial<Task>) => void;
  onTaskCreate?: (task: Omit<Task, 'id' | 'createdAt'>) => void;
  onTaskDelete?: (taskId: string) => void;
}

export function TaskManager({ 
  tasks = [], 
  onTaskUpdate, 
  onTaskCreate, 
  onTaskDelete 
}: TaskManagerProps) {
  const [filter, setFilter] = useState<'all' | 'pending' | 'running' | 'completed' | 'error'>('all');

  const filteredTasks = tasks.filter(task => {
    if (filter === 'all') return true;
    return task.status === filter;
  });

  const statusConfig = {
    pending: {
      icon: Circle,
      color: "text-muted-foreground",
      bgColor: "bg-muted",
      label: "Pendente"
    },
    running: {
      icon: Clock,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
      label: "Executando"
    },
    completed: {
      icon: CheckCircle2,
      color: "text-green-600",
      bgColor: "bg-green-100",
      label: "Concluído"
    },
    error: {
      icon: AlertCircle,
      color: "text-red-600",
      bgColor: "bg-red-100",
      label: "Erro"
    }
  };

  const getStatusCounts = () => {
    const counts = {
      all: tasks.length,
      pending: tasks.filter(t => t.status === 'pending').length,
      running: tasks.filter(t => t.status === 'running').length,
      completed: tasks.filter(t => t.status === 'completed').length,
      error: tasks.filter(t => t.status === 'error').length
    };
    return counts;
  };

  const counts = getStatusCounts();

  const handleTaskAction = (taskId: string, action: 'start' | 'pause' | 'retry' | 'delete') => {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;

    switch (action) {
      case 'start':
        onTaskUpdate?.(taskId, { status: 'running', progress: 0 });
        break;
      case 'pause':
        onTaskUpdate?.(taskId, { status: 'pending' });
        break;
      case 'retry':
        onTaskUpdate?.(taskId, { status: 'pending', progress: 0 });
        break;
      case 'delete':
        onTaskDelete?.(taskId);
        break;
    }
  };

  const formatDuration = (start: Date, end?: Date) => {
    const endTime = end || new Date();
    const diff = endTime.getTime() - start.getTime();
    const minutes = Math.floor(diff / 60000);
    const seconds = Math.floor((diff % 60000) / 1000);
    return `${minutes}m ${seconds}s`;
  };

  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between">
          <span>Gerenciador de Tarefas</span>
          <Button
            size="sm"
            onClick={() => onTaskCreate?.({
              title: "Nova Tarefa",
              description: "Descrição da tarefa",
              status: 'pending',
              progress: 0,
              dependencies: [],
              agent: 'builder'
            })}
            data-testid="button-create-task"
          >
            <Plus className="h-4 w-4 mr-1" />
            Nova
          </Button>
        </CardTitle>

        {/* Status Filters */}
        <div className="flex flex-wrap gap-2">
          {Object.entries(counts).map(([status, count]) => (
            <Button
              key={status}
              size="sm"
              variant={filter === status ? "default" : "outline"}
              onClick={() => setFilter(status as any)}
              className="text-xs"
              data-testid={`filter-${status}`}
            >
              {status === 'all' ? 'Todas' : statusConfig[status as keyof typeof statusConfig]?.label || status}
              <Badge variant="secondary" className="ml-1 text-xs px-1">
                {count}
              </Badge>
            </Button>
          ))}
        </div>
      </CardHeader>

      <CardContent className="p-0">
        <ScrollArea className="h-96">
          {filteredTasks.length === 0 ? (
            <div className="p-6 text-center text-muted-foreground">
              <Circle className="h-8 w-8 mx-auto mb-2" />
              <p className="text-sm">
                {filter === 'all' ? 'Nenhuma tarefa encontrada' : `Nenhuma tarefa ${statusConfig[filter as keyof typeof statusConfig]?.label.toLowerCase()}`}
              </p>
            </div>
          ) : (
            <div className="p-4 space-y-3">
              {filteredTasks.map((task) => {
                const statusInfo = statusConfig[task.status];
                const StatusIcon = statusInfo.icon;

                return (
                  <Card key={task.id} className="p-3">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-start space-x-2 flex-1">
                        <StatusIcon className={`h-4 w-4 mt-0.5 ${statusInfo.color}`} />
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-sm">{task.title}</h4>
                          <p className="text-xs text-muted-foreground">
                            {task.description}
                          </p>
                          
                          {/* Task Metadata */}
                          <div className="flex flex-wrap gap-2 mt-2">
                            <Badge variant="outline" className="text-xs">
                              {task.agent}
                            </Badge>
                            <Badge variant="secondary" className={`text-xs ${statusInfo.bgColor}`}>
                              {statusInfo.label}
                            </Badge>
                            <span className="text-xs text-muted-foreground">
                              {formatDuration(task.createdAt, task.completedAt)}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Task Actions */}
                      <div className="flex space-x-1">
                        {task.status === 'pending' && (
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleTaskAction(task.id, 'start')}
                            data-testid={`task-start-${task.id}`}
                          >
                            <Play className="h-3 w-3" />
                          </Button>
                        )}
                        
                        {task.status === 'running' && (
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleTaskAction(task.id, 'pause')}
                            data-testid={`task-pause-${task.id}`}
                          >
                            <Pause className="h-3 w-3" />
                          </Button>
                        )}
                        
                        {task.status === 'error' && (
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleTaskAction(task.id, 'retry')}
                            data-testid={`task-retry-${task.id}`}
                          >
                            <RotateCcw className="h-3 w-3" />
                          </Button>
                        )}
                        
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleTaskAction(task.id, 'delete')}
                          data-testid={`task-delete-${task.id}`}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    {task.status === 'running' && (
                      <div className="space-y-1">
                        <div className="flex justify-between text-xs">
                          <span>Progresso</span>
                          <span>{task.progress}%</span>
                        </div>
                        <Progress value={task.progress} className="h-1" />
                      </div>
                    )}

                    {/* Dependencies */}
                    {task.dependencies.length > 0 && (
                      <div className="mt-2">
                        <span className="text-xs text-muted-foreground">Dependências:</span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {task.dependencies.map((dep, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {dep}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </Card>
                );
              })}
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
}