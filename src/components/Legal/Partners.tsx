import { ExternalLink, Handshake } from 'lucide-react';

interface Partner {
  name: string;
  url: string;
  description: string;
  category: string;
}

const partners: Partner[] = [
  {
    name: 'BeautePresta',
    url: 'https://www.beautepresta.com',
    description: "L'annuaire de référence des professionnels de la beauté et de la coiffure en France. Trouvez des prestataires qualifiés près de chez vous.",
    category: 'Annuaire beauté',
  },
];

export function Partners() {
  return (
    <article className="max-w-3xl mx-auto">
      {/* Hero */}
      <div className="bg-gradient-to-br from-emerald-600 to-teal-600 rounded-2xl p-8 md:p-12 text-white mb-10 text-center shadow-lg">
        <div className="inline-flex items-center gap-2 bg-white/20 text-white px-4 py-1.5 rounded-full text-sm font-semibold mb-4">
          <Handshake className="w-4 h-4" />
          Partenariats
        </div>
        <h1 className="text-2xl md:text-3xl font-bold leading-tight mb-4">
          Nos Partenaires
        </h1>
        <p className="text-emerald-50 text-base md:text-lg leading-relaxed max-w-2xl mx-auto">
          Natural Hair Market collabore avec des acteurs de confiance du secteur de la beauté et de la coiffure pour vous offrir la meilleure expérience possible.
        </p>
      </div>

      {/* Partners grid */}
      <div className="grid sm:grid-cols-2 gap-6 mb-12">
        {partners.map((partner) => (
          <a
            key={partner.name}
            href={partner.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group bg-white rounded-2xl border border-gray-200 shadow-sm hover:border-emerald-300 hover:shadow-md transition-all duration-200 overflow-hidden flex flex-col"
          >
            <div className="bg-emerald-50 border-b border-emerald-100 px-6 py-4 flex items-center justify-between">
              <span className="text-xs font-semibold text-emerald-700 uppercase tracking-wide">
                {partner.category}
              </span>
              <ExternalLink className="w-4 h-4 text-emerald-500 group-hover:text-emerald-700 transition-colors" />
            </div>
            <div className="px-6 py-5 flex-1 flex flex-col gap-3">
              <h2 className="text-lg font-bold text-gray-900 group-hover:text-emerald-700 transition-colors">
                {partner.name}
              </h2>
              <p className="text-gray-600 text-sm leading-relaxed flex-1">
                {partner.description}
              </p>
              <span className="text-emerald-600 text-sm font-medium group-hover:underline">
                Retrouvez-nous sur l'annuaire {partner.name} →
              </span>
            </div>
          </a>
        ))}

        {/* Placeholder card */}
        <div className="bg-gray-50 rounded-2xl border border-dashed border-gray-300 px-6 py-8 flex flex-col items-center justify-center text-center gap-3">
          <Handshake className="w-8 h-8 text-gray-300" />
          <p className="text-gray-400 text-sm font-medium">Prochainement</p>
          <p className="text-gray-400 text-xs">
            De nouveaux partenariats sont en cours de négociation.
          </p>
        </div>
      </div>

      {/* Contact CTA */}
      <div className="bg-gray-50 border border-gray-200 rounded-2xl p-6 md:p-8 text-center">
        <h2 className="text-lg font-bold text-gray-800 mb-2">Vous souhaitez devenir partenaire ?</h2>
        <p className="text-gray-600 text-sm mb-4 max-w-md mx-auto">
          Vous êtes un acteur de la beauté, de la coiffure ou du bien-être et souhaitez collaborer avec Natural Hair Market ? Contactez-nous.
        </p>
        <a
          href="mailto:naturalhairmarket@gmail.com"
          className="inline-flex items-center gap-2 bg-emerald-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-emerald-700 transition-colors text-sm"
        >
          Nous contacter
        </a>
      </div>
    </article>
  );
}
