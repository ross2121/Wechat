import sodium from 'libsodium-wrappers';

// Helper function to concatenate Uint8Arrays
function concatTypedArray(resultConstructor, ...arrays) {
    let totalLength = arrays.reduce((acc, value) => acc + value.length, 0);
    let result = new resultConstructor(totalLength);
    let offset = 0;
    arrays.forEach(arr => {
        result.set(arr, offset);
        offset += arr.length;
    });
    return result;
}

export async function encryptedmessage(receiverPublicKeyHex, message) {
    await sodium.ready;

    // Convert the public key from hex to Uint8Array
    const receiverPublicKey = sodium.from_hex(receiverPublicKeyHex);

    // Ensure the public key length is correct (should be 32 bytes for Curve25519)
    if (receiverPublicKey.length !== sodium.crypto_box_PUBLICKEYBYTES) {
        throw new Error('Invalid public key length');
    }

    // Convert the message to a Uint8Array
    const messageBytes = sodium.from_string(message);

    // Encrypt the message using crypto_box_seal (public key encryption)
    const encryptedMessage = sodium.crypto_box_seal(messageBytes, receiverPublicKey);
      
    // Convert encrypted message to base64 for easier transport
    const encryptedBase64 = sodium.to_base64(encryptedMessage, sodium.base64_variants.ORIGINAL);

    return encryptedBase64;
}


