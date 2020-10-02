import os
import pickle

data_path = os.getcwd() + "/DataPreparation/HTML-CSS-Attributes"

os.chdir(os.path.dirname(os.path.abspath(__file__)))

def save_css_collection():
    collection = {}
    for root, dirs, files in os.walk(data_path):
        folders = []
        for file in files:
            current_element = root.split("\\")[3]
            if current_element not in collection.keys():
                collection[current_element] = []

            temp_file_path = root + "/" + file
            temp_file = open(temp_file_path, 'r', encoding="utf-8-sig", errors="ignore")
            temp_content = temp_file.read()
            temp_file.close()
            if temp_content == "":
                os.remove(temp_file_path)
                print("Deleted empty file --> " + temp_file_path)

            collection[current_element].append(temp_content)
    pickle.dump(collection, open("css_collection.p", "wb"))


def format_collection(collection):
    tokenized_collection = {}
    for key in collection:
        if key not in tokenized_collection:
            tokenized_collection[key] = []
        for value in collection[key]:
            if '*' not in value and '{' not in value:
                temp_attributes = []
                temp_value = ""
                for attribute in value.split(";"):
                    temp_attr = ''.join(attribute.split(":")[0].split())
                    if temp_attr not in temp_attributes:
                        if len(temp_attr) < 35 and '.' not in temp_attr:
                            if attribute.strip() != "":
                                temp_value = temp_value + attribute.strip() +";\n"
                                temp_attributes.append(temp_attr)

                tokenized_collection[key].append("<|startoftext|>" + key + "{\n" + temp_value + "}<|endoftext|>\n")
    pickle.dump(tokenized_collection, open("tokenized_css_collection.p", "wb"))


def save_as_txt(collection):
    temp_file = open(os.path.abspath("tokenized_collection.txt"), "w+")
    for key in collection:
        for value in collection[key]:
            temp_file.write(value)
    temp_file.close()



css_collection = pickle.load(open("css_collection.p", "rb"))
print("Loaded " + str(len(css_collection.keys())) + " types of elements")

# format_collection(css_collection)


tokenized_collection = pickle.load(open("tokenized_css_collection.p", "rb"))
style_count = 0

for key in tokenized_collection:
    style_count += len(tokenized_collection[key])

print("Collection has " + str(style_count) + " CSS stylings in total")


#save_as_txt(tokenized_collection)
