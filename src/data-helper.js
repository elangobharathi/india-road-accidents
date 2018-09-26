const data = {
  shapeFile: require('./data/states.json'),
  accidentsTotal: require('./data/accidents_total_share_plp.json'),
  killed: require('./data/killed_total_share_plp.json'),
  vehicleTypes: require('./data/vehicle_types.json'),
  causes: require('./data/causes.json')
};

const accidentsData = data.shapeFile.features.map(shape => {
  const obj = Object.assign({}, shape);
  const accData = data.accidentsTotal.find(
    state => state.name === obj.properties.name
  );
  obj.properties = { ...accData };
  return obj;
});

const killedData = data.shapeFile.features.map(shape => {
  const obj = Object.assign({}, shape);
  const killedData = data.killed.find(
    state => state.name === obj.properties.name
  );
  obj.properties = { ...killedData };
  return obj;
});

module.exports = {
  accidentsData,
  killedData,
  vehicleTypesData: data.vehicleTypes,
  causesData: data.causes
};
