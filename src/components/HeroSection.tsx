'use client';

import Link from 'next/link';
import { useAnalytics } from '@/lib/analytics';
import { Search, PlusCircle, TrendingUp, Shield, Clock, Users } from 'lucide-react';

export function HeroSection() {
  const { track } = useAnalytics();

  return (
    <section className="relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 gradient-hero" />
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-white rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 lg:py-32">
        <div className="text-center max-w-3xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/20 text-white/90 text-xs font-medium mb-6">
            <TrendingUp className="w-3.5 h-3.5" />
            Marketplace Inmobiliario #1 de Chile
          </div>

          {/* Heading */}
          <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
            Encuentra tu{' '}
            <span className="text-accent">Propiedad Ideal</span>{' '}
            en Chile
          </h1>

          {/* Subtitle */}
          <p className="text-lg sm:text-xl text-slate-300 mb-10 max-w-2xl mx-auto leading-relaxed">
            Miles de casas, departamentos y parcelas en todo el país. 
            Publica o busca con nosotros de forma segura y rápida.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/buscar"
              onClick={() => track('cta_click', { cta: 'hero_search', location: 'hero' })}
              className="group inline-flex items-center gap-2 px-8 py-4 bg-white text-text-primary rounded-xl font-semibold text-base hover:bg-slate-100 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              <Search className="w-5 h-5 text-primary" />
              Buscar Propiedades
            </Link>
            <Link
              href="/publicar"
              onClick={() => track('cta_click', { cta: 'hero_publish', location: 'hero' })}
              className="group inline-flex items-center gap-2 px-8 py-4 bg-accent text-white rounded-xl font-semibold text-base hover:bg-accent-hover transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              <PlusCircle className="w-5 h-5" />
              Publicar con Nosotros
            </Link>
          </div>
        </div>

        {/* Stats */}
        <div className="mt-16 sm:mt-20 grid grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 max-w-2xl mx-auto">
          {[
            { icon: Users, value: '2,500+', label: 'Propiedades' },
            { icon: Shield, value: '100%', label: 'Verificadas' },
            { icon: Clock, value: '< 24h', label: 'Respuesta' },
          ].map((stat) => (
            <div
              key={stat.label}
              className="flex flex-col items-center p-4 sm:p-5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm"
            >
              <stat.icon className="w-5 h-5 text-accent mb-2" />
              <span className="font-display text-xl sm:text-2xl font-bold text-white">{stat.value}</span>
              <span className="text-xs sm:text-sm text-slate-400">{stat.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
