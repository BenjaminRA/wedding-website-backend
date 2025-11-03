import type { Schema, Struct } from '@strapi/strapi';

export interface GiftRegistryLink extends Struct.ComponentSchema {
  collectionName: 'components_gift_registry_links';
  info: {
    description: 'Gift registry link';
    displayName: 'Registry Link';
  };
  attributes: {
    name: Schema.Attribute.String;
    url: Schema.Attribute.String;
  };
}

export interface ScheduleEvent extends Struct.ComponentSchema {
  collectionName: 'components_schedule_events';
  info: {
    description: 'Schedule event';
    displayName: 'Event';
  };
  attributes: {
    description: Schema.Attribute.Text;
    time: Schema.Attribute.String;
    title: Schema.Attribute.String;
  };
}

declare module '@strapi/strapi' {
  export module Public {
    export interface ComponentSchemas {
      'gift.registry-link': GiftRegistryLink;
      'schedule.event': ScheduleEvent;
    }
  }
}
