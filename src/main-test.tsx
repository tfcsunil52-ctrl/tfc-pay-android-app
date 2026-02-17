import React from 'react'
import ReactDOM from 'react-dom/client'
import './styles/index.css'

// Simple test component
function TestApp() {
    return (
        <div style={{ 
            padding: '20px', 
            fontFamily: 'Arial, sans-serif',
            background: '#f0f0f0',
            minHeight: '100vh'
        }}>
            <h1 style={{ color: '#00FF87' }}>✓ React is Working!</h1>
            <p>If you can see this, React is rendering correctly.</p>
            <p>The TFC Pay app should load normally.</p>
        </div>
    )
}

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <TestApp />
    </React.StrictMode>,
)
