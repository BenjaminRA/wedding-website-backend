import React, { useEffect, useState } from 'react';
import { Box, Typography, Flex } from '@strapi/design-system';
import { useFetchClient } from '@strapi/admin/strapi-admin';

const RsvpStatsWidget = () => {
  const { get } = useFetchClient();
  const [stats, setStats] = useState({
    total: 0,
    rsvped: 0,
    attending: 0,
    pending: 0,
    percentage: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await get('/api/admin-api/rsvp-stats');

        console.log('Fetched guests data:', data);

        const guests = data?.data || [];
        const total = guests.length;
        const rsvped = guests.filter((g: any) => g.rsvp === true).length;
        const attending = guests.filter(
          (g: any) => g.attending === true
        ).length;
        const pending = total - rsvped;
        const percentage =
          total > 0 ? Math.round((attending / total) * 100) : 0;

        setStats({ total, rsvped, attending, pending, percentage });
      } catch (error) {
        console.error('Error fetching RSVP stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [get]);

  if (loading) {
    return (
      <Box
        padding={4}
        background="neutral0"
        hasRadius
        shadow="tableShadow"
      >
        <Typography
          variant="sigma"
          textColor="neutral600"
        >
          Loading...
        </Typography>
      </Box>
    );
  }

  return (
    <Box
      padding={4}
      background="neutral0"
      hasRadius
      shadow="tableShadow"
    >
      <Typography
        variant="sigma"
        textColor="neutral600"
        fontWeight="bold"
      >
        💍 RSVP STATISTICS
      </Typography>

      <Flex
        direction="column"
        gap={3}
        paddingTop={3}
      >
        <Box>
          <Typography
            variant="alpha"
            fontWeight="bold"
            textColor="primary600"
          >
            {stats.attending} / {stats.total}
          </Typography>
          <Typography
            variant="pi"
            textColor="neutral600"
          >
            Guests Attending ({stats.percentage}%)
          </Typography>
        </Box>

        <Flex gap={4}>
          <Box>
            <Typography
              variant="beta"
              fontWeight="semiBold"
              textColor="success600"
            >
              {stats.rsvped}
            </Typography>
            <Typography
              variant="pi"
              textColor="neutral600"
            >
              Confirmed
            </Typography>
          </Box>

          <Box>
            <Typography
              variant="beta"
              fontWeight="semiBold"
              textColor="warning600"
            >
              {stats.pending}
            </Typography>
            <Typography
              variant="pi"
              textColor="neutral600"
            >
              Pending
            </Typography>
          </Box>
        </Flex>
      </Flex>
    </Box>
  );
};

export default RsvpStatsWidget;
