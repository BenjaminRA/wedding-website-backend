/**
 * guest controller
 */

import { factories } from '@strapi/strapi';

export default factories.createCoreController(
  'api::guest.guest',
  ({ strapi }) => ({
    // Custom endpoint to find guest with password validation
    async findWithPassword(ctx) {
      try {
        const { firstName, lastName, password } = ctx.request.body;

        if (!firstName || !lastName || !password) {
          return ctx.badRequest(
            'Missing required fields: firstName, lastName, password'
          );
        }

        // Get the password from the password single type
        const passwordData = await strapi.entityService.findMany(
          'api::password.password',
          {
            fields: ['password'],
          }
        );

        // Validate password
        if (!passwordData || passwordData.password !== password) {
          return ctx.unauthorized('Invalid password');
        }

        // If password is correct, find the guest
        const guests = await strapi.entityService.findMany('api::guest.guest', {
          filters: {
            firstName: { $eq: firstName },
            lastName: { $eq: lastName },
          },
        });

        if (!guests || guests.length === 0) {
          return ctx.notFound('Guest not found');
        }

        // Return the first matching guest
        return { data: guests[0] };
      } catch (err) {
        console.error('Error in findWithPassword:', err);
        return ctx.internalServerError('An error occurred');
      }
    },

    // Custom endpoint to get RSVP statistics for admin dashboard
    async getRsvpStats(ctx) {
      try {
        const guests = await strapi.entityService.findMany('api::guest.guest', {
          fields: ['firstName', 'lastName', 'rsvp', 'attending'],
        });

        return { data: guests };
      } catch (err) {
        console.error('Error in getRsvpStats:', err);
        return ctx.internalServerError('An error occurred');
      }
    },
  })
);
