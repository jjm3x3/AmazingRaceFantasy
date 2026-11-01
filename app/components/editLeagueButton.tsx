"use client"
import { useContext } from "react";
import Link from "next/link";
import { SessionContext } from "@/app/contexts/session";

// The page around this is built at build time, so ownership is checked here against the session context.
// This only decides what to show; PUT /api/league/[leagueId] is what enforces that only the owner can save.
export default function EditLeagueButton({ createdBy, editHref }:{ createdBy?: string, editHref: string }) {
    const { sessionInfo } = useContext(SessionContext);
    const userIsLeagueOwner = !!sessionInfo.sessionExpiresAt && !!sessionInfo.userId && sessionInfo.userId === createdBy;

    return userIsLeagueOwner ? (
        <Link href={editHref} className="btn btn-primary" data-testid="league-details-edit-link">
            Edit League
        </Link>
    ) : (
        <button disabled className="btn btn-secondary opacity-50" data-testid="league-details-edit-button" title="Edit option when owner">
            Edit League (owner only)
        </button>
    );
}
