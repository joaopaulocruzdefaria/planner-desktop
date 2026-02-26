import { useState } from "react";
import {
  FileText,
  Settings,
  Plus,
  Folder as FolderIcon,
  Pencil,
  Trash2,
} from "lucide-react";
import { useAppStore } from "../store/useAppStore";
import { ConfirmModal } from "./ConfirmModal";

export function Sidebar() {
  const {
    currentWorkspace,
    pages,
    folders,
    activePageId,
    setActivePage,
    addNewPage,
    createFolderFromPages,
    movePageToFolder,
    renamePage,
    removePage,
    renameFolder,
    removeFolder,
  } = useAppStore();

  const [editingPageId, setEditingPageId] = useState<string | null>(null);
  const [editingFolderId, setEditingFolderId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");

  const [creatingFolderForPageId, setCreatingFolderForPageId] = useState<
    string | null
  >(null);
  const [newFolderName, setNewFolderName] = useState("");
  const [sourcePageIdForFolder, setSourcePageIdForFolder] = useState<
    string | null
  >(null);
  const [isDraggingOverRoot, setIsDraggingOverRoot] = useState(false);

  // Modal State
  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean;
    type: "page" | "folder";
    id: string;
    title: string;
    message: string;
  }>({
    isOpen: false,
    type: "page",
    id: "",
    title: "",
    message: "",
  });

  const handleDragStart = (e: React.DragEvent, pageId: string) => {
    e.dataTransfer.setData("pageId", pageId);
  };

  const handleDropOnPage = async (e: React.DragEvent, targetPageId: string) => {
    e.preventDefault();
    e.stopPropagation();
    const sourcePageId = e.dataTransfer.getData("pageId");
    if (!sourcePageId || sourcePageId === targetPageId) return;

    // Check if target is already in a folder. If so, just move the source to that folder.
    const targetPage = pages.find((p) => p.id === targetPageId);
    if (targetPage?.folderId) {
      await movePageToFolder(sourcePageId, targetPage.folderId);
      return;
    }

    // Trigger inline UI for folder creation (appearing visually above the pages)
    setSourcePageIdForFolder(sourcePageId);
    setCreatingFolderForPageId(targetPageId);
    setNewFolderName("");
  };

  const handleDropOnFolder = async (e: React.DragEvent, folderId: string) => {
    e.preventDefault();
    e.stopPropagation();
    const sourcePageId = e.dataTransfer.getData("pageId");
    if (!sourcePageId) return;
    await movePageToFolder(sourcePageId, folderId);
  };

  const handleDropOnRoot = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingOverRoot(false);
    const sourcePageId = e.dataTransfer.getData("pageId");
    if (!sourcePageId) return;

    // Check if the page is already in the root
    const page = pages.find((p) => p.id === sourcePageId);
    if (page && page.folderId !== null) {
      await movePageToFolder(sourcePageId, null);
    }
  };

  const submitNewFolder = async () => {
    if (
      creatingFolderForPageId &&
      sourcePageIdForFolder &&
      newFolderName.trim()
    ) {
      await createFolderFromPages(
        sourcePageIdForFolder,
        creatingFolderForPageId,
        newFolderName.trim(),
      );
    }
    setCreatingFolderForPageId(null);
    setSourcePageIdForFolder(null);
  };

  const startEditingPage = (
    pageId: string,
    currentTitle: string,
    e: React.MouseEvent,
  ) => {
    e.stopPropagation();
    setEditingPageId(pageId);
    setEditTitle(currentTitle);
  };

  const submitPageRename = async () => {
    if (editingPageId && editTitle.trim()) {
      await renamePage(editingPageId, editTitle.trim());
    }
    setEditingPageId(null);
  };

  const startEditingFolder = (
    folderId: string,
    currentName: string,
    e: React.MouseEvent,
  ) => {
    e.stopPropagation();
    setEditingFolderId(folderId);
    setEditTitle(currentName);
  };

  const submitFolderRename = async () => {
    if (editingFolderId && editTitle.trim()) {
      await renameFolder(editingFolderId, editTitle.trim());
    }
    setEditingFolderId(null);
  };

  const promptDeletePage = (
    pageId: string,
    currentTitle: string,
    e: React.MouseEvent,
  ) => {
    e.stopPropagation();
    setDeleteModal({
      isOpen: true,
      type: "page",
      id: pageId,
      title: "Delete Page",
      message: `Are you sure you want to delete the page "${currentTitle}"? This action cannot be undone.`,
    });
  };

  const promptDeleteFolder = (
    folderId: string,
    currentName: string,
    innerPagesCount: number,
    e: React.MouseEvent,
  ) => {
    e.stopPropagation();
    const countWarning =
      innerPagesCount > 0
        ? ` It contains ${innerPagesCount} page${innerPagesCount > 1 ? "s" : ""}, which will be moved back to the root level.`
        : " This action cannot be undone.";

    setDeleteModal({
      isOpen: true,
      type: "folder",
      id: folderId,
      title: "Delete Folder",
      message: `Are you sure you want to delete the folder "${currentName}"?${countWarning}`,
    });
  };

  const confirmDelete = async () => {
    if (deleteModal.type === "page") {
      await removePage(deleteModal.id);
    } else {
      await removeFolder(deleteModal.id);
    }
    setDeleteModal((prev) => ({ ...prev, isOpen: false }));
  };

  const rootPages = pages.filter((p) => !p.folderId);

  return (
    <>
      <aside className="w-64 bg-[#F7F7F5] h-full border-r border-stone-200 flex flex-col rounded-none shrink-0 overflow-hidden">
        {/* Workspace Header */}
        <div className="p-4 flex items-center justify-between hover:bg-stone-100 cursor-pointer transition-colors duration-200 border-b border-stone-200">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-stone-800 text-white flex items-center justify-center text-xs font-serif rounded-none">
              {currentWorkspace?.name?.[0]?.toUpperCase() || "W"}
            </div>
            <span className="font-serif text-sm tracking-wide text-stone-800 truncate max-w-[140px]">
              {currentWorkspace?.name || "Workspace"}
            </span>
          </div>
        </div>

        {/* Pages List */}
        <div className="flex-1 overflow-y-auto px-2 py-4">
          <div className="text-[10px] font-mono text-stone-400 px-2 mb-3 uppercase tracking-widest">
            Private Pages
          </div>

          <div className="space-y-4">
            {/* Folders */}
            {folders.map((folder) => {
              const folderPages = pages.filter((p) => p.folderId === folder.id);
              return (
                <div
                  key={folder.id}
                  className="space-y-0.5"
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => handleDropOnFolder(e, folder.id)}
                >
                  <div className="relative group flex items-center gap-2 px-2 py-1.5 text-xs font-mono text-stone-500 uppercase tracking-wider hover:bg-stone-100 rounded-none transition-colors">
                    <FolderIcon className="w-3 h-3 shrink-0" />
                    {editingFolderId === folder.id ? (
                      <input
                        autoFocus
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                        onBlur={submitFolderRename}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") submitFolderRename();
                          if (e.key === "Escape") setEditingFolderId(null);
                        }}
                        className="flex-1 bg-white border border-stone-300 px-1 outline-none text-stone-900"
                      />
                    ) : (
                      <span className="truncate flex-1">{folder.name}</span>
                    )}

                    {!editingFolderId && (
                      <div className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 flex items-center transition-all bg-[#F7F7F5] group-hover:bg-stone-100">
                        <button
                          onClick={(e) =>
                            startEditingFolder(folder.id, folder.name, e)
                          }
                          className="p-1 hover:bg-stone-200 text-stone-400 hover:text-stone-700 transition-colors"
                          title="Rename folder"
                        >
                          <Pencil className="w-3 h-3" />
                        </button>
                        <button
                          onClick={(e) =>
                            promptDeleteFolder(
                              folder.id,
                              folder.name,
                              folderPages.length,
                              e,
                            )
                          }
                          className="p-1 hover:bg-red-100 text-stone-400 hover:text-red-600 transition-colors"
                          title="Delete folder"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    )}
                  </div>
                  {folderPages.map((page) => (
                    <div key={page.id} className="relative group">
                      <button
                        draggable
                        onDragStart={(e) => handleDragStart(e, page.id)}
                        onDragOver={(e) => e.preventDefault()}
                        onDrop={(e) => handleDropOnPage(e, page.id)}
                        onClick={() => setActivePage(page.id)}
                        className={`w-full flex items-center gap-2 px-2 py-1.5 text-sm font-mono transition-colors text-left pl-6 ${activePageId === page.id ? "bg-stone-100 text-stone-900" : "text-stone-600 hover:text-stone-900 hover:bg-stone-100"}`}
                      >
                        <FileText className="w-3 h-3 text-stone-400 shrink-0" />
                        {editingPageId === page.id ? (
                          <input
                            autoFocus
                            value={editTitle}
                            onChange={(e) => setEditTitle(e.target.value)}
                            onBlur={submitPageRename}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") submitPageRename();
                              if (e.key === "Escape") setEditingPageId(null);
                            }}
                            className="flex-1 bg-white border border-stone-300 px-1 outline-none text-stone-900"
                          />
                        ) : (
                          <span className="truncate flex-1">{page.title}</span>
                        )}
                      </button>
                      {!editingPageId && (
                        <div className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 flex items-center transition-all bg-[#F7F7F5] group-hover:bg-stone-100">
                          <button
                            onClick={(e) =>
                              startEditingPage(page.id, page.title, e)
                            }
                            className="p-1 hover:bg-stone-200 text-stone-400 hover:text-stone-700 transition-colors"
                            title="Rename page"
                          >
                            <Pencil className="w-3 h-3" />
                          </button>
                          <button
                            onClick={(e) =>
                              promptDeletePage(page.id, page.title, e)
                            }
                            className="p-1 hover:bg-red-100 text-stone-400 hover:text-red-600 transition-colors"
                            title="Delete page"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              );
            })}

            {/* Root Pages */}
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setIsDraggingOverRoot(true);
              }}
              onDragLeave={(e) => {
                // Ignore leave events from children elements
                if (!e.currentTarget.contains(e.relatedTarget as Node)) {
                  setIsDraggingOverRoot(false);
                }
              }}
              onDrop={handleDropOnRoot}
              className={`space-y-0.5 pt-2 mt-2 transition-colors min-h-[60px] ${folders.length > 0 ? "border-t border-stone-100" : ""} ${isDraggingOverRoot ? "bg-stone-200/50" : ""}`}
            >
              {rootPages.map((page) => (
                <div key={page.id} className="relative flex flex-col">
                  {/* Inline Folder Creation Prompt */}
                  {creatingFolderForPageId === page.id && (
                    <div className="px-2 py-1.5 mb-1 border border-stone-200 flex items-center gap-2 bg-stone-50 animate-in fade-in slide-in-from-top-1 shadow-sm">
                      <FolderIcon className="w-3 h-3 text-stone-800" />
                      <input
                        autoFocus
                        placeholder="Name this group..."
                        value={newFolderName}
                        onChange={(e) => setNewFolderName(e.target.value)}
                        onBlur={() => {
                          if (!newFolderName) setCreatingFolderForPageId(null);
                          else submitNewFolder();
                        }}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") submitNewFolder();
                          if (e.key === "Escape")
                            setCreatingFolderForPageId(null);
                        }}
                        className="flex-1 text-sm font-mono outline-none bg-transparent placeholder-stone-400 text-stone-800"
                      />
                    </div>
                  )}

                  <div className="relative group">
                    <button
                      draggable
                      onDragStart={(e) => handleDragStart(e, page.id)}
                      onDragOver={(e) => e.preventDefault()}
                      onDrop={(e) => handleDropOnPage(e, page.id)}
                      onClick={() => setActivePage(page.id)}
                      className={`w-full flex items-center gap-2 px-2 py-1.5 text-sm font-mono transition-colors text-left ${
                        creatingFolderForPageId === page.id
                          ? "bg-stone-100" // Highlight target page when grouping
                          : activePageId === page.id
                            ? "bg-stone-100 text-stone-900"
                            : "text-stone-600 hover:text-stone-900 hover:bg-stone-100"
                      }`}
                    >
                      <FileText className="w-3 h-3 text-stone-400 shrink-0" />
                      {editingPageId === page.id ? (
                        <input
                          autoFocus
                          value={editTitle}
                          onChange={(e) => setEditTitle(e.target.value)}
                          onBlur={submitPageRename}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") submitPageRename();
                            if (e.key === "Escape") setEditingPageId(null);
                          }}
                          className="flex-1 bg-white border border-stone-300 px-1 outline-none text-stone-900"
                        />
                      ) : (
                        <span className="truncate flex-1">{page.title}</span>
                      )}
                    </button>
                    {!editingPageId && (
                      <div className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 flex items-center transition-all bg-[#F7F7F5] group-hover:bg-stone-100">
                        <button
                          onClick={(e) =>
                            startEditingPage(page.id, page.title, e)
                          }
                          className="p-1 hover:bg-stone-200 text-stone-400 hover:text-stone-700 transition-colors"
                          title="Rename page"
                        >
                          <Pencil className="w-3 h-3" />
                        </button>
                        <button
                          onClick={(e) =>
                            promptDeletePage(page.id, page.title, e)
                          }
                          className="p-1 hover:bg-red-100 text-stone-400 hover:text-red-600 transition-colors"
                          title="Delete page"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-2 border-t border-stone-200">
          <button
            onClick={() => addNewPage("Untitled Document")}
            className="w-full flex items-center gap-2 px-2 py-1.5 text-sm font-mono text-stone-500 hover:text-stone-800 hover:bg-stone-100 rounded-none transition-colors text-left"
          >
            <Plus className="w-4 h-4 text-stone-400 shrink-0" />
            <span>New Page</span>
          </button>
          <button className="w-full flex items-center gap-2 px-2 py-1.5 text-sm font-mono text-stone-500 hover:text-stone-800 hover:bg-stone-100 rounded-none transition-colors text-left">
            <Settings className="w-4 h-4 text-stone-400 shrink-0" />
            <span>Settings</span>
          </button>
        </div>
      </aside>

      {/* Reusable Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={deleteModal.isOpen}
        title={deleteModal.title}
        message={deleteModal.message}
        confirmText="Delete"
        onConfirm={confirmDelete}
        onCancel={() => setDeleteModal((prev) => ({ ...prev, isOpen: false }))}
      />
    </>
  );
}
