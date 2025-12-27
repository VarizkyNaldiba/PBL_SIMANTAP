import { test, expect } from '@playwright/test';

test.describe('Modul Manajemen Profil', () => {
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

        // Navigate to Profile via Navbar
        await page.locator('#page-header-user-dropdown').click();
        await page.waitForTimeout(500);
        await page.getByRole('button', { name: 'Profile' }).click();
        await page.waitForTimeout(2000);

        // Wait for Profile Modal
        await expect(page.locator('.modal-title')).toContainText('Profil Pengguna');
    });

    test('TC_MANAJEMEN_PROFIL_001 - Mengedit profil pengguna (Happy Path)', async ({ page }) => {
        // Step 1: Click "Edit Profil"
        await page.locator('#btn-edit-profile').click();
        await page.waitForTimeout(2000);

        // Step 2: Change Name
        const currentName = await page.locator('input[name="name"]').inputValue();
        const newName = currentName.includes('Edited') ? currentName.replace(' Edited', '') : currentName + ' Edited';
        await page.locator('input[name="name"]').fill(newName);

        // Step 3: Click Simpan Perubahan
        await page.getByRole('button', { name: ' Simpan Perubahan' }).click({ force: true });
        await page.waitForTimeout(3000);

        // Expected: Success modal appears
        const bodyText = await page.locator('body').textContent();
        expect(bodyText).toMatch(/berhasil diperbarui|berhasil disimpan|success/i);
    });

    test('TC_MANAJEMEN_PROFIL_002 - Mengedit profil dengan data kosong (Validation Error)', async ({ page }) => {
        // Step 1: Click "Edit Profil"
        await page.locator('#btn-edit-profile').click();
        await page.waitForTimeout(2000);

        // Step 2: Clear Name
        await page.locator('input[name="name"]').fill('');

        // Step 3: Click Simpan Perubahan
        await page.getByRole('button', { name: ' Simpan Perubahan' }).click({ force: true });
        await page.waitForTimeout(2000);

        // Expected: Validation Error
        const bodyText = await page.locator('body').textContent();
        expect(bodyText).toMatch(/Harap masukkan nama lengkap|Nama minimal 3 karakter/i);
    });
});
