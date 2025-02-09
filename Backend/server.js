require('dotenv').config();
const express = require('express');
const cors = require('cors');
const textToSpeech = require('@google-cloud/text-to-speech');
const axios = require('axios');
const fs = require('fs');
const util = require('util');
const sqlite3 = require('sqlite3').verbose();

// Conexión a la base de datos SQLite
const db = new sqlite3.Database('./database.db', (err) => {
    if (err) {
        console.error('Error al conectar a la base de datos:', err.message);
    } else {
        console.log('Conectado a la base de datos SQLite.');
    }
});

// Crear tabla si no existe
db.run(`
    CREATE TABLE IF NOT EXISTS stories (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        topic TEXT NOT NULL,
        story TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
`);

const app = express();
app.use(express.json());
app.use(cors());

// Configura cliente de Google Text-to-Speech usando credenciales del .env
const client = new textToSpeech.TextToSpeechClient({
    keyFilename: process.env.GOOGLE_CLOUD_CREDENTIALS
});

// Ruta para generar un cuento
app.post('/generate-story', async (req, res) => {
    const { topic } = req.body;

    try {
        // Solicitud a la API de TextCortex
        const response = await axios.post(
            'https://api.textcortex.com/v1/texts/blogs',
            {
                context: `Escribe un cuento sobre ${topic}.`,
                formality: 'default',
                keywords: ['cuento', 'aventura', 'fantasía'],
                max_tokens: 2048,
                model: 'claude-3-haiku',
                n: 1,
                source_lang: 'es',
                target_lang: 'es',
                temperature: 0.7,
                title: `Cuento sobre ${topic}`
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${process.env.TEXT_CORTEX_API_KEY}`
                }
            }
        );

        const story = response.data.data.outputs[0].text;

        // Guarda el cuento en la base de datos
        db.run(`INSERT INTO stories (topic, story) VALUES (?, ?)`, [topic, story], function (err) {
            if (err) {
                console.error('Error al guardar en la base de datos:', err.message);
            } else {
                console.log('Cuento guardado con ID:', this.lastID);
            }
        });

        res.json({ story });
    } catch (error) {
        console.error('Error al generar el cuento:', error.response?.data || error.message);
        res.status(500).json({ error: 'Error al generar el cuento' });
    }
});

// Ruta para convertir texto a voz
app.post('/convert-to-voice', async (req, res) => {
    const { text } = req.body;

    const request = {
        input: { text: text },
        voice: { languageCode: 'es-ES', ssmlGender: 'NEUTRAL' },
        audioConfig: { audioEncoding: 'MP3' },
    };

    try {
        const [response] = await client.synthesizeSpeech(request);
        const audioFileName = `output-${Date.now()}.mp3`;

        // Guardar el archivo de audio
        await util.promisify(fs.writeFile)(audioFileName, response.audioContent, 'binary');

        res.json({ audioUrl: `http://localhost:3001/${audioFileName}` });
    } catch (error) {
        console.error('Error al convertir el texto a voz:', error);
        res.status(500).json({ error: 'Error al convertir el texto a voz' });
    }
});

app.use(express.static('.'));

const PORT = 3001;
app.listen(PORT, () => {
    console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
});
