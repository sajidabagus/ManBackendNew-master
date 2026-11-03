<?php

namespace App\Enums;

enum ReporterType: string
{
    case Student = 'siswa';
    case Parent = 'orang_tua';
    case Staff = 'guru_tendik';
    case Public = 'masyarakat';

    public function label(): string
    {
        return match ($this) {
            self::Student => 'Siswa',
            self::Parent => 'Orang tua / wali',
            self::Staff => 'Guru / tenaga kependidikan',
            self::Public => 'Masyarakat',
        };
    }
}
