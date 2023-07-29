import token_contract from "./token_abi.json";
import quiz_contract from "./quiz_abi.json";
import { chainId, rpc,  quiz_address, token_address } from "./config"
import { BigNumber, ethers } from "ethers";
import { parseUnits, shallowCopy } from 'ethers/lib/utils';
import Login from "./login";
import { useEffect } from 'react';

import { createPublicClient, http } from 'viem';
import { mainnet } from 'viem/chains';


const { ethereum } = window;



const token_abi = token_contract.abi;
const quiz_abi = quiz_contract.abi;

// function Contracts_MetaMask(){
const provider = new ethers.providers.Web3Provider(window.ethereum);
const signer = provider.getSigner();
const Token_Contract = new ethers.Contract(token_address, token_abi, signer);
const Quiz_Contract = new ethers.Contract(quiz_address, quiz_abi, signer);

const answer_filters = Quiz_Contract.filters["Post_answer"];
class Contracts_MetaMask {
    
    async get_chain_id() {

        const chainId = await provider.getNetwork();

        return chainId["chainId"];

    }
    async add_token_wallet() {
        await window.ethereum.request({
            method: 'wallet_watchAsset',
            params: {
                type: 'ERC20',
                options: {
                    address: token_address,
                    symbol: "Wake",
                    decimals: 18,
                },
            },
        })

    }

    async change_network() {
        const networkParam = {
            chainId: '0x13466',
            chainName: 'fujihalab chain',
            nativeCurrency: { name: 'Fuji', symbol: 'FUJI', decimals: 18 },
            rpcUrls: ['https://ik1-206-76848.vs.sakura.ne.jp'],
            blockExplorerUrls: ['https://mumbai.polygonscan.com/'],
        };
        await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [networkParam],
        });
        window.location.reload();

    }


    async get_balanceHandler() {
        try {

            if (ethereum) {
                console.log(token_address)
                const decimals = await Token_Contract.decimals();
                console.log(decimals)
                return decimals;


            } else {
                console.log("Ethereum object does not exist");
            }
        } catch (err) {
            console.log(err);
        }
    }
    async get_token_balance(address) {
        try {

            if (ethereum) {
                console.log(token_address)
                const balance = await Token_Contract.balanceOf(address);
                console.log(parseInt(balance["_hex"], 16) / 10 ** 18);
                //16進数を10進数に変換 
                return parseInt(balance["_hex"], 16) / 10 ** 18;

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
                const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
                return accounts[0];
            } else {
                console.log("Ethereum object does not exist");
            }
        } catch (err) {
            console.log(err);
        }
    }

    async get_token_history(address, start, end) {
        try {
            if (ethereum) {
                console.log(token_address);
                //取得したクイズを格納する配列
                let res = [];

                console.log(start, end);
                if (start <= end) {
                    //console.log("22");

                    for (let i = start; i < end; i++) {
                        console.log(i);
                        res.push(await Token_Contract.get_user_history(address, i));
                        console.log(res);
                    }
                }
                else {
                    //console.log("33");
                    for (let i = start - 1; i >= end; i--) {
                        //console.log(i);
                        res.push(await Token_Contract.get_user_history(address, i));
                        //console.log(res);
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
        const res = await Token_Contract.get_user_history_len(address);
        console.log(res)
        return res;
    }

    //ユーザーのデータを取得する
    async get_user_data(address) {
        try {
            if (ethereum) {
                console.log(token_address);
                const res = await Quiz_Contract.get_user(address);
                console.log(res);
                return res;
            } else {
                console.log("Ethereum object does not exist");
            }
        } catch (err) {
            console.log(err);
        }
    }
    //ユーザーのデータを更新する
    async update_user_data(name, image_url) {
        try {
            if (ethereum) {
                const signer = provider.getSigner();
                await Quiz_Contract.set_user_name(name);
                await Quiz_Contract.set_user_img(image_url);

            } else {
                console.log("Ethereum object does not exist");
            }
        } catch (err) {
            console.log(err);
        }
    }

    async approve(reward, correct_limit, setShow) {
        try {
            if (ethereum) {
                const pay = parseUnits((reward * correct_limit).toString(), 18);
                const res = await Token_Contract.approve(quiz_address, pay);

                return res;
            } else {
                setShow(false);
                console.log("Ethereum object does not exist");
            }
        } catch (err) {
            setShow(false);
            console.log(err);
        }
    }

    async event_create_quiz() {
        //emitを受け取る準備
        console.log("event_create_quiz");
        const accounts = await ethereum.request({ method: 'eth_accounts' });
        const account = accounts[0];
        const filters = Quiz_Contract.filters["Create_quiz"]
        Quiz_Contract.on(filters(account), (_sender, id) => {
            console.log("from: ", _sender);
            console.log("message: ", id);
            document.location.href = "/answer_quiz/" + id;
        })

        return Quiz_Contract;

    }

    async event_create_answer(id) {
        //emitを受け取る準備
        console.log("event_create_quiz");
        const accounts = await ethereum.request({ method: 'eth_accounts' });
        const account = accounts[0];
        console.log(provider.off(answer_filters(account,id)));
        console.log(provider.listeners(answer_filters(account,id)));

        provider.once(answer_filters(account,id), (from, to, tokenId, event) => {
            console.log("hit")
            document.location.href = "/user_page/" + account;
        });

    }
    async stop_event_create_answer(id) {
        //emitを受け取る準備
        console.log("event_create_quiz");
        const accounts = await ethereum.request({ method: 'eth_accounts' });
        const account = accounts[0];

        console.log(provider.off(answer_filters(account,id)));
        console.log(provider.listeners(answer_filters(account,id)));


    }





    async create_quiz(title, explanation, thumbnail_url, content, answer_type, answer_data, correct, reply_startline, reply_deadline, reward, correct_limit, setShow) {
        function timeout(delay) {
            return new Promise(res => setTimeout(res, delay));
        }
        try {
            if (ethereum) {

                const signer = provider.getSigner();
                const account = await ethereum.request({ method: 'eth_requestAccounts' });

                let approval = await Token_Contract.allowance(account[0], quiz_address);

                if (approval.toString() >= parseUnits((reward * correct_limit).toString(), 18).toString()) {

                    // 日時を Date オブジェクトに変換する
                    const dateStartObj = new Date(reply_startline);
                    const dateEndObj = new Date(reply_deadline);

                    // Date オブジェクトをエポック秒に変換する
                    const epochStartSeconds = Math.floor(dateStartObj.getTime() / 1000);
                    const epochEndSeconds = Math.floor(dateEndObj.getTime() / 1000);
                    console.log(reply_deadline);
                    console.log(epochEndSeconds);
                    console.log(title.toString(), explanation.toString(), thumbnail_url.toString(), content.toString(), answer_type.toString(), answer_data.toString(), correct.toString(), reply_startline.toString(), reply_deadline.toString(), reward.toString(), correct_limit.toString());
                    const res = await Quiz_Contract.create_quiz(title.toString(), explanation.toString(), thumbnail_url.toString(), content.toString(), answer_type.toString(), answer_data.toString(), correct.toString(), epochStartSeconds.toString(), epochEndSeconds.toString(), reward.toString(), correct_limit.toString());

                }
                else {
                    console.log("retry");
                    await timeout(1000);
                    this.create_quiz(title, explanation, thumbnail_url, content, answer_type, answer_data, correct, reply_deadline, reward, correct_limit, setShow)
                }
                console.log("create_quiz_cont");
            } else {
                setShow(false)
                console.log("Ethereum object does not exist");
            }
        } catch (err) {
            setShow(false)
            console.log(err);
        }
    }


    async create_answer(id, answer, setShow, setContent) {
        try {

            if (ethereum) {
                const account = await ethereum.request({ method: 'eth_requestAccounts' });
                const res = await Quiz_Contract.post_answer(id, answer.toString());
                setShow(true)
                setContent("書き込み中...")

                const res1 = await Quiz_Contract.post_answer_view(id, answer.toString());
                console.log("///////////");
                console.log(res1);
                if (res1 == true) {
                    setContent("正解です！待機すると、マイページに遷移します");
                }
                else {
                    setContent("不正解です。待機すると、マイページに遷移します");
                }

                console.log("///////////");
                console.log("create_quiz_cont");
                return res1;

            } else {
                setShow(false)
                console.log("Ethereum object does not exist");
            }
        } catch (err) {
            setShow(false)
            console.log(err);
        }
    }

    async get_quiz(id) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const answer_typr = await Quiz_Contract.get_quiz_answer_type(id);
        const res = await Quiz_Contract.get_quiz(id);
        return [...res, answer_typr];
    }



    async get_quiz_simple(id) {

        const signer = provider.getSigner();

        const res = await Quiz_Contract.get_quiz_simple(id);
        return res;
    }

    //startからendまでのクイズを取得

    async get_quiz_list(start, end) {

        const signer = provider.getSigner();

        //取得したクイズを格納する配列
        let res = [];

        console.log(start, end);
        if (start <= end) {
            //console.log("22");

            for (let i = start; i < end; i++) {
                console.log(i);
                res.push(await Quiz_Contract.get_quiz_simple(i));
                console.log(res);
            }
        }
        else {
            //console.log("33");
            for (let i = start - 1; i >= end; i--) {
                //console.log(i);
                res.push(await Quiz_Contract.get_quiz_simple(i));
                //console.log(res);
            }
        }

        return res;
    }

    async get_quiz_lenght() {
        const res = await Quiz_Contract.get_quiz_length();
        return res;
    }


    async add_student(address) {
        try {
            if (ethereum) {
                const res = await Quiz_Contract.add_student(address);
                console.log(res);
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
                const res = await Quiz_Contract.add_teacher(address);
                console.log(res);

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
                const res = await Quiz_Contract.get_teacher_all();
                console.log(res);
                return res;

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
                const res = await Quiz_Contract.get_student_results();
                console.log(res);
                return res;

            } else {
                console.log("Ethereum object does not exist");
            }
        } catch (err) {
            console.log(err);
        }
    }







}

export { Contracts_MetaMask };