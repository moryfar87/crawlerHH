const { scrapeData } = require('./src/parser');
const { exportToExcel } = require('./src/exporter');

async function run() {
    console.log('Запуск процесса...');
    try {
        const { companies, vacancies } = await scrapeData();
        console.log(`Всего собрано: компаний - ${companies.length}, вакансий - ${vacancies.length}`);
        await exportToExcel(companies, vacancies);
        console.log('Готово! Файл Top_20_Companies.xlsx создан.');
    } catch (err) {
        console.error('Критическая ошибка:', err);
    }
}

run();