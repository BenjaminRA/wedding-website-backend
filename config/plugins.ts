export default ({ env }) => ({
  'advanced-fields': {
    enabled: true,
  },
  email: {
    config: {
      provider: 'nodemailer',
      providerOptions: {
        host: env('MAIL_HOST'),
        port: env('MAIL_PORT'),
        auth: {
          user: env('MAIL_USERNAME'),
          pass: env('MAIL_PASSWORD'),
        },
      },
      settings: {
        defaultFrom: env('MAIL_USERNAME'),
        defaultReplyTo: env('MAIL_USERNAME'),
      },
    },
  },
});
