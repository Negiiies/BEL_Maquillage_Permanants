// backend/controllers/inscriptionController.js
const nodemailer = require('nodemailer');

// Configuration du transporteur email (réutilise la config existante)
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Envoyer une demande d'inscription à une formation
exports.sendInscriptionRequest = async (req, res) => {
  try {
    const { 
      firstName, 
      lastName, 
      phone, 
      email, 
      message, 
      formationTitle,
      formationId 
    } = req.body;

    // Validation
    if (!firstName || !lastName || !phone || !email || !formationTitle) {
      return res.status(400).json({
        success: false,
        message: 'Tous les champs obligatoires doivent être remplis'
      });
    }

    // Validation email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Email invalide'
      });
    }

    // Validation téléphone français
    const phoneRegex = /^(?:(?:\+|00)33|0)\s*[1-9](?:[\s.-]*\d{2}){4}$/;
    if (!phoneRegex.test(phone)) {
      return res.status(400).json({
        success: false,
        message: 'Numéro de téléphone invalide'
      });
    }

    // Créer le contenu de l'email pour l'admin
    const emailContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .info-row { margin: 15px 0; padding: 15px; background: white; border-radius: 8px; border-left: 4px solid #667eea; }
          .label { font-weight: bold; color: #667eea; margin-bottom: 5px; }
          .value { color: #333; }
          .formation { background: #667eea; color: white; padding: 15px; border-radius: 8px; margin: 20px 0; text-align: center; font-size: 18px; }
          .footer { text-align: center; margin-top: 30px; color: #999; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>📚 Nouvelle Demande d'Inscription</h1>
            <p>BEL Institut de Beauté</p>
          </div>
          
          <div class="content">
            <div class="formation">
              <strong>Formation :</strong> ${formationTitle}
            </div>

            <div class="info-row">
              <div class="label">👤 Nom complet</div>
              <div class="value">${firstName} ${lastName}</div>
            </div>

            <div class="info-row">
              <div class="label">📧 Email</div>
              <div class="value"><a href="mailto:${email}">${email}</a></div>
            </div>

            <div class="info-row">
              <div class="label">📱 Téléphone</div>
              <div class="value"><a href="tel:${phone}">${phone}</a></div>
            </div>

            ${message ? `
            <div class="info-row">
              <div class="label">💬 Message</div>
              <div class="value">${message}</div>
            </div>
            ` : ''}

            <div class="footer">
              <p>Demande reçue le ${new Date().toLocaleDateString('fr-FR', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}</p>
            </div>
          </div>
        </div>
      </body>
      </html>
    `;

    // Email de confirmation pour le client
    const clientEmailContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .message { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; }
          .formation { background: #667eea; color: white; padding: 15px; border-radius: 8px; margin: 20px 0; text-align: center; }
          .footer { text-align: center; margin-top: 30px; color: #999; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>✅ Demande d'inscription reçue</h1>
            <p>BEL Institut de Beauté</p>
          </div>
          
          <div class="content">
            <div class="message">
              <p>Bonjour ${firstName},</p>
              <p>Nous avons bien reçu votre demande d'inscription pour la formation :</p>
              
              <div class="formation">
                <strong>${formationTitle}</strong>
              </div>

              <p>Notre équipe va examiner votre demande et vous recontactera dans les plus brefs délais pour valider votre inscription et vous fournir tous les détails nécessaires.</p>
              
              <p>Si vous avez des questions, n'hésitez pas à nous contacter.</p>
              
              <p>À très bientôt,<br><strong>L'équipe BEL Institut</strong></p>
            </div>

            <div class="footer">
              <p>BEL Institut de Beauté - Formations professionnelles</p>
            </div>
          </div>
        </div>
      </body>
      </html>
    `;

    // Envoyer l'email à l'admin
    await transporter.sendMail({
      from: `"BEL Institut - Inscriptions" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_USER, // Email de ta sœur
      subject: `📚 Nouvelle inscription - ${formationTitle}`,
      html: emailContent,
      replyTo: email
    });

    // Envoyer l'email de confirmation au client
    await transporter.sendMail({
      from: `"BEL Institut de Beauté" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: `✅ Demande d'inscription reçue - ${formationTitle}`,
      html: clientEmailContent
    });

    res.status(200).json({
      success: true,
      message: 'Demande d\'inscription envoyée avec succès'
    });

  } catch (error) {
    console.error('Erreur inscription formation:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de l\'envoi de la demande',
      error: error.message
    });
  }
};