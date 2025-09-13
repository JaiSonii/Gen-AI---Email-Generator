import { AppProvider, useApp } from '../context/AppContext';
import { Homepage } from '../components/HomePage';
import { WorkflowContainer } from '../components/WorkflowContainer';

function AppContent() {
  const { state } = useApp();

  // Show workflow if a generator is selected, otherwise show homepage
  return state.currentGenerator ? <WorkflowContainer /> : <Homepage />;
}

const Index = () => {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
};

export default Index;
