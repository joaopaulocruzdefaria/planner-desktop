import { useEffect } from "react";
import { Sidebar } from "../shared/ui/Sidebar";
import { PageEditor } from "../shared/ui/PageEditor";
import { WorkspaceOnboarding } from "../pages/WorkspaceOnboarding";
import { initDb } from "../shared/db/db";
import { useAppStore } from "../shared/store/useAppStore";

// 100% Static Mocked Frontend
export function App() {
  const { isDbReady, initializeStore, workspaces } = useAppStore();

  useEffect(() => {
    // 1. Initialize SQLite Tables
    // 2. Load Workspaces into Zustand
    initDb()
      .then(() => initializeStore())
      .catch(console.error);
  }, [initializeStore]);

  // Show a blank technical screen or loader until DB responds
  if (!isDbReady) {
    return <div className="h-screen w-screen bg-[#F7F7F5]"></div>;
  }

  // If no Workspaces exist, show the Vault creation flow
  if (workspaces.length === 0) {
    return <WorkspaceOnboarding />;
  }

  return (
    <div className="flex h-screen w-full bg-white text-stone-800 overflow-hidden">
      <Sidebar />
      <PageEditor title="Welcome to Planner" />
    </div>
  );
}
