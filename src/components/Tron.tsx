import React, { useMemo } from 'react';

import { WalletProvider } from '@tronweb3/tronwallet-adapter-react-hooks';
import { WalletModalProvider } from '@tronweb3/tronwallet-adapter-react-ui';
import { WalletDisconnectedError, WalletError, WalletNotFoundError } from '@tronweb3/tronwallet-abstract-adapter';
import { LedgerAdapter, TronLinkAdapter } from '@tronweb3/tronwallet-adapters';
import '@tronweb3/tronwallet-adapter-react-ui/style.css';

import { TronWebProvider } from '../hooks/useTronWeb';

/**
 * Wrap children in everything they need to work with the Tron network.
 */
export const Tron: React.FC<React.PropsWithChildren> = (props) => {
    function onError(e: WalletError) {
        if (e instanceof WalletNotFoundError) {
            // some alert for wallet not found
            // currently throw it to the error boundary
            throw(e);
        } else if (e instanceof WalletDisconnectedError) {
            // some alert for wallet not connected
            // currently throw it to the error boundary
            throw(e);
        } else {
            console.error(e.message);
            throw(e);
        }
    }

    const adapters = useMemo(function () {
        const tronLink = new TronLinkAdapter();
        const ledger = new LedgerAdapter({
            accountNumber: 2,
        });

        // TODO: Add more adapters
        return [tronLink, ledger];
    }, []);
    
    return (
        <TronWebProvider>
            <WalletProvider onError={onError} adapters={adapters}>
                <WalletModalProvider>{props.children}</WalletModalProvider>
            </WalletProvider>
        </TronWebProvider>
    );
}