import { test, expect } from '@playwright/test';
import path from 'path';

test.describe('Modul Laporan', () => {
    test.beforeEach(async ({ page }) => {
        // Set longer timeout for test execution
        test.setTimeout(120000);
        page.setDefaultTimeout(90000);
        page.setDefaultNavigationTimeout(90000);

        // Login as Mahasiswa
        await page.goto('https://simantap.dbsnetwork.my.id/login', { waitUntil: 'domcontentloaded' });
        await page.getByRole('textbox', { name: 'NIM/NIP/NIDN / Akun Polinema' }).fill('mahasiswa1');
        await page.getByRole('textbox', { name: 'Password' }).fill('password');
        await page.getByRole('button', { name: 'Masuk' }).click();

        // Wait for success modal and close it
        await page.getByRole('button', { name: 'OK' }).click();

        // Wait for preloader to disappear
        await page.waitForSelector('#preloader', { state: 'hidden', timeout: 60000 }).catch(() => { });
        await page.waitForTimeout(2000);

        // Navigate directly to Laporan page
        await page.goto('https://simantap.dbsnetwork.my.id/laporan', { waitUntil: 'domcontentloaded', timeout: 90000 });

        // Wait for page to load and preloader to disappear
        await page.waitForSelector('#preloader', { state: 'hidden', timeout: 60000 }).catch(() => { });
        await page.waitForTimeout(3000);
    });

    test('TC_LAPORAN_001 - Membuat laporan kerusakan baru (Happy Path)', async ({ page }) => {
        // Step 1: Select Fasilitas (e.g., Fasilitas Gedung = 1, or whatever is available)
        // We'll select the second option (index 1) to be safe, or by label if we knew it.
        // Let's try to select by index 1 (first available option after placeholder)
        await page.locator('select[name="fasilitas_id"]').selectOption({ index: 1 });
        await page.waitForTimeout(1000);

        // Step 2: Select Unit
        // Wait for unit dropdown to be enabled/populated
        await expect(page.locator('select[name="unit_id"]')).toBeEnabled();
        await page.locator('select[name="unit_id"]').selectOption({ index: 1 });
        await page.waitForTimeout(1000);

        // Step 3: Select Tempat
        await expect(page.locator('select[name="tempat_id"]')).toBeEnabled();
        await page.locator('select[name="tempat_id"]').selectOption({ index: 1 });
        await page.waitForTimeout(1000);

        // Step 4: Select Barang
        await expect(page.locator('select[name="barang_lokasi_id"]')).toBeEnabled();
        await page.locator('select[name="barang_lokasi_id"]').selectOption({ index: 1 });
        await page.waitForTimeout(1000);

        // Step 5: Select Kategori Kerusakan
        await expect(page.locator('select[name="kategori_kerusakan_id"]')).toBeEnabled();
        await page.locator('select[name="kategori_kerusakan_id"]').selectOption({ index: 1 });
        
        // Step 6: Fill Jumlah
        await page.locator('input[name="jumlah_barang_rusak"]').fill('1');

        // Step 7: Fill Deskripsi
        await page.locator('textarea[name="deskripsi"]').fill('Test E2E Laporan Kerusakan');

        // Step 8: Upload Photo
        // We need a file path. We can use a placeholder image from the project if available, or create a dummy one.
        // Since we are running in the user's environment, we can try to use a known file.
        // public/profile_placeholder.png seems to exist.
        // We need the absolute path. Since we don't know the absolute path of the project root in the test runner (it might be different),
        // we can try to use a relative path if the test runner supports it, or try to find a file.
        // However, Playwright's setInputFiles usually resolves relative to the spec file or cwd.
        // Let's try to use a dummy file creation or point to a file we know exists.
        // The user provided d:\Kuliah\Sem 5\PMPL\PBL_SIMANTAP\SIMANTAP\tests\E2E_Testing
        // We can assume the project root is d:\Kuliah\Sem 5\PMPL\PBL_SIMANTAP\SIMANTAP
        // So public/profile_placeholder.png is at d:\Kuliah\Sem 5\PMPL\PBL_SIMANTAP\SIMANTAP\public\profile_placeholder.png
        
        const filePath = 'd:\\Kuliah\\Sem 5\\PMPL\\PBL_SIMANTAP\\SIMANTAP\\public\\profile_placeholder.png';
        await page.locator('input[name="foto_laporan"]').setInputFiles(filePath);

        // Step 9: Submit
        await page.getByRole('button', { name: ' Kirim Laporan' }).click({ force: true });
        await page.waitForTimeout(5000); // Wait for upload and processing

        // Expected: Success modal/alert
        // The code shows Swal.fire with 'Berhasil!'
        const bodyText = await page.locator('body').textContent();
        expect(bodyText).toMatch(/Berhasil!|Laporan berhasil dikirim/i);

        // Click "Ke Riwayat Laporan" or "Tutup"
        // await page.getByRole('button', { name: 'Ke Riwayat Laporan' }).click();
    });

    test('TC_LAPORAN_002 - Membuat laporan dengan data kosong (Validation Error)', async ({ page }) => {
        // Step 1: Click Submit immediately
        await page.getByRole('button', { name: ' Kirim Laporan' }).click({ force: true });
        await page.waitForTimeout(2000);

        // Expected: Validation errors
        // The form uses jQuery validation which adds labels or text.
        const bodyText = await page.locator('body').textContent();
        expect(bodyText).toMatch(/Silakan pilih fasilitas|Silakan isi deskripsi kerusakan/i);
    });
});
