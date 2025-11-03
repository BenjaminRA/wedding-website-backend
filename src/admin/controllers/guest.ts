/**
 * guest controller
 */

import type { Context } from 'koa';

export default {
  async getRsvpStats(ctx: Context) {
    try {
      const guests = await strapi.entityService.findMany('api::guest.guest', {
        fields: ['firstName', 'lastName', 'rsvp', 'attending'],
      });

      console.log(guests);

      ctx.body = { test: 'asdasdasd', data: guests };
    } catch (err) {
      console.error('Error in getRsvpStats:', err);
      ctx.throw(500, 'An error occurred');
    }
  },
};
