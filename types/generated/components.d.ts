import type { Schema, Struct } from '@strapi/strapi';

export interface GiftUsListItem extends Struct.ComponentSchema {
  collectionName: 'components_gift_us_list_items';
  info: {
    displayName: 'List Item';
  };
  attributes: {
    amount: Schema.Attribute.String;
    icon: Schema.Attribute.Media<'images'>;
    name: Schema.Attribute.String;
    url: Schema.Attribute.String;
  };
}

export interface GiftUsListSection extends Struct.ComponentSchema {
  collectionName: 'components_gift_us_list_sections';
  info: {
    displayName: 'List Section';
  };
  attributes: {
    content: Schema.Attribute.RichText;
    iframe: Schema.Attribute.String;
    list: Schema.Attribute.Component<'gift.us-list-item', true>;
    title: Schema.Attribute.String;
  };
}

export interface ScheduleEvent extends Struct.ComponentSchema {
  collectionName: 'components_schedule_events';
  info: {
    displayName: 'Event';
  };
  attributes: {
    description: Schema.Attribute.Text;
    icon: Schema.Attribute.Media<'images'>;
    time: Schema.Attribute.String;
    title: Schema.Attribute.String;
  };
}

declare module '@strapi/strapi' {
  export module Public {
    export interface ComponentSchemas {
      'gift.us-list-item': GiftUsListItem;
      'gift.us-list-section': GiftUsListSection;
      'schedule.event': ScheduleEvent;
    }
  }
}
