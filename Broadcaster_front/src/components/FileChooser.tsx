import axios from "axios";
import React, { ChangeEvent } from "react";


export interface Props {
    toasterFunc: (text: string, type: 'success' | 'error') => void;
    baseUrl: string;
}



const FileChooser = ({toasterFunc, baseUrl}: Props) => {

    const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
        // Get the selected file from the event
        if (event.target.files){
            const file = event.target.files[0];

            var formData = new FormData();
            formData.append("file", file);

            axios.post(`${baseUrl}/broadcaster/v1/videos`, formData)
                .then(res => {
                    if (res.status === 200){
                        let toasterMessage = res.data.message != null ? res.data.message : "file uploaded successfully";
                        console.log(res.data, res.status);
                        toasterFunc(toasterMessage, "success");
                    } else {
                        console.log("response return error", res.status)
                        let toasterMessage = res.data.message != null ? res.data.message : "failed upload file";
                        toasterFunc(toasterMessage, "error");
                    }
            }).catch(function (error) {
                console.log(error)
                let errorMessage = error.response.data.message != null ? error.response.data.message : "faild upload file";
                toasterFunc(errorMessage, "error");
            });
        };
    }

    const fileChooserStyle = {
        border: '1px solid #ccc',
        display: 'inline-block',
        padding: '6px 12px',
        cursor:'pointer'
    }


    return (    
    <div>
        <label style={fileChooserStyle}>
             Upload fIle
            <input type="file" onChange={handleFileChange} style={{display: 'none'}}  />
        </label>
    </div>
  )
}

export default FileChooser;