// backend/utils/emailService.js
const nodemailer = require('nodemailer');

// Configuration du transporteur email
const createTransporter = () => {
  return nodemailer.createTransport({
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
      subject: 'Confirmation de votre rendez-vous - BEL Maquillage Permanent',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="margin: 0; padding: 0; background-color: #f5f5f0;">
          <div style="font-family: 'Georgia', 'Garamond', serif; max-width: 650px; margin: 0 auto; background-color: #ffffff;">
            
            <!-- Header avec style magazine -->
            <div style="background: linear-gradient(135deg, #2c2c2c 0%, #1a1a1a 100%); padding: 50px 40px; text-align: center; position: relative; overflow: hidden;">
              <div style="position: absolute; top: 0; left: 0; right: 0; bottom: 0; opacity: 0.1; background-image: repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(255,255,255,0.1) 10px, rgba(255,255,255,0.1) 20px);"></div>
              <h1 style="color: #d4af37; margin: 0; font-size: 36px; font-weight: 300; letter-spacing: 4px; text-transform: uppercase; position: relative;">BEL</h1>
              <p style="color: #ffffff; margin: 15px 0 0 0; font-size: 14px; letter-spacing: 2px; text-transform: uppercase; font-family: 'Arial', sans-serif; position: relative;">Maquillage Permanent</p>
              <div style="width: 60px; height: 1px; background: #d4af37; margin: 20px auto 0; position: relative;"></div>
            </div>
            
            <!-- Corps du message -->
            <div style="padding: 50px 40px; background-color: #ffffff;">
              
              <h2 style="color: #2c2c2c; margin: 0 0 30px 0; font-size: 24px; font-weight: 300; letter-spacing: 1px;">Chère ${client.firstName} ${client.lastName},</h2>
              
              <p style="color: #5a5a5a; line-height: 1.8; margin-bottom: 40px; font-size: 15px; font-family: 'Georgia', serif;">
                Votre rendez-vous a été confirmé avec succès. Nous sommes ravis de vous accueillir prochainement dans notre institut pour une expérience beauté d'exception.
              </p>
              
              <!-- Bloc détails avec style magazine -->
              <div style="background: linear-gradient(to right, #f8f8f5 0%, #ffffff 100%); padding: 35px; margin: 40px 0; border-left: 3px solid #d4af37; box-shadow: 0 2px 10px rgba(0,0,0,0.05);">
                <h3 style="margin: 0 0 25px 0; color: #2c2c2c; font-size: 16px; letter-spacing: 2px; text-transform: uppercase; font-weight: 400;">Votre Rendez-vous</h3>
                
                <table style="width: 100%; border-collapse: collapse;">
                  <tr>
                    <td style="padding: 12px 0; color: #8a8a8a; font-size: 13px; letter-spacing: 1px; text-transform: uppercase; font-family: 'Arial', sans-serif;">Prestation</td>
                    <td style="padding: 12px 0; color: #2c2c2c; font-size: 15px; text-align: right; font-weight: 400;">${service.name}</td>
                  </tr>
                  <tr style="border-top: 1px solid #e8e8e8;">
                    <td style="padding: 12px 0; color: #8a8a8a; font-size: 13px; letter-spacing: 1px; text-transform: uppercase; font-family: 'Arial', sans-serif;">Date</td>
                    <td style="padding: 12px 0; color: #2c2c2c; font-size: 15px; text-align: right;">${new Date(booking.bookingDate).toLocaleDateString('fr-FR', { 
                      weekday: 'long', 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}</td>
                  </tr>
                  <tr style="border-top: 1px solid #e8e8e8;">
                    <td style="padding: 12px 0; color: #8a8a8a; font-size: 13px; letter-spacing: 1px; text-transform: uppercase; font-family: 'Arial', sans-serif;">Heure</td>
                    <td style="padding: 12px 0; color: #2c2c2c; font-size: 15px; text-align: right;">${new Date(booking.bookingDate).toLocaleTimeString('fr-FR', { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}</td>
                  </tr>
                  <tr style="border-top: 1px solid #e8e8e8;">
                    <td style="padding: 12px 0; color: #8a8a8a; font-size: 13px; letter-spacing: 1px; text-transform: uppercase; font-family: 'Arial', sans-serif;">Durée</td>
                    <td style="padding: 12px 0; color: #2c2c2c; font-size: 15px; text-align: right;">${booking.duration} minutes</td>
                  </tr>
                  <tr style="border-top: 1px solid #e8e8e8;">
                    <td style="padding: 12px 0; color: #8a8a8a; font-size: 13px; letter-spacing: 1px; text-transform: uppercase; font-family: 'Arial', sans-serif;">Tarif</td>
                    <td style="padding: 12px 0; color: #d4af37; font-size: 18px; text-align: right; font-weight: 500;">${booking.totalPrice}€</td>
                  </tr>
                </table>
              </div>
              
              <!-- Adresse avec style épuré -->
              <div style="background-color: #fafaf8; padding: 35px; margin: 40px 0; border-radius: 2px;">
                <h3 style="margin: 0 0 20px 0; color: #2c2c2c; font-size: 13px; letter-spacing: 2px; text-transform: uppercase; font-weight: 400; font-family: 'Arial', sans-serif;">Notre Adresse</h3>
                <p style="margin: 0; color: #5a5a5a; line-height: 1.8; font-size: 15px;">
                  <strong style="color: #2c2c2c;">BEL Maquillage Permanent</strong><br>
                  59 route de la ferme du pavillon<br>
                  Pôle médical, 1er étage à droite<br>
                  77600 Chanteloup-en-Brie
                </p>
                <div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid #e8e8e8;">
                  <p style="margin: 0; color: #5a5a5a; font-size: 14px;">
                    <strong style="color: #2c2c2c;">Téléphone :</strong> 06 37 46 60 04
                  </p>
                  <p style="margin: 10px 0 0 0; color: #8a8a8a; font-size: 13px; font-style: italic;">
                    Vous pouvez sonner directement à la 2ème porte en arrivant
                  </p>
                </div>
              </div>
              
              <!-- Informations importantes avec style magazine -->
              <div style="border: 1px solid #e8e8e8; padding: 35px; margin: 40px 0;">
                <h3 style="margin: 0 0 25px 0; color: #2c2c2c; font-size: 13px; letter-spacing: 2px; text-transform: uppercase; font-weight: 400; font-family: 'Arial', sans-serif;">Informations Importantes</h3>
                
                <div style="color: #5a5a5a; line-height: 1.9; font-size: 14px;">
                  <p style="margin: 0 0 15px 0; padding-left: 20px; position: relative;">
                    <span style="position: absolute; left: 0; color: #d4af37;">•</span>
                    Pour les prestations de pigmentation : il est nécessaire d'être majeur et de ne pas être enceinte ou allaitante
                  </p>
                  <p style="margin: 0 0 15px 0; padding-left: 20px; position: relative;">
                    <span style="position: absolute; left: 0; color: #d4af37;">•</span>
                    Les accompagnateurs ne sont pas autorisés
                  </p>
                  <p style="margin: 0 0 15px 0; padding-left: 20px; position: relative;">
                    <span style="position: absolute; left: 0; color: #d4af37;">•</span>
                    Nous n'acceptons pas encore la carte bancaire. Le règlement se fera en espèces, PayPal ou Wero
                  </p>
                  <p style="margin: 0 0 15px 0; padding-left: 20px; position: relative;">
                    <span style="position: absolute; left: 0; color: #d4af37;">•</span>
                    En cas d'annulation ou de report, merci de prévenir au moins <strong>48 heures à l'avance</strong>
                  </p>
                  <p style="margin: 0; padding-left: 20px; position: relative;">
                    <span style="position: absolute; left: 0; color: #d4af37;">•</span>
                    Les prestations doivent être réglées intégralement le jour du rendez-vous
                  </p>
                </div>
              </div>
              
              ${booking.clientNotes ? `
              <div style="background-color: #f8f8f5; padding: 30px; margin: 40px 0; border-left: 3px solid #d4af37;">
                <h3 style="margin: 0 0 15px 0; color: #2c2c2c; font-size: 13px; letter-spacing: 2px; text-transform: uppercase; font-weight: 400; font-family: 'Arial', sans-serif;">Vos Notes</h3>
                <p style="margin: 0; color: #5a5a5a; font-style: italic; line-height: 1.8;">"${booking.clientNotes}"</p>
              </div>
              ` : ''}
              
              <div style="text-align: center; margin-top: 50px; padding-top: 40px; border-top: 1px solid #e8e8e8;">
                <p style="color: #5a5a5a; margin: 0; font-size: 15px; line-height: 1.8; font-style: italic;">
                  Nous avons hâte de vous accueillir<br>pour cette expérience beauté d'exception
                </p>
              </div>
              
            </div>
            
            <!-- Footer élégant -->
            <div style="background-color: #2c2c2c; padding: 40px; text-align: center;">
              <div style="width: 40px; height: 1px; background: #d4af37; margin: 0 auto 25px;"></div>
              
              <p style="color: #d4af37; margin: 0 0 15px 0; font-size: 12px; letter-spacing: 3px; text-transform: uppercase; font-family: 'Arial', sans-serif;">
                BEL Maquillage Permanent
              </p>
              
              <p style="color: #a0a0a0; margin: 0 0 5px 0; font-size: 13px; line-height: 1.6;">
                59 route de la ferme du pavillon, Pôle médical<br>
                77600 Chanteloup-en-Brie
              </p>
              
              <p style="color: #a0a0a0; margin: 15px 0 0 0; font-size: 13px;">
                06 37 46 60 04
              </p>
              
              <div style="margin-top: 30px; padding-top: 25px; border-top: 1px solid #404040;">
                <p style="color: #808080; margin: 0; font-size: 11px; line-height: 1.6; font-family: 'Arial', sans-serif;">
                  Cet email a été envoyé automatiquement suite à votre réservation.<br>
                  Pour toute question, n'hésitez pas à nous contacter.
                </p>
              </div>
            </div>
            
          </div>
        </body>
        </html>
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
      subject: 'Rappel : Votre rendez-vous demain - BEL Maquillage Permanent',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="margin: 0; padding: 0; background-color: #f5f5f0;">
          <div style="font-family: 'Georgia', 'Garamond', serif; max-width: 650px; margin: 0 auto; background-color: #ffffff;">
            
            <!-- Header rappel -->
            <div style="background: linear-gradient(135deg, #8b7355 0%, #6b5444 100%); padding: 50px 40px; text-align: center;">
              <h1 style="color: #ffffff; margin: 0; font-size: 36px; font-weight: 300; letter-spacing: 4px; text-transform: uppercase;">BEL</h1>
              <p style="color: rgba(255,255,255,0.9); margin: 15px 0 0 0; font-size: 14px; letter-spacing: 2px; text-transform: uppercase; font-family: 'Arial', sans-serif;">Maquillage Permanent</p>
              <div style="width: 60px; height: 1px; background: #ffffff; margin: 20px auto 0;"></div>
              <p style="color: rgba(255,255,255,0.85); margin: 25px 0 0 0; font-size: 13px; letter-spacing: 1px; text-transform: uppercase; font-family: 'Arial', sans-serif;">Rappel de rendez-vous</p>
            </div>
            
            <div style="padding: 50px 40px; background-color: #ffffff;">
              
              <h2 style="color: #2c2c2c; margin: 0 0 30px 0; font-size: 24px; font-weight: 300; letter-spacing: 1px;">Chère ${client.firstName},</h2>
              
              <p style="color: #5a5a5a; line-height: 1.8; margin-bottom: 40px; font-size: 15px;">
                Nous vous rappelons avec plaisir que vous avez rendez-vous demain chez BEL Maquillage Permanent.
              </p>
              
              <!-- Bloc central mise en avant -->
              <div style="background: linear-gradient(135deg, #8b7355 0%, #6b5444 100%); padding: 40px; text-align: center; color: white; margin: 40px 0; box-shadow: 0 4px 15px rgba(0,0,0,0.1);">
                <h3 style="margin: 0 0 20px 0; font-size: 26px; font-weight: 300; letter-spacing: 2px;">${service.name}</h3>
                <div style="width: 40px; height: 1px; background: rgba(255,255,255,0.5); margin: 0 auto 20px;"></div>
                <p style="margin: 0; font-size: 18px; opacity: 0.95; line-height: 1.6;">
                  ${new Date(booking.bookingDate).toLocaleDateString('fr-FR', { 
                    weekday: 'long', 
                    day: 'numeric', 
                    month: 'long' 
                  })}
                </p>
                <p style="margin: 10px 0 0 0; font-size: 22px; font-weight: 500; letter-spacing: 2px;">
                  ${new Date(booking.bookingDate).toLocaleTimeString('fr-FR', { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  })}
                </p>
              </div>
              
              <!-- Informations pratiques -->
              <div style="background-color: #fafaf8; padding: 35px; margin: 40px 0;">
                <h3 style="margin: 0 0 20px 0; color: #2c2c2c; font-size: 13px; letter-spacing: 2px; text-transform: uppercase; font-weight: 400; font-family: 'Arial', sans-serif;">Nous Retrouver</h3>
                <p style="margin: 0; color: #5a5a5a; line-height: 1.8; font-size: 15px;">
                  <strong style="color: #2c2c2c;">BEL Maquillage Permanent</strong><br>
                  59 route de la ferme du pavillon<br>
                  Pôle médical, 1er étage à droite<br>
                  77600 Chanteloup-en-Brie
                </p>
                <div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid #e8e8e8;">
                  <p style="margin: 0; color: #5a5a5a; font-size: 14px;">
                    <strong style="color: #2c2c2c;">Contact :</strong> 06 37 46 60 04
                  </p>
                  <p style="margin: 10px 0 0 0; color: #8a8a8a; font-size: 13px; font-style: italic;">
                    Sonnez à la 2ème porte en arrivant
                  </p>
                </div>
              </div>
              
              <!-- Rappels importants -->
              <div style="border-left: 3px solid #8b7355; padding: 30px; margin: 40px 0; background-color: #f8f8f5;">
                <h3 style="margin: 0 0 20px 0; color: #2c2c2c; font-size: 13px; letter-spacing: 2px; text-transform: uppercase; font-weight: 400; font-family: 'Arial', sans-serif;">Rappels Importants</h3>
                <div style="color: #5a5a5a; line-height: 1.9; font-size: 14px;">
                  <p style="margin: 0 0 12px 0;">• Les accompagnateurs ne sont pas autorisés</p>
                  <p style="margin: 0 0 12px 0;">• Règlement en espèces, PayPal ou Wero (carte bancaire non acceptée)</p>
                  <p style="margin: 0;">• Le montant complet est à régler le jour du rendez-vous</p>
                </div>
              </div>
              
              <div style="text-align: center; margin-top: 50px;">
                <p style="color: #8b7355; margin: 0; font-size: 16px; font-style: italic; letter-spacing: 0.5px;">
                  Nous avons hâte de vous retrouver ✨
                </p>
              </div>
              
            </div>
            
            <!-- Footer -->
            <div style="background-color: #2c2c2c; padding: 30px; text-align: center;">
              <p style="color: #d4af37; margin: 0; font-size: 12px; letter-spacing: 3px; text-transform: uppercase; font-family: 'Arial', sans-serif;">
                BEL Maquillage Permanent
              </p>
              <p style="color: #a0a0a0; margin: 15px 0 0 0; font-size: 13px;">
                À très bientôt !
              </p>
            </div>
            
          </div>
        </body>
        </html>
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
      subject: 'Annulation de votre rendez-vous - BEL Maquillage Permanent',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="margin: 0; padding: 0; background-color: #f5f5f0;">
          <div style="font-family: 'Georgia', 'Garamond', serif; max-width: 650px; margin: 0 auto; background-color: #ffffff;">
            
            <!-- Header annulation -->
            <div style="background: #5a5a5a; padding: 50px 40px; text-align: center;">
              <h1 style="color: #ffffff; margin: 0; font-size: 36px; font-weight: 300; letter-spacing: 4px; text-transform: uppercase;">BEL</h1>
              <p style="color: rgba(255,255,255,0.9); margin: 15px 0 0 0; font-size: 14px; letter-spacing: 2px; text-transform: uppercase; font-family: 'Arial', sans-serif;">Maquillage Permanent</p>
              <div style="width: 60px; height: 1px; background: #ffffff; margin: 20px auto 0;"></div>
              <p style="color: rgba(255,255,255,0.8); margin: 25px 0 0 0; font-size: 13px; letter-spacing: 1px; text-transform: uppercase; font-family: 'Arial', sans-serif;">Annulation de rendez-vous</p>
            </div>
            
            <div style="padding: 50px 40px; background-color: #ffffff;">
              
              <h2 style="color: #2c2c2c; margin: 0 0 30px 0; font-size: 24px; font-weight: 300; letter-spacing: 1px;">Chère ${client.firstName} ${client.lastName},</h2>
              
              <p style="color: #5a5a5a; line-height: 1.8; margin-bottom: 30px; font-size: 15px;">
                Votre rendez-vous du <strong style="color: #2c2c2c;">${new Date(booking.bookingDate).toLocaleDateString('fr-FR')}</strong> 
                à <strong style="color: #2c2c2c;">${new Date(booking.bookingDate).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}</strong> 
                pour <strong style="color: #2c2c2c;">${service.name}</strong> a été annulé.
              </p>
              
              ${reason ? `
              <div style="background-color: #fff8f0; padding: 30px; margin: 30px 0; border-left: 3px solid #c89666;">
                <h3 style="margin: 0 0 15px 0; color: #2c2c2c; font-size: 13px; letter-spacing: 2px; text-transform: uppercase; font-weight: 400; font-family: 'Arial', sans-serif;">Motif</h3>
                <p style="color: #5a5a5a; margin: 0; line-height: 1.6;">${reason}</p>
              </div>
              ` : ''}
              
              <p style="color: #5a5a5a; line-height: 1.8; margin: 40px 0; font-size: 15px;">
                Nous espérons avoir le plaisir de vous accueillir prochainement chez BEL Maquillage Permanent. 
                N'hésitez pas à nous contacter pour prendre un nouveau rendez-vous.
              </p>
              
              <!-- Contact -->
              <div style="background-color: #fafaf8; padding: 35px; text-align: center; margin: 40px 0;">
                <h3 style="margin: 0 0 20px 0; color: #2c2c2c; font-size: 13px; letter-spacing: 2px; text-transform: uppercase; font-weight: 400; font-family: 'Arial', sans-serif;">Nous Contacter</h3>
                <p style="color: #5a5a5a; margin: 0 0 10px 0; font-size: 15px;">
                  <strong style="color: #2c2c2c;">Téléphone :</strong> 06 37 46 60 04
                </p>
                <p style="color: #5a5a5a; margin: 0; font-size: 14px;">
                  59 route de la ferme du pavillon<br>
                  77600 Chanteloup-en-Brie
                </p>
              </div>
              
              <div style="text-align: center; margin-top: 50px; padding-top: 40px; border-top: 1px solid #e8e8e8;">
                <p style="color: #8a8a8a; margin: 0; font-size: 14px; font-style: italic;">
                  À bientôt chez BEL Maquillage Permanent
                </p>
              </div>
              
            </div>
            
            <!-- Footer -->
            <div style="background-color: #2c2c2c; padding: 30px; text-align: center;">
              <p style="color: #d4af37; margin: 0; font-size: 12px; letter-spacing: 3px; text-transform: uppercase; font-family: 'Arial', sans-serif;">
                BEL Maquillage Permanent
              </p>
              <p style="color: #a0a0a0; margin: 15px 0 0 0; font-size: 13px;">
                59 route de la ferme du pavillon, 77600 Chanteloup-en-Brie
              </p>
            </div>
            
          </div>
        </body>
        </html>
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
