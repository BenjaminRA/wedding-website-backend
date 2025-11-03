export default {
  async find(ctx) {
    const { locale } = ctx.query;
    const entity = await strapi.entityService.findMany('api::dress-code.dress-code', {
      locale: locale || 'en',
      populate: '*',
    });
    return entity;
  },
};
