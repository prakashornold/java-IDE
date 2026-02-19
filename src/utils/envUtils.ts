/** Checks if the app is running in local development mode */
export function isLocalDev(): boolean {
    const hostname = window.location.hostname;
    return hostname === 'localhost' || hostname === '127.0.0.1';
}
