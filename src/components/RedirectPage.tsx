import { useEffect } from 'react';
import redirectsData from '../data/redirects.json';
import { Loader2 } from 'lucide-react';

interface RedirectPageProps {
    redirectKey: string;
}

export function RedirectPage({ redirectKey }: RedirectPageProps) {
    useEffect(() => {
        const redirects = redirectsData as Record<string, string>;
        const targetUrl = redirects[redirectKey];

        if (targetUrl) {
            window.location.href = targetUrl;
        } else {
            console.error(`No redirect URL found for key: ${redirectKey}`);
        }
    }, [redirectKey]);

    return (
        <div className="min-h-screen bg-[#13141a] flex items-center justify-center">
            <div className="text-center">
                <Loader2 className="w-10 h-10 animate-spin text-[#5294d0] mx-auto mb-4" />
                <p className="text-[#9ba1ad] text-sm font-medium">Redirecting...</p>
            </div>
        </div>
    );
}
