import {config} from "../Constants.tsx";

export const fetchTransaction = async (boc: string, taskId: number): Promise<TonCheckTransactionResponse | null> => {
    try {
        const token = localStorage.getItem('jwt');
        if (!token) return null;

        const response = await fetch(`${config.url}/api/v0.1/ton/validate-transaction`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                'Authorization': `${token}`
            },
            body: JSON.stringify({
                boc: boc,
                taskId: taskId,
            }),
        });

        if (!response.ok) return null;
        return await response.json() as TonCheckTransactionResponse;
    } catch (error) {
        return null;
    }
};