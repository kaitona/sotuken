import {Contracts_MetaMask} from "../../contract/contracts";
import {useState, useEffect, useRef} from "react";
import {useParams} from "react-router-dom";
import Login from "../../contract/login";
//cssをimport
import "./user_page.css";
import History_list from "./component/history_list";
import User_card from "./component/user_card";
import {icons} from "react-icons/lib";

function User_page() {
    const {address} = useParams();

    //User_cardへの表示用
    const [icons, SetIcons] = useState(null);
    const [user_name, Setuser_name] = useState(null);

    const [result, SetResult] = useState(null);
    const [token, Set_token] = useState(null);
    const [state, Set_state] = useState(null);
    const [rank, setRank] = useState(null);
    const [num_of_student, setNum_of_student] = useState(null); 
    //クイズの総数
    const [history_sum, Set_history_sum] = useState(null);
    //現在表示している個数を保持するref
    const now_numRef = useRef(0);
    const targetRef = useRef(null); // ターゲット要素のrefを作成

    let cont = new Contracts_MetaMask();
    const [history_list, Set_history_list] = useState([]);

    const get_variable = async () => {
        Set_token(await cont.get_token_balance(address));
        let [user_name, image, result, state] = await cont.get_user_data(address);
        console.log(user_name, image, state);
        Setuser_name(user_name);
        SetIcons(image);
        SetResult(result / 10 ** 18);
        setRank(await cont.get_rank(result));
        setNum_of_student(await cont.get_num_of_students());
        Set_state(state);

        cont.get_user_history_len(address).then((data) => {
            // Promise オブジェクトが解決された後の処理を記述
            console.log(Number(data));
            Set_history_sum(Number(data));
            now_numRef.current = Number(data);
        });
    };

    //初回のみ実行
    useEffect(() => {
        get_variable();
    }, []);

    if (history_sum != null) {
        return (
            <div className="mypage">
                <User_card address={address} icons={icons} user_name={user_name} token={token} result={result} state={state} rank={rank} num_of_student={num_of_student} cont={cont} />
                <History_list cont={cont} history_sum={history_sum} Set_history_sum={Set_history_sum} history_list={history_list} Set_history_list={Set_history_list} targetRef={targetRef} now_numRef={now_numRef} address={address} />

                <div className="token-history">
                    <div className="title">Token History</div>
                    <div className="timeline">
                        {history_list.map((history, index) => {
                            // console.log(quiz);
                            return <>{history}</>;
                        })}
                    </div>
                    <div ref={targetRef}>
                        {/* ターゲット要素aの内容 */}
                        now_loading
                    </div>
                </div>
            </div>
        );
    } else {
        return <></>;
    }
}

export default User_page;
