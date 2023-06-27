import { ethers } from "ethers";

import {BiLogIn} from 'react-icons/bi';
import {chainId,rpc,bloctoSDK,quiz_address,token_address} from "./config"
import {  useState } from 'react';
import {ReactComponent as MetaMaskLogo } from "./images/metamask-icon.svg";
import {ReactComponent as BloctoLogo } from "./images/blocto-icon.svg";
import ListGroup from 'react-bootstrap/ListGroup';
import './login.css';
import Button from 'react-bootstrap/Button';
import Badge from 'react-bootstrap/Badge';
import BloctoSDK from "@blocto/sdk";
const { ethereum } = window;


function Login() {
    
    const [currentAccount, setCurrentAccount] = useState(true);
    const [use_wallet,setUse_wallet]=useState("");
    const connect_MetamaskHandler = async () => {
        

                
                const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
                console.log("Found an account! Address: ", accounts[0]);
                setCurrentAccount(accounts[0]);
                setUse_wallet("MetaMask");
           

    
    }

    
    const Wallet_select = ()=>{
        return(
            <>
            <h1>Connect Your Wallet</h1>
            <ListGroup>
                <div onClick={() => {connect_MetamaskHandler();}}>
                <ListGroup.Item as="li" className="d-flex justify-content-between align-items-start">
                
                    <MetaMaskLogo style={{ width: "36px", height: "36px", fill: "blue" }}/>
                    MetaMask
                    <Badge bg="primary" pill>
                        Popular
                    </Badge>
                    
                </ListGroup.Item>
                </div>
                
                
            
            </ListGroup>
            </>
        )
    }
    return(
        <div className="container">
        <Wallet_select/>
        
        </div>
        )
}

export default Login;  