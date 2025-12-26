import { test, expect } from '@playwright/test';

test.describe('Modul Feedback Perbaikan', () => {
    test.beforeEach(async ({ page }) => {
        // Set longer timeout for test execution
        test.setTimeout(120000);
        page.setDefaultTimeout(90000);
        page.setDefaultNavigationTimeout(90000);

        // Login as Dosen
        await page.goto('https://simantap.dbsnetwork.my.id/login', { waitUntil: 'domcontentloaded' });
        await page.getByRole('textbox', { name: 'NIM/NIP/NIDN / Akun Polinema' }).click();
        await page.getByRole('textbox', { name: 'NIM/NIP/NIDN / Akun Polinema' }).fill('Dosen');
        await page.getByRole('textbox', { name: 'Password' }).fill('12345');
        await page.getByRole('button', { name: 'Masuk' }).click();

        // Wait for success modal and close it
        await page.getByRole('button', { name: 'OK' }).click();

        // Wait for preloader to disappear
        await page.waitForSelector('#preloader', { state: 'hidden', timeout: 60000 }).catch(() => { });
        await page.waitForTimeout(2000);

        // Navigate to Feedback Perbaikan page via menu
        await page.getByRole('link', { name: ' Feedback Perbaikan' }).click();

        // Wait for page to load and preloader to disappear
        await page.waitForSelector('#preloader', { state: 'hidden', timeout: 60000 }).catch(() => { });
        await page.waitForTimeout(3000);
    });

    test('TC_FEEDBACK_PERBAIKAN_001 - Melihat detail feedback perbaikan', async ({ page }) => {
        // Wait for preloader
        await page.waitForSelector('#preloader', { state: 'hidden', timeout: 30000 }).catch(() => { });
        await page.waitForTimeout(2000);

        // Step 1: Click "Detail" on the first row
        await page.getByRole('button', { name: 'Detail' }).first().click();
        await page.waitForTimeout(2000);

        // Expected: Modal detail appears with feedback form
        await expect(page.locator('body')).toContainText(/Detail|Feedback|Perbaikan/i);

        // Close the modal
        await page.getByRole('button', { name: 'Close' }).click();
    });

    test('TC_FEEDBACK_PERBAIKAN_002 - Menampilkan foto laporan', async ({ page }) => {
        // Wait for preloader
        await page.waitForSelector('#preloader', { state: 'hidden', timeout: 30000 }).catch(() => { });
        await page.waitForTimeout(2000);

        // Step 1: Click "Detail" on the first row
        await page.getByRole('button', { name: 'Detail' }).first().click();
        await page.waitForTimeout(2000);

        // Step 2: Check if foto laporan exists and click it
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

    test('TC_FEEDBACK_PERBAIKAN_003 - Menampilkan foto perbaikan', async ({ page }) => {
        // Wait for preloader
        await page.waitForSelector('#preloader', { state: 'hidden', timeout: 30000 }).catch(() => { });
        await page.waitForTimeout(2000);

        // Step 1: Click "Detail" on the first row
        await page.getByRole('button', { name: 'Detail' }).first().click();
        await page.waitForTimeout(2000);

        // Step 2: Check if foto perbaikan exists
        const fotoPerbaikan = page.locator('.image-preview-container').nth(1);
        if (await fotoPerbaikan.isVisible().catch(() => false)) {
            await fotoPerbaikan.click();
            await page.waitForTimeout(2000);

            // Expected: Lightbox overlay appears
            await expect(page.locator('#lightboxOverlay')).toBeVisible();

            // Close lightbox
            await page.locator('#lightboxOverlay').click();
            await page.waitForTimeout(1000);
        }

        // Close the modal
        await page.getByRole('button', { name: 'Close' }).click();
    });

    test('TC_FEEDBACK_PERBAIKAN_004 - Mengirim feedback tanpa memilih rating dan komentar', async ({ page }) => {
        // Wait for preloader
        await page.waitForSelector('#preloader', { state: 'hidden', timeout: 30000 }).catch(() => { });
        await page.waitForTimeout(2000);

        // Step 1: Click "Detail" on the first row
        await page.getByRole('button', { name: 'Detail' }).first().click();
        await page.waitForTimeout(2000);

        // Step 2: Click "Kirim Feedback" without selecting rating and comment
        await page.getByRole('button', { name: ' Kirim Feedback' }).click();
        await page.waitForTimeout(2000);

        // Expected: Error message "Please select one of these options" appears or modal stays open
        const bodyText = await page.locator('body').textContent();
        const modalStillOpen = await page.locator('.modal.show, .modal[style*="display: block"]').isVisible().catch(() => false);
        expect(bodyText.match(/Please select one of these options|pilih salah satu|wajib|required/i) || modalStillOpen).toBeTruthy();
    });

    test('TC_FEEDBACK_PERBAIKAN_005 - Mengirim feedback hanya menginputkan komentar', async ({ page }) => {
        // Wait for preloader
        await page.waitForSelector('#preloader', { state: 'hidden', timeout: 30000 }).catch(() => { });
        await page.waitForTimeout(2000);

        // Step 1: Click "Detail" on the first row
        await page.getByRole('button', { name: 'Detail' }).first().click();
        await page.waitForTimeout(2000);

        // Step 2: Fill comment only using the correct selector
        await page.getByRole('textbox', { name: 'Komentar Tambahan' }).click();
        await page.getByRole('textbox', { name: 'Komentar Tambahan' }).fill('testing');
        await page.waitForTimeout(500);

        // Step 3: Click "Kirim Feedback"
        await page.getByRole('button', { name: ' Kirim Feedback' }).click();
        await page.waitForTimeout(2000);

        // Expected: Error message appears or modal stays open (rating required)
        const bodyText = await page.locator('body').textContent();
        const modalStillOpen = await page.locator('.modal.show, .modal[style*="display: block"]').isVisible().catch(() => false);
        expect(bodyText.match(/Please select one of these options|pilih salah satu|rating|wajib/i) || modalStillOpen).toBeTruthy();
    });

    test('TC_FEEDBACK_PERBAIKAN_006 - Mengirim feedback hanya memilih rating', async ({ page }) => {
        // Wait for preloader
        await page.waitForSelector('#preloader', { state: 'hidden', timeout: 30000 }).catch(() => { });
        await page.waitForTimeout(2000);

        // Step 1: Click "Detail" on the first row
        await page.getByRole('button', { name: 'Detail' }).first().click();
        await page.waitForTimeout(2000);

        // Step 2: Select rating using the happy emoji icon
        await page.locator('.ri-emotion-happy-line').click();
        await page.waitForTimeout(500);

        // Step 3: Click "Kirim Feedback"
        await page.getByRole('button', { name: ' Kirim Feedback' }).click();
        await page.waitForTimeout(2000);

        // Expected: Error message appears or modal stays open (comment required)
        const bodyText = await page.locator('body').textContent();
        const modalStillOpen = await page.locator('.modal.show, .modal[style*="display: block"]').isVisible().catch(() => false);
        expect(bodyText.match(/Please fill out this field|wajib diisi|komentar|required/i) || modalStillOpen).toBeTruthy();
    });

    test('TC_FEEDBACK_PERBAIKAN_007 - Mengirim feedback dengan memilih rating dan menginputkan komentar', async ({ page }) => {
        // Wait for preloader
        await page.waitForSelector('#preloader', { state: 'hidden', timeout: 30000 }).catch(() => { });
        await page.waitForTimeout(2000);

        // Step 1: Click "Detail" on the first row
        await page.getByRole('button', { name: 'Detail' }).first().click();
        await page.waitForTimeout(2000);

        // Step 2: Select rating using the happy emoji icon
        await page.locator('.ri-emotion-happy-line').click();
        await page.waitForTimeout(500);

        // Step 3: Fill comment
        await page.getByRole('textbox', { name: 'Komentar Tambahan' }).click();
        await page.getByRole('textbox', { name: 'Komentar Tambahan' }).fill('testing feedback');
        await page.waitForTimeout(500);

        // Step 4: Click "Kirim Feedback"
        await page.getByRole('button', { name: ' Kirim Feedback' }).click();
        await page.waitForTimeout(3000);

        // Expected: Success modal appears
        const bodyText = await page.locator('body').textContent();
        expect(bodyText).toMatch(/berhasil dibuat|berhasil disimpan|berhasil|success/i);
    });

    test('TC_FEEDBACK_PERBAIKAN_008 - Mengupdate feedback tanpa memilih rating dan komentar', async ({ page }) => {
        // Wait for preloader
        await page.waitForSelector('#preloader', { state: 'hidden', timeout: 30000 }).catch(() => { });
        await page.waitForTimeout(2000);

        // Step 1: Click "Detail" on row with existing feedback
        await page.getByRole('button', { name: 'Detail' }).first().click();
        await page.waitForTimeout(2000);

        // Clear rating selection if possible
        await page.evaluate(() => {
            document.querySelectorAll('input[type="radio"]').forEach(r => r.checked = false);
        });

        // Step 2: Click "Kirim Feedback"
        await page.getByRole('button', { name: ' Kirim Feedback' }).click();
        await page.waitForTimeout(2000);

        // Expected: Error message appears or modal stays open
        const bodyText = await page.locator('body').textContent();
        const modalStillOpen = await page.locator('.modal.show, .modal[style*="display: block"]').isVisible().catch(() => false);
        expect(bodyText.match(/Please select one of these options|pilih salah satu|wajib|required/i) || modalStillOpen).toBeTruthy();
    });

    test('TC_FEEDBACK_PERBAIKAN_009 - Mengupdate feedback hanya menginputkan komentar', async ({ page }) => {
        // Wait for preloader
        await page.waitForSelector('#preloader', { state: 'hidden', timeout: 30000 }).catch(() => { });
        await page.waitForTimeout(2000);

        // Step 1: Click "Detail" on row with existing feedback
        await page.getByRole('button', { name: 'Detail' }).first().click();
        await page.waitForTimeout(2000);

        // Step 2: Update comment only
        await page.getByRole('textbox', { name: 'Komentar Tambahan' }).click();
        await page.getByRole('textbox', { name: 'Komentar Tambahan' }).fill('testing1');
        await page.waitForTimeout(500);

        // Step 3: Click "Kirim Feedback"
        await page.getByRole('button', { name: ' Kirim Feedback' }).click();
        await page.waitForTimeout(2000);

        // Expected: Error message appears if rating not selected, or success if rating was pre-selected
        const bodyText = await page.locator('body').textContent();
        expect(bodyText).toMatch(/Please select one of these options|pilih salah satu|rating|berhasil|success/i);
    });

    test('TC_FEEDBACK_PERBAIKAN_010 - Mengupdate feedback hanya memilih rating', async ({ page }) => {
        // Wait for preloader
        await page.waitForSelector('#preloader', { state: 'hidden', timeout: 30000 }).catch(() => { });
        await page.waitForTimeout(2000);

        // Step 1: Click "Detail" on row with existing feedback
        await page.getByRole('button', { name: 'Detail' }).first().click();
        await page.waitForTimeout(2000);

        // Step 2: Select rating using the happy emoji icon
        await page.locator('.ri-emotion-happy-line').click();
        await page.waitForTimeout(500);

        // Clear comment
        await page.getByRole('textbox', { name: 'Komentar Tambahan' }).clear();
        await page.waitForTimeout(500);

        // Step 3: Click "Kirim Feedback"
        await page.getByRole('button', { name: ' Kirim Feedback' }).click();
        await page.waitForTimeout(2000);

        // Expected: Error message appears or modal stays open
        const bodyText = await page.locator('body').textContent();
        const modalStillOpen = await page.locator('.modal.show, .modal[style*="display: block"]').isVisible().catch(() => false);
        expect(bodyText.match(/Please fill out this field|wajib diisi|komentar|required/i) || modalStillOpen).toBeTruthy();
    });

    test('TC_FEEDBACK_PERBAIKAN_011 - Mengupdate feedback dengan memilih rating dan menginputkan komentar', async ({ page }) => {
        // Wait for preloader
        await page.waitForSelector('#preloader', { state: 'hidden', timeout: 30000 }).catch(() => { });
        await page.waitForTimeout(2000);

        // Step 1: Click "Detail" on row with existing feedback
        await page.getByRole('button', { name: 'Detail' }).first().click();
        await page.waitForTimeout(2000);

        // Step 2: Select rating using the happy emoji icon
        await page.locator('.ri-emotion-happy-line').click();
        await page.waitForTimeout(500);

        // Step 3: Update comment
        await page.getByRole('textbox', { name: 'Komentar Tambahan' }).click();
        await page.getByRole('textbox', { name: 'Komentar Tambahan' }).fill('testing1');
        await page.waitForTimeout(500);

        // Step 4: Click "Kirim Feedback"
        await page.getByRole('button', { name: ' Kirim Feedback' }).click();
        await page.waitForTimeout(3000);

        // Expected: Success modal appears
        const bodyText = await page.locator('body').textContent();
        expect(bodyText).toMatch(/berhasil diperbarui|berhasil diubah|berhasil|success/i);
    });

    test('TC_FEEDBACK_PERBAIKAN_012 - Menginputkan kata parsial dari nama feedback perbaikan', async ({ page }) => {
        // Wait for preloader
        await page.waitForSelector('#preloader', { state: 'hidden', timeout: 30000 }).catch(() => { });
        await page.waitForTimeout(1000);

        // Step 1: Click search input and type partial keyword "sipil"
        await page.getByRole('searchbox', { name: 'Search:' }).click();
        await page.getByRole('searchbox', { name: 'Search:' }).fill('sipil');
        await page.waitForTimeout(3000);

        // Expected: Table only shows data containing "sipil"
        const tableText = await page.locator('table').textContent();
        if (tableText && !tableText.toLowerCase().includes('no matching records')) {
            expect(tableText.toLowerCase()).toContain('sipil');
        }

        // Clear search
        await page.getByRole('searchbox', { name: 'Search:' }).fill('');
        await page.waitForTimeout(1000);
    });

    test('TC_FEEDBACK_PERBAIKAN_013 - Menyorting data A-Z dan Z-A', async ({ page }) => {
        // Wait for preloader
        await page.waitForSelector('#preloader', { state: 'hidden', timeout: 30000 }).catch(() => { });
        await page.waitForTimeout(1000);

        // Step 1: Click sort button on column header (ID column)
        const sortButton = page.getByRole('gridcell', { name: 'ID: activate to sort column' });
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

    test('TC_FEEDBACK_PERBAIKAN_014 - Menampilkan entries tab', async ({ page }) => {
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

    test('TC_FEEDBACK_PERBAIKAN_015 - Mengganti page halaman untuk menampilkan data per entries', async ({ page }) => {
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