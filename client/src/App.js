import React from 'react'
import './App.css'
import ExcelReader from './components/ExcelReader'

function App() {
  return (
    <div className="App">
        <div className="invoice-wr">
          <h1>Generate Invoice</h1>
          <ExcelReader path={'generate-invoice'} />
        </div>

        <div className="payslip-wr">
          <h1>GeneratePayslips</h1>
          <ExcelReader path={'generate-payslip'}/>
        </div>

        <div className="buttons" id='buttons'></div>
    </div>
  )
}

export default App
