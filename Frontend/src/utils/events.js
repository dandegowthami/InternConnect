// Fired after notifications are read so the dashboard badge refreshes
export const NOTIFICATIONS_CHANGED = "notifications:changed";

export const emitNotificationsChanged = () => window.dispatchEvent(new Event(NOTIFICATIONS_CHANGED));
