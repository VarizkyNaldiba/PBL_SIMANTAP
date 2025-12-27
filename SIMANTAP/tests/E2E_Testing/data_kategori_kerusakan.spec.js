import { test, expect } from '@playwright/test';

test.describe('Admin - Data Kategori Kerusakan', () => {

    test.beforeEach(async ({ page }) => {
        await page.goto('https://simantap.dbsnetwork.my.id/login', {
            waitUntil: 'domcontentloaded',
            timeout: 60000
        });

        await page.getByPlaceholder('NIM/NIP/NIDN / Akun Polinema').fill('admin');
        await page.getByPlaceholder('Password').fill('12345');
        await page.getByRole('button', { name: 'Masuk' }).click();

        // Tunggu popup login berhasil
        await expect(page.locator('.swal2-popup')).toBeVisible({ timeout: 10000 });
        await expect(page.locator('.swal2-title')).toHaveText(/Berhasil/);
        // Klik OK pada popup
        await page.getByRole('button', { name: 'OK' }).click();

        // Pastikan sudah masuk dashboard
        await expect(page).toHaveURL(/dashboard/, { timeout: 50000 });
    });

    test('tambah data kategori', async ({ page }) => {
        // Masuk ke halaman kategori kerusakan
        await page.goto('https://simantap.dbsnetwork.my.id/kategoriKerusakan', {
            waitUntil: 'domcontentloaded',
            timeout: 60000
        });
        await expect(page.getByRole('heading', { name: 'Manajemen Kategori Kerusakan' })).toBeVisible();

        // Tambah kategori baru
        await page.locator('button:has-text("Tambah Kategori")').click();
        await expect(page.getByText('Tambah Data Kategori Kerusakan')).toBeVisible();
        const uniqueName = `Kerusakan Test ${Date.now()}`;
        await page.getByPlaceholder('Contoh: Kerusakan Hardware').fill(uniqueName);
        await page.locator('button:has-text("Simpan")').click();
        await expect(page.locator('.swal2-container')).toBeVisible({ timeout: 10000 });
        await expect(page.locator('.swal2-container')).toBeHidden({ timeout: 15000 });
    });

    test('detail data kategori', async ({ page }) => {
        // Masuk ke halaman kategori kerusakan
        await page.goto('https://simantap.dbsnetwork.my.id/kategoriKerusakan', {
            waitUntil: 'domcontentloaded',
            timeout: 60000
        });
        await expect(page.getByRole('heading', { name: 'Manajemen Kategori Kerusakan' })).toBeVisible();

        // Detail kategori
        await page.locator('button:has-text("Detail")').first().click({ force: true });
        await page.waitForTimeout(1000);
        await expect(page.getByRole('dialog')).toBeVisible({ timeout: 10000 });
        await page.locator('button.btn-close').click();
        await page.waitForTimeout(500);
    });

    test('edit data kategori', async ({ page }) => {
        // Masuk ke halaman kategori kerusakan
        await page.goto('https://simantap.dbsnetwork.my.id/kategoriKerusakan', {
            waitUntil: 'domcontentloaded',
            timeout: 60000
        });
        await expect(page.getByRole('heading', { name: 'Manajemen Kategori Kerusakan' })).toBeVisible();

        // Edit kategori
        await page.locator('button:has-text("Edit")').first().click();
        await expect(page.getByText('Edit Kategori Kerusakan')).toBeVisible();
        const editedName = `Kerusakan Edited ${Date.now()}`;
        await page.getByPlaceholder('Contoh: Kerusakan Hardware').fill(editedName);
        await page.locator('button:has-text("Simpan Perubahan")').click();
        await expect(page.locator('.swal2-container')).toBeVisible({ timeout: 10000 });
        await expect(page.locator('.swal2-container')).toBeHidden({ timeout: 15000 });
    });

    test('hapus data kategori', async ({ page }) => {
        // Masuk ke halaman kategori kerusakan
        await page.goto('https://simantap.dbsnetwork.my.id/kategoriKerusakan', {
            waitUntil: 'domcontentloaded',
            timeout: 60000
        });
        await expect(page.getByRole('heading', { name: 'Manajemen Kategori Kerusakan' })).toBeVisible();

        // Hapus kategori dari list terakhir
        await page.waitForTimeout(1000);
        const rows = page.locator('tbody tr');
        const lastRow = rows.last();
        await lastRow.scrollIntoViewIfNeeded();
        await lastRow.locator('button:has-text("Delete")').click({ force: true });
        await page.waitForTimeout(500);
        await page.locator('button:has-text("Ya, Hapus")').click();
        await expect(page.locator('.swal2-container')).toBeHidden({ timeout: 15000 });
    });

    test('search data kategori - Kerusakan Hardware', async ({ page }) => {
        // Masuk ke halaman kategori kerusakan
        await page.goto('https://simantap.dbsnetwork.my.id/kategoriKerusakan', {
            waitUntil: 'domcontentloaded',
            timeout: 60000
        });
        await expect(page.getByRole('heading', { name: 'Manajemen Kategori Kerusakan' })).toBeVisible();

        // Search: Kerusakan Hardware
        const searchBox = page.locator('input[type="search"]');
        await searchBox.fill('Kerusakan Hardware');
        await page.waitForTimeout(1000);

        // Verifikasi hasil search
        const tableRows = page.locator('tbody tr');
        await expect(tableRows).toHaveCount(1);
        await expect(tableRows.first()).toContainText('Kerusakan Hardware');
    });

    test('validasi duplikasi nama saat tambah - Kerusakan Umum', async ({ page }) => {
        // Masuk ke halaman kategori kerusakan
        await page.goto('https://simantap.dbsnetwork.my.id/kategoriKerusakan', {
            waitUntil: 'domcontentloaded',
            timeout: 60000
        });
        await expect(page.getByRole('heading', { name: 'Manajemen Kategori Kerusakan' })).toBeVisible();

        // Tambah kategori dengan nama yang sudah ada
        await page.locator('button:has-text("Tambah Kategori")').click();
        await expect(page.getByText('Tambah Data Kategori Kerusakan')).toBeVisible();
        await page.getByPlaceholder('Contoh: Kerusakan Hardware').fill('Kerusakan Umum');
        await page.locator('button:has-text("Simpan")').click();
        await page.waitForTimeout(1000);

        // Verifikasi modal masih terbuka atau ada pesan error
        const isModalStillVisible = await page.getByText('Tambah Data Kategori Kerusakan').isVisible();
        const hasErrorAlert = await page.locator('.swal2-popup').isVisible();
        expect(isModalStillVisible || hasErrorAlert).toBeTruthy();
    });

    test('validasi duplikasi nama saat edit - Kerusakan Umum', async ({ page }) => {
        // Masuk ke halaman kategori kerusakan
        await page.goto('https://simantap.dbsnetwork.my.id/kategoriKerusakan', {
            waitUntil: 'domcontentloaded',
            timeout: 60000
        });
        await expect(page.getByRole('heading', { name: 'Manajemen Kategori Kerusakan' })).toBeVisible();

        // Edit kategori pertama dengan nama yang sudah ada (Kerusakan Umum)
        await page.locator('button:has-text("Edit")').first().click();
        await expect(page.getByText('Edit Kategori Kerusakan')).toBeVisible();
        
        // Ambil input field dan isi dengan nama yang duplikat
        const inputField = page.locator('.modal.show input[type="text"]').first();
        await inputField.click();
        await inputField.fill('');
        await inputField.fill('Kerusakan Umum');
        await page.locator('button:has-text("Simpan Perubahan")').click();
        await page.waitForTimeout(1000);

        // Verifikasi modal masih terbuka atau ada pesan error
        const isModalStillVisible = await page.getByText('Edit Kategori Kerusakan').isVisible();
        const hasErrorAlert = await page.locator('.swal2-popup').isVisible();
        expect(isModalStillVisible || hasErrorAlert).toBeTruthy();
    });

    test('validasi batal hapus data kategori', async ({ page }) => {
        // Masuk ke halaman kategori kerusakan
        await page.goto('https://simantap.dbsnetwork.my.id/kategoriKerusakan', {
            waitUntil: 'domcontentloaded',
            timeout: 60000
        });
        await expect(page.getByRole('heading', { name: 'Manajemen Kategori Kerusakan' })).toBeVisible();

        // Ambil row pertama dari tabel
        const targetRow = page.locator('tbody tr').first();
        await expect(targetRow).toBeVisible();

        // Klik tombol Delete pada row tersebut
        await targetRow.locator('button:has-text("Delete")').click({ force: true });
        await page.waitForTimeout(500);
        
        // Klik tombol Batal
        await page.locator('button:has-text("Batal")').click();
        await page.waitForTimeout(1000);
        
        // Verifikasi data masih ada di tabel
        await expect(targetRow).toBeVisible();
    });
});
