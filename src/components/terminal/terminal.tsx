import { Terminal, useTerminal } from "@wterm/react";
import "@wterm/react/css";
import { getContainer } from '@/lib/webcontainer';
import { useRef, useEffect } from "react";
import { WebContainerProcess } from "@webcontainer/api";
function VolidTerminal() {
  const { ref, write } = useTerminal();
  const inputWriterRef = useRef<WritableStreamDefaultWriter | null>(null);
  const processRef = useRef<WebContainerProcess | null>(null);
  useEffect(() => {
    let cancelled = false;

    getContainer().then(async (container) => {
      const shellProcess = await container.spawn('jsh', {
        terminal: { cols: 80, rows: 24 },
      });
      if (cancelled) return;

      inputWriterRef.current = shellProcess.input.getWriter();

      shellProcess.output.pipeTo(new WritableStream({
        write(data) { write(data); },
      }));
    });

    return () => { cancelled = true; };
  }, []);

  return (
    <div className="h-full w-full bg-background overflow-hidden">
      <Terminal
        ref={ref}
        autoResize
        className="h-full w-full"
        onData={(data) => {
          inputWriterRef.current?.write(data);
        }}
      />
    </div>
  );
}
export default VolidTerminal;