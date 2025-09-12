import express from 'express';
import multer from 'multer';
import path from 'path';
import { IsaacBinaryParser } from '../parser/isaacBinaryParser';
import { IsaacSaveData } from '../types/isaac';

const app = express();
const port = 3000;

// Настройка multer для загрузки файлов
const upload = multer({ 
  dest: 'uploads/',
  fileFilter: (req, file, cb) => {
    if (file.originalname.endsWith('.dat')) {
      cb(null, true);
    } else {
      cb(new Error('Only .dat files are allowed'));
    }
  }
});

// Middleware
app.use(express.json());
app.use(express.static('public'));

// Главная страница
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../../public/index.html'));
});

// API для загрузки и парсинга файла сохранения
app.post('/api/upload-save', upload.single('savefile'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const fs = require('fs');
    const fileBuffer = fs.readFileSync(req.file.path);
    const parser = new IsaacBinaryParser(fileBuffer);
    const saveData = parser.parse();

    if (!saveData) {
      return res.status(400).json({ error: 'Failed to parse save file' });
    }

    // Удаляем временный файл
    fs.unlinkSync(req.file.path);

    res.json({ success: true, data: saveData });
  } catch (error) {
    console.error('Error processing save file:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// API для получения информации о предметах
app.get('/api/items', (req, res) => {
  // Здесь можно добавить базу данных предметов Isaac
  res.json({ message: 'Items endpoint - to be implemented' });
});

// API для получения информации о достижениях
app.get('/api/achievements', (req, res) => {
  // Здесь можно добавить базу данных достижений Isaac
  res.json({ message: 'Achievements endpoint - to be implemented' });
});

// API для отладки - показывает hex-дамп файла
app.post('/api/debug-hex', upload.single('savefile'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const fs = require('fs');
    const fileBuffer = fs.readFileSync(req.file.path);
    const parser = new IsaacBinaryParser(fileBuffer);
    
    const hexDump = parser.getHexDump(0, 512);
    
    // Удаляем временный файл
    fs.unlinkSync(req.file.path);

    res.json({ success: true, hexDump });
  } catch (error) {
    console.error('Error generating hex dump:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
