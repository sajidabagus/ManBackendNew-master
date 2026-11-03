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

        $modules = ['news', 'gallery', 'services', 'achievements', 'faqs', 'testimonials'];
        $permissions = [
            'dashboard.view',
            'settings.manage',
            'users.manage',
            'complaints.view',
            'complaints.update',
            'complaints.assign',
            'complaints.view_identity',
            'complaints.view_sensitive_identity',
            'complaints.view_attachments',
            'complaints.export',
            'complaints.manage_categories'
        ];

        foreach ($modules as $module) {
            foreach (['view', 'create', 'update', 'delete'] as $action) {
                $permissions[] = "{$module}.{$action}";
            }
        }

        foreach ($permissions as $permission) {
            Permission::firstOrCreate(['name' => $permission, 'guard_name' => 'web']);
        }

        $all = $permissions;
        $admin = array_values(array_filter(
            $permissions,
            fn(string $permission) =>
            $permission !== 'settings.manage' && $permission !== 'users.manage'
                && $permission !== 'complaints.view_sensitive_identity'
                && $permission !== 'complaints.export'
        ));

        $operator = ['dashboard.view', 'complaints.view', 'complaints.update', 'complaints.manage_categories'];
        foreach ($modules as $module) {
            $operator[] = "{$module}.view";
            $operator[] = "{$module}.create";
            $operator[] = "{$module}.update";
        }

        $guru = ['dashboard.view', 'complaints.view'];
        foreach ($modules as $module) {
            $guru[] = "{$module}.view";
        }

        $roles = [
            'superadmin' => $all,
            'admin' => $admin,
            'operator' => $operator,
            'guru' => $guru,
        ];

        foreach ($roles as $roleName => $rolePermissions) {
            $role = Role::firstOrCreate(['name' => $roleName, 'guard_name' => 'web']);
            $role->syncPermissions($rolePermissions);
        }

        app()[PermissionRegistrar::class]->forgetCachedPermissions();
    }
}
