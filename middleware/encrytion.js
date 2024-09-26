import sodium from 'libsodium-wrappers';

export async function encryptedmessage(receiverPublicKey, message) {
    await sodium.ready;
    const binsec = sodium.from_string(message);
    const encBytes = sodium.crypto_box_seal(binsec, receiverPublicKey);
    const output = sodium.to_base64(encBytes, sodium.base64_variants.ORIGINAL);
    return output;
}
