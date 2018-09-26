import React from 'react';
import { arrayOf, shape, func, string } from 'prop-types';
import RadioButton from './components/common/RadioButton';

const Header = ({ buttonsList, viewBy, onRadioBtnClick }) => (
  <div key="header" className="appHeader d-flex justify-content-between p-3">
    <span className="appTitle">Road Accidents In India - 2016</span>
    <div className="d-flex viewContainer">
      <span className="mr-3">View by:</span>
      <RadioButton
        buttonsList={buttonsList}
        active={viewBy}
        onRadioBtnClick={onRadioBtnClick}
      />
    </div>
  </div>
);

Header.propTypes = {
  buttonsList: arrayOf(shape).isRequired,
  viewBy: string.isRequired,
  onRadioBtnClick: func.isRequired
};

export default Header;
