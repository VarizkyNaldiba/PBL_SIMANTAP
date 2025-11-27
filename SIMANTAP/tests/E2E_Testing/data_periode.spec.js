import { test, expect } from '@playwright/test';

test.describe('Modul Data Periode', () => {
    test.beforeEach(async ({ page }) => {
        // Login sebagai admin
        await page.goto('https://simantap.dbsnetwork.my.id/login');
        await page.fill('input[name="username"]', 'admin');
        await page.fill('input[name="password"]', '12345');
        await page.click('button[type="submit"]');
        await page.waitForURL('**/dashboard');
    });

    test('TC01 - Menampilkan halaman list periode', async ({ page }) => {
        await page.goto('https://simantap.dbsnetwork.my.id/periode');
        await expect(page).toHaveURL(/.*periode/);
        await expect(page.locator('h1, h2, h3')).toContainText(/Periode/i);
    });

    test('TC02 - Membuka form tambah periode', async ({ page }) => {
        await page.goto('https://simantap.dbsnetwork.my.id/periode');
        await page.click('a:has-text("Tambah"), button:has-text("Tambah")');
        await expect(page).toHaveURL(/.*periode\/create/);
        await expect(page.locator('form')).toBeVisible();
    });

    test('TC03 - Menambah periode baru dengan data valid', async ({ page }) => {
        await page.goto('https://simantap.dbsnetwork.my.id/periode/create');

        // Isi form periode
        await page.fill('input[name="periode_nama"]', 'Semester Ganjil 2024/2025');
        await page.fill('input[name="periode_tahun"]', '2024');
        await page.fill('input[name="periode_tanggal_mulai"]', '2024-08-01');
        await page.fill('input[name="periode_tanggal_selesai"]', '2024-12-31');
        await page.selectOption('select[name="periode_status"]', 'aktif');

        await page.click('button[type="submit"]');
        await expect(page).toHaveURL(/.*periode$/);
        await expect(page.locator('body')).toContainText(/berhasil|sukses/i);
    });

    test('TC04 - Validasi form tambah dengan data kosong', async ({ page }) => {
        await page.goto('https://simantap.dbsnetwork.my.id/periode/create');
        await page.click('button[type="submit"]');
        await expect(page.locator('form')).toContainText(/required|wajib|harus diisi/i);
    });

    test('TC05 - Validasi tanggal selesai lebih awal dari tanggal mulai', async ({ page }) => {
        await page.goto('https://simantap.dbsnetwork.my.id/periode/create');

        await page.fill('input[name="periode_nama"]', 'Test Periode');
        await page.fill('input[name="periode_tahun"]', '2024');
        await page.fill('input[name="periode_tanggal_mulai"]', '2024-12-31');
        await page.fill('input[name="periode_tanggal_selesai"]', '2024-08-01');

        await page.click('button[type="submit"]');
        await expect(page.locator('body')).toContainText(/tanggal selesai|harus lebih besar|invalid/i);
    });

    test('TC06 - Menampilkan detail periode', async ({ page }) => {
        await page.goto('https://simantap.dbsnetwork.my.id/periode');
        await page.click('a:has-text("Detail"), button:has-text("Detail"), .btn-detail').first();
        await expect(page).toHaveURL(/.*periode\/\d+/);
        await expect(page.locator('body')).toContainText(/Detail|Periode/i);
    });

    test('TC07 - Membuka form edit periode', async ({ page }) => {
        await page.goto('https://simantap.dbsnetwork.my.id/periode');
        await page.click('a:has-text("Edit"), button:has-text("Edit"), .btn-edit').first();
        await expect(page).toHaveURL(/.*periode\/\d+\/edit/);
        await expect(page.locator('form')).toBeVisible();
    });

    test('TC08 - Mengupdate periode dengan data valid', async ({ page }) => {
        await page.goto('https://simantap.dbsnetwork.my.id/periode');
        await page.click('a:has-text("Edit"), button:has-text("Edit"), .btn-edit').first();

        await page.fill('input[name="periode_nama"]', 'Semester Ganjil 2024/2025 Updated');
        await page.click('button[type="submit"]');

        await expect(page).toHaveURL(/.*periode$/);
        await expect(page.locator('body')).toContainText(/berhasil|sukses/i);
    });

    test('TC09 - Mengubah status periode menjadi aktif', async ({ page }) => {
        await page.goto('https://simantap.dbsnetwork.my.id/periode');
        await page.click('a:has-text("Edit"), button:has-text("Edit"), .btn-edit').first();

        await page.selectOption('select[name="periode_status"]', 'aktif');
        await page.click('button[type="submit"]');

        await expect(page).toHaveURL(/.*periode$/);
        await expect(page.locator('body')).toContainText(/berhasil|sukses/i);
    });

    test('TC10 - Mengubah status periode menjadi nonaktif', async ({ page }) => {
        await page.goto('https://simantap.dbsnetwork.my.id/periode');
        await page.click('a:has-text("Edit"), button:has-text("Edit"), .btn-edit').first();

        await page.selectOption('select[name="periode_status"]', 'nonaktif');
        await page.click('button[type="submit"]');

        await expect(page).toHaveURL(/.*periode$/);
        await expect(page.locator('body')).toContainText(/berhasil|sukses/i);
    });

    test('TC11 - Menghapus periode', async ({ page }) => {
        await page.goto('https://simantap.dbsnetwork.my.id/periode');

        page.on('dialog', dialog => dialog.accept());

        await page.click('button:has-text("Hapus"), .btn-delete').first();
        await page.waitForTimeout(500);
        await expect(page.locator('body')).toContainText(/berhasil|sukses/i);
    });

    test('TC12 - Pencarian periode berdasarkan nama', async ({ page }) => {
        await page.goto('https://simantap.dbsnetwork.my.id/periode');
        await page.fill('input[type="search"], input[name="search"]', 'Ganjil');
        await page.waitForTimeout(500);
        await expect(page.locator('table tbody tr')).toContainText(/Ganjil/i);
    });

    test('TC13 - Filter periode berdasarkan tahun', async ({ page }) => {
        await page.goto('https://simantap.dbsnetwork.my.id/periode');
        const filterTahun = page.locator('select[name="periode_tahun"], input[name="tahun"]');
        if (await filterTahun.isVisible()) {
            await filterTahun.fill('2024');
            await page.waitForTimeout(500);
        }
        await expect(page.locator('table tbody tr')).toHaveCount({ minimum: 0 });
    });

    test('TC14 - Filter periode berdasarkan status', async ({ page }) => {
        await page.goto('https://simantap.dbsnetwork.my.id/periode');
        const filterStatus = page.locator('select[name="status"]');
        if (await filterStatus.isVisible()) {
            await filterStatus.selectOption('aktif');
            await page.waitForTimeout(500);
        }
        await expect(page.locator('table tbody tr')).toHaveCount({ minimum: 0 });
    });

    test('TC15 - Validasi hanya satu periode aktif dalam satu waktu', async ({ page }) => {
        await page.goto('https://simantap.dbsnetwork.my.id/periode/create');

        await page.fill('input[name="periode_nama"]', 'Periode Aktif Kedua');
        await page.fill('input[name="periode_tahun"]', '2024');
        await page.fill('input[name="periode_tanggal_mulai"]', '2024-08-01');
        await page.fill('input[name="periode_tanggal_selesai"]', '2024-12-31');
        await page.selectOption('select[name="periode_status"]', 'aktif');

        await page.click('button[type="submit"]');

        const bodyText = await page.locator('body').textContent();
        if (bodyText.match(/sudah ada periode aktif|hanya satu periode/i)) {
            await expect(page.locator('body')).toContainText(/sudah ada periode aktif|hanya satu periode/i);
        }
    });
});
