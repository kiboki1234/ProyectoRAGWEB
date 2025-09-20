// src/App.jsx
import React, { useEffect, useRef, useState } from "react";
import ApiDocs from "./ApiDocs";  // sección de documentación externa

/* ProyectoRAG — Landing (CSS puro, responsive) */

const Chip = ({ children }) => <span className="chip">{children}</span>;

const Section = ({ id, title, subtitle, children, defaultOpen = true }) => (
  <section id={id} className="section">
    <details open={defaultOpen}>
      <summary className="section-summary">
        <div className="section-header">
          <div>
            <h2 className="h2">{title}</h2>
            {subtitle && <p className="muted">{subtitle}</p>}
          </div>
          <div className="chevron" aria-hidden>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        </div>
      </summary>
      <div className="section-body">{children}</div>
    </details>
  </section>
);

const CodeBlock = ({ code, label = "bash" }) => {
  const [copied, setCopied] = useState(false);
  const codeRef = useRef(null);
  const doCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    } catch {
      try {
        const el = codeRef.current;
        if (!el) return;
        const r = document.createRange();
        r.selectNodeContents(el);
        const s = window.getSelection();
        s.removeAllRanges();
        s.addRange(r);
        document.execCommand("copy");
        s.removeAllRanges();
        setCopied(true);
        setTimeout(() => setCopied(false), 1200);
      } catch {}
    }
  };
  return (
    <div className="codeblock">
      <div className="codeblock-topbar">
        <span className="upper">{label}</span>
        <button onClick={doCopy} className="btn-ghost">{copied ? "Copiado" : "Copiar"}</button>
      </div>
      <pre ref={codeRef} className="codeblock-pre"><code>{code}</code></pre>
    </div>
  );
};

const SmallCard = ({ children }) => <div className="card">{children}</div>;

const NavLink = ({ href, children }) => (
  <a href={href} className="navlink">{children}</a>
);

const BackToTop = () => {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 600);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  if (!show) return null;
  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className="btn-top"
      aria-label="Volver arriba"
    >
      ↑
    </button>
  );
};

const Hero = () => (
  <div className="hero">
    <div className="hero-row">
      <div>
        <h1 className="h1">ProyectoRAG — Recuperación Aumentada por Generación</h1>
        <p className="lead">
          Búsqueda semántica y respuestas con <strong>citas verificables</strong> sobre tus documentos. Corre local, offline y con herramientas de <strong>software libre</strong>.
        </p>
      </div>
      <div className="chips">
        <Chip>Offline</Chip>
        <Chip>FAISS</Chip>
        <Chip>FastAPI</Chip>
        <Chip>React/Vite</Chip>
        <Chip>OCR</Chip>
        <Chip>Embeddings</Chip>
        <Chip>Reranker opcional</Chip>
        <Chip>Docker</Chip>
      </div>
    </div>
  </div>
);

export default function ProyectoRAGLanding() {
  const commandsDev = `# API (desarrollo)
uvicorn api.main:app --host 0.0.0.0 --port 8000 --reload

# UI (React)
npm install && npm run dev`;
  const commandsDocker = `# Construcción y despliegue con Docker Compose
docker compose up -d

# (Opcional) build multi-arquitectura
docker buildx create --use
docker buildx build --platform linux/amd64,linux/arm64 -t docker.io/<usuario>/proyectorag:1.0.0 -t docker.io/<usuario>/proyectorag:latest --push --sbom=false --provenance=false .`;
  const asciiArq = `[Cliente Web/CLI]
      │  pregunta
      ▼
[API Gateway]
      │  (auth, rate-limit)
      ▼
[Orquestador RAG]
  ├─ Retriever (FAISS)
  ├─ Filtros (colección/etiquetas)
  ├─ Reranker (opcional)
  ├─ LLM (local / API)
  └─ Citation Builder
      │  usa
      ▼
[Índice vectorial + Metadatos]
      │  se alimenta de
      ▼
[Pipeline de Ingesta]
  (PDF→texto, OCR, limpieza, chunking, embeddings)`;

  const nav = [
    ["#problema", "Problema"],
    ["#que-es", "¿Qué es?"],
    ["#para-que", "¿Para qué sirve?"],
    ["#libre", "Beneficios (Software Libre)"],
    ["#ajustes", "Cambios clave (historial)"],
    ["#arquitectura", "Arquitectura"],
    ["#api-docs", "API Docs"],
    ["#pipeline", "Pipeline de ingesta"],
    ["#flujo", "Flujo RAG"],
    ["#stack", "Stack"],
    ["#modulos", "Módulos"],
    ["#config", "Configuración (.env)"],
    ["#modelo", "Modelo de datos"],
    ["#despliegue", "Despliegue"],
    ["#offline", "Empaquetado offline"],
    ["#casos", "Casos de uso"],
    ["#buenas", "Buenas prácticas"],
    ["#seguridad", "Seguridad"],
    ["#limitaciones", "Limitaciones"],
    ["#faq", "FAQ"],
  ];
  const [menuOpen, setMenuOpen] = useState(false);
  // Genera el SVG como string (puedes adaptar el contenido)
const openAsset = (path) => {
  const url = `${import.meta.env.BASE_URL}${path.replace(/^\//,'')}`; // robusto para Vite
  const win = window.open(url, '_blank', 'noopener');
  if (!win) alert('Habilita ventanas emergentes para ver el diagrama.');
};




  return (
    <main className="app">
      {/* Header */}
      <header className="header">
        <div className="header-inner">
          <div className="brand">
            <div className="brand-mark">RAG</div>
            <div>
              <div className="brand-sub">FreedomDay · ESPE</div>
              <div className="brand-title">ProyectoRAG</div>
            </div>
          </div>

<button
  type="button"
  onClick={() => openAsset('/diagramas/diagrmaProcesos.svg')}
  className="btn-link"
>
  Diagrama de proceso
</button>

<button
  type="button"
  onClick={() => openAsset('/diagramas/diagrama-flujo.svg')}
  className="btn-link"
>
  Diagrama de flujo
</button>


          {/* Botón hamburguesa (móvil) */}
          <button
            className="hamburger"
            aria-label="Abrir menú"
            aria-controls="mobile-menu"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen(v => !v)}
          >
            <span className="bar" />
            <span className="bar" />
            <span className="bar" />
          </button>

          {/* Accesos externos */}
          <div className="header-actions">
            <a
              href="https://github.com/kiboki1234/proyectoRAG.git"
              target="_blank" rel="noopener noreferrer"
              className="btn-link" aria-label="Abrir GitHub"
            >GitHub</a>

            <a
              href="https://hub.docker.com/r/kiboki1234/proyectorag"
              target="_blank" rel="noopener noreferrer"
              className="btn-link" aria-label="Abrir Docker Hub"
            >Docker</a>

            <span className="divider" aria-hidden="true"></span>

            <a
              href="https://www.linkedin.com/in/andres-espin-9463121b1/"
              target="_blank" rel="noopener noreferrer"
              className="btn-link" aria-label="Abrir LinkedIn"
            >LinkedIn</a>

            <a
              href="https://www.youtube.com/@TodoFacilConUnClick"
              target="_blank" rel="noopener noreferrer"
              className="btn-link" aria-label="Abrir YouTube"
            >YouTube</a>

            <a
              href="https://kibotech.org/"
              target="_blank" rel="noopener noreferrer"
              className="btn-link" aria-label="Abrir Kibotech"
            >Kibotech</a>
          </div>
        </div>

        {/* Menú móvil */}
        <div
          id="mobile-menu"
          className={`mobile-menu ${menuOpen ? "is-open" : ""}`}
          onClick={() => setMenuOpen(false)}
        >
          <div
            className="mobile-menu-panel"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="toc-title" style={{ padding: "0 8px 6px" }}>Menú</div>
            {/* Enlaces de secciones */}
            {nav.map(([href, label]) => (
              <a
                key={href}
                href={href}
                className="navlink"
                onClick={() => setMenuOpen(false)}
              >
                {label}
              </a>
            ))}

            <div className="divider" style={{ margin: "8px 0" }} />

            {/* Enlaces externos (los mismos del header) */}
            <div className="ext">
              <a href="https://github.com/kiboki1234/proyectoRAG.git" target="_blank" rel="noopener noreferrer" className="btn-link">GitHub</a>
              <a href="https://hub.docker.com/r/kiboki1234/proyectorag" target="_blank" rel="noopener noreferrer" className="btn-link">Docker</a>
              <a href="https://www.linkedin.com/in/andres-espin-9463121b1/" target="_blank" rel="noopener noreferrer" className="btn-link">LinkedIn</a>
              <a href="https://www.youtube.com/@TodoFacilConUnClick" target="_blank" rel="noopener noreferrer" className="btn-link">YouTube</a>
              <a href="https://kibotech.org/" target="_blank" rel="noopener noreferrer" className="btn-link">Kibotech</a>
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="container">
        {/* Sidebar */}
        <aside className="sidebar hide-sm">
          <div className="toc">
            <div className="toc-title">Secciones</div>
            {nav.map(([href, label]) => (
              <NavLink key={href} href={href}>{label}</NavLink>
            ))}
          </div>
        </aside>

        {/* Main */}
        <div className="main">
          <Hero />

          {/* Problema */}
          <Section id="problema" title="¿Qué problema resolvemos?" subtitle="Información dispersa, búsqueda lenta, privacidad y operación sin internet">
            <div className="grid-3">
              <SmallCard>
                <h3 className="text">Datos dispersos</h3>
                <p className="muted">PDFs, imágenes, correos y normas en múltiples carpetas y formatos.</p>
              </SmallCard>
              <SmallCard>
                <h3 className="text">Búsqueda manual lenta</h3>
                <p className="muted">Difícil encontrar respuestas precisas; riesgo de errores y retrabajos.</p>
              </SmallCard>
              <SmallCard>
                <h3 className="text">Privacidad & offline</h3>
                <p className="muted">Servicios en la nube son costosos y no siempre cumplen requisitos de soberanía.</p>
              </SmallCard>
            </div>
            <p className="muted small">Reto: respuestas con <strong>citas verificables</strong>, en español, rápidas y de <strong>bajo costo</strong>, incluso sin conexión.</p>
          </Section>

          {/* Qué es */}
          <Section id="que-es" title="¿Qué es ProyectoRAG?" subtitle="Plataforma libre para ingestar documentos, indexar y responder con RAG">
            <p className="muted">Ingerimos documentos, creamos embeddings y construimos respuestas usando recuperación semántica. Corre local, en contenedores o en la nube, manteniendo el control total de datos.</p>
            <div className="grid-2">
              <SmallCard>
                <div className="muted small">Elevator pitch (10s)</div>
                <p className="text">“Pon tus PDFs y pregunta en español; te respondemos con citas verificables, sin exponer datos a terceros.”</p>
              </SmallCard>
              <SmallCard>
                <div className="muted small">Modos</div>
                <div className="chips">
                  <Chip>Local</Chip><Chip>Docker</Chip><Chip>Nube</Chip>
                </div>
              </SmallCard>
            </div>
          </Section>

          {/* Para qué sirve */}
          <Section id="para-que" title="¿Para qué sirve?" subtitle="Q&A con citas, asistentes especializados y exploración semántica">
            <ul className="list">
              <li>Respuestas con <strong>citas y páginas</strong>.</li>
              <li>Asistentes de dominio (normativas, facturas, protocolos, veterinaria).</li>
              <li>Exploración semántica (por significado, no solo palabras exactas).</li>
              <li>Extracción de campos clave con OCR en PDFs escaneados.</li>
            </ul>
          </Section>

          {/* Software libre */}
          <Section id="libre" title="¿Cómo beneficia al Software Libre?" subtitle="Independencia tecnológica, bajo costo y comunidad">
            <div className="grid-2">
              <SmallCard>
                <ul className="list">
                  <li>Código abierto ⇒ auditoría y mejora comunitaria.</li>
                  <li>Soberanía de datos ⇒ modo offline, cero lock-in.</li>
                  <li>Bajo costo ⇒ FAISS, sentence-transformers, Tesseract.</li>
                </ul>
              </SmallCard>
              <SmallCard>
                <ul className="list">
                  <li>Transferencia de conocimiento: docs y ejemplos.</li>
                  <li>Issues/PRs/forks para contextos locales.</li>
                  <li>Licencias: MIT/Apache-2.0 · CC-BY-4.0 (modelos/datos).</li>
                </ul>
              </SmallCard>
            </div>
          </Section>

          {/* Cambios clave */}
          <Section id="ajustes" title="Cambios clave aplicados (historial)" subtitle="Lecciones y parches incorporados">
            <div className="grid-2">
              <SmallCard>
                <h3 className="text">Guardrails de contenido</h3>
                <ul className="list">
                  <li>Cita obligatoria y fallback “Sin evidencia suficiente”.</li>
                  <li>Filtro por colección/etiquetas para no mezclar dominios.</li>
                  <li>Temperature=0 y límite de contexto.</li>
                </ul>
              </SmallCard>
              <SmallCard>
                <h3 className="text">Mejoras de recuperación</h3>
                <ul className="list">
                  <li>Chunking con solapamiento; limpieza de encabezados/pies.</li>
                  <li>Re-ranking opcional con cross-encoder.</li>
                  <li>Metadatos enriquecidos (título, página, tags, ruta).</li>
                </ul>
              </SmallCard>
              <SmallCard>
                <h3 className="text">OCR y normalización</h3>
                <ul className="list">
                  <li>OCR ES/EN con Tesseract para PDFs escaneados.</li>
                  <li>Normalización UTF-8 y tablas→texto.</li>
                </ul>
              </SmallCard>
              <SmallCard>
                <h3 className="text">UX de evidencia</h3>
                <ul className="list">
                  <li>Respuesta + citas + páginas; resaltado del pasaje.</li>
                  <li>Exportar respuesta con referencias.</li>
                </ul>
              </SmallCard>
            </div>
          </Section>

          {/* Arquitectura */}
          <Section id="arquitectura" title="Arquitectura general" subtitle="Vista a 10.000 pies">
            <CodeBlock label="ascii" code={asciiArq} />
          </Section>

          {/* Documentación de la API (archivo separado) */}
          <ApiDocs />

          {/* Pipeline */}
          <Section id="pipeline" title="Pipeline de ingesta" subtitle="Cómo entra el conocimiento">
            <ol className="list num">
              <li>Carga: PDFs, imágenes (JPG/PNG), DOCX, HTML.</li>
              <li>Normalización: pypdfium2/PyPDF2; OCR con Tesseract.</li>
              <li>Limpieza: encabezados/pies, tablas→texto, UTF-8.</li>
              <li>Segmentación (chunking) con solapamiento.</li>
              <li>Embeddings multilingües.</li>
              <li>Indexado: FAISS + metadatos.</li>
            </ol>
          </Section>

          {/* Flujo RAG */}
          <Section id="flujo" title="Flujo de respuesta (RAG)" subtitle="Retriever → (Re-ranker) → LLM → Citas">
            <ul className="list">
              <li>Recuperamos k fragmentos (FAISS).</li>
              <li>Re-rank opcional con cross-encoder.</li>
              <li>LLM redacta usando solo esos fragmentos (anti-alucinación).</li>
              <li>Respuesta + citas + páginas.</li>
            </ul>
            <p className="muted small">Ventaja: controlamos la evidencia usada por el modelo.</p>
          </Section>

          {/* Stack */}
          <Section id="stack" title="Stack tecnológico" subtitle="Libres e intercambiables">
            <div className="chips">
              {["Python","FastAPI","FAISS","SQLite","sentence-transformers","Tesseract","pypdfium2","PyPDF2","React","Vite","Docker","Firebase Auth (opcional)","RAGAS/pytest (eval)"].map(t => <Chip key={t}>{t}</Chip>)}
            </div>
            <p className="muted small">Todo puede cambiarse por alternativas libres equivalentes.</p>
          </Section>

          {/* Módulos */}
          <Section id="modulos" title="¿Cómo está hecho? (módulos)" subtitle="Estructura lógica">
            <div className="grid-2">
              <SmallCard>
                <ul className="list">
                  <li><code>ingest/</code> — conectores, OCR, parsers, chunking, embeddings.</li>
                  <li><code>index/</code> — FAISS + metadatos, actualización incremental.</li>
                  <li><code>api/</code> — <code>/ingest</code>, <code>/ask</code>, <code>/search</code>.</li>
                </ul>
              </SmallCard>
              <SmallCard>
                <ul className="list">
                  <li><code>ui/</code> — buscador y visor de PDF con resaltado de citas.</li>
                  <li><code>eval/</code> — métricas y pruebas de calidad.</li>
                  <li><code>deploy/</code> — Dockerfiles, compose y bundle portátil.</li>
                </ul>
              </SmallCard>
            </div>
          </Section>

          {/* Configuración */}
          <Section id="config" title="Configuración (.env ejemplo)" subtitle="Parámetros típicos">
            <CodeBlock label="env" code={`# FastAPI
API_HOST=0.0.0.0
API_PORT=8000

# Embeddings
EMBED_MODEL=all-MiniLM-L6-v2
EMBED_DEVICE=cpu

# Índice
INDEX_DIR=./indices

# OCR
OCR_ENABLED=true
OCR_LANG=spa+eng

# Auth (opcional)
AUTH_PROVIDER=firebase
FIREBASE_PROJECT_ID=

# UI
VITE_API_URL=http://localhost:8000`} />
          </Section>

          {/* Modelo de datos */}
          <Section id="modelo" title="Modelo de datos (simplificado)" subtitle="Entidades principales">
            <div className="grid-2">
              <SmallCard>
                <h3 className="text">Document</h3>
                <ul className="list">
                  <li>id, title, path, type, tags[], createdAt</li>
                  <li>pages, ocr, lang</li>
                </ul>
              </SmallCard>
              <SmallCard>
                <h3 className="text">Chunk</h3>
                <ul className="list">
                  <li>docId, page, text, embedding, span (start,end)</li>
                  <li>meta: heading, section, table-hints</li>
                </ul>
              </SmallCard>
            </div>
          </Section>

          {/* Despliegue */}
          <Section id="despliegue" title="Modos de despliegue" subtitle="Local, contenedores y nube">
            <ul className="list">
              <li>Dev local: <code>uvicorn</code> + <code>npm run dev</code>.</li>
              <li>Contenedores: <code>docker compose up -d</code>.</li>
              <li>Nube: Render/VPS con TLS.</li>
            </ul>
            <div className="grid-2">
              <CodeBlock code={commandsDev} label="bash" />
              <CodeBlock code={commandsDocker} label="bash" />
            </div>
          </Section>

          {/* Offline */}
          <Section id="offline" title="Empaquetado offline (portátil)" subtitle="Bundle con modelos y OCR">
            <ul className="list">
              <li>Incluye modelos <code>.safetensors</code>, índices FAISS y binarios Tesseract.</li>
              <li>Soporta CPU-only; opcional GPU.</li>
              <li>Build multi-arquitectura (amd64/arm64).</li>
            </ul>
          </Section>

          {/* Casos */}
          <Section id="casos" title="Casos de uso demostrados" subtitle="Aplicaciones reales">
            <div className="grid-2">
              <SmallCard>
                <h3 className="text">Facturas y comprobantes</h3>
                <p className="muted">Extracción de campos y preguntas frecuentes (con etiquetas).</p>
              </SmallCard>
              <SmallCard>
                <h3 className="text">Normativas y reglamentos</h3>
                <p className="muted">Respuestas con artículo/página citada; trazabilidad total.</p>
              </SmallCard>
              <SmallCard>
                <h3 className="text">Material académico ESPE</h3>
                <p className="muted">Guías y resúmenes con fuentes exactas.</p>
              </SmallCard>
              <SmallCard>
                <h3 className="text">Veterinaria</h3>
                <p className="muted">Parasitología/patología con búsquedas cruzadas.</p>
              </SmallCard>
            </div>
          </Section>

          {/* Buenas prácticas */}
          <Section id="buenas" title="Buenas prácticas y calidad" subtitle="Anti-alucinación y evaluación">
            <ul className="list">
              <li>Prompt: “responde solo con fuentes citadas”.</li>
              <li>Hybrid search (BM25 + vectorial) opcional.</li>
              <li>Trazabilidad: cada respuesta incluye citas y páginas.</li>
              <li>Pruebas: dataset Q&A de regresión; RAGAS.</li>
            </ul>
          </Section>

          {/* Seguridad */}
          <Section id="seguridad" title="Seguridad y privacidad" subtitle="Control total">
            <ul className="list">
              <li>Datos en tu infraestructura (modo offline).</li>
              <li>Auth con JWT/Firebase/Keycloak (intercambiables).</li>
              <li>Sin envío a terceros en modo local.</li>
            </ul>
          </Section>

          {/* Limitaciones */}
          <Section id="limitaciones" title="Limitaciones conocidas" subtitle="Para decidir con criterio">
            <ul className="list">
              <li>OCR en escaneos de baja resolución limita calidad.</li>
              <li>Embeddings ligeros vs. modelos pesados (trade-off precisión).</li>
              <li>Curación de fuentes y etiquetado mejoran resultados.</li>
            </ul>
          </Section>

          {/* FAQ */}
          <Section id="faq" title="FAQ" subtitle="Preguntas frecuentes">
            <div className="stack">
              <SmallCard>
                <p className="text">¿Puede funcionar 100% sin internet?</p>
                <p className="muted">Sí, con el bundle offline (modelos + índices + OCR).</p>
              </SmallCard>
              <SmallCard>
                <p className="text">¿Cómo evito respuestas fuera de dominio?</p>
                <p className="muted">Usa filtros por <code>tags</code>/colección en <code>/ask</code> + “cita obligatoria”.</p>
              </SmallCard>
              <SmallCard>
                <p className="text">¿Puedo cambiar de LLM?</p>
                <p className="muted">Sí, el orquestador permite alternar local/API.</p>
              </SmallCard>
            </div>
          </Section>

          <footer className="footer">
            <span>© 2025 AndresEspin · ESPE — ProyectoRAG</span>
            <a href="#" onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="link">Ir al inicio ↑</a>
          </footer>
        </div>
      </div>

      <BackToTop />
    </main>
  );
}
