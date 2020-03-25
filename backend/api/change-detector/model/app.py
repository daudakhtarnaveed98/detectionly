import cv2
from Model import Model

CHANNELS = 3
PATCH_SIZE = 256
model = Model(CHANNELS, PATCH_SIZE)

img1 = cv2.imread('A.jpg')
img1 = cv2.cvtColor(img1, cv2.COLOR_BGR2RGB)
img2 = cv2.imread('B.jpg')
img2 = cv2.cvtColor(img2, cv2.COLOR_BGR2RGB)
cmap = model.predict(img1, img2)
cv2.imwrite('cmap.jpg', cmap)
