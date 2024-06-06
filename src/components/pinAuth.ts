import { DeviceIdKey, SmoothApiURL } from "@/constants";
import { makeError } from "@/errors";

export async function getEncryptionKey(pin: string): Promise<string> {
    const deviceId = localStorage.getItem(DeviceIdKey)
    const response = await fetch(`${SmoothApiURL}/getEncryptionKey`, {
        method: "POST",
        body: JSON.stringify({
            approveTx: {
                deviceId,
                pin,
            },
        }),
        headers: {
            "Content-Type": "application/json",
        },
    })
    const result = await response.json()
    if (!result.success) {
        if (!(result.error instanceof Object)) throw new Error(result.error) // something unknown
        throw makeError(result.error) // recreate the error object
    }

    return result.encryptionKey
}