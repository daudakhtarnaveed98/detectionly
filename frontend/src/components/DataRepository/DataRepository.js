// Import modules.
import React from "react";
import Navigation from "../Navigation";
import styles from "../../styles/DataRepository.module.css";
import axios from "axios";
import {
  deleteImagePair,
  detectChange,
  getImage,
  locateCurrentData,
  composeImages,
} from "../../utils/utils";
import ImagePair from "../ImagePair";

// Component definition.
class DataRepository extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      retrievedImages: new Map(),
      changeMaps: new Map(),
      selectedItems: new Set(),
      displayMessage: "",
      deleteButtonDisabled: false,
    };
  }

  render() {
    return (
      <React.Fragment>
        <Navigation pageTitle={"Change Detector"} />
        <section className={styles.dataRepository}>
          <h3 className={styles.sectionHeadings}>Detect Changes In Uploaded Data</h3>
          <form className={styles.managementControls}>
            <label className={styles.fileChooserLabel}>
              <input
                type="file"
                multiple
                name="fileChooser"
                id="fileChooser"
                onChange={this.addMoreHandler}
                accept="image/*"
              />
              <p>Upload Images</p>
            </label>

            <button
              className={styles.detectChangeButton}
              name="deleteSelectedButton"
              id="deleteSelectedButton"
              onClick={this.detectChangeHandler}
            >
              Detect Change (Selected)
            </button>

            <button
              className={styles.detectChangeButton}
              name="deleteSelectedButton"
              id="deleteSelectedButton"
              onClick={this.detectChangeAllHandler}
            >
              Detect Change (All)
            </button>
            <button
              disabled={this.state.deleteButtonDisabled}
              className={styles.deleteSelectedButton}
              name="deleteSelectedButton"
              id="deleteSelectedButton"
              onClick={this.deleteSelectedHandler}
            >
              Delete Selected
            </button>
            <button
              disabled={this.state.deleteButtonDisabled}
              className={styles.deleteSelectedButton}
              name="deleteSelectedButton"
              id="deleteSelectedButton"
              onClick={this.deleteAllHandler}
            >
              Delete All
            </button>
          </form>
          <section className={styles.dataSectionHeader}>
            <div>
              <h3>#</h3>
            </div>
            <div>
              <h3>Select</h3>
            </div>
            <div>
              <h3>Image A</h3>
            </div>
            <div>
              <h3>Image B</h3>
            </div>
            <div>
              <h3>Change Map</h3>
            </div>
          </section>
          <section className={styles.dataSection}>
            {Array.from(this.state.retrievedImages).map(
              (currentPair, index) => {
                const pairNumber = index + 1;
                const folderName = currentPair[0];
                const imageA = currentPair[1].imageA.data;
                const imageB = currentPair[1].imageB.data;
                const changeMap = currentPair[1].changeMap.data;
                return (
                  <ImagePair
                    key={folderName}
                    pairNumber={pairNumber}
                    folderName={folderName}
                    checkBoxHandler={this.checkboxChangeHandler}
                    imageA={imageA}
                    imageB={imageB}
                    changeMap={changeMap}
                  />
                );
              }
            )}
          </section>
        </section>
      </React.Fragment>
    );
  }

  componentDidMount = async () => {
    // Get token.
    const token = localStorage.getItem("token");

    // If token is not provided, show error and redirect to sign in page.
    if (!token || token === "" || token === null) {
      this.setState({
        response: "Token Expired: Please login again",
        status: false,
      });
      this.props.history.push("/sign-in");
    }

    // Else proceed.
    else {
      // Locate images.
      const locateResponse = await locateCurrentData(token);

      // Return if locate response is not defined.
      if (!locateResponse) {
        return;
      }

      const { userUploadedImages } = locateResponse.data;

      // Get current images in state.
      const retrievedImages = this.state.retrievedImages;

      for (let i = 0; i < userUploadedImages.length; i++) {
        const currentObject = userUploadedImages[i];
        const currentFolder = currentObject.folderName;
        const imageCount = currentObject.imageCount;
        const imagePaths = currentObject.imagePaths;

        let imageA = "";
        let imageB = "";
        let changeMap = "";

        if (imageCount === 3) {
          changeMap = await getImage(token, imagePaths[2]);
        }

        imageA = await getImage(token, imagePaths[0]);
        imageB = await getImage(token, imagePaths[1]);

        let imagePairToAdd = {
          imageA: imageA,
          imageB: imageB,
          changeMap: changeMap,
        };

        // Composing images with change maps.
        if (imageCount === 3) {
          const composedImages = await composeImages(imageA, imageB, changeMap);

          // Set base64 strings to current pair of images.
          imageA["data"] = composedImages[0];
          imageB["data"] = composedImages[1];

          imagePairToAdd = {
            ...imagePairToAdd,
            isComposed: true,
          }
        }
        retrievedImages.set(currentFolder, imagePairToAdd);

        // Set state.
        this.setState({
          retrievedImages: retrievedImages,
        });
      }
    }
  };

  // Handler methods.
  // Handler for add more input.
  addMoreHandler = async (e) => {
    // Get token.
    const token = localStorage.getItem("token");

    // If token is not provided, show error and redirect to sign in page.
    if (!token || token === "" || token === null) {
      this.setState({
        response: "Token Expired: Please login again",
        status: false,
      });
      this.props.history.push("/sign-in");
    }

    // Else proceed.
    else {
      if (e.target.files.length < 2) {
        alert("Please select 2 images");
        return ;
      }

      // Get selected files from event e.
      const files = e.target.files;

      // Check if odd number of images is selected.
      if (files.length % 2 !== 0) {
        alert("Please select even (in pairs) number of images.");
        return ;
      }

      // Limit 10 image pairs per upload event.
      if (files.length > 20) {
        alert("Please select upto 10 image pairs.");
        return ;
      }

      for (let i = 0; i < files.length; i += 2) {
        // Get selected images.
        const file = files[i];
        const file1 = files[i + 1];

        // Create form data.
        const fd = new FormData();
        fd.append("images", file, file.name);
        fd.append("images", file1, file1.name);

        // Construct request object.
        const fileUploadRequest = {
          url: "http://localhost:65000/api/v1/repository/upload/",
          method: "POST",
          data: fd,
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        };

        try {
          // Make API call.
          let uploadResponse = await axios(fileUploadRequest);
          if (uploadResponse.status === 200 || uploadResponse.status === 201) {

            // Locate newly uploaded image paths.
            const locateResponse = await locateCurrentData(token);
            const uploadedImagePairFolder = uploadResponse.data.imagesUploadedPairFolder;
            const uploadedImagesObject = locateResponse.data.userUploadedImages
              .filter(
                (current) => {
                  return current.folderName === uploadedImagePairFolder;
                }
              );

            // Get uploaded images.
            const imagesUploaded = uploadedImagesObject[0].imagePaths;

            // If image A or image B is not retrieved, push an empty string.
            let imageA = await getImage(token, imagesUploaded[0]);
            let imageB = await getImage(token, imagesUploaded[1]);

            if (imageA === undefined) imageA = "";
            if (imageB === undefined) imageB = "";

            // Create image pair object to add.
            const imagePairToAdd = {
              imageA: imageA,
              imageB: imageB,
              changeMap: "",
            };

            // Merge images.
            const merged = this.state.retrievedImages;
            merged.set(uploadedImagePairFolder, imagePairToAdd);

            // Set state.
            this.setState({
              retrievedImages: merged,
            });
          }
        } catch (error) {
          console.error(error);
        }
      }
    }
  };

  // Handler for delete selected.
  deleteSelectedHandler = async (e) => {
    e.preventDefault();

    // Get token.
    const token = localStorage.getItem("token");

    // If token is not provided, show error and redirect to sign in page.
    if (!token || token === "" || token === null) {
      this.setState({
        response: "Token Expired: Please login again",
        status: false,
      });
      this.props.history.push("/sign-in");
    }

    // Else proceed.
    else {
      // Loop and delete selected items.
      const selectedItems = this.state.selectedItems;

      // Check if any item is selected to delete.
      if (selectedItems.size === 0) {
        alert("Please select an item to delete");
        return;
      }

      for (let item of selectedItems) {
        // Make API call.
        await deleteImagePair(token, item);

        // Remove from retrieved images.
        const retrievedImages = this.state.retrievedImages;
        retrievedImages.delete(item);

        // Remove from selected items.
        selectedItems.delete(item);

        // Set state.
        this.setState({
          selectedItems: selectedItems,
          retrievedImages: retrievedImages,
        });
      }
    }
  };

  // Handler for detect change.
  detectChangeHandler = async (e) => {
    e.preventDefault();

    // Get token.
    const token = localStorage.getItem("token");

    // If token is not provided, show error and redirect to sign in page.
    if (!token || token === "" || token === null) {
      this.setState({
        response: "Token Expired: Please login again",
        status: false,
      });
      this.props.history.push("/sign-in");
    }

    // Else proceed.
    else {
      // Loop and delete selected items.
      const selectedItems = this.state.selectedItems;

      // Check if any item is selected to delete.
      if (selectedItems.size === 0) {
        alert("Please select an item to detect change");
        return;
      }

      this.setState({
        deleteButtonDisabled: true
      });

      let retrievedImages = this.state.retrievedImages;
      for (let item of selectedItems) {
        // Make API call.
        const changeDetectResponse = await detectChange(token, item, true);
        let currentPair = retrievedImages.get(item);

        if (currentPair.isComposed === undefined) {
          const composedImages = await composeImages(currentPair.imageA, currentPair.imageB, changeDetectResponse);

          if (composedImages === undefined) {
            window.location.reload();
            return ;
          }

          // Set base64 strings to current pair of images.
          currentPair.imageA["data"] = composedImages[0];
          currentPair.imageB["data"] = composedImages[1];
        }

        currentPair = {
          ...currentPair,
          changeMap: changeDetectResponse,
          isComposed: true
        };
        retrievedImages.set(item, currentPair);
      }

      this.setState({
        retrievedImages: retrievedImages,
        deleteButtonDisabled: false
      });
    }
  };

  // Detect change all handler.
  detectChangeAllHandler = async (e) => {
    e.preventDefault();

    const retrievedImages = this.state.retrievedImages;
    const selectedItems = this.state.selectedItems;

    for (let key of retrievedImages) {
      if (!selectedItems.has(key[0])) {
        selectedItems.add(key[0]);
      }
    }
    this.setState({
      selectedItems: selectedItems,
    });

    // Get token.
    const token = localStorage.getItem("token");

    // If token is not provided, show error and redirect to sign in page.
    if (!token || token === "" || token === null) {
      this.setState({
        response: "Token Expired: Please login again",
        status: false,
      });
      this.props.history.push("/sign-in");
    }

    // Else proceed.
    else {

      // Loop and delete selected items.
      const selectedItems = this.state.selectedItems;

      // Check if any item is selected to delete.
      if (selectedItems.size === 0) {
        alert("Please upload items to detect change");
        return;
      }

      this.setState({
        deleteButtonDisabled: true
      });
      
      let retrievedImages = this.state.retrievedImages;
      for (let item of selectedItems) {
        // Make API call.
        const changeDetectResponse = await detectChange(token, item, false);
        let currentPair = retrievedImages.get(item);

        if (currentPair.isComposed === undefined) {
          const composedImages = await composeImages(currentPair.imageA, currentPair.imageB, changeDetectResponse);

          if (composedImages === undefined) {
            window.location.reload();
            return ;
          }

          // Set base64 strings to current pair of images.
          currentPair.imageA["data"] = composedImages[0];
          currentPair.imageB["data"] = composedImages[1];
        }

        currentPair = {
          ...currentPair,
          changeMap: changeDetectResponse,
          isComposed: true
        };
        retrievedImages.set(item, currentPair);

        this.setState({
          retrievedImages: retrievedImages,
        });
      }
      this.setState({
        deleteButtonDisabled: false
      });
    }

    selectedItems.clear();
    this.setState(
      {
        selectedItems: selectedItems
      }
    )
  };

  // Delete all handler.
  deleteAllHandler = async (e) => {
    e.preventDefault();

    // Confirm about deleting all data.
    const isConfirmed = window.confirm("Are you sure about deleting all data?");
    if (!isConfirmed)
      return ;

    const retrievedImages = this.state.retrievedImages;
    const selectedItems = this.state.selectedItems;

    for (let key of retrievedImages) {
      if (!selectedItems.has(key[0])) {
        selectedItems.add(key[0]);
      }
    }
    this.setState({
      selectedItems: selectedItems,
    });

    // Get token.
    const token = localStorage.getItem("token");

    // If token is not provided, show error and redirect to sign in page.
    if (!token || token === "" || token === null) {
      this.setState({
        response: "Token Expired: Please login again",
        status: false,
      });
      this.props.history.push("/sign-in");
    }

    // Else proceed.
    else {
      // Loop and delete selected items.
      const selectedItems = this.state.selectedItems;

      // Check if any item is selected to delete.
      if (selectedItems.size === 0) {
        alert("No items found");
        return;
      }

      for (let item of selectedItems) {
        // Make API call.
        await deleteImagePair(token, item);

        // Remove from retrieved images.
        const retrievedImages = this.state.retrievedImages;
        retrievedImages.delete(item);

        // Remove from selected items.
        selectedItems.delete(item);

        // Set state.
        this.setState({
          selectedItems: selectedItems,
          retrievedImages: retrievedImages,
        });
      }
    }

    selectedItems.clear();
    this.setState(
      {
        selectedItems: selectedItems
      }
    )
    console.log(this.state.selectedItems);
  }

  // Utility methods.
  // Checkbox change handler.
  checkboxChangeHandler = (e) => {
    if (e.target.checked) {
      const selectedItems = this.state.selectedItems;
      selectedItems.add(e.target.id);
      this.setState({
        selectedItems: selectedItems,
      });
    } else {
      const selectedItems = this.state.selectedItems;
      selectedItems.delete(e.target.id);
      this.setState({
        selectedItems: selectedItems,
      });
    }

    console.log(this.state.selectedItems);
  };
}

// Export.
export default DataRepository;
