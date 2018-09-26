import React, { Component } from 'react';
import { arrayOf, shape, func, string } from 'prop-types';
import { ButtonGroup } from 'reactstrap';
import './RadioButton.css';

class RadioButton extends Component {
  render() {
    const classes = 'radioButton';
    const buttonsList = this.props.buttonsList.map(element => (
      <button
        key={element.id}
        className={
          this.props.active === element.id ? classes.concat(' active') : classes
        }
        onClick={() => this.props.onRadioBtnClick(element.id)}
      >
        {element.name}
      </button>
    ));
    return (
      <div>
        <ButtonGroup>{buttonsList}</ButtonGroup>
      </div>
    );
  }
}

RadioButton.propTypes = {
  buttonsList: arrayOf(shape).isRequired,
  active: string.isRequired,
  onRadioBtnClick: func.isRequired
};

export default RadioButton;
