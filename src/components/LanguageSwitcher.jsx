import { Globe } from "lucide-react";
import { LANGS, useI18n } from "../contexts/I18nContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

export default function LanguageSwitcher({ compact = false }) {
  const { lang, setLang } = useI18n();
  const active = LANGS.find((l) => l.code === lang) || LANGS[0];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        data-testid="lang-switcher"
        className={`inline-flex items-center gap-1.5 border border-zinc-300 hover:border-blue-600 hover:text-blue-600 transition-colors px-2.5 h-9 text-xs font-mono tracking-widest ${
          compact ? "" : ""
        }`}
        aria-label="language"
      >
        <Globe className="w-3.5 h-3.5" />
        <span className="hidden sm:inline">{active.flag}</span>
        <span>{active.label.toUpperCase()}</span>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="rounded-none min-w-[140px] border-zinc-200"
      >
        {LANGS.map((l) => (
          <DropdownMenuItem
            key={l.code}
            data-testid={`lang-opt-${l.code}`}
            onClick={() => setLang(l.code)}
            className={`rounded-none cursor-pointer font-mono text-xs tracking-widest ${
              lang === l.code ? "bg-blue-50 text-blue-700" : ""
            }`}
          >
            <span className="mr-2">{l.flag}</span>
            {l.label}
            {lang === l.code && <span className="ml-auto text-blue-600">●</span>}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
