alter table task
    add column details jsonb;

UPDATE task
SET details = jsonb_build_object(
        'type', 'WalletTransactionDetail',
        'token', 'TON',
        'amount', '2000000',
        'address', 'UQBnmvzxMYsXP9Wlm-Mwee-vO1v2DeqdfPCJN8HDc3fS64f7'
    )
WHERE type = 'WALLET_TRANSACTION';