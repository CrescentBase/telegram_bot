import fetch from 'node-fetch';

export async function urlFetch(rpcUrl, body) {
    return await timeoutFetch(rpcUrl, {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            'Connection': 'keep-alive'
        },
        body: JSON.stringify(body)
    });
}

export async function timeoutFetch(url, options = undefined, timeout = 30000) {
    return Promise.race([
        handleFetch(url, options),
        new Promise((_, reject) =>
            setTimeout(() => {
                reject(new Error('timeout'));
            }, timeout),
        )
    ]);
}

export async function handleFetch(request, options = undefined) {
    const response = await fetch(request, options);
    return await response.json();
}
