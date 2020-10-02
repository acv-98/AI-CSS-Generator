import os
import gpt_2_simple as gpt2
import re
from random import choice


class Serving:
    def __init__(self):
        self.sess = gpt2.start_tf_sess()
        self.model_name = "124M"
        self.model_dir = os.path.abspath("./gpt2-model/models/")

    def load_model(self):
        print("Loading model")
        gpt2.load_gpt2(self.sess,
                       model_name=self.model_name,
                       model_dir=self.model_dir
                       )

    def generate_css(self, prefix, samples):
        print("Generating css for... " + prefix)
        results = gpt2.generate(self.sess,
                               model_dir=self.model_dir,
                               model_name=self.model_name,
                               return_as_list=True,
                               prefix=prefix,
                               truncate="<|endoftext|>",
                               nsamples=samples
                               )
        formatted_results = []
        for result in results:
            print(result)
            formatted_results.append(replace_hex_colors(result))

        return formatted_results


def random_rgb():
    print("Replacing color using random rgb ...")
    color_range = [i for i in range(255)]
    r = choice(color_range)
    g = choice(color_range)
    b = choice(color_range)
    color_css = "rgb(" + str(r) + "," + str(g) + "," + str(b) + ")"
    return color_css


def random_color_name():
    print("Replacing color using random color name ...")
    css_color_names = [
        "AliceBlue",
        "AntiqueWhite",
        "Aqua",
        "Aquamarine",
        "Azure",
        "Beige",
        "Bisque",
        "Black",
        "BlanchedAlmond",
        "Blue",
        "BlueViolet",
        "Brown",
        "BurlyWood",
        "CadetBlue",
        "Chartreuse",
        "Chocolate",
        "Coral",
        "CornflowerBlue",
        "Cornsilk",
        "Crimson",
        "Cyan",
        "DarkBlue",
        "DarkCyan",
        "DarkGoldenRod",
        "DarkGray",
        "DarkGrey",
        "DarkGreen",
        "DarkKhaki",
        "DarkMagenta",
        "DarkOliveGreen",
        "DarkOrange",
        "DarkOrchid",
        "DarkRed",
        "DarkSalmon",
        "DarkSeaGreen",
        "DarkSlateBlue",
        "DarkSlateGray",
        "DarkSlateGrey",
        "DarkTurquoise",
        "DarkViolet",
        "DeepPink",
        "DeepSkyBlue",
        "DimGray",
        "DimGrey",
        "DodgerBlue",
        "FireBrick",
        "FloralWhite",
        "ForestGreen",
        "Fuchsia",
        "Gainsboro",
        "GhostWhite",
        "Gold",
        "GoldenRod",
        "Gray",
        "Grey",
        "Green",
        "GreenYellow",
        "HoneyDew",
        "HotPink",
        "IndianRed",
        "Indigo",
        "Ivory",
        "Khaki",
        "Lavender",
        "LavenderBlush",
        "LawnGreen",
        "LemonChiffon",
        "LightBlue",
        "LightCoral",
        "LightCyan",
        "LightGoldenRodYellow",
        "LightGray",
        "LightGrey",
        "LightGreen",
        "LightPink",
        "LightSalmon",
        "LightSeaGreen",
        "LightSkyBlue",
        "LightSlateGray",
        "LightSlateGrey",
        "LightSteelBlue",
        "LightYellow",
        "Lime",
        "LimeGreen",
        "Linen",
        "Magenta",
        "Maroon",
        "MediumAquaMarine",
        "MediumBlue",
        "MediumOrchid",
        "MediumPurple",
        "MediumSeaGreen",
        "MediumSlateBlue",
        "MediumSpringGreen",
        "MediumTurquoise",
        "MediumVioletRed",
        "MidnightBlue",
        "MintCream",
        "MistyRose",
        "Moccasin",
        "NavajoWhite",
        "Navy",
        "OldLace",
        "Olive",
        "OliveDrab",
        "Orange",
        "OrangeRed",
        "Orchid",
        "PaleGoldenRod",
        "PaleGreen",
        "PaleTurquoise",
        "PaleVioletRed",
        "PapayaWhip",
        "PeachPuff",
        "Peru",
        "Pink",
        "Plum",
        "PowderBlue",
        "Purple",
        "RebeccaPurple",
        "Red",
        "RosyBrown",
        "RoyalBlue",
        "SaddleBrown",
        "Salmon",
        "SandyBrown",
        "SeaGreen",
        "SeaShell",
        "Sienna",
        "Silver",
        "SkyBlue",
        "SlateBlue",
        "SlateGray",
        "SlateGrey",
        "Snow",
        "SpringGreen",
        "SteelBlue",
        "Tan",
        "Teal",
        "Thistle",
        "Tomato",
        "Turquoise",
        "Violet",
        "Wheat",
        "White",
        "WhiteSmoke",
        "Yellow",
        "YellowGreen",
    ]
    color_name = choice(css_color_names)
    return color_name


def replace_hex_colors(css):
    methods = [1, 2]
    method_chosen = choice(methods)
    if method_chosen == 1:
        new_color = random_rgb()
    else:
        new_color = random_color_name()
    new_css = re.sub("#([^\\s|;]+)", new_color, css)
    return new_css


