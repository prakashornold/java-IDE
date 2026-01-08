import { useState } from 'react';
import { Share2, Check } from 'lucide-react';
import { problemLinkService } from '../services/ProblemLinkService';

interface ShareButtonProps {
    problemTitle: string;
    className?: string;
}

/**
 * Share Button Component
 * Provides one-click sharing of problem links with copy feedback
 * Follows Single Responsibility Principle - only handles share functionality
 */
export function ShareButton({ problemTitle, className = '' }: ShareButtonProps) {
    const [isCopied, setIsCopied] = useState(false);

    /**
     * Handles share button click
     * Copies problem URL to clipboard and shows feedback
     */
    const handleShare = async () => {
        const success = await problemLinkService.copyProblemUrlToClipboard(problemTitle);

        if (success) {
            setIsCopied(true);
            // Reset feedback after 2 seconds
            setTimeout(() => setIsCopied(false), 2000);
        }
    };

    return (
        <button
            onClick={handleShare}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded transition-all ${isCopied
                    ? 'bg-green-600 text-white border border-green-500'
                    : 'bg-[#2a2d2e] hover:bg-[#3a3d3e] text-[#BBBBBB] border border-[#6B6B6B]'
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
