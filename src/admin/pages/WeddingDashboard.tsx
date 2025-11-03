import React from 'react';
import { Grid, Box } from '@strapi/design-system';
import RsvpStatsWidget from '../components/RsvpStatsWidget';
import WeddingCountdownWidget from '../components/WeddingCountdownWidget';
import QuickActionsWidget from '../components/QuickActionsWidget';

const CustomHomepage = () => {
  return (
    <Box padding={10}>
      <Grid.Root gap={4}>
        <Grid.Item
          col={4}
          s={12}
        >
          <RsvpStatsWidget />
        </Grid.Item>
        <Grid.Item
          col={4}
          s={12}
        >
          <WeddingCountdownWidget />
        </Grid.Item>
        <Grid.Item
          col={4}
          s={12}
        >
          <QuickActionsWidget />
        </Grid.Item>
      </Grid.Root>
    </Box>
  );
};

export default CustomHomepage;
