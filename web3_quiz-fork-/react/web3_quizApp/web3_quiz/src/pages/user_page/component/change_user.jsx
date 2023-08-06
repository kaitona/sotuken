import React, {useState, useEffect} from "react";
import "./change_user.css";

function Change_user({show, setShow}) {
    const closeModal = () => {
        setShow(false);
        // ブラウザの履歴に新しいエントリを追加
    };

    const overridePopstate = () => {
        console.log("aaa");

        closeModal();
    };

    useEffect(() => {
        // 現在の履歴情報を取得
    }, []);

    if (show) {
        console.log("show");
        return (
            <div id="overlay" onClick={closeModal}>
                aaaa
            </div>
        );
    } else {
        return null;
    }
}

export default Change_user;
