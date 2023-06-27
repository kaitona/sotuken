import { useEffect, useState } from "react";

const Modal_login = (props) => {

  const [is_connect, setIs_connect] = useState(false);

  return (
    <div id="overlay" class="stars" style={{}}>
      <div id="modalContent" style={{
        "color": "white", "position": "fixed",
        "top": "50%", /* 要素の上端を画面の中央に */
        "left": "50%",
        "transform": "translate(-50%, -50%)"
      }}>
        {/* 文字を白くする */}
        <h2 >ウォレットを接続して下さい</h2>
        <br />
        <button type="button" class="btn btn-dark" onClick={() => { props.cont.connectWallet () }} >connect MetaMask</button>
      </div>
    </div>
  );

};

export default Modal_login;
