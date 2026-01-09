import React from "react";
import { ConfigPanelProps } from "./types";
import { StylePanel } from "./StylePanel";
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
        <button onClick={() => props.onExportSVG()} className="hover:bg-slate-200 px-2 py-1">
          Export SVG
        </button>
      </div>
      <DataPanel {...props} />
    </div>
  );
}
