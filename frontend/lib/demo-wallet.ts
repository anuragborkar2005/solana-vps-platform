import {
    BaseMessageSignerWalletAdapter,
    WalletName,
    WalletReadyState,
} from "@solana/wallet-adapter-base";
import { Keypair, PublicKey, Transaction, VersionedTransaction } from "@solana/web3.js";
import { ed25519 } from "@noble/curves/ed25519";

export const DEMO_WALLET_SEED = new Uint8Array(32).fill(42);
export const DEMO_WALLET_KEYPAIR = Keypair.fromSeed(DEMO_WALLET_SEED);
export const DEMO_WALLET_PUBKEY = DEMO_WALLET_KEYPAIR.publicKey.toBase58(); // "2iXtA8oeZqUU5pofxK971TCEvFGfems2AcDRaZHKD2pQ"
export const DEMO_WALLET_NAME = "Demo Wallet" as WalletName<"Demo Wallet">;

export class DemoWalletAdapter extends BaseMessageSignerWalletAdapter {
    name = DEMO_WALLET_NAME;
    url = "https://solana.com";
    icon =
        "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%2314F195' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M20 12V8H6a2 2 0 0 1-2-2c0-1.1.9-2 2-2h12v4'%3E%3C/path%3E%3Cpath d='M4 6v12c0 1.1.9 2 2 2h14v-4'%3E%3C/path%3E%3Cpath d='M18 12a2 2 0 0 0 0 4h4v-4Z'%3E%3C/path%3E%3C/svg%3E";
    supportedTransactionVersions = null;

    private _publicKey: PublicKey | null = null;
    private _connecting = false;
    private _connected = false;
    private _readyState: WalletReadyState = WalletReadyState.Installed;

    get publicKey(): PublicKey | null {
        return this._publicKey;
    }

    get connecting(): boolean {
        return this._connecting;
    }

    get connected(): boolean {
        return this._connected;
    }

    get readyState(): WalletReadyState {
        return this._readyState;
    }

    async connect(): Promise<void> {
        if (this._connected) return;
        this._connecting = true;
        try {
            this._publicKey = DEMO_WALLET_KEYPAIR.publicKey;
            this._connected = true;
            this.emit("connect", this._publicKey);
        } finally {
            this._connecting = false;
        }
    }

    async disconnect(): Promise<void> {
        if (!this._connected) return;
        this._publicKey = null;
        this._connected = false;
        this.emit("disconnect");
    }

    async signTransaction<T extends Transaction | VersionedTransaction>(transaction: T): Promise<T> {
        if (!this._connected) throw new Error("Wallet not connected");
        if ("partialSign" in transaction && typeof transaction.partialSign === "function") {
            transaction.partialSign(DEMO_WALLET_KEYPAIR);
        }
        return transaction;
    }

    async signAllTransactions<T extends Transaction | VersionedTransaction>(transactions: T[]): Promise<T[]> {
        return Promise.all(transactions.map((tx) => this.signTransaction(tx)));
    }

    async signMessage(message: Uint8Array): Promise<Uint8Array> {
        if (!this._connected) throw new Error("Wallet not connected");
        const sig = ed25519.sign(message, DEMO_WALLET_SEED);
        return sig;
    }
}
