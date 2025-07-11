import React from 'react';
import { Link } from 'react-router-dom';
import { ChefHat, ArrowLeft } from 'lucide-react';

export const Privacy: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center text-orange-600 hover:text-orange-500 mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Terug naar home
          </Link>
          <ChefHat className="mx-auto h-12 w-12 text-orange-500 mb-4" />
          <h1 className="text-3xl font-bold text-gray-900">Privacyverklaring</h1>
          <p className="mt-2 text-gray-600">
            Laatst bijgewerkt: {new Date().toLocaleDateString('nl-NL')}
          </p>
        </div>

        <div className="bg-white shadow rounded-lg p-8 space-y-6">
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">1. Algemeen</h2>
            <p className="text-gray-700 leading-relaxed">
              KeukenAssistent respecteert uw privacy en zet zich in voor de bescherming van uw persoonlijke gegevens. 
              Deze privacyverklaring legt uit welke gegevens we verzamelen, hoe we deze gebruiken, en welke rechten u heeft.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">2. Gegevens die we verzamelen</h2>
            <div className="space-y-3 text-gray-700">
              <div>
                <h3 className="font-medium text-gray-900">Accountgegevens:</h3>
                <p>E-mailadres, naam, wachtwoord (versleuteld)</p>
              </div>
              <div>
                <h3 className="font-medium text-gray-900">Profielgegevens:</h3>
                <p>Dieetvoorkeuren, allergieën, keukenvoorkeuren</p>
              </div>
              <div>
                <h3 className="font-medium text-gray-900">Koelkastgegevens:</h3>
                <p>Ingrediënten, hoeveelheden, vervaldatums</p>
              </div>
              <div>
                <h3 className="font-medium text-gray-900">Gebruiksgegevens:</h3>
                <p>Recepten bekeken, zoekgeschiedenis, app-gebruik</p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">3. Hoe we uw gegevens gebruiken</h2>
            <ul className="list-disc pl-5 space-y-2 text-gray-700">
              <li>Om u toegang te geven tot uw account</li>
              <li>Om gepersonaliseerde receptaanbevelingen te maken</li>
              <li>Om uw koelkastinventaris bij te houden</li>
              <li>Om de app te verbeteren en nieuwe functies te ontwikkelen</li>
              <li>Om u te informeren over updates en nieuwe functies</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">4. Gegevensdeling</h2>
            <p className="text-gray-700 leading-relaxed">
              Wij delen uw persoonlijke gegevens niet met derden voor commerciële doeleinden. 
              Gegevens worden alleen gedeeld met:
            </p>
            <ul className="list-disc pl-5 space-y-2 text-gray-700 mt-2">
              <li>Technische serviceproviders (hosting, database)</li>
              <li>Alleen wanneer wettelijk verplicht</li>
              <li>Met uw expliciete toestemming</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">5. Beveiliging</h2>
            <p className="text-gray-700 leading-relaxed">
              We nemen passende technische en organisatorische maatregelen om uw gegevens te beschermen tegen 
              ongeautoriseerde toegang, verlies, of misbruik. Dit omvat versleuteling, beveiligde servers, 
              en regelmatige beveiligingsupdates.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">6. Uw rechten</h2>
            <p className="text-gray-700 leading-relaxed mb-3">
              Onder de AVG heeft u verschillende rechten betreffende uw persoonlijke gegevens:
            </p>
            <ul className="list-disc pl-5 space-y-2 text-gray-700">
              <li>Recht op inzage in uw gegevens</li>
              <li>Recht op rectificatie (correctie van onjuiste gegevens)</li>
              <li>Recht op verwijdering ('recht om vergeten te worden')</li>
              <li>Recht op beperking van de verwerking</li>
              <li>Recht op gegevensoverdraagbaarheid</li>
              <li>Recht van bezwaar tegen verwerking</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">7. Bewaartermijn</h2>
            <p className="text-gray-700 leading-relaxed">
              We bewaren uw gegevens niet langer dan noodzakelijk voor de doeleinden waarvoor ze zijn verzameld. 
              Accountgegevens worden bewaard zolang uw account actief is. Na verwijdering van uw account 
              worden gegevens binnen 30 dagen definitief verwijderd.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">8. Cookies</h2>
            <p className="text-gray-700 leading-relaxed">
              We gebruiken alleen technisch noodzakelijke cookies om de app te laten functioneren. 
              Er worden geen tracking cookies of analytics cookies gebruikt zonder uw toestemming.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">9. Contact</h2>
            <p className="text-gray-700 leading-relaxed">
              Voor vragen over deze privacyverklaring of uw gegevens kunt u contact opnemen via:
            </p>
            <div className="mt-3 p-4 bg-gray-50 rounded-lg">
              <p className="text-gray-700">
                <strong>E-mail:</strong> privacy@keukenassistent.nl<br />
                <strong>Adres:</strong> [Uw bedrijfsadres]<br />
                <strong>Telefoon:</strong> [Uw telefoonnummer]
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">10. Wijzigingen</h2>
            <p className="text-gray-700 leading-relaxed">
              We kunnen deze privacyverklaring van tijd tot tijd bijwerken. Belangrijke wijzigingen 
              worden u per e-mail meegedeeld. We raden u aan deze pagina regelmatig te raadplegen 
              voor eventuele updates.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};
