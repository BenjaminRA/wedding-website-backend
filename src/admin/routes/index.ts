export default [
  {
    method: 'GET',
    path: '/guests-rsvp-stats',
    handler: 'guest.getRsvpStats',
    config: {
      auth: {
        scope: ['admin'],
      },
    },
  },
];
