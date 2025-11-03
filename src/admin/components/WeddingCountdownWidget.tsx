import React, { useEffect, useState } from 'react';
import { Box, Typography } from '@strapi/design-system';
import { useFetchClient } from '@strapi/admin/strapi-admin';

const WeddingCountdownWidget = () => {
  const { get } = useFetchClient();
  const [weddingDate, setWeddingDate] = useState<Date | null>(null);
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWeddingDate = async () => {
      try {
        const { data } = await get('/welcome');
        
        if (data?.data?.weddingDate) {
          const date = new Date(data.data.weddingDate);
          setWeddingDate(date);
        }
      } catch (error) {
        console.error('Error fetching wedding date:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchWeddingDate();
  }, [get]);

  useEffect(() => {
    if (!weddingDate) return;

    const calculateTimeLeft = () => {
      const now = new Date();
      const diff = weddingDate.getTime() - now.getTime();

      if (diff <= 0) {
        return { days: 0, hours: 0, minutes: 0 };
      }

      return {
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
      };
    };

    setTimeLeft(calculateTimeLeft());

    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 60000); // Update every minute

    return () => clearInterval(timer);
  }, [weddingDate]);

  if (loading) {
    return (
      <Box padding={4} background="neutral0" hasRadius shadow="tableShadow">
        <Typography variant="sigma" textColor="neutral600">
          Loading...
        </Typography>
      </Box>
    );
  }

  if (!weddingDate) {
    return (
      <Box padding={4} background="neutral0" hasRadius shadow="tableShadow">
        <Typography variant="sigma" textColor="neutral600" fontWeight="bold">
          📅 WEDDING COUNTDOWN
        </Typography>
        <Typography variant="omega" textColor="neutral600" paddingTop={2}>
          Set wedding date in Welcome content type
        </Typography>
      </Box>
    );
  }

  return (
    <Box padding={4} background="primary100" hasRadius shadow="tableShadow">
      <Typography variant="sigma" textColor="primary700" fontWeight="bold">
        📅 WEDDING COUNTDOWN
      </Typography>
      
      <Box paddingTop={3}>
        <Typography variant="alpha" fontWeight="bold" textColor="primary600">
          {timeLeft.days}
        </Typography>
        <Typography variant="pi" textColor="primary600">
          Days to go!
        </Typography>
      </Box>

      {timeLeft.days < 30 && (
        <Box paddingTop={2}>
          <Typography variant="omega" textColor="primary600">
            {timeLeft.hours}h {timeLeft.minutes}m
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default WeddingCountdownWidget;
