import * as csv from 'csv-parser';
import * as fs from 'fs';
import * as path from 'path';

// Hàm chuyển đổi file CSV thành file JSON
const csvToJson = () => {
    // Đường dẫn đến file CSV và file JSON
    const csvFilePath = path.join(
        __dirname,
        '..',
        'prisma',
        'csv',
        'permissions.csv',
    );
    const jsonFilePath = path.join(__dirname, '..', 'src', 'permissions.json');

    // Định nghĩa kiểu dữ liệu cho mỗi dòng trong file CSV
    type Row = {
        code: string;
        name: string;
        description?: string;
    };

    // Kết quả sau khi chuyển đổi
    const results: {
        [code: string]: {
            name: string;
            description?: string;
        };
    } = {};

    // Đọc file CSV và chuyển đổi thành file JSON
    fs.createReadStream(csvFilePath)
        .pipe(csv())
        .on('data', ({ code, name, description }: Row) => {
            results[code] = {
                name,
                description,
            };
        })
        .on('end', () => {
            fs.writeFileSync(jsonFilePath, JSON.stringify(results, null, 2));
            console.log('CSV file successfully converted to JSON');
        });
};

csvToJson();
