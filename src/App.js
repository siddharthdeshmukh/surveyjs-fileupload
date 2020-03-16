import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import * as Survey from "survey-react";
import "survey-react/survey.css";
import "bootstrap/dist/css/bootstrap.css";
import "jquery-ui/themes/base/all.css";
import "nouislider/distribute/nouislider.css";
import "select2/dist/css/select2.css";
import "bootstrap-slider/dist/css/bootstrap-slider.css";
import "jquery-bar-rating/dist/themes/css-stars.css";
import $ from "jquery";
import "jquery-ui/ui/widgets/datepicker.js";
import "select2/dist/js/select2.js";
import "jquery-bar-rating";
import * as SurveyCore from "survey-core";
import * as widgets from "surveyjs-widgets";
import 'survey-react/modern.css';
window["$"] = window["jQuery"] = $;

widgets.prettycheckbox(Survey);
widgets.inputmask(Survey);
widgets.jquerybarrating(Survey, $);
widgets.jqueryuidatepicker(Survey, $);
widgets.nouislider(Survey);
widgets.select2tagbox(Survey, $);
widgets.signaturepad(Survey);
widgets.sortablejs(Survey);
widgets.ckeditor(Survey);
widgets.autocomplete(Survey, $);
widgets.bootstrapslider(Survey);
widgets.prettycheckbox(SurveyCore);
widgets.inputmask(SurveyCore);
widgets.jquerybarrating(SurveyCore, $);
widgets.jqueryuidatepicker(SurveyCore, $);
widgets.nouislider(SurveyCore);
widgets.select2tagbox(SurveyCore, $);
widgets.signaturepad(SurveyCore);
widgets.sortablejs(SurveyCore);
widgets.ckeditor(SurveyCore);
widgets.autocomplete(SurveyCore, $);
widgets.bootstrapslider(SurveyCore);

Survey.StylesManager.applyTheme("modern");
class App extends Component {

  onFileUpload = (sender, options) => {
    let formData = new FormData()
    options.files.forEach(file => {
        formData.append('questionName', options.name);
        formData.append('file', file);
    });
    fetch('http://localhost:8085/api/attachments', {
      method: 'POST',
      body: formData
    }).then(response => response.json()).then(resultJson => {
      console.log('Response json is ', resultJson)
      options.callback("success", options.files.map(file => {
             return {
                file: file,
                content: resultJson.data
             };
        }));
    }).catch(error => {
      console.log('Error is ', error);
    });

}

onFileDownload = (survey, options)  => {
    fetch("http://localhost:8085/api/attachments/"+ options.content)
    .then(function(response) {
      console.log('response is ', response)
      return response.blob();
    })
    .then(function(blob) {
      console.log('blob is ', blob)
      var reader = new FileReader();
      reader.onload = function(e) {
          options.callback("success", e.target.result);
      };
      reader.readAsDataURL(new File([blob], options.fileValue.name, { type: options.fileValue.type }));
      options.callback("success", URL.createObjectURL(blob));
    }).catch(error => {
      console.log('error is ', error)
    });

}

  render() {
    const json = {
      questions: [
        {
            type: "file",
            title: "Please upload your photo",
            name: "image",
            storeDataAsText: false,
            showPreview: true,
            imageWidth: 150,
            maxSize: 102400
        }
    ]
    }
  
    const data = {
      image: [
        {name: "Group 2.png", type: "image/png", content: "Group 2.png"}
      ]
    }
    let model = new Survey.Model(json);
    model.data = data
    model.mode = 'display'
    return (
      <div className="container surveyjs">
        <Survey.Survey
              model={model}
              onUploadFiles={this.onFileUpload}
              onDownloadFile={this.onFileDownload}
            />
      </div>
    );
  }
  
}

export default App;
