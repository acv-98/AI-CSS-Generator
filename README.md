# AI-CSS-Generator

## Motivation

Many struggle when first getting into web development because there are quite a lot of things to consider and learn all at once. 
<br>
Programming in general is proven to be learned best from examples and through practice, but there are not many platforms that provide both.
<br>
Learning HTML and CSS is the first step into the web development world, so the aim of this project is to ease that journey.
<br><br>

## The idea

Provide an online platform for people to practice their HTML and CSS knowlede as well as learn through example by interacting with a trained natural language processing model that generates CSS for any given HTML element. 
<br>
I decided to go with CSS and not HTML because of its simplicity in syntax, making it easier for the model to learn its structure and generate it accurately.
<br><br>

## The result

The generated CSS is far from being perfect and still needs adjustements to make the HTML elements look better than their default, but it provides a good template to help users understand what each CSS attribute does by checking the dynamically updated preview for their current HTML and CSS.
<br><br>

## Features of the web interface

* HTML and CSS editors with syntax highlighting and auto completion.
* Live preview updated with each change in either of the editors.
* Generate up to 3 samples for each HTML element within the HTML editor containing a class name. 
* Switch between generated samples with a click to apply them within the CSS editor.

**Editor features** 
* Customizable height and width.
* Customizable font size.
* A range of light and dark themes available to choose from.
<br><br>

## Details of the Python back end

* Connected to the web interface with Flask.
* Fine-tuned the small (117M) GPT-2 model from OpenAI ([Github link](https://github.com/openai/gpt-2)) to a custom dataset.
* Dataset created from over 3000 website templates from ([website link](https://www.free-css.com/)) with Python web crawling. 
* Ended up having over 150,000 individual text files with CSS stylings for the most common HTML elements.
* Model takes about 20-30 seconds (depending on graphics card or processor speed) to generate one sample of CSS.
<br><br>

## Try it
https://acv-98.github.io/AI-CSS-Generator/

Unfortunately, the GPT-2 model is too big and resource demanding for most free hosting platforms, so if you want the full experience you will have to run the project locally on your machine.
<br>
I have saved some generations as given by the model (3 different stylings for each of the HTML elements generated with the provided button) and simulated a 5 second delay for each when the back end is not connected.

The fine-tuned model can be downloaded from ([Google Drive link](https://drive.google.com/drive/folders/1EVp_OTqYHk3UfA6JxDhpDiZVTQ8pASvS?usp=sharing))

### Running the project locally

#### GPT-2 Python back end
* Copy the fine-tuned model folder from google drive into the main folder of the project. 
* Recommending Visual Studio Code with the Python extension
* Install Python 3.6.8 (pyenv can be used to temporarily switch your python version ([Github link](https://github.com/pyenv/pyenv))) This is the only version that worked properly for me with GPT-2 and all of its requirements.
* Create a virtual environment using that python version with ``` python -m venv env-name ``` 
* Select that new virtual environment as the python interpreter if using Visual Studio Code and restart the termnial.
* From within the environment, install requirements.txt from the api folder with ``` pip3 install -r requirements.txt ``` 
* Run the View.py file with Flask. If you open the project in Visual Studio Code, launch.json (from .vscode) can be used with the run menu (ctrl+shift+d) with the option "Start GPT-2 with Flask" after all requirements have been installed properly.
* By default the model will be run on your processor, which might take over one minute to generate each CSS sample instead of the mentioned 20-30 seconds over GPU.
* To run the GPT-2 model with an Nvidia GPU, you also need to install CUDA toolkit 10.1 ([download link](https://developer.nvidia.com/cuda-10.1-download-archive-base)) 

#### React.JS front end
* Install Node.JS 
* Run ``` npm install ``` inside the "client" directory that contains the package.json with all the requirements.
* Run ``` npm start ``` from the same "client" directory to run the application on localhost.
