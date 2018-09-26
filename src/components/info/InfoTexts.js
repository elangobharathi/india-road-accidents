import React from 'react';
import { arrayOf, shape, string } from 'prop-types';
import './InfoTexts.css';

const InfoTexts = ({ accidentsData, killedData, selectedState }) => {
  const accidentsInfo = accidentsData.find(
    state => state.properties.name === selectedState
  );
  const killedInfo = killedData.find(
    state => state.properties.name === selectedState
  );
  return (
    <div className="texts d-flex flex-column">
      <p className="stateName">{selectedState}</p>
      <p className="mb-0">
        Number of Accidents Per Lakh Population :{' '}
        <strong>{accidentsInfo.properties.perLakhPopulation}</strong>
      </p>
      <p className="mb-0">
        Number of Accidents : <strong>{accidentsInfo.properties.total}</strong>
      </p>
      <p className="mb-0">
        Number of Persons Killed Per Lakh Population :{' '}
        <strong>{killedInfo.properties.perLakhPopulation}</strong>
      </p>
      <p className="mb-0">
        Number of Persons Killed :{' '}
        <strong>{killedInfo.properties.total}</strong>
      </p>
    </div>
  );
};

InfoTexts.propTypes = {
  accidentsData: arrayOf(shape).isRequired,
  killedData: arrayOf(shape).isRequired,
  selectedState: string.isRequired
};

export default InfoTexts;
