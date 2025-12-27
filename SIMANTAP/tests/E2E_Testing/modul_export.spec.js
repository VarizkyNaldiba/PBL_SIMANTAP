import { test, expect } from '@playwright/test';

test.describe('Admin - Modul Export Laporan', () => {

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

    test('generate laporan - Tempat A-Z, Semua Periode, Semua Status', async ({ page }) => {
        // Pilih Tempat (A-Z)
        const sortDropdown = page.locator('select').first();
        await sortDropdown.selectOption({ label: 'Tempat (A-Z)' });

        // Pilih Semua Periode
        const yearDropdown = page.locator('select').nth(1);
        await yearDropdown.selectOption({ label: 'Semua Periode' });

        // Pilih Semua Status
        const statusDropdown = page.locator('select').nth(2);
        await statusDropdown.selectOption({ label: 'Semua Status' });

        // Klik Buat Laporan
        await page.locator('button:has-text("Buat Laporan")').click();
        await page.waitForTimeout(2000);
    });

    test('generate laporan - Tempat A-Z, 2025, Semua Status', async ({ page }) => {
        // Pilih Tempat (A-Z)
        const sortDropdown = page.locator('select').first();
        await sortDropdown.selectOption({ label: 'Tempat (A-Z)' });

        // Pilih 2025
        const yearDropdown = page.locator('select').nth(1);
        await yearDropdown.selectOption({ label: '2025' });

        // Pilih Semua Status
        const statusDropdown = page.locator('select').nth(2);
        await statusDropdown.selectOption({ label: 'Semua Status' });

        // Klik Buat Laporan
        await page.locator('button:has-text("Buat Laporan")').click();
        await page.waitForTimeout(2000);
    });

    test('generate laporan - Tanggal Terbaru, 2025, Semua Status', async ({ page }) => {
        // Pilih Tanggal Terbaru (default)
        const sortDropdown = page.locator('select').first();
        await sortDropdown.selectOption({ label: 'Tanggal Terbaru' });

        // Pilih 2025
        const yearDropdown = page.locator('select').nth(1);
        await yearDropdown.selectOption({ label: '2025' });

        // Pilih Semua Status
        const statusDropdown = page.locator('select').nth(2);
        await statusDropdown.selectOption({ label: 'Semua Status' });

        // Klik Buat Laporan
        await page.locator('button:has-text("Buat Laporan")').click();
        await page.waitForTimeout(2000);
    });

    test('generate laporan - Tanggal Terlama, 2025, Semua Status', async ({ page }) => {
        // Pilih Tanggal Terlama
        const sortDropdown = page.locator('select').first();
        await sortDropdown.selectOption({ label: 'Tanggal Terlama' });

        // Pilih 2025
        const yearDropdown = page.locator('select').nth(1);
        await yearDropdown.selectOption({ label: '2025' });

        // Pilih Semua Status
        const statusDropdown = page.locator('select').nth(2);
        await statusDropdown.selectOption({ label: 'Semua Status' });

        // Klik Buat Laporan
        await page.locator('button:has-text("Buat Laporan")').click();
        await page.waitForTimeout(2000);
    });

    test('generate laporan - Tanggal Terbaru, Semua Periode, Semua Status', async ({ page }) => {
        // Pilih Tanggal Terbaru
        const sortDropdown = page.locator('select').first();
        await sortDropdown.selectOption({ label: 'Tanggal Terbaru' });

        // Pilih Semua Periode
        const yearDropdown = page.locator('select').nth(1);
        await yearDropdown.selectOption({ label: 'Semua Periode' });

        // Pilih Semua Status
        const statusDropdown = page.locator('select').nth(2);
        await statusDropdown.selectOption({ label: 'Semua Status' });

        // Klik Buat Laporan
        await page.locator('button:has-text("Buat Laporan")').click();
        await page.waitForTimeout(2000);
    });

    test('verifikasi semua dropdown dapat diakses', async ({ page }) => {
        // Verifikasi dropdown pertama (Sort)
        const sortDropdown = page.locator('select').first();
        await expect(sortDropdown).toBeVisible();
        
        // Verifikasi dropdown kedua (Year/Period)
        const yearDropdown = page.locator('select').nth(1);
        await expect(yearDropdown).toBeVisible();
        
        // Verifikasi dropdown ketiga (Status)
        const statusDropdown = page.locator('select').nth(2);
        await expect(statusDropdown).toBeVisible();
        
        // Verifikasi tombol Buat Laporan
        await expect(page.locator('button:has-text("Buat Laporan")')).toBeVisible();
    });
});

test.describe('Admin - Modul Export Laporann', () => {

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

    // Test chart download di-skip karena Admin tidak memiliki chart di dashboard
    test('download chart data laporan - PNG', async ({ page }) => {
        // Pastikan di dashboard
        await expect(page.getByText('Data Laporan', { exact: true })).toBeVisible();

        // Klik menu (icon garis 3) pada chart Data Laporan
        const chartContainer = page.locator('.card:has-text("Data Laporan")');
        // Coba beberapa selector untuk menu icon
        const menuButton = chartContainer.locator('.apexcharts-menu-icon, button.apexcharts-menu, [title="Menu"], svg.apexcharts-menu').first();
        await menuButton.click({ force: true });
        await page.waitForTimeout(500);

        // Klik Download PNG dalam scope chart data Laporan
        await chartContainer.locator('text=Download PNG').click({ force: true });
        await page.waitForTimeout(1000);
    });

    test('download chart data laporan - SVG', async ({ page }) => {
        // Pastikan di dashboard
        await expect(page.getByText('Data Laporan', { exact: true })).toBeVisible();

        // Klik menu (icon garis 3) pada chart Data Laporan
        const chartContainer = page.locator('.card:has-text("Data Laporan")');
        const menuButton = chartContainer.locator('.apexcharts-menu-icon, button.apexcharts-menu, [title="Menu"], svg.apexcharts-menu').first();
        await menuButton.click({ force: true });
        await page.waitForTimeout(500);

        // Klik Download SVG dalam scope chart Data Laporan
        await chartContainer.locator('text=Download SVG').click({ force: true });
        await page.waitForTimeout(1000);
    });

    test('download chart data laporan - CSV', async ({ page }) => {
        // Pastikan di dashboard
        await expect(page.getByText('Data Laporan', { exact: true })).toBeVisible();

        // Klik menu (icon garis 3) pada chart Data Laporan
        const chartContainer = page.locator('.card:has-text("Data Laporan")');
        const menuButton = chartContainer.locator('.apexcharts-menu-icon, button.apexcharts-menu, [title="Menu"], svg.apexcharts-menu').first();
        await menuButton.click({ force: true });
        await page.waitForTimeout(500);

        // Klik Download CSV dalam scope chart Data Laporan
        await chartContainer.locator('text=Download CSV').click({ force: true });
        await page.waitForTimeout(1000);
    });

    test('verifikasi chart data laporan dapat diakses', async ({ page }) => {
        // Verifikasi chart Data Laporan terlihat
        await expect(page.getByText('Data Laporan', { exact: true })).toBeVisible();
        
        // Verifikasi chart memiliki data/visualisasi - pilih card yang ada apexcharts
        const chartContainer = page.locator('.card:has(.apexcharts-canvas):has-text("Data Laporan")').first();
        await expect(chartContainer).toBeVisible();
        
        // Verifikasi menu icon tersedia
        const menuButton = chartContainer.locator('.apexcharts-menu-icon, button.apexcharts-menu, [title="Menu"], svg.apexcharts-menu').first();
        await expect(menuButton).toBeVisible();
    });

    test('download chart data perbaikan - PNG', async ({ page }) => {
        // Pastikan di dashboard
        await expect(page.getByText('Data Perbaikan')).toBeVisible();

        // Klik menu (icon garis 3) pada chart Data Perbaikan
        const chartContainer = page.locator('.card:has-text("Data Perbaikan")');
        // Coba beberapa selector untuk menu icon
        const menuButton = chartContainer.locator('.apexcharts-menu-icon, button.apexcharts-menu, [title="Menu"], svg.apexcharts-menu').first();
        await menuButton.click({ force: true });
        await page.waitForTimeout(500);

        // Klik Download PNG dalam scope chart data Perbaikan
        await chartContainer.locator('text=Download PNG').click({ force: true });
        await page.waitForTimeout(1000);
    });

    test('download chart data perbaikan - SVG', async ({ page }) => {
        // Pastikan di dashboard
        await expect(page.getByText('Data Perbaikan')).toBeVisible();

        // Klik menu (icon garis 3) pada chart Data Perbaikan
        const chartContainer = page.locator('.card:has-text("Data Perbaikan")');
        const menuButton = chartContainer.locator('.apexcharts-menu-icon, button.apexcharts-menu, [title="Menu"], svg.apexcharts-menu').first();
        await menuButton.click({ force: true });
        await page.waitForTimeout(500);

        // Klik Download SVG dalam scope chart Data Perbaikan
        await chartContainer.locator('text=Download SVG').click({ force: true });
        await page.waitForTimeout(1000);
    });

    test('download chart data perbaikan - CSV', async ({ page }) => {
        // Pastikan di dashboard
        await expect(page.getByText('Data Perbaikan')).toBeVisible();

        // Klik menu (icon garis 3) pada chart Data Perbaikan
        const chartContainer = page.locator('.card:has-text("Data Perbaikan")');
        const menuButton = chartContainer.locator('.apexcharts-menu-icon, button.apexcharts-menu, [title="Menu"], svg.apexcharts-menu').first();
        await menuButton.click({ force: true });
        await page.waitForTimeout(500);

        // Klik Download CSV dalam scope chart Data Perbaikan
        await chartContainer.locator('text=Download CSV').click({ force: true });
        await page.waitForTimeout(1000);
    });

    test('verifikasi chart data perbaikan dapat diakses', async ({ page }) => {
        // Verifikasi chart Data Perbaikan terlihat
        await expect(page.getByText('Data Perbaikan')).toBeVisible();
        
        // Verifikasi chart memiliki data/visualisasi
        const chartContainer = page.locator('.card:has-text("Data Perbaikan")');
        await expect(chartContainer).toBeVisible();
        
        // Verifikasi menu icon tersedia
        const menuButton = chartContainer.locator('.apexcharts-menu-icon, button.apexcharts-menu, [title="Menu"], svg.apexcharts-menu').first();
        await expect(menuButton).toBeVisible();
    });

});

test.describe('Sarpras - Modul Export Laporan', () => {

    test.beforeEach(async ({ page }) => {
        await page.goto('https://simantap.dbsnetwork.my.id/login', {
            waitUntil: 'domcontentloaded',
            timeout: 60000
        });

        await page.getByPlaceholder('NIM/NIP/NIDN / Akun Polinema').fill('sarpras1');
        await page.getByPlaceholder('Password').fill('password');
        await page.getByRole('button', { name: 'Masuk' }).click();

        // Tunggu popup login berhasil
        await expect(page.locator('.swal2-popup')).toBeVisible({ timeout: 10000 });
        await expect(page.locator('.swal2-title')).toHaveText(/Berhasil/);
        // Klik OK pada popup
        await page.getByRole('button', { name: 'OK' }).click();

        // Pastikan sudah masuk dashboard
        await expect(page).toHaveURL(/dashboard/, { timeout: 50000 });
    });

    test('download chart data perbaikan - PNG', async ({ page }) => {
        // Pastikan di dashboard
        await expect(page.getByText('Data Perbaikan')).toBeVisible();

        // Klik menu (icon garis 3) pada chart Data Perbaikan
        const chartContainer = page.locator('.card:has-text("Data Perbaikan")');
        // Coba beberapa selector untuk menu icon
        const menuButton = chartContainer.locator('.apexcharts-menu-icon, button.apexcharts-menu, [title="Menu"], svg.apexcharts-menu').first();
        await menuButton.click({ force: true });
        await page.waitForTimeout(500);

        // Klik Download PNG dalam scope chart Data Perbaikan
        await chartContainer.locator('text=Download PNG').click({ force: true });
        await page.waitForTimeout(1000);
    });

    test('download chart data perbaikan - SVG', async ({ page }) => {
        // Pastikan di dashboard
        await expect(page.getByText('Data Perbaikan')).toBeVisible();

        // Klik menu (icon garis 3) pada chart Data Perbaikan
        const chartContainer = page.locator('.card:has-text("Data Perbaikan")');
        const menuButton = chartContainer.locator('.apexcharts-menu-icon, button.apexcharts-menu, [title="Menu"], svg.apexcharts-menu').first();
        await menuButton.click({ force: true });
        await page.waitForTimeout(500);

        // Klik Download SVG dalam scope chart Data Perbaikan
        await chartContainer.locator('text=Download SVG').click({ force: true });
        await page.waitForTimeout(1000);
    });

    test('download chart data perbaikan - CSV', async ({ page }) => {
        // Pastikan di dashboard
        await expect(page.getByText('Data Perbaikan')).toBeVisible();

        // Klik menu (icon garis 3) pada chart Data Perbaikan
        const chartContainer = page.locator('.card:has-text("Data Perbaikan")');
        const menuButton = chartContainer.locator('.apexcharts-menu-icon, button.apexcharts-menu, [title="Menu"], svg.apexcharts-menu').first();
        await menuButton.click({ force: true });
        await page.waitForTimeout(500);

        // Klik Download CSV dalam scope chart Data Perbaikan
        await chartContainer.locator('text=Download CSV').click({ force: true });
        await page.waitForTimeout(1000);
    });

    test('verifikasi chart data perbaikan dapat diakses', async ({ page }) => {
        // Verifikasi chart Data Perbaikan terlihat
        await expect(page.getByText('Data Perbaikan')).toBeVisible();
        
        // Verifikasi chart memiliki data/visualisasi
        const chartContainer = page.locator('.card:has-text("Data Perbaikan")');
        await expect(chartContainer).toBeVisible();
        
        // Verifikasi menu icon tersedia
        const menuButton = chartContainer.locator('.apexcharts-menu-icon, button.apexcharts-menu, [title="Menu"], svg.apexcharts-menu').first();
        await expect(menuButton).toBeVisible();
    });

    test('download chart data laporan - PNG', async ({ page }) => {
        // Pastikan di dashboard
        await expect(page.getByText('Data Laporan')).toBeVisible();

        // Klik menu (icon garis 3) pada chart Data Laporan
        const chartContainer = page.locator('.card:has-text("Data Laporan")');
        // Coba beberapa selector untuk menu icon
        const menuButton = chartContainer.locator('.apexcharts-menu-icon, button.apexcharts-menu, [title="Menu"], svg.apexcharts-menu').first();
        await menuButton.click({ force: true });
        await page.waitForTimeout(500);

        // Klik Download PNG dalam scope chart Data Perbaikan
        await chartContainer.locator('text=Download PNG').click({ force: true });
        await page.waitForTimeout(1000);
    });

    test('download chart data laporan - SVG', async ({ page }) => {
        // Pastikan di dashboard
        await expect(page.getByText('Data Laporan')).toBeVisible();

        // Klik menu (icon garis 3) pada chart Data Laporan
        const chartContainer = page.locator('.card:has-text("Data Laporan")');
        const menuButton = chartContainer.locator('.apexcharts-menu-icon, button.apexcharts-menu, [title="Menu"], svg.apexcharts-menu').first();
        await menuButton.click({ force: true });
        await page.waitForTimeout(500);

        // Klik Download SVG dalam scope chart Data Laporan
        await chartContainer.locator('text=Download SVG').click({ force: true });
        await page.waitForTimeout(1000);
    });

    test('download chart data laporan - CSV', async ({ page }) => {
        // Pastikan di dashboard
        await expect(page.getByText('Data Laporan')).toBeVisible();

        // Klik menu (icon garis 3) pada chart Data Laporan
        const chartContainer = page.locator('.card:has-text("Data Laporan")');
        const menuButton = chartContainer.locator('.apexcharts-menu-icon, button.apexcharts-menu, [title="Menu"], svg.apexcharts-menu').first();
        await menuButton.click({ force: true });
        await page.waitForTimeout(500);

        // Klik Download CSV dalam scope chart Data Laporan
        await chartContainer.locator('text=Download CSV').click({ force: true });
        await page.waitForTimeout(1000);
    });

    test('verifikasi chart data laporan dapat diakses', async ({ page }) => {
        // Verifikasi chart Data Laporan terlihat
        await expect(page.getByText('Data Laporan')).toBeVisible();
        
        // Verifikasi chart memiliki data/visualisasi
        const chartContainer = page.locator('.card:has-text("Data Laporan")');
        await expect(chartContainer).toBeVisible();
        
        // Verifikasi menu icon tersedia
        const menuButton = chartContainer.locator('.apexcharts-menu-icon, button.apexcharts-menu, [title="Menu"], svg.apexcharts-menu').first();
        await expect(menuButton).toBeVisible();
    });
});

test.describe('Dosen - Modul Export Laporan', () => {

    test.beforeEach(async ({ page }) => {
        await page.goto('https://simantap.dbsnetwork.my.id/login', {
            waitUntil: 'domcontentloaded',
            timeout: 60000
        });

        await page.getByPlaceholder('NIM/NIP/NIDN / Akun Polinema').fill('dosen');
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

    test('download chart status laporan anda - PNG', async ({ page }) => {
        // Pastikan di dashboard
        await expect(page.getByText('Status Laporan Anda')).toBeVisible();

        // Klik menu (icon garis 3) pada chart Data Perbaikan
        const chartContainer = page.locator('.card:has-text("Status Laporan Anda")');
        // Coba beberapa selector untuk menu icon
        const menuButton = chartContainer.locator('.apexcharts-menu-icon, button.apexcharts-menu, [title="Menu"], svg.apexcharts-menu').first();
        await menuButton.click({ force: true });
        await page.waitForTimeout(500);

        // Klik Download PNG dalam scope chart Status Laporan Anda
        await chartContainer.locator('text=Download PNG').click({ force: true });
        await page.waitForTimeout(1000);
    });

    test('download chart status laporan anda - SVG', async ({ page }) => {
        // Pastikan di dashboard
        await expect(page.getByText('Status Laporan Anda')).toBeVisible();

        // Klik menu (icon garis 3) pada chart Status Laporan Anda
        const chartContainer = page.locator('.card:has-text("Status Laporan Anda")');
        const menuButton = chartContainer.locator('.apexcharts-menu-icon, button.apexcharts-menu, [title="Menu"], svg.apexcharts-menu').first();
        await menuButton.click({ force: true });
        await page.waitForTimeout(500);

        // Klik Download SVG dalam scope chart Status Laporan Anda
        await chartContainer.locator('text=Download SVG').click({ force: true });
        await page.waitForTimeout(1000);
    });

    test('download chart status laporan anda - CSV', async ({ page }) => {
        // Pastikan di dashboard
        await expect(page.getByText('Status Laporan Anda')).toBeVisible();

        // Klik menu (icon garis 3) pada chart Status Laporan Anda
        const chartContainer = page.locator('.card:has-text("Status Laporan Anda")');
        const menuButton = chartContainer.locator('.apexcharts-menu-icon, button.apexcharts-menu, [title="Menu"], svg.apexcharts-menu').first();
        await menuButton.click({ force: true });
        await page.waitForTimeout(500);

        // Klik Download CSV dalam scope chart Status Laporan Anda
        await chartContainer.locator('text=Download CSV').click({ force: true });
        await page.waitForTimeout(1000);
    });

    test('verifikasi chart status laporan anda dapat diakses', async ({ page }) => {
        // Verifikasi chart Status Laporan Anda terlihat
        await expect(page.getByText('Status Laporan Anda')).toBeVisible();
        
        // Verifikasi chart memiliki data/visualisasi
        const chartContainer = page.locator('.card:has-text("Status Laporan Anda")');
        await expect(chartContainer).toBeVisible();
        
        // Verifikasi menu icon tersedia
        const menuButton = chartContainer.locator('.apexcharts-menu-icon, button.apexcharts-menu, [title="Menu"], svg.apexcharts-menu').first();
        await expect(menuButton).toBeVisible();
    });

    test('download chart status perbaikan anda - PNG', async ({ page }) => {
        // Pastikan di dashboard
        await expect(page.getByText('Status Perbaikan Anda')).toBeVisible();

        // Klik menu (icon garis 3) pada chart Status Perbaikan Anda
        const chartContainer = page.locator('.card:has-text("Status Perbaikan Anda")');
        // Coba beberapa selector untuk menu icon
        const menuButton = chartContainer.locator('.apexcharts-menu-icon, button.apexcharts-menu, [title="Menu"], svg.apexcharts-menu').first();
        await menuButton.click({ force: true });
        await page.waitForTimeout(500);

        // Klik Download PNG dalam scope chart Status Perbaikan Anda
        await chartContainer.locator('text=Download PNG').click({ force: true });
        await page.waitForTimeout(1000);
    });

    test('download chart status perbaikan anda - SVG', async ({ page }) => {
        // Pastikan di dashboard
        await expect(page.getByText('Status Perbaikan Anda')).toBeVisible();

        // Klik menu (icon garis 3) pada chart Status Perbaikan Anda
        const chartContainer = page.locator('.card:has-text("Status Perbaikan Anda")');
        const menuButton = chartContainer.locator('.apexcharts-menu-icon, button.apexcharts-menu, [title="Menu"], svg.apexcharts-menu').first();
        await menuButton.click({ force: true });
        await page.waitForTimeout(500);

        // Klik Download SVG dalam scope chart Status Perbaikan Anda
        await chartContainer.locator('text=Download SVG').click({ force: true });
        await page.waitForTimeout(1000);
    });

    test('download chart status perbaikan anda - CSV', async ({ page }) => {
        // Pastikan di dashboard
        await expect(page.getByText('Status Perbaikan Anda')).toBeVisible();

        // Klik menu (icon garis 3) pada chart Status Perbaikan Anda
        const chartContainer = page.locator('.card:has-text("Status Perbaikan Anda")');
        const menuButton = chartContainer.locator('.apexcharts-menu-icon, button.apexcharts-menu, [title="Menu"], svg.apexcharts-menu').first();
        await menuButton.click({ force: true });
        await page.waitForTimeout(500);

        // Klik Download CSV dalam scope chart Status Perbaikan Anda
        await chartContainer.locator('text=Download CSV').click({ force: true });
        await page.waitForTimeout(1000);
    });

    test('verifikasi chart status perbaikan anda dapat diakses', async ({ page }) => {
        // Verifikasi chart Status Perbaikan Anda terlihat
        await expect(page.getByText('Status Perbaikan Anda')).toBeVisible();
        
        // Verifikasi chart memiliki data/visualisasi
        const chartContainer = page.locator('.card:has-text("Status Perbaikan Anda")');
        await expect(chartContainer).toBeVisible();
        
        // Verifikasi menu icon tersedia
        const menuButton = chartContainer.locator('.apexcharts-menu-icon, button.apexcharts-menu, [title="Menu"], svg.apexcharts-menu').first();
        await expect(menuButton).toBeVisible();
    });
});

test.describe('Teknisi - Modul Export Laporan', () => {

    test.beforeEach(async ({ page }) => {
        await page.goto('https://simantap.dbsnetwork.my.id/login', {
            waitUntil: 'domcontentloaded',
            timeout: 60000
        });

        await page.getByPlaceholder('NIM/NIP/NIDN / Akun Polinema').fill('teknisi1');
        await page.getByPlaceholder('Password').fill('password');
        await page.getByRole('button', { name: 'Masuk' }).click();

        // Tunggu popup login berhasil
        await expect(page.locator('.swal2-popup')).toBeVisible({ timeout: 10000 });
        await expect(page.locator('.swal2-title')).toHaveText(/Berhasil/);
        // Klik OK pada popup
        await page.getByRole('button', { name: 'OK' }).click();

        // Pastikan sudah masuk dashboard
        await expect(page).toHaveURL(/dashboard/, { timeout: 50000 });
    });

    test('download chart status perbaikan anda - PNG', async ({ page }) => {
        // Pastikan di dashboard
        await expect(page.getByText('Status Perbaikan Anda')).toBeVisible();

        // Klik menu (icon garis 3) pada chart Data Perbaikan
        const chartContainer = page.locator('.card:has-text("Status Perbaikan Anda")');
        // Coba beberapa selector untuk menu icon
        const menuButton = chartContainer.locator('.apexcharts-menu-icon, button.apexcharts-menu, [title="Menu"], svg.apexcharts-menu').first();
        await menuButton.click({ force: true });
        await page.waitForTimeout(500);

        // Klik Download PNG dalam scope chart Status Laporan Anda
        await chartContainer.locator('text=Download PNG').click({ force: true });
        await page.waitForTimeout(1000);
    });

    test('download chart status perbaikan anda - SVG', async ({ page }) => {
        // Pastikan di dashboard
        await expect(page.getByText('Status Perbaikan Anda')).toBeVisible();

        // Klik menu (icon garis 3) pada chart Status Perbaikan Anda
        const chartContainer = page.locator('.card:has-text("Status Perbaikan Anda")');
        const menuButton = chartContainer.locator('.apexcharts-menu-icon, button.apexcharts-menu, [title="Menu"], svg.apexcharts-menu').first();
        await menuButton.click({ force: true });
        await page.waitForTimeout(500);

        // Klik Download SVG dalam scope chart Status Perbaikan Anda
        await chartContainer.locator('text=Download SVG').click({ force: true });
        await page.waitForTimeout(1000);
    });

    test('download chart status perbaikan anda - CSV', async ({ page }) => {
        // Pastikan di dashboard
        await expect(page.getByText('Status Perbaikan Anda')).toBeVisible();

        // Klik menu (icon garis 3) pada chart Status Perbaikan Anda
        const chartContainer = page.locator('.card:has-text("Status Perbaikan Anda")');
        const menuButton = chartContainer.locator('.apexcharts-menu-icon, button.apexcharts-menu, [title="Menu"], svg.apexcharts-menu').first();
        await menuButton.click({ force: true });
        await page.waitForTimeout(500);

        // Klik Download CSV dalam scope chart Status Perbaikan Anda
        await chartContainer.locator('text=Download CSV').click({ force: true });
        await page.waitForTimeout(1000);
    });

    test('verifikasi chart status perbaikan anda dapat diakses', async ({ page }) => {
        // Verifikasi chart Status Perbaikan Anda terlihat
        await expect(page.getByText('Status Perbaikan Anda')).toBeVisible();
        
        // Verifikasi chart memiliki data/visualisasi
        const chartContainer = page.locator('.card:has-text("Status Perbaikan Anda")');
        await expect(chartContainer).toBeVisible();
        
        // Verifikasi menu icon tersedia
        const menuButton = chartContainer.locator('.apexcharts-menu-icon, button.apexcharts-menu, [title="Menu"], svg.apexcharts-menu').first();
        await expect(menuButton).toBeVisible();
    });
});