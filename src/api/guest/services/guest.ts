/**
 * guest service
 */

import { factories } from '@strapi/strapi';
import { createRSVPEmailTemplate } from './emailTemplate';

export default factories.createCoreService(
  'api::guest.guest',
  ({ strapi }) => ({
    async sendRSVPNotification(guestGroup: any, updatedGuests: any[]) {
      try {
        const emailHtml = createRSVPEmailTemplate(guestGroup, updatedGuests);

        await strapi.plugins['email'].services.email.send({
          to: process.env.MAIL_RECIPIENT!.split(';'),
          from: process.env.MAIL_USERNAME,
          subject: `New RSVP: ${guestGroup.groupName.replace(/%%.*?%%/g, '').trim()}`,
          html: emailHtml,
        });

        strapi.log.info(
          `RSVP notification email sent for group: ${guestGroup.groupName}`
        );
      } catch (error) {
        strapi.log.error('Failed to send RSVP notification email:', error);
        throw error;
      }
    },
  })
);
