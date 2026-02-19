import { useEffect, useState } from 'react'
import './App.css'

const WIDGET_PARAMS = {
  customerId: '4858719224',
  itemSku: 'BURZ9S1',
  itemOriginalPriceAmount: 1149.9,
  localeLanguage: 'en',
  sessionId: 'aNmO3yg8Fr4UlpCrHhuI0oXzhVFIE6JVkvlKxLYa30TVwbV70w',

  // Item info
  itemQuantity: 1,
  itemOriginalPriceCurrency: 'USD',
  itemInStock: true,
  itemRequiresShipping: true,
  itemBrand: 'Burton',
  itemCustomAttributes: '{"vendor_id": "dc_01"}',
  itemTags: '',
  itemProductCategory: 'Snowboards',

  // Destination
  destCountry: 'US',

  // Customer
  customerTags: '',
  orderTags: '',
}

function App() {
  const [status, setStatus] = useState('Loading Narvar script...')
  const [scriptLoaded, setScriptLoaded] = useState(false)

  useEffect(() => {
    // Poll for window.narvar to become available
    const interval = setInterval(() => {
      if (typeof window.narvar === 'function') {
        clearInterval(interval)
        setScriptLoaded(true)
        setStatus('Narvar script loaded. Calling promiseWidget...')

        // Call promiseWidget
        try {
          window.narvar('promiseWidget', WIDGET_PARAMS)
          setStatus('promiseWidget called successfully. Waiting for widget to render...')
        } catch (err) {
          setStatus(`Error calling promiseWidget: ${err.message}`)
        }
      }
    }, 500)

    // Timeout after 15 seconds
    const timeout = setTimeout(() => {
      clearInterval(interval)
      if (!scriptLoaded) {
        setStatus('Timed out waiting for Narvar script to load (15s)')
      }
    }, 15000)

    return () => {
      clearInterval(interval)
      clearTimeout(timeout)
    }
  }, [])

  return (
    <div className="app">
      <h1>Narvar Promise Widget Test</h1>

      <div className="status-bar">
        <strong>Status:</strong> {status}
      </div>

      <div className="product-card">
        <h2>Burton Snowboard</h2>
        <p className="price">$1,149.90</p>
        <p className="sku">SKU: BURZ9S1</p>

        <button className="add-to-cart">Add to Cart</button>

        {/* Narvar Promise Widget renders here */}
        <div className="widget-container">
          <span data-narvar-feature="promiseWidget"></span>
        </div>
      </div>

      <div className="debug-section">
        <h3>Debug Info</h3>
        <p><strong>Script loaded:</strong> {scriptLoaded ? 'Yes' : 'No'}</p>
        <p><strong>window.narvar available:</strong> {typeof window.narvar === 'function' ? 'Yes' : 'No'}</p>
        <details>
          <summary>Widget Parameters</summary>
          <pre>{JSON.stringify(WIDGET_PARAMS, null, 2)}</pre>
        </details>
      </div>
    </div>
  )
}

export default App
