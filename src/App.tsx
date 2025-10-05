import '@skatteetaten/ds-core-designtokens/index.css';
import './layout.css'; // viktige container-klasser
import { useState, type ReactElement } from 'react';
import { TextField } from '@skatteetaten/ds-forms';
import { TopBannerExternal, Footer } from '@skatteetaten/ds-layout';
import { StepList } from '@skatteetaten/ds-collections';

type GenResult = { jsx: ReactElement | null; code: string };

function normalize(text: string) {
  return text
    .toLowerCase()
    .replaceAll('æ', 'ae')
    .replaceAll('ø', 'o')
    .replaceAll('å', 'aa')
    .trim();
}

/** Parser for “ovenfra og ned”: topbanner / hovedinnhold / footer */
function tryGenerateStructuredPage(raw: string): GenResult | null {
  const lines = raw.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
  if (lines.length === 0) return null;

  let wantsTop = false;
  let wantsFooter = false;
  let mainSpec = '';

  for (const line of lines) {
    const l = normalize(line);
    if (/\btopbanner\b/.test(l) || /\bheader\b/.test(l)) wantsTop = true;
    if (/\bfooter\b/.test(l)) wantsFooter = true;
    if (l.startsWith('hovedinnhold') || l.startsWith('main') || l.startsWith('innhold')) {
      const afterColon = line.split(':').slice(1).join(':').trim();
      mainSpec = afterColon || line;
    }
  }

  if (!wantsTop && !wantsFooter && !mainSpec) return null;

  const n = normalize(mainSpec);
  const hasH1 = /\bh1\b/.test(n);
  const hasSteplist = /\b(steplist|step list|steps|stegliste)\b/.test(n);

  // antall tekstfelt (f.eks. “2 tekstfelt”)
  let textFieldCount = 0;
  const countMatch = n.match(/(\d+)\s*(tekstfelt|text\s*fields?|inputs?)/);
  if (countMatch) textFieldCount = parseInt(countMatch[1], 10);
  if (!countMatch && /\b(tekstfelt|input)\b/.test(n)) textFieldCount = 1;

  // JSX for main (bruk samme bredde som resten av siden)
  const textFieldsJsx = Array.from({ length: textFieldCount }, (_, i) => (
    <TextField key={i} label={i === 0 ? 'Fornavn' : i === 1 ? 'Etternavn' : `Felt ${i + 1}`} />
  ));

  const mainJsx = (
    <main id="content" tabIndex={-1}>
      {hasH1 && <h1>Eksempelside</h1>}
      <article className="semanticArticle">
        {hasSteplist && (
          <StepList>
            <StepList.Step stepNumber={1} title="Steg 1">Steg 1</StepList.Step>
            <StepList.Step stepNumber={2} title="Steg 2">Steg 2</StepList.Step>
          </StepList>
        )}
        {textFieldsJsx}
      </article>
    </main>
  );

  // Kode-streng (matcher strukturen)
  const tfCode = textFieldsJsx
    .map((_, i) => {
      const label = i === 0 ? 'Fornavn' : i === 1 ? 'Etternavn' : `Felt ${i + 1}`;
      return `      <TextField label="${label}" />`;
    })
    .join('\n');

  const parts: string[] = [];
  if (wantsTop) parts.push('  <TopBannerExternal />');
  parts.push('  <main id="content" tabIndex={-1}>');
  if (hasH1) parts.push('    <h1>Eksempelside</h1>');
  parts.push('    <article className="semanticArticle">');
  if (hasSteplist)
    parts.push(
      `      <StepList>
        <StepList.Step stepNumber={1} title="Steg 1">Steg 1</StepList.Step>
        <StepList.Step stepNumber={2} title="Steg 2">Steg 2</StepList.Step>
      </StepList>`
    );
  if (textFieldCount > 0) parts.push(tfCode);
  parts.push('    </article>');
  parts.push('  </main>');
  if (wantsFooter) parts.push('  <Footer />');

  const code = `<>\n${parts.join('\n')}\n</>`;

  const jsx = (
    <>
      {wantsTop && <TopBannerExternal />}
      {mainJsx}
      {wantsFooter && <Footer />}
    </>
  );

  return { jsx, code };
}

function generateFromPrompt(raw: string): GenResult {
  const structured = tryGenerateStructuredPage(raw);
  if (structured) return structured;
  return { jsx: null, code: '// Fant ingen matchende komponent eller side-struktur' };
}

export default function App() {
  const [prompt, setPrompt] = useState('');
  const [code, setCode] = useState('');
  const [component, setComponent] = useState<ReactElement | null>(null);
  const [copiedCodeBlock, setCopiedCodeBlock] = useState(false);

  const handleGenerate = () => {
    const { jsx, code } = generateFromPrompt(prompt);
    setComponent(jsx);
    setCode(code);
    setCopiedCodeBlock(false);
  };

  const copyCode = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopiedCodeBlock(true);
    } catch {
      alert('Klarte ikke å kopiere – kopier manuelt (Ctrl/Cmd+C).');
    }
  };

  return (
    <div className="pageRoot">
      <div className="pageInner">

        {/* Generator-panel (følger samme bredde som siden) */}
        <div style={{ border: '1px solid #ddd', background: '#fafafa', borderRadius: 6, padding: 16, marginBottom: 24 }}>
          <label htmlFor="prompt" style={{ display: 'block', fontWeight: 600 }}>
            Hva vil du lage?
          </label>
          <textarea
            id="prompt"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            rows={4}
            style={{ width: '100%', marginTop: 8, padding: 8, fontFamily: 'inherit' }}
            placeholder={`Skriv ovenfra og ned, f.eks.:
topbanner
hovedinnhold: h1, steplist, 2 tekstfelt
footer`}
          />
          <div style={{ marginTop: 8 }}>
            <button onClick={handleGenerate}>Generer</button>
          </div>
        </div>

        {/* Resultat */}
        {code && (
          <>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ fontWeight: 600, marginBottom: 4 }}>Generert kode</div>
              <button onClick={copyCode}>{copiedCodeBlock ? 'Kopiert!' : 'Kopier kode'}</button>
            </div>

            <pre
              style={{
                background: '#f4f4f4',
                padding: 12,
                overflow: 'auto',
                border: '1px solid #e0e0e0',
                borderRadius: 6,
                marginBottom: 24
              }}
            >
              {code}
            </pre>

            <div>
              <div style={{ fontWeight: 600, marginBottom: 4 }}>Forhåndsvisning</div>
              <div style={{ padding: 16, border: '1px solid #ddd', borderRadius: 4, background: '#fff' }}>
                {component}
              </div>
            </div>
          </>
        )}

      </div>
    </div>
  );
}
