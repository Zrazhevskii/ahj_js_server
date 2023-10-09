const fs = require('fs');
const path = require('path');
const tasksFile = path.join(__dirname, './data/tasks.json');

exports.getData = function() {
    let data;
    
    try {
        data = fs.readFileSync(tasksFile, 'utf-8');        
    } catch (error) {
        console.error('Ошибка чтения файла.');
    };
    return !data || data === '' ? [] : JSON.parse(data);
};

exports.setData = function(data) {
    fs.writeFile(tasksFile, JSON.stringify(data), 'utf8', (err) => {
        if (err) {
            console.error('Ошибка записи в файл:', err);
            return;
        }
        console.log('Данные успешно перезаписаны в JSON файл');
    });
};