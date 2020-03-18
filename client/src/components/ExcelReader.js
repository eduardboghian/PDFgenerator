import React, { Component } from 'react';
import XLSX from 'xlsx';
import { make_cols } from './MakeColumns';
import { SheetJSFT } from './types';
import axios from 'axios'

class ExcelReader extends Component {
  constructor(props) {
    super(props);
    this.state = {
      file: {},
      data: [],
      cols: []
    }
    this.handleFile = this.handleFile.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }
 
  handleChange(e) {
    const files = e.target.files;
    if (files && files[0]) this.setState({ file: files[0] });
  };
 
  handleFile() {
    /* Boilerplate to set up FileReader */
    const reader = new FileReader();
    const rABS = !!reader.readAsBinaryString;
 
    reader.onload = (e) => {
      /* Parse data */
      const bstr = e.target.result;
      const wb = XLSX.read(bstr, { type: rABS ? 'binary' : 'array', bookVBA : true });
      /* Get first worksheet */
      const wsname = wb.SheetNames[0];
      const ws = wb.Sheets[wsname];
      /* Convert array of arrays */
      const data = XLSX.utils.sheet_to_json(ws);
      /* Update state */
      this.setState({ data: data, cols: make_cols(ws['!ref']) }, () => {
        //console.log(JSON.stringify(this.state.data, null, 2));
      });

      let testdata = JSON.parse([JSON.stringify(this.state.data, null, 2)])

      console.log(testdata)

      if( this.props.path === 'generate-invoice') {
        axios({
          method: 'POST',
          url: `/api/${this.props.path}`, 
          data: [JSON.stringify(this.state.data, null, 2)],
          responseType: 'stream'
        })
        .then(res=> {
            res.data.map(data=> {
                function arrayBufferToBase64(buffer) {
                  let binary = '';
                  let bytes = new Uint8Array(buffer);
                  let len = bytes.byteLength;
                  for (let i = 0; i < len; i++) {
                      binary += String.fromCharCode(bytes[i]);
                  }
                  return window.btoa(binary);
                }
                let b64 = arrayBufferToBase64(data.data)
        
        
                // Embed the PDF into the HTML page and show it to the user
                let obj = document.createElement('object');
                obj.style.width = '70%';
                obj.style.height = '842pt';
                obj.style.float = 'right'
                obj.type = 'application/pdf';
                obj.data = 'data:application/pdf;base64,' + b64;
                document.body.appendChild(obj);
        
                // Insert a link that allows the user to download the PDF file
                let link = document.createElement('a');
                link.innerHTML = 'Download PDF file';
                link.download = 'file.pdf';
                link.href = 'data:application/octet-stream;base64,' + b64;
                document.body.appendChild(link);
        
            })
        
        })
        .catch(err=> console.log(err))
      }else if(this.props.path === 'generate-payslip') {
          const jsonString = JSON.stringify(this.state.data, null, 2)
          const data = JSON.parse(jsonString)
          console.log(data)
          data.map(data => {
            axios({
              method: 'POST',
              url: `/api/${this.props.path}`, 
              data: data,
              responseType: 'stream'
            })
            .then(res=> {
                res.data.map(async data=> {
                    function arrayBufferToBase64(buffer) {
                      let binary = '';
                      let bytes = new Uint8Array(buffer);
                      let len = bytes.byteLength;
                      for (let i = 0; i < len; i++) {
                          binary += String.fromCharCode(bytes[i]);
                      }
                      return window.btoa(binary);
                    }
                    
                    let b64 = arrayBufferToBase64( await data.data)
                    console.log(b64)
            
                    // Embed the PDF into the HTML page and show it to the user
                    // let obj = document.createElement('object');
                    // obj.style.width = '70%';
                    // obj.style.height = '842pt';
                    // obj.style.float = 'right'
                    // obj.type = 'application/pdf';
                    // obj.data = 'data:application/pdf;base64,' + b64;
                    // document.body.appendChild(obj);
            
                    // Insert a link that allows the user to download the PDF file
                    let link = document.createElement('a');
                    link.innerHTML = 'Download PDF file';
                    link.download = 'file.pdf';
                    link.href = 'data:application/octet-stream;base64,' + b64;
                    document.body.appendChild(link);
            
                })
            
            })
            .catch(err=> console.log(err))
          })

      }
      
    };
 
    if (rABS) {
      reader.readAsBinaryString(this.state.file);
    } else {
      reader.readAsArrayBuffer(this.state.file);
    };
  }
 
  render() {
    return (
      <div className='input-wr'>
        <br />
        <input type="file" className="form-control" id="file" accept={SheetJSFT} onChange={this.handleChange} />
        <br />
        <input type='submit' 
          value="Load File"
          onClick={this.handleFile} 
          className='submit-file'/>
      </div>
      
    )
  }
}
 
export default ExcelReader;





