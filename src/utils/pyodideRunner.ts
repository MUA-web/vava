// Pyodide runner utility for running Python code in the browser
// https://pyodide.org/en/stable/usage/quickstart.html

let pyodide: any = null;
let isLoading = false;

export function isPyodideLoading() {
  return isLoading;
}

export async function loadPyodideIfNeeded() {
  if (!pyodide) {
    try {
      isLoading = true;
      // @ts-ignore
      pyodide = await window.loadPyodide({ indexURL: "https://cdn.jsdelivr.net/pyodide/v0.25.1/full/" });
    } catch (err: any) {
      isLoading = false;
      throw new Error(`Failed to load Pyodide: ${err.message || err}`);
    }
    isLoading = false;
  }
  return pyodide;
}

export async function runPython(code: string): Promise<string> {
  try {
    const pyodideInstance = await loadPyodideIfNeeded();
    // Redirect stdout
    let output = "";
    pyodideInstance.setStdout({
      batched: (s: string) => { output += s; },
    });
    pyodideInstance.setStderr({
      batched: (s: string) => { output += s; },
    });
    await pyodideInstance.runPythonAsync(code);
    return output || "Code executed successfully (no output)";
  } catch (err: any) {
    // Format Python errors and JS errors
    if (err && err.constructor && err.constructor.name === 'PythonError') {
      return `Python Error: ${err.message || err}`;
    }
    return `Execution Error: ${err.message || err}`;
  }
}

// Helper to inject the Pyodide script if not present
export function injectPyodideScript() {
  if (!document.getElementById('pyodide-script')) {
    const script = document.createElement('script');
    script.id = 'pyodide-script';
    script.src = 'https://cdn.jsdelivr.net/pyodide/v0.25.1/full/pyodide.js';
    script.async = true;
    document.body.appendChild(script);
  }
} 