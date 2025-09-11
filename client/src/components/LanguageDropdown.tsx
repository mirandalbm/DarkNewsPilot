import { useTranslation } from 'react-i18next';
import { supportedLanguages } from '@/i18n';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
} from '@/components/ui/dropdown-menu';
import { Globe } from 'lucide-react';

export function LanguageDropdown() {
  const { i18n } = useTranslation();

  const handleLanguageChange = (language: string) => {
    i18n.changeLanguage(language);
    // Ensure persistence in localStorage
    localStorage.setItem('darknews-language', language);
  };

  const currentLanguage = supportedLanguages.find(
    lang => lang.code === i18n.language
  ) || supportedLanguages[0];

  return (
    <DropdownMenuSub>
      <DropdownMenuSubTrigger data-testid="submenu-idioma">
        <Globe className="mr-2 h-4 w-4" />
        <span>Idioma</span>
        <span className="ml-auto text-xs">{currentLanguage.flag}</span>
      </DropdownMenuSubTrigger>
      <DropdownMenuSubContent>
        <DropdownMenuLabel>Selecionar Idioma</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {supportedLanguages.map((language) => (
          <DropdownMenuItem 
            key={language.code} 
            onClick={() => handleLanguageChange(language.code)}
            className={i18n.language === language.code ? "bg-accent" : ""}
            data-testid={`language-option-${language.code}`}
          >
            <div className="flex items-center gap-2 w-full">
              <span className="text-lg">{language.flag}</span>
              <span className="flex-1">{language.name}</span>
              {i18n.language === language.code && (
                <span className="text-xs text-primary">✓</span>
              )}
            </div>
          </DropdownMenuItem>
        ))}
      </DropdownMenuSubContent>
    </DropdownMenuSub>
  );
}