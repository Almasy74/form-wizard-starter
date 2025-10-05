# Form Wizard Starter – Context

## 🎯 Formål

Prosjektet er et **AI-assistert verktøy** for å generere React-sider og komponenter basert på **Skatteetatens designsystem (DS)**.  
Målet er å la brukere skrive en enkel, naturlig tekstbeskrivelse – et *prompt* – som oversettes til riktig DS-komponentkode og visning.

---

## 🧩 Nåværende funksjonalitet

1. **Prompt-felt**: Bruker skriver inn f.eks.  
topbanner
hovedinnhold: h1, steplist, 2 tekstfelt
footer

markdown
Kopier kode
2. **Parser** leser prompten ovenfra og ned:
- Gjenkjenner `topbanner`, `footer`, `hovedinnhold`, `h1`, `steplist`, `tekstfelt` osv.
- Oppretter tilsvarende React-komponenter.
3. **Generert kode vises som JSX**, og kan **kopieres med knapp**.
4. **Forhåndsvisning** rendres direkte i nettleseren med ekte DS-komponenter.
5. Alt bruker ekte komponenter fra DS (`@skatteetaten/ds-*`), ikke kopier eller tilpassede varianter.

---

## 🧱 Komponenter som støttes nå

| Pakke | Komponenter |
|-------|--------------|
| `@skatteetaten/ds-layout` | `TopBannerExternal`, `Footer` |
| `@skatteetaten/ds-forms` | `TextField` |
| `@skatteetaten/ds-collections` | `StepList` |
| `@skatteetaten/ds-core-designtokens` | Farger, spacing, typografi |

Planen er å utvide støtte for flere komponenter fra:
- `@skatteetaten/ds-buttons`
- `@skatteetaten/ds-panels`
- `@skatteetaten/ds-alerts`
- `@skatteetaten/ds-icons`
- `@skatteetaten/ds-overlays`

---

## 🧠 Prompt-tolkning (hovedlogikk)

Kjernen ligger i `tryGenerateStructuredPage()` i `App.tsx`.

Logikken fungerer slik:

1. **Input splittes på linjer**  
Eksempel:
topbanner
hovedinnhold: h1, steplist, 2 tekstfelt
footer

markdown
Kopier kode

2. **For hver linje**:
- `topbanner` → `TopBannerExternal`
- `footer` → `Footer`
- `hovedinnhold:` → oppretter `<main>`
  - `h1` → `<h1>Eksempelside</h1>`
  - `steplist` → `<StepList>` med to steg
  - `tekstfelt` → `<TextField />` x n

3. **Generert JSX** returneres + ren tekstkodevisning (JSX-string).

4. **Ingen `<article>`**, `<section>` eller lignende semantikk utenfor DS.

---

## 🧭 Layout og bredder

Prosjektet skal etterligne **publikumssider hos Skatteetaten**.  
Bredder følger prinsippene i designmønsteret [Sideoppsett – Publikum](https://www.skatteetaten.no/stilogtone/monster/sideoppsett/sideoppsett-publikum/):

| Skjermstørrelse | Maks bredde | Marg |
|-----------------|--------------|------|
| Desktop (L) | 1160px | auto (midtstilt) |
| Mellomstor (M) | 960px | auto |
| Mobil (S) | 560px | full bredde |

Container-klassen `.site` håndterer dette for både promptfelt, resultat og forhåndsvisning.

---

## 🚦 Viktige regler

- **Ingen direkte DS-endringer** – alt skjer i vårt repo.
- **Kun 1 `<main>` per side.**
- **Ingen `<article>`**, **ingen ekstra semantiske containere**.
- **Kodevisning** skal bare inkludere DS-komponenter (ikke `<header>`, `<main>` etc. dersom de ikke er relevante for promptet).
- **Promptfeltet** og **kodevisningen** ligger *utenfor* DS-layout.

---

## 🧰 Teknisk informasjon

- **Bygg**: Vite (React + TypeScript)
- **Deploy**: GitHub Actions → GitHub Pages
- **Node-versjon**: `>= 20.19`
- **Repo**: [github.com/Almasy74/form-wizard-starter](https://github.com/Almasy74/form-wizard-starter)
- **Publisert side**: [https://almasy74.github.io/form-wizard-starter/](https://almasy74.github.io/form-wizard-starter/)

---

## 🧭 Neste steg (prioritert rekkefølge)

1. **Utvide prompttolkningen**:
- Flere komponenter (Button, Panel, Alert, Checkbox, Tabs, Dropdowns).
- Forstå fritekst: “Lag et skjema med to tekstfelt og en send-knapp.”
- Forstå engelsk og norsk.
2. **Forbedre layout**:
- Samme visuelle bredde og spacing som skatteetaten.no.
- Juster kontrast og typografi basert på DS.
3. **Kvalitet**:
- Egendefinert eslint + prettier for kodegenerering.
- Sikre WCAG-kompatibilitet i generert kode.
4. **Mulige tillegg senere**:
- Eksport av generert kode som `.tsx`-fil.
- AI-komponent som validerer UU og props.
- Autotesting av generert kode mot axe-core.

---

## 🧩 Oppsummering

Prosjektet fungerer nå som en **tekst-til-komponent-generator for Skatteetatens DS**,  
og skal på sikt kunne:
- Dekke hele DS,
- Generere brukbar kode for både utvikling og opplæring,
- Veilede utviklere til riktig bruk av komponenter og props,
- Samtidig sikre universell utforming og riktig semantikk.

---

## 💬 Meta

Dette dokumentet brukes som **konversasjonskontekst** når en ny GPT-økt starter, slik at ChatGPT raskt forstår:
- Hva som er bygget,
- Hvordan prompttolkningen fungerer,
- Hvilke komponenter som finnes,
- Og hvordan videre utvikling skal foregå uten å bryte prinsippene ovenfor.
