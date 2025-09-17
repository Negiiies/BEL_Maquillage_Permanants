// backend/utils/emailService.js
const nodemailer = require('nodemailer');

// Configuration du transporteur email
const createTransporter = () => {
  return nodemailer.createTransporter({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });
};

// Email de confirmation de réservation
const sendBookingConfirmation = async (booking, client, service) => {
  try {
    const transporter = createTransporter();
    
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: client.email,
      subject: 'Confirmation de votre rendez-vous - BEL Institut',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f8f9fa;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 20px; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 28px; font-weight: 300;">BEL Institut de Beauté</h1>
            <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0;">Confirmation de rendez-vous</p>
          </div>
          
          <div style="padding: 40px 30px; background-color: white;">
            <h2 style="color: #333; margin-bottom: 20px;">Bonjour ${client.firstName} ${client.lastName},</h2>
            
            <p style="color: #666; line-height: 1.6; margin-bottom: 30px;">
              Votre rendez-vous a été confirmé avec succès. Voici les détails de votre réservation :
            </p>
            
            <div style="background-color: #f8f9fa; padding: 25px; border-radius: 8px; margin: 30px 0; border-left: 4px solid #667eea;">
              <h3 style="margin-top: 0; color: #333; font-size: 18px;">Détails du rendez-vous</h3>
              
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 8px 0; color: #666; font-weight: bold;">Service :</td>
                  <td style="padding: 8px 0; color: #333;">${service.name}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #666; font-weight: bold;">Date :</td>
                  <td style="padding: 8px 0; color: #333;">${new Date(booking.bookingDate).toLocaleDateString('fr-FR', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #666; font-weight: bold;">Heure :</td>
                  <td style="padding: 8px 0; color: #333;">${new Date(booking.bookingDate).toLocaleTimeString('fr-FR', { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  })}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #666; font-weight: bold;">Durée :</td>
                  <td style="padding: 8px 0; color: #333;">${booking.duration} minutes</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #666; font-weight: bold;">Prix :</td>
                  <td style="padding: 8px 0; color: #333; font-weight: bold;">${booking.totalPrice}€</td>
                </tr>
              </table>
            </div>
            
            <div style="background-color: #e3f2fd; padding: 20px; border-radius: 8px; margin: 30px 0;">
              <h3 style="margin-top: 0; color: #1976d2; font-size: 16px;">📍 Adresse</h3>
              <p style="margin: 0; color: #666; line-height: 1.6;">
                BEL Institut de Beauté<br>
                123 Rue de la Beauté<br>
                75001 Paris, France
              </p>
              <p style="margin: 15px 0 0 0; color: #666;">
                <strong>Téléphone :</strong> 01 23 45 67 89
              </p>
            </div>
            
            <div style="background-color: #fff3e0; padding: 20px; border-radius: 8px; margin: 30px 0;">
              <h3 style="margin-top: 0; color: #f57c00; font-size: 16px;">⚠️ Informations importantes</h3>
              <ul style="color: #666; line-height: 1.6; margin: 0; padding-left: 20px;">
                <li>Merci d'arriver 10 minutes avant votre rendez-vous</li>
                <li>Pour toute annulation, contactez-nous au moins 24h à l'avance</li>
                <li>Apportez une pièce d'identité pour votre première visite</li>
                <li>Évitez le maquillage des yeux le jour du rendez-vous</li>
              </ul>
            </div>
            
            ${booking.clientNotes ? `
            <div style="background-color: #f1f8e9; padding: 20px; border-radius: 8px; margin: 30px 0;">
              <h3 style="margin-top: 0; color: #689f38; font-size: 16px;">💬 Vos notes</h3>
              <p style="margin: 0; color: #666; font-style: italic;">"${booking.clientNotes}"</p>
            </div>
            ` : ''}
          </div>
          
          <div style="background-color: #f8f9fa; padding: 30px; text-align: center; border-top: 1px solid #e0e0e0;">
            <p style="color: #666; margin: 0 0 15px 0; font-size: 14px;">
              Nous avons hâte de vous accueillir chez BEL Institut !
            </p>
            <p style="color: #999; margin: 0; font-size: 12px;">
              Pour toute question, contactez-nous au 01 23 45 67 89 ou répondez à cet email.
            </p>
            
            <div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid #e0e0e0;">
              <p style="color: #999; margin: 0; font-size: 11px;">
                BEL Institut de Beauté - 123 Rue de la Beauté, 75001 Paris<br>
                Cet email a été envoyé automatiquement, merci de ne pas y répondre directement.
              </p>
            </div>
          </div>
        </div>
      `
    };
    
    await transporter.sendMail(mailOptions);
    console.log(`✅ Email de confirmation envoyé à ${client.email}`);
    return true;
    
  } catch (error) {
    console.error('❌ Erreur envoi email:', error);
    return false;
  }
};

// Email de rappel 24h avant
const sendBookingReminder = async (booking, client, service) => {
  try {
    const transporter = createTransporter();
    
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: client.email,
      subject: 'Rappel : Votre rendez-vous demain - BEL Institut',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f8f9fa;">
          <div style="background: linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%); padding: 40px 20px; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 28px; font-weight: 300;">BEL Institut de Beauté</h1>
            <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0;">Rappel de rendez-vous</p>
          </div>
          
          <div style="padding: 40px 30px; background-color: white;">
            <h2 style="color: #333; margin-bottom: 20px;">Bonjour ${client.firstName},</h2>
            
            <p style="color: #666; line-height: 1.6; margin-bottom: 30px;">
              Nous vous rappelons que vous avez rendez-vous demain chez BEL Institut pour :
            </p>
            
            <div style="background: linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%); padding: 30px; border-radius: 12px; text-align: center; color: white; margin: 30px 0;">
              <h3 style="margin: 0 0 15px 0; font-size: 24px; font-weight: 300;">${service.name}</h3>
              <p style="margin: 0; font-size: 18px; opacity: 0.9;">
                ${new Date(booking.bookingDate).toLocaleDateString('fr-FR', { 
                  weekday: 'long', 
                  day: 'numeric', 
                  month: 'long' 
                })} à ${new Date(booking.bookingDate).toLocaleTimeString('fr-FR', { 
                  hour: '2-digit', 
                  minute: '2-digit' 
                })}
              </p>
            </div>
            
            <div style="text-align: center; margin: 30px 0;">
              <p style="color: #666; margin-bottom: 20px;">📍 BEL Institut de Beauté</p>
              <p style="color: #666; margin: 0;">123 Rue de la Beauté, 75001 Paris</p>
              <p style="color: #666; margin: 5px 0 0 0;">📞 01 23 45 67 89</p>
            </div>
            
            <div style="background-color: #e8f5e8; padding: 20px; border-radius: 8px; text-align: center;">
              <p style="color: #2e7d32; margin: 0; font-weight: bold;">
                Nous avons hâte de vous retrouver ! 💄✨
              </p>
            </div>
          </div>
          
          <div style="background-color: #f8f9fa; padding: 20px; text-align: center; border-top: 1px solid #e0e0e0;">
            <p style="color: #999; margin: 0; font-size: 12px;">
              BEL Institut de Beauté - À bientôt !
            </p>
          </div>
        </div>
      `
    };
    
    await transporter.sendMail(mailOptions);
    console.log(`✅ Rappel envoyé à ${client.email}`);
    return true;
    
  } catch (error) {
    console.error('❌ Erreur envoi rappel:', error);
    return false;
  }
};

// Email d'annulation
const sendCancellationEmail = async (booking, client, service, reason) => {
  try {
    const transporter = createTransporter();
    
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: client.email,
      subject: 'Annulation de votre rendez-vous - BEL Institut',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f8f9fa;">
          <div style="background: #757575; padding: 40px 20px; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 28px; font-weight: 300;">BEL Institut de Beauté</h1>
            <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0;">Annulation de rendez-vous</p>
          </div>
          
          <div style="padding: 40px 30px; background-color: white;">
            <h2 style="color: #333; margin-bottom: 20px;">Bonjour ${client.firstName} ${client.lastName},</h2>
            
            <p style="color: #666; line-height: 1.6; margin-bottom: 30px;">
              Votre rendez-vous du <strong>${new Date(booking.bookingDate).toLocaleDateString('fr-FR')}</strong> 
              à <strong>${new Date(booking.bookingDate).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}</strong> 
              pour <strong>${service.name}</strong> a été annulé.
            </p>
            
            ${reason ? `
            <div style="background-color: #fff3e0; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <p style="color: #e65100; margin: 0;"><strong>Motif :</strong> ${reason}</p>
            </div>
            ` : ''}
            
            <p style="color: #666; line-height: 1.6;">
              Nous espérons vous revoir bientôt chez BEL Institut. 
              N'hésitez pas à nous contacter pour prendre un nouveau rendez-vous.
            </p>
            
            <div style="text-align: center; margin: 30px 0; padding: 20px; background-color: #f8f9fa; border-radius: 8px;">
              <p style="color: #666; margin: 0;">📞 01 23 45 67 89</p>
              <p style="color: #666; margin: 5px 0 0 0;">📧 contact@bel-institut.fr</p>
            </div>
          </div>
          
          <div style="background-color: #f8f9fa; padding: 20px; text-align: center; border-top: 1px solid #e0e0e0;">
            <p style="color: #999; margin: 0; font-size: 12px;">
              BEL Institut de Beauté - 123 Rue de la Beauté, 75001 Paris
            </p>
          </div>
        </div>
      `
    };
    
    await transporter.sendMail(mailOptions);
    console.log(`✅ Email d'annulation envoyé à ${client.email}`);
    return true;
    
  } catch (error) {
    console.error('❌ Erreur envoi email annulation:', error);
    return false;
  }
};

module.exports = {
  sendBookingConfirmation,
  sendBookingReminder,
  sendCancellationEmail
};