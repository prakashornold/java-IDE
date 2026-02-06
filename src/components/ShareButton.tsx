import { useState } from 'react';
import { Share2, Check } from 'lucide-react';
import { problemLinkService } from '../services/ProblemLinkService';

interface ShareButtonProps {
    problemTitle: string;
    className?: string;
}

export function ShareButton({ problemTitle, className = '' }: ShareButtonProps) {
    const [isCopied, setIsCopied] = useState(false);

    const handleShare = async () => {
        const success = await problemLinkService.copyProblemUrlToClipboard(problemTitle);

        if (success) {
            setIsCopied(true);
            setTimeout(() => setIsCopied(false), 2000);
        }
    };

    return (
        <button
            onClick={handleShare}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-all ${isCopied
                    ? 'bg-[#6aab73]/15 text-[#6aab73] border border-[#6aab73]/30'
                    : 'bg-[#25262f] hover:bg-[#2c2d38] text-[#9ba1ad] hover:text-[#d5d9e0] border border-[#383946]'
                } ${className}`}
            title={isCopied ? 'Link copied to clipboard!' : 'Share this problem'}
        >
            {isCopied ? (
                <>
                    <Check className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Copied!</span>
                </>
            ) : (
                <>
                    <Share2 className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Share</span>
                </>
            )}
        </button>
    );
}
