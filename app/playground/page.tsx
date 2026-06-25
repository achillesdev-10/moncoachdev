'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Sidebar } from '@/components/Sidebar';
import { ThemeToggle } from '@/components/ThemeToggle';
import Editor from 'react-simple-code-editor';
import { highlight, languages } from 'prismjs';
import 'prismjs/components/prism-markup';
import 'prismjs/components/prism-css';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-python';
import 'prismjs/themes/prism-tomorrow.css';
import { 
  Play, Save, Terminal, Code2, Eye, 
  Layers, Palette, FileJson, Cpu, Loader2,
  CheckCircle2, AlertCircle, X, Info, Maximize2
} from 'lucide-react';
import { supabase } from '@/lib/supabase';

// Types pour les langages supportés
type Language = 'html' | 'css' | 'javascript' | 'python';

interface ProjectData {
  html: string;
  css: string;
  js: string;
  python: string;
}

export default function PlaygroundPage() {
  const [activeTab, setActiveTab] = useState<Language>('html');
  const [code, setCode] = useState<ProjectData>({
    html: '<!-- HTML -->\n<div class="card">\n  <h1>Hello World</h1>\n  <p>Bienvenue dans ton Playground interactif !</p>\n  <button onclick="greet()">Clique-moi</button>\n</div>',
    css: '/* CSS */\nbody {\n  font-family: system-ui, sans-serif;\n  display: flex;\n  justify-content: center;\n  align-items: center;\n  min-height: 100vh;\n  background: #0f172a;\n  color: white;\n}\n\n.card {\n  background: #1e293b;\n  padding: 2rem;\n  border-radius: 1rem;\n  box-shadow: 0 10px 25px rgba(0,0,0,0.3);\n  text-align: center;\n  border: 1px solid #334155;\n}\n\nbutton {\n  background: #39ff14;\n  color: #0f172a;\n  border: none;\n  padding: 0.5rem 1rem;\n  border-radius: 0.5rem;\n  font-weight: bold;\n  cursor: pointer;\n  margin-top: 1rem;\n}',
    js: '// JavaScript\nfunction greet() {\n  alert("Salut les développeurs !");\n}',
    python: '# Python\nimport math\n\ndef calculate_circle_area(radius):\n    return math.pi * radius**2\n\nr = 5\narea = calculate_circle_area(r)\nprint(f"L\'aire d\'un cercle de rayon {r} est : {area:.2f}")\n\nfor i in range(3):\n    print(f"Ligne {i+1}")'
  });
  const [output, setOutput] = useState<string>('');
  const [pyodide, setPyodide] = useState<any>(null);
  const [isPyodideLoading, setIsPyodideLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [projectTitle, setProjectTitle] = useState('Mon Projet');
  const [previewContent, setPreviewContent] = useState('');
  const previewRef = useRef<HTMLDivElement>(null);

  const toggleFullScreen = () => {
    if (previewRef.current) {
      if (!document.fullscreenElement) {
        previewRef.current.requestFullscreen().catch(err => {
          alert(`Erreur lors du passage en plein écran: ${err.message}`);
        });
      } else {
        document.exitFullscreen();
      }
    }
  };

  // Charger Pyodide au besoin
  const loadPyodide = async () => {
    if (pyodide || isPyodideLoading) return;
    
    setIsPyodideLoading(true);
    try {
      // Nettoyer d'abord si un script existe déjà mais a échoué
      const existingScript = document.getElementById('pyodide-script');
      if (existingScript) existingScript.remove();

      // Charger le script Pyodide s'il n'est pas déjà là
      if (!(window as any).loadPyodide) {
        const script = document.createElement('script');
        script.id = 'pyodide-script';
        script.src = 'https://cdn.jsdelivr.net/pyodide/v0.25.0/full/pyodide.js';
        script.async = true;
        document.head.appendChild(script);
        await new Promise((resolve, reject) => {
          script.onload = resolve;
          script.onerror = () => reject(new Error("Échec du chargement du script Pyodide"));
          // Timeout de sécurité
          setTimeout(() => reject(new Error("Timeout du chargement de Pyodide")), 10000);
        });
      }
      
      if (typeof (window as any).loadPyodide !== 'function') {
        throw new Error("loadPyodide n'est pas une fonction après chargement du script");
      }

      const py = await (window as any).loadPyodide();
      setPyodide(py);
      setOutput('>>> Python prêt ! Cliquez sur Exécuter.');
    } catch (err: any) {
      console.error('Erreur Pyodide:', err);
      setOutput(`Erreur lors du chargement de Python : ${err.message}`);
    } finally {
      setIsPyodideLoading(false);
    }
  };

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => setUser(user));
    if (activeTab === 'python') loadPyodide();
  }, [activeTab]);

  const runCode = async () => {
    if (activeTab === 'python') {
      if (!pyodide) {
        await loadPyodide();
        return;
      }
      
      try {
        // Rediriger stdout vers notre console
        pyodide.runPython(`
          import sys
          import io
          sys.stdout = io.StringIO()
        `);
        
        await pyodide.runPythonAsync(code.python);
        const result = pyodide.runPython("sys.stdout.getvalue()");
        setOutput(result || '>>> Code exécuté (pas de sortie)');
      } catch (err: any) {
        setOutput(`Erreur Python :\n${err.message}`);
      }
    } else {
      // Web Preview
      updatePreview();
    }
  };

  const updatePreview = () => {
    const combinedCode = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <style>
            ${code.css}
          </style>
        </head>
        <body>
          ${code.html}
          <script>
            try {
              ${code.js}
            } catch (err) {
              console.error('Erreur JS dans le Playground:', err);
              document.body.innerHTML += '<div style="color: red; background: rgba(255,0,0,0.1); padding: 10px; border: 1px solid red; margin-top: 20px; font-family: monospace;">Erreur JS: ' + err.message + '</div>';
            }
          </script>
        </body>
      </html>
    `;
    
    setPreviewContent(combinedCode);
  };

  const handleSave = async () => {
    if (!user) {
      setShowSaveModal(true);
      return;
    }

    setSaving(true);
    try {
      const { error } = await supabase.from('user_projects').insert({
        user_id: user.id,
        title: projectTitle,
        html_code: code.html,
        css_code: code.css,
        js_code: code.js,
        python_code: code.python
      });

      if (error) throw error;
      alert('Projet sauvegardé avec succès !');
    } catch (err: any) {
      alert('Erreur lors de la sauvegarde : ' + err.message);
    } finally {
      setSaving(false);
      setShowSaveModal(false);
    }
  };

  const getLanguageHighlight = (lang: Language) => {
    switch (lang) {
      case 'html': return languages.markup;
      case 'css': return languages.css;
      case 'javascript': return languages.javascript;
      case 'python': return languages.python;
      default: return languages.markup;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex text-slate-900 dark:text-slate-300 transition-colors duration-300">
      <Sidebar />

      <main className="flex-grow ml-64 flex flex-col h-screen overflow-hidden">
        {/* Header Playground */}
        <header className="h-16 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-6 bg-white dark:bg-slate-900/50 backdrop-blur-xl shrink-0">
          <div className="flex items-center gap-4">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Terminal className="w-5 h-5 text-primary" />
            </div>
            <h1 className="font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
              Code Playground
            </h1>
            <div className="h-4 w-px bg-slate-200 dark:bg-slate-800" />
            <input 
              value={projectTitle}
              onChange={(e) => setProjectTitle(e.target.value)}
              className="bg-transparent border-none focus:ring-0 text-sm font-bold text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors"
            />
          </div>
          <div className="flex items-center gap-3">
            <button 
              onClick={runCode}
              disabled={isPyodideLoading}
              className="flex items-center gap-2 bg-primary text-slate-950 px-4 py-2 rounded-xl text-sm font-black uppercase tracking-wider hover:scale-105 active:scale-95 transition-all shadow-lg shadow-primary/20 disabled:opacity-50"
            >
              {isPyodideLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4 fill-current" />}
              Exécuter
            </button>
            <button 
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white px-4 py-2 rounded-xl text-sm font-bold hover:bg-slate-200 dark:hover:bg-slate-700 transition-all border border-slate-200 dark:border-slate-700 disabled:opacity-50"
            >
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              Sauvegarder
            </button>
            <ThemeToggle />
          </div>
        </header>

        {/* Workspace */}
        <div className="flex-grow flex overflow-hidden">
          {/* Panneau Éditeur (Gauche) */}
          <div className="w-1/2 flex flex-col border-r border-slate-200 dark:border-slate-800">
            {/* Onglets */}
            <div className="flex bg-slate-100 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
              {(['html', 'css', 'javascript', 'python'] as Language[]).map((lang) => (
                <button
                  key={lang}
                  onClick={() => setActiveTab(lang)}
                  className={`px-6 py-3 text-xs font-black uppercase tracking-widest transition-all flex items-center gap-2 border-r border-slate-200 dark:border-slate-800 ${
                    activeTab === lang 
                      ? 'bg-white dark:bg-slate-950 text-primary border-t-2 border-t-primary' 
                      : 'text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-800'
                  }`}
                >
                  {lang === 'html' && <Layers className="w-3 h-3" />}
                  {lang === 'css' && <Palette className="w-3 h-3" />}
                  {lang === 'javascript' && <FileJson className="w-3 h-3" />}
                  {lang === 'python' && <Cpu className="w-3 h-3" />}
                  {lang}
                </button>
              ))}
            </div>

            {/* Éditeur de code */}
            <div className="flex-grow overflow-y-auto bg-white dark:bg-slate-950 font-mono text-sm">
              <Editor
                value={code[activeTab === 'javascript' ? 'js' : activeTab]}
                onValueChange={(newVal) => {
                  const key = activeTab === 'javascript' ? 'js' : activeTab;
                  setCode({ ...code, [key]: newVal });
                }}
                highlight={(code) => highlight(code, getLanguageHighlight(activeTab), activeTab)}
                padding={24}
                className="min-h-full focus:outline-none"
                style={{
                  fontFamily: '"Fira Code", "Fira Mono", monospace',
                  fontSize: 14,
                }}
              />
            </div>
          </div>

          {/* Panneau Preview / Console (Droite) */}
          <div className="w-1/2 flex flex-col bg-slate-100 dark:bg-slate-900">
            {activeTab === 'python' ? (
              <div className="flex-grow flex flex-col p-6">
                <div className="flex items-center gap-2 mb-4 text-slate-500 font-bold text-xs uppercase tracking-widest">
                  <Terminal className="w-4 h-4" /> Python Console
                </div>
                <div className="flex-grow bg-slate-950 rounded-2xl p-6 font-mono text-sm text-blue-400 border border-slate-800 overflow-y-auto whitespace-pre-wrap">
                  {isPyodideLoading ? (
                    <div className="flex flex-col items-center justify-center h-full gap-4 text-slate-500">
                      <Loader2 className="w-8 h-8 animate-spin text-primary" />
                      Initialisation de l'environnement Python...
                    </div>
                  ) : (
                    output || '>>> Cliquez sur Exécuter pour voir le résultat'
                  )}
                </div>
              </div>
            ) : (
              <div className="flex-grow flex flex-col" ref={previewRef}>
                <div className="h-10 px-6 flex items-center justify-between bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 text-[10px] font-black uppercase tracking-widest text-slate-500">
                  <div className="flex items-center gap-2">
                    <Eye className="w-3 h-3" /> Live Preview
                  </div>
                  <button 
                    onClick={toggleFullScreen}
                    className="hover:text-primary transition-colors p-1"
                    title="Plein écran"
                  >
                    <Maximize2 className="w-4 h-4" />
                  </button>
                </div>
                <div className="flex-grow bg-white">
                  <iframe
                    title="preview"
                    className="w-full h-full border-none"
                    sandbox="allow-scripts allow-same-origin"
                    srcDoc={previewContent}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Modal de connexion pour sauvegarde */}
      {showSaveModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 w-full max-w-md rounded-[2.5rem] p-10 text-center shadow-2xl relative">
            <button 
              onClick={() => setShowSaveModal(false)}
              className="absolute top-6 right-6 p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all"
            >
              <X className="w-5 h-5 text-slate-500" />
            </button>
            <div className="w-20 h-20 bg-primary/10 rounded-3xl flex items-center justify-center mx-auto mb-6">
              <Info className="w-10 h-10 text-primary" />
            </div>
            <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-2 tracking-tight">VOULEZ-VOUS SAUVEGARDER ?</h2>
            <p className="text-slate-500 font-medium mb-8">Connectez-vous pour conserver vos projets dans votre bibliothèque personnelle.</p>
            
            <div className="flex flex-col gap-3">
              <a 
                href="/login" 
                className="w-full bg-primary text-slate-950 py-4 rounded-2xl font-black uppercase tracking-widest hover:scale-[1.02] transition-all shadow-lg shadow-primary/20"
              >
                Se Connecter
              </a>
              <button 
                onClick={() => setShowSaveModal(false)}
                className="w-full bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white py-4 rounded-2xl font-black uppercase tracking-widest hover:bg-slate-200 dark:hover:bg-slate-700 transition-all"
              >
                Continuer en invité
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
