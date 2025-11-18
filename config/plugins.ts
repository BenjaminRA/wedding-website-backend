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
  upload: {
    config: {
      providerOptions: {
        localServer: {
          maxage: 300000,
        },
      },
      sizeLimit: 250 * 1024 * 1024, // 250MB
      breakpoints: {
        xlarge: 1920,
        large: 1000,
        medium: 750,
        small: 500,
        xsmall: 64,
      },
      // Fix image rotation by auto-rotating based on EXIF orientation
      // and then removing the EXIF orientation tag
      sharp: {
        withMetadata: false, // Remove EXIF metadata including orientation
        rotate: null, // Let Sharp auto-rotate based on EXIF
      },
    },
  },
});
