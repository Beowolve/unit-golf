import "./styles.css";

import { useEffect, useState } from "react";

import UnitGolf from "./unit-golf/UnitGolf.jsx";
import "./unit-golf/UnitGolf.css";

const THEME_KEY = "unit-golf.theme";
const THEME_OPTIONS = {
  SYSTEM: "system",
  LIGHT: "light",
  DARK: "dark",
};

function resolveTheme(mode) {
  if (mode === THEME_OPTIONS.DARK) {
    return THEME_OPTIONS.DARK;
  }

  if (mode === THEME_OPTIONS.LIGHT) {
    return THEME_OPTIONS.LIGHT;
  }

  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? THEME_OPTIONS.DARK
    : THEME_OPTIONS.LIGHT;
}

export default function App() {
  const [themeMode, setThemeMode] = useState(() => {
    const saved = window.localStorage.getItem(THEME_KEY);

    if (
      saved === THEME_OPTIONS.DARK ||
      saved === THEME_OPTIONS.LIGHT ||
      saved === THEME_OPTIONS.SYSTEM
    ) {
      return saved;
    }

    return THEME_OPTIONS.SYSTEM;
  });

  useEffect(() => {
    const applyTheme = () => {
      document.documentElement.setAttribute("data-theme", resolveTheme(themeMode));
    };

    applyTheme();
    window.localStorage.setItem(THEME_KEY, themeMode);

    if (themeMode !== THEME_OPTIONS.SYSTEM) {
      return undefined;
    }

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    mediaQuery.addEventListener("change", applyTheme);

    return () => {
      mediaQuery.removeEventListener("change", applyTheme);
    };
  }, [themeMode]);

  return (
    <div className="App">
      <div className="top"></div>
      <header className="appHeader">
        <div className="appBrand">
          <img className="appLogo" src={`${import.meta.env.BASE_URL}tape.png`} alt="Tape measure logo" />
          <span className="appBrandMeta">
            <span className="appTitle">Unit Golf</span>
            <span className="appVersion" aria-label={`Version ${__APP_VERSION__}`}>
              v{__APP_VERSION__}
            </span>
          </span>
        </div>
        <label className="themeSwitch" htmlFor="themeMode">
          Theme
          <select
            id="themeMode"
            value={themeMode}
            onChange={(event) => setThemeMode(event.target.value)}
          >
            <option value={THEME_OPTIONS.SYSTEM}>System</option>
            <option value={THEME_OPTIONS.LIGHT}>Light</option>
            <option value={THEME_OPTIONS.DARK}>Dark</option>
          </select>
        </label>
      </header>

      <main className="content">
        <UnitGolf></UnitGolf>
        <div className="infoText">You can click the unit to copy it.</div>
      </main>

      <footer className="footer">
        <a href="https://www.flaticon.com/free-icons/measure" title="measure icons">
          Measure icons created by Smashicons - Flaticon
        </a>
      </footer>
    </div>
  );
}