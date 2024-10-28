import fs from 'fs';
import path from 'path';

const dataPath = path.join(__dirname, 'data.json');

// Funkcja do odczytu danych z pliku JSON
export const readData = (): Promise<any> => {
    return new Promise((resolve, reject) => {
        fs.readFile(dataPath, 'utf-8', (err, data) => {
            if (err) {
                return reject(err);
            }
            resolve(JSON.parse(data));
        });
    });
};

// Funkcja do zapisu danych do pliku JSON
export const writeData = (data: any): Promise<void> => {
    return new Promise((resolve, reject) => {
        fs.writeFile(dataPath, JSON.stringify(data, null, 2), (err) => {
            if (err) {
                return reject(err);
            }
            resolve();
        });
    });
};
