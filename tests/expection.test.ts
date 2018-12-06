import { forDuration } from '../src/forDuration'

describe('scheduler', () => {
    beforeAll(async () => {
        await page.goto('http://localhost:56788')
    })

    it('should merge read & write', async () => {
        await page.click('body')
        await forDuration(100)
        const body = await page.$('body')
        const text = await page.evaluate(b => b.textContent, body)
        expect(text).toContain(
            '1w1 2w1 3w1 1r1 2r1 3r1 1w2 2w2 3w2 1w3 2w3 3w3 f 1r2 2r2 3r2 1r3 2r3 3r3',
        )
        expect(text).toContain(' f 1w4 2w4 3w4')
        // FIXME
    })
})
