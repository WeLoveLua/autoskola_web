# Autoškola Web - Testové otázky

Webová aplikace pro procvičování testových otázek k získání řidičského průkazu. Aplikace obsahuje všechny typy řidičských oprávnění (A, B, C, D, T).

## ⚠️ **DŮLEŽITÉ UPOZORNĚNÍ**

**Tato aplikace není oficiální a testy nejsou ověřené oficiálními orgány!**

- Otázky jsou skutečné, ale **testy slouží pouze pro demonstrační a výukové účely**
- Autoři nenesou odpovědnost za správnost vyhodnocení testů

## 🚗 Funkce

- **Procházení otázek** - Postupné procházení jednotlivých testových otázek
- **Zkušební test** - Simulace skutečného testu s 25 náhodnými otázkami a 30minutovým časovačem
- **Výsledky testu** - Profesionální vyhodnocení s procentuální úspěšností a detailní statistikou
- **Ukládání pokroku** - Automatické ukládání odpovědí a aktuální pozice v testu
- **Vyhledávání** - Komplexní vyhledávání podle čísla otázky, ID/kódu, textu otázky nebo odpovědí
- **Ovládání klávesnicí** - Rychlé ovládání pomocí klávesových zkratek
- **Responsivní design** - Optimalizované pro desktop i mobilní zařízení
- **Zobrazení správných odpovědí** - Po výběru odpovědi se zobrazí správné řešení
- **Počítadlo pokroku** - Sledování počtu zodpovězených otázek

## ⌨️ Klávesové zkratky

- **→** nebo **Enter** - Další otázka (Enter funguje po zobrazení odpovědi)
- **←** - Předchozí otázka
- **1-9** - Výběr odpovědi podle čísla
- **Ctrl+S** - Otevřít/zavřít vyhledávání
- **T** - Spustit zkušební test

## 🛠️ Technologie

- **Next.js 15** - React framework s App Router
- **TypeScript** - Typová bezpečnost
- **Tailwind CSS** - Utility-first CSS framework
- **React 19** - Nejnovější verze Reactu
- **Lucide React** - Moderní ikony

## 📦 Instalace

```bash
# Naklonování repozitáře
git clone https://github.com/WeLoveLua/autoskola_web.git
cd autoskola_web

# Instalace závislostí
npm install
```

## 🚀 Spuštění

```bash
# Development server
npm run dev

# Build produkční verze
npm run build

# Spuštění produkční verze
npm start

# Kontrola kódu
npm run lint
```

Aplikace běží na [http://localhost:3000](http://localhost:3000).

## 📁 Struktura projektu

```
autoskola_web/
├── app/
│   ├── api/
│   │   └── questions/    # API endpoint pro načítání otázek
│   ├── globals.css       # Globální styly
│   ├── layout.tsx        # Root layout
│   └── page.tsx          # Hlavní stránka aplikace (340 řádků)
├── components/
│   ├── QuestionCard.tsx  # Komponenta pro zobrazení otázky
│   ├── QuestionGrid.tsx  # Grid layout pro otázky
│   ├── SingleQuestion.tsx# Zobrazení jedné otázky
│   ├── TestDialog.tsx    # Dialog pro spuštění testu
│   ├── TestResultsModal.tsx # Modal s výsledky testu
│   ├── SearchModal.tsx   # Vyhledávací rozhraní
│   └── ThemeToggle.tsx   # Přepínač dark/light módu (nepoužíváno)
├── hooks/
│   ├── useTest.ts        # Logika testového režimu
│   ├── useSearch.ts      # Vyhledávací funkcionalita
│   ├── useCache.ts       # Správa localStorage
│   ├── useQuestions.ts   # Správa otázek a načítání
│   ├── useNavigation.ts  # Navigace mezi otázkami
│   └── useKeyboard.ts    # Klávesové zkratky
├── constants/
│   └── test.ts           # Konstanty pro test (čas, počet otázek, storage klíče)
├── contexts/
│   └── ThemeContext.tsx  # Context pro správu tématu (nepoužíváno)
├── public/
│   └── questions.json    # Databáze testových otázek
├── types/
│   └── question.ts       # TypeScript definice pro otázky
└── package.json
```

## 🏗️ Architektura

Aplikace je postavena na modulární architektuře s důrazem na znovupoužitelnost a udržovatelnost:

### **Custom Hooks**
Veškerá business logika je rozdělena do specializovaných hooks:
- **useTest** - Správa testového režimu, časovače a vyhodnocení
- **useSearch** - Komplexní vyhledávání napříč otázkami
- **useCache** - Persistence dat v localStorage
- **useQuestions** - Načítání a správa otázek z API
- **useNavigation** - Navigace mezi otázkami a správa odpovědí
- **useKeyboard** - Centralizované zpracování klávesových zkratek

### **Komponenty**
UI je rozděleno do malých, znovupoužitelných komponent:
- **TestDialog** - Potvrzovací dialog před spuštěním testu
- **TestResultsModal** - Profesionální zobrazení výsledků
- **SearchModal** - Interaktivní vyhledávací rozhraní
- **SingleQuestion** - Hlavní komponenta pro zobrazení otázky

## 📝 Formát otázek

Otázky jsou uloženy v souboru `public/questions.json` ve formátu:

```json
{
  "id": 1,
  "question": "Text otázky",
  "options": ["Možnost A", "Možnost B", "Možnost C"],
  "correctAnswer": "Možnost A",
  "category": "Pravidla silničního provozu"
}
```

## 🎯 Zkušební test

Zkušební test simuluje skutečnou zkoušku:
- **Počet otázek**: 25 náhodně vybraných z celé databáze
- **Časový limit**: 30 minut (standard v ČR)
- **Automatické ukončení**: Po vypršení času nebo dokončení všech otázek
- **Profesionální vyhodnocení**: Modal s procentuální úspěšností, počtem správných odpovědí a hodnocením
- **Hranice úspěchu**: 80% správných odpovědí (20 z 25)
- **Vizuální zpětná vazba**: Zelené/červené hodnocení podle výsledku

## 🚀 Výkon a optimalizace

- **Modulární architektura** - Rozdělení do specializovaných hooks snižuje složitost
- **Lazy loading** - Obrázky a média se načítají podle potřeby
- **Optimalizované re-rendery** - Efektivní správa stavu pomocí custom hooks
- **TypeScript** - Plná typová bezpečnost across celou aplikaci
- **Responsive design** - Optimalizované pro všechny velikosti obrazovek

## 📄 Licence

MIT

## 👥 Přispívání

Příspěvky jsou vítány! Prosím, vytvořte pull request nebo otevřete issue s návrhy na vylepšení.