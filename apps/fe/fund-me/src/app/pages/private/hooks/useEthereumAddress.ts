import { useState, useEffect } from 'react';

export const useEthereumAddress = () => {
    const [address, setAddress] = useState<string>('');

    useEffect(() => {
        const fetchAddress = async () => {
            if (window.ethereum) {
                try {
                    const accounts = await window.ethereum.request({ method: 'eth_accounts' });
                    if (accounts.length > 0) {
                        setAddress(accounts[0]);
                    }

                    window.ethereum.on('accountsChanged', (accounts: string[]) => {
                        let actualAddress = ''
                        if (accounts.length > 0) {
                            actualAddress = accounts[0];
                        }
                            setAddress(actualAddress);
                    });
                } catch (error) {
                    console.error('Error fetching Ethereum address:', error);
                }
            }
        };

        fetchAddress();
    }, []);

    return address;
};

//
// useEffect(() => {
//     if (window.ethereum) {
//         window.ethereum.on('accountsChanged', handleAccountChange);
//         window.ethereum.request({ method: 'eth_accounts' }).then(handleAccountChange);
//     }
//     return () => {
//         if (window.ethereum) {
//             window.ethereum.removeListener('accountsChanged', handleAccountChange);
//         }
//     };
// }, []);
