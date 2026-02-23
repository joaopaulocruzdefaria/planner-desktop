import { Sidebar } from "../shared/ui/Sidebar";
import { PageEditor } from "../shared/ui/PageEditor";

// 100% Static Mocked Frontend
// SQLite initialization is currently bypassed to ensure UI rendering.
export function App() {
  return (
    <div className="flex h-screen w-full bg-white text-stone-800 overflow-hidden">
      <Sidebar />
      <PageEditor title="Welcome to Planner" />
    </div>
  );
}
