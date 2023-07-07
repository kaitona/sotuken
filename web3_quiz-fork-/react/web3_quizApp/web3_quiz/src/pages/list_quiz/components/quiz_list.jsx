import Form from 'react-bootstrap/Form';
import {  useState ,useEffect,useRef} from 'react';
import MDEditor, { selectWord } from "@uiw/react-md-editor";
import {resolvePath, useLocation} from "react-router-dom";
import Simple_quiz from "./quiz_simple";

import {Link} from "react-router-dom";
function Quiz_list(props) {
   

    const location = useLocation(); 
    //画面を満たす個数を計算して、add_numに代入
    const add_num = useRef(Math.floor(window.innerHeight/100)+2);
    
    //表示するクイズのリスト
    // const [quiz_list,Set_quiz_list] =useState([]);

    const quiz_list=props.quiz_list;
    const Set_quiz_list=props.Set_quiz_list;
    


    //クイズのリストを取得
    const get_quiz_list = async (now) => {
        
        //追加分のクイズ用のリスト
        let add_quiz_list=[];
        
        //クイズの総数を超えていたら
        if(now-add_num.current<0){
            //now_numからquiz_numまでのクイズを取得
            add_quiz_list = await props.cont.get_quiz_list(now,0);
            //now_numを0にする
            props.now_numRef.current=0;
        }
        else{//クイズの総数を超えていなかったら
            //now_numからnow_num+add_numまでのクイズを取得
            add_quiz_list = await props.cont.get_quiz_list(now,now-add_num.current);
            //now_numをnow_num+add_numにする
            props.now_numRef.current=now-add_num.current;
        }
        //new_quiz_listをmapで展開して、quiz_listに追加
        let now_quiz_list=[];

        //add_quiz_listをmapで展開して、now_quiz_listに追加
        add_quiz_list.map((quiz) => {
            now_quiz_list.push(<Simple_quiz quiz={quiz}/>);//DOMとして追加
        });

        //quiz_listにnow_quiz_listを追加
        //console.log([...quiz_list, ...now_quiz_list]);
        Set_quiz_list(quiz_list => [...quiz_list, ...now_quiz_list])
         
    }
    

    const options = {
        root: null, // ビューポートをルートとする
        rootMargin: "-10px", // ビューポートに対するマージン
        threshold: 0 // ターゲット要素が完全にビューポートに入った時にコールバックを実行
      };
      
      const observer = new IntersectionObserver((entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            // ターゲット要素がビューポートに入った時の処理
            console.log("ターゲット要素がビューポートに入りました。");
            get_quiz_list(props.now_numRef.current);
          } else {
            // ターゲット要素がビューポートから出た時の処理
            console.log("ターゲット要素がビューポートから出ました。");
          }
        }
      }, options);
      
    useEffect(() => {

      
      console.log(location.search);


        const targetElement = props.targetRef.current; // ターゲット要素を取得
        if (targetElement) {
          observer.observe(targetElement); // ターゲット要素をobserve
          // 初期状態でターゲット要素がビューポート内にある場合にもコールバックを実行
          if (targetElement.isIntersecting) {
            console.log("ターゲット要素がビューポートに入っていました。");
            get_quiz_list(props.now_numRef.current);
          }
        }
        return () => {
          observer.unobserve(targetElement); // コンポーネントがアンマウントされる際にunobserve
        };

        //パラメータを取得
        
      }, []); // []を指定して初期状態のみで実行されるようにする


    

    
}
export default Quiz_list;