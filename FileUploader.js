import React, { Component } from "react";
import axios from "axios";
import "../styles/FileUploader.css";

export default class FileUploader extends Component {
  constructor(props) {
    super(props);
    this.state = {
      imagePreviewUrl: [],   // array of image to diaplay
    };
  }
    
  /**
   * get event that contain selected images and extrac them into image PreviewUrl
   */
  _fileSelectedHandler = e => {
    let imagePreviewUrlTemp = this.state.imagePreviewUrl.slice()
    let files = e.target.files   //  let selectedFilesTemp = this.state.selectedFiles.slice();

    for (let i = 0; i < files.length; i++) {
      let reader = new FileReader();
      reader.onloadend = () => {
        if (reader.result != null) imagePreviewUrlTemp.push(reader.result);
        this.setState({
          imagePreviewUrl: imagePreviewUrlTemp,
          uploadPercent: (ProgressEvent.loaded / ProgressEvent.total) * 100
        });
      };
      reader.readAsDataURL(files[i]);
      this._enableBtn()
    }
  }

  _fileUploadHandler = () => {
    const data = new FormData();
    data.append(
      "image",
      this.state.selectedFiles,
      this.state.selectedFiles.name
    );
    axios
      .post("", data, {
        onUploadProgress: ProgressEvent => {
          this.setState({
            uploadPercent: (ProgressEvent.loaded / ProgressEvent.total) * 100
          });
        }
      })
      .then(res => {})

      .catch(error => {
        console.log("registers api not connect or working correctly");
      });
  };

  _removeImage = (e) => {
     let index= e.target.parentElement.getAttribute("id")
     let imagePreviewUrlTemp =[]
     imagePreviewUrlTemp= this.state.imagePreviewUrl.slice()
     imagePreviewUrlTemp.splice(index,1)  //remove clicked image
    
     this.setState({
         imagePreviewUrl:  imagePreviewUrlTemp
      })
      if(imagePreviewUrlTemp.length===0) 
      this._disableBtn()
  }

  _enableBtn=()=>{
    document.getElementById("btn_upload").disabled = false;
  }
  _disableBtn=()=>{
    document.getElementById("btn_upload").disabled = true;
  }
  render() {
    // imagePreview containt array of image for display
    let $imagePreview = [];
    const {  imagePreviewUrl } = this.state;
    if (imagePreviewUrl) {
      for (let i = 0; i < imagePreviewUrl.length; i++) {
        $imagePreview.push(
          <div id={i} className="imgItem col-md-3 col-lg-3 col-sm-6 col-md-offset-1">
            <img src={imagePreviewUrl[i]} alt="خرید خانه"/>
            <button className='ButtonLink' onClick={this._removeImage}>
            حذف
            </button>
            {/* <a  href="#"  onClick={this._removeImage}>
              حذف تصویر
            </a> */}
          </div>
        );
      }
    } else {
      $imagePreview = (
        <div className="previewText">لطفا یک تصویر از ملک اضافه کنید</div>
      );
    }
    return (
      <div className="col-md-offset-1">
        <div className="imgPreview">
          {$imagePreview}
          </div> 
        {/* <div class="progress col-lg-10 col-md-10 col-sm-10">
          <div
            class="progress-bar progress-bar-success"
            role="progressbar"
            aria-valuenow="60"
            aria-valuemin="0"
            aria-valuemax="100"
            style={{ width: uploadPercent }}
          />
        </div>
   */}
        <input
          style={{ display: "none" }}
          type="file"
          onChange={this._fileSelectedHandler}
          ref={fileInput => (this.fileInput = fileInput)}
          multiple
          accept=".jpg,.png"
        />
        <div className="col-md-3">
        <button 
         className="btn btn-primary"
          onClick={() => this.fileInput.click()}
          style={{ display: "block", width:'100%' }}
        >
          انتخاب تصاویر
        </button>
        </div>
        <div className="col-md-3">
        <button id="btn_upload" 
        className="btn btn-primary"
        onClick={this._fileUploadHandler}
        style={{ display: "block", width:'100%' }}
        disabled
        >آپلود</button>
        </div>
      </div>
    );
  }
}
