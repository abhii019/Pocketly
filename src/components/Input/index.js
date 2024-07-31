import React from 'react';
import "./style.css";

function Input({ label, state, setState, placeholder, type = "text" }) {
  return (
    <div className='input-wrapper'>
      <p className='label'>{label}</p>
      <input
        type={type}
        value={state}
        placeholder={placeholder}
        onChange={(e) => setState(e.target.value)}
        className='custom-input'
      />
    </div>
  );
}

export default Input;
