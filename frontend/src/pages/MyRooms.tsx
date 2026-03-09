import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import { Users, Clock, Play, ImageIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface Room {
  id: string;
  name: string;
  movieTitle: string;
  movieDescription: string;
  movieImage?: string;
  viewers: number;
  schedule: string;
  isLive: boolean;
  type: "public" | "my" | "joined";
}

const rooms: Room[] = [
  {
    id: "1",
    name: "Sala Épica",
    movieTitle: "O Rei Leão",
    movieDescription: "Simba descobre o verdadeiro significado da coragem.",
    movieImage: "https://image.tmdb.org/t/p/w300/sKCr78MXSLixwmZ8DyJLrpMsd15.jpg",
    viewers: 1243,
    schedule: "20:00 - 22:00",
    isLive: true,
    type: "public",
  },
  {
    id: "2",
    name: "Sala Marvel",
    movieTitle: "Vingadores: Endgame",
    movieDescription: "Os heróis tentam reverter as ações de Thanos.",
    movieImage: "https://image.tmdb.org/t/p/w300/or06FN3Dka5tukK1e9sl16pB3iy.jpg",
    viewers: 892,
    schedule: "21:00 - 00:00",
    isLive: true,
    type: "public",
  },
  {
    id: "3",
    name: "Sala Clássicos",
    movieTitle: "Titanic",
    movieDescription: "Uma história de amor no navio mais famoso.",
    movieImage: "https://image.tmdb.org/t/p/w300/9xjZS2rlVxm8SFx8kPC3aIGCOYQ.jpg",
    viewers: 567,
    schedule: "19:30 - 22:45",
    isLive: false,
    type: "public",
  },
  {
    id: "4",
    name: "Sala Terror",
    movieTitle: "O Exorcista",
    movieDescription: "Um dos filmes de terror mais famosos da história.",
    movieImage: "",
    viewers: 345,
    schedule: "23:00 - 01:00",
    isLive: false,
    type: "public",
  },
  {
    id: "5",
    name: "Sala Animação",
    movieTitle: "Encanto",
    movieDescription: "Uma jovem descobre o segredo da magia da sua família.",
    movieImage: "https://image.tmdb.org/t/p/w300/4j0PNHkMr5ax3IA8tjtxcmPU3QT.jpg",
    viewers: 721,
    schedule: "18:00 - 20:00",
    isLive: true,
    type: "public",
  },

  {
    id: "6",
    name: "Minha Sala Marvel",
    movieTitle: "Pantera Negra",
    movieDescription: "O povo de Wakanda protege o seu reino.",
    movieImage: "https://image.tmdb.org/t/p/w300/sv1xJUazXeYqALzczSZ3O6nkH75.jpg",
    viewers: 456,
    schedule: "20:30 - 23:00",
    isLive: false,
    type: "my",
  },
  {
    id: "7",
    name: "Minha Sala Pixar",
    movieTitle: "Toy Story",
    movieDescription: "A aventura dos brinquedos mais famosos do cinema.",
    movieImage: "",
    viewers: 210,
    schedule: "16:00 - 18:00",
    isLive: false,
    type: "my",
  },

  {
    id: "8",
    name: "Sala do João",
    movieTitle: "Avatar",
    movieDescription: "Uma aventura épica no planeta Pandora.",
    movieImage: "https://image.tmdb.org/t/p/w300/jRXYjXNq0Cs2TcJjLkki24MLp7u.jpg",
    viewers: 998,
    schedule: "21:30 - 00:00",
    isLive: true,
    type: "joined",
  },
  {
    id: "9",
    name: "Sala da Maria",
    movieTitle: "Harry Potter",
    movieDescription: "O jovem bruxo enfrenta Voldemort.",
    movieImage: "",
    viewers: 603,
    schedule: "19:00 - 22:00",
    isLive: false,
    type: "joined",
  },
];

const MyRooms = () => {
  const navigate = useNavigate();

  const publicRooms = rooms.filter((r) => r.type === "public");
  const myRooms = rooms.filter((r) => r.type === "my");
  const joinedRooms = rooms.filter((r) => r.type === "joined");

  const renderRooms = (roomsList: Room[]) => (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
      {roomsList.map((room) => (
        <div
          key={room.id}
          className="bg-card border border-border rounded-xl overflow-hidden hover:border-primary/40 transition-colors cursor-pointer group"
        >
          {/* Movie Image */}
          <div className="relative h-44 overflow-hidden">
            {room.movieImage ? (
              <img
                src={room.movieImage}
                alt={room.movieTitle}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            ) : (
              <div className="flex items-center justify-center w-full h-full bg-muted">
                <ImageIcon size={40} className="text-muted-foreground" />
              </div>
            )}

            <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent" />

            {room.isLive && (
              <span className="absolute top-3 left-3 px-2 py-0.5 rounded bg-destructive text-xs text-white flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                LIVE
              </span>
            )}

            <div className="absolute bottom-3 left-3 right-3">
              <p className="text-xs text-primary font-medium">{room.name}</p>
              <h3 className="text-foreground font-bold text-sm line-clamp-1">
                {room.movieTitle}
              </h3>
            </div>
          </div>

          {/* Info */}
          <div className="p-4 space-y-3">
            <p className="text-xs text-muted-foreground line-clamp-2">
              {room.movieDescription}
            </p>

            <div className="flex items-center justify-between text-xs">
              <span className="flex items-center gap-1 text-muted-foreground">
                <Users size={13} />
                <span className="text-foreground font-medium">
                  {room.viewers.toLocaleString()}
                </span>
              </span>

              <span className="flex items-center gap-1 text-muted-foreground">
                <Clock size={13} />
                {room.schedule}
              </span>
            </div>

            <button
              onClick={() => navigate(`/room/${room.id}`)}
              className="w-full flex items-center justify-center gap-2 py-2 rounded-lg bg-primary/10 text-primary text-sm font-medium hover:bg-primary/20"
            >
              <Play size={14} /> Entrar na Sala
            </button>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />

      <div className="flex-1 flex flex-col min-h-screen">
        <Header name="Rooms" />

        <div className="ms-6 mt-6 space-y-10">
          <div>
            <h2 className="text-2xl font-bold text-foreground">Salas disponíveis para assistir em conjunto</h2>
          </div>

          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-semibold mb-4">Salas Públicas</h2>
              {renderRooms(publicRooms)}
            </div>

            <div>
              <h2 className="text-lg font-semibold mb-4">Minhas Salas</h2>
              {renderRooms(myRooms)}
            </div>

            <div>
              <h2 className="text-lg font-semibold mb-4">Salas que Entrei</h2>
              {renderRooms(joinedRooms)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyRooms;