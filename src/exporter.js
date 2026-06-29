const ExcelJS = require('exceljs');

async function exportToExcel(companies, vacancies) {
    const workbook = new ExcelJS.Workbook();
    const top20 = companies.sort((a, b) => b.vacanciesCount - a.vacanciesCount).slice(0, 20);

    const sheet = workbook.addWorksheet('Топ-20 компаний');
    sheet.columns = [{ header: 'Компания', key: 'name', width: 70 }, { header: 'Вакансий', key: 'vacanciesCount', width: 10 }];
    top20.forEach(c => sheet.addRow(c));

    const vSheet = workbook.addWorksheet('Вакансии топ-20');
    vSheet.columns = [
        { header: 'Вакансия', key: 'title', width: 70},
        { header: 'Компания', key: 'company', width: 30},
        { header: 'Зарплата', key: 'salary', width: 25 },
        { header: 'Ссылка', key: 'url', width: 30 }
    ];

    vSheet.columns.forEach(column => {
        column.width = 25;
    });

    const topNames = top20.map(c => c.name.toLowerCase());
    vacancies.filter(v => topNames.includes(v.company.toLowerCase())).forEach(v => vSheet.addRow(v));

    await workbook.xlsx.writeFile('Top_20_Companies.xlsx');
}

module.exports = { exportToExcel };