import React from 'react';
import { Box, Typography, Button, Flex } from '@strapi/design-system';
import { Plus, Eye, Upload } from '@strapi/icons';
import { useNavigate } from 'react-router-dom';

const QuickActionsWidget = () => {
  const navigate = useNavigate();

  return (
    <Box padding={4} background="neutral0" hasRadius shadow="tableShadow">
      <Typography variant="sigma" textColor="neutral600" fontWeight="bold">
        ⚡ QUICK ACTIONS
      </Typography>
      
      <Flex direction="column" gap={2} paddingTop={3}>
        <Button
          startIcon={<Plus />}
          variant="secondary"
          onClick={() => navigate('/content-manager/collection-types/api::guest.guest/create')}
          fullWidth
        >
          Add New Guest
        </Button>

        <Button
          startIcon={<Eye />}
          variant="secondary"
          onClick={() => navigate('/content-manager/collection-types/api::guest.guest')}
          fullWidth
        >
          View All Guests
        </Button>

        <Button
          startIcon={<Upload />}
          variant="secondary"
          onClick={() => navigate('/content-manager/collection-types/api::gallery.gallery/create')}
          fullWidth
        >
          Upload Gallery Photo
        </Button>
      </Flex>
    </Box>
  );
};

export default QuickActionsWidget;
