import { test, expect } from '@playwright/test';

test.describe('Modul Manajemen Pengguna', () => {
    test.beforeEach(async ({ page }) => {
        // Set longer timeout for test execution
        test.setTimeout(120000);
        page.setDefaultTimeout(90000);
        page.setDefaultNavigationTimeout(90000);

        // Login as admin
        await page.goto('https://simantap.dbsnetwork.my.id/login', { waitUntil: 'domcontentloaded' });
        await page.getByRole('textbox', { name: 'NIM/NIP/NIDN / Akun Polinema' }).fill('admin');
        await page.getByRole('textbox', { name: 'Password' }).fill('12345');
        await page.getByRole('button', { name: 'Masuk' }).click();

        // Wait for success modal and close it
        await page.getByRole('button', { name: 'OK' }).click();

        // Wait for preloader to disappear
        await page.waitForSelector('#preloader', { state: 'hidden', timeout: 60000 }).catch(() => { });
        await page.waitForTimeout(2000);

        // Navigate directly to User page
        await page.goto('https://simantap.dbsnetwork.my.id/user', { waitUntil: 'domcontentloaded', timeout: 90000 });

        // Wait for page to load and preloader to disappear
        await page.waitForSelector('#preloader', { state: 'hidden', timeout: 60000 }).catch(() => { });
        await page.waitForTimeout(3000);
    });

    test('TC_MANAJEMEN_PENGGUNA_001 - Menambahkan pengguna baru (Happy Path)', async ({ page }) => {
        // Step 1: Click "Tambah Pengguna"
        await page.getByRole('button', { name: ' Tambah Pengguna' }).click({ force: true });
        await page.waitForTimeout(2000);

        // Step 2: Fill form
        // Select Role (e.g., Mahasiswa = 2)
        // We use selectOption with label if possible, or value if we know it. 
        // Based on seeders, Mahasiswa is role_id 2.
        await page.locator('select[name="role_id"]').selectOption({ label: 'Mahasiswa' }); 
        await page.waitForTimeout(500);

        const timestamp = new Date().getTime();
        const username = `user${timestamp}`;
        
        await page.locator('input[name="username"]').fill(username);
        await page.locator('input[name="name"]').fill(`User Test ${timestamp}`);
        await page.locator('input[name="password"]').fill('password123');
        
        // Step 3: Click Simpan
        await page.getByRole('button', { name: ' Simpan' }).click({ force: true });
        await page.waitForTimeout(3000);

        // Expected: Success modal appears
        const bodyText = await page.locator('body').textContent();
        expect(bodyText).toMatch(/berhasil dibuat|berhasil disimpan|berhasil|success/i);
    });

    test('TC_MANAJEMEN_PENGGUNA_002 - Menambahkan pengguna dengan data kosong (Validation Error)', async ({ page }) => {
        // Step 1: Click "Tambah Pengguna"
        await page.getByRole('button', { name: ' Tambah Pengguna' }).click({ force: true });
        await page.waitForTimeout(2000);

        // Step 2: Click Simpan without filling anything
        await page.getByRole('button', { name: ' Simpan' }).click({ force: true });
        await page.waitForTimeout(2000);

        // Expected: Error messages appear
        const bodyText = await page.locator('body').textContent();
        expect(bodyText).toMatch(/Harap pilih peran pengguna|Harap masukkan username|Harap masukkan nama lengkap|Harap masukkan password/i);
    });

    test('TC_MANAJEMEN_PENGGUNA_003 - Mengedit data pengguna', async ({ page }) => {
        // Step 1: Click "Edit" on the first row
        await page.getByRole('button', { name: 'Edit' }).first().click({ force: true });
        await page.waitForTimeout(2000);

        // Step 2: Change name
        const currentName = await page.locator('input[name="name"]').inputValue();
        await page.locator('input[name="name"]').fill(currentName + ' Edited');
        
        // Step 3: Click Simpan Perubahan
        await page.getByRole('button', { name: ' Simpan Perubahan' }).click({ force: true });
        await page.waitForTimeout(3000);

        // Expected: Success modal appears
        const bodyText = await page.locator('body').textContent();
        expect(bodyText).toMatch(/berhasil diperbarui|berhasil disimpan|success/i);
    });

    test('TC_MANAJEMEN_PENGGUNA_004 - Menghapus data pengguna', async ({ page }) => {
        // Step 1: Click "Delete" on the first row (Be careful not to delete admin itself, maybe search for the created user first)
        // Ideally we should search for the user we created in TC_001, but for simplicity we'll delete the first one that is NOT the current admin.
        // However, the list might contain important data. 
        // Let's try to search for "User Test" first to be safe.
        
        await page.getByRole('searchbox', { name: 'Search:' }).fill('User Test');
        await page.waitForTimeout(3000);

        const rowCount = await page.locator('table tbody tr').count();
        if (rowCount > 0) {
             // Check if "No matching records found" is present
            const tableText = await page.locator('table').textContent();
            if (!tableText.toLowerCase().includes('no matching records')) {
                await page.getByRole('button', { name: 'Delete' }).first().click({ force: true });
                await page.waitForTimeout(2000);

                // Step 2: Click "Ya, Hapus" on confirmation modal
                await page.getByRole('button', { name: ' Ya, Hapus' }).click({ force: true });
                await page.waitForTimeout(4000);

                // Expected: Success message
                const bodyText = await page.locator('body').textContent();
                expect(bodyText).toMatch(/terhapus|dihapus|berhasil/i);
            }
        }
    });
});
