import { test, expect } from '@playwright/test'

test.describe('Home Page', () => {
  test('renders hero title and subtitle', async ({ page }) => {
    await page.goto('/')
    await expect(page.getByRole('heading', { name: '心脏解剖互动教学' })).toBeVisible()
    await expect(page.getByText('直观学习心脏各部位功能及血液循环过程')).toBeVisible()
  })

  test('navigates to learn page', async ({ page }) => {
    await page.goto('/')
    await page.getByText('进入学习').click()
    await expect(page).toHaveURL(/\/learn/)
  })

  test('shows coming soon badge on quiz card', async ({ page }) => {
    await page.goto('/')
    await expect(page.getByText('即将推出')).toBeVisible()
  })
})

test.describe('Learn Page', () => {
  test('renders 3D canvas', async ({ page }) => {
    await page.goto('/learn')
    await expect(page.locator('canvas')).toBeVisible({ timeout: 15000 })
  })

  test('renders toolbar with navigation buttons', async ({ page }) => {
    await page.goto('/learn')
    await expect(page.getByText('体循环')).toBeVisible()
    await expect(page.getByText('肺循环')).toBeVisible()
    await expect(page.getByText('导览')).toBeVisible()
    await expect(page.getByText('重置')).toBeVisible()
  })

  test('shows hint bar with default message', async ({ page }) => {
    await page.goto('/learn')
    await expect(page.getByText(/拖拽旋转/)).toBeVisible()
  })

  test('navigates back to home', async ({ page }) => {
    await page.goto('/learn')
    await page.getByLabel('返回首页').click()
    await expect(page).toHaveURL(/\/$/)
  })
})
