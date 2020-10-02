from flask import Flask, request
from css_generator import Serving
from bs4 import BeautifulSoup
import time

app = Flask(__name__)


@app.route('/generate_css/', methods=["POST"])
def generate_css_for_element():
    if request.method == "POST":
        data = request.get_json(silent=True)
        element = data.get('element')
        element_class = data.get('element_class')
        sample_count = data.get('sample_count')
        if sample_count == 1:
            print(f"Generating {sample_count} sample of css for the html element {element} with class name {element_class}")
        else:
            print(f"Generating {sample_count} samples of css for the html element {element} with class name {element_class}")

        start_time = time.time()
        serve = Serving()
        serve.load_model()

        generated_css = serve.generate_css(element, sample_count)
        for index, temp_css in enumerate(generated_css):
            generated_css[index] = temp_css.replace(element, element_class)

        end_time = time.time()
        print("It took " + str(end_time - start_time), " seconds")
        return {'results': generated_css}


@app.route('/get_html_elements/', methods=["POST"])
def get_elements_from_html():
    if request.method == "POST":
        data = request.get_json(silent=True)
        html = data.get('html')
        print("received html --> " + html)
        elements = {}
        for elem in BeautifulSoup(html, "html.parser").find_all(attrs={"class": True}):
            element_name = "." + elem.name + "{"
            element_class = ""
            for class_name in elem.attrs["class"]:
                element_class += "." + class_name + " "
            element_class = element_class.rstrip() + "{"

            if element_class not in elements.keys():
                elements[element_class] = element_name

        print("found elements --> " + str(elements))
        return {'elements': elements}




