import asyncio
from playwright.async_api import async_playwright

async def test_flow(gender):
    async with async_playwright() as p:
        b=await p.chromium.launch(headless=True)
        c=await b.new_context(viewport={"width":392,"height":800})
        pg=await c.new_page()
        errs=[]; pg.on("console", lambda m: errs.append(m.text) if m.type=="error" else None)
        await pg.goto("http://localhost:8080/", wait_until="domcontentloaded")
        await pg.wait_for_timeout(3500)
        for name in ["India","Continue","English","Continue","Skip for now"]:
            try:
                await pg.get_by_text(name, exact=False).first.click(timeout=3000)
                await pg.wait_for_timeout(600)
            except Exception: pass
        await pg.get_by_text("Female" if gender=="female" else "Male", exact=False).first.click(timeout=3000)
        await pg.wait_for_timeout(600)
        try:
            await pg.locator("button").filter(has_text="Fat").first.click(timeout=3000)
        except Exception:
            await pg.locator("button").nth(3).click()
        await pg.wait_for_timeout(1200)
        title = await pg.locator("h1").first.inner_text(timeout=3000)
        alt = await pg.locator("img").first.get_attribute("alt")
        await pg.screenshot(path=f"/tmp/browser/focus/{gender}_focus.png")
        print(gender, "->", title, "img:", alt, "errors:", errs[:3])
        await b.close()

async def main():
    await test_flow("male")
    await test_flow("female")
asyncio.run(main())
