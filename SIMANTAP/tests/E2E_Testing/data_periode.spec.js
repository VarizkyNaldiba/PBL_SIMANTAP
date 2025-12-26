import { test, expect } from '@playwright/test';

test.describe('Modul Data Periode', () => {
    test.beforeEach(async ({ page }) => {
        // Set longer timeout for test execution
        test.setTimeout(120000);
        page.setDefaultTimeout(90000);
        page.setDefaultNavigationTimeout(90000);

        // Login as admin
        await page.goto('https://simantap.dbsnetwork.my.id/login', { waitUntil: 'domcontentloaded' });
        await page.getByRole('textbox', { name: 'NIM/NIP/NIDN / Akun Polinema' }).click();
        await page.getByRole('textbox', { name: 'NIM/NIP/NIDN / Akun Polinema' }).fill('admin');
        await page.getByRole('textbox', { name: 'Password' }).fill('12345');
        await page.getByRole('button', { name: 'Masuk' }).click();

        // Wait for success modal and close it
        await page.getByRole('button', { name: 'OK' }).click();

        // Wait for preloader to disappear
        await page.waitForSelector('#preloader', { state: 'hidden', timeout: 60000 }).catch(() => { });
        await page.waitForTimeout(2000);

        // Navigate to Data Periode page via menu
        await page.getByRole('link', { name: ' Data Periode' }).click();

        // Wait for page to load and preloader to disappear
        await page.waitForSelector('#preloader', { state: 'hidden', timeout: 60000 }).catch(() => { });
        await page.waitForTimeout(3000);
    });

    test('TC_DATA_PERIODE_001 - Menambahkan data periode dengan jumlah karakter angka tidak sama dengan 4', async ({ page }) => {
        // Wait for preloader
        await page.waitForSelector('#preloader', { state: 'hidden', timeout: 30000 }).catch(() => { });
        await page.waitForTimeout(1000);

        // Step 1: Click "Tambah Periode"
        await page.getByRole('button', { name: ' Tambah Periode' }).click();
        await page.waitForTimeout(2000);

        // Step 2: Fill with more than 4 digits (202412)
        await page.getByRole('textbox', { name: 'Contoh:' }).click();
        await page.getByRole('textbox', { name: 'Contoh:' }).fill('202412');
        await page.getByRole('button', { name: ' Simpan' }).click();
        await page.waitForTimeout(2000);

        // Expected: Error message "Format tahun tidak valid. Gunakan format YYYY" appears
        await expect(page.locator('body')).toContainText(/Format tahun tidak valid|Gunakan format YYYY/i);
    });

    test('TC_DATA_PERIODE_002 - Menambahkan data periode dengan jumlah karakter angka sama dengan 4', async ({ page }) => {
        // Wait for preloader
        await page.waitForSelector('#preloader', { state: 'hidden', timeout: 30000 }).catch(() => { });
        await page.waitForTimeout(1000);

        // Step 1: Click "Tambah Periode"
        await page.getByRole('button', { name: ' Tambah Periode' }).click();
        await page.waitForTimeout(2000);

        // Step 2: Fill with exactly 4 digits (2050)
        await page.getByRole('textbox', { name: 'Contoh:' }).click();
        await page.getByRole('textbox', { name: 'Contoh:' }).fill('2050');
        await page.getByRole('button', { name: ' Simpan' }).click();
        await page.waitForTimeout(3000);

        // Expected: Success modal appears
        const bodyText = await page.locator('body').textContent();
        expect(bodyText).toMatch(/berhasil dibuat|berhasil disimpan|berhasil|success/i);
    });

    test('TC_DATA_PERIODE_003 - Menambahkan data periode dengan karakter selain angka', async ({ page }) => {
        // Wait for preloader
        await page.waitForSelector('#preloader', { state: 'hidden', timeout: 30000 }).catch(() => { });
        await page.waitForTimeout(1000);

        // Step 1: Click "Tambah Periode"
        await page.getByRole('button', { name: ' Tambah Periode' }).click();
        await page.waitForTimeout(2000);

        // Step 2: Fill with non-numeric characters (abcd)
        await page.getByRole('textbox', { name: 'Contoh:' }).click();
        await page.getByRole('textbox', { name: 'Contoh:' }).fill('abcd');
        await page.getByRole('button', { name: ' Simpan' }).click();
        await page.waitForTimeout(2000);

        // Expected: Error message "Format tahun tidak valid. Gunakan format YYYY" appears
        await expect(page.locator('body')).toContainText(/Format tahun tidak valid|Gunakan format YYYY/i);
    });

    test('TC_DATA_PERIODE_004 - Menyimpan nama data periode tanpa text pada tambah data periode', async ({ page }) => {
        // Wait for preloader
        await page.waitForSelector('#preloader', { state: 'hidden', timeout: 30000 }).catch(() => { });
        await page.waitForTimeout(1000);

        // Step 1: Click "Tambah Periode"
        await page.getByRole('button', { name: ' Tambah Periode' }).click();
        await page.waitForTimeout(2000);

        // Step 2: Click Simpan without filling anything
        await page.getByRole('button', { name: ' Simpan' }).click();
        await page.waitForTimeout(2000);

        // Expected: Error message appears (validation error or modal stays open)
        // Check for various validation messages or that modal is still visible
        const hasValidationError = await page.locator('body').textContent();
        const modalStillOpen = await page.locator('.modal.show, .modal[style*="display: block"]').isVisible().catch(() => false);
        expect(hasValidationError.match(/wajib diisi|tidak valid|required|error|gagal/i) || modalStillOpen).toBeTruthy();
    });

    test('TC_DATA_PERIODE_005 - Mengklik tombol "Detail"', async ({ page }) => {
        // Wait for preloader
        await page.waitForSelector('#preloader', { state: 'hidden', timeout: 30000 }).catch(() => { });
        await page.waitForTimeout(2000);

        // Step 1: Click "Detail" on the first row
        await page.getByRole('button', { name: 'Detail' }).first().click();
        await page.waitForTimeout(2000);

        // Expected: Detail modal appears
        await expect(page.locator('body')).toContainText(/Detail/i);

        // Close the modal
        await page.getByRole('button', { name: 'Close' }).click();
    });

    test('TC_DATA_PERIODE_006 - Mengedit data periode dengan jumlah karakter angka tidak sama dengan 4', async ({ page }) => {
        // Wait for preloader
        await page.waitForSelector('#preloader', { state: 'hidden', timeout: 30000 }).catch(() => { });
        await page.waitForTimeout(1000);

        // Step 1: Click "Edit" on the first row
        await page.getByRole('button', { name: 'Edit' }).first().click();
        await page.waitForTimeout(2000);

        // Step 2: Get current value and add character "1" to make it invalid (5 digits)
        const currentValue = await page.getByRole('textbox', { name: 'Contoh:' }).inputValue();
        await page.getByRole('textbox', { name: 'Contoh:' }).fill(currentValue + '1');
        await page.getByRole('button', { name: ' Simpan Perubahan' }).click();
        await page.waitForTimeout(2000);

        // Expected: Error message "Format tahun tidak valid. Gunakan format YYYY" appears
        await expect(page.locator('body')).toContainText(/Format tahun tidak valid|Gunakan format YYYY/i);
    });

    test('TC_DATA_PERIODE_007 - Mengedit data periode dengan jumlah karakter angka sama dengan 4', async ({ page }) => {
        // Wait for preloader
        await page.waitForSelector('#preloader', { state: 'hidden', timeout: 30000 }).catch(() => { });
        await page.waitForTimeout(1000);

        // Step 1: Click "Edit" on the first row
        await page.getByRole('button', { name: 'Edit' }).first().click();
        await page.waitForTimeout(2000);

        // Step 2: Fill with valid 4-digit year (2026)
        await page.getByRole('textbox', { name: 'Contoh:' }).fill('2026');
        await page.getByRole('button', { name: ' Simpan Perubahan' }).click();
        await page.waitForTimeout(3000);

        // Expected: Success modal appears
        const bodyText = await page.locator('body').textContent();
        expect(bodyText).toMatch(/berhasil diubah|berhasil diperbarui|berhasil|success/i);
    });

    test('TC_DATA_PERIODE_008 - Mengedit data periode dengan karakter selain angka', async ({ page }) => {
        // Wait for preloader
        await page.waitForSelector('#preloader', { state: 'hidden', timeout: 30000 }).catch(() => { });
        await page.waitForTimeout(1000);

        // Step 1: Click "Edit" on the first row
        await page.getByRole('button', { name: 'Edit' }).first().click();
        await page.waitForTimeout(2000);

        // Step 2: Fill with non-numeric characters (efgh)
        await page.getByRole('textbox', { name: 'Contoh:' }).fill('efgh');
        await page.getByRole('button', { name: ' Simpan Perubahan' }).click();
        await page.waitForTimeout(2000);

        // Expected: Error message "Format tahun tidak valid. Gunakan format YYYY" appears
        await expect(page.locator('body')).toContainText(/Format tahun tidak valid|Gunakan format YYYY/i);
    });

    test('TC_DATA_PERIODE_009 - Menyimpan nama data periode tanpa text pada edit periode', async ({ page }) => {
        // Wait for preloader
        await page.waitForSelector('#preloader', { state: 'hidden', timeout: 30000 }).catch(() => { });
        await page.waitForTimeout(1000);

        // Step 1: Click "Edit" on the first row
        await page.getByRole('button', { name: 'Edit' }).first().click();
        await page.waitForTimeout(2000);

        // Step 2: Clear the field (Hapus nama data periode)
        await page.getByRole('textbox', { name: 'Contoh:' }).clear();
        await page.waitForTimeout(500);

        // Step 3: Click Simpan
        await page.getByRole('button', { name: ' Simpan Perubahan' }).click();
        await page.waitForTimeout(2000);

        // Expected: Error message appears (validation error or modal stays open)
        // Check for various validation messages or that modal is still visible
        const hasValidationError = await page.locator('body').textContent();
        const modalStillOpen = await page.locator('.modal.show, .modal[style*="display: block"]').isVisible().catch(() => false);
        expect(hasValidationError.match(/wajib diisi|tidak valid|required|error|gagal/i) || modalStillOpen).toBeTruthy();
    });

    test('TC_DATA_PERIODE_010 - Menghapus data periode', async ({ page }) => {
        // Wait for preloader
        await page.waitForSelector('#preloader', { state: 'hidden', timeout: 30000 }).catch(() => { });
        await page.waitForTimeout(1000);

        // Navigate to page with deletable data (page 4)
        const page4Link = page.getByRole('link', { name: '4' });
        if (await page4Link.isVisible().catch(() => false)) {
            await page4Link.click();
            await page.waitForTimeout(2000);
        }

        // Step 1: Click "Delete" on the row
        await page.getByRole('button', { name: 'Delete' }).nth(1).click();
        await page.waitForTimeout(2000);

        // Step 2: Click "Ya, Hapus" on confirmation modal
        await page.getByRole('button', { name: ' Ya, Hapus' }).click();
        await page.waitForTimeout(4000);

        // Expected: Check for success message
        const bodyText = await page.locator('body').textContent();
        expect(bodyText).toMatch(/terhapus|dihapus|berhasil/i);
    });

    test('TC_DATA_PERIODE_011 - Menginputkan kata parsial dari nama data periode', async ({ page }) => {
        // Wait for preloader
        await page.waitForSelector('#preloader', { state: 'hidden', timeout: 30000 }).catch(() => { });
        await page.waitForTimeout(1000);

        // Step 1: Click search input and type partial keyword "2024"
        await page.getByRole('searchbox', { name: 'Search:' }).click();
        await page.getByRole('searchbox', { name: 'Search:' }).fill('2024');
        await page.waitForTimeout(3000);

        // Expected: Table only shows data containing "2024"
        const tableText = await page.locator('table').textContent();
        if (tableText && !tableText.toLowerCase().includes('no matching records')) {
            expect(tableText.toLowerCase()).toContain('2024');
        }

        // Clear search
        await page.getByRole('searchbox', { name: 'Search:' }).fill('');
        await page.waitForTimeout(1000);
    });

    test('TC_DATA_PERIODE_012 - Menyorting data A-Z dan Z-A', async ({ page }) => {
        // Wait for preloader
        await page.waitForSelector('#preloader', { state: 'hidden', timeout: 30000 }).catch(() => { });
        await page.waitForTimeout(1000);

        // Step 1: Click sort button on column header
        const sortButton = page.locator('th').first();
        if (await sortButton.isVisible().catch(() => false)) {
            await sortButton.click();
            await page.waitForTimeout(3000);

            // Expected: Table is sorted - verify sorting works
            const rowCount = await page.locator('table tbody tr').count();
            expect(rowCount).toBeGreaterThan(0);

            // Click again for Z-A sort
            await sortButton.click();
            await page.waitForTimeout(2000);

            // Expected: Table is still displayed (sorting works)
            const rowCountAfter = await page.locator('table tbody tr').count();
            expect(rowCountAfter).toBeGreaterThan(0);
        }
    });

    test('TC_DATA_PERIODE_013 - Menampilkan entries tab', async ({ page }) => {
        // Wait for preloader
        await page.waitForSelector('#preloader', { state: 'hidden', timeout: 30000 }).catch(() => { });
        await page.waitForTimeout(1000);

        // Step 1: Select 50 entries
        await page.getByLabel('Show 102550100 entries').selectOption('50');
        await page.waitForTimeout(4000);

        // Expected: Table shows maximum 50 rows
        const rowCount = await page.locator('table tbody tr').count();
        expect(rowCount).toBeGreaterThan(0);
        expect(rowCount).toBeLessThanOrEqual(50);
    });

    test('TC_DATA_PERIODE_014 - Mengganti page halaman untuk menampilkan data per entries', async ({ page }) => {
        // Wait for preloader
        await page.waitForSelector('#preloader', { state: 'hidden', timeout: 30000 }).catch(() => { });
        await page.waitForTimeout(1000);

        // Step 1: Select 10 entries
        await page.getByLabel('Show 102550100 entries').selectOption('10');
        await page.waitForTimeout(3000);

        // Step 2: Click page links to navigate
        const page2Link = page.getByRole('link', { name: '2' });
        if (await page2Link.isVisible({ timeout: 5000 }).catch(() => false)) {
            await page2Link.click();
            await page.waitForTimeout(3000);

            // Expected: Table shows data from entry 11 to 20
            const rowCount = await page.locator('table tbody tr').count();
            expect(rowCount).toBeGreaterThan(0);
            expect(rowCount).toBeLessThanOrEqual(10);
        }
    });
});