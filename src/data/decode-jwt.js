const base64UrlDecode = (base64Url) => {

    let base64 = base64Url
        .replace(/-/g, '+')
        .replace(/_/g, '/');

    while (base64.length % 4) {
        base64 += '=';
    }

    return decodeURIComponent(
        atob(base64)
            .split('')
            .map((char) => `%${`00${char.charCodeAt(0).toString(16)}`.slice(-2)}`)
            .join('')
    );
};

const decodeJWT = (token) => {
    try {

        const [header, payload, signature] = token.split('.');
        if (!header || !payload || !signature) {
            throw new Error('Invalid JWT token structure');
        }

        const decodedHeader = base64UrlDecode(header);
        const decodedPayload = base64UrlDecode(payload);

        const parsedHeader = JSON.parse(decodedHeader);
        const parsedPayload = JSON.parse(decodedPayload);

        return {
            header: parsedHeader,
            payload: parsedPayload,
        };
    } catch (error) {
        console.error('Error decoding JWT:', error.message);
        return null;
    }
};

export default decodeJWT;