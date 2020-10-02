from selenium import webdriver
from time import sleep
from shutil import copy
import zipfile
import random
import os
import re


def sleep_randomly(times):
    random.shuffle(times)
    print("Script will now wait ... " + str (times[0]) + " seconds")
    sleep(times[0])
    print("Script will now resume activity ....")


def save_website_links():
    links = []
    for i in range(1, 250):
        print("Currently printing page" + str(i))
        next_page_button = browser.find_element_by_xpath("/html/body/div[4]/div/div[1]/div[1]/ul/li[12]/a")
        temp_links = []
        for y in range(1, 13):
            temp_link_xpath = "/html/body/div[4]/div/div[1]/div[2]/ul/li[" + str(y) + "]/figure/a"
            link = browser.find_element_by_xpath(temp_link_xpath)
            links.append(link.get_attribute("href"))
            temp_links.append(link.get_attribute("href"))
        save_links_to_file(saved_links_path, temp_links)
        sleep_randomly(list(range(1, 10)))
        next_page_button.click()
        print("currently found " + str(len(links)) + " links")


def save_links_to_file(path_to_file, links_to_save):
    file = open(path_to_file, "a")
    for link in links_to_save:
        file.write(str(link) + ",")
    file.close()


def get_saved_links(path_to_file):
    file = open(path_to_file, "r")
    lines = file.readlines()
    file.close()
    link_collection = []
    for line in lines:
        for link in line.split(","):
            if link != "":
                link_collection.append(link)
    return link_collection


def download_websites(links):
    for link in links:
        link_page_and_name = link.split("free-css-templates/")[1]
        download_link = "https://www.free-css.com/assets/files/free-css-templates/download/" + link_page_and_name + ".zip"
        browser.get(download_link)
        sleep_randomly(list(range(1, 5)))


def unzip_websites(path):
    files = os.listdir(path)
    count = 0
    for file in files:
        if file.endswith('.zip'):
            print(file)
            file_path = path + '/' + file
            with zipfile.ZipFile(file_path, 'r') as zip_ref:
                zip_ref.extractall(path + '/' + 'unzipped' + "/" + str(count) + file)
        count += 1


def create_if_nonexistent(path):
    if not os.path.exists(path):
        os.makedirs(path)


def format_websites():
    for root, dirs, files in os.walk(downloaded_websites_path):
        for file in files:
            if file.endswith(".html") or file.endswith(".css"):
                if len(root.split("\\")) > 4:
                    folder = root.split("\\")[4]
                    full_file_path = os.path.join(root, file)
                    if file.endswith(".html"):
                        new_folder_path = formatted_websites_path + "/" + folder + "/html"
                    else:
                        new_folder_path = formatted_websites_path + "/" + folder + "/css"

                    create_if_nonexistent(new_folder_path)

                    copy(full_file_path, new_folder_path)
                    print("copied ->" + file)


def combine_files():
    for root, dirs, files in os.walk(formatted_websites_path):
        for file in files:
            combined_file_name = ""
            combined_file_path = combined_websites_path + "/" + root.split("\\")[4]
            create_if_nonexistent(combined_file_path)

            if file.endswith(".html"):
                combined_file_name = "/index.html"
            elif file.endswith(".css"):
                combined_file_name = "/style.css"

            print(combined_file_path + combined_file_name)

            temp_file = open(root + "/" + file, "r", encoding="utf-8-sig", errors="ignore")
            temp_contents = temp_file.read()
            temp_contents = re.sub("(<!--.*?-->)", "", temp_contents, flags=re.DOTALL)
            temp_file.close()

            combined_file = open(combined_file_path + combined_file_name, "a", encoding="utf-8-sig", errors="ignore")
            combined_file.write(temp_contents)
            combined_file.write("\n\n\n")
            combined_file.close()


# browser = webdriver.Chrome(executable_path='chromedriver.exe')
# browser.set_window_size(900, 900)
# browser.get("https://www.free-css.com/free-css-templates")

os.chdir(os.path.dirname(os.path.abspath(__file__)))
folder_path = os.getcwd()
saved_links_path = folder_path+"/website_links.txt"
downloaded_websites_path = folder_path+"/downloaded_websites"
formatted_websites_path = folder_path+"/formatted"
combined_websites_path = folder_path+"/combined"

#save_website_links()
#saved_links = get_saved_links(saved_links_path)
#download_websites(saved_links)
#unzip_websites(downloaded_websites_path)
#format_websites()
#combine_files()






