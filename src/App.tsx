import { useEffect, useState } from 'react'
import { supabase } from './lib/supabaseClient'

function App() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [testData, setTestData] = useState<any[]>([])

  useEffect(() => {
    async function fetchTestData() {
      const { data, error } = await supabase.from('test_items').select('*')
      if (error) {
        console.error('Supabase error:', error)
      } else {
        setTestData(data)
      }
    }
    fetchTestData()
  }, [])

  return (
    <div>
      <h1>Supabase Connection Test</h1>
      {testData.map((item) => (
        <p key={item.id}>{item.name}</p>
      ))}
    </div>
  )
}

export default App