import React from "react";
import Frame from "react-frame-component";

const UNITS = [
  "px",
  "vw",
  "vh",
  "in",
  "cm",
  "mm",
  "pt",
  "pc",
  "em",
  "ic",
  "ex",
  "q",
  "ch",
  "lh",
  "cap",
];

const UNIT_CASE_KEY = "unit-golf.unit-case";
const UNIT_CASE_OPTIONS = {
  LOWERCASE: "lowercase",
  UPPERCASE: "uppercase",
};

function getInitialUnitCase() {
  if (typeof window === "undefined") {
    return UNIT_CASE_OPTIONS.LOWERCASE;
  }

  const savedUnitCase = window.localStorage.getItem(UNIT_CASE_KEY);
  if (
    savedUnitCase === UNIT_CASE_OPTIONS.LOWERCASE ||
    savedUnitCase === UNIT_CASE_OPTIONS.UPPERCASE
  ) {
    return savedUnitCase;
  }

  return UNIT_CASE_OPTIONS.LOWERCASE;
}

class UnitGolf extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      units: [],
      unitCase: getInitialUnitCase(),
    };
  }

  measureEl = (calcDiv, widthValue, fontValue) => {
    calcDiv.setAttribute("style", `font:${fontValue};width:${widthValue};`);
    const { width } = calcDiv.getBoundingClientRect();
    calcDiv.removeAttribute("style");
    return width;
  };

  measureUnits = (calcDiv, unitValue, fontValue, units) => {
    const initialWidth = this.measureEl(calcDiv, unitValue, fontValue);

    return {
      pxWidth: initialWidth,
      units: units.map((unit) => {
        const measured = this.measureEl(calcDiv, `${initialWidth}${unit}`, fontValue);
        return {
          name: unit,
          multiplier: measured / initialWidth,
        };
      }, []),
    };
  };

  clampPrecision = (number, precision = 2) => {
    const pow = Math.pow(10, precision);
    return Number(Math.round(number * pow) / pow);
  };

  getUnitValues = (px, unit, outputCase, unitValue) => {
    const { name, multiplier } = unit;
    const normalizedUnitValue = unitValue ?? this.clampPrecision(px / multiplier);
    const pixelOffset = this.clampPrecision(normalizedUnitValue * multiplier - px);
    const unitName =
      outputCase === UNIT_CASE_OPTIONS.UPPERCASE ? name.toUpperCase() : name.toLowerCase();

    return {
      unitValue: normalizedUnitValue,
      string: `${normalizedUnitValue}${unitName}`.replace(/^0./, "."),
      pixelOffset,
    };
  };

  findBestUnitValue = (px, tolerance, outputCase) => (unit) => {
    let result = this.getUnitValues(px, unit, outputCase);
    const { unitValue } = result;

    if (!Number.isInteger(unitValue, tolerance) && unitValue !== Infinity) {
      for (let i = unitValue.toString().split(".")[1].length - 1; i >= 0; i--) {
        const newUnitValue = this.clampPrecision(unitValue, i);
        const newResult = this.getUnitValues(px, unit, outputCase, newUnitValue);
        const { pixelOffset } = newResult;
        if (Math.abs(pixelOffset) <= tolerance) {
          result = newResult;
        }
      }
    }

    return result;
  };

  convertAndSort = (px, units, tolerance, outputCase) => {
    return units.map(this.findBestUnitValue(px, tolerance, outputCase)).sort((a, b) => {
      const [lnA, lnB] = [a, b].map((item) => item.string.length);
      const [offsetA, offsetB] = [a.pixelOffset, b.pixelOffset].map(Math.abs);
      const lnDiff = lnA - lnB;
      if (offsetA > tolerance) return 1;
      if (lnDiff === 0) return offsetA - offsetB;
      return lnDiff;
    });
  };

  hasValidUnits = (value) => {
    return UNITS.some((unit) => {
      return value.toLowerCase().includes(unit);
    });
  };

  calcValues = () => {
    const frame = document.getElementById("calcFrame");
    if (!frame || !frame.contentWindow) {
      return;
    }

    const calcDiv = frame.contentWindow.document.getElementById("calcDiv");
    if (!calcDiv) {
      return;
    }

    let unitValue = document.getElementById("unitInput")?.value ?? "";
    let fontValue = document.getElementById("fontInput")?.value ?? "";
    const { unitCase } = this.state;

    if (!fontValue) {
      fontValue = "16px/18px''";
    }

    unitValue = unitValue.replace(/\s+/g, "");

    if (!this.hasValidUnits(unitValue)) {
      unitValue += "px";
    }

    const { units, pxWidth } = this.measureUnits(calcDiv, unitValue, fontValue, UNITS);

    let result = [];
    if (pxWidth > 0) {
      result = this.convertAndSort(pxWidth, units, 0.2, unitCase);
    }

    this.setState({ units: result });
  };

  handleUnitCaseChange = (event) => {
    const nextUnitCase = event.target.checked
      ? UNIT_CASE_OPTIONS.UPPERCASE
      : UNIT_CASE_OPTIONS.LOWERCASE;

    this.setState({ unitCase: nextUnitCase }, () => {
      if (typeof window !== "undefined") {
        window.localStorage.setItem(UNIT_CASE_KEY, nextUnitCase);
      }
      this.calcValues();
    });
  };

  copyUnit = (value) => {
    navigator.clipboard
      .writeText(value)
      .then(() => {
        // Intentionally ignored: copying success needs no UI state here.
      })
      .catch((error) => {
        console.log(error);
      });
  };

  render() {
    const { units, unitCase } = this.state;

    return (
      <div>
        <div className="inputContainer">
          <div className="inputGroup">
            <label className="inputLabel" htmlFor="unitInput">
              Unit
            </label>
            <input
              id="unitInput"
              className="input"
              name="unitInput"
              placeholder="20px"
              onChange={this.calcValues}
            ></input>
          </div>
          <div className="inputGroup">
            <label className="inputLabel" htmlFor="fontInput">
              Font
            </label>
            <input
              id="fontInput"
              className="input"
              name="fontInput"
              placeholder="16px/18px''"
              onChange={this.calcValues}
            ></input>
          </div>
          <div className="unitCaseControl">
            <span className="unitCaseText">lowercase / UPPERCASE</span>
            <label className="unitCaseSwitch" htmlFor="unitCaseSwitch">
              <input
                id="unitCaseSwitch"
                type="checkbox"
                checked={unitCase === UNIT_CASE_OPTIONS.UPPERCASE}
                onChange={this.handleUnitCaseChange}
                aria-label="Toggle generated units between lowercase and uppercase"
              />
              <span className="unitCaseSlider"></span>
            </label>
          </div>
        </div>

        <div className="unit-list">
          <div className="unit-row header-row">
            <div>unit</div>
            <div>offset (px)</div>
          </div>
          <div className="unit-golf-results">
            {units.map((value) => {
              return (
                <div className="unit-row" key={"unit_row_" + value.string}>
                  <div className="unit-item">
                    <button
                      className="unit-list__unit"
                      type="button"
                      onClick={this.copyUnit.bind(null, value.string)}
                    >
                      {value.string}
                    </button>
                  </div>
                  <div className="unit-diff">{value.pixelOffset}</div>
                </div>
              );
            })}
          </div>
        </div>

        <Frame id="calcFrame">
          <div id="calcDiv"></div>
        </Frame>
      </div>
    );
  }
}

export default UnitGolf;