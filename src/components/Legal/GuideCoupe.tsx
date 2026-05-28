import { Scissors, Droplets, Package, Truck, CheckCircle, ArrowRight } from 'lucide-react';

interface GuideCoupeProps {
  onStartSelling?: () => void;
}

export function GuideCoupe({ onStartSelling }: GuideCoupeProps) {
  const steps = [
    {
      number: '1',
      icon: Droplets,
      color: 'emerald',
      title: 'La préparation : Des cheveux propres et naturels',
      items: [
        {
          strong: 'Lavez vos cheveux :',
          text: ' Utilisez un shampoing doux. Ne mettez ni après-shampoing, ni masque, ni huiles. Les cheveux doivent être parfaitement vierges de tout produit.',
        },
        {
          strong: 'Séchez à 100% :',
          text: ' Les cheveux doivent être complètement secs avant d\'être coupés. Des cheveux humides risquent de moisir pendant le transport ou le stockage.',
        },
      ],
    },
    {
      number: '2',
      icon: Scissors,
      color: 'teal',
      title: "L'attache : Sécuriser les mèches",
      warning: 'Ne coupez jamais les cheveux lâchés !',
      items: [
        { text: 'Séparez les cheveux en plusieurs sections (ou couettes).' },
        { text: 'Mettez un élastique bien serré en haut (près du crâne) et un autre élastique au milieu ou en bas pour maintenir la mèche bien droite.' },
      ],
      tip: 'Faire une tresse bien serrée maintenue par des élastiques aux deux extrémités est souvent la méthode préférée des acheteurs.',
    },
    {
      number: '3',
      icon: Scissors,
      color: 'emerald',
      title: 'La coupe : Nette et précise',
      items: [
        { text: 'Utilisez des ciseaux de coiffure professionnels bien aiguisés. Une coupe nette évite d\'abîmer les pointes.' },
        { text: 'Coupez toujours juste au-dessus de l\'élastique supérieur (côté crâne).' },
      ],
    },
    {
      number: '4',
      icon: Package,
      color: 'teal',
      title: "La conservation et l'expédition",
      warning: 'Une fois la tresse ou la queue de cheval coupée, ne retirez SURTOUT PAS les élastiques.',
      items: [
        { text: 'Glissez soigneusement les cheveux dans un sac en plastique hermétique (type sac congélation à zip) en chassant le maximum d\'air.' },
        { text: 'Conservez le sachet dans un endroit sec, à l\'abri de l\'humidité et de la lumière directe du soleil en attendant de l\'expédier à votre acheteur sur Natural Hair Market.' },
      ],
    },
  ];

  return (
    <article className="max-w-3xl mx-auto">
      {/* Hero */}
      <div className="bg-gradient-to-br from-emerald-600 to-teal-600 rounded-2xl p-8 md:p-12 text-white mb-10 text-center shadow-lg">
        <div className="inline-flex items-center gap-2 bg-white/20 text-white px-4 py-1.5 rounded-full text-sm font-semibold mb-4">
          <Scissors className="w-4 h-4" />
          Guide vendeur
        </div>
        <h1 className="text-2xl md:text-3xl font-bold leading-tight mb-4">
          Guide complet : Comment préparer, couper et conserver vos cheveux pour la vente
        </h1>
        <p className="text-emerald-50 text-base md:text-lg leading-relaxed max-w-2xl mx-auto">
          Vendre ses cheveux sur <strong>Natural Hair Market</strong> est un excellent moyen de rentabiliser un changement de coupe. Cependant, pour obtenir le meilleur prix auprès des professionnels et perruquiers, la qualité de la coupe et de la conservation est primordiale. Voici les <strong>4 étapes indispensables</strong>.
        </p>
      </div>

      {/* Steps */}
      <div className="space-y-8 mb-12">
        {steps.map((step, index) => {
          const Icon = step.icon;
          const isEmerald = step.color === 'emerald';
          return (
            <section
              key={index}
              className={`bg-white rounded-2xl border ${isEmerald ? 'border-emerald-200' : 'border-teal-200'} shadow-sm overflow-hidden`}
            >
              <div className={`${isEmerald ? 'bg-emerald-50 border-b border-emerald-100' : 'bg-teal-50 border-b border-teal-100'} px-6 py-4 flex items-center gap-4`}>
                <div className={`w-10 h-10 rounded-full ${isEmerald ? 'bg-emerald-600' : 'bg-teal-600'} flex items-center justify-center flex-shrink-0 text-white font-bold text-lg`}>
                  {step.number}
                </div>
                <div className={`w-8 h-8 ${isEmerald ? 'text-emerald-600' : 'text-teal-600'} flex-shrink-0`}>
                  <Icon className="w-8 h-8" />
                </div>
                <h2 className="text-lg md:text-xl font-bold text-gray-800">{step.title}</h2>
              </div>

              <div className="px-6 py-5 space-y-3">
                {step.warning && (
                  <div className="flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-lg px-4 py-3">
                    <span className="text-amber-600 font-bold text-lg leading-none mt-0.5">!</span>
                    <p className="text-amber-800 font-semibold text-sm">{step.warning}</p>
                  </div>
                )}

                <ul className="space-y-3">
                  {step.items.map((item, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <CheckCircle className={`w-5 h-5 ${isEmerald ? 'text-emerald-500' : 'text-teal-500'} flex-shrink-0 mt-0.5`} />
                      <p className="text-gray-700 text-sm md:text-base leading-relaxed">
                        {'strong' in item && item.strong
                          ? <><strong className="text-gray-900">{item.strong}</strong>{item.text}</>
                          : item.text
                        }
                      </p>
                    </li>
                  ))}
                </ul>

                {step.tip && (
                  <div className={`flex items-start gap-3 ${isEmerald ? 'bg-emerald-50 border-emerald-200' : 'bg-teal-50 border-teal-200'} border rounded-lg px-4 py-3 mt-2`}>
                    <span className={`${isEmerald ? 'text-emerald-600' : 'text-teal-600'} font-bold text-sm flex-shrink-0 mt-0.5`}>Astuce :</span>
                    <p className={`${isEmerald ? 'text-emerald-800' : 'text-teal-800'} text-sm leading-relaxed`}>{step.tip}</p>
                  </div>
                )}
              </div>
            </section>
          );
        })}
      </div>

      {/* Summary checklist */}
      <div className="bg-gray-50 border border-gray-200 rounded-2xl p-6 md:p-8 mb-10">
        <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
          <CheckCircle className="w-5 h-5 text-emerald-600" />
          Récapitulatif avant l'envoi
        </h2>
        <ul className="grid sm:grid-cols-2 gap-2">
          {[
            'Cheveux lavés au shampoing uniquement',
            'Cheveux 100% secs',
            'Mèche attachée avec au moins 2 élastiques',
            'Coupe nette au-dessus de l\'élastique',
            'Élastiques laissés en place après la coupe',
            'Mèche glissée dans un sac hermétique',
            'Stockage à l\'abri de l\'humidité et du soleil',
          ].map((item, i) => (
            <li key={i} className="flex items-center gap-2 text-sm text-gray-700">
              <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0" />
              {item}
            </li>
          ))}
        </ul>
      </div>

      {/* CTA */}
      <div className="bg-gradient-to-br from-emerald-600 to-teal-600 rounded-2xl p-8 text-center text-white shadow-lg">
        <Truck className="w-10 h-10 mx-auto mb-3 opacity-90" />
        <h2 className="text-xl font-bold mb-2">Prêt(e) à vendre vos cheveux ?</h2>
        <p className="text-emerald-100 text-sm mb-5 max-w-md mx-auto">
          Vos cheveux sont préparés selon les règles de l'art ? Publiez votre annonce en quelques minutes et touchez des milliers d'acheteurs professionnels.
        </p>
        <button
          onClick={onStartSelling}
          className="inline-flex items-center gap-2 bg-white text-emerald-700 px-6 py-3 rounded-xl font-bold hover:bg-emerald-50 transition-all transform hover:scale-105 shadow-md"
        >
          Créer mon annonce de vente maintenant
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </article>
  );
}
