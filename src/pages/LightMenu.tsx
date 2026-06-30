import { Link } from 'react-router-dom'
import { menuItems } from '@/data/menuItems'

export default function LightMenu() {
  return (
    <div className="mx-auto flex min-h-svh max-w-[430px] flex-col bg-[var(--color-white)] text-[var(--color-black)]">
      <header className="flex items-center justify-between px-5 pb-4 pt-12">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-[var(--color-violet-blue)]">
            Restaurant CRM
          </p>
          <h1 className="mt-1 text-2xl font-semibold">Меню</h1>
        </div>
        <Link
          to="/"
          className="rounded-full bg-[var(--color-violet-blue)] px-3 py-1.5 text-xs text-[var(--color-white)]"
        >
          ← Темна
        </Link>
      </header>

      <div className="mx-5 mb-6 overflow-hidden rounded-2xl border border-[var(--color-violet-blue)]/20 bg-[var(--color-violet-blue)]/5 p-5">
        <p className="text-sm text-[var(--color-violet-blue)]">Сьогодні</p>
        <p className="mt-1 text-3xl font-bold text-[var(--color-black)]">
          24 замовлення
        </p>
        <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-[var(--color-violet-blue)]/15">
          <div className="h-full w-3/4 rounded-full bg-[var(--color-violet-blue)]" />
        </div>
      </div>

      <nav className="flex flex-1 flex-col gap-2 px-4 pb-8">
        {menuItems.map((item, index) => (
          <button
            key={item.id}
            type="button"
            className={`flex items-center gap-4 rounded-2xl border px-4 py-4 text-left transition active:scale-[0.98] ${
              index === 0
                ? 'border-[var(--color-violet-blue)] bg-[var(--color-violet-blue)] text-[var(--color-white)] shadow-lg shadow-[var(--color-violet-blue)]/25'
                : 'border-black/5 bg-black/[0.02] hover:border-[var(--color-violet-blue)]/30'
            }`}
          >
            <span
              className={`flex h-11 w-11 items-center justify-center rounded-xl text-xl ${
                index === 0
                  ? 'bg-white/20'
                  : 'bg-[var(--color-violet-blue)]/10'
              }`}
            >
              {item.icon}
            </span>
            <span className="flex-1 text-base font-medium">{item.label}</span>
            {item.badge && (
              <span
                className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                  index === 0
                    ? 'bg-white/25'
                    : 'bg-[var(--color-violet-blue)] text-[var(--color-white)]'
                }`}
              >
                {item.badge}
              </span>
            )}
            <span className={index === 0 ? 'text-white/60' : 'text-black/20'}>
              ›
            </span>
          </button>
        ))}
      </nav>

      <div className="sticky bottom-0 border-t border-black/5 bg-[var(--color-white)] px-6 pb-8 pt-3">
        <div className="flex justify-around rounded-2xl bg-black/[0.03] py-3">
          {['Головна', 'Замовлення', 'Профіль'].map((tab, i) => (
            <button
              key={tab}
              type="button"
              className={`flex flex-col items-center gap-1 text-xs ${
                i === 0
                  ? 'font-semibold text-[var(--color-violet-blue)]'
                  : 'text-black/40'
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
