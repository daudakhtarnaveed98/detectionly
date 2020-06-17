// Utility functions.
import axios from "axios";
import Jimp from "jimp";

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
    url: "http://localhost:65000/api/v1/repository/locate/all",
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
    url: "http://localhost:65000/api/v1/repository/get/",
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
    url: "http://localhost:65000/api/v1/repository/delete/",
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
    url: "http://localhost:65000/api/v1/change-detector/",
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

export const getUserInformation = async (token) => {
  // Create a login query.
  const getUserInformationQuery = `
        query {
          getUserInformation {
            firstName,
            lastName,
            phoneNumber,
            organizationName,
            roleInOrganization,
            response {
              statusCode,
              statusMessage,
              responseMessage
            }
          }
        }`;

  // Construct request object.
  const getUserInformationRequest = {
    url: "http://localhost:65000/api/v1/registry/",
    method: "POST",
    data: {
      query: getUserInformationQuery,
    },
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  // Try to make API call.
  try {
    let response = await axios(getUserInformationRequest);
    if (response.status === 200 || response.status === 201) {
      return response;
    }
  } catch (error) {
    console.error(error);
  }
};

export const composeImages = async (imageA, imageB, changeMap) => {
  // Check if any of arguments is undefined.
  if (imageA === undefined || imageB === undefined || changeMap === undefined)
    return undefined;

  // Remove base64 prefix from images.
  const changeMapNoBase64Prefix = changeMap["data"].replace("data:image/jpeg;base64,", "");
  const imageANoBase64Prefix = imageA["data"].replace("data:image/jpeg;base64,", "");
  const imageBNoBase64Prefix = imageB["data"].replace("data:image/jpeg;base64,", "");

  // Convert to buffer.
  const changeMapNoBase64PrefixBuffer = Buffer.from(changeMapNoBase64Prefix, 'base64');
  const imageANoBase64PrefixBuffer = Buffer.from(imageANoBase64Prefix, 'base64');
  const imageBNoBase64PrefixBuffer = Buffer.from(imageBNoBase64Prefix, 'base64');

  // Read from buffers.
  const changeMapJimp = await Jimp.read(changeMapNoBase64PrefixBuffer);
  const imageAJimp = await Jimp.read(imageANoBase64PrefixBuffer);
  const imageBJimp = await Jimp.read(imageBNoBase64PrefixBuffer);

  changeMapJimp.invert();
  changeMapJimp.color([{apply:'red', params: [255]}]);

  // Compose images i.e. highlight changes.
  imageAJimp.composite(changeMapJimp, 0, 0, {
    mode: Jimp.BLEND_HARDLIGHT,
    opacityDest: 0.85,
    opacitySource: 0.15
  });

  imageBJimp.composite(changeMapJimp, 0, 0, {
    mode: Jimp.BLEND_HARDLIGHT,
    opacityDest: 0.85,
    opacitySource: 0.15
  });

  // Get updated base64 strings.
  const composedBase64ImageA = await imageAJimp.getBase64Async(Jimp.MIME_JPEG);
  const composedBase64ImageB = await imageBJimp.getBase64Async(Jimp.MIME_JPEG);

  return [composedBase64ImageA, composedBase64ImageB];
}