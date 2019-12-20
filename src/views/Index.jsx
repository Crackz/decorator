import Header from "components/Headers/Header.jsx";
import React from "react";
import { Container } from "reactstrap";



class Index extends React.Component {
  state = {
    activeNav: 1,
    chartExample1Data: "data1"
  };
  toggleNavs = (e, index) => {
    e.preventDefault();
    this.setState({
      activeNav: index,
      chartExample1Data:
        this.state.chartExample1Data === "data1" ? "data2" : "data1"
    });
    let wow = () => {
      console.log(this.state);
    };
    wow.bind(this);
    setTimeout(() => wow(), 1000);
    // this.chartReference.update();
  };
  
  render() {
    return (
      <>
        <Header />
        {/* Page content */}
        <Container className="mt--7" fluid>
        </Container>
      </>
    );
  }
}

export default Index;
