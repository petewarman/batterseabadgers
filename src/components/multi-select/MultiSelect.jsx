import React, { useState, useEffect, useRef } from "react";
import classnames from "classnames";

import styles from "./multi-select.module.scss";

const MultiSelect = ({
  title,
  name,
  options,
  className,
  onChange,
  selected = [],
}) => {
  const container = useRef(null);
  const [open, setOpen] = useState(false);
  const [filteredOptions, setFilteredOptions] = useState(options);
  const handleSummaryClick = (evt) => {
    evt.preventDefault();
    setOpen(!open);
  };

  const handleOptionFilterChange = ({ target: { value } }) => {
    setFilteredOptions(
      options.filter(({ label }) =>
        label.toLowerCase().includes(value.toLowerCase())
      )
    );
  };

  const handleCheckboxChange = ({ target: { name, value, checked } }) => {
    const updatedSelected = checked
      ? [].concat(selected).concat(value)
      : [].concat(selected).filter((val) => val !== value);
    onChange(name, updatedSelected);
  };

  const handleClearButtonClick = () => {
    onChange(name, []);
  };

  const clickToCloseListener = (evt) => {
    if (
      open &&
      container &&
      container.current &&
      !container.current.contains(evt.target)
    ) {
      setOpen(false);
    }
  };

  useEffect(() => {
    if (open) {
      document.addEventListener("click", clickToCloseListener);
    } else {
      document.removeEventListener("click", clickToCloseListener);
    }
  }, [open]);

  const selectedOptions = options
    .filter(({ value }) => selected.includes(value))
    .map(({ label }) => label);

  const stringifyList = (list) => {
    if (list.length > 1) {
      const finalItem = list.pop();
      return `${list.join(", ")} & ${finalItem}`;
    } else {
      return list[0];
    }
  };

  return (
    <fieldset
      ref={container}
      className={classnames(styles.container, className)}
    >
      <details open={open}>
        <summary onClick={handleSummaryClick} className={styles.title}>
          {`${title}: ${
            selectedOptions.length > 0 ? stringifyList(selectedOptions) : "All"
          }`}
        </summary>
        <div className={styles.optionContainer}>
          <div className={styles.optionsHeader}>
            <input
              type="text"
              placeholder="Search"
              className={styles.optionFilter}
              onChange={handleOptionFilterChange}
            />
            <button
              type="button"
              onClick={handleClearButtonClick}
              className={styles.clearButton}
            >
              Clear selected
            </button>
          </div>
          <ul className={styles.list}>
            {filteredOptions.map(({ label, value }) => (
              <li key={`${name}-${value}`} className={styles.listItem}>
                <input
                  type="checkbox"
                  name={name}
                  value={value}
                  id={`${name}-${value}`}
                  className={styles.checkbox}
                  checked={selected.includes(value)}
                  onChange={handleCheckboxChange}
                />
                <label htmlFor={`${name}-${value}`} className={styles.label}>
                  <span className={styles.labelText}>{label}</span>
                </label>
              </li>
            ))}
          </ul>
        </div>
      </details>
    </fieldset>
  );
};

export default MultiSelect;
