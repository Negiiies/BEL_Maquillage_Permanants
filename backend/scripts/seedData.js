// backend/scripts/seedData.js
const { Client, Service, TimeSlot, Booking, User } = require('../models');
const argon2 = require('argon2');

const seedDatabase = async () => {
  try {
    console.log('🌱 Création des données de test...');

    // 1. Vérifier si l'admin existe, sinon en créer un
    let admin = await User.findOne({ where: { role: 'admin' } });
    if (!admin) {
      const hashedPassword = await argon2.hash('admin123456');
      admin = await User.create({
        email: 'admin@bel-institut.fr',
        password: hashedPassword,
        role: 'admin',
        isActive: true
      });
      console.log('✅ Admin créé: admin@bel-institut.fr / admin123456');
    }

    // 2. Créer des services complets
    const serviceCount = await Service.count();
    if (serviceCount === 0) {
      const services = [
        {
          name: 'Microblading Sourcils',
          description: 'Technique de maquillage permanent pour des sourcils naturels et définis. Effet poil à poil très réaliste.',
          price: 350.00,
          category: 'maquillage_permanent',
          isActive: true
        },
        {
          name: 'Powder Brows',
          description: 'Maquillage permanent sourcils effet poudré pour un rendu naturel et sophistiqué.',
          price: 380.00,
          category: 'maquillage_permanent',
          isActive: true
        },
        {
          name: 'Maquillage Permanent Lèvres',
          description: 'Sublimez vos lèvres avec un contour défini et une couleur naturelle durable.',
          price: 420.00,
          category: 'maquillage_permanent',
          isActive: true
        },
        {
          name: 'Eye-liner Permanent',
          description: 'Trait d\'eye-liner permanent pour un regard intense en toutes circonstances.',
          price: 280.00,
          category: 'maquillage_permanent',
          isActive: true
        },
        {
          name: 'Extensions Cils Volume Russe',
          description: 'Extensions de cils technique volume russe pour un regard intense et glamour.',
          price: 120.00,
          category: 'extensions_cils',
          isActive: true
        },
        {
          name: 'Extensions Cils Classiques',
          description: 'Extensions de cils une à une pour un effet naturel et élégant.',
          price: 80.00,
          category: 'extensions_cils',
          isActive: true
        },
        {
          name: 'Extensions Cils Méga Volume',
          description: 'Extensions ultra-volumineuses pour un regard spectaculaire.',
          price: 150.00,
          category: 'extensions_cils',
          isActive: true
        },
        {
          name: 'Rehaussement de Cils',
          description: 'Lift des cils naturels avec teinture pour un regard ouvert et lumineux.',
          price: 45.00,
          category: 'soins_regard',
          isActive: true
        },
        {
          name: 'Teinture Cils et Sourcils',
          description: 'Coloration des cils et sourcils pour intensifier naturellement le regard.',
          price: 35.00,
          category: 'soins_regard',
          isActive: true
        },
        {
          name: 'Épilation Sourcils + Modelage',
          description: 'Épilation précise et modelage des sourcils pour une forme parfaite.',
          price: 25.00,
          category: 'soins_regard',
          isActive: true
        }
      ];

      await Service.bulkCreate(services);
      console.log('✅ 10 services créés');
    }

    // 3. Créer des clients de test
    const clientCount = await Client.count();
    if (clientCount < 5) {
      const hashedPassword = await argon2.hash('client123');
      
      const clients = [
        {
          email: 'marie.martin@email.com',
          password: hashedPassword,
          firstName: 'Marie',
          lastName: 'Martin',
          phone: '0123456789',
          dateOfBirth: '1990-05-15',
          isActive: true,
          emailVerified: true
        },
        {
          email: 'sophie.dubois@email.com',
          password: hashedPassword,
          firstName: 'Sophie',
          lastName: 'Dubois',
          phone: '0987654321',
          dateOfBirth: '1985-08-22',
          isActive: true,
          emailVerified: true
        },
        {
          email: 'laura.bernard@email.com',
          password: hashedPassword,
          firstName: 'Laura',
          lastName: 'Bernard',
          phone: '0654321987',
          dateOfBirth: '1992-12-03',
          isActive: true,
          emailVerified: true
        },
        {
          email: 'emma.rousseau@email.com',
          password: hashedPassword,
          firstName: 'Emma',
          lastName: 'Rousseau',
          phone: '0147258369',
          dateOfBirth: '1988-11-12',
          isActive: true,
          emailVerified: true
        },
        {
          email: 'clara.moreau@email.com',
          password: hashedPassword,
          firstName: 'Clara',
          lastName: 'Moreau',
          phone: '0192837465',
          dateOfBirth: '1995-03-28',
          isActive: true,
          emailVerified: true
        }
      ];

      await Client.bulkCreate(clients);
      console.log('✅ 5 clients créés (mot de passe: client123)');
    }

    // 4. Générer des créneaux pour les 30 prochains jours
    await generateTimeSlots();

    // 5. Créer quelques réservations de test
    await createSampleBookings();

    console.log('🎉 Base de données peuplée avec succès !');
    console.log('\n📋 COMPTES DE TEST:');
    console.log('Admin: admin@bel-institut.fr / admin123456');
    console.log('Clients: marie.martin@email.com / client123');
    console.log('         sophie.dubois@email.com / client123');
    console.log('         laura.bernard@email.com / client123');
    console.log('         emma.rousseau@email.com / client123');
    console.log('         clara.moreau@email.com / client123');

  } catch (error) {
    console.error('❌ Erreur lors du peuplement:', error);
  }
};

// Fonction pour générer des créneaux automatiquement
const generateTimeSlots = async () => {
  const existingSlots = await TimeSlot.count();
  if (existingSlots > 0) {
    console.log('✅ Créneaux déjà existants');
    return;
  }

  const slots = [];
  const today = new Date();
  
  // Générer pour les 30 prochains jours
  for (let i = 1; i <= 30; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    
    // Éviter le dimanche (jour 0)
    if (date.getDay() === 0) continue;
    
    const dateString = date.toISOString().split('T')[0];
    
    // Horaires selon le jour
    let timeSlots = [];
    if (date.getDay() === 6) { // Samedi
      timeSlots = [
        ['09:00', '10:30'], ['10:30', '12:00'], 
        ['14:00', '15:30'], ['15:30', '16:00']
      ];
    } else { // Lundi à Vendredi
      timeSlots = [
        ['09:00', '10:30'], ['10:30', '12:00'], 
        ['14:00', '15:30'], ['15:30', '17:00'], ['17:00', '18:00']
      ];
    }
    
    // Créer les créneaux pour cette date
    for (const [start, end] of timeSlots) {
      slots.push({
        date: dateString,
        startTime: start,
        endTime: end,
        isAvailable: true,
        maxBookings: 1,
        currentBookings: 0
      });
    }
  }
  
  await TimeSlot.bulkCreate(slots);
  console.log(`✅ ${slots.length} créneaux générés pour 30 jours`);
};

// Fonction pour créer des réservations d'exemple
const createSampleBookings = async () => {
  const existingBookings = await Booking.count();
  if (existingBookings > 0) {
    console.log('✅ Réservations déjà existantes');
    return;
  }

  const clients = await Client.findAll({ limit: 3 });
  const services = await Service.findAll({ limit: 5 });
  const timeSlots = await TimeSlot.findAll({ 
    limit: 10,
    order: [['date', 'ASC']]
  });

  if (clients.length > 0 && services.length > 0 && timeSlots.length > 0) {
    const bookings = [
      {
        clientId: clients[0].id,
        serviceId: services[0].id, // Microblading
        timeSlotId: timeSlots[0].id,
        bookingDate: new Date(`${timeSlots[0].date}T${timeSlots[0].startTime}`),
        duration: 90,
        totalPrice: services[0].price,
        status: 'confirmed',
        clientNotes: 'Première séance de microblading',
        confirmationSent: true
      },
      {
        clientId: clients[1].id,
        serviceId: services[4].id, // Extensions volume russe
        timeSlotId: timeSlots[2].id,
        bookingDate: new Date(`${timeSlots[2].date}T${timeSlots[2].startTime}`),
        duration: 60,
        totalPrice: services[4].price,
        status: 'pending',
        clientNotes: 'Pose d\'extensions volume russe'
      },
      {
        clientId: clients[2].id,
        serviceId: services[7].id, // Rehaussement
        timeSlotId: timeSlots[4].id,
        bookingDate: new Date(`${timeSlots[4].date}T${timeSlots[4].startTime}`),
        duration: 30,
        totalPrice: services[7].price,
        status: 'completed',
        clientNotes: 'Rehaussement de cils + teinture'
      }
    ];

    await Booking.bulkCreate(bookings);
    
    // Mettre à jour les compteurs de créneaux
    await timeSlots[0].update({ currentBookings: 1 });
    await timeSlots[2].update({ currentBookings: 1 });
    await timeSlots[4].update({ currentBookings: 1 });
    
    console.log('✅ 3 réservations d\'exemple créées');
  }
};

// Exécuter si appelé directement
if (require.main === module) {
  seedDatabase().then(() => {
    console.log('✨ Terminé ! Votre institut est prêt.');
    process.exit(0);
  }).catch(error => {
    console.error('Erreur:', error);
    process.exit(1);
  });
}

module.exports = { seedDatabase };