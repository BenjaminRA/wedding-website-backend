export default {
  async find(ctx) {
    const { locale } = ctx.query;
    const entity = await strapi.entityService.findMany('api::schedule.schedule', {
      locale: locale || 'en',
      populate: '*',
    });
    return entity;
  },
};
