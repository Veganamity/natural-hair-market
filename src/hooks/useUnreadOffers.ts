import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from '../contexts/AuthContext';

export function useUnreadOffersCount() {
  const { user } = useAuth();
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchUnreadCount = async () => {
    if (!user) {
      setUnreadCount(0);
      setLoading(false);
      return;
    }

    try {
      let totalUnread = 0;

      const { data: listings } = await supabase
        .from('listings')
        .select('id')
        .eq('seller_id', user.id);

      if (listings && listings.length > 0) {
        const listingIds = listings.map(l => l.id);

        const { count: sellerUnread } = await supabase
          .from('offers')
          .select('*', { count: 'exact', head: true })
          .in('listing_id', listingIds)
          .eq('seller_read', false)
          .eq('status', 'pending');

        totalUnread += sellerUnread || 0;
      }

      const { count: buyerUnread } = await supabase
        .from('offers')
        .select('*', { count: 'exact', head: true })
        .eq('buyer_id', user.id)
        .eq('buyer_read_status', false);

      totalUnread += buyerUnread || 0;

      setUnreadCount(totalUnread);
    } catch (error) {
      console.error('Error fetching unread offers count:', error);
      setUnreadCount(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUnreadCount();

    const subscription = supabase
      .channel('offers_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'offers',
        },
        () => {
          fetchUnreadCount();
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [user]);

  return { unreadCount, loading, refresh: fetchUnreadCount };
}
