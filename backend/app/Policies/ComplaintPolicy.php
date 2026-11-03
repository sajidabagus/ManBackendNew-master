<?php

namespace App\Policies;

use App\Models\Complaint;
use App\Models\User;

class ComplaintPolicy
{
    public function viewAny(User $user): bool
    {
        return $user->can('complaints.view');
    }

    public function view(User $user, Complaint $complaint): bool
    {
        return $user->can('complaints.view');
    }

    public function viewIdentity(User $user, Complaint $complaint): bool
    {
        if (! $user->can('complaints.view_identity')) {
            return false;
        }

        if ($complaint->isSensitive() && ! $user->can('complaints.view_sensitive_identity')) {
            return false;
        }

        return true;
    }

    public function viewAttachments(User $user, Complaint $complaint): bool
    {
        return $user->can('complaints.view_attachments');
    }

    public function update(User $user, Complaint $complaint): bool
    {
        return $user->can('complaints.update');
    }

    public function assign(User $user, Complaint $complaint): bool
    {
        return $user->can('complaints.assign');
    }

    public function export(User $user): bool
    {
        return $user->can('complaints.export');
    }

    public function manageCategories(User $user): bool
    {
        return $user->can('complaints.manage_categories');
    }
}
