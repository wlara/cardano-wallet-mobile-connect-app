
import { getRecaptchaHeaders } from "./recaptcha";

const BASE_URL = "https://garage.newm.io"

export const generateChallenge = async (method, stakeAddress, changeAddress = undefined, utxos = undefined) => {
    try {
        const recaptchaHeaders = await getRecaptchaHeaders("generate_challenge")
        const response = await fetch(`${BASE_URL}/v1/wallet-connections/challenges/generate`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json",
                ...recaptchaHeaders
            },
            body: JSON.stringify({
                method,
                stakeAddress,
                ...(changeAddress !== undefined) && { changeAddress },
                ...(utxos !== undefined) && { utxoCborHexList: utxos }
            }),
        });
        checkResponse(response)
        return await response.json();
    } catch (error) {
        console.error("Error generating challenge:", error)
        throw error;
    }
};

export const answerChallenge = async (challengeId, payload, key = undefined) => {
    try {
        const recaptchaHeaders = await getRecaptchaHeaders("answer_challenge")
        const response = await fetch(`${BASE_URL}/v1/wallet-connections/challenges/answer`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json",
                ...recaptchaHeaders
            },
            body: JSON.stringify({
                challengeId,
                payload,
                ...(key !== undefined) && { key }
            }),
        });
        checkResponse(response)
        return await response.json();
    } catch (error) {
        console.error("Error answering challenge:", error)
        throw error;
    }
};


export const getQRCode = async (connectionId) => {
    try {
        const recaptchaHeaders = await getRecaptchaHeaders("qrcode")
        const response = await fetch(`${BASE_URL}/v1/wallet-connections/${connectionId}/qrcode`, {
            method: "GET",
            headers: {
                "Accept": "image/any",
                ...recaptchaHeaders
            }
        });
        checkResponse(response)
        return await response.blob()
    } catch (error) {
        console.error("Error getting QR Code:", error)
        throw error;
    }
};

const checkResponse = (response) => {
    if (!response.ok) {
        const error = new Error(`HTTP status code: ${response.status}`)
        error.response = response
        error.status = response.status
        throw error
    }
}
