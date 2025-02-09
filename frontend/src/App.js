import React, { useState } from 'react';
import axios from 'axios';
import './App.css';  // Archivo de estilos CSS

function App() {
    const [topic, setTopic] = useState('');
    const [story, setStory] = useState('');
    const [audioUrl, setAudioUrl] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleGenerateStory = async () => {
        setLoading(true);
        setError('');
        try {
            const response = await axios.post('http://localhost:3001/generate-story', {
                topic: topic
            });
            setStory(response.data.story);
            setAudioUrl('');
        } catch (error) {
            setError('Error al generar el cuento. Por favor, inténtalo de nuevo.');
        } finally {
            setLoading(false);
        }
    };

    const handleConvertToVoice = async () => {
        setLoading(true);
        setError('');
        try {
            const response = await axios.post('http://localhost:3001/convert-to-voice', {
                text: story
            });
            setAudioUrl(response.data.audioUrl);
        } catch (error) {
            setError('Error al convertir el texto a voz. Por favor, inténtalo de nuevo.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="app-container">
            <h1 className="title">Generador de Cuentos</h1>
            <div className="input-container">
                <label htmlFor="topic">Tema del cuento:</label>
                <input
                    type="text"
                    id="topic"
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    className="input-box"
                />
                <button onClick={handleGenerateStory} className="generate-button">
                    Generar Cuento
                </button>
            </div>
            {loading && <div className="spinner">🔄 Generando...</div>}
            {error && <div className="error-message">{error}</div>}
            {story && (
                <div className="story-container">
                    <h2>Cuento Generado:</h2>
                    <p>{story}</p>
                    <button onClick={handleConvertToVoice} className="voice-button">
                        Convertir a Voz
                    </button>
                </div>
            )}
            {audioUrl && (
                <div className="audio-container">
                    <h2>Escuchar Cuento:</h2>
                    <audio controls src={audioUrl}>
                        Tu navegador no soporta el elemento de audio.
                    </audio>
                </div>
            )}
        <div className="app-container">
            {/* ... contenido existente ... */}
            <img 
                src={`${process.env.PUBLIC_URL}/gatito.gif`} 
                alt="Gatito animado" 
                className="animated-cat" 
            />
        </div>

        </div>
        
    );



}

export default App;
