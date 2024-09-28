import sodium from "libsodium-wrappers"
export async function decryptmessage(receiverPublicKeyHex, receiverPrivateKeyHex, encryptedBase64) {
    await sodium.ready;

    // Convert public and private keys from hex to Uint8Array
    const receiverPublicKey = sodium.from_hex(receiverPublicKeyHex);
    const receiverPrivateKey = sodium.from_hex(receiverPrivateKeyHex);

    // Convert the base64 encrypted message back to a Uint8Array
    const encryptedMessage = sodium.from_base64(encryptedBase64, sodium.base64_variants.ORIGINAL);

    // Decrypt the message using the receiver's private and public keys
    const decryptedMessageBytes = sodium.crypto_box_seal_open(encryptedMessage, receiverPublicKey, receiverPrivateKey);

    // Convert decrypted Uint8Array message back to string
    const decryptedMessage = sodium.to_string(decryptedMessageBytes);

    return decryptedMessage;
}