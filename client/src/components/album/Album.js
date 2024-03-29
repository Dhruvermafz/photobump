import React from "react";
import { IconButton, withStyles } from "@mui/material";
import { Link } from "react-router-dom";
import classNames from "classnames";
import PropTypes from "prop-types";
import { ImageListItemBar as Bar } from "@mui/material";
import { Settings as SettingsIcon } from "@mui/icons-material";
import ModalView from "../modal/ModalView";
import AlbumMaker from "./AlbumMaker";
import AlbumLoader from "../loaders/AlbumLoader";

class Album extends React.Component {
  state = {
    albumName: this.props.album.name,
    showSettingsIcon: false,
    loadingImage: true,
  };

  toggleSettingsIcon = (e) => {
    if (e.type === "mouseenter") {
      return this.setState({ showSettingsIcon: true }, () => {});
    }

    if (e.type === "mouseleave") {
      return this.setState({ showSettingsIcon: false }, () => {});
    }
  };

  onAlbumNameSet = (albumName) => {
    this.setState({ albumName }, () => {});
  };

  onImgLoad = () => {
    this.setState({ loadingImage: false }, () => {});
  };

  render() {
    const { classes, album } = this.props;

    return (
      <div
        onMouseLeave={this.toggleSettingsIcon}
        onMouseEnter={this.toggleSettingsIcon}
        className={classes.root}
      >
        <Link
          to={{
            pathname: `/albums/${album._owner.displayName}/${album._id}`,
            state: { albumId: album._id },
          }}
        >
          <img
            onLoad={this.onImgLoad}
            src={`https://d14ed1d2q7cc9f.cloudfront.net/200x200/smart/${album.coverImg}`}
            className={classes.image}
            alt={this.state.albumName}
          />
          {this.state.loadingImage && <AlbumLoader />}
        </Link>
        <Bar
          title={this.state.albumName}
          actionIcon={
            this.props.ownAlbum && (
              <ModalView
                togglerComponent={
                  <IconButton
                    ref={(node) => {
                      this.iconButtonRef = node;
                    }}
                    albumid={album._id}
                    className={
                      this.state.showSettingsIcon
                        ? classNames(classes.visibleSettingsIcon)
                        : classes.icon
                    }
                    classes={{ root: classes.iconButtonRoot }}
                  >
                    <SettingsIcon classes={{ root: classes.settingsIcon }} />
                  </IconButton>
                }
                modalComponent={
                  <AlbumMaker
                    albumId={album._id}
                    albumName={album.name}
                    withSnackbar={true}
                    method="patch"
                    onAlbumNameSet={this.onAlbumNameSet}
                  />
                }
              />
            )
          }
        />
      </div>
    );
  }
}

Album.propTypes = {
  classes: PropTypes.object.isRequired,
  album: PropTypes.object.isRequired,
  ownAlbum: PropTypes.bool.isRequired,
};

const styles = (theme) => ({
  root: {
    height: "200px",
    width: "200px",
    position: "relative",
  },
  iconButtonRoot: {
    color: "rgba(255, 255, 255, 0.54)",
  },
  icon: {
    visibility: "hidden",
    opacity: "0",
  },
  settingsIcon: {
    height: "24px",
    width: "24px",
  },
  visibleSettingsIcon: {
    visibility: "visible",
    opacity: 1,
    transition: "visibility 0s, opacity .3s ease",
  },
  hiddenSettingsIcon: {
    visibility: "hidden",
  },
});

export default withStyles(styles)(Album);
