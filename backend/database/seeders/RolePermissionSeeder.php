<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;
use Spatie\Permission\PermissionRegistrar;

class RolePermissionSeeder extends Seeder
{
    public function run(): void
    {
        app()[PermissionRegistrar::class]->forgetCachedPermissions();

        $permissions = [
            'dashboard.view',
            'news.view',
            'news.create',
            'news.update',
            'news.delete',
            'gallery.view',
            'gallery.create',
            'gallery.update',
            'gallery.delete',
            'settings.manage',
            'users.manage',
            'complaints.view',
            'complaints.update',
            'complaints.assign',
            'complaints.view_identity',
            'complaints.view_sensitive_identity',
            'complaints.view_attachments',
            'complaints.export',
            'complaints.manage_categories',
        ];

        foreach ($permissions as $permission) {
            Permission::firstOrCreate(['name' => $permission, 'guard_name' => 'web']);
        }

        $roles = [
            'superadmin' => $permissions,
            'admin' => [
                'dashboard.view',
                'news.view',
                'news.create',
                'news.update',
                'news.delete',
                'gallery.view',
                'gallery.create',
                'gallery.update',
                'gallery.delete',
                'complaints.view',
                'complaints.update',
                'complaints.assign',
                'complaints.view_identity',
                'complaints.view_attachments',
                'complaints.manage_categories',
            ],
            'operator' => [
                'dashboard.view',
                'news.view',
                'news.create',
                'news.update',
                'gallery.view',
                'gallery.create',
                'gallery.update',
                'complaints.view',
                'complaints.update',
            ],
            'guru' => [
                'dashboard.view',
                'news.view',
                'gallery.view',
                'complaints.view',
            ],
        ];

        foreach ($roles as $roleName => $rolePermissions) {
            $role = Role::firstOrCreate(['name' => $roleName, 'guard_name' => 'web']);
            $role->syncPermissions($rolePermissions);
        }
    }
}
