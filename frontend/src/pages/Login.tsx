import { useState, FormEvent } from "react";
import loginImage from "@/assets/login.png";
import { Input } from "@/components/ui/input";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("")
    const navigate = useNavigate();

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      const formData = new FormData(e.currentTarget);
      const email = formData.get('email')?.toString() ?? '';
      const password = formData.get('password')?.toString() ?? '';
      if (email == "admin@42.com" && password == "1234")
        navigate('/home');
      else
        navigate('/');
    }
    
    return (
    <div className="flex flex-col lg:flex-row min-h-screen">
      {/* Left Side - Carousel */}
      <div className="relative w-full h-56 sm:h-72 md:h-80 lg:h-auto lg:w-1/2 bg-carousel-bg flex items-center justify-center">
        <div
          role="img"
          aria-label="Login Together"
          className="slicer"
          style={{ backgroundImage: `url(${loginImage})` }}
        />
        {/* Carousel arrows */}
        {/* Dots */}
      </div>

      {/* Right Side - Login Form */}
      <div className="w-full lg:w-1/2 bg-login-bg flex flex-1 items-center justify-center p-6 lg:p-12">
        <div className="w-full max-w-md rounded-3xl shadow-lg p-8 lg:p-10" style={{ backgroundColor: '#3E4754' }}>
          {/* Header */}
          <div className="flex items-start justify-between mb-2">
            <div>
              <p className="text-foreground text-lg">
                Benvindo a <span className="text-brand font-bold">Together</span>
              </p>
            </div>
            <div className="text-right text-sm">
              <span className="text-muted-foreground">Não tem uma conta ?</span>
              <br />
              <a href="/create-account" className="text-brand font-medium hover:underline">
                Criar conta
              </a>
            </div>
          </div>

          <h1 className="text-4xl font-bold text-foreground mb-8">Entrar</h1>

          {/* Social Login */}
          <div className="flex gap-3 mb-8">
            <button className="login-google flex-1 flex items-center justify-center gap-2 border border-border rounded-full py-3 px-4 hover:bg-secondary transition-colors">
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              <span className="text-sm font-medium text-foreground">Sign in with Google</span>
            </button>
            <button className="w-12 h-12 flex items-center justify-center border border-border rounded-full hover:bg-secondary transition-colors">
              <svg className="w-5 h-5" fill="#1877F2" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
            </button>
            <button className="w-12 h-12 flex items-center justify-center border border-border rounded-full hover:bg-secondary transition-colors">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
              </svg>
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Insira seu endereço de email
              </label>
              <Input
                type="text"
                name="email"
                placeholder="Endereço de email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="rounded-xl border-border h-12 focus-visible:ring-brand text-white placeholder:text-gray-400"
                style={{ backgroundColor: '#4a5568' }}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Insira sua palavra passe
              </label>
              <Input
                type="password"
                name="password"
                placeholder="Palavra Passe"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="rounded-xl border-border h-12 focus-visible:ring-brand text-white placeholder:text-gray-400"
                style={{ backgroundColor: '#4a5568' }}
              />
              <div className="text-right mt-2">
                <a href="#" className="text-sm text-brand hover:underline">
                  Esqueci a palavra passe
                </a>
              </div>
            </div>

            <button type="submit" className="login-btn">
              Entrar
              <div className="arrow-wrapper">
                <div className="arrow"></div>
              </div>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login; 