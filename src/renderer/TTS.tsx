import * as React from 'react';
import { ipcRenderer } from 'electron';

interface TTSState {
    text : string
}

class TTSForm extends React.Component<any, TTSState> {
    constructor(props: any) {
      super(props);
      this.state = {text: ''};
  
      this.handleChange = this.handleChange.bind(this);
      this.handleSubmit = this.handleSubmit.bind(this);
    }
  
    handleChange(event: any) {
      this.setState({text: event.target.value});
    }
  
    handleSubmit(event: any) {
        this.OnClickSpeak();
        event.preventDefault();
    }
    
    OnClickSpeak() {
        let text = this.state.text;
        let speed = 1; // Defaults
        let pitch = 1;
        let filename = "output";
        if (text.length > 1) {
            let options = {
                text: text,
                speed: speed,
                pitch: pitch,
                filename: filename
            };
            ipcRenderer.send("generate-voice", options);
        }
    }
    render() {
        return (
          <form onSubmit={this.handleSubmit}>
            <label>
              Essay:
              <textarea value={this.state.text} onChange={this.handleChange} />        
            </label>
            <input type="submit" value="Submit" />
          </form>
        );
    }
}

export default TTSForm;