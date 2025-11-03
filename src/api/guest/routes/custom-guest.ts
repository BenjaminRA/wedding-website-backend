/**
 * Custom guest routes
 */

export default {
  routes: [
    {
      method: 'POST',
      path: '/guests/find-with-password',
      handler: 'guest.findWithPassword',
      config: {
        policies: [],
        middlewares: [],
      },
    },
    // {
    //   method: 'GET',
    //   path: '/guests-rsvp-stats',
    //   handler: 'guest.getRsvpStats',
    //   config: {
    //     policies: [],
    //     middlewares: [],
    //   },
    // },
  ],
};
