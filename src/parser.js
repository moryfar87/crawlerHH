const { chromium } = require('playwright');

async function scrapeData() {
    const browser = await chromium.launch({ headless: false });
    const context = await browser.newContext({
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    });
    const page = await context.newPage();

    console.log("Парсинг вакансий для сбора статистики...");
    let vacancies = [];


    for (let i = 0; i < 5; i++) {
        await page.goto(`https://hh.ru/search/vacancy?area=113&page=${i}`);
        try {
            await page.waitForSelector('[data-qa="vacancy-serp__vacancy"]', { timeout: 10000 });
            const pageVacancies = await page.evaluate(() => {
                return Array.from(document.querySelectorAll('[data-qa="vacancy-serp__vacancy"]')).map(el => ({
                    title: el.querySelector('[data-qa="serp-item__title-text"]')?.innerText.trim() || 'Без названия',
                    company: el.querySelector('[data-qa="vacancy-serp__vacancy-employer-text"]')?.innerText.trim() || 'Неизвестно',
                    salary: el.querySelector('[data-qa="vacancy-salary"]')?.innerText.replace(/\s+/g, ' ').trim() || 'Не указана',
                    url: el.querySelector('[data-qa="serp-item__title"]')?.href
                }));
            });
            vacancies.push(...pageVacancies);
            console.log(`Страница ${i}: собрано ${pageVacancies.length} вакансий`);
        } catch (e) { console.warn(`Страница ${i} недоступна`); }
        await page.waitForTimeout(2500);
    }


    const companyStats = {};
    vacancies.forEach(v => {
        companyStats[v.company] = (companyStats[v.company] || 0) + 1;
    });

    const companies = Object.keys(companyStats).map(name => ({
        name: name,
        vacanciesCount: companyStats[name]
    }));

    console.log(`Обработано компаний: ${companies.length}`);

    await browser.close();
    return { companies, vacancies };
}

module.exports = { scrapeData };