import type { StrapiApp } from '@strapi/strapi/admin';
import WeddingDashboard from './pages/WeddingDashboard';

export default {
  config: {
    // Replace the Strapi logo in the auth pages
    auth: {
      logo: undefined,
    },
    // Replace the favicon
    head: {
      favicon: undefined,
    },
    // Customize the admin panel
    locales: ['en', 'es'],
    // Add translations
    translations: {
      en: {
        'app.components.HomePage.welcome':
          'Welcome to your Wedding Admin Panel! 💍',
        'app.components.HomePage.welcomeBlock.content':
          'Manage your wedding website, guests, RSVPs, and more.',
      },
      es: {
        'app.components.HomePage.welcome':
          '¡Bienvenido al Panel de Administración de tu Boda! 💍',
        'app.components.HomePage.welcomeBlock.content':
          'Administra tu sitio web de boda, invitados, confirmaciones y más.',
      },
    },
    // Extend the admin panel theme
    // theme: {
    //   light: {
    //     colors: {
    //       primary600: '#d4af37',
    //       primary500: '#d4af37',
    //       primary400: '#e5c964',
    //     },
    //   },
    //   dark: {
    //     colors: {
    //       primary600: '#d4af37',
    //       primary500: '#d4af37',
    //       primary400: '#e5c964',
    //     },
    //   },
    // },
    // Disable some parts of the UI
    tutorials: false,
    // Disable notifications about new Strapi releases
    notifications: { releases: false },
  },
  bootstrap(app: StrapiApp) {
    console.log('Wedding Admin Panel loaded! 💍');

    // Add custom homepage widgets using Strapi v5 API
    app.addMenuLink({
      to: '/wedding-dashboard',
      icon: () => (
        <svg
          width="20"
          height="20"
          viewBox="0 0 50 50"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle
            cx="25"
            cy="25"
            r="20"
            fill="none"
            stroke="#c0c0cf"
            stroke-width="4"
          />
          <circle
            cx="25"
            cy="25"
            r="16"
            fill="none"
            stroke="#c0c0cf"
            stroke-width="4"
          />
        </svg>
      ),
      position: 0,
      intlLabel: {
        id: 'wedding-dashboard.title',
        defaultMessage: 'Wedding Dashboard',
      },
      permissions: [],
      Component: async () => {
        return { default: WeddingDashboard };
      },
    });
  },
};
