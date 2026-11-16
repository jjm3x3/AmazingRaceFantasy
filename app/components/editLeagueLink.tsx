"use client"
import { useContext } from "react";
import Link from "next/link";
import { SessionContext } from "@/app/contexts/session";

// The page around this is built at build time, so ownership is checked here against the session context.
// This only decides what to show; PUT /api/league/[leagueId] is what enforces that only the owner can save.
export default function EditLeagueLink({ createdBy, editHref }:{ createdBy?: string, editHref: string }) {
    const { sessionInfo } = useContext(SessionContext);
    const userIsLeagueOwner = !!sessionInfo.sessionExpiresAt && !!sessionInfo.userId && sessionInfo.userId === createdBy;

    return userIsLeagueOwner ? (
        <Link href={editHref} className="btn btn-primary" data-testid="league-details-edit-link">
            Edit League
        </Link>
    ) : (
        // an empty href points back at this page, so pointer-events-none and tabIndex keep it from being clicked or focused
        <Link href="" aria-disabled="true" tabIndex={-1} className="btn btn-secondary opacity-50 pointer-events-none" data-testid="league-details-edit-link-disabled">
            Edit League (owner only)
        </Link>
    );
}
