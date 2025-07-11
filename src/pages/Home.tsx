import React from 'react';
import { Link } from 'react-router-dom';
import { ChefHat, Refrigerator, Sparkles, Users, Clock, Heart } from 'lucide-react';

export const Home: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-green-50">
      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <ChefHat className="mx-auto h-16 w-16 text-orange-500 mb-8" />
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Welkom bij <span className="text-orange-500">KeukenAssistent</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Transformeer uw keuken met intelligente receptaanbevelingen, 
              koelkastbeheer en gepersonaliseerde kookadvies
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/register"
                className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-lg text-lg font-semibold transition-colors shadow-lg"
              >
                Gratis beginnen
              </Link>
              <Link
                to="/login"
                className="bg-white hover:bg-gray-50 text-gray-900 px-8 py-3 rounded-lg text-lg font-semibold border-2 border-gray-300 transition-colors"
              >
                Inloggen
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Waarom KeukenAssistent?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Maak elke dag koken makkelijker met onze slimme functies
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="text-center p-6 rounded-lg bg-gradient-to-br from-orange-50 to-orange-100">
              <div className="w-16 h-16 bg-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Refrigerator className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Slim Koelkastbeheer
              </h3>
              <p className="text-gray-600">
                Houd bij wat je hebt, voorkom verspilling en ontvang 
                meldingen voor vervaldatums
              </p>
            </div>
            
            <div className="text-center p-6 rounded-lg bg-gradient-to-br from-green-50 to-green-100">
              <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Sparkles className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Gepersonaliseerde Recepten
              </h3>
              <p className="text-gray-600">
                Krijg receptaanbevelingen op basis van je ingrediënten, 
                dieet en voorkeuren
              </p>
            </div>
            
            <div className="text-center p-6 rounded-lg bg-gradient-to-br from-blue-50 to-blue-100">
              <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Familie-vriendelijk
              </h3>
              <p className="text-gray-600">
                Maak rekening met allergieën, dieetwensen en 
                voorkeuren van het hele gezin
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Bespaar tijd, geld en stress
              </h2>
              <div className="space-y-4">
                <div className="flex items-start">
                  <Clock className="h-6 w-6 text-orange-500 mt-1 mr-3 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-gray-900">Tijd besparen</h3>
                    <p className="text-gray-600">
                      Geen gedoe meer met bedenken wat je gaat koken. 
                      Krijg direct passende recepten.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <Heart className="h-6 w-6 text-green-500 mt-1 mr-3 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-gray-900">Minder verspilling</h3>
                    <p className="text-gray-600">
                      Gebruik alles wat je hebt met slim voorraadbeheer 
                      en gerichte receptaanbevelingen.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <Sparkles className="h-6 w-6 text-blue-500 mt-1 mr-3 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-gray-900">Meer variatie</h3>
                    <p className="text-gray-600">
                      Ontdek nieuwe recepten die perfect passen bij 
                      jouw ingrediënten en voorkeuren.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="relative">
              <img
                src="https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=800"
                alt="Koken in de keuken"
                className="rounded-lg shadow-2xl"
              />
              <div className="absolute -bottom-6 -right-6 bg-orange-500 text-white p-6 rounded-lg shadow-xl">
                <p className="text-2xl font-bold">500+</p>
                <p className="text-sm">Recepten beschikbaar</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-orange-500 to-green-500">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Klaar om slim te gaan koken?
          </h2>
          <p className="text-xl text-white mb-8">
            Maak vandaag nog een account aan en transformeer uw keukenervaring
          </p>
          <Link
            to="/register"
            className="bg-white text-orange-500 px-8 py-3 rounded-lg text-lg font-semibold hover:bg-gray-100 transition-colors shadow-lg"
          >
            Gratis account aanmaken
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center mb-4">
                <ChefHat className="h-8 w-8 text-orange-500 mr-2" />
                <span className="text-xl font-bold">KeukenAssistent</span>
              </div>
              <p className="text-gray-400">
                Uw persoonlijke keuken-assistent voor slimmer koken
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Product</h3>
              <ul className="space-y-2 text-gray-400">
                <li><Link to="/features" className="hover:text-white">Functies</Link></li>
                <li><Link to="/pricing" className="hover:text-white">Prijzen</Link></li>
                <li><Link to="/recipes" className="hover:text-white">Recepten</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Ondersteuning</h3>
              <ul className="space-y-2 text-gray-400">
                <li><Link to="/help" className="hover:text-white">Help Center</Link></li>
                <li><Link to="/contact" className="hover:text-white">Contact</Link></li>
                <li><Link to="/faq" className="hover:text-white">FAQ</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Juridisch</h3>
              <ul className="space-y-2 text-gray-400">
                <li><Link to="/privacy" className="hover:text-white">Privacy</Link></li>
                <li><Link to="/terms" className="hover:text-white">Voorwaarden</Link></li>
                <li><Link to="/cookies" className="hover:text-white">Cookies</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2025 KeukenAssistent. Alle rechten voorbehouden.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};
