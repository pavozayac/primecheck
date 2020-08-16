import pytesseract
from pytesseract import Output
import re
import sys
from matplotlib import image
from PIL import Image

img = Image.open(sys.argv[1])

custom_config = r'--oem 3 --psm 11'
text = pytesseract.image_to_string(img, config=custom_config)

print(text)
