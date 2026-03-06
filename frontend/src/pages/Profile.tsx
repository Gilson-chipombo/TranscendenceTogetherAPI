import { useState } from "react";
import { Camera, Save, MapPin, Calendar, User, Globe, Flag, Mail, Phone, Edit3 } from "lucide-react";
import { format } from "date-fns";
import { pt } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

const countries = [
  "Angola", "Brasil", "Cabo Verde", "Guiné-Bissau", "Moçambique", "Portugal", "São Tomé e Príncipe", "Timor-Leste",
];

const statesByCountry: Record<string, string[]> = {
  Angola: ["Bengo", "Benguela", "Bié", "Cabinda", "Cunene", "Huambo", "Huíla", "Kwando Kubango", "Kwanza Norte", "Kwanza Sul", "Luanda", "Lunda Norte", "Lunda Sul", "Malanje", "Moxico", "Namibe", "Uíge", "Zaire"],
  Brasil: ["Acre", "Alagoas", "Amapá", "Amazonas", "Bahia", "Ceará", "Distrito Federal", "Espírito Santo", "Goiás", "Maranhão", "Mato Grosso", "Mato Grosso do Sul", "Minas Gerais", "Pará", "Paraíba", "Paraná", "Pernambuco", "Piauí", "Rio de Janeiro", "Rio Grande do Norte", "Rio Grande do Sul", "Rondônia", "Roraima", "Santa Catarina", "São Paulo", "Sergipe", "Tocantins"],
  Portugal: ["Aveiro", "Beja", "Braga", "Bragança", "Castelo Branco", "Coimbra", "Évora", "Faro", "Guarda", "Leiria", "Lisboa", "Portalegre", "Porto", "Santarém", "Setúbal", "Viana do Castelo", "Vila Real", "Viseu"],
  "Moçambique": ["Cabo Delgado", "Gaza", "Inhambane", "Manica", "Maputo", "Nampula", "Niassa", "Sofala", "Tete", "Zambézia"],
  "Cabo Verde": ["Boa Vista", "Brava", "Fogo", "Maio", "Sal", "Santiago", "Santo Antão", "São Nicolau", "São Vicente"],
  "Guiné-Bissau": ["Bafatá", "Biombo", "Bolama", "Cacheu", "Gabú", "Oio", "Quinara", "Tombali"],
  "São Tomé e Príncipe": ["Água Grande", "Cantagalo", "Caué", "Lembá", "Lobata", "Mé-Zóchi", "Príncipe"],
  "Timor-Leste": ["Aileu", "Ainaro", "Baucau", "Bobonaro", "Cova Lima", "Díli", "Ermera", "Lautém", "Liquiçá", "Manatuto", "Manufahi", "Oecusse", "Viqueque"],
};

const Profile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [firstName, setFirstName] = useState("Luzizila");
  const [lastName, setLastName] = useState("Nzila");
  const [username, setUsername] = useState("lnzila_h");
  const [email, setEmail] = useState("luzizilahelena687@gmail.com");
  const [phone, setPhone] = useState("+244 945 558 212");
  const [bio, setBio] = useState("Apaixonado por cinema e tecnologia. 🎬");
  const [dob, setDob] = useState<Date | undefined>(new Date(1998, 4, 15));
  const [country, setCountry] = useState("Angola");
  const [state, setState] = useState("Luanda");

  const availableStates = statesByCountry[country] || [];

  const handleSave = () => {
    toast.success("Perfil atualizado com sucesso!");
    setIsEditing(false);
  };

  if (!isEditing) {
    return (
      <div className="max-w-2xl mx-auto space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-display font-bold text-foreground">Meu Perfil</h1>
            <p className="text-sm text-muted-foreground mt-1">As suas informações pessoais</p>
          </div>
          <Button onClick={() => setIsEditing(true)} variant="outline" className="gap-2">
            <Edit3 size={16} /> Editar Perfil
          </Button>
        </div>

        {/* Avatar */}
        <div className="flex items-center gap-5">
          <div className="w-24 h-24 rounded-2xl bg-card border-2 border-border flex items-center justify-center overflow-hidden">
            <span className="text-3xl font-display font-bold text-primary">
              {firstName[0]}{lastName[0]}
            </span>
          </div>
          <div>
            <p className="text-lg text-foreground font-medium">{firstName} {lastName}</p>
            <p className="text-sm text-muted-foreground">@{username}</p>
          </div>
        </div>

        {/* Info cards */}
        <div className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <InfoItem icon={<Mail size={14} />} label="Email" value={email} />
            <InfoItem icon={<Phone size={14} />} label="Telefone" value={phone} />
            <InfoItem icon={<Calendar size={14} />} label="Data de Nascimento" value={dob ? format(dob, "dd 'de' MMMM 'de' yyyy", { locale: pt }) : "—"} />
            <InfoItem icon={<Globe size={14} />} label="País" value={country} />
            <InfoItem icon={<Flag size={14} />} label="Província / Estado" value={state || "—"} />
            <InfoItem icon={<User size={14} />} label="Username" value={`@${username}`} />
          </div>
          <div className="pt-3 border-t border-border">
            <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Bio</p>
            <p className="text-sm text-foreground">{bio}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-bold text-foreground">Editar Perfil</h1>
          <p className="text-sm text-muted-foreground mt-1">Atualize as suas informações pessoais</p>
        </div>
        <Button variant="ghost" onClick={() => setIsEditing(false)} className="text-muted-foreground">
          Cancelar
        </Button>
      </div>

      {/* Avatar Section */}
      <div className="flex items-center gap-5">
        <div className="relative">
          <div className="w-24 h-24 rounded-2xl bg-card border-2 border-border flex items-center justify-center overflow-hidden">
            <span className="text-3xl font-display font-bold text-primary">
              {firstName[0]}{lastName[0]}
            </span>
          </div>
          <button className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground hover:bg-primary/90 transition-colors">
            <Camera size={15} />
          </button>
        </div>
        <div>
          <p className="text-foreground font-medium">{firstName} {lastName}</p>
          <p className="text-sm text-muted-foreground">@{username}</p>
          <button className="text-xs text-primary hover:underline mt-1">Alterar foto</button>
        </div>
      </div>

      {/* Form */}
      <div className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="text-sm text-foreground flex items-center gap-2">
              <User size={14} className="text-muted-foreground" /> Primeiro Nome
            </Label>
            <Input value={firstName} onChange={(e) => setFirstName(e.target.value)} className="bg-card border-border text-foreground" />
          </div>
          <div className="space-y-2">
            <Label className="text-sm text-foreground">Último Nome</Label>
            <Input value={lastName} onChange={(e) => setLastName(e.target.value)} className="bg-card border-border text-foreground" />
          </div>
        </div>

        <div className="space-y-2">
          <Label className="text-sm text-foreground flex items-center gap-2">
            <span className="text-muted-foreground">@</span> Nome de Utilizador
          </Label>
          <Input value={username} onChange={(e) => setUsername(e.target.value)} className="bg-card border-border text-foreground" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="text-sm text-foreground flex items-center gap-2">
              <Mail size={14} className="text-muted-foreground" /> Email
            </Label>
            <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="bg-card border-border text-foreground" />
          </div>
          <div className="space-y-2">
            <Label className="text-sm text-foreground flex items-center gap-2">
              <Phone size={14} className="text-muted-foreground" /> Telefone
            </Label>
            <Input value={phone} onChange={(e) => setPhone(e.target.value)} className="bg-card border-border text-foreground" />
          </div>
        </div>

        <div className="space-y-2">
          <Label className="text-sm text-foreground flex items-center gap-2">
            <Calendar size={14} className="text-muted-foreground" /> Data de Nascimento
          </Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className={cn("w-full justify-start text-left font-normal bg-card border-border", !dob && "text-muted-foreground")}>
                <Calendar size={14} className="mr-2" />
                {dob ? format(dob, "dd 'de' MMMM 'de' yyyy", { locale: pt }) : "Selecionar data"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <CalendarComponent mode="single" selected={dob} onSelect={setDob} disabled={(date) => date > new Date() || date < new Date("1900-01-01")} initialFocus className={cn("p-3 pointer-events-auto")} captionLayout="dropdown-buttons" fromYear={1950} toYear={2010} />
            </PopoverContent>
          </Popover>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="text-sm text-foreground flex items-center gap-2">
              <Globe size={14} className="text-muted-foreground" /> País
            </Label>
            <Select value={country} onValueChange={(val) => { setCountry(val); setState(""); }}>
              <SelectTrigger className="bg-card border-border text-foreground"><SelectValue placeholder="Selecionar país" /></SelectTrigger>
              <SelectContent>{countries.map((c) => (<SelectItem key={c} value={c}>{c}</SelectItem>))}</SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label className="text-sm text-foreground flex items-center gap-2">
              <Flag size={14} className="text-muted-foreground" /> Província / Estado
            </Label>
            <Select value={state} onValueChange={setState}>
              <SelectTrigger className="bg-card border-border text-foreground"><SelectValue placeholder="Selecionar" /></SelectTrigger>
              <SelectContent>{availableStates.map((s) => (<SelectItem key={s} value={s}>{s}</SelectItem>))}</SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <Label className="text-sm text-foreground">Bio</Label>
          <Textarea value={bio} onChange={(e) => setBio(e.target.value)} className="bg-card border-border text-foreground resize-none h-20" placeholder="Fale um pouco sobre si..." />
        </div>

        <div className="flex justify-end pt-2">
          <Button onClick={handleSave} className="bg-primary text-primary-foreground hover:bg-primary/90 gap-2">
            <Save size={16} /> Guardar Alterações
          </Button>
        </div>
      </div>
    </div>
  );
};

const InfoItem = ({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) => (
  <div>
    <p className="text-xs text-muted-foreground uppercase tracking-wider flex items-center gap-1.5 mb-1">
      {icon} {label}
    </p>
    <p className="text-sm text-foreground">{value}</p>
  </div>
);

export default Profile;
