// Import modules.
import React from "react";

// Component definition.
class ImagePair extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isComposed: false,
    }
  }

  render() {
    return (
      <React.Fragment>
        <h3>{this.props.pairNumber}</h3>
        <input type="checkbox" name={this.props.folderName} id={this.props.folderName} onChange={this.props.checkBoxHandler} />
        <img src={this.props.imageA} alt="Image A"/>
        <img src={this.props.imageB} alt="Image B"/>
        <img title={"Change Map"} src={this.props.changeMap} alt="Not Generated Yet"/>
      </React.Fragment>
    );
  }
}

// Export.
export default ImagePair;
