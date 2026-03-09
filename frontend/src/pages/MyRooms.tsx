import Header from "@/components/Header";
import { Users, Clock, Play } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";


interface Room {
  id: string;
  name: string;
  movieTitle: string;
  movieDescription: string;
  movieImage: string;
  viewers: number;
  schedule: string;
  isLive: boolean;
}

const rooms: Room[] = [
  {
    id: "1",
    name: "Sala Épica",
    movieTitle: "O Rei Leão",
    movieDescription: "Simba, um jovem leão, foge do seu reino após a morte do pai e descobre o verdadeiro significado da responsabilidade e coragem.",
    movieImage: "https://image.tmdb.org/t/p/w300/sKCr78MXSLixwmZ8DyJLrpMsd15.jpg",
    viewers: 1243,
    schedule: "20:00 - 22:00",
    isLive: true,
  },
  {
    id: "2",
    name: "Sala Marvel",
    movieTitle: "Vingadores: Endgame",
    movieDescription: "Os heróis restantes tentam reverter as ações de Thanos e restaurar o equilíbrio do universo.",
    movieImage: "https://image.tmdb.org/t/p/w300/or06FN3Dka5tukK1e9sl16pB3iy.jpg",
    viewers: 892,
    schedule: "21:00 - 00:00",
    isLive: true,
  },
  {
    id: "3",
    name: "Sala Clássicos",
    movieTitle: "Titanic",
    movieDescription: "Uma história de amor entre Jack e Rose a bordo do navio mais famoso da história.",
    movieImage: "https://image.tmdb.org/t/p/w300/9xjZS2rlVxm8SFx8kPC3aIGCOYQ.jpg",
    viewers: 567,
    schedule: "19:30 - 22:45",
    isLive: false,
  },
  {
    id: "4",
    name: "Sala Terror",
    movieTitle: "O Exorcista: O Devoto",
    movieDescription: "Uma sequela arrepiante que traz de volta o terror sobrenatural que marcou gerações.",
    movieImage: "https://image.tmdb.org/t/p/w300/qVKirUdmoex8SyblzSMiolXjlAW.jpg",
    viewers: 345,
    schedule: "23:00 - 01:00",
    isLive: false,
  },
  {
    id: "5",
    name: "Sala Animação",
    movieTitle: "Encanto",
    movieDescription: "Uma jovem colombiana descobre que é a única da família sem poderes mágicos e embarca numa aventura para salvar a magia.",
    movieImage: "https://image.tmdb.org/t/p/w300/4j0PNHkMr5ax3IA8tjtxcmPU3QT.jpg",
    viewers: 721,
    schedule: "18:00 - 20:00",
    isLive: true,
  },
  {
    id: "6",
    name: "Sala Drama",
    movieTitle: "Pantera Negra: Wakanda Para Sempre",
    movieDescription: "O povo de Wakanda luta para proteger a sua nação após a perda do Rei T'Challa.",
    movieImage: "https://image.tmdb.org/t/p/w300/sv1xJUazXeYqALzczSZ3O6nkH75.jpg",
    viewers: 456,
    schedule: "20:30 - 23:00",
    isLive: false,
  },
];

const MyRooms = () => {
  const navigate = useNavigate();
  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />

      <div className="flex-1 flex flex-col min-h-screen">
        <Header name="Rooms" />
    <div className=" ms-6 mt-6 space-y-6">
      <div>
        <h1 className="text-2xl font-display font-bold text-foreground">My Rooms</h1>
        <p className="text-sm text-muted-foreground mt-1">Salas disponíveis para assistir em conjunto</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {rooms.map((room) => (
          <div
            key={room.id}
            className="bg-card border border-border rounded-xl overflow-hidden hover:border-primary/40 transition-colors cursor-pointer group"
          >
            {/* Movie Image */}
            <div className="relative h-44 overflow-hidden">
              <img
                src={room.movieImage}
                alt={room.movieTitle}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent" />
              {room.isLive && (
                <span className="absolute top-3 left-3 px-2 py-0.5 rounded bg-destructive text-destructive-foreground text-xs font-bold uppercase flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-destructive-foreground animate-pulse" />
                  LIVE
                </span>
              )}
              <div className="absolute bottom-3 left-3 right-3">
                <p className="text-xs text-primary font-medium">{room.name}</p>
                <h3 className="text-foreground font-display font-bold text-sm mt-0.5 line-clamp-1">{room.movieTitle}</h3>
              </div>
            </div>

            {/* Info */}
            <div className="p-4 space-y-3">
              <p className="text-xs text-muted-foreground line-clamp-2">{room.movieDescription}</p>

              <div className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-1.5 text-muted-foreground">
                  <Users size={13} />
                  <span className="text-foreground font-medium">{room.viewers.toLocaleString()}</span> a assistir
                </span>
                <span className="flex items-center gap-1.5 text-muted-foreground">
                  <Clock size={13} />
                  {room.schedule}
                </span>
              </div>

              <button
                onClick={() => navigate(`/room/${room.id}`)}
                className="w-full flex items-center justify-center gap-2 py-2 rounded-lg bg-primary/10 text-primary text-sm font-medium hover:bg-primary/20 transition-colors"
                >
                <Play size={14} /> Entrar na Sala
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
      </div>
    </div>
  );
};

export default MyRooms;
