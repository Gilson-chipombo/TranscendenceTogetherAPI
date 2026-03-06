import { useState } from "react";
import heroIllustration from "@/assets/signUp.png";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Sign } from "crypto";

const SignUp = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <div className="flex flex-col lg:flex-row min-h-screen">
      {/* Left Side - Carousel */}
      <div className="relative w-full h-56 sm:h-72 md:h-80 lg:h-auto lg:w-1/2 bg-carousel-bg flex items-center justify-center">
        <div
          role="img"
          aria-label="Foodie illustration"
          className="slicer"
          style={{ backgroundImage: `url(${heroIllustration})` }}
        />
        {/* Carousel arrows */}
        {/* Dots */}
      </div>

      {/* Right Side - Login Form */}
      <div className="w-full lg:w-1/2 bg-login-bg flex flex-1 items-center justify-center p-6 lg:p-12">
        <div className="w-full max-w-md bg-login-card rounded-3xl shadow-lg p-8 lg:p-10">
          {/* Header */}
          <div className="flex justify-center mb-2">
            <div>
              <p className="text-foreground text-lg">
                <span className="text-brand font-bold">Crie a sua conta</span>
              </p>
            </div>
          </div>

          {/* Social Login */}
          <div className="flex gap-3 mb-8">
            <button className="flex-1 flex items-center justify-center gap-2 border border-border rounded-full py-3 px-4 hover:bg-secondary transition-colors">
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              <span className="text-sm font-medium text-foreground">Sign Up with Google</span>
            </button>
          </div>

          {/* Form */}
          <form onSubmit={(e) => e.preventDefault()} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Insira seu endereço de email
              </label>
              <Input
                type="text"
                placeholder="Endereço de email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="rounded-xl border-border bg-login-card h-12 focus-visible:ring-brand"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Insira sua palavra passe
              </label>
              <Input
                type="password"
                placeholder="Palavra Passe"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="rounded-xl border-border bg-login-card h-12 focus-visible:ring-brand"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Repita a sua palavra passe
              </label>
              <Input
                type="password"
                placeholder="Palavra Passe"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="rounded-xl border-border bg-login-card h-12 focus-visible:ring-brand"
              />
            </div>

            <Button
              type="submit"
              className="w-full h-12 rounded-full bg-brand text-brand-foreground hover:bg-brand/90 text-base font-semibold shadow-md"
            >
              Criar Conta
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignUp;