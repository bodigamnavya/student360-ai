'use client';

import React, { useEffect, useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { api } from '@/lib/api';
import { formatDate } from '@/lib/utils';
import {
  Bell,
  Check,
  CheckCheck,
  Sparkles,
  AlertTriangle,
  Info,
  Calendar,
  Briefcase,
  GraduationCap,
  Trash2
} from 'lucide-react';

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const loadNotifications = async () => {
    setLoading(true);
    const res = await api.get('/notifications');
    if (res.success && res.data) setNotifications(res.data);
    setLoading(false);
  };

  useEffect(() => {
    loadNotifications();
  }, []);

  const markAllRead = async () => {
    await api.put('/notifications/read-all', {});
    await loadNotifications();
  };

  const markRead = async (id: string) => {
    await api.put(`/notifications/${id}/read`, {});
    await loadNotifications();
  };

  const deleteNotification = async (id: string) => {
    await api.delete(`/notifications/${id}`);
    await loadNotifications();
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  const getIcon = (type: string) => {
    switch (type) {
      case 'ai_insight': return <Sparkles className="w-4 h-4 text-purple-500" />;
      case 'alert': return <AlertTriangle className="w-4 h-4 text-amber-500" />;
      case 'placement': return <Briefcase className="w-4 h-4 text-blue-500" />;
      case 'academic': return <GraduationCap className="w-4 h-4 text-indigo-500" />;
      case 'deadline': return <Calendar className="w-4 h-4 text-rose-500" />;
      default: return <Info className="w-4 h-4 text-primary" />;
    }
  };

  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto space-y-8 pb-12">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-heading font-extrabold text-foreground flex items-center gap-2">
              <Bell className="w-6 h-6 text-primary" />
              Notification Center
            </h1>
            <p className="text-xs text-muted-foreground mt-0.5">
              AI insights, mentor alerts, placement updates, and deadline reminders
            </p>
          </div>
          <div className="flex items-center gap-2">
            {unreadCount > 0 && (
              <Badge variant="danger">{unreadCount} unread</Badge>
            )}
            <Button onClick={markAllRead} variant="outline" size="sm">
              <CheckCheck className="w-3.5 h-3.5 mr-1.5" />
              Mark All Read
            </Button>
          </div>
        </div>

        {/* Notifications List */}
        <div className="space-y-3">
          {notifications.length === 0 && !loading ? (
            <Card glass className="p-12 text-center space-y-3">
              <Bell className="w-10 h-10 text-muted-foreground mx-auto" />
              <h3 className="text-base font-bold text-foreground">No Notifications</h3>
              <p className="text-xs text-muted-foreground">You&apos;re all caught up. AI will alert you proactively.</p>
            </Card>
          ) : (
            notifications.map((notif) => (
              <Card
                key={notif._id}
                glass
                className={`p-4 sm:p-5 flex items-start gap-4 transition-all ${
                  !notif.read ? 'border-l-4 border-l-primary bg-primary/5' : ''
                }`}
              >
                <div className="w-10 h-10 rounded-xl bg-muted/60 border border-border/60 flex items-center justify-center shrink-0">
                  {getIcon(notif.type)}
                </div>

                <div className="flex-1 min-w-0 space-y-1">
                  <div className="flex items-center justify-between gap-2">
                    <h4 className="text-xs font-bold text-foreground truncate">{notif.title}</h4>
                    <span className="text-[10px] text-muted-foreground whitespace-nowrap">
                      {formatDate(notif.createdAt)}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">{notif.message}</p>
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  {!notif.read && (
                    <button
                      onClick={() => markRead(notif._id)}
                      className="p-1.5 rounded-lg text-muted-foreground hover:text-primary transition-colors"
                      title="Mark as read"
                    >
                      <Check className="w-4 h-4" />
                    </button>
                  )}
                  <button
                    onClick={() => deleteNotification(notif._id)}
                    className="p-1.5 rounded-lg text-muted-foreground hover:text-destructive transition-colors"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </Card>
            ))
          )}
        </div>
      </div>
    </AppLayout>
  );
}
