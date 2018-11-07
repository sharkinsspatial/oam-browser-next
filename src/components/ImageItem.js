/* eslint react/require-default-props: 0, react/no-find-dom-node: 0 */
import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import GridListTile from '@material-ui/core/GridListTile';
import GridListTileBar from '@material-ui/core/GridListTileBar';
import IconButton from '@material-ui/core/IconButton';
import InfoIcon from '@material-ui/icons/Info';
import scrollIntoView from 'scroll-into-view-if-needed';


const styles = () => ({
  tile: {
    cursor: 'pointer'
  },
  title: {
    fontSize: '0.8rem'
  },
  subtitle: {
    fontSize: '0.7rem'
  },
  icon: {
    color: 'rgba(255, 255, 255, 0.54)',
  },
  selected: {
    cursor: 'pointer',
    borderStyle: 'solid',
    borderColor: '#ff3333',
    borderWidth: '5px'
  }
});

class ImageItem extends React.Component {
  constructor(props) {
    super(props);
    this.compRef = React.createRef();
  }

  componentDidUpdate() {
    const { id, activeImageItemId } = this.props;
    if (id === activeImageItemId) {
      const compNode = ReactDOM.findDOMNode(this.compRef.current);
      scrollIntoView(compNode, {
        behavior: 'smooth',
        scrollMode: 'if-needed'
      });
    }
  }

  render() {
    const {
      id,
      thumbnail,
      title,
      provider,
      push,
      setActiveImageItem,
      activeImageItemId,
      cols = 1,
      classes,
      ...other
    } = this.props;

    return (
      <GridListTile
        className={id === activeImageItemId ? classes.selected : classes.tile}
        key={id}
        cols={cols}
        {...other}
        onClick={() => setActiveImageItem(id)}
        ref={this.compRef}
      >
        <img src={thumbnail} alt={title} />
        <GridListTileBar
          classes={{
            title: classes.title,
            subtitle: classes.subtitle
          }}
          title={title}
          subtitle={provider}
          actionIcon={(
            <IconButton
              key={id}
              className={classes.icon}
              onClick={(event) => {
                event.stopPropagation();
                push(`/imageitems/${id}`);
              }}
            >
              <InfoIcon />
            </IconButton>
          )}
        />
      </GridListTile>
    );
  }
}

ImageItem.propTypes = {
  id: PropTypes.number.isRequired,
  thumbnail: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  provider: PropTypes.string.isRequired,
  push: PropTypes.func.isRequired,
  setActiveImageItem: PropTypes.func.isRequired,
  activeImageItemId: PropTypes.number.isRequired,
  cols: PropTypes.number,
  classes: PropTypes.shape({
    title: PropTypes.string.isRequired,
    subtitle: PropTypes.string.isRequired
  }).isRequired
};

export default withStyles(styles)(ImageItem);
