export default {
  async find(ctx) {
    const { locale } = ctx.query;
    const entity = await strapi.entityService.findMany('api::gallery.gallery', {
      locale: locale || 'en',
      populate: '*',
    });
    return entity;
  },
};
