import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Mic, MicOff, Square } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface VoiceTranscriptionProps {
  enabled: boolean;
  onTranscription: (text: string) => void;
}

export function VoiceTranscription({ enabled, onTranscription }: VoiceTranscriptionProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const { toast } = useToast();

  const startRecording = async () => {
    if (!enabled) {
      toast({
        title: "Transcrição Desabilitada",
        description: "Habilite a transcrição de voz nas configurações",
        variant: "destructive",
      });
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      const audioChunks: Blob[] = [];

      mediaRecorder.ondataavailable = (event) => {
        audioChunks.push(event.data);
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
        await processAudio(audioBlob);
        
        // Stop all tracks to release microphone
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);

      toast({
        title: "Gravação Iniciada",
        description: "Fale agora... Clique novamente para parar",
      });
      
    } catch (error) {
      console.error('Error starting recording:', error);
      toast({
        title: "Erro",
        description: "Não foi possível acessar o microfone",
        variant: "destructive",
      });
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      setIsProcessing(true);
    }
  };

  const processAudio = async (audioBlob: Blob) => {
    try {
      // Check if Web Speech API is available
      if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
        // Use Web Speech API for real-time transcription
        const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
        const recognition = new SpeechRecognition();
        
        recognition.lang = 'pt-BR';
        recognition.continuous = false;
        recognition.interimResults = false;

        recognition.onresult = (event: any) => {
          const transcript = event.results[0][0].transcript;
          onTranscription(transcript);
          setIsProcessing(false);
          
          toast({
            title: "Transcrição Concluída",
            description: `"${transcript.substring(0, 50)}${transcript.length > 50 ? '...' : ''}"`,
          });
        };

        recognition.onerror = (event: any) => {
          console.error('Speech recognition error:', event.error);
          setIsProcessing(false);
          toast({
            title: "Erro na Transcrição",
            description: "Não foi possível processar o áudio",
            variant: "destructive",
          });
        };

        // Convert blob to audio URL and play silently for recognition
        const audioUrl = URL.createObjectURL(audioBlob);
        const audio = new Audio(audioUrl);
        
        recognition.start();
        
      } else {
        // Fallback: Show message about manual input
        setIsProcessing(false);
        toast({
          title: "Transcrição Não Disponível",
          description: "Use a digitação manual. Web Speech API não suportada.",
          variant: "destructive",
        });
      }
      
    } catch (error) {
      console.error('Error processing audio:', error);
      setIsProcessing(false);
      toast({
        title: "Erro",
        description: "Falha ao processar áudio gravado",
        variant: "destructive",
      });
    }
  };

  const toggleRecording = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  return (
    <div className="relative">
      <Button
        type="button"
        variant={isRecording ? "destructive" : "outline"}
        size="sm"
        onClick={toggleRecording}
        disabled={isProcessing}
        className="flex items-center space-x-1"
        data-testid="button-voice-transcription"
      >
        {isProcessing ? (
          <Square className="h-4 w-4 animate-pulse" />
        ) : isRecording ? (
          <MicOff className="h-4 w-4 animate-pulse" />
        ) : (
          <Mic className="h-4 w-4" />
        )}
      </Button>

      {/* Status Indicator */}
      {(isRecording || isProcessing) && (
        <div className="absolute -top-8 left-1/2 transform -translate-x-1/2">
          <Badge 
            variant={isRecording ? "destructive" : "secondary"} 
            className="text-xs animate-pulse"
          >
            {isRecording ? "Gravando..." : "Processando..."}
          </Badge>
        </div>
      )}
    </div>
  );
}