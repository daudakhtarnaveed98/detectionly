# Detectionly
Detectionly is a web application that can be used to detect changes in a given pair of images.

# Dataset
Dataset employed was proposed by the following paper:

MA Lebedev, Yu V Vizilter, OV Vygolov, VA Knyaz, and A Yu Rubis. Change detection in remote sensing images using conditional adversarial networks. International Archives of the Photogrammetry, Remote Sensing & Spatial Information Sciences, 42(2), 2018.

Dataset Link: https://drive.google.com/file/d/1GX656JqqOyBi_Ef0w65kDGVto-nHrNs9

# How to run

  - Prerequisites: Linux, Python, PyTorch, Yarn, NodeJS, MongoDB and OpenCV.
  - Clone the repository.
  - Create .env file in backend/ and fill in the following fields.
```
# Server Environment Variables.
SERVER_PORT = 65000

# Database Environment Variables.
DB_HOST = localhost
DB_PORT = 27017
DB_NAME = detectionly
TEST_DB_NAME = detectionly-test
DB_USER = <user-here>
DB_PASS = <password-here>
DB_URI = mongodb://${DB_HOST}:${DB_PORT}/${DB_NAME}

# JSON Web Tokens (JWT) Variables.
PRIVATE_KEY = <private-key-here>

# Webmail Environment Variables.
WM_HOST = <i.e. smtp.gmail.com>
WM_PORT = <i.e. 587>
WM_USER = <i.e. demo@gmail.com>
WM_PASS = <password-here>

# Paths.
TEMP_FILE_UPLOAD_PATH = uploads/temporary/
PERM_FILE_UPLOAD_PATH = uploads/permanent/
```

  - Create folders backend/uploads/temporary/ and backend/uploads/permanent/
  - Create .env file in frontend/ and fill in the following fields.
```
# Server Environment Variables.
PORT = 65001
```

  - Open terminal and change directory to /backend and run yarn install.
  - Open another terminal and change directory to /frontend and run yarn install.
```
cd backend && yarn install
cd frontend && yarn install
```
  - Run backend and frontend using following commands:
```
cd backend && yarn run start
cd frontend && yarn run start
```
