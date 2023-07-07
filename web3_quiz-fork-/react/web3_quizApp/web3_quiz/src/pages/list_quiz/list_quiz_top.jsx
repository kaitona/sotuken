import { Contracts_MetaMask } from "../../contract/contracts"
import Form from 'react-bootstrap/Form';
import { useState, useEffect, useRef } from 'react';
import MDEditor, { selectWord } from "@uiw/react-md-editor";
import { resolvePath, useParams } from "react-router-dom";
import Simple_quiz from "./components/quiz_simple";
import Quiz_list from "./components/quiz_list";
import { Link } from "react-router-dom";

function List_quiz_top(props) {

    //クイズのコントラクト
    let cont = new Contracts_MetaMask;

    //現在表示している個数を保持するref
    const now_numRef = useRef(0);//保存
    //クイズの総数
    const [quiz_sum, Set_quiz_sum] = useState(null);//保存

    //表示するクイズのリスト
    const [quiz_list, Set_quiz_list] = useState([]);//保存
    //１回の更新で追加で表示する個数
    const [add_num, Set_add_num] = useState(7);
    // コンテナのrefを作成
    const containerRef = useRef(null);

    const callback = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // ターゲットの<div>が画面に表示された場合に実行される関数
                console.log('Target div is visible on the screen!');
                // ここに実行したい関数を記述

                // console.log("///////",now_num);
            }
        });
    };


    useEffect(() => {
        cont.get_quiz_lenght().then(data => {
            // Promise オブジェクトが解決された後の処理を記述
            console.log(parseInt(data["_hex"]));
            let now = parseInt(data["_hex"]);
            Set_quiz_sum(now);
            now_numRef.current = now;

        });
            
    }, []);

    const targetRef = useRef(null); // ターゲット要素のrefを作成



    if (quiz_sum != null) {

        return (
            <>
                {/* スクロールを監視するコンポーネント */}
                <Quiz_list cont={cont} add_num={add_num} Set_add_num={Set_add_num} quiz_sum={quiz_sum} Set_quiz_sum={Set_quiz_sum} quiz_list={quiz_list} Set_quiz_list={Set_quiz_list} targetRef={targetRef} now_numRef={now_numRef} />

                {/* */}
                {quiz_list.map((quiz, index) => {
                    if (index !== quiz_list.length - add_num) {
                        return (
                            <>
                                {quiz_list[index]}
                            </>
                        );
                    }
                }
                )}
                <div ref={targetRef}>
                    {/* ターゲット要素aの内容 */}
                    now_loading
                </div>
            </>
        );
    }
    else {
        return (
            <>

            </>
        );
    }


}
export default List_quiz_top;