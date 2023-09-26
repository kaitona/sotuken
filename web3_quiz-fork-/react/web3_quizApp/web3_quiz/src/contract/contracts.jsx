import { createPublicClient, createWalletClient, http, getContract, parseAbiItem, custom, UnauthorizedProviderError, decodeFunctionResult } from "viem";
import token_contract from "./token_abi.json";
import quiz_contract from "./quiz_abi.json";
import { chainId, rpc, quiz_address, token_address } from "./config";
import { fujihalab } from "./network";

const { ethereum } = window;
const homeUrl = process.env.PUBLIC_URL;

const walletClient = createWalletClient({
    chain: fujihalab,
    transport: custom(window.ethereum),
});

const publicClient = createPublicClient({
    chain: fujihalab,
    transport: http(),
});

const token_abi = token_contract.abi;
const quiz_abi = quiz_contract.abi;

const token = getContract({
    address: token_address,
    abi: token_abi,
    walletClient,
    publicClient,
});

const quiz = getContract({
    address: quiz_address,
    abi: quiz_abi,
    walletClient,
    publicClient,
});

if (window.ethereum) {
    window.ethereum.on("chainChanged", () => {
        window.location.reload();
    });
    window.ethereum.on("accountsChanged", () => {
        window.location.reload();
    });
}

class Contracts_MetaMask {
    async get_chain_id() {
        return await walletClient.getChainId();
    }
    async add_token_wallet() {
        await window.ethereum.request({
            method: "wallet_watchAsset",
            params: {
                type: "ERC20",
                options: {
                    address: token_address,
                    symbol: "Wake",
                    decimals: 18,
                },
            },
        });
    }

    async change_network() {
        try {
            await walletClient.switchChain({ id: fujihalab.id });
        } catch (e) {
            //userがrejectした場合
            if (e.code === 4001) {
                console.log(e);
            } else {
                this.add_network();
            }
        }
    }
    async add_network() {
        try {
            await walletClient.addChain({ chain: fujihalab });
        } catch (e) {
            console.log(e);
        }
    }

    async get_token_balance(address) {
        try {
            if (ethereum) {
                console.log(token_address);
                const balance = await token.read.balanceOf({ args: [address] });
                console.log(balance);
                console.log(Number(balance) / 10 ** 18);
                //16進数を10進数に変換
                return Number(balance) / 10 ** 18;
            } else {
                console.log("Ethereum object does not exist");
            }
        } catch (err) {
            console.log(err);
        }
    }

    async get_address() {
        try {
            if (ethereum) {
                return (await walletClient.requestAddresses())[0];
            } else {
                console.log("Ethereum object does not exist");
            }
        } catch (err) {
            console.log(err);
        }
    }

    async get_token_history(address, start, end) {
        console.log(address, start, end);
        let account = await this.get_address();
        try {
            if (ethereum) {
                console.log(token_address);
                //取得したクイズを格納する配列
                let res = [];

                console.log(start, end);
                if (start <= end) {
                    for (let i = start; i < end; i++) {
                        res.push(await token.read.get_user_history({ account, args: [address, i] }));
                    }
                } else {
                    //console.log("33");
                    for (let i = start - 1; i >= end; i--) {
                        res.push(await token.read.get_user_history({ account, args: [address, i] }));
                    }
                }

                return res;
            } else {
                console.log("Ethereum object does not exist");
            }
        } catch (err) {
            console.log(err);
        }
    }

    async get_user_history_len(address) {
        console.log(token_address);
        let account = await this.get_address();
        const res = await token.read.get_user_history_len({ account, args: [address] });
        return Number(res);
    }

    //ユーザーのデータを取得する
    async get_user_data(address) {
        try {
            if (ethereum) {
                let account = await this.get_address();
                console.log(token_address);
                const res = await quiz.read.get_user({ account, args: [address] });
                return [res[0], res[1], Number(res[2]), res[3]];
            } else {
                console.log("Ethereum object does not exist");
            }
        } catch (err) {
            console.log(err);
        }
    }

    async approve(account, amount) {
        try {
            if (ethereum) {
                console.log(amount);
                try {
                    const { request } = await publicClient.simulateContract({
                        account,
                        address: token_address,
                        abi: token_abi,
                        functionName: "approve",
                        args: [quiz_address, amount],
                    });
                    console.log("成功");
                    return await walletClient.writeContract(request);
                } catch (e) {
                    console.log(e);
                }
            } else {
                console.log("Ethereum object does not exist");
            }
        } catch (err) {
            console.log(err);
        }
    }

    async investment_to_quiz(id, amount, answer, isNotPayingOut, numOfStudent, isNotAddingReward) {
        console.log([id, amount, isNotPayingOut, numOfStudent, isNotAddingReward]);
        let res = null;
        let res2 = null;
        let hash = null;
        let hash2 = null;
        let is_not_paying_out = null;
        let is_not_adding_reward = null;
        amount = Number(amount) * 10 ** 18;

        if (isNotPayingOut === "false") {
            is_not_paying_out = false;
        } else {
            is_not_paying_out = true;
        }
        if (isNotAddingReward === "false") {
            is_not_adding_reward = false;
        } else {
            is_not_adding_reward = true;
        }

        try {
            if (ethereum) {
                let account = await this.get_address();
                let approval = await token.read.allowance({ account, args: [account, quiz_address] });
                console.log(Number(approval));
                console.log(amount * numOfStudent);

                if (Number(approval) >= Number(amount * numOfStudent)) {
                    hash = await this._investment_to_quiz(account, id, amount, numOfStudent);
                    if (hash) {
                        res = await publicClient.waitForTransactionReceipt({ hash });
                    }
                } else {
                    hash = await this.approve(account, amount * numOfStudent);
                    if (hash) {
                        res = await publicClient.waitForTransactionReceipt({ hash });
                        hash = await this._investment_to_quiz(account, id, amount, numOfStudent);
                        console.log(hash);
                        if (hash) {
                            res = await publicClient.waitForTransactionReceipt({ hash });
                        }
                    }
                }

                if (is_not_paying_out == false) {
                    hash2 = await this._payment_of_reward(account, id, answer);
                    if (hash) {
                        res2 = await publicClient.waitForTransactionReceipt({ hash });
                    }
                    if (is_not_adding_reward == false) {
                        let reward = (await this.get_quiz_simple(id))[7];
                        console.log(reward);
                        approval = await token.read.allowance({ account, args: [account, quiz_address] });
                        console.log(approval);
                        if (Number(approval) >= Number(reward)) {
                            hash = await this._addingReward(account, id, reward);
                            if (hash) {
                                res = await publicClient.waitForTransactionReceipt({ hash });
                            }
                        } else {
                            hash = await this.approve(account, reward);
                            if (hash) {
                                res = res = await publicClient.waitForTransactionReceipt({ hash });
                                hash = await this._adding_reward(account, id, reward);
                                if (hash) {
                                    res = await publicClient.waitForTransactionReceipt({ hash });
                                }
                            }
                        }
                    }
                }
            } else {
                console.log("Ethereum object does not exist");
            }
        } catch (err) {
            console.log(err);
        }
        document.location.href = homeUrl + "/edit_list";
    }

    async _investment_to_quiz(account, id, amount, numOfStudent) {
        console.log([account, id, amount, numOfStudent])
        try {
            if (ethereum) {
                //console.log(title, explanation, thumbnail_url, content, answer_type, answer_data, correct, epochStartSeconds, epochEndSeconds, reward, correct_limit);
                try {
                    const { request } = await publicClient.simulateContract({
                        account,
                        address: quiz_address,
                        abi: quiz_abi,
                        functionName: "investment_to_quiz",
                        args: [id, amount.toString(), numOfStudent],
                    });

                    return await walletClient.writeContract(request);
                } catch (e) {
                    console.log(e);
                }
            } else {
                console.log("Ethereum object does not exist");
            }
        } catch (err) {
            console.log(err);
        }
    }

    async _payment_of_reward(account, id, answer) {
        console.log([account, id, answer]);
        try {
            if (ethereum) {
                try {
                    const { request } = await publicClient.simulateContract({
                        account,
                        address: quiz_address,
                        abi: quiz_abi,
                        functionName: "payment_of_reward",
                        args: [id, answer],
                    });

                    return await walletClient.writeContract(request);
                } catch (e) {
                    console.log(e);
                }
            } else {
                console.log("Ethereum object does not exist");
            }
        } catch (err) {
            console.log(err);
        }
    }

    async _adding_reward(account, id, reward) {
        console.log([account, id, reward]);
        try {
            if (ethereum) {
                try {
                    const { request } = await publicClient.simulateContract({
                        account,
                        address: quiz_address,
                        abi: quiz_abi,
                        functionName: "adding_reward",
                        args: [id],
                    });

                    return await walletClient.writeContract(request);
                } catch (e) {
                    console.log(e);
                }
            } else {
                console.log("Ethereum object does not exist");
            }
        } catch (err) {
            console.log(err);
        }
    }

    async create_quiz(title, explanation, thumbnail_url, content, answer_type, answer_data, correct, reply_startline, reply_deadline, reward, correct_limit, setShow) {
        setShow(true);
        //console.log([title, explanation, thumbnail_url, content, answer_type, answer_data, correct, reply_startline, reply_deadline, reward, correct_limit]);
        let res = null;
        let hash = null;
        reward = reward * 10 ** 18;
        try {
            if (ethereum) {
                let account = await this.get_address();
                let approval = await token.read.allowance({ account, args: [account, quiz_address] });

                if (Number(approval) >= Number(reward * correct_limit)) {
                    hash = await this._create_quiz(account, title, explanation, thumbnail_url, content, answer_type, answer_data, correct, reply_startline, reply_deadline, reward, correct_limit);
                    if (hash) {
                        res = await publicClient.waitForTransactionReceipt({ hash });
                    }
                } else {
                    hash = await this.approve(account, reward * correct_limit);
                    if (hash) {
                        res = await publicClient.waitForTransactionReceipt({ hash });
                        hash = await this._create_quiz(account, title, explanation, thumbnail_url, content, answer_type, answer_data, correct, reply_startline, reply_deadline, reward, correct_limit);
                        console.log(hash);
                        if (hash) {
                            res = await publicClient.waitForTransactionReceipt({ hash });
                        }
                    }
                }
                console.log("create_quiz_cont");
            } else {
                setShow(false);
                console.log("Ethereum object does not exist");
            }
        } catch (err) {
            setShow(false);
            console.log(err);
        }
        document.location.href = homeUrl + "/answer_quiz/" + res.logs[2].topics[2];
    }

    async _create_quiz(account, title, explanation, thumbnail_url, content, answer_type, answer_data, correct, reply_startline, reply_deadline, reward, correct_limit) {
        const dateStartObj = new Date(reply_startline);
        const dateEndObj = new Date(reply_deadline);

        // Date オブジェクトをエポック秒に変換する
        const epochStartSeconds = Math.floor(dateStartObj.getTime() / 1000);
        const epochEndSeconds = Math.floor(dateEndObj.getTime() / 1000);
        try {
            if (ethereum) {
                //console.log(title, explanation, thumbnail_url, content, answer_type, answer_data, correct, epochStartSeconds, epochEndSeconds, reward, correct_limit);
                console.log(answer_type);
                try {
                    const { request } = await publicClient.simulateContract({
                        account,
                        address: quiz_address,
                        abi: quiz_abi,
                        functionName: "create_quiz",
                        args: [title, explanation, thumbnail_url, content, answer_type, answer_data.toString(), correct, epochStartSeconds, epochEndSeconds, reward, correct_limit],
                        //args: ["a", "a", "a", "a", 1, "a", "a", epochStartSeconds, epochEndSeconds, 2, 2],
                    });

                    return await walletClient.writeContract(request);
                } catch (e) {
                    console.log(e);
                }
            } else {
                console.log("Ethereum object does not exist");
            }
        } catch (err) {
            console.log(err);
        }
    }

    async edit_quiz(id, owner, title, explanation, thumbnail_url, content, reply_startline, reply_deadline, setShow) {
        setShow(true);
        //console.log([id, owner, title, explanation, thumbnail_url, content, reply_startline, reply_deadline]);
        let res = null;
        let hash = null;
        try {
            if (ethereum) {
                let account = await this.get_address();
                let approval = await token.read.allowance({ account, args: [account, quiz_address] });

                hash = await this._edit_quiz(account, id, owner, title, explanation, thumbnail_url, content, reply_startline, reply_deadline);
                console.log(hash);
                if (hash) {
                    res = await publicClient.waitForTransactionReceipt({ hash });
                }
                console.log(res);

                console.log("create_quiz_cont");
            } else {
                setShow(false);
                console.log("Ethereum object does not exist");
            }
        } catch (err) {
            setShow(false);
            console.log(err);
        }
        document.location.href = homeUrl + "/edit_list";
    }

    async _edit_quiz(account, id, owner, title, explanation, thumbnail_url, content, reply_startline, reply_deadline) {
        const dateStartObj = new Date(reply_startline);
        const dateEndObj = new Date(reply_deadline);

        // Date オブジェクトをエポック秒に変換する
        const epochStartSeconds = Math.floor(dateStartObj.getTime() / 1000);
        const epochEndSeconds = Math.floor(dateEndObj.getTime() / 1000);
        try {
            if (ethereum) {
                //console.log(title, explanation, thumbnail_url, content, answer_type, answer_data, correct, epochStartSeconds, epochEndSeconds, reward, correct_limit);

                try {
                    const { request } = await publicClient.simulateContract({
                        account,
                        address: quiz_address,
                        abi: quiz_abi,
                        functionName: "edit_quiz",
                        args: [id, owner, title, explanation, thumbnail_url, content, epochStartSeconds, epochEndSeconds],
                        //args: ["a", "a", "a", "a", 1, "a", "a", epochStartSeconds, epochEndSeconds, 2, 2],
                    });

                    return await walletClient.writeContract(request);
                } catch (e) {
                    console.log(e);
                }
            } else {
                console.log("Ethereum object does not exist");
            }
        } catch (err) {
            console.log(err);
        }
    }

    async create_answer(id, answer, setShow, setContent) {
        console.log(id, answer);
        try {
            if (ethereum) {
                let account = await this.get_address();

                setShow(true);
                setContent("書き込み中...");
                let hash = await this._save_answer(account, id, answer);

                if (hash) {
                    // const res1 = await quiz.read.post_answer_view({account,args:[id, answer.toString()]})
                    // console.log(res1);
                    // if (res1 == true) {
                    //     setContent("正解です！待機すると、マイページに遷移します");
                    // }
                    // else {
                    //     setContent("不正解です。待機すると、マイページに遷移します");
                    // }
                    let res = await publicClient.waitForTransactionReceipt({ hash });
                    console.log(res);
                    //document.location.href = "/user_page/" + account;
                    document.location.href = homeUrl + "/list_quiz";
                }
                console.log("create_answer_cont");
            } else {
                console.log("Ethereum object does not exist");
            }
        } catch (err) {
            console.log(err);
        }
        setShow(false);
    }

    async _save_answer(account, id, answer) {
        try {
            const { request } = await publicClient.simulateContract({
                account,
                address: quiz_address,
                abi: quiz_abi,
                functionName: "save_answer",
                args: [id, answer.toString()],
            });
            console.log("正常そう");
            return await walletClient.writeContract(request);
        } catch (e) {
            console.log(e);
        }
    }

    async _post_answer(account, id, answer) {
        try {
            const { request } = await publicClient.simulateContract({
                account,
                address: quiz_address,
                abi: quiz_abi,
                functionName: "post_answer",
                args: [id, answer.toString()],
            });
            console.log("正常そう");
            return await walletClient.writeContract(request);
        } catch (e) {
            console.log(e);
        }
    }

    async get_quiz_all_data(id) {
        return await quiz.read.get_quiz_all_data({ args: [id] });
    }

    async get_quiz(id) {
        const answer_typr = await quiz.read.get_quiz_answer_type({ args: [id] });
        const res = await quiz.read.get_quiz({ args: [id] });
        const res2 = await this.get_confirm_answer(id);
        return [...res, answer_typr, ...res2];
    }

    async get_quiz_simple(id) {
        return await quiz.read.get_quiz_simple({ args: [id] });
    }

    async get_is_payment(id) {
        return await quiz.read.get_is_payment({ args: [id] });
    }

    async get_confirm_answer(id) {
        return await quiz.read.get_confirm_answer({ args: [id] });
    }

    async get_quiz_all_data_list(start, end) {
        //取得したクイズを格納する配列
        let res = [];
        let account = await this.get_address();

        console.log(start, end);
        if (start <= end) {
            for (let i = start; i < end; i++) {
                console.log(i);
                res.push(await quiz.read.get_quiz_all_data({ account, args: [i] }));
                console.log(res);
            }
        } else {
            for (let i = start - 1; i >= end; i--) {
                console.log(i);
                res.push(await quiz.read.get_quiz_all_data({ account, args: [i] }));
                console.log(res);
            }
        }
        return res;
    }

    //startからendまでのクイズを取得

    async get_quiz_list(start, end) {
        //取得したクイズを格納する配列
        let res = [];
        let account = await this.get_address();

        console.log(start, end);
        if (start <= end) {
            for (let i = start; i < end; i++) {
                console.log(i);
                res.push(await quiz.read.get_quiz_simple({ account, args: [i] }));
                console.log(res);
            }
        } else {
            for (let i = start - 1; i >= end; i--) {
                console.log(i);
                res.push(await quiz.read.get_quiz_simple({ account, args: [i] }));
                console.log(res);
            }
        }
        return res;
    }

    async get_quiz_lenght() {
        return await quiz.read.get_quiz_length();
    }

    async get_num_of_students() {
        return Number(await quiz.read.get_num_of_students());
    }

    async add_student(address) {
        console.log(address);
        try {
            if (ethereum) {
                try {
                    let account = await this.get_address();
                    const { request } = await publicClient.simulateContract({
                        account,
                        address: quiz_address,
                        abi: quiz_abi,
                        functionName: "add_student",
                        args: [address],
                    });
                    return await walletClient.writeContract(request);
                } catch (e) {
                    console.log(e);
                }
            } else {
                console.log("Ethereum object does not exist");
            }
        } catch (err) {
            console.log(err);
        }
    }

    async add_teacher(address) {
        try {
            if (ethereum) {
                try {
                    let account = await this.get_address();
                    const { request } = await publicClient.simulateContract({
                        account,
                        address: quiz_address,
                        abi: quiz_abi,
                        functionName: "add_teacher",
                        args: [address],
                    });
                    return await walletClient.writeContract(request);
                } catch (e) {
                    console.log(e);
                }
            } else {
                console.log("Ethereum object does not exist");
            }
        } catch (err) {
            console.log(err);
        }
    }

    async get_teachers() {
        try {
            if (ethereum) {
                let account = await this.get_address();
                return await quiz.read.get_teacher_all({ account, args: [] });
            } else {
                console.log("Ethereum object does not exist");
            }
        } catch (err) {
            console.log(err);
        }
    }

    async get_results() {
        try {
            if (ethereum) {
                let account = await this.get_address();
                let res = await quiz.read.get_student_results({ account, args: [] });
                console.log(res);
                return res;
            } else {
                console.log("Ethereum object does not exist");
            }
        } catch (err) {
            console.log(err);
        }
    }

    async isTeacher() {
        try {
            if (ethereum) {
                let account = await this.get_address();
                return await quiz.read._isTeacher({ account, args: [] });
            } else {
                console.log("Ethereum object does not exist");
            }
        } catch (err) {
            console.log(err);
        }
    }

    async get_only_student_results() {
        try {
            if (ethereum) {
                let account = await this.get_address();
                let res = await quiz.read.get_only_student_results({ account, args: [] });
                console.log(res);
                for (let i = 0; i < res.length; i++) {
                    res[i] = Number(res[i]);
                }
                await res.sort(function (a, b) {
                    return b - a;
                });
                console.log(res);
                return res;
            } else {
                console.log("Ethereum object does not exist");
            }
        } catch (err) {
            console.log(err);
        }
    }

    async get_rank(result) {
        try {
            if (ethereum) {
                let results = await this.get_only_student_results();
                for (let i = 0; i < results.length; i++) {
                    if (result == results[i]) return i + 1;
                }
            } else {
                console.log("Ethereum object does not exists");
            }
        } catch (err) {
            console.log(err);
        }
    }

    async get_respondentCount_and_respondentLimit(id) {
        return await quiz.read.get_respondentCount_and_respondentLimit({ args: [id] });
    }

    async get_data_for_survey_users() {
        try {
            if (ethereum) {
                let account = await this.get_address();
                let res = await quiz.read.get_data_for_survey_users({ account, args: [] });
                return res;
            } else {
                console.log("Ethereum object does not exists");
            }
        } catch (err) {
            console.log(err);
        }
    }
    async get_data_for_survey_quizs() {
        try {
            if (ethereum) {
                let account = await this.get_address();
                let res = await quiz.read.get_data_for_survey_quizs({ account, args: [] });
                return res;
            } else {
                console.log("Ethereum object does not exists");
            }
        } catch (err) {
            console.log(err);
        }
    }
}

export { Contracts_MetaMask };
