import os
from bs4 import BeautifulSoup


def create_if_nonexistent(path):
    if not os.path.exists(path):
        os.makedirs(path)


def find_css_attributes(css_source_path, class_name):
    css_file = open(css_source_path, "r", encoding="utf-8-sig", errors="ignore")
    css_content = css_file.readlines()
    css_file.close()
    found_attributes = []
    found_class = False
    for line in css_content:
        if '/*' in line or '*/' in line:
            # skip comment lines
            continue
        if "}" in line and found_class:
            # end of class
            print("End of class " + class_name + " ---> " + line)
            found_class = False

        if found_class:
            duplicate = False
            if len(found_attributes) > 0:
                attribute_name = line.split(":")[0]
                for attrib in found_attributes:
                    if attribute_name in attrib:
                        print("Attribute already exists" + attribute_name)
                        duplicate = True
                        break
            if not duplicate:
                print("Adding attribute ---> " + line)
                found_attributes.append(line)

        if class_name in line and "{" in line:
            # beginning of class
            print("Beginning of class " + class_name + " ---> " + line)
            found_class = True
            if "}" in line:
                attributes = line.split("{")[1].split("}")[0]
                print("Adding same line attributes -->" + attributes)
                found_attributes.append(attributes)

    return found_attributes


def save_found_attributes():
    for root, dirs, files in os.walk(combined_path):
        for file in files:
            temp_file = open(root + "/" + file, "r", encoding="utf-8-sig", errors="ignore")
            temp_content = temp_file.read()
            temp_file.close()
            if file.endswith(".html"):
                temp_css_path = root + "/" + "style.css"
                elements = []
                for elem in BeautifulSoup(temp_content, "html.parser").find_all(attrs={"class": True}):
                    for class_name in elem.attrs["class"]:
                        # only search for each class name once
                        if class_name not in elements:
                            elements.append(class_name)
                            save_path = html_css_attributes_path + "/" + elem.name
                            create_if_nonexistent(save_path)
                            current_file_name = str(len(os.listdir(save_path))) + ".txt"
                            print("Finding attributes for -->" + save_path + current_file_name + " ---> class -> " + class_name + " in file --->" + root)
                            temp_css_attributes = find_css_attributes(temp_css_path, "." + class_name)
                            if len(temp_css_attributes) > 0:
                                temp_file = open(os.path.abspath(save_path + "/" + current_file_name), "w+",
                                                 errors='ignore')
                                for attribute in temp_css_attributes:
                                    temp_file.write(attribute)
                                temp_file.close()


os.chdir(os.path.dirname(os.path.abspath(__file__)))
data_preparation_path = os.getcwd()
html_css_attributes_path = data_preparation_path + "/HTML-CSS-Attributes"
os.chdir("..")
scripts_path = os.getcwd()
combined_path = scripts_path + "/WebsiteDownloader/combined/"

print(combined_path)

# save_found_attributes()


















