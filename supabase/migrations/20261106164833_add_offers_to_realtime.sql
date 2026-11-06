-- Add offers table to realtime publication so the unread count updates live
ALTER PUBLICATION supabase_realtime ADD TABLE offers;