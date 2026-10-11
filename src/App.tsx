import { useEffect, useMemo, useState } from 'react';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Hero from './components/Hero';
import StepSection from './components/StepSection';
import Decisions from './components/Decisions';
import Footer from './components/Footer';
import DataExchange from './components/DataExchange';
import DevelopApp from './views/DevelopApp';
import ProductionHub from './views/ProductionHub';
import MusicBlueprint from './views/MusicBlueprint';
import LoginScreen from './views/LoginScreen';
import { StoreProvider, useStore, type Domain } from './store';
import { QueueProvider, useQueue } from './reviewQueue';
import { AuthProvider, useAuth } from './auth';

type View = 'blueprint' | 'develop' | 'production';

/** Đồng bộ kết quả review queue về workspace của owner (returned → draft, final → khóa). */
function QueueSync() {
  const { user } = useAuth();
  const store = useStore();
  const { entries } = useQueue();

  useEffect(() => {
    if (!user) return;
    entries.forEach((e) => {
      if (e.ownerName !== user.username) return;
      if (e.status !== 'returned' && e.status !== 'final') return;
      const p = store.projects.find((x) => x.pid === e.pid);
      if (!p || p.syncedQ?.[e.qid] === e.status) return;
      const target = e.status === 'final' ? 'final' : 'draft';
      if (p.status !== target) {
        store.setProjectStatus(
          p.pid,
          target as 'final' | 'draft',
          e.status === 'final'
            ? 'Đồng bộ từ review queue: FINALIZED & DEPLOYED bởi Admin — project khóa'
            : 'Đồng bộ từ review queue: RETURNED — trả về draft để chỉnh sửa',
        );
      }
      store.markQSynced(p.pid, e.qid, e.status);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [entries, user?.username, store.projects]);

  return null;
}

function Shell() {
  const { user, perms } = useAuth();
  const queue = useQueue();
  const [view, setViewRaw] = useState<View>('blueprint');
  const [domain, setDomain] = useState<Domain>('video');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // phím tắt [ để đóng/mở sidebar
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === '[' && !(e.target instanceof HTMLInputElement) && !(e.target instanceof HTMLTextAreaElement)) {
        setSidebarOpen((v) => !v);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  if (!user) return <LoginScreen />;

  const setView = (v: View) => {
    if (v !== 'develop') queue.closePreview();
    setViewRaw(v);
  };
  const safeView: View = view === 'blueprint' && !perms.blueprint ? 'develop' : view;

  const goBlueprintAt = (stepCode?: string) => {
    if (!perms.blueprint) return;
    setView('blueprint');
    if (stepCode) setTimeout(() => document.getElementById(`step-${stepCode}`)?.scrollIntoView({ behavior: 'smooth' }), 120);
  };

  return (
    <StoreProvider key={user.username} scope={user.username}>
      <QueueSync />
      <Workspace
        view={safeView}
        setView={setView}
        domain={domain}
        setDomain={setDomain}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        goBlueprintAt={goBlueprintAt}
      />
    </StoreProvider>
  );
}

function Workspace({
  view,
  setView,
  domain,
  setDomain,
  sidebarOpen,
  setSidebarOpen,
  goBlueprintAt,
}: {
  view: View;
  setView: (v: View) => void;
  domain: Domain;
  setDomain: (d: Domain) => void;
  sidebarOpen: boolean;
  setSidebarOpen: (v: boolean) => void;
  goBlueprintAt: (stepCode?: string) => void;
}) {
  const { projects } = useStore();
  const counts = useMemo(
    () => ({
      video: projects.filter((p) => p.domain !== 'music').length,
      music: projects.filter((p) => p.domain === 'music').length,
    }),
    [projects],
  );

  return (
    <div className="min-h-screen">
      <div className="blueprint-bg" />
      <Sidebar open={sidebarOpen} setOpen={setSidebarOpen} domain={domain} setDomain={setDomain} counts={counts} />

      <div className={`transition-[padding] duration-400 ease-[cubic-bezier(0.22,1,0.36,1)] ${sidebarOpen ? 'lg:pl-[264px]' : ''}`}>
        <Navbar view={view} setView={setView} domain={domain} onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
        {view === 'blueprint' &&
          (domain === 'video' ? (
            <>
              <main>
                <Hero />
                <div className="h-8" />
                <DataExchange />
                <div className="h-2" />
                <BlueprintSteps />
                <Decisions onOpenDevelop={() => setView('develop')} />
              </main>
              <Footer onOpenDevelop={() => setView('develop')} />
            </>
          ) : (
            <MusicBlueprint onGoDevelop={() => setView('develop')} />
          ))}
        {view === 'develop' && (
          <DevelopApp domain={domain} goProduction={() => setView('production')} goBlueprintAt={goBlueprintAt} />
        )}
        {view === 'production' && (
          <ProductionHub
            domain={domain}
            goDevelop={() => setView('develop')}
            goBlueprint={() => setView('blueprint')}
          />
        )}
      </div>
    </div>
  );
}

function BlueprintSteps() {
  const { data } = useStore();
  return (
    <>
      {data.map((step) => (
        <StepSection key={step.code} step={step} />
      ))}
    </>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <QueueProvider>
        <Shell />
      </QueueProvider>
    </AuthProvider>
  );
}
