import { useEffect, useRef, useState } from 'react';

interface TurnstileApi {
  render: (container: HTMLElement, options: {
    sitekey: string; action: string; theme: 'dark';
    callback: (token: string) => void;
    'expired-callback': () => void;
    'error-callback': () => void;
  }) => string;
  remove: (id: string) => void;
}
declare global { interface Window { turnstile?: TurnstileApi } }
let loader: Promise<TurnstileApi> | undefined;
function loadTurnstile(): Promise<TurnstileApi> {
  if (window.turnstile) return Promise.resolve(window.turnstile);
  if (!loader) {
    loader = new Promise<TurnstileApi>((resolve, reject) => {
      const script = document.createElement('script');
      const timer = window.setTimeout(() => { script.remove(); reject(new Error('Verification timed out.')); }, 15_000);
      script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';
      script.async = true;
      script.onload = () => { clearTimeout(timer); window.turnstile ? resolve(window.turnstile) : reject(new Error('Verification unavailable.')); };
      script.onerror = () => { clearTimeout(timer); script.remove(); reject(new Error('Verification unavailable.')); };
      document.head.appendChild(script);
    }).catch(error => { loader = undefined; throw error; });
  }
  return loader;
}

export default function Turnstile({ action, resetKey, onToken }: {
  action: 'contact' | 'health-check'; resetKey: number; onToken: (token: string) => void;
}) {
  const container = useRef<HTMLDivElement>(null);
  const [error, setError] = useState('');
  const [attempt, setAttempt] = useState(0);
  const sitekey = import.meta.env.PUBLIC_TURNSTILE_SITE_KEY;
  useEffect(() => {
    onToken('');
    setError('');
    if (!sitekey) return;
    let disposed = false;
    let widgetId: string | undefined;
    let api: TurnstileApi | undefined;
    void loadTurnstile().then(loaded => {
      if (disposed || !container.current) return;
      api = loaded;
      widgetId = loaded.render(container.current, {
        sitekey, action, theme: 'dark',
        callback: token => { if (!disposed) { onToken(token); setError(''); } },
        'expired-callback': () => { if (!disposed) { onToken(''); setError('Verification expired. Please retry.'); } },
        'error-callback': () => { if (!disposed) { onToken(''); setError('Verification could not load. Please retry.'); } },
      });
    }).catch(() => { if (!disposed) setError('Verification could not load. Please retry.'); });
    return () => { disposed = true; if (widgetId !== undefined) api?.remove(widgetId); };
  }, [sitekey, action, resetKey, attempt, onToken]);
  return <div>
    <div ref={container} />
    {!sitekey && <p role="status" className="text-sm text-muted-foreground">{import.meta.env.DEV ? 'Local development: verification requires test keys or the documented local bypass.' : 'Verification is temporarily unavailable. Please email team@upsight.digital.'}</p>}
    {error && <p role="alert" className="text-sm text-destructive">{error} <button type="button" className="underline" onClick={() => setAttempt(value => value + 1)}>Retry verification</button></p>}
  </div>;
}

export function Honeypot({ value, onChange }: { value: string; onChange: (value: string) => void }) {
  return <div className="hidden" aria-hidden="true">
    <label>Leave this field empty<input name="honeypot" value={value} onChange={event => onChange(event.target.value)} tabIndex={-1} autoComplete="off" maxLength={100} /></label>
  </div>;
}
