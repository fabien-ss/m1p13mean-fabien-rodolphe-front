export const SHOPS = [
  {
    _id: 'shop_001',
    name: 'Tech & Prestige',
    description: 'L’excellence technologique au service de votre quotidien. Des pièces rares et un service après-vente sur mesure dans un cadre raffiné.',
    email: 'contact@techprestige.mg',
    phone: '+261 34 00 000 01',
    manager: 'user_123',
    creationDate: new Date('2023-01-15'),
    type: 'Électronique de Luxe',
    images: [
      'https://images.unsplash.com/photo-1550009158-9ebf69173e03?q=80&w=2000', // Banner
      'https://placehold.co/400x400/0f172a/ffffff?text=TP' // Logo
    ],
    isActive: true
  },
  {
    _id: 'shop_002',
    name: 'Maison de la Mode',
    description: 'Haute couture et prêt-à-porter de luxe. Découvrez des collections exclusives issues des plus grands créateurs internationaux.',
    email: 'boutique@maisonmode.mg',
    phone: '+261 34 00 000 02',
    manager: 'user_456',
    creationDate: new Date('2023-05-20'),
    type: 'Mode & Accessoires',
    images: [
      'https://img.freepik.com/photos-gratuite/interieur-magasin-vetements-marchandises-elegantes-etageres-design-marque-mode-vetements-decontractes-dans-boutique-moderne-salle-exposition-mode-vide-dans-centre-commercial-marchandises-elegantes_482257-65537.jpg?semt=ais_hybrid&w=740&q=80',
      'https://placehold.co/400x400/1e293b/ffffff?text=MM'
    ],
    isActive: true
  }
];
