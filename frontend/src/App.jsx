import { useState, useEffect } from 'react'
import './App.css'

function App() {
  const [inpValue, setinpValue] = useState('')
  const [err, setErr] = useState('')
  const [responseData, setResponseData] = useState(null)
  
  // selection array
  var [selectedFilters, setSelectedFilters] = useState([])

  useEffect(() => {
    // roll number dalna tha
    document.title = "0827AL231123"
  }, [])

  const handleSubmit = async () => {
    setErr('')
    setResponseData(null)
    
    let parsedData
    try {
      // JSON check kr rhe hai
      parsedData = JSON.parse(inpValue)
      
      if (!parsedData.data) {
        setErr("Data field is missing")
        return
      }
    } catch (e) {
      setErr("Invalid JSON Format")
      return
    }

    try {
      const res = await fetch('/bfhl', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(parsedData)
      })
      const data = await res.json()
      console.log("data received", data)

      setResponseData(data)
    } catch (error) {
      setErr("API call failed: " + error.message)
    }
  }

  const handleSelectChange = (e) => {
    const value = Array.from(
      e.target.selectedOptions, 
      (option) => option.value
    );
    setSelectedFilters(value)
  }

  // const filtered = data.filter(x => x) -- old way

  const renderResponse = () => {
    if (!responseData) return null;

    let displayString = ""
    if (selectedFilters.includes('Alphabets')) {
      displayString += "Alphabets: " + responseData.alphabets.join(', ') + "\n"
    }
    if (selectedFilters.includes('Numbers')) {
      displayString += "Numbers: " + responseData.numbers.join(', ') + "\n"
    }
    if (selectedFilters.includes('Highest Lowercase Alphabet')) {
      // ye wala part thoda tricky tha
      displayString += "Highest Lowercase Alphabet: " + responseData.highest_lowercase_alphabet.join(', ') + "\n"
    }

    return (
      <div style={{ marginTop: '20px', padding: '10px', border: '1px solid #ccc' }}>
        <h3>Filtered Response</h3>
        <pre>{displayString}</pre>
      </div>
    )
  }

  // not sure why but this fixes it
  let errorDisplay = null;
  if (err !== '') {
    errorDisplay = <div style={{ color: 'red' }}>{err}</div>
  } else {
    errorDisplay = null
  }

  return (
    <div style={{ padding: '40px', fontFamily: 'sans-serif' }}>
      <h1>BFHL Challenge</h1>
      <div style={{ marginBottom: '10px' }}>
        <label style={{ display: 'block', marginBottom: '5px' }}>API Input</label>
        <textarea 
          rows="5" 
          cols="50" 
          value={inpValue} 
          onChange={(e) => setinpValue(e.target.value)}
          placeholder='{ "data": ["A","C","z"] }'
        />
      </div>
      <button onClick={handleSubmit} style={{ padding: '8px 16px', cursor: 'pointer' }}>
        Submit
      </button>

      {errorDisplay}

      {responseData && (
        <div style={{ marginTop: '20px' }}>
          <label>Multi Filter</label>
          <br/>
          {/* TODO: clean later */}
          <select 
            multiple={true} 
            onChange={handleSelectChange}
            style={{ width: '200px', height: '80px', marginTop: '10px' }}
          >
            <option value="Alphabets">Alphabets</option>
            <option value="Numbers">Numbers</option>
            <option value="Highest Lowercase Alphabet">Highest Lowercase Alphabet</option>
          </select>
        </div>
      )}

      {renderResponse()}
    </div>
  )
}

export default App