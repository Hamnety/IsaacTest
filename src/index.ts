import { IsaacSaveParser } from './saveParser';
import { UIManager } from './ui';

class IsaacSaveAnalyzer {
    private ui: UIManager;
    private fileInput: HTMLInputElement;

    constructor() {
        this.ui = new UIManager();
        this.fileInput = document.getElementById('saveFile') as HTMLInputElement;
        this.setupEventListeners();
    }

    private setupEventListeners(): void {
        this.fileInput.addEventListener('change', (event) => {
            const file = (event.target as HTMLInputElement).files?.[0];
            if (file) {
                this.handleFileUpload(file);
            }
        });
    }

    private async handleFileUpload(file: File): Promise<void> {
        try {
            this.ui.showLoading();

            // Проверяем, что это файл .dat
            if (!file.name.endsWith('.dat')) {
                throw new Error('Пожалуйста, выберите файл с расширением .dat');
            }

            // Читаем файл как ArrayBuffer
            const arrayBuffer = await this.readFileAsArrayBuffer(file);
            
            // Парсим файл сохранения
            const parser = new IsaacSaveParser(arrayBuffer);
            const saveData = parser.parse();

            // Отображаем данные
            this.ui.displaySaveData(saveData);

        } catch (error) {
            console.error('Ошибка при обработке файла:', error);
            this.ui.showError(error instanceof Error ? error.message : 'Произошла неизвестная ошибка');
        }
    }

    private readFileAsArrayBuffer(file: File): Promise<ArrayBuffer> {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (event) => {
                if (event.target?.result instanceof ArrayBuffer) {
                    resolve(event.target.result);
                } else {
                    reject(new Error('Не удалось прочитать файл'));
                }
            };
            reader.onerror = () => reject(new Error('Ошибка при чтении файла'));
            reader.readAsArrayBuffer(file);
        });
    }
}

// Инициализация приложения
document.addEventListener('DOMContentLoaded', () => {
    new IsaacSaveAnalyzer();
});
