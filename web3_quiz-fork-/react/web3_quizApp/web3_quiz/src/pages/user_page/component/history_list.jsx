import Form from "react-bootstrap/Form";
import {useState, useEffect, useRef} from "react";
import MDEditor, {selectWord} from "@uiw/react-md-editor";
import {resolvePath, useParams} from "react-router-dom";
import Simple_history from "./history_simple";
import {Link} from "react-router-dom";
function History_list(props) {
    //1回の更新で追加で表示する個数
    //画面を満たす個数を計算して、add_numに代入
    const add_num = useRef(Math.floor(window.innerHeight / 100) + 2);

    const history_list = props.history_list;
    const Set_history_list = props.Set_history_list;

    //クイズのリストを取得
    const get_history_list = async (now_sum) => {
        //追加分のクイズ用のリスト
        let add_history_list = [];

        //クイズの総数を超えていたら

        if (now_sum - add_num.current < 0) {
            //now_numからquiz_numまでのクイズを取得
            add_history_list = await props.cont.get_token_history(props.address, now_sum, 0);
            //now_numを0にする
            props.now_numRef.current = 0;
        } else {
            //クイズの総数を超えていなかったら
            //now_numからnow_num+add_numまでのクイズを取得

            add_history_list = await props.cont.get_token_history(props.address, now_sum, now_sum - add_num.current);
            //now_numをnow_num+add_numにする
            props.now_numRef.current = now_sum - add_num.current;
        }
        //new_quiz_listをmapで展開して、quiz_listに追加
        let now_history_list = [];

        //add_quiz_listをmapで展開して、now_quiz_listに追加

        console.log(add_history_list);
        add_history_list.map((history) => {
            now_history_list.push(<Simple_history history={history} />); //DOMとして追加
        });
        Set_history_list((history_list) => [...history_list, ...now_history_list]);
    };

    const options = {
        root: null, // ビューポートをルートとする
        rootMargin: "-10px", // ビューポートに対するマージン
        threshold: 0, // ターゲット要素が完全にビューポートに入った時にコールバックを実行
    };

    const observer = new IntersectionObserver((entries) => {
        for (const entry of entries) {
            if (entry.isIntersecting) {
                // ターゲット要素がビューポートに入った時の処理
                //console.log("ターゲット要素がビューポートに入りました。");
                get_history_list(props.now_numRef.current);
            } else {
                // ターゲット要素がビューポートから出た時の処理
                //console.log("ターゲット要素がビューポートから出ました。");
            }
        }
    }, options);

    useEffect(() => {
        const targetElement = props.targetRef.current; // ターゲット要素を取得
        if (targetElement) {
            observer.observe(targetElement); // ターゲット要素をobserve
            // 初期状態でターゲット要素がビューポート内にある場合にもコールバックを実行
            if (targetElement.isIntersecting) {
                console.log("ターゲット要素がビューポートに入っていました。");
                get_history_list(props.now_numRef.current);
            }
        }
        return () => {
            observer.unobserve(targetElement); // コンポーネントがアンマウントされる際にunobserve
        };
    }, []); // []を指定して初期状態のみで実行されるようにする
}
export default History_list;
