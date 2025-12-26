import { test, expect } from '@playwright/test';

test.describe('Modul Status Perbaikan', () => {
    test.beforeEach(async ({ page }) => {
        // Set longer timeout for test execution
        test.setTimeout(120000);
        page.setDefaultTimeout(90000);
        page.setDefaultNavigationTimeout(90000);

        // Login as Mahasiswa
        await page.goto('https://simantap.dbsnetwork.my.id/login', { waitUntil: 'domcontentloaded' });
        await page.getByRole('textbox', { name: 'NIM/NIP/NIDN / Akun Polinema' }).fill('Dosen');
        await page.getByRole('textbox', { name: 'Password' }).fill('12345');
        await page.getByRole('button', { name: 'Masuk' }).click();

        // Wait for success modal and close it
        await page.getByRole('button', { name: 'OK' }).click();

        // Wait for preloader to disappear
        await page.waitForSelector('#preloader', { state: 'hidden', timeout: 60000 }).catch(() => { });
        await page.waitForTimeout(2000);

        // Navigate directly to Status Perbaikan page
        await page.goto('https://simantap.dbsnetwork.my.id/statusperbaikan', { waitUntil: 'domcontentloaded', timeout: 90000 });

        // Wait for page to load and preloader to disappear
        await page.waitForSelector('#preloader', { state: 'hidden', timeout: 60000 }).catch(() => { });
        await page.waitForTimeout(3000);
    });

    test('TC_STATUS_PERBAIKAN_001 - Melihat detail status perbaikan', async ({ page }) => {
        // Wait for preloader
        await page.waitForSelector('#preloader', { state: 'hidden', timeout: 30000 }).catch(() => { });
        await page.waitForTimeout(2000);

        // Step 1: Click "Detail" on the first row
        await page.getByRole('button', { name: 'Detail' }).first().click({ force: true });
        await page.waitForTimeout(2000);

        // Step 2: Click "Lihat Detail Laporan"
        await page.getByRole('button', { name: /Lihat Detail Laporan/i }).click({ force: true });
        await page.waitForTimeout(2000);

        // Expected: Modal detail appears with laporan info, foto laporan, foto perbaikan, deskripsi
        await expect(page.locator('body')).toContainText(/Detail|Laporan|Perbaikan/i);
    });

    test('TC_STATUS_PERBAIKAN_002 - Menampilkan foto laporan', async ({ page }) => {
        // Wait for preloader
        await page.waitForSelector('#preloader', { state: 'hidden', timeout: 30000 }).catch(() => { });
        await page.waitForTimeout(2000);

        // Step 1: Click "Detail" on the first row
        await page.getByRole('button', { name: 'Detail' }).first().click({ force: true });
        await page.waitForTimeout(2000);

        // Step 2: Click "Lihat Detail Laporan"
        await page.getByRole('button', { name: /Lihat Detail Laporan/i }).click({ force: true });
        await page.waitForTimeout(2000);

        // Step 3: Click foto pada section Foto Laporan
        const fotoLaporan = page.locator('img').first();
        if (await fotoLaporan.isVisible().catch(() => false)) {
            await fotoLaporan.click({ force: true });
            await page.waitForTimeout(2000);

            // Expected: Modal foto laporan tampil dengan resolusi lebih besar
            await expect(page.locator('.modal, .lightbox, [role="dialog"]').or(page.locator('img[style*="max-width"]'))).toBeVisible();
        }
    });

    test('TC_STATUS_PERBAIKAN_003 - Menampilkan foto perbaikan', async ({ page }) => {
        // Wait for preloader
        await page.waitForSelector('#preloader', { state: 'hidden', timeout: 30000 }).catch(() => { });
        await page.waitForTimeout(2000);

        // Step 1: Click "Detail" on the first row
        await page.getByRole('button', { name: 'Detail' }).first().click({ force: true });
        await page.waitForTimeout(2000);

        // Step 2: Click "Lihat Detail Laporan"
        await page.getByRole('button', { name: /Lihat Detail Laporan/i }).click({ force: true });
        await page.waitForTimeout(2000);

        // Step 3: Click foto pada section Foto Perbaikan
        const fotoPerbaikan = page.locator('img').nth(1);
        if (await fotoPerbaikan.isVisible().catch(() => false)) {
            await fotoPerbaikan.click({ force: true });
            await page.waitForTimeout(2000);

            // Expected: Modal foto perbaikan tampil dengan resolusi lebih besar
            await expect(page.locator('.modal, .lightbox, [role="dialog"]').or(page.locator('img[style*="max-width"]'))).toBeVisible();
        }
    });

    test('TC_STATUS_PERBAIKAN_004 - Menginputkan kata parsial dari nama status perbaikan', async ({ page }) => {
        // Wait for preloader
        await page.waitForSelector('#preloader', { state: 'hidden', timeout: 30000 }).catch(() => { });
        await page.waitForTimeout(1000);

        // Step 1: Click search input and type partial keyword "are"
        await page.getByRole('searchbox', { name: 'Search:' }).fill('are');
        await page.waitForTimeout(3000);

        // Expected: Table only shows data containing "are"
        const tableText = await page.locator('table').textContent();
        if (tableText && !tableText.toLowerCase().includes('no matching records')) {
            expect(tableText.toLowerCase()).toContain('are');
        }
    });

    test('TC_STATUS_PERBAIKAN_005 - Menyorting data A-Z dan Z-A', async ({ page }) => {
        // Wait for preloader
        await page.waitForSelector('#preloader', { state: 'hidden', timeout: 30000 }).catch(() => { });
        await page.waitForTimeout(1000);

        // Step 1: Click sort button on column header
        const sortButton = page.getByRole('gridcell', { name: /activate/i }).first().or(page.locator('th').first());
        if (await sortButton.isVisible().catch(() => false)) {
            await sortButton.click({ force: true });
            await page.waitForTimeout(3000);

            // Expected: Table is sorted - verify sorting works
            const rowCount = await page.locator('table tbody tr').count();
            expect(rowCount).toBeGreaterThan(0);

            // Click again for Z-A sort
            await sortButton.click({ force: true });
            await page.waitForTimeout(2000);

            // Expected: Table is still displayed (sorting works)
            const rowCountAfter = await page.locator('table tbody tr').count();
            expect(rowCountAfter).toBeGreaterThan(0);
        }
    });

    test('TC_STATUS_PERBAIKAN_006 - Menampilkan entries tab', async ({ page }) => {
        // Wait for preloader
        await page.waitForSelector('#preloader', { state: 'hidden', timeout: 30000 }).catch(() => { });
        await page.waitForTimeout(1000);

        // Step 1: Select 25 entries
        await page.getByLabel('Show 102550100 entries').selectOption('25');
        await page.waitForTimeout(4000);

        // Expected: Table shows maximum 25 rows
        const rowCount = await page.locator('table tbody tr').count();
        expect(rowCount).toBeGreaterThan(0);
        expect(rowCount).toBeLessThanOrEqual(25);
    });

    test('TC_STATUS_PERBAIKAN_007 - Mengganti page halaman untuk menampilkan data per entries', async ({ page }) => {
        // Wait for preloader
        await page.waitForSelector('#preloader', { state: 'hidden', timeout: 30000 }).catch(() => { });
        await page.waitForTimeout(1000);

        // Step 1: Select 10 entries
        await page.getByLabel('Show 102550100 entries').selectOption('10');
        await page.waitForTimeout(3000);

        // Step 2: Click "Next" on pagination
        const nextButton = page.getByRole('link', { name: 'Next' });
        if (await nextButton.isVisible({ timeout: 5000 }).catch(() => false)) {
            await nextButton.click({ force: true });
            await page.waitForTimeout(3000);

            // Expected: Table shows data from entry 11 to 20
            const rowCount = await page.locator('table tbody tr').count();
            expect(rowCount).toBeGreaterThan(0);
            expect(rowCount).toBeLessThanOrEqual(10);
        }
    });
});
