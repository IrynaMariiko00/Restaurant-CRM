import { Link } from 'react-router-dom'
import { menuItems } from '@/data/menuItems'

export default function DarkMenu() {
  return (
    <div className="mx-auto flex min-h-svh max-w-[430px] flex-col bg-[var(--color-black)] text-[var(--color-white)]">
      <header className="flex items-center justify-between px-5 pb-4 pt-12">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-[var(--color-violet-blue-light)]">
            Restaurant CRM
          </p>
          <h1 className="mt-1 text-2xl font-semibold">Меню</h1>
        </div>
        <Link
          to="/light"
          className="rounded-full border border-[var(--color-violet-blue)] px-3 py-1.5 text-xs text-[var(--color-violet-blue-light)]"
        >
          Світла →
        </Link>
      </header>

      <div className="mx-5 mb-6 rounded-2xl bg-gradient-to-br from-[var(--color-violet-blue-dark)] to-[var(--color-violet-blue)] p-5">
        <p className="text-sm opacity-80">Сьогодні</p>
        <p className="mt-1 text-3xl font-bold">24 замовлення</p>
        <p className="mt-2 text-sm text-white/70">+12% порівняно з учора</p>
      </div>

      <nav className="flex flex-1 flex-col gap-2 px-4 pb-8">
        {menuItems.map((item) => (
          <button
            key={item.id}
            type="button"
            className="flex items-center gap-4 rounded-2xl bg-white/5 px-4 py-4 text-left transition hover:bg-[var(--color-violet-blue-dark)]/40 active:scale-[0.98]"
          >
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[var(--color-violet-blue)]/30 text-xl">
              {item.icon}
            </span>
            <span className="flex-1 text-base font-medium">{item.label}</span>
            {item.badge && (
              <span className="rounded-full bg-[var(--color-violet-blue)] px-2.5 py-0.5 text-xs font-semibold">
                {item.badge}
              </span>
            )}
            <span className="text-white/30">›</span>
          </button>
        ))}
      </nav>

      <div className="sticky bottom-0 border-t border-white/10 bg-[var(--color-black)] px-6 pb-8 pt-3">
        <div className="flex justify-around">
          {['Головна', 'Замовлення', 'Профіль'].map((tab, i) => (
            <button
              key={tab}
              type="button"
              className={`flex flex-col items-center gap-1 text-xs ${
                i === 0
                  ? 'text-[var(--color-violet-blue-light)]'
                  : 'text-white/40'
              }`}
            >
              <span className="text-lg">{['🏠', '📋', '👤'][i]}</span>
              {tab}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
