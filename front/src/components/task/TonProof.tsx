import {useCallback, useContext, useEffect, useRef} from 'react';
import { useTonConnectUI } from "@tonconnect/ui-react";
import { CHAIN } from "@tonconnect/ui-react";

import { fetchWalletConnected } from "../../api/WalletConnectedApi.tsx";
import { fetchTonPayload } from "../../api/TonPayloadApi.tsx";

import useInterval from "../../hooks/useInterval.ts";
import {UserContext} from "../../contexts/UserContext.tsx";

const refreshIntervalMs = 9 * 60 * 1000;

export const TonProof = () => {
    const firstProofLoading = useRef<boolean>(true);
    const userContext = useContext(UserContext);
    const [tonConnectUI] = useTonConnectUI();

    const recreateProofPayload = useCallback(async () => {
        if (firstProofLoading.current) {
            tonConnectUI.setConnectRequestParameters({ state: 'loading' });
            firstProofLoading.current = false;
        }

        const payload = await fetchTonPayload();

        if (payload) {
            tonConnectUI.setConnectRequestParameters({ state: 'ready', value: {tonProof: payload} });
        } else {
            tonConnectUI.setConnectRequestParameters(null);
        }
    }, [tonConnectUI, firstProofLoading])

    if (firstProofLoading.current) {
        recreateProofPayload();
    }

    useInterval(recreateProofPayload, refreshIntervalMs);

    useEffect(() =>
        tonConnectUI.onStatusChange(async w => {
            if (!w || w.account.chain === CHAIN.TESTNET) {
                return;
            }

            if (w.connectItems?.tonProof && 'proof' in w.connectItems.tonProof) {
                const resp = await fetchWalletConnected(w.connectItems.tonProof.proof, w.account);

                if (resp! && resp.success) {
                    userContext?.setUserInfo((prev) =>
                        prev
                            ? {
                                ...prev,
                                fuel: prev.fuel + (resp.reward ?? 0),
                                details: {
                                    ...prev.details,
                                    walletAddress: w.account.address
                                }
                            }
                            : prev
                    );
                }
            }
        }), [tonConnectUI]);

    return null; // Используйте `null` вместо пустого фрагмента
};
