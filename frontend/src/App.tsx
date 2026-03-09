import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import AppLayout from "./components/AppLayout";
import NotFound from "./pages/NotFound";
import LandingPage from "./pages/NotFound";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import Profile from "./pages/Profile";
import Friends from "./pages/Friends";
import FriendProfile from "./pages/FriendProfile";
import Messages from "./pages/Messages";
import Settings from "./pages/Settings";
import MyRooms from "./pages/MyRooms";
import Room from  "./pages/Room";


const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter
      future={{
      v7_startTransition: true,
      v7_relativeSplatPath: true,
    }}
  >
  <Routes>
    <Route path="/" element={<LandingPage />} />
    <Route path="/login" element={<Login />} />
    <Route path="/create-account" element={<SignUp />} />
    <Route path="/home" element={<Home />} />
    <Route path="/friends" element={<Friends />} />
    <Route path="/profile/" element={<AppLayout><Profile /></AppLayout>} />
    <Route path="/profile" element={<Profile />} />
    <Route path="/messages" element={<Messages />} />
    <Route path="/myrooms" element={<MyRooms />} />
    <Route path="/settings" element={<Settings />} />
    <Route path="/room/:id" element={<Room />} />
    <Route path="/friendsProfile" element={<AppLayout><Friends /></AppLayout>} />
          <Route path="/friendsProfile/:username" element={<AppLayout><FriendProfile /></AppLayout>} />
          <Route path="/friensProfile" element={<AppLayout><Friends /></AppLayout>} />
          <Route path="/friensProfile/:username" element={<AppLayout><FriendProfile /></AppLayout>} />
    <Route path="*" element={<NotFound />} />
  </Routes>
</BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
