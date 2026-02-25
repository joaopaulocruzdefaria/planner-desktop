import { useState } from "react";
import { ArrowRight, FolderOpen, Plus } from "lucide-react";
import { useAppStore } from "../shared/store/useAppStore";

export function WorkspaceOnboarding() {
  const [isCreating, setIsCreating] = useState(true);
  const [workspaceName, setWorkspaceName] = useState("");
  const addNewWorkspace = useAppStore((state) => state.addNewWorkspace);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isCreating && workspaceName.trim()) {
      await addNewWorkspace(workspaceName.trim());
    } else if (!isCreating) {
      // In the future: trigger Tauri file dialog to select a folder/vault
      console.log("Importing workspace flow...");
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#F7F7F5] p-4 text-stone-800 relative">
      {/* Background Grid Pattern (Technical Vibe) */}
      <div
        className="absolute w-full h-full pointer-events-none opacity-[0.03] z-0"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, black 1px, transparent 0)",
          backgroundSize: "32px 32px",
        }}
      ></div>

      <div className="w-full max-w-md bg-white border border-stone-200 p-8 md:p-10 relative z-10 rounded-none shadow-sm">
        {/* Header Section */}
        <div className="mb-10 text-center">
          <div className="w-12 h-12 border border-stone-200 flex items-center justify-center mx-auto mb-6 bg-[#FBFBFB] rounded-none">
            {isCreating ? (
              <Plus className="w-5 h-5 text-stone-800" />
            ) : (
              <FolderOpen className="w-5 h-5 text-stone-800" />
            )}
          </div>
          <h1 className="text-3xl font-serif tracking-tight mb-2 text-stone-900">
            {isCreating ? "Initialize Workspace" : "Open Existing Vault"}
          </h1>
          <p className="text-stone-400 font-mono text-xs uppercase tracking-wider mt-4">
            {isCreating
              ? "Local-first architecture. 100% offline."
              : "Select a previously exported Planner directory."}
          </p>
        </div>

        {/* Form Section */}
        <form className="space-y-6" onSubmit={handleSubmit}>
          {isCreating ? (
            <div className="space-y-2">
              <label className="block text-xs font-mono text-stone-500 uppercase">
                Vault Name
              </label>
              <input
                type="text"
                placeholder="e.g. Master Branch"
                value={workspaceName}
                onChange={(e) => setWorkspaceName(e.target.value)}
                autoFocus
                className="w-full px-4 py-2 border border-stone-200 bg-[#FBFBFB] focus:bg-white focus:outline-none focus:border-stone-800 transition-colors font-mono text-sm rounded-none placeholder-stone-300"
              />
              <p className="text-[10px] font-mono text-stone-400">
                This will create a new isolated local database.
              </p>
            </div>
          ) : (
            <div className="p-6 border border-dashed border-stone-300 bg-[#FBFBFB] text-center cursor-pointer hover:bg-stone-50 transition-colors group">
              <FolderOpen className="w-6 h-6 text-stone-300 mx-auto mb-3 group-hover:text-stone-800 transition-colors" />
              <p className="text-sm font-mono text-stone-500">
                Click to browse file system
              </p>
            </div>
          )}

          {/* Action Button */}
          <button
            type="submit"
            disabled={isCreating && !workspaceName.trim()}
            className="w-full flex items-center justify-center gap-2 bg-stone-800 text-white px-4 py-2.5 hover:bg-black transition-colors rounded-none group mt-8 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span className="font-mono text-sm uppercase tracking-wider">
              {isCreating ? "Initialize" : "Select Folder"}
            </span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </form>

        {/* Toggle Mode */}
        <div className="mt-8 pt-6 border-t border-stone-100 text-center flex items-center justify-center gap-4">
          <button
            type="button"
            onClick={() => setIsCreating(true)}
            className={`text-xs font-mono uppercase tracking-wider pb-1 transition-colors ${
              isCreating
                ? "text-stone-800 border-b border-stone-800"
                : "text-stone-400 hover:text-stone-600"
            }`}
          >
            Create New
          </button>
          <span className="text-stone-300">•</span>
          <button
            type="button"
            onClick={() => setIsCreating(false)}
            className={`text-xs font-mono uppercase tracking-wider pb-1 transition-colors ${
              !isCreating
                ? "text-stone-800 border-b border-stone-800"
                : "text-stone-400 hover:text-stone-600"
            }`}
          >
            Import Vault
          </button>
        </div>
      </div>
    </div>
  );
}
