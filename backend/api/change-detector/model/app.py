import sys
import cv2
from Model import Model

CHANNELS = 3
PATCH_SIZE = 256
model = Model(CHANNELS, PATCH_SIZE)

img1 = cv2.imread(sys.argv[1])
img1 = cv2.cvtColor(img1, cv2.COLOR_BGR2RGB)
img2 = cv2.imread(sys.argv[2])
img2 = cv2.cvtColor(img2, cv2.COLOR_BGR2RGB)
cmap = model.predict(img1, img2)
cv2.imwrite(sys.argv[3] + "/" + "change-map.jpg", cmap)
