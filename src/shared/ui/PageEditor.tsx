interface PageEditorProps {
  title: string;
}

export function PageEditor({ title }: PageEditorProps) {
  return (
    <div className="flex-1 overflow-y-auto bg-white">
      <div className="max-w-3xl mx-auto py-24 px-12">
        {/* Mock Cover or Icon space could go here */}

        <h1
          className="text-4xl font-bold tracking-tight text-stone-800 mb-8 outline-none"
          contentEditable
          suppressContentEditableWarning
        >
          {title}
        </h1>

        <div className="text-base leading-relaxed text-stone-800 space-y-4">
          <p
            className="outline-none"
            contentEditable
            suppressContentEditableWarning
          >
            This is a 100% static mock frontend. The SQLite backend won't block
            the UI rendering right now.
          </p>
          <p
            className="outline-none"
            contentEditable
            suppressContentEditableWarning
          >
            You can type here normally. The app embraces the minimalist
            aesthetic defined in our rules.
          </p>

          <ul className="list-disc list-inside space-y-2 text-stone-800 ml-4 py-4">
            <li>Lightning-fast interface</li>
            <li>No cloud dependencies required</li>
            <li>Focus-first environment</li>
          </ul>

          <p className="text-stone-400 italic">
            Press '/' to explore block commands...
          </p>
        </div>
      </div>
    </div>
  );
}
