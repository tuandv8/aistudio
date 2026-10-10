import { useEffect, useState } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import StepSection from './components/StepSection';
import Decisions from './components/Decisions';
import Footer from './components/Footer';
import DataExchange from './components/DataExchange';
import DevelopApp from './views/DevelopApp';
import ProductionHub from './views/ProductionHub';
import LoginScreen from './views/LoginScreen';
import { StoreProvider, useStore } from './store';
import { QueueProvider, useQueue } from './reviewQueue';
import { AuthProvider, useAuth } from './auth';

type View = 'blueprint' | 'develop' | 'production';

/**
 * Đồng bộ kết quả review queue về workspace của owner:
 *  - entry 'returned' → project local về draft
 *  - entry 'final'    → project local khóa (final)
 * Chạy nền mỗi khi queue/projects thay đổi; chống lặp bằng syncedQ.
 */
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
      if (!p) return;
      if (p.syncedQ?.[e.qid] === e.status) return; // đã áp
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

  // rời Develop (sang Blueprint/Production) → tự đóng phiên review snapshot
  const setView = (v: View) => {
    if (v !== 'develop') queue.closePreview();
    setViewRaw(v);
  };

  if (!user) return <LoginScreen />;

  const safeView: View = view === 'blueprint' && !perms.blueprint ? 'develop' : view;

  const goBlueprintAt = (stepCode?: string) => {
    if (!perms.blueprint) return;
    setView('blueprint');
    if (stepCode) {
      setTimeout(() => document.getElementById(`step-${stepCode}`)?.scrollIntoView({ behavior: 'smooth' }), 120);
    }
  };

  return (
    <StoreProvider key={user.username} scope={user.username}>
      <QueueSync />
      <div className="min-h-screen">
        <div className="blueprint-bg" />
        <Navbar view={safeView} setView={setView} />
        {safeView === 'blueprint' && (
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
        )}
        {safeView === 'develop' && (
          <DevelopApp goProduction={() => setView('production')} goBlueprintAt={goBlueprintAt} />
        )}
        {safeView === 'production' && <ProductionHub goDevelop={() => setView('develop')} />}
      </div>
    </StoreProvider>
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
