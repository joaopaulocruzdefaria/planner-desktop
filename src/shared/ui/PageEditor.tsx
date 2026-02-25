interface PageEditorProps {
  title: string;
}

export function PageEditor({ title }: PageEditorProps) {
  return (
    <div className="flex-1 overflow-y-auto bg-white relative">
      {/* Background Dots mimicking Auth layout */}
      <div
        className="absolute w-full h-full pointer-events-none opacity-[0.03] z-0"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, black 1px, transparent 0)",
          backgroundSize: "32px 32px",
        }}
      ></div>

      <div className="max-w-3xl mx-auto py-24 px-12 relative z-10">
        {/* Technical Top Metadata */}
        <div className="flex items-center gap-4 text-xs font-mono text-stone-400 mb-12 uppercase tracking-wider border-b border-stone-100 pb-4">
          <span>ID: 4A9-XQ</span>
          <span>•</span>
          <span>Last modified: Just now</span>
        </div>

        <h1
          className="text-5xl font-serif tracking-tight text-stone-900 mb-8 outline-none"
          contentEditable
          suppressContentEditableWarning
        >
          {title}
        </h1>

        <div className="text-lg leading-relaxed text-stone-800 space-y-6 font-serif">
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
            technical aesthetic defined in our core rules.
          </p>

          <ul className="list-disc list-inside space-y-2 text-stone-700 ml-4 py-4 font-serif">
            <li>High-end Serif Typography for Reading</li>
            <li>Monospace Elements for Data</li>
            <li>Crisp 1px borders and Grid backgrounds</li>
          </ul>

          <div className="mt-12 p-4 bg-[#FBFBFB] border border-stone-200">
            <p className="text-stone-400 font-mono text-sm inline-flex items-center gap-2">
              <span className="w-2 h-2 bg-blue-500 rounded-none inline-block animate-pulse"></span>
              Press '/' to explore technical block commands...
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
