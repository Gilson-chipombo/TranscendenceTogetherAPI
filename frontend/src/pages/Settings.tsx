import { useState } from "react";
import { Moon, Sun, Palette, Bell, Lock, Globe, Monitor, Eye, Volume2, Shield, ChevronRight, Check } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface ThemePreset {
  id: string;
  name: string;
  colors: {
    background: string;
    card: string;
    primary: string;
    accent: string;
    foreground: string;
  };
}

const themePresets: ThemePreset[] = [
  {
    id: "default",
    name: "CINEFLIX Clássico",
    colors: { background: "#131418", card: "#1F2229", primary: "#F9A82F", accent: "#33CC33", foreground: "#E9F1F2" },
  },
  {
    id: "ocean",
    name: "Oceano Profundo",
    colors: { background: "#0A1628", card: "#132240", primary: "#3B82F6", accent: "#06B6D4", foreground: "#E2E8F0" },
  },
  {
    id: "cherry",
    name: "Cereja Noturna",
    colors: { background: "#1A0A14", card: "#2D1525", primary: "#F43F5E", accent: "#FB923C", foreground: "#FDE8EF" },
  },
];

const customColorOptions = [
  { label: "Laranja", value: "#F9A82F" },
  { label: "Azul", value: "#3B82F6" },
  { label: "Vermelho", value: "#EF4444" },
  { label: "Verde", value: "#22C55E" },
  { label: "Roxo", value: "#A855F7" },
  { label: "Rosa", value: "#EC4899" },
  { label: "Ciano", value: "#06B6D4" },
  { label: "Âmbar", value: "#F59E0B" },
];

const Settings = () => {
  const [activeTheme, setActiveTheme] = useState("default");
  const [customPrimary, setCustomPrimary] = useState("#F9A82F");
  const [notifications, setNotifications] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [privateProfile, setPrivateProfile] = useState(false);
  const [onlineStatus, setOnlineStatus] = useState(true);
  const [language, setLanguage] = useState("pt");
  const [autoplay, setAutoplay] = useState(true);

  const applyTheme = (themeId: string) => {
    setActiveTheme(themeId);
    const theme = themePresets.find(t => t.id === themeId);
    if (theme) {
      applyColorsToRoot(theme.colors);
      toast.success(`Tema "${theme.name}" aplicado!`);
    }
  };

  const applyCustomColor = (color: string) => {
    setCustomPrimary(color);
    setActiveTheme("custom");
    // Apply just the primary color change
    document.documentElement.style.setProperty("--primary", hexToHsl(color));
    toast.success("Cor primária personalizada aplicada!");
  };

  const applyColorsToRoot = (colors: ThemePreset["colors"]) => {
    document.documentElement.style.setProperty("--background", hexToHsl(colors.background));
    document.documentElement.style.setProperty("--card", hexToHsl(colors.card));
    document.documentElement.style.setProperty("--popover", hexToHsl(colors.card));
    document.documentElement.style.setProperty("--primary", hexToHsl(colors.primary));
    document.documentElement.style.setProperty("--accent", hexToHsl(colors.accent));
    document.documentElement.style.setProperty("--foreground", hexToHsl(colors.foreground));
    document.documentElement.style.setProperty("--card-foreground", hexToHsl(colors.foreground));
    document.documentElement.style.setProperty("--popover-foreground", hexToHsl(colors.foreground));
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-display font-bold text-foreground">Configurações</h1>
        <p className="text-sm text-muted-foreground mt-1">Personalize a sua experiência</p>
      </div>

      {/* Theme Section */}
      <SettingsSection icon={<Palette size={18} />} title="Aparência & Temas">
        <p className="text-xs text-muted-foreground mb-4">Escolha um tema predefinido ou personalize as cores</p>

        {/* Preset Themes */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-5">
          {themePresets.map((theme) => (
            <button
              key={theme.id}
              onClick={() => applyTheme(theme.id)}
              className={`relative p-3 rounded-lg border transition-all text-left ${activeTheme === theme.id
                ? "border-primary bg-primary/5"
                : "border-border hover:border-muted-foreground/30"
                }`}
            >
              {activeTheme === theme.id && (
                <span className="absolute top-2 right-2 w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                  <Check size={12} className="text-primary-foreground" />
                </span>
              )}
              <div className="flex gap-1 mb-2">
                {Object.values(theme.colors).slice(0, 4).map((c, i) => (
                  <div key={i} className="w-5 h-5 rounded-full border border-border" style={{ backgroundColor: c }} />
                ))}
              </div>
              <p className="text-xs font-medium text-foreground">{theme.name}</p>
            </button>
          ))}
        </div>

        {/* Custom Color */}
        <div>
          <p className="text-xs text-muted-foreground mb-3">Ou escolha uma cor primária personalizada:</p>
          <div className="flex flex-wrap gap-2">
            {customColorOptions.map((color) => (
              <button
                key={color.value}
                onClick={() => applyCustomColor(color.value)}
                className={`w-9 h-9 rounded-lg border-2 transition-all hover:scale-110 ${activeTheme === "custom" && customPrimary === color.value
                  ? "border-foreground scale-110"
                  : "border-transparent"
                  }`}
                style={{ backgroundColor: color.value }}
                title={color.label}
              />
            ))}
          </div>
        </div>
      </SettingsSection>

      {/* Notifications */}
      <SettingsSection icon={<Bell size={18} />} title="Notificações">
        <SettingsToggle label="Notificações push" description="Receber notificações de actividades" checked={notifications} onCheckedChange={setNotifications} />
        <SettingsToggle label="Sons" description="Reproduzir sons ao receber notificações" checked={soundEnabled} onCheckedChange={setSoundEnabled} />
      </SettingsSection>

      {/* Privacy */}
      <SettingsSection icon={<Shield size={18} />} title="Privacidade & Segurança">
        <SettingsToggle label="Perfil privado" description="Apenas amigos podem ver o seu perfil" checked={privateProfile} onCheckedChange={setPrivateProfile} />
        <SettingsToggle label="Mostrar status online" description="Os outros podem ver quando está online" checked={onlineStatus} onCheckedChange={setOnlineStatus} />
      </SettingsSection>

      {/* Playback */}
      <SettingsSection icon={<Monitor size={18} />} title="Reprodução">
        <SettingsToggle label="Reprodução automática" description="Reproduzir o próximo conteúdo automaticamente" checked={autoplay} onCheckedChange={setAutoplay} />
      </SettingsSection>

      {/* Language */}
      <SettingsSection icon={<Globe size={18} />} title="Idioma">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-foreground">Idioma da interface</p>
            <p className="text-xs text-muted-foreground">Selecione o idioma preferido</p>
          </div>
          <Select value={language} onValueChange={setLanguage}>
            <SelectTrigger className="w-40 bg-card border-border">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="pt">Português</SelectItem>
              <SelectItem value="en">English</SelectItem>
              <SelectItem value="fr">Français</SelectItem>
              <SelectItem value="es">Español</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </SettingsSection>

      {/* Danger zone */}
      <div className="bg-card rounded-xl border border-destructive/30 p-5 space-y-3">
        <h3 className="text-sm font-medium text-destructive flex items-center gap-2">
          <Lock size={16} /> Zona de Perigo
        </h3>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-foreground">Eliminar conta</p>
            <p className="text-xs text-muted-foreground">Esta ação é irreversível</p>
          </div>
          <Button variant="destructive" size="sm" onClick={() => toast.error("Esta funcionalidade será implementada em breve.")}>
            Eliminar
          </Button>
        </div>
      </div>
    </div>
  );
};

const SettingsSection = ({ icon, title, children }: { icon: React.ReactNode; title: string; children: React.ReactNode }) => (
  <div className="bg-card rounded-xl border border-border p-5 space-y-4">
    <h3 className="text-sm font-medium text-foreground flex items-center gap-2">
      {icon} {title}
    </h3>
    {children}
  </div>
);

const SettingsToggle = ({ label, description, checked, onCheckedChange }: { label: string; description: string; checked: boolean; onCheckedChange: (v: boolean) => void }) => (
  <div className="flex items-center justify-between py-1">
    <div>
      <p className="text-sm text-foreground">{label}</p>
      <p className="text-xs text-muted-foreground">{description}</p>
    </div>
    <Switch checked={checked} onCheckedChange={onCheckedChange} />
  </div>
);

// Utility: hex to HSL string (without hsl() wrapper, just "H S% L%")
function hexToHsl(hex: string): string {
  let r = 0, g = 0, b = 0;
  hex = hex.replace("#", "");
  r = parseInt(hex.substring(0, 2), 16) / 255;
  g = parseInt(hex.substring(2, 4), 16) / 255;
  b = parseInt(hex.substring(4, 6), 16) / 255;

  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h = 0, s = 0, l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
      case g: h = ((b - r) / d + 2) / 6; break;
      case b: h = ((r - g) / d + 4) / 6; break;
    }
  }

  return `${Math.round(h * 360)} ${Math.round(s * 100)}% ${Math.round(l * 100)}%`;
}

export default Settings;
