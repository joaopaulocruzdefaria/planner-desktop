import {
  FileText,
  Calendar,
  Settings,
  Plus,
  LayoutTemplate,
} from "lucide-react";

export function Sidebar() {
  const mockPages = [
    {
      id: "1",
      title: "Welcome to Planner",
      icon: <FileText className="w-4 h-4" />,
    },
    { id: "2", title: "Weekly Agenda", icon: <Calendar className="w-4 h-4" /> },
    {
      id: "3",
      title: "Brainstorming UI",
      icon: <LayoutTemplate className="w-4 h-4" />,
    },
  ];

  return (
    <aside className="w-64 bg-stone-50 h-full border-r border-stone-200 flex flex-col">
      {/* Workspace Header */}
      <div className="p-4 flex items-center justify-between hover:bg-stone-100 cursor-pointer transition-colors duration-200">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded bg-stone-200 flex items-center justify-center text-xs font-semibold">
            J
          </div>
          <span className="font-medium text-sm text-stone-800">
            João's Workspace
          </span>
        </div>
      </div>

      {/* Pages List */}
      <div className="flex-1 overflow-y-auto px-2 py-4">
        <div className="text-xs font-medium text-stone-400 px-2 mb-2 uppercase tracking-wider">
          Private Pages
        </div>

        <div className="space-y-0.5">
          {mockPages.map((page) => (
            <button
              key={page.id}
              className="w-full flex items-center gap-2 px-2 py-1.5 text-sm text-stone-800 hover:bg-stone-100 rounded-md transition-colors text-left"
            >
              <span className="text-stone-400">{page.icon}</span>
              <span className="truncate">{page.title}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Footer Actions */}
      <div className="p-2 border-t border-stone-200">
        <button className="w-full flex items-center gap-2 px-2 py-1.5 text-sm text-stone-800 hover:bg-stone-100 rounded-md transition-colors text-left">
          <Plus className="w-4 h-4 text-stone-400" />
          <span>New Page</span>
        </button>
        <button className="w-full flex items-center gap-2 px-2 py-1.5 text-sm text-stone-800 hover:bg-stone-100 rounded-md transition-colors text-left">
          <Settings className="w-4 h-4 text-stone-400" />
          <span>Settings</span>
        </button>
      </div>
    </aside>
  );
}
