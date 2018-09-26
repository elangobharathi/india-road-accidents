import { render } from 'react-dom';
import { MapControl, withLeaflet } from 'react-leaflet';
import PropTypes from 'prop-types';
import { Map } from 'leaflet';
import Dumb from './Control.Dumb';

class Control extends MapControl {
  static contextTypes = MapControl.contextTypes;
  static childContextTypes = MapControl.childContextTypes;
  static propTypes = {
    children: PropTypes.node,
    map: PropTypes.instanceOf(Map),
    popupContainer: PropTypes.shape({}),
    position: PropTypes.string
  };

  componentWillMount() {
    const {
      children: _children,
      map: _map,
      popupContainer,
      ...props
    } = this.props;

    this.leafletElement = new Dumb(props);
  }

  componentDidMount() {
    super.componentDidMount();
    this.renderContent();
  }

  componentDidUpdate(next) {
    super.componentDidUpdate(next);
    this.renderContent();
  }

  componentWillUnmount() {
    this.leafletElement.remove();
  }

  createLeafletElement() {}

  renderContent() {
    const container = this.leafletElement.getContainer();
    render(this.props.children, container);
  }

  render() {
    return null;
  }
}

export default withLeaflet(Control);
