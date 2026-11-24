import { useMutation, useQuery } from '@tanstack/react-query'
import '../App.css'
import { deleteTodo, getTodo } from '../api/api'
import { queryClient } from '../lib/queryclient'

const CalendarIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <rect x="3.5" y="5" width="17" height="15.5" rx="3" />
    <path d="M7.5 3.5v3M16.5 3.5v3M3.5 9.5h17" />
  </svg>
)

const CheckIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path d="m5 12.5 4.5 4L19 7" />
  </svg>
)

const TrashIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path d="M4.5 7h15M10 11v6M14 11v6M6.5 7l.8 13h9.4l.8-13M9 7V4h6v3" />
  </svg>
)

const Home = () => {
  const { data, isPending, isError, error } = useQuery({
    queryKey: ['todos'],
    queryFn: getTodo,
  })

  const deleteMutation = useMutation({
    mutationFn: deleteTodo,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['todos'] })
    },
  })

  const date = new Intl.DateTimeFormat('tg-TJ', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  }).format(new Date())

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <a className="brand" href="#" aria-label="Тартиб — саҳифаи асосӣ">
          <span className="brand-mark"><CheckIcon /></span>
          <span className="brand-name">тартиб<span>.</span></span>
        </a>

        <div className="sidebar-section-label">ФАЗОИ КОРӢ</div>
        <nav className="sidebar-nav" aria-label="Навигатсияи асосӣ">
          <div className="nav-item nav-item-active">
            <span className="nav-icon"><CheckIcon /></span>
            <span>Ҳамаи вазифаҳо</span>
            {!isPending && !isError && (
              <span className="nav-count">{data.data.length}</span>
            )}
          </div>
        </nav>

        <div className="sidebar-bottom">
          <div className="sidebar-sparkle">✳</div>
          <p>Ҳар кори бузург<br />аз як қадам сар мешавад.</p>
          <span>ШУМО АЗ УҲДААШ МЕБАРОЕД</span>
        </div>
      </aside>

      <main className="main-content">
        <header className="topbar">
          <div className="breadcrumbs">
            <span>ФАЗОИ КОРӢ</span>
            <span className="breadcrumb-divider">/</span>
            <strong>ВАЗИФАҲО</strong>
          </div>
          <div className="date-chip">
            <CalendarIcon />
            <span>{date}</span>
          </div>
        </header>

        <div className="page-content">
          <section className="welcome-row">
            <div>
              <p className="eyebrow">ХУШ ОМАДЕД БА РӮЙХАТИ ХУД</p>
              <h1>Вазифаҳо<span className="title-period">.</span></h1>
              <p className="welcome-subtitle">Корҳоятонро ба тартиб дароред ва пеш равед.</p>
            </div>
            <div className="focus-card">
              <div className="focus-icon"><CheckIcon /></div>
              <div>
                <span>ТАМОКУЗИ ИМРӮЗА</span>
                <p>Як қадам дар як вақт.</p>
              </div>
              <span className="focus-sparkle">✦</span>
            </div>
          </section>

          <section className="summary-card" aria-label="Хулосаи вазифаҳо">
            <div className="summary-icon"><CheckIcon /></div>
            <div className="summary-copy">
              <span>ҲАМАИ ВАЗИФАҲО</span>
              <strong>{isPending || isError ? '—' : data.data.length}</strong>
            </div>
            <div className="summary-divider" />
            <p className="summary-note">
              {isPending
                ? 'Рӯйхат бор шуда истодааст'
                : isError
                  ? 'Маълумот дастрас нест'
                  : data.data.length === 1
                    ? 'вазифа дар рӯйхати шумо'
                    : 'вазифа дар рӯйхати шумо'}
            </p>
            <span className="summary-decoration" aria-hidden="true">✳</span>
          </section>

          <section className="tasks-section">
            <div className="section-heading">
              <div>
                <p className="eyebrow">РӮЙХАТИ ШУМО</p>
                <h2>Ҳамаи вазифаҳо</h2>
              </div>
              {!isPending && !isError && (
                <span className="task-count">{data.data.length} ҲАМАГӢ</span>
              )}
            </div>

            <div className="tasks-card">
              {isPending ? (
                <div className="loading-state" role="status">
                  <span className="loading-spinner" />
                  <span>Вазифаҳо бор шуда истодаанд...</span>
                </div>
              ) : isError ? (
                <div className="message-state error-state">
                  <div className="state-icon">!</div>
                  <h3>Рӯйхатро бор карда натавонистем</h3>
                  <p role="alert">{error.message}</p>
                </div>
              ) : data.data.length === 0 ? (
                <div className="message-state">
                  <div className="empty-illustration"><CheckIcon /></div>
                  <h3>Ҳоло вазифа нест</h3>
                  <p>Вақти хубест, ки каме истироҳат кунед.</p>
                </div>
              ) : (
                <ul className="task-list">
                  {data.data.map((todo, index) => (
                    <li className="task-item" key={todo.id}>
                      <span className="task-marker" aria-hidden="true">
                        {String(index + 1).padStart(2, '0')}
                      </span>
                      <span className="task-name">{todo.name}</span>
                      <button
                        className="delete-button"
                        type="button"
                        aria-label={`Нест кардани вазифа: ${todo.name}`}
                        onClick={() => deleteMutation.mutate(todo.id)}
                        disabled={deleteMutation.isPending}
                      >
                        {deleteMutation.isPending && deleteMutation.variables === todo.id
                          ? <span className="button-spinner" />
                          : <TrashIcon />}
                        <span className="delete-label">
                          {deleteMutation.isPending && deleteMutation.variables === todo.id
                            ? 'Нест шуда истодааст...'
                            : 'Нест кардан'}
                        </span>
                      </button>
                    </li>
                  ))}
                </ul>
              )}
              {deleteMutation.isError && (
                <p className="mutation-error" role="alert">
                  Хато ҳангоми нест кардани вазифа: {deleteMutation.error.message}
                </p>
              )}
            </div>
            {!isPending && !isError && data.data.length > 0 && (
              <p className="list-footnote">
                <span className="footnote-dot" />
                Барои нигоҳ доштани диққат, рӯйхататонро ба тартиб дароред.
              </p>
            )}
          </section>
        </div>
      </main>
    </div>
  )
}

export default Home
