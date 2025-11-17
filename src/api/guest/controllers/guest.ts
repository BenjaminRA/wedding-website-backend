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
        if (
          !passwordData ||
          passwordData.password.trim().toLocaleUpperCase() !==
            password.trim().toLocaleUpperCase()
        ) {
          return ctx.unauthorized('Invalid password');
        }

        // Normalize strings to remove accents and make case-insensitive
        const normalizeString = (str: string) =>
          str
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .toLowerCase();

        const normalizedFirstName = normalizeString(firstName);
        const normalizedLastName = normalizeString(lastName);

        // Get all guests and filter in-memory for accent and case insensitivity
        const allGuests = await strapi.entityService.findMany(
          'api::guest.guest',
          {
            populate: ['guest_group', 'guest_group.guests'],
          }
        );

        const guests = allGuests.filter((guest: any) => {
          const guestFirstName = normalizeString(guest.firstName || '');
          const guestLastName = normalizeString(guest.lastName || '');
          return (
            guestFirstName === normalizedFirstName &&
            guestLastName === normalizedLastName
          );
        });

        if (!guests || guests.length === 0) {
          return ctx.notFound('Guest not found');
        }

        // const groupedGuests = await strapi.entityService.findMany(
        //   'api::guest-group.guest-group',
        //   {
        //     filters: {
        //       groupName: { $eq: 'Rodríguez Schneider' },
        //     },
        //     populate: ['guests'],
        //   }
        // );

        // Return the first matching guest
        return {
          data: guests[0],
          // group: groupedGuests
        };
      } catch (err) {
        console.error('Error in findWithPassword:', err);
        return ctx.internalServerError('An error occurred');
      }
    },

    // Custom endpoint to submit RSVP responses
    async submitRSVP(ctx) {
      try {
        const { guests, guest_group_id, wishes } = ctx.request.body;

        if (!guests || !Array.isArray(guests)) {
          return ctx.badRequest('guests array is required');
        }

        // Update each guest's RSVP status
        const updatedGuests = await Promise.all(
          guests.map(async (guest: { id: number; attending: boolean }) => {
            if (!guest.id || typeof guest.attending !== 'boolean') {
              throw new Error('Each guest must have id and attending fields');
            }

            await strapi.entityService.update(
              'api::guest-group.guest-group',
              guest_group_id,
              {
                data: {
                  wishes: wishes,
                },
              }
            );

            return await strapi.entityService.update(
              'api::guest.guest',
              guest.id,
              {
                data: {
                  rsvp: true,
                  attending: guest.attending,
                },
              }
            );
          })
        );

        // Get the guest group with all details for the email
        const guestGroup = await strapi.entityService.findOne(
          'api::guest-group.guest-group',
          guest_group_id,
          {
            populate: ['guests'],
          }
        );

        // Send email notification
        try {
          await strapi
            .service('api::guest.guest')
            .sendRSVPNotification(guestGroup, updatedGuests);
        } catch (emailError) {
          // Log the error but don't fail the RSVP submission
          console.error('Failed to send email notification:', emailError);
        }

        return { data: updatedGuests };
      } catch (err) {
        console.error('Error in submitRSVP:', err);
        return ctx.internalServerError('An error occurred');
      }
    },

    // // Custom endpoint to get RSVP statistics for admin dashboard
    // async submitRSVP(ctx) {
    //   try {
    //     const guests = ctx.request.body;

    //     for (const guestUpdate of guests) {
    //       const { id, rsvp, attending } = guestUpdate;
    //       await strapi.entityService.update('api::guest.guest', id, {
    //         data: {
    //           rsvp,
    //           attending,
    //         },
    //       });
    //     }

    //     // const guests = await strapi.entityService.findMany('api::guest.guest', {
    //     //   fields: ['firstName', 'lastName', 'rsvp', 'attending'],
    //     // });
    //     return { data: guests };
    //   } catch (err) {
    //     console.error('Error in getRsvpStats:', err);
    //     return ctx.internalServerError('An error occurred');
    //   }
    // },
  })
);
