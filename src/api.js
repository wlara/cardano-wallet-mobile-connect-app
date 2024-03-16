

const BASE_URL = 'http://localhost:3939'

export const generateSignedDataChallenge = async (address) => {
    try {
        const response = await fetch(`${BASE_URL}/v1/wallet-connections/challenges/generate`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                method: 'SignedData',
                stakeAddress: address
            }),
        });
        checkResponse(response)
        return await response.json();
    } catch (error) {
        console.error('Error generating challenge:', error)
        throw error;
    }
}

export const answerSignedDataChallenge = async (challengeId, data) => {
    try {
        const response = await fetch(`${BASE_URL}/v1/wallet-connections/challenges/answer`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                challengeId: challengeId,
                payload: data
            }),
        });
        checkResponse(response)
        return await response.json();
    } catch (error) {
        console.error('Error answering challenge:', error)
        throw error;
    }
}


export const getQRCode = async (connectionId) => {
    try {
        const response = await fetch(`${BASE_URL}/v1/wallet-connections/${connectionId}/qrcode`, {
            method: 'GET',
            headers: {
                'Accept': 'image/any'
            }
        });
        checkResponse(response)
        return await response.blob()
    } catch (error) {
        console.error('Error getting QR Code:', error)
        throw error;
    }
}

function checkResponse(response) {
    if (!response.ok) {
        const error = new Error("HTTP status code: " + response.status)
        error.response = response
        error.status = response.status
        throw error
    }
}