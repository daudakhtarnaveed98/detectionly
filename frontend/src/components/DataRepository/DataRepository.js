// Import modules.
import React from "react";
import Navigation from "../Navigation";
import styles from "../../styles/DataRepository.module.css";
import sampleImage from "../../images/sample.png";

// Component definition.
class DataRepository extends React.Component {
  render() {
    return (
      <React.Fragment>
        <Navigation pageTitle={"Data Repository"} />
        <section className={styles.dataRepository}>
          <h3 className={styles.sectionHeadings}>Manage Your Data</h3>

          <form className={styles.managementControls}>
            <button className={styles.addMoreButton} name="addMoreButton" id="addMoreButton">
              Add More
            </button>
            <button className={styles.deleteSelectedButton} name="deleteSelectedButton" id="deleteSelectedButton">
              Delete Selected
            </button>
          </form>
            <section className={styles.dataSectionHeader}>
                <div><h3>#</h3></div>
                <div><h3><input type="checkbox"/></h3></div>
                <div><h3>Image A</h3></div>
                <div><h3>Image B</h3></div>
            </section>
        </section>
      </React.Fragment>
    );
  }
}

// Export.
export default DataRepository;
