// Utility functions.
import axios from "axios";

export const emailValidator = (email) => {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
};

export const passwordValidator = (password) => {
  const re = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;
  return re.test(String(password));
};

export const locateCurrentData = async (token) => {
  // Construct request object.
  const dataLocateRequest = {
    url: "http://39.40.116.9:65000/api/v1/repository/locate/all",
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  try {
    // Make API call.
    let response = await axios(dataLocateRequest);
    if (response.status === 200 || response.status === 201) {
      return response;
    }
  } catch (error) {
    console.error(error);
  }
};

export const getImage = async (token, imagePath) => {
  // Construct request object.
  const getImageRequest = {
    url: "http://39.40.116.9:65000/api/v1/repository/get/",
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    params: {
      'imagePath': imagePath
    }
  };

  try {
    // Make API call.
    let response = await axios(getImageRequest);
    if (response.status === 200 || response.status === 201) {
      return response;
    }
  } catch (error) {
    console.error(error);
  }
};

export const deleteImagePair = async (token, nameOfImagePairFolder) => {
  // Construct request object.
  const deleteImageRequest = {
    url: "http://39.40.116.9:65000/api/v1/repository/delete/",
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    params: {
      "nameOfImagePairFolder": nameOfImagePairFolder
    }
  };

  try {
    // Make API call.
    let response = await axios(deleteImageRequest);
    if (response.status === 200 || response.status === 201) {
      return response;
    }
  } catch (error) {
    console.error(error);
  }
};

export const detectChange = async (token, nameOfImagePairFolder, invalidateCurrent) => {
  // Construct request object.
  const deleteImageRequest = {
    url: "http://39.40.116.9:65000/api/v1/change-detector/",
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    params: {
      "imagePairFolderName": nameOfImagePairFolder,
      "invalidateCurrent": invalidateCurrent
    }
  };

  try {
    // Make API call.
    let response = await axios(deleteImageRequest);
    if (response.status === 200 || response.status === 201) {
      return response;
    }
  } catch (error) {
    console.error(error);
  }
};