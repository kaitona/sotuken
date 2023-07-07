import Button from 'react-bootstrap/Button';
import { useState, useEffect } from 'react';
import { ImCross } from 'react-icons/im';
function Answer_area2(props) {
    const [content, SetContent] = useState("");
    const [pattern, SetPattern] = useState("");
    const [example, SetExample] = useState("");
    const [collect, SetCollect] = useState("");
    const [error_exsample, SetError_Exsample] = useState(true);
    const [error_collect, SetError_Collect] = useState(true);


    //初回のみ実行
    useEffect(() => {
        props.set([]);
    }, []);
    //answer_dataの変更じに実行
    useEffect(() => {
        console.log("answer_dataの変更じに実行");
        console.log(props.variable);
        props.set([pattern, example]);


    }, [pattern, example]);

    //正規表現のエラー表示
    const handle_Test_pattern = (event, target_set) => {
        const value = event.target.value;

        console.log(pattern)
        // 入力値が正規表現にマッチしない場合は、エラーメッセージを設定
        if (!new RegExp(pattern).test(value)) {
            target_set(true);
            console.log("errr")
        } else {
            target_set(false);
        }
    };


    return (
        //<Textarea name={"タイトル"} variable={title} set={setTitle}/>
        <>
            <p className="text-left"><font size="5">{props.name}</font> </p>
            <div className="row">
                <div className="col-10">
                    正規表現を入力
                    <input type="text" className="form-control" value={pattern} onChange={(event) => SetPattern(event.target.value)} />
                    {pattern}
                </div>

            </div>
            <div className="row">
                <div className="col-10">
                    例を入力
                    {/* 1行のみのフォームにしたい */}
                    <input type="text" className="form-control" value={example} onChange={(event) => { handle_Test_pattern(event, SetError_Exsample); SetExample(event.target.value); }} />
                    {error_exsample ? "エラー" : "OK"}
                </div>
            </div>
            <div className="row">
                <div className="col-10">
                    正解を入力
                    {/* 1行のみのフォームにしたい */}
                    <input type="text" className="form-control" value={props.variable1} onChange={(event) => { handle_Test_pattern(event, SetError_Collect); props.set1(event.target.value); }} />
                    {error_collect ? "エラー" : "OK"}
                </div>
            </div>





        </>
    );
}
export default Answer_area2;