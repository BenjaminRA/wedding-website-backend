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
    {
      method: 'POST',
      path: '/guests/submit-rsvp',
      handler: 'guest.submitRSVP',
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: 'GET',
      path: '/guests/export-csv',
      handler: 'guest.exportCSV',
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: 'POST',
      path: '/guests/import-csv',
      handler: 'guest.importCSV',
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
