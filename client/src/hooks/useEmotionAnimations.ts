import { useState, useEffect } from 'react';

// Tipos para o sistema de animações emocionais
export interface Emotion {
  type: 'fear' | 'anger' | 'sadness' | 'joy' | 'surprise' | 'disgust' | 'mystery';
  intensity: number;
  confidence: number;
}

export interface AnimationConfig {
  enabled: boolean;
  intensity: number;
  speed: number;
  autoAdapt: boolean;
  sensitivities: {
    fear: number;
    anger: number;
    sadness: number;
    joy: number;
    surprise: number;
    disgust: number;
    mystery: number;
  };
}

const DEFAULT_CONFIG: AnimationConfig = {
  enabled: true,
  intensity: 75,
  speed: 1.5,
  autoAdapt: true,
  sensitivities: {
    fear: 80,
    anger: 70,
    sadness: 60,
    joy: 65,
    surprise: 75,
    disgust: 55,
    mystery: 85
  }
};

// Hook principal para animações emocionais
export function useEmotionAnimations() {
  const [config, setConfig] = useState<AnimationConfig>(DEFAULT_CONFIG);
  const [activeAnimations, setActiveAnimations] = useState<Map<string, Emotion>>(new Map());

  // Simula análise emocional de texto
  const analyzeEmotion = async (text: string): Promise<Emotion[]> => {
    // Em produção, isso seria uma chamada para OpenAI ou outro serviço de IA
    const emotions: Emotion[] = [
      { type: 'mystery', intensity: 85, confidence: 92 },
      { type: 'fear', intensity: 72, confidence: 88 },
      { type: 'surprise', intensity: 68, confidence: 75 },
      { type: 'anger', intensity: 45, confidence: 65 },
      { type: 'sadness', intensity: 38, confidence: 60 },
      { type: 'joy', intensity: 22, confidence: 45 },
      { type: 'disgust', intensity: 18, confidence: 40 }
    ];

    // Simula análise baseada no conteúdo
    const keywords = text.toLowerCase();
    if (keywords.includes('mistério') || keywords.includes('enigma')) {
      emotions[0].intensity += 10;
    }
    if (keywords.includes('terror') || keywords.includes('medo')) {
      emotions[1].intensity += 15;
    }
    if (keywords.includes('surpresa') || keywords.includes('choque')) {
      emotions[2].intensity += 12;
    }

    return emotions.sort((a, b) => b.intensity - a.intensity);
  };

  // Obtém o estilo CSS para animação baseado na emoção
  const getAnimationStyle = (emotion: Emotion): React.CSSProperties => {
    if (!config.enabled) return {};

    const adjustedIntensity = (emotion.intensity * config.intensity) / 100;
    const adjustedSpeed = config.speed;

    const baseStyles: React.CSSProperties = {};

    switch (emotion.type) {
      case 'mystery':
        return {
          ...baseStyles,
          animation: `pulse ${2 - adjustedSpeed/3}s ease-in-out infinite`,
          filter: `hue-rotate(${adjustedIntensity * 2}deg)`,
        };
      case 'fear':
        return {
          ...baseStyles,
          animation: `bounce ${1.5 - adjustedSpeed/4}s ease-in-out infinite`,
          transform: `scale(${1 + adjustedIntensity/200})`,
        };
      case 'surprise':
        return {
          ...baseStyles,
          animation: `ping ${1 - adjustedSpeed/5}s cubic-bezier(0, 0, 0.2, 1) infinite`,
        };
      case 'anger':
        return {
          ...baseStyles,
          animation: `bounce ${1.2 - adjustedSpeed/6}s ease-in-out infinite`,
          filter: `saturate(${1 + adjustedIntensity/100})`,
        };
      case 'sadness':
        return {
          ...baseStyles,
          animation: `pulse ${3 - adjustedSpeed/2}s ease-in-out infinite`,
          opacity: 1 - adjustedIntensity/300,
        };
      case 'joy':
        return {
          ...baseStyles,
          animation: `spin ${2 - adjustedSpeed/3}s linear infinite`,
          filter: `brightness(${1 + adjustedIntensity/150})`,
        };
      case 'disgust':
        return {
          ...baseStyles,
          animation: `bounce ${1.8 - adjustedSpeed/4}s ease-in-out infinite`,
          filter: `contrast(${1 + adjustedIntensity/200})`,
        };
      default:
        return baseStyles;
    }
  };

  // Obtém a classe CSS para animação baseada na emoção
  const getAnimationClass = (emotion: Emotion): string => {
    if (!config.enabled) return '';

    const intensity = emotion.intensity;
    const baseClass = 'transition-all duration-300';

    switch (emotion.type) {
      case 'mystery':
        return `${baseClass} animate-pulse`;
      case 'fear':
        return `${baseClass} animate-bounce`;
      case 'surprise':
        return `${baseClass} animate-ping`;
      case 'anger':
        return `${baseClass} animate-bounce`;
      case 'sadness':
        return `${baseClass} animate-pulse`;
      case 'joy':
        return `${baseClass} animate-spin`;
      case 'disgust':
        return `${baseClass} animate-bounce`;
      default:
        return baseClass;
    }
  };

  // Registra uma animação ativa
  const registerAnimation = (id: string, emotion: Emotion) => {
    setActiveAnimations(prev => new Map(prev.set(id, emotion)));
  };

  // Remove uma animação ativa
  const unregisterAnimation = (id: string) => {
    setActiveAnimations(prev => {
      const newMap = new Map(prev);
      newMap.delete(id);
      return newMap;
    });
  };

  // Atualiza configurações
  const updateConfig = (newConfig: Partial<AnimationConfig>) => {
    setConfig(prev => ({ ...prev, ...newConfig }));
  };

  // Estatísticas das animações
  const getStats = () => {
    const emotions = Array.from(activeAnimations.values());
    const emotionCounts = emotions.reduce((acc, emotion) => {
      acc[emotion.type] = (acc[emotion.type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const dominantEmotion = emotions.length > 0 
      ? emotions.reduce((prev, current) => 
          current.intensity > prev.intensity ? current : prev
        )
      : null;

    return {
      totalAnimations: activeAnimations.size,
      emotionCounts,
      dominantEmotion,
      averageIntensity: emotions.length > 0 
        ? emotions.reduce((sum, e) => sum + e.intensity, 0) / emotions.length 
        : 0
    };
  };

  return {
    config,
    activeAnimations,
    analyzeEmotion,
    getAnimationStyle,
    getAnimationClass,
    registerAnimation,
    unregisterAnimation,
    updateConfig,
    getStats
  };
}

// Hook para animação automática de componentes
export function useEmotionIcon(text: string, defaultEmotion: Emotion['type'] = 'mystery') {
  const { analyzeEmotion, getAnimationClass, getAnimationStyle, registerAnimation, unregisterAnimation } = useEmotionAnimations();
  const [emotion, setEmotion] = useState<Emotion>({ type: defaultEmotion, intensity: 50, confidence: 75 });
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  useEffect(() => {
    if (text && text.length > 10) {
      setIsAnalyzing(true);
      analyzeEmotion(text).then(emotions => {
        if (emotions.length > 0) {
          setEmotion(emotions[0]);
          registerAnimation(`auto-${Date.now()}`, emotions[0]);
        }
        setIsAnalyzing(false);
      });
    }

    return () => {
      unregisterAnimation(`auto-${Date.now()}`);
    };
  }, [text]);

  return {
    emotion,
    animationClass: getAnimationClass(emotion),
    animationStyle: getAnimationStyle(emotion),
    isAnalyzing
  };
}

export default useEmotionAnimations;