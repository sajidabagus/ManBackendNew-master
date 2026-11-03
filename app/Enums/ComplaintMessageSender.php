<?php

namespace App\Enums;

enum ComplaintMessageSender: string
{
    case Reporter = 'reporter';
    case Staff = 'staff';
    case System = 'system';
}
