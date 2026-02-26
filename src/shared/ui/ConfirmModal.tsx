interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmModal({
  isOpen,
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  onConfirm,
  onCancel,
}: ConfirmModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-stone-900/20 z-50 flex items-center justify-center backdrop-blur-[1px] p-4">
      <div className="bg-[#F7F7F5] border border-stone-300 w-full max-w-sm rounded-none shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="p-4 border-b border-stone-200 bg-white">
          <h2 className="font-serif text-lg text-stone-900 tracking-wide">
            {title}
          </h2>
        </div>
        <div className="p-4 bg-white">
          <p className="font-mono text-sm text-stone-600 leading-relaxed">
            {message}
          </p>
        </div>
        <div className="p-3 bg-[#F7F7F5] border-t border-stone-200 flex justify-end gap-2">
          <button
            onClick={onCancel}
            className="px-4 py-1.5 text-sm font-mono text-stone-600 hover:text-stone-900 hover:bg-stone-200 transition-colors rounded-none"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-1.5 text-sm font-mono text-white bg-red-600 hover:bg-red-700 transition-colors rounded-none"
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
