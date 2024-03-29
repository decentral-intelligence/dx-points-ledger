# Signing

Due to security reasons the production version requires that transactions need to be signed cryptographically.

> In development mode signing requirement is disabled (see configuration)

Signed transactions guarantees

## Generate keys

Before you can sign transactions you need to generate your key pair.
Therefore, use the following command

```
npm run tool-gen-account-keys
```

```
ohager@ohager-XPS-15-9560:~/code/dextra/dia/dx-points-ledger$ npm run tool-gen-account-keys

> dx-points-ledger@1.0.0 tool-gen-account-keys /home/ohager/code/dextra/dia/dx-points-ledger
> node ./tools/generateAccountKeys.js

? passphrase: [hidden]
Keys stored successfully
Public Key: publickey.b64
Private Key: privatekey.enc.b64
Store them in a safe place together with the used passphrase for the encrypted private key
The public key is used for account creation, while the private is used for transaction signing
------------ PUBLIC KEY ------------------
MEMwBQYDK2VxAzoA6Xh1sOMob/7gA+OXf5hDCQwvEWm+DthgcLg0H5n84VqdCVm7o40WMxM3Qv+cpDLgYUXqcaqgNogA

```

Follow the instructions and keep the passphrase and the private key file secretly in a safe place. You need them both to sign transactions.

## Create account

Once you have the public key you can go to the graphql playground and execute the following mutation

```graphql
mutation ($input: AccountInput!) {
  createAccount(args: $input) {
    alias
    _id
    publicKey
  }
}
```

with similar parameters

```json
{
  "input": {
    "publicKey": "MEMwBQYDK2VxAzoAM9...nPkSqoY3o34mY6aA",
    "alias": "your alias",
    "role": "Admin"
  }
}
```

Your account is now created, and should be listed once you enter

```graphql
query {
  accounts {
    _id
    alias
    publicKey
    role
    balance
  }
}
```

## Sign and Send a Transaction

To send a transaction (transfer or airdrop) on a low level you may use the Apollo GraphQl playground (per default on `localhost:3001`).

Use the following graphql statement

```graphql
mutation ($input: TransferInput!) {
  transferPoints(args: $input)
}
```

```json
{
  "input": {
    "sender": "XPOINTZ-E9CF-YEQX-EFX3-5CKSL",
    "recipient": "XPOINTZ-XHLG-ZYAB-ABQU-XNURB",
    "amount": 5,
    "message": "First transfer with signature",
    "signature": "JrBj0mfZCLp/YUJ47O1n8FXtic82LC/su8+Dbitc6aNBX+b6xj3mGjNdRTTnFmOsRX+blz1KK2uArV1Iov28qLLfOrADtfEGI/G89CdW3yT/uwCIra9aG01ZuvJdsZH5S23+2O4YR1/1OyneWOS9IiYA"
  }
}
```

As you can see there's a signature field, which is required. The signature can be generated using the
`npm run tool-sign-tx` command. Just follow the instructions.

```
ohager@ohager-XPS-15-9560:~/code/dextra/dia/dx-points-ledger npm run tool-sign-tx

> dx-points-ledger@1.0.0 tool-sign-tx /home/ohager/code/dextra/dia/dx-points-ledger
> node ./tools/signTransaction.js

? What's the senders id? XPOINTZ-E9CF-YEQX-EFX3-5CKSL
? What's the recipients id? XPOINTZ-XHLG-ZYAB-ABQU-XNURB
? What's the amount to send? 5
? Enter an additional message First transfer with signature
? The private keys file path ./privatekey.enc.b64
? The passphrase for the private key [hidden]

Signed Transaction
 {
  sender: 'XPOINTZ-E9CF-YEQX-EFX3-5CKSL',
  recipient: 'XPOINTZ-XHLG-ZYAB-ABQU-XNURB',
  amount: 5,
  message: 'First transfer with signature',
  signature: 'JrBj0mfZCLp/YUJ47O1n8FXtic82LC/su8+Dbitc6aNBX+b6xj3mGjNdRTTnFmOsRX+blz1KK2uArV1Iov28qLLfOrADtfEGI/G89CdW3yT/uwCIra9aG01ZuvJdsZH5S23+2O4YR1/1OyneWOS9IiYA'
}
```
