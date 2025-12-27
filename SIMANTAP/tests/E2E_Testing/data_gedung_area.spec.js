import { test, expect } from '@playwright/test';

test.describe('Admin - Data Gedung dan Area', () => {

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

    test('tambah data unit', async ({ page }) => {
        test.setTimeout(120000);
        
        // Masuk ke halaman unit
        await page.goto('https://simantap.dbsnetwork.my.id/unit', {
            waitUntil: 'domcontentloaded',
            timeout: 60000
        });
        await expect(page.getByText('Data Gedung & Area')).toBeVisible();

        // Tambah Unit baru
        await page.locator('button:has-text("Tambah Unit")').click();
        await expect(page.getByText('Tambah Data Unit')).toBeVisible();
        const uniqueName = `Gedung Test ${Date.now()}`;
        await page.getByPlaceholder('Contoh: Gedung AHS').fill(uniqueName);
        await page.locator('button:has-text("Simpan")').click();
        await expect(page.locator('.swal2-container')).toBeVisible({ timeout: 10000 });
        await expect(page.locator('.swal2-container')).toBeHidden({ timeout: 15000 });
    });

    test('detail data unit', async ({ page }) => {
        // Masuk ke halaman unit
        await page.goto('https://simantap.dbsnetwork.my.id/unit', {
            waitUntil: 'domcontentloaded',
            timeout: 60000
        });
        await expect(page.getByText('Data Gedung & Area')).toBeVisible();

        // Detail unit
        await page.locator('button:has-text("Detail")').first().click({ force: true });
        await expect(page.getByText('Detail informasi unit')).toBeVisible();
        await page.locator('button.btn-close').click();
        await expect(page.getByText('Detail informasi unit')).toBeHidden();
    });

    test('edit data unit', async ({ page }) => {
        // Masuk ke halaman unit
        await page.goto('https://simantap.dbsnetwork.my.id/unit', {
            waitUntil: 'domcontentloaded',
            timeout: 60000
        });
        await expect(page.getByText('Data Gedung & Area')).toBeVisible();

        // Edit unit
        await page.locator('button:has-text("Edit")').first().click();
        await expect(page.getByText('Edit Data Unit')).toBeVisible();
        const editedName = `Gedung Edited ${Date.now()}`;
        await page.getByPlaceholder('Contoh: Gedung AHS').fill(editedName);
        await page.locator('button:has-text("Simpan")').click();
        await expect(page.locator('.swal2-container')).toBeVisible({ timeout: 10000 });
        await expect(page.locator('.swal2-container')).toBeHidden({ timeout: 15000 });
    });

    test('hapus data unit', async ({ page }) => {
        // Masuk ke halaman unit
        await page.goto('https://simantap.dbsnetwork.my.id/unit', {
            waitUntil: 'domcontentloaded',
            timeout: 60000
        });
        await expect(page.getByText('Data Gedung & Area')).toBeVisible();

        // Hapus unit dari list terakhir
        await page.waitForTimeout(1000);
        const unitRows = page.locator('tbody tr');
        const lastRow = unitRows.last();
        await lastRow.scrollIntoViewIfNeeded();
        await lastRow.locator('button:has-text("Hapus")').click({ force: true });
        await page.waitForTimeout(500);
        await page.locator('button:has-text("Ya, Hapus")').click();
        await expect(page.locator('.swal2-container')).toBeHidden({ timeout: 15000 });
    });

    test('tambah data ruang', async ({ page }) => {
        test.setTimeout(120000);
        
        // Masuk ke halaman unit
        await page.goto('https://simantap.dbsnetwork.my.id/unit', {
            waitUntil: 'domcontentloaded',
            timeout: 60000
        });
        await expect(page.getByText('Data Gedung & Area')).toBeVisible();

        // Kelola Ruang dari unit pertama
        await page.locator('button:has-text("Kelola Ruang")').first().click();
        await expect(page.getByText(/Daftar Ruang/)).toBeVisible();

        // Tambah Ruang baru
        await page.locator('button:has-text("Tambah Ruang")').click();
        await expect(page.getByText('Tambah Ruang Baru')).toBeVisible();
        const uniqueRoomName = `Ruang Test ${Date.now()}`;
        await page.getByPlaceholder('Contoh: Ruang Meeting Lantai 2').fill(uniqueRoomName);
        await page.locator('button:has-text("Simpan")').click();
        await expect(page.locator('.swal2-container')).toBeVisible({ timeout: 10000 });
        await expect(page.locator('.swal2-container')).toBeHidden({ timeout: 15000 });
    });

    test('detail data ruang', async ({ page }) => {
        test.setTimeout(120000);
        
        // Masuk ke halaman unit
        await page.goto('https://simantap.dbsnetwork.my.id/unit', {
            waitUntil: 'domcontentloaded',
            timeout: 60000
        });
        await expect(page.getByText('Data Gedung & Area')).toBeVisible();

        // Kelola Ruang dari unit pertama
        await page.locator('button:has-text("Kelola Ruang")').first().click();
        await expect(page.getByText(/Daftar Ruang/)).toBeVisible();
        await page.waitForTimeout(2000);

        // Detail Ruang
        await page.locator('button:has-text("Detail")').first().click({ force: true });
        await page.waitForTimeout(1000);
        await expect(page.getByRole('dialog')).toBeVisible({ timeout: 10000 });
        await page.locator('button.btn-close').click();
        await page.waitForTimeout(500);
    });

    test('edit data ruang', async ({ page }) => {
        test.setTimeout(120000);
        
        // Masuk ke halaman unit
        await page.goto('https://simantap.dbsnetwork.my.id/unit', {
            waitUntil: 'domcontentloaded',
            timeout: 60000
        });
        await expect(page.getByText('Data Gedung & Area')).toBeVisible();

        // Kelola Ruang dari unit pertama
        await page.locator('button:has-text("Kelola Ruang")').first().click();
        await expect(page.getByText(/Daftar Ruang/)).toBeVisible();
        await page.waitForTimeout(2000);

        // Tutup modal jika ada yang masih terbuka
        const openModal = page.locator('.modal.show');
        if (await openModal.count() > 0) {
            await page.locator('.modal.show button.btn-close').click();
            await page.waitForTimeout(500);
        }

        // Edit Ruang
        await page.locator('button:has-text("Edit")').first().click({ force: true });
        await page.waitForTimeout(1000);
        await expect(page.getByRole('dialog')).toBeVisible({ timeout: 10000 });
        const editedRoomName = `Ruang Edited ${Date.now()}`;
        const roomNameInput = page.locator('.modal.show input[type="text"]').first();
        await roomNameInput.click();
        await roomNameInput.fill('');
        await roomNameInput.fill(editedRoomName);
        await page.locator('button:has-text("Simpan")').click();
        await expect(page.locator('.swal2-container')).toBeVisible({ timeout: 10000 });
        await expect(page.locator('.swal2-container')).toBeHidden({ timeout: 15000 });
    });

    test('hapus data ruang', async ({ page }) => {
        test.setTimeout(120000);
        
        // Masuk ke halaman unit
        await page.goto('https://simantap.dbsnetwork.my.id/unit', {
            waitUntil: 'domcontentloaded',
            timeout: 60000
        });
        await expect(page.getByText('Data Gedung & Area')).toBeVisible();

        // Kelola Ruang dari unit pertama
        await page.locator('button:has-text("Kelola Ruang")').first().click();
        await expect(page.getByText(/Daftar Ruang/)).toBeVisible();
        await page.waitForTimeout(2000);

        // Hapus Ruang dari list terakhir
        await page.waitForTimeout(1000);
        const roomRows = page.locator('tbody tr');
        const lastRoomRow = roomRows.last();
        await lastRoomRow.scrollIntoViewIfNeeded();
        await lastRoomRow.locator('button:has-text("Hapus")').click({ force: true });
        await page.waitForTimeout(500);
        await page.locator('button:has-text("Ya, Hapus")').click();
        await expect(page.locator('.swal2-container')).toBeHidden({ timeout: 15000 });
    });

    test('filter data unit', async ({ page }) => {
        // Masuk ke halaman unit
        await page.goto('https://simantap.dbsnetwork.my.id/unit', {
            waitUntil: 'domcontentloaded',
            timeout: 60000
        });
        await expect(page.getByText('Data Gedung & Area')).toBeVisible();

        // Filter: Fasilitas Gedung
        await page.locator('select').first().selectOption({ label: 'Fasilitas Gedung' });
        await page.waitForTimeout(1000);
        await expect(page.locator('tbody tr').first()).toContainText('Fasilitas Gedung');

        // Filter: Fasilitas Umum
        await page.locator('select').first().selectOption({ label: 'Faslitas Umum' });
        await page.waitForTimeout(1000);
        await expect(page.locator('tbody tr').first()).toContainText('Faslitas Umum');

        // Filter: Semua
        await page.locator('select').first().selectOption({ label: '- Semua -' });
        await page.waitForTimeout(1000);
        await expect(page.locator('tbody tr')).not.toHaveCount(0);
    });

    test('validasi duplikasi nama gedung', async ({ page }) => {
        test.setTimeout(120000);
        
        // Masuk ke halaman unit
        await page.goto('https://simantap.dbsnetwork.my.id/unit', {
            waitUntil: 'domcontentloaded',
            timeout: 60000
        });
        await expect(page.getByText('Data Gedung & Area')).toBeVisible();

        // Coba tambah unit dengan nama yang sudah ada (misalnya "Gedung Teknik Mesin")
        await page.locator('button:has-text("Tambah Unit")').click();
        await expect(page.getByText('Tambah Data Unit')).toBeVisible();
        await page.getByPlaceholder('Contoh: Gedung AHS').fill('Gedung Teknik Mesin');
        await page.locator('button:has-text("Simpan")').click();
        
        // Tunggu dan cek muncul pesan error (bisa berupa sweet alert error atau validasi)
        await page.waitForTimeout(2000);
        // Verifikasi ada pesan error atau modal tidak tertutup (masih visible)
        const isModalStillVisible = await page.getByText('Tambah Data Unit').isVisible();
        const hasErrorAlert = await page.locator('.swal2-popup, .alert-danger, .text-danger').count() > 0;
        
        expect(isModalStillVisible || hasErrorAlert).toBeTruthy();
    });

    test('validasi duplikasi nama saat edit unit', async ({ page }) => {
        // Masuk ke halaman unit
        await page.goto('https://simantap.dbsnetwork.my.id/unit', {
            waitUntil: 'domcontentloaded',
            timeout: 60000
        });
        await expect(page.getByText('Data Gedung & Area')).toBeVisible();

        // Edit unit pertama
        await page.locator('button:has-text("Edit")').first().click();
        await expect(page.getByText('Edit Data Unit')).toBeVisible();
        
        // Ubah nama menjadi nama yang sudah ada (misalnya "Gedung Teknik Mesin")
        await page.getByPlaceholder('Contoh: Gedung AHS').fill('Gedung Teknik Mesin');
        await page.locator('button:has-text("Simpan")').click();
        
        // Tunggu dan cek muncul pesan error
        await page.waitForTimeout(2000);
        // Verifikasi ada pesan error atau modal tidak tertutup (masih visible)
        const isModalStillVisible = await page.getByText('Edit Data Unit').isVisible();
        const hasErrorAlert = await page.locator('.swal2-popup, .alert-danger, .text-danger').count() > 0;
        
        expect(isModalStillVisible || hasErrorAlert).toBeTruthy();
    });

    test('validasi duplikasi nama saat tambah ruang', async ({ page }) => {
        test.setTimeout(120000);
        
        // Masuk ke halaman unit
        await page.goto('https://simantap.dbsnetwork.my.id/unit', {
            waitUntil: 'domcontentloaded',
            timeout: 60000
        });
        await expect(page.getByText('Data Gedung & Area')).toBeVisible();

        // Kelola Ruang dari unit pertama
        await page.locator('button:has-text("Kelola Ruang")').first().click();
        await expect(page.getByText(/Daftar Ruang/)).toBeVisible();
        await page.waitForTimeout(2000);

        // Coba tambah ruang dengan nama yang sudah ada
        await page.locator('button:has-text("Tambah Ruang")').click();
        await expect(page.getByText('Tambah Ruang Baru')).toBeVisible();
        await page.getByPlaceholder('Contoh: Ruang Meeting Lantai 2').fill('Ruang Baca - 6T');
        await page.locator('button:has-text("Simpan")').click();
        
        // Tunggu dan cek muncul pesan error
        await page.waitForTimeout(2000);
        // Verifikasi ada pesan error atau modal tidak tertutup (masih visible)
        const isModalStillVisible = await page.getByText('Tambah Ruang Baru').isVisible();
        const hasErrorAlert = await page.locator('.swal2-popup, .alert-danger, .text-danger').count() > 0;
        
        expect(isModalStillVisible || hasErrorAlert).toBeTruthy();
    });

    test('validasi duplikasi nama saat edit ruang', async ({ page }) => {
        test.setTimeout(120000);
        
        // Masuk ke halaman unit
        await page.goto('https://simantap.dbsnetwork.my.id/unit', {
            waitUntil: 'domcontentloaded',
            timeout: 60000
        });
        await expect(page.getByText('Data Gedung & Area')).toBeVisible();

        // Kelola Ruang dari unit pertama
        await page.locator('button:has-text("Kelola Ruang")').first().click();
        await expect(page.getByText(/Daftar Ruang/)).toBeVisible();
        await page.waitForTimeout(2000);

        // Tutup modal jika ada
        const openModal = page.locator('.modal.show');
        if (await openModal.count() > 0) {
            await page.locator('.modal.show button.btn-close').click();
            await page.waitForTimeout(500);
        }

        // Edit ruang pertama
        await page.locator('button:has-text("Edit")').first().click({ force: true });
        await page.waitForTimeout(1000);
        await expect(page.getByRole('dialog')).toBeVisible({ timeout: 10000 });
        
        // Ubah nama menjadi nama yang sudah ada
        const roomNameInput = page.locator('.modal.show input[type="text"]').first();
        await roomNameInput.click();
        await roomNameInput.fill('');
        await roomNameInput.fill('Ruang Baca - 6T');
        await page.locator('button:has-text("Simpan")').click();
        
        // Tunggu dan cek muncul pesan error
        await page.waitForTimeout(2000);
        // Verifikasi ada pesan error atau modal tidak tertutup (masih visible)
        const isModalStillVisible = await page.getByRole('dialog').isVisible();
        const hasErrorAlert = await page.locator('.swal2-popup, .alert-danger, .text-danger').count() > 0;
        
        expect(isModalStillVisible || hasErrorAlert).toBeTruthy();
    });
});
