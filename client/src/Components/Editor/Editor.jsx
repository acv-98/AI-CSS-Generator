import React, {Component} from 'react';
import AceEditor from 'react-ace';
import "ace-builds/src-noconflict/mode-html";
import "ace-builds/src-noconflict/mode-css";
import "ace-builds/src-noconflict/theme-dracula";
import './Editor.css';
import axios from 'axios'
import Dropdown  from 'react-bootstrap/Dropdown';
import Button from 'react-bootstrap/Button';
import Toast from 'react-bootstrap/Toast'
import ButtonGroup from "react-bootstrap/ButtonGroup";
import Card from "react-bootstrap/Card"
import 'bootstrap/dist/css/bootstrap.css';
import 'brace/theme/github';
import 'brace/theme/xcode';
import 'brace/theme/crimson_editor';
import 'brace/theme/tomorrow_night';
import 'brace/theme/solarized_dark';
import 'brace/theme/chaos';
import {ToastHeader, ToastBody} from "react-bootstrap";
import Loader from 'react-loader-spinner';
import Timer from 'react-compound-timer';
import {MDBContainer, MDBCol, MDBRow, MDBCard, MDBCardBody, MDBCardTitle} from "mdbreact";


class Editor extends Component {
    state = {
        html: "",
        css: "",
        generated_css: [],
        selected_css: {},
        sample_count: 1,
        showing_settings: false,
        showing_full_preview: false,
        showing_generated_css: false,
        showing_css_options: false,
        showing_options_warning: false,
        showing_connection_problem: false,
        waiting_for_api: false,
        editor_settings: {
            col_size: 6,
            height: 40,
            font_size: 12,
            theme: {
                themes : ['github',
                    'tomorrow_night',
                    'crimson_editor',
                    'solarized_dark',
                    'xcode',
                    'chaos'],
                selected_theme : 0
            }
        }
    };


    async get_html_elements(html){
        let elements = null;

        await axios({
            method: "post",
            url: "/get_html_elements/",
            data: {html}
        })
        .then((res) => {
            elements = res.data.elements;
            this.setState({showing_connection_problem: false});
        })
        .catch(() => this.setState({showing_connection_problem: true, waiting_for_api: false}));

        return elements;
    }

    async generate_css () {
        const elements_arr = await this.get_html_elements(this.state.html);
        console.log(elements_arr);
        const connection_problem = this.state.showing_connection_problem;
        if (!connection_problem) {
            const sample_count = this.state.sample_count;
            let generated_css = this.state.generated_css;
            if (generated_css.length > 0) {
                generated_css = [];
            }
            for (let class_name in elements_arr){
                this.setState({waiting_for_api: true});
                if (elements_arr.hasOwnProperty(class_name)) {
                    await axios.post("/generate_css/", {
                        element:elements_arr[class_name],
                        element_class: class_name,
                        sample_count: sample_count
                    })
                    .then(res => {
                        const css_arr = res.data.results;
                        generated_css.push(css_arr);
                        this.setState({
                            generated_css: generated_css,
                            showing_css_options: true,
                            waiting_for_api: false,
                            showing_connection_problem: false
                        })
                    })
                    .catch(() => this.setState({showing_connection_problem: true, waiting_for_api: false}));
                }
            }
        }
    }

    async wait(ms) {
        return new Promise(resolve => {
            setTimeout(resolve, ms);
        });
    }

    async generate_test_css () {
         const test_css = [[".test-h1{\n" +
         "color: rgb(176,156,10);\n" +
         "font-size: 15px;\n" +
         "letter-spacing: 1px;\n" +
         "text-transform: uppercase;\n" +
         "margin-top: 20px;\n" +
         "}",
             ".test-h1{\n" +
             "font-size: 21px;\n" +
             "color: red;\n" +
             "text-align: center;\n" +
             "padding-top: 10px;\n" +
             "padding-bottom: 10px;\n" +
             "}",
             ".test-h1{\n" +
             "font:26px tahoma, Arial;\n" +
             "color:rgb(0,172,218);\n" +
             "font-weight:bold;\n" +
             "margin:0px;\n" +
             "padding:8px 0px 10px 0;\n" +
             "text-decoration:nonefont:26px tahoma, Arial;\n" +
             "background:nonefont:15px Myriad Pro, Arial, Helvetica, sans-serif;\n" +
             "border-bottom:1px dotted rgb(0,172,218);\n" +
             "border:none;\n" +
             "}"
         ],
             [".test-d1{\n" +
             "float:left;\n" +
             "width:971px;\n" +
             "background:url(../images/title_bg.gif) no-repeat 27px 18pxfloat:left;\n" +
             "font:18px/20px \"ZapfHumnst BT\", Arial, Helvetica, sans-serif;\n" +
             "color:rgb(48,113,3);\n" +
             "padding:22px 0 8px 45pxfloat:left;\n" +
             "text-align:right;\n" +
             "text-decoration:nonecolor:rgb(48,113,3);\n" +
             "}",
                 ".test-d1{\n" +
                 "position: relative;\n" +
                 "min-height: 1px;\n" +
                 "padding-right: 15px;\n" +
                 "padding-left: 15px;\n" +
                 "float: left;\n" +
                 "width: 25%;\n" +
                 "}",
                 ".test-d1{\n" +
                 "padding: 10px;\n" +
                 "background-color: rgb(206,43,113);\n" +
                 "border-top: 1px solid rgb(206,43,113);\n" +
                 "border-bottom: 1px solid rgb(206,43,113);\n" +
                 "}"],
             [".test-p1{\n" +
             "width: 100%;\n" +
             "padding: .5em 1em;\n" +
             "float: left;\n" +
             "text-align: center;\n" +
             "color: Chartreuse;\n" +
             "font-size: 1.8em;\n" +
             "font-weight: 300;\n" +
             "line-height: 1.8em;\n" +
             "}\n",
                 ".test-p1{\n" +
                 "border-left: 1px solid rgb(85,43,237);\n" +
                 "margin-bottom: -1px;\n" +
                 "padding-bottom: 1px;\n" +
                 "font-size: 16px;\n" +
                 "padding-top: 8px;\n" +
                 "padding-right: 8px;\n" +
                 "color: rgb(85,43,237);\n" +
                 "}",
                 ".test-p1{\n" +
                 "background: blue;\n" +
                 "margin: 0 0 0 43px;\n" +
                 "padding: 0 12px;\n" +
                 "font-size: 110%;\n" +
                 "font-style: italic;\n" +
                 "border: 1px solid Cornsilk;\n" +
                 "min-height: 38px;\n" +
                 "color: Cornsilk;\n" +
                 "height: auto !important;\n" +
                 "line-height: 100%;\n" +
                 "margin-top: 10px;\n" +
                 "display: block;\n" +
                 "}"
             ]
         ];
         const sample_count = this.state.sample_count;
         let generated_css = [];
         for (let i in test_css) {
             this.setState({waiting_for_api: true});
             await this.wait(5000 * sample_count);
             generated_css.push(test_css[i].slice(0,sample_count));
             this.setState({waiting_for_api: false,
                 showing_css_options: true,
                 generated_css:generated_css});
         }
    }

    generate_test_html = () => {
        const test_html ="<h1 class='test-h1'>Test header 1</h1>\n" +
            "<div class='test-d1'>Test Div 1</div>\n" +
            "<p class='test-p1'>Test Paragraph 1</p>\n"
            ;
        this.setState({html: test_html})
    };

    update_css_count = (sample_count) => this.setState({ sample_count });

    toggle_settings = () => this.setState({showing_settings: !this.state.showing_settings});

    toggle_full_preview = () => this.setState({showing_full_preview: !this.state.showing_full_preview});

    toggle_warning_message = () => this.setState({showing_options_warning: !this.state.showing_options_warning});

    toggle_css_options = () => {
        const showing_css_options = !this.state.showing_css_options;
        const current_css = this.state.css;
        let showing_options_warning = this.state.showing_options_warning;

        if (showing_css_options === false) {
            showing_options_warning = true;
        }
        if (current_css === ""){
            showing_options_warning = false;
        }
        this.setState({showing_css_options: showing_css_options, showing_options_warning: showing_options_warning});
    };


    change_editor_width = (sign) => {
      const editor_settings = this.state.editor_settings;
      const current_col_size = editor_settings.col_size;
      if (sign === "+" && current_col_size < 12){
          editor_settings.col_size = current_col_size + 1;
      } else if (sign === "-" && current_col_size > 1){
          editor_settings.col_size = current_col_size - 1;
      }
      if (editor_settings.col_size !== current_col_size){
          this.setState({editor_settings: editor_settings})
      }
    };

    change_editor_height = (sign) => {
        const editor_settings = this.state.editor_settings;
        const current_height = editor_settings.height;
        if (sign === "+"){
            editor_settings.height = current_height + 2.5;
        } else if (sign === "-" && current_height > 2.5){
            editor_settings.height = current_height - 2.5;
        }
        if (editor_settings.width !== current_height){
            this.setState({editor_settings: editor_settings})
        }
    };

    change_editor_theme = (direction) => {
        const current_editor_settings = this.state.editor_settings;
        const current_theme_index = current_editor_settings.theme.selected_theme;
        if (direction === "<" && current_theme_index > 0){
            current_editor_settings.theme.selected_theme = current_theme_index - 1;
        } else if (direction === ">" && current_theme_index < (current_editor_settings.theme.themes.length - 1)){
            current_editor_settings.theme.selected_theme = current_theme_index + 1;
        }
        if (current_theme_index !== current_editor_settings.theme.selected_theme){
            this.setState({editor_settings: current_editor_settings})
        }
    };

    change_editor_font = (sign) => {
        const editor_settings = this.state.editor_settings;
        const current_font_size = editor_settings.font_size;
        if (sign === "+"){
            editor_settings.font_size = current_font_size + 1;
        } else if (sign === "-" && current_font_size > 1){
            editor_settings.font_size = current_font_size - 1;
        }
        if (editor_settings.font_size !== current_font_size){
            this.setState({editor_settings: editor_settings})
        }
    };

    select_css = (css) => {
        const class_name = css.split("{")[0];
        const current_selected_css = this.state.selected_css;
        const current_css = this.state.css;
        let showing_options_warning = this.state.showing_options_warning;
        let new_css = "";
        if (current_selected_css[class_name] === css){
            delete current_selected_css[class_name];
        } else {
            current_selected_css[class_name] = css;
        }
        for (css in current_selected_css){
            new_css += current_selected_css[css] + "\n";
        }
        if (showing_options_warning && current_css === ""){
            showing_options_warning = !showing_options_warning;
        }
        this.setState({selected_css: current_selected_css, css: new_css, showing_options_warning: showing_options_warning})
    };

    render() {
        const {html, css, sample_count, showing_settings,
            editor_settings, showing_full_preview,
            generated_css, showing_css_options, showing_options_warning, 
            showing_connection_problem, waiting_for_api} = this.state;
        const preview = "data:text/html;charset=utf-8," + encodeURI("<style>" + css + "</style>" + html );
        const current_theme = editor_settings.theme.themes[editor_settings.theme.selected_theme];
        
        const css_cards = generated_css.map(css_arr =>
            <MDBRow>
                {
                    css_arr.map(css =>
                        <MDBCol>
                            <Card
                                bg={this.state.css.includes(css) ? "success" : ""}
                                onClick={() => this.select_css(css)}
                            >
                                <Card.Title>{css.split("{")[0]}</Card.Title>
                                <Card.Body>
                                    {css.split("{")[1].replace("}", "").split(";").map(attr => <Card.Text>{attr}</Card.Text>)}
                                </Card.Body>
                            </Card>
                        </MDBCol>
                    )
                }
            </MDBRow>
        );

        const settings = <Toast className="settings-window" show={showing_settings} onClose={this.toggle_settings}>
            <Toast.Body>
                <Toast.Header>
                    Settings
                </Toast.Header>
                <Toast.Body>
                    <p>Editor width <strong>({editor_settings.col_size}/12)</strong></p>
                    <p>Editor height <strong>({editor_settings.height * 2} %)</strong></p>
                    <p>Editor font size <strong>({editor_settings.font_size})</strong></p>
                    <p>Selected theme: <strong>({current_theme})</strong></p>
                </Toast.Body>
                <Toast.Body><strong>Editor Width</strong>
                    <ButtonGroup>
                        <Button onClick={() => this.change_editor_width("-")}><strong>-</strong></Button>
                        <Button onClick={() => this.change_editor_width("+")}><strong>+</strong></Button>
                    </ButtonGroup>
                </Toast.Body>
                <Toast.Body><strong>Editor Height</strong>
                    <ButtonGroup>
                        <Button onClick={() => this.change_editor_height("-")}><strong>-</strong></Button>
                        <Button onClick={() => this.change_editor_height("+")}><strong>+</strong></Button>
                    </ButtonGroup>
                </Toast.Body>
                <Toast.Body><strong>Editor Font size</strong>
                    <ButtonGroup>
                        <Button onClick={() => this.change_editor_font("-")}><strong>-</strong></Button>
                        <Button onClick={() => this.change_editor_font("+")}><strong>+</strong></Button>
                    </ButtonGroup>
                </Toast.Body>
                <Toast.Body><strong>Editor Theme</strong>
                    <ButtonGroup>
                        <Button onClick={() => this.change_editor_theme("<")}><strong>{"<"}</strong></Button>
                        <Button onClick={() => this.change_editor_theme(">")}><strong>{">"}</strong></Button>
                    </ButtonGroup>
                </Toast.Body>
            </Toast.Body>
        </Toast>;

        const preview_box = <MDBCard style={{ width: "100%", height: "100%" }}>
            <MDBCardBody className="preview-box">
                <MDBCardTitle>HTML + CSS Preview</MDBCardTitle>
                <Button onClick={this.toggle_full_preview} variant="success" size="sm">Full Preview</Button>
                <iframe className="preview-frame" src ={preview} title ="preview"/>
            </MDBCardBody>
        </MDBCard>;

        const editor = <React.Fragment>
                <MDBRow className="height-100">
                    {showing_full_preview 
                    ? 
                        null
                    :
                    <MDBCol size={this.state.editor_settings.col_size}>
                        <div className="ace-container">
                            <h1>HTML</h1>
                            <Button onClick={this.generate_test_html}>Generate test HTML</Button>
                            <AceEditor
                                value = {this.state.html}
                                mode="html"
                                theme={current_theme}
                                onChange={(val) => this.setState({html: val})}
                                name="html-editor"
                                showLineNumbers={true}
                                width="100%"
                                height={editor_settings.height + "vh"}
                                fontSize={editor_settings.font_size}
                                editorProps={{
                                    $blockScrolling: true
                                }}
                            />
                            <h1>CSS</h1>
                            <Button
                                onClick={() => this.generate_css()}
                                size = "sm"
                            >
                                Generate CSS with GPT-2
                            </Button>
                            <AceEditor
                                value = {this.state.css}
                                mode="css"
                                theme={current_theme}
                                onChange={(val) => this.setState({css: val})}
                                name="css-editor"
                                showLineNumbers={true}
                                width={editor_settings.width + "%"}
                                height={editor_settings.height + "vh"}
                                fontSize={editor_settings.font_size}
                                editorProps={{
                                    $blockScrolling: true
                                }}
                            />
                        </div>
                    </MDBCol>
                    }
                    <MDBCol size = {
                        showing_full_preview ? 
                        12 
                        :
                        12 - this.state.editor_settings.col_size
                    }>
                        {preview_box}
                    </MDBCol>
                </MDBRow>
        </React.Fragment>;


        const toolbar =
            <React.Fragment>
                <Dropdown>
                    <Dropdown.Toggle variant="info" size="sm">
                        CSS samples to choose from, currently {sample_count}
                    </Dropdown.Toggle>
                    <Dropdown.Menu>
                        <Dropdown.Item onClick ={() => this.update_css_count(1)}>1 sample for each element</Dropdown.Item>
                        <Dropdown.Item onClick ={() => this.update_css_count(2)}>2 samples for each element</Dropdown.Item>
                        <Dropdown.Item onClick ={() => this.update_css_count(3)}>3 samples for each element</Dropdown.Item>
                    </Dropdown.Menu>
                </Dropdown>
                <Button onClick={this.toggle_settings} variant={showing_settings ? "danger" : "secondary"}>
                    {showing_settings ? "Hide settings" : "Main settings"}
                </Button>
                {generated_css.length > 0
                    ? <Button onClick={this.toggle_css_options} variant={showing_css_options ? "danger" : "success"}>
                        {showing_css_options ? "Hide generated options" : "Show generated options"}
                    </Button>
                    : null}
                {settings}
            </React.Fragment>;

        return (
            <MDBContainer fluid className="editor-container">
                {toolbar}
                <Toast show={showing_connection_problem} onClose={() => this.setState({showing_connection_problem: false})}>
                        <ToastHeader style={{color:'red'}}>Failed to connect to server..</ToastHeader>
                        <ToastBody>
                            <Button 
                                onClick={() => {
                                    this.generate_test_css();
                                    this.setState({showing_connection_problem: false});
                                }} 
                                variant="warning">Generate Test CSS without GPT-2
                            </Button>
                        </ToastBody>
                </Toast>
                {showing_css_options
                    ?
                    <React.Fragment>
                        <Toast show={showing_options_warning} onClose={this.toggle_warning_message}>
                                <Toast.Header style={{color: 'red'}}>Choosing a new option will overwrite any changes made !</Toast.Header>
                        </Toast>
                        <MDBContainer>
                            {css_cards}
                        </MDBContainer>
                    </React.Fragment>
                    : null
                }
                {waiting_for_api
                    ?
                    <React.Fragment>
                        <Loader type="ThreeDots" color="green"/>
                        <h1>Takes about 20 seconds per sample generation...</h1>
                        <h2>
                            <Timer>
                                {"You've been waiting for "} <Timer.Minutes/>{" min and "}<Timer.Seconds/>{" sec"}
                            </Timer>
                        </h2>
                    </React.Fragment>
                    : null
                }
                {editor}
            </MDBContainer>
        );
    }
}
export default Editor;