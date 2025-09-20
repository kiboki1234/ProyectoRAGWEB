// src/ApiDocs.jsx (CSS puro, usa .section/.card/.codeblock de tu index.css)
import React, { useRef, useState } from "react";

const Card = ({ children }) => <div className="card">{children}</div>;

function CodeBlock({ code, label = "bash" }) {
  const [copied, setCopied] = useState(false);
  const ref = useRef(null);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true); setTimeout(()=>setCopied(false), 1200);
    } catch {
      try {
        const r = document.createRange(); r.selectNodeContents(ref.current);
        const s = window.getSelection(); s.removeAllRanges(); s.addRange(r);
        document.execCommand("copy"); s.removeAllRanges();
        setCopied(true); setTimeout(()=>setCopied(false), 1200);
      } catch {}
    }
  };
  return (
    <div className="codeblock">
      <div className="codeblock-topbar">
        <span className="upper">{label}</span>
        <button className="btn-ghost" onClick={copy}>{copied ? "Copiado" : "Copiar"}</button>
      </div>
      <pre ref={ref} className="codeblock-pre"><code>{code}</code></pre>
    </div>
  );
}

export default function ApiDocs() {
  const askModels = `interface AskRequest {
  question: string;
  source?: string | null;
}

interface Citation {
  id: number;
  score: number;
  text: string;
  page?: number | null;
  source?: string | null;
}

interface AskResponse {
  answer: string;
  citations: Citation[];
}`;
  const resRoot = `{"ok": true, "service": "rag-offline-soberano"}`;
  const resHealth = `{"ok": true}`;
  const curlIngest = `curl -X POST "http://localhost:8000/ingest" \\
  -F "files=@/ruta/contrato.pdf" \\
  -F "files=@/ruta/manual.md"`;
  const resIngest = `{"ok": true, "chunks_indexed": 123, "files": ["contrato.pdf","manual.md"]}`;
  const curlIngestAll = `curl -X POST "http://localhost:8000/ingest/all"`;
  const resIngestAll = `{"ok": true, "files": ["a.pdf","b.md"], "chunks_indexed": 456}`;
  const resSources = `{"sources": ["contrato.pdf","manual.md","notas.txt"]}`;
  const bodyAsk = `{"question":"¿Cuál es el plazo del contrato?","source":"contrato.pdf"}`;
  const resAsk = `{
  "answer":"El plazo es de 12 meses contados desde la firma.",
  "citations":[{"id":27,"score":0.83,"text":"…El contrato tendrá una duración de doce (12) meses…","page":3,"source":"contrato.pdf"}]
}`;
  const resPaths = `{"docs_dir":"/abs/path/a/docs","store_dir":"/abs/path/a/store"}`;
  const resPdfjs = `{"PDFJS_DIR":"/abs/path/backend/assets/pdfjs","exists":true,"web_exists":true,"viewer_exists":true,"build_exists":true,"web_children":["viewer.html","images","locale","..."]}`;
  const jsExamples = `// Subir e indexar archivos
const form = new FormData();
form.append('files', new File([blobPdf], 'contrato.pdf'));
form.append('files', new File([blobMd], 'manual.md'));
await fetch('/ingest', { method: 'POST', body: form });

// Preguntar
const res = await fetch('/ask', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ question: '¿Cuál es el plazo?', source: 'contrato.pdf' })
});
const data = await res.json();

// Ver un PDF
// /pdfjs/web/viewer.html?file=%2Ffile%2Fcontrato.pdf`;

  return (
    <section id="api-docs" className="section section--fit">
      <details open>
        <summary className="section-summary">
          <div className="section-header">
            <div>
              <h2 className="h2">API – ProyectoRAG (FastAPI)</h2>
              <p className="muted">Contratos, ejemplos y buenas prácticas</p>
            </div>
            <div className="chevron" aria-hidden>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          </div>
        </summary>

        <div className="section-body">
          <div className="grid-2">
            <Card>
              <h3 className="text">Notas generales</h3>
              <ul className="list">
                <li><b>CORS:</b> abierto (*) para orígenes, métodos y headers.</li>
                <li><b>Tipos de archivo:</b> .pdf, .md, .markdown, .txt.</li>
                <li><b>Carpetas:</b> <code>DOCS_DIR</code> (docs), <code>STORE_DIR</code> (índice/FAISS).</li>
              </ul>
            </Card>
            <Card>
              <h3 className="text">Modelos /ask</h3>
              <CodeBlock label="ts" code={askModels} />
            </Card>
          </div>

          <div className="grid-2">
            <Card>
              <h4 className="text">1) GET /</h4>
              <p className="muted small">Salud / metadata simple.</p>
              <CodeBlock label="json" code={resRoot} />
            </Card>
            <Card>
              <h4 className="text">2) GET /health</h4>
              <p className="muted small">Ping de salud (opcional).</p>
              <CodeBlock label="json" code={resHealth} />
            </Card>
          </div>

          <Card>
            <h4 className="text">3) POST /ingest</h4>
            <p className="muted small">Sube documentos y crea/actualiza índice. Body <code>multipart/form-data</code> con uno o varios <code>files</code>.</p>
            <div className="grid-2">
              <CodeBlock label="bash" code={curlIngest} />
              <CodeBlock label="json" code={resIngest} />
            </div>
            <p className="muted xsmall">Códigos: 200 OK · 400 Bad Request (tipo no soportado).</p>
          </Card>

          <Card>
            <h4 className="text">4) POST /ingest/all</h4>
            <p className="muted small">Indexa/re-indexa todo en <code>DOCS_DIR</code>.</p>
            <div className="grid-2">
              <CodeBlock label="bash" code={curlIngestAll} />
              <CodeBlock label="json" code={resIngestAll} />
            </div>
            <p className="muted xsmall">Códigos: 200 OK · 400 si la carpeta está vacía.</p>
          </Card>

          <div className="grid-2">
            <Card>
              <h4 className="text">5) GET /sources</h4>
              <p className="muted small">Lista fuentes combinando carpeta e índice.</p>
              <CodeBlock label="json" code={resSources} />
            </Card>
            <Card>
              <h4 className="text">6) POST /ask</h4>
              <p className="muted small">Body (JSON): <code>question</code> y <code>source</code> (opcional).</p>
              <div className="grid-2">
                <CodeBlock label="json" code={bodyAsk} />
                <CodeBlock label="json" code={resAsk} />
              </div>
              <p className="muted xsmall">Códigos: 200 OK · 400 índice no encontrado · 404 sin pasajes relevantes.</p>
            </Card>
          </div>

          <div className="grid-3">
            <Card>
              <h4 className="text">7) GET /file/{'{'}name:path{'}'}</h4>
              <p className="muted small">Sirve un archivo desde <code>DOCS_DIR</code> (inline).</p>
            </Card>
            <Card>
              <h4 className="text">8) /files/*</h4>
              <p className="muted small">Montaje estático con <code>StaticFiles</code>.</p>
            </Card>
            <Card>
              <h4 className="text">9) /pdfjs/*</h4>
              <p className="muted small">Visor PDF.js. Ej: <code>/pdfjs/web/viewer.html?file=%2Ffile%2Fcontrato.pdf</code></p>
            </Card>
          </div>

          <div className="grid-2">
            <Card>
              <h4 className="text">10) GET /debug/paths</h4>
              <CodeBlock label="json" code={resPaths} />
            </Card>
            <Card>
              <h4 className="text">11) GET /debug/pdfjs</h4>
              <CodeBlock label="json" code={resPdfjs} />
            </Card>
          </div>

          <Card>
            <h4 className="text">Ejemplos rápidos (fetch)</h4>
            <CodeBlock label="js" code={jsExamples} />
          </Card>

          <Card>
            <h4 className="text">Errores comunes y cómo evitarlos</h4>
            <ul className="list">
              <li><b>400 en /ask:</b> no hay índice → ejecuta <code>/ingest</code> o <code>/ingest/all</code>.</li>
              <li><b>404 en /ask:</b> sin pasajes relevantes → verifica <code>source</code> o ingresa más documentos.</li>
              <li><b>400/404 en /file/…:</b> nombre inválido o archivo inexistente en <code>DOCS_DIR</code>.</li>
              <li><b>CORS:</b> por defecto abierto; si cambias, permite tu origen.</li>
            </ul>
          </Card>
        </div>
      </details>
    </section>
  );
}
