import React, { useEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';

const paths = {
  settings: <><path d="m9.5 4 .6-2h3.8l.6 2 1.6.9 2-.4 1.9 3.2-1.4 1.6v1.8l1.4 1.6-1.9 3.2-2-.4-1.6.9-.6 2h-3.8l-.6-2-1.6-.9-2 .4-1.9-3.2 1.4-1.6V9.3L2.1 7.7 4 4.5l2 .4L7.6 4Z" transform="translate(1 2) scale(.92)"/><circle cx="12" cy="12" r="3"/></>,
  edit: <><path d="m15 5 4 4M4 20l4-1 12-12a2.8 2.8 0 0 0-4-4L4 15Z"/><path d="M14 20h6"/></>,
  share: <><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><path d="m8.6 10.5 6.8-4M8.6 13.5l6.8 4"/></>,
  document: <><path d="M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9Z"/><path d="M14 3v6h6M8 13h8M8 17h6M8 9h2"/></>,
  users: <><circle cx="9" cy="7" r="4"/><path d="M2 21v-3a7 7 0 0 1 14 0v3M17 3a4 4 0 0 1 0 8M22 21v-3a7 7 0 0 0-4-6"/></>,
  user: <><circle cx="12" cy="7" r="4"/><path d="M4 21v-2a8 8 0 0 1 16 0v2"/></>,
  heart: <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8L12 21l8.8-8.6a5.5 5.5 0 0 0 0-7.8Z"/>,
  mail: <><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 6 9 7 9-7"/></>,
  globe: <><circle cx="12" cy="12" r="9"/><ellipse cx="12" cy="12" rx="4" ry="9"/><path d="M3 12h18"/></>,
  social: <><rect x="3" y="9" width="4" height="12" rx=".5"/><circle cx="5" cy="4" r="2"/><path d="M11 21V9h4v2c3-4 7-2 7 3v7h-4v-7c0-3-3-3-3 0v7Z"/></>,
  calendar: <><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M7 3v4M17 3v4M3 11h18M7 15h.01M12 15h.01M17 15h.01M7 18h.01M12 18h.01"/></>,
  image: <><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8" cy="8" r="1.5"/><path d="m21 15-5-5L5 21"/></>,
  close: <path d="m6 6 12 12M18 6 6 18"/>,
  check: <path d="m5 12 4 4L19 6"/>,
  sun: <><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M2 12h2M20 12h2M5 5l1 1M18 18l1 1M5 19l1-1M18 6l1-1"/></>,
  moon: <path d="M21 13a9 9 0 0 1-10-10A9 9 0 1 0 21 13Z"/>,
};
type IconName = keyof typeof paths;
function Icon({ name, size = 20 }: { name: IconName; size?: number }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.65" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[name]}</svg>;
}

const initialProfile = {
  name: 'Алексей Морозов', handle: 'alexm', role: 'Product Designer',
  description: 'Дизайнер цифровых продуктов. Создаю простые интерфейсы, продумываю пользовательский опыт и люблю аккуратный дизайн.',
  about: 'Работаю с цифровыми продуктами более 6 лет. Люблю превращать сложные задачи в понятные интерфейсы и создавать удобные дизайн-системы для команд.',
  email: 'alex@example.com', website: 'alexm.design',
  skills: 'UI/UX Design, Next.js, TypeScript, Figma, Branding, Web Design',
};
type Profile = typeof initialProfile;
function readProfile(): Profile {
  try {
    const saved = JSON.parse(localStorage.getItem('namespace-profile') || 'null');
    if (saved && Object.keys(initialProfile).every(key => typeof saved[key] === 'string')) return saved;
  } catch { /* Default profile is available when storage is disabled. */ }
  return initialProfile;
}
const tabs: { label: string; icon?: IconName; message: string }[] = [
  { label: 'Все посты', message: 'Здесь будет отображаться содержимое выбранного раздела.' },
  { label: 'Медиа', icon: 'image', message: 'Здесь появятся фотографии, изображения и видео.' },
  { label: 'Документы', icon: 'document', message: 'Здесь будут собраны опубликованные документы.' },
  { label: 'Избранное', icon: 'heart', message: 'Здесь появятся сохранённые публикации.' },
];

function Modal({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const dialog = ref.current!;
    dialog.showModal();
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { dialog.close(); document.body.style.overflow = previous; };
  }, []);
  return <dialog ref={ref} onCancel={onClose} onClick={e => { if (e.target === e.currentTarget) onClose(); }} aria-labelledby="modal-title">
    <div className="modal-content"><div className="modal-heading"><h2 id="modal-title">{title}</h2><button className="icon-button" onClick={onClose} aria-label="Закрыть"><Icon name="close"/></button></div>{children}</div>
  </dialog>;
}

function App() {
  const [profile, setProfile] = useState<Profile>(readProfile);
  const [draft, setDraft] = useState(profile);
  const [activeTab, setActiveTab] = useState(0);
  const [modal, setModal] = useState<'edit' | 'settings' | 'share' | null>(null);
  const [toast, setToast] = useState('');
  const [dark, setDark] = useState(() => { try { return localStorage.getItem('namespace-theme') === 'dark'; } catch { return false; } });
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  useEffect(() => {
    document.documentElement.dataset.theme = dark ? 'dark' : 'light';
    try { localStorage.setItem('namespace-theme', dark ? 'dark' : 'light'); } catch { /* Optional preference. */ }
  }, [dark]);
  useEffect(() => { document.title = `${profile.name} · NameSpace`; }, [profile.name]);
  useEffect(() => { if (toast) { const id = setTimeout(() => setToast(''), 3500); return () => clearTimeout(id); } }, [toast]);
  function save(e: React.FormEvent) {
    e.preventDefault();
    const clean = Object.fromEntries(Object.entries(draft).map(([k, v]) => [k, v.trim()])) as Profile;
    setProfile(clean); setModal(null);
    try { localStorage.setItem('namespace-profile', JSON.stringify(clean)); setToast('Профиль сохранён'); }
    catch { setToast('Профиль обновлён. Сохранение в браузере недоступно.'); }
  }
  async function share() {
    try { await navigator.clipboard.writeText(window.location.href); setToast('Ссылка на профиль скопирована'); }
    catch { setModal('share'); }
  }
  const initials = profile.name.split(/\s+/).slice(0, 2).map(word => word[0]).join('').toUpperCase();
  return <>
    <header className="topbar"><a className="brand" href="#" aria-label="NameSpace — главная"><span className="brand-mark">N</span><span>NameSpace</span></a><button className="icon-button settings-button" onClick={() => setModal('settings')} aria-label="Настройки"><Icon name="settings" size={18}/></button></header>
    <main className="page">
      <section className="card profile-card" aria-label="Профиль">
        <div className="profile-top"><div className="avatar" aria-label={`Инициалы ${profile.name}`}>{initials}</div>
          <div className="profile-intro"><h1>{profile.name}</h1><p className="handle">@{profile.handle}<span>·</span>{profile.role}</p><p className="description">{profile.description}</p></div>
          <div className="profile-actions"><button className="button primary" onClick={() => { setDraft(profile); setModal('edit'); }}><Icon name="edit" size={16}/><span>Редактировать<br className="desktop-break"/> профиль</span></button><button className="button secondary" onClick={share}><Icon name="share" size={16}/>Поделиться</button></div>
        </div>
        <div className="stats">{([
          ['document', '128', 'Публикации'], ['users', '12.4K', 'Подписчики'], ['user', '384', 'Подписки'], ['heart', '8.7K', 'Лайки'],
        ] as [IconName, string, string][]).map(([icon, value, label]) => <div className="stat" key={label}><Icon name={icon} size={22}/><div><strong>{value}</strong><span>{label}</span></div></div>)}</div>
      </section>
      <div className="info-grid">
        <section className="card about-card"><h2>О себе</h2><p className="about-text">{profile.about}</p><h3>Навыки</h3><div className="skills">{profile.skills.split(',').map(s => s.trim()).filter(Boolean).map((skill, i) => <span className="chip" key={`${skill}-${i}`}>{skill}</span>)}</div></section>
        <section className="card contact-card"><h2>Контактная информация</h2><div className="contact-list">
          <Contact icon="mail" label="Email"><a href={`mailto:${profile.email}`}>{profile.email}</a></Contact>
          <Contact icon="globe" label="Веб-сайт"><a href={`https://${profile.website.replace(/^https?:\/\//, '')}`} target="_blank" rel="noreferrer">{profile.website.replace(/^https?:\/\//, '')}</a></Contact>
          <Contact icon="social" label="Социальные сети"><span>@{profile.handle}</span></Contact>
          <Contact icon="calendar" label="Дата регистрации"><time dateTime="2022-03-12">12 марта 2022</time></Contact>
        </div></section>
      </div>
      <section className="card posts-card" aria-label="Публикации профиля"><div className="tabs" role="tablist" aria-label="Разделы профиля">{tabs.map((tab, i) => <button key={tab.label} ref={el => { tabRefs.current[i] = el; }} id={`tab-${i}`} role="tab" aria-selected={activeTab === i} aria-controls={`panel-${i}`} tabIndex={activeTab === i ? 0 : -1} className={`tab ${activeTab === i ? 'active' : ''}`} onClick={() => setActiveTab(i)} onKeyDown={e => {
        let next = i;
        if (e.key === 'ArrowRight') next = (i + 1) % tabs.length;
        else if (e.key === 'ArrowLeft') next = (i - 1 + tabs.length) % tabs.length;
        else if (e.key === 'Home') next = 0;
        else if (e.key === 'End') next = tabs.length - 1;
        else return;
        e.preventDefault(); setActiveTab(next); tabRefs.current[next]?.focus();
      }}>{tab.icon && <Icon name={tab.icon} size={15}/>} {tab.label}</button>)}</div>
        {tabs.map((tab, i) => <div key={tab.label} hidden={activeTab !== i} id={`panel-${i}`} role="tabpanel" aria-labelledby={`tab-${i}`} tabIndex={0} className="tab-panel"><h2>{tab.label}</h2><p>{tab.message}</p></div>)}
      </section>
    </main>
    {modal === 'edit' && <Modal title="Редактировать профиль" onClose={() => setModal(null)}><form onSubmit={save}><p className="form-hint">Расскажите о себе. Изменения сохранятся в этом браузере.</p><div className="form-grid">
      {([['name', 'Имя и фамилия'], ['handle', 'Имя пользователя'], ['role', 'Профессия'], ['email', 'Email'], ['website', 'Веб-сайт']] as [keyof Profile, string][]).map(([key, label]) => <label key={key}>{label}<input required maxLength={key === 'name' ? 60 : 100} type={key === 'email' ? 'email' : 'text'} pattern={key === 'handle' ? '[a-zA-Z0-9_.]+' : undefined} value={draft[key]} onChange={e => setDraft({ ...draft, [key]: e.target.value })}/></label>)}
      <label className="full">Краткое описание<textarea required maxLength={240} rows={2} value={draft.description} onChange={e => setDraft({ ...draft, description: e.target.value })}/></label><label className="full">О себе<textarea required rows={3} maxLength={600} value={draft.about} onChange={e => setDraft({ ...draft, about: e.target.value })}/></label><label className="full">Навыки через запятую<input maxLength={240} value={draft.skills} onChange={e => setDraft({ ...draft, skills: e.target.value })}/></label></div><div className="modal-actions"><button type="button" className="button secondary" onClick={() => setModal(null)}>Отмена</button><button className="button primary" type="submit"><Icon name="check" size={16}/>Сохранить</button></div></form></Modal>}
    {modal === 'settings' && <Modal title="Настройки" onClose={() => setModal(null)}><p className="form-hint">Оформление страницы</p><div className="theme-options">{[false, true].map(value => <button key={String(value)} className={`theme-option ${dark === value ? 'selected' : ''}`} aria-pressed={dark === value} onClick={() => setDark(value)}><Icon name={value ? 'moon' : 'sun'}/>{value ? 'Тёмная' : 'Светлая'}{dark === value && <Icon name="check" size={16}/>}</button>)}</div></Modal>}
    {modal === 'share' && <Modal title="Поделиться профилем" onClose={() => setModal(null)}><p className="form-hint">Скопируйте ссылку на страницу:</p><input aria-label="Ссылка на профиль" readOnly value={window.location.href} onFocus={e => e.target.select()}/></Modal>}
    <div className={`toast ${toast ? 'visible' : ''}`} role="status">{toast && <><Icon name="check" size={18}/>{toast}</>}</div>
  </>;
}
function Contact({ icon, label, children }: { icon: IconName; label: string; children: React.ReactNode }) {
  return <div className="contact"><Icon name={icon} size={21}/><div><span className="contact-label">{label}</span><div className="contact-value">{children}</div></div></div>;
}
createRoot(document.getElementById('root')!).render(<React.StrictMode><App/></React.StrictMode>);
