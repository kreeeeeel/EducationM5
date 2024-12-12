import {Account} from "@tonconnect/sdk";
import {config} from "../Constants.tsx";

export const fetchWalletConnected = async (tonProof: {
    timestamp: number;
    domain: { lengthBytes: number; value: string };
    payload: string;
    signature: string
}, account: Account): Promise<TonWalletConnectResponse | null> => {
    try {
        const token = localStorage.getItem('jwt');
        if (!token) return null;

        const response = await fetch(`${config.url}/api/v0.1/ton/validate-connect`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                'Authorization': `${token}`
            },
            body: JSON.stringify({
                proof: tonProof,
                account: account,
            }),
        });

        if (!response.ok) return null;
        return await response.json();
    } catch (error) {
        return null;
    }
};