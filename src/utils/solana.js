// src/utils/solana.js

import { Connection, PublicKey, clusterApiUrl } from '@solana/web3.js';
import { TOKEN_PROGRAM_ID, Token } from '@solana/spl-token';
import { createMint, getOrCreateAssociatedTokenAccount, mintTo, createMetadata, Metadata } from '@metaplex/js';

// Function to deploy a token on Solana
async function deployToken() {
    const connection = new Connection(clusterApiUrl('devnet'), 'confirmed');
    const mint = await createMint(connection, payer, 9, payer.publicKey, payer.publicKey, TOKEN_PROGRAM_ID);
    console.log('Mint Address:', mint.toString());

    const ata = await getOrCreateAssociatedTokenAccount(connection, payer, mint, payer.publicKey);
    console.log('Associated Token Account:', ata.address.toString());

    await mintTo(connection, payer, mint, ata.address, payer, 1000000, [], TOKEN_PROGRAM_ID);
    console.log('Minted 1,000,000 tokens to ATA');

    const metadata = await createMetadata(connection, payer, mint, 'My Token', 'MTK', 'https://mytoken.io/logo.png', 'Token description');
    console.log('Token Metadata:', metadata);
}

export { deployToken };