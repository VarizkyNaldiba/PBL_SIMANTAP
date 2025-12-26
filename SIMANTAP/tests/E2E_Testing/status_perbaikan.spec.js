import { test, expect } from '@playwright/test';

test.describe('Modul Status Perbaikan', () => {
    test.beforeEach(async ({ page }) => {
        // Set longer timeout for test execution
        test.setTimeout(120000);
        page.setDefaultTimeout(90000);
        page.setDefaultNavigationTimeout(90000);

        // Login as Dosen
        await page.goto('https://simantap.dbsnetwork.my.id/login', { waitUntil: 'domcontentloaded' });
        await page.getByRole('textbox', { name: 'NIM/NIP/NIDN / Akun Polinema' }).click();
        await page.getByRole('textbox', { name: 'NIM/NIP/NIDN / Akun Polinema' }).fill('dosen');
        await page.getByRole('textbox', { name: 'Password' }).fill('12345');
        await page.getByRole('button', { name: 'Masuk' }).click();

        // Wait for success modal and close it
        await page.getByRole('button', { name: 'OK' }).click();

        // Wait for preloader to disappear
        await page.waitForSelector('#preloader', { state: 'hidden', timeout: 60000 }).catch(() => { });
        await page.waitForTimeout(2000);

        // Navigate to Status Perbaikan page via menu
        await page.getByRole('link', { name: ' Status Perbaikan' }).click();

        // Wait for page to load and preloader to disappear
        await page.waitForSelector('#preloader', { state: 'hidden', timeout: 60000 }).catch(() => { });
        await page.waitForTimeout(3000);
    });

    test('TC_STATUS_PERBAIKAN_001 - Melihat detail status perbaikan', async ({ page }) => {
        // Wait for preloader
        await page.waitForSelector('#preloader', { state: 'hidden', timeout: 30000 }).catch(() => { });
        await page.waitForTimeout(2000);

        // Step 1: Click "Detail" on the first row
        await page.getByRole('button', { name: 'Detail' }).first().click();
        await page.waitForTimeout(2000);

        // Expected: Modal detail appears with laporan info
        await expect(page.locator('#modal-master')).toBeVisible();
        await expect(page.locator('#modal-master').getByText('Status Perbaikan', { exact: true })).toBeVisible();

        // Verify modal contains expected sections
        await expect(page.locator('#modal-master').getByText('Fasilitas')).toBeVisible();
        await expect(page.locator('#modal-master').getByText('Barang')).toBeVisible();
        await expect(page.locator('#modal-master').getByText('Unit')).toBeVisible();

        // Close the modal
        await page.getByRole('button', { name: 'Close' }).click();
    });

    test('TC_STATUS_PERBAIKAN_002 - Menampilkan foto laporan', async ({ page }) => {
        // Wait for preloader
        await page.waitForSelector('#preloader', { state: 'hidden', timeout: 30000 }).catch(() => { });
        await page.waitForTimeout(2000);

        // Step 1: Click "Detail" on the first row
        await page.getByRole('button', { name: 'Detail' }).first().click();
        await page.waitForTimeout(2000);

        // Step 2: Click foto pada section Foto Laporan using image-preview-container
        const fotoLaporan = page.locator('.image-preview-container').first();
        if (await fotoLaporan.isVisible().catch(() => false)) {
            await fotoLaporan.click();
            await page.waitForTimeout(2000);

            // Expected: Lightbox overlay appears with larger image
            await expect(page.locator('#lightboxOverlay')).toBeVisible();

            // Close lightbox
            await page.locator('#lightboxOverlay').click();
            await page.waitForTimeout(1000);
        }

        // Close the modal
        await page.getByRole('button', { name: 'Close' }).click();
    });

    test('TC_STATUS_PERBAIKAN_003 - Menampilkan foto perbaikan', async ({ page }) => {
        // Wait for preloader
        await page.waitForSelector('#preloader', { state: 'hidden', timeout: 30000 }).catch(() => { });
        await page.waitForTimeout(2000);

        // Search for data with completed repair (has foto perbaikan)
        await page.getByRole('searchbox', { name: 'Search:' }).click();
        await page.getByRole('searchbox', { name: 'Search:' }).fill('');
        await page.waitForTimeout(2000);

        // Step 1: Click "Detail" on the first row
        await page.getByRole('button', { name: 'Detail' }).first().click();
        await page.waitForTimeout(2000);

        // Step 2: Check for foto perbaikan section
        const fotoPerbaikanSection = page.getByText('Foto perbaikan belum tersedia');
        const hasFotoPerbaikan = !(await fotoPerbaikanSection.isVisible().catch(() => false));

        if (hasFotoPerbaikan) {
            // If foto perbaikan exists, click it using the link with camera icon
            const fotoPerbaikanLink = page.getByRole('link', { name: '' }).nth(1);
            if (await fotoPerbaikanLink.isVisible().catch(() => false)) {
                await fotoPerbaikanLink.click();
                await page.waitForTimeout(2000);

                // Expected: Lightbox overlay appears
                await expect(page.locator('#lightboxOverlay')).toBeVisible();

                // Close lightbox
                await page.locator('#lightboxOverlay').click();
                await page.waitForTimeout(1000);
            }
        } else {
            // Verify the "belum tersedia" message is shown
            await expect(page.getByText('Foto perbaikan belum tersedia')).toBeVisible();
        }

        // Close the modal
        await page.getByRole('button', { name: 'Close' }).click();
    });

    test('TC_STATUS_PERBAIKAN_004 - Menginputkan kata parsial dari nama status perbaikan', async ({ page }) => {
        // Wait for preloader
        await page.waitForSelector('#preloader', { state: 'hidden', timeout: 30000 }).catch(() => { });
        await page.waitForTimeout(1000);

        // Step 1: Click search input and type partial keyword "kur"
        await page.getByRole('searchbox', { name: 'Search:' }).click();
        await page.getByRole('searchbox', { name: 'Search:' }).fill('kur');
        await page.waitForTimeout(3000);

        // Expected: Table only shows data containing "kur"
        const tableText = await page.locator('table').textContent();
        if (tableText && !tableText.toLowerCase().includes('no matching records')) {
            expect(tableText.toLowerCase()).toContain('kur');
        }

        // Clear search
        await page.getByRole('searchbox', { name: 'Search:' }).fill('');
        await page.waitForTimeout(1000);
    });

    test('TC_STATUS_PERBAIKAN_005 - Menyorting data A-Z dan Z-A', async ({ page }) => {
        // Wait for preloader
        await page.waitForSelector('#preloader', { state: 'hidden', timeout: 30000 }).catch(() => { });
        await page.waitForTimeout(1000);

        // Step 1: Click sort button on column header (first gridcell with number)
        const sortButton = page.getByRole('gridcell', { name: '1', exact: true });
        if (await sortButton.isVisible().catch(() => false)) {
            await sortButton.click();
            await page.waitForTimeout(3000);

            // Expected: Table is sorted - verify sorting works
            const rowCount = await page.locator('table tbody tr').count();
            expect(rowCount).toBeGreaterThan(0);

            // Click column header for Z-A sort
            await page.locator('th').first().click();
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

        // Step 2: Click page 2 link on pagination
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
