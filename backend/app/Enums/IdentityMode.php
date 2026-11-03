<?php

namespace App\Enums;

enum IdentityMode: string
{
    case Identified = 'identified';
    case Anonymous = 'anonymous';
}
