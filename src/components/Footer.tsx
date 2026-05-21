import Link from 'next/link';
import { Home, Mail, Phone, MapPin } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-text-primary text-white mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                <Home className="w-4 h-4 text-white" />
              </div>
              <span className="font-display text-xl font-bold tracking-tight">
                GM <span className="text-primary">Propiedades</span>
              </span>
            </Link>
            <p className="text-sm text-slate-400 leading-relaxed">
              El marketplace inmobiliario más confiable de Chile. Conectamos personas con su propiedad ideal.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-display font-semibold text-sm uppercase tracking-wider text-slate-300 mb-4">
              Navegación
            </h4>
            <ul className="space-y-2.5">
              {[
                { href: '/', label: 'Inicio' },
                { href: '/buscar', label: 'Buscar Propiedades' },
                { href: '/publicar', label: 'Publicar Propiedad' },
                { href: '/login', label: 'Iniciar Sesión' },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-slate-400 hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Property Types */}
          <div>
            <h4 className="font-display font-semibold text-sm uppercase tracking-wider text-slate-300 mb-4">
              Tipos de Propiedad
            </h4>
            <ul className="space-y-2.5">
              {['Casa', 'Departamento', 'Parcela', 'Oficina', 'Local Comercial'].map((type) => (
                <li key={type}>
                  <Link
                    href={`/buscar?tipo=${type.toLowerCase().replace(' ', '_')}`}
                    className="text-sm text-slate-400 hover:text-white transition-colors"
                  >
                    {type}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-display font-semibold text-sm uppercase tracking-wider text-slate-300 mb-4">
              Contacto
            </h4>
            <ul className="space-y-3">
              <li className="flex items-center gap-2.5 text-sm text-slate-400">
                <MapPin className="w-4 h-4 text-primary shrink-0" />
                Santiago, Chile
              </li>
              <li className="flex items-center gap-2.5 text-sm text-slate-400">
                <Phone className="w-4 h-4 text-primary shrink-0" />
                +56 2 2123 4567
              </li>
              <li className="flex items-center gap-2.5 text-sm text-slate-400">
                <Mail className="w-4 h-4 text-primary shrink-0" />
                contacto@gmpropiedades.cl
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-800 mt-10 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-xs text-slate-500">
            © {new Date().getFullYear()} GM Propiedades. Todos los derechos reservados.
          </p>
          <div className="flex gap-6">
            <Link href="#" className="text-xs text-slate-500 hover:text-slate-300 transition-colors">
              Términos de Uso
            </Link>
            <Link href="#" className="text-xs text-slate-500 hover:text-slate-300 transition-colors">
              Privacidad
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
