import React, { useState } from "react";

// components
import { List } from "./";

// utils
import requestData from "../../../utils/requestData";

// styles
import styles from "./form.scss";

const EntityField = ({ label, value, entity, onChange }) => {
  return (
    <p className={styles.fieldContainer}>
      <label className={styles.label} htmlFor={label}>
        {label}
      </label>
      <input
        className={styles.textInput}
        onChange={onChange}
        id={label}
        name={label}
        type="text"
        value={value}
      />
    </p>
  );
};

const EntityDetail = ({ item, items, entity }) => {
  const [fieldState, setFieldState] = useState(item);
  const [altered, setAltered] = useState(false);

  const handleChange = ({ target: { name, value } }) => {
    setFieldState({
      ...fieldState,
      [name]: value
    });
    setAltered(true);
  };

  const handleSubmit = evt => {
    evt.preventDefault();
    console.log(fieldState);
    setAltered(false);
  };

  return (
    <div className={styles.container}>
      <List
        items={items}
        selected={item}
        entity={entity}
        className={styles.list}
      />
      <div className={styles.formContainer}>
        <form className={styles.form} onSubmit={handleSubmit}>
          {Object.entries(fieldState).map(([label, value]) => (
            <EntityField
              onChange={handleChange}
              key={label}
              label={label}
              value={value}
              entity={entity}
            />
          ))}
          {altered && (
            <button type="submit" className={styles.submit}>
              Save
            </button>
          )}
        </form>
      </div>
    </div>
  );
};

EntityDetail.getInitialProps = ({ query }) => {
  const { entity, slug } = query;

  return Promise.all([requestData(entity, { slug }), requestData(entity)]).then(
    ([item, items]) => {
      return {
        entity,
        item,
        items
      };
    }
  );
};

export default EntityDetail;
