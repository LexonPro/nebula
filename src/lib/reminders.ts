export async function requestNotificationPermission() {
  if (!('Notification' in window)) {
    console.warn('This browser does not support desktop notification');
    return false;
  }

  if (Notification.permission === 'granted') {
    return true;
  }

  if (Notification.permission !== 'denied') {
    const permission = await Notification.requestPermission();
    return permission === 'granted';
  }

  return false;
}

export function scheduleReminder(habitName: string, time: string) {
  // In a real app this would use a ServiceWorker for reliable background delivery.
  // This is a naive client-side demonstration using setTimeout for the current day.
  
  if (Notification.permission !== 'granted') return;

  const [hours, minutes] = time.split(':').map(Number);
  const now = new Date();
  const scheduledTime = new Date();
  scheduledTime.setHours(hours, minutes, 0, 0);

  let delay = scheduledTime.getTime() - now.getTime();
  
  // If time has passed today, schedule for tomorrow
  if (delay < 0) {
    delay += 24 * 60 * 60 * 1000;
  }

  setTimeout(() => {
    new Notification('Habit Reminder', {
      body: `Time to: ${habitName}`,
      icon: '/favicon.svg'
    });
  }, delay);
}
