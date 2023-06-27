import React, { useState, useEffect } from "react";
import "./Modal.css";
import Answer from "./Answer";

function Modal({ show, setShow, children, id }) {
  const closeModal = () => {
    setShow(false);
  };

  //戻るぼたんを押したときに発火
  const overridePopstate = () => {
    closeModal();
  }

  useEffect(() => {
    window.history.pushState(null, '', window.location.href);
    window.addEventListener('popstate', overridePopstate, false);
    return () => window.removeEventListener('popstate', overridePopstate, false)
  }, []);


  if (show) {
    return (
      <div id="overlay">
        {children}
        <Answer id={id} />
        <button onClick={closeModal}>Close</button>
      </div>
    );
  } else {
    return null;
  }
}

export default Modal;