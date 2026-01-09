import { ConfigPanelProps } from "./types";
import { DataPanel } from "./DataPanel";

export function ConfigPanel(props: ConfigPanelProps) {
  return (
    <div>
      <div className="border-b p-1 flex flex-row items-center gap-2">
        <button
          className="hover:bg-slate-200 font-bold px-2 py-1"
        >
          2026
        </button>
        <div className="grow" />
        <button onClick={() => props.onExportPNG()} className="hover:bg-slate-200 px-2 py-1">
          Export PNG
        </button>
      </div>
      <DataPanel {...props} />
    </div>
  );
}
