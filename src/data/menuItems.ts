export type MenuItem = {
  id: string
  label: string
  icon: string
  badge?: number
}

export const menuItems: MenuItem[] = [
  { id: 'orders', label: 'Замовлення', icon: '📋', badge: 3 },
  { id: 'tables', label: 'Столи', icon: '🪑' },
  { id: 'menu', label: 'Меню', icon: '🍽️' },
  { id: 'clients', label: 'Клієнти', icon: '👥' },
  { id: 'stats', label: 'Статистика', icon: '📊' },
  { id: 'settings', label: 'Налаштування', icon: '⚙️' },
]
