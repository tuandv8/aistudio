import { useState } from 'react';
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
import { AuthProvider, useAuth } from './auth';

type View = 'blueprint' | 'develop' | 'production';

function Shell() {
  const { user, perms } = useAuth();
  const [view, setView] = useState<View>('blueprint');

  if (!user) return <LoginScreen />;

  // role l1/l2 không vào được Blueprint — nhảy về Develop nếu đang ở chế độ bị khóa
  const safeView: View = view === 'blueprint' && !perms.blueprint ? 'develop' : view;

  const goBlueprintAt = (stepCode?: string) => {
    if (!perms.blueprint) return;
    setView('blueprint');
    if (stepCode) {
      setTimeout(() => document.getElementById(`step-${stepCode}`)?.scrollIntoView({ behavior: 'smooth' }), 120);
    }
  };

  return (
    <StoreProvider>
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

// BlueprintSteps dùng store → cần nằm trong StoreProvider
export default function App() {
  return (
    <AuthProvider>
      <Shell />
    </AuthProvider>
  );
}
