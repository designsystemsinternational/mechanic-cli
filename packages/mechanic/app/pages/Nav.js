import React from "react";
import { useHistory } from "react-router-dom";
import css from "./Nav.css";

export const Nav = ({ name, functionsNames }) => {
  let history = useHistory();

  return (
    <div className={css.root}>
      <span className={css.funclabel}>{name}</span>
      <select
        className={css.navigationSelect}
        onChange={({ target }) => history.push(target.value)}
        name={name}
        value={name}>
        <option key="disabled" disabled>
          Select...
        </option>
        {functionsNames.map(name => (
          <option key={`route-${name}`}>{name}</option>
        ))}
      </select>
    </div>
  );
};
