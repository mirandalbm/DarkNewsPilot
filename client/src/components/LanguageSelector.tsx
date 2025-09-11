import { useTranslation } from 'react-i18next';
import { supportedLanguages } from '@/i18n';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Globe } from 'lucide-react';

export function LanguageSelector() {
  const { i18n } = useTranslation();

  const handleLanguageChange = (language: string) => {
    i18n.changeLanguage(language);
  };

  const currentLanguage = supportedLanguages.find(
    lang => lang.code === i18n.language
  ) || supportedLanguages[0];

  return (
    <Select value={i18n.language} onValueChange={handleLanguageChange}>
      <SelectTrigger className="w-[200px] bg-gray-900 border-gray-700 text-white" data-testid="select-language">
        <div className="flex items-center gap-2">
          <Globe className="h-4 w-4" />
          <span className="text-lg mr-1">{currentLanguage.flag}</span>
          <SelectValue />
        </div>
      </SelectTrigger>
      <SelectContent className="bg-gray-900 border-gray-700">
        {supportedLanguages.map((language) => (
          <SelectItem 
            key={language.code} 
            value={language.code} 
            className="text-white hover:bg-gray-800 focus:bg-gray-800"
            data-testid={`language-option-${language.code}`}
          >
            <div className="flex items-center gap-2">
              <span className="text-lg">{language.flag}</span>
              <span>{language.name}</span>
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}