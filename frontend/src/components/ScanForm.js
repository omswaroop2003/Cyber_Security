import React, { useState } from 'react';
import axios from 'axios';
import './ScanForm.css'

const ScanForm = () => {
    const [target, setTarget] = useState('');
    const [result, setResult] = useState(null);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const response = await axios.post('http://localhost:5000/scan', { target });
            setResult(response.data);
        } catch (err) {
            setError('Error scanning the target. Please check the target IP.');
            setResult(null);
        }
    };
    return (
        <div className="scan-form">
            <h1>Port Scanner</h1>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    value={target}
                    onChange={(e) => setTarget(e.target.value)}
                    placeholder="Enter IP address or domain"
                    required
                />
                <button type="submit">Scan</button>
            </form>
            {error && <p className="error">{error}</p>}
            {result && (
                <div className="result">
                    <h2>Results for {result.target_ip}</h2>
                    <ul>
                        {result.open_ports.length > 0 ? (
                            result.open_ports.map((port, index) => <li key={index}>Port {port} is open</li>)
                        ) : (
                            <li>No open ports found</li>
                        )}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default ScanForm;
