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
  // test destination zip because backcountry is configured only for US. so the API would return an empty response if the user visiting is from a country outside US.
  //destZip: '10011',
  // to indicate this is a test request. Since backcountry is still configuring and not live,
  // test flag = true needs to be passed to return test response so that the widget renders.
  // It needs to be removed before the customer goes live
  // alternatively setting ?narvar_test=true in the url is also going to set this variable
  isTestMode: true,

  // Customer
  customerTags: '',
  orderTags: '',
}

const API_PAYLOAD = {
  test: true,
  display_location: 'pdp',
  channel: 'mobile',
  session_id: 'unique_session_id',
  language_code: 'en',
  destination: {
    country: 'US',
    postal_code: '78801',
  },
  order_subtotal: {
    amount: 170.0,
    currency_code: 'USD',
  },
  customer: {
    customer_id: '1ab89usbas123',
    email: 'customer@email.com',
  },
  items: [
    {
      sku: '3ME10101430M9',
      quantity: 1,
      original_price: {
        amount: 170.0,
        currency_code: 'USD',
      },
      product_category: 'Snowboards',
      item_brand: 'Burton',
      in_stock: true,
      attributes: { vendor_id: 'dc_01' },
    },
  ],
}

const SERVER_API_PAYLOAD = {
  destination: {
    postal_code: '51503',
    country: 'US',
  },
  display_location: 'pdp',
  order_subtotal: {
    amount: 170,
    currency: 'USD',
  },
  customer: {
    customer_id: '1ab89usbas123',
    email: 'customer@email.com',
  },
  channel: 'website',
  experiment: {
    override: {
      treatment_is_control: true,
    },
  },
  country_code: 'US',
  language_code: 'en',
  items: [
    {
      original_price: {
        amount: 170,
        currency: 'USD',
      },
      in_stock: true,
      attributes: {
        vendor_id: 'dc_01',
        test: 'test',
      },
      sku: '3ME10101430M9',
      quantity: 1,
      product_category: 'Snowboards',
      brand: 'test',
    },
  ],
  session_id: 'unique_session_id',
}

function WidgetPanel() {
  const [status, setStatus] = useState('Loading Narvar script...')
  const [scriptLoaded, setScriptLoaded] = useState(false)

  useEffect(() => {
    const interval = setInterval(() => {
      if (typeof window.narvar === 'function') {
        clearInterval(interval)
        setScriptLoaded(true)
        setStatus('Narvar script loaded. Calling promiseWidget...')

        try {
          window.narvar('promiseWidget', WIDGET_PARAMS)
          setStatus('promiseWidget called successfully. Waiting for widget to render...')
        } catch (err) {
          setStatus(`Error calling promiseWidget: ${err.message}`)
        }
      }
    }, 500)

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
    <div className="panel">
      <h2 className="panel-title">JS SDK (Promise Widget)</h2>

      <div className="status-bar">
        <strong>Status:</strong> {status}
      </div>

      <div className="product-card">
        <h3>Burton Snowboard</h3>
        <p className="price">$1,149.90</p>
        <p className="sku">SKU: BURZ9S1</p>

        <button className="add-to-cart">Add to Cart</button>

        <div className="widget-container">
          <span data-narvar-feature="promiseWidget"></span>
        </div>
      </div>

      <div className="debug-section">
        <h4>Debug Info</h4>
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

function ReceiptPage({ confirmData, selectedOption, retailer, orderId, onBack }) {
  return (
    <div className="panel">
      <h2 className="panel-title">Order Confirmation</h2>

      <div className="receipt">
        <div className="receipt-header">
          <span className="receipt-check">&#10003;</span>
          <h3>Delivery Confirmed</h3>
        </div>

        <div className="receipt-details">
          <div className="receipt-row">
            <span className="receipt-label">Order ID</span>
            <span className="receipt-value">{orderId}</span>
          </div>
          <div className="receipt-row">
            <span className="receipt-label">Delivery Option</span>
            <span className="receipt-value">{selectedOption.delivery_option_name}</span>
          </div>
          <div className="receipt-row">
            <span className="receipt-label">Estimated Delivery</span>
            <span className="receipt-value">{selectedOption.text}</span>
          </div>
          <div className="receipt-row">
            <span className="receipt-label">Promise ID</span>
            <span className="receipt-value receipt-mono">{selectedOption.promise_id}</span>
          </div>
          <div className="receipt-row">
            <span className="receipt-label">Retailer</span>
            <span className="receipt-value">{retailer}</span>
          </div>
        </div>

        <div className="debug-section">
          <h4>Confirm API Response</h4>
          <details open>
            <summary>Response Body</summary>
            <pre>{JSON.stringify(confirmData, null, 2)}</pre>
          </details>
        </div>

        <button className="back-btn" onClick={onBack}>
          Back to Delivery Options
        </button>
      </div>
    </div>
  )
}

function ClientApiPanel() {
  const [status, setStatus] = useState('Idle')
  const [response, setResponse] = useState(null)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)
  const [retailer, setRetailer] = useState('backcountry')
  const [payload, setPayload] = useState(API_PAYLOAD)
  const [geoStatus, setGeoStatus] = useState('')
  const [selectedPromiseId, setSelectedPromiseId] = useState(null)
  const [confirming, setConfirming] = useState(false)
  const [confirmData, setConfirmData] = useState(null)
  const [orderId] = useState(() => String(Math.floor(Math.random() * 900000) + 100000))

  useEffect(() => {
    async function fetchGeoPostalCode() {
      setGeoStatus('Fetching postal code...')
      try {
        const res = await fetch('/geo/postalCode')
        const data = await res.json()
        const postalCode = data.postal_code || data.postalCode || data.zipCode || data.zip
        if (postalCode) {
          setPayload(prev => ({
            ...prev,
            destination: { ...prev.destination, postal_code: postalCode },
          }))
          setGeoStatus(`Geo-detected: ${postalCode}`)
        } else {
          setGeoStatus('No postal code in response')
        }
      } catch (err) {
        setGeoStatus(`Geo lookup failed: ${err.message}`)
      }
    }
    fetchGeoPostalCode()
  }, [])

  async function fetchEdd() {
    setLoading(true)
    setStatus('Fetching EDD...')
    setError(null)
    setResponse(null)
    setSelectedPromiseId(null)
    setConfirmData(null)

    try {
      const encodedQuery = btoa(JSON.stringify(payload))
      const url = `/api/2025-06/promise/options?query=${encodedQuery}`

      const res = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'x-narvar-retailer': retailer,
          'x-narvar-origin': 'https://backcountry.com',
        },
      })

      const data = await res.json()
      setResponse(data)
      setStatus(res.ok ? `Success (${res.status})` : `Error (${res.status})`)
    } catch (err) {
      setError(err.message)
      setStatus(`Failed: ${err.message}`)
    } finally {
      setLoading(false)
    }
  }

  async function confirmSelection() {
    if (!selectedPromiseId) return
    setConfirming(true)
    setError(null)

    try {
      const res = await fetch(
        '/api/2025-06/promise/options/public/confirm',
        {
          method: 'POST',
          headers: {
            'accept': 'application/json',
            'content-type': 'application/json',
            'x-narvar-retailer': retailer,
            'x-narvar-origin': window.location.origin,
          },
          body: JSON.stringify({
            order_id: orderId,
            selected_delivery_options: [{ promise_id: selectedPromiseId }],
            channel: 'website',
          }),
        }
      )

      const data = await res.json()
      setConfirmData(data)
      setStatus(res.ok ? `Confirmed (${res.status})` : `Confirm failed (${res.status})`)
    } catch (err) {
      setError(err.message)
      setStatus(`Confirm failed: ${err.message}`)
    } finally {
      setConfirming(false)
    }
  }

  const deliveryOptions = response?.cart_delivery_options?.delivery_options
  const selectedOption = deliveryOptions?.find(o => o.promise_id === selectedPromiseId)

  if (confirmData && selectedOption) {
    return (
      <ReceiptPage
        confirmData={confirmData}
        selectedOption={selectedOption}
        retailer={retailer}
        orderId={orderId}
        onBack={() => {
          setConfirmData(null)
          setSelectedPromiseId(null)
          setResponse(null)
          setStatus('Idle')
        }}
      />
    )
  }

  return (
    <div className="panel">
      <h2 className="panel-title">Client-Side API</h2>

      <div className="status-bar">
        <strong>Status:</strong> {status}
        {geoStatus && <><br /><strong>Geo:</strong> {geoStatus}</>}
      </div>

      <div className="product-card">
        <h3>Product (SKU: {payload.items[0].sku})</h3>
        <p className="price">${payload.order_subtotal.amount.toFixed(2)}</p>
        <p className="sku">Destination: {payload.destination.postal_code}, {payload.destination.country}</p>

        <div className="api-form">
          <label>
            Retailer
            <input
              type="text"
              value={retailer}
              onChange={(e) => setRetailer(e.target.value)}
            />
          </label>
          <label>
            Postal Code
            <input
              type="text"
              value={payload.destination.postal_code}
              onChange={(e) =>
                setPayload({
                  ...payload,
                  destination: { ...payload.destination, postal_code: e.target.value },
                })
              }
            />
          </label>
          <label>
            SKU
            <input
              type="text"
              value={payload.items[0].sku}
              onChange={(e) =>
                setPayload({
                  ...payload,
                  items: [{ ...payload.items[0], sku: e.target.value }],
                })
              }
            />
          </label>
        </div>

        <button className="add-to-cart" onClick={fetchEdd} disabled={loading}>
          {loading ? 'Fetching...' : 'Get Delivery Dates'}
        </button>

        {deliveryOptions && (
          <div className="delivery-options">
            <p className="delivery-options-label">Select a delivery option:</p>
            {deliveryOptions.map((option) => (
              <div
                key={option.promise_id}
                className={`delivery-option selectable ${selectedPromiseId === option.promise_id ? 'selected' : ''}`}
                onClick={() => setSelectedPromiseId(option.promise_id)}
              >
                <div className="option-radio">
                  <span className={`radio-dot ${selectedPromiseId === option.promise_id ? 'active' : ''}`} />
                </div>
                <div className="option-details">
                  <span className="option-name">{option.delivery_option_name}</span>
                  <span className="option-text">{option.text}</span>
                </div>
              </div>
            ))}
            <button
              className="confirm-btn"
              onClick={confirmSelection}
              disabled={!selectedPromiseId || confirming}
            >
              {confirming ? 'Confirming...' : 'Confirm Delivery Option'}
            </button>
          </div>
        )}

        {error && (
          <div className="error-box">
            {error}
          </div>
        )}
      </div>

      <div className="request-info">
        <h4>Request Info</h4>
        <div className="info-row">
          <span className="info-label">URL</span>
          <code className="info-value">{`GET https://ship-cdn.domain-ship.prod20.narvar.com/api/2025-06/promise/options?query=\u2026`}</code>
        </div>
        <div className="info-row">
          <span className="info-label">Content-Type</span>
          <code className="info-value">application/json</code>
        </div>
        <div className="info-row">
          <span className="info-label">x-narvar-retailer</span>
          <code className="info-value">{retailer}</code>
        </div>
        <div className="info-row">
          <span className="info-label">x-narvar-origin</span>
          <code className="info-value">https://backcountry.com</code>
        </div>
      </div>

      <div className="debug-section">
        <h4>Debug Info</h4>
        <details>
          <summary>Request Payload</summary>
          <pre>{JSON.stringify(payload, null, 2)}</pre>
        </details>
        <details>
          <summary>Encoded Query</summary>
          <pre className="encoded-query">{btoa(JSON.stringify(payload))}</pre>
        </details>
        <details>
          <summary>Full Request URL</summary>
          <pre className="encoded-query">{`https://ship-cdn.domain-ship.prod20.narvar.com/api/2025-06/promise/options?query=${btoa(JSON.stringify(payload))}`}</pre>
        </details>
        {response && (
          <details open>
            <summary>API Response</summary>
            <pre>{JSON.stringify(response, null, 2)}</pre>
          </details>
        )}
      </div>
    </div>
  )
}

function ServerApiPanel() {
  const [status, setStatus] = useState('Idle')
  const [response, setResponse] = useState(null)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)
  const [payload, setPayload] = useState(SERVER_API_PAYLOAD)

  async function fetchEdd() {
    setLoading(true)
    setStatus('Fetching EDD...')
    setError(null)
    setResponse(null)

    try {
      const res = await fetch('/ws-api/2024-06/promise/options', {
        method: 'POST',
        headers: {
          'accept': 'application/json',
          'content-type': 'application/json',
        },
        body: JSON.stringify(payload),
      })

      const data = await res.json()
      setResponse(data)
      setStatus(res.ok ? `Success (${res.status})` : `Error (${res.status})`)
    } catch (err) {
      setError(err.message)
      setStatus(`Failed: ${err.message}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="panel">
      <h2 className="panel-title">Server-Side API (POST)</h2>

      <div className="status-bar">
        <strong>Status:</strong> {status}
      </div>

      <div className="product-card">
        <h3>Product (SKU: {payload.items[0].sku})</h3>
        <p className="price">${payload.order_subtotal.amount.toFixed(2)}</p>
        <p className="sku">Destination: {payload.destination.postal_code}, {payload.destination.country}</p>

        <div className="api-form">
          <label>
            Postal Code
            <input
              type="text"
              value={payload.destination.postal_code}
              onChange={(e) =>
                setPayload({
                  ...payload,
                  destination: { ...payload.destination, postal_code: e.target.value },
                })
              }
            />
          </label>
          <label>
            SKU
            <input
              type="text"
              value={payload.items[0].sku}
              onChange={(e) =>
                setPayload({
                  ...payload,
                  items: [{ ...payload.items[0], sku: e.target.value }],
                })
              }
            />
          </label>
        </div>

        <button className="add-to-cart" onClick={fetchEdd} disabled={loading}>
          {loading ? 'Fetching...' : 'Get Delivery Dates (POST)'}
        </button>

        {error && (
          <div className="error-box">
            {error}
          </div>
        )}
      </div>

      <div className="request-info">
        <h4>Request Info</h4>
        <div className="info-row">
          <span className="info-label">Method</span>
          <code className="info-value">POST</code>
        </div>
        <div className="info-row">
          <span className="info-label">URL</span>
          <code className="info-value">https://ws.narvar.com/api/2024-06/promise/options</code>
        </div>
        <div className="info-row">
          <span className="info-label">Content-Type</span>
          <code className="info-value">application/json</code>
        </div>
      </div>

      <div className="debug-section">
        <h4>Debug Info</h4>
        <details>
          <summary>Request Payload</summary>
          <pre>{JSON.stringify(payload, null, 2)}</pre>
        </details>
        {response && (
          <details open>
            <summary>API Response</summary>
            <pre>{JSON.stringify(response, null, 2)}</pre>
          </details>
        )}
      </div>
    </div>
  )
}

function App() {
  return (
    <div className="app">
      <h1>Narvar Promise Integration Test</h1>
      <div className="split-layout three-col">
        <WidgetPanel />
        <ClientApiPanel />
        <ServerApiPanel />
      </div>
    </div>
  )
}

export default App
