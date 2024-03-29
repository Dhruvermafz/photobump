import React from "react";
import {
  withStyles,
  List,
  ListItem,
  ListItemText,
  Checkbox,
  Typography,
  IconButton,
  Avatar,
  Divider,
} from "@mui/material";
import PropTypes from "prop-types";
import moment from "moment";
import {
  Delete as DeleteIcon,
  Refresh as RefreshIcon,
} from "@mui/icons-material";
export const MessageList = (props) => {
  const {
    classes,
    listType,
    messages,
    setMessage,
    selected,
    onSelectAll,
    onSelectOne,
    onDelete,
    refreshList,
  } = props;
  return (
    <div className={classes.root}>
      <div className={classes.menuContainer}>
        <div className={classes.selectAllContainer}>
          <Checkbox
            onClick={() => onSelectAll()}
            checked={messages.length > 0 && messages.length === selected.length}
            disabled={messages.length ? false : true}
          />
          <Typography variant="body2">Select All</Typography>
        </div>
        <div>
          {selected.length > 0 && (
            <IconButton onClick={onDelete}>
              <DeleteIcon />
            </IconButton>
          )}
          <IconButton onClick={() => refreshList(listType)}>
            <RefreshIcon />
          </IconButton>
        </div>
      </div>
      <Divider />
      <List classes={{ root: classes.messageListRoot }}>
        {messages ? (
          messages.map((message) => (
            <ListItem
              className={classes.listItem}
              divider={true}
              selected={selected.includes(message._id)}
              key={message._id}
            >
              <Checkbox
                onClick={() => onSelectOne(message._id)}
                checked={selected.includes(message._id)}
              />
              <div
                onClick={() => setMessage(message._id)}
                className={classes.listItemTextContainer}
              >
                <Avatar src={message._from.profilePhoto} />
                <ListItemText primary={message._from.displayName} />
                <ListItemText primary={message.title} />
                <ListItemText
                  secondary={moment(message.lastReplied).fromNow()}
                />
              </div>
            </ListItem>
          ))
        ) : (
          <Typography align="center" variant="body2">
            No Messages to Show
          </Typography>
        )}
      </List>
    </div>
  );
};

MessageList.propTypes = {
  setList: PropTypes.func.isRequired,
  refreshList: PropTypes.func.isRequired,
  listType: PropTypes.string.isRequired,
  messages: PropTypes.array.isRequired,
  selected: PropTypes.array.isRequired,
  onSelectOne: PropTypes.func.isRequired,
  onSelectAll: PropTypes.func.isRequired,
  setMessage: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
};

const styles = (theme) => ({
  root: {
    width: "100%",
  },
  messageListRoot: {
    width: "100%",
    height: "250px",
    overflowY: "scroll",
    paddingTop: 0,
  },
  menuContainer: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    paddingLeft: `${theme.spacing.unit * 3}px`,
    paddingRight: `${theme.spacing.unit * 3}px`,
  },
  selectAllContainer: {
    display: "flex",
    alignItems: "center",
  },
  listItem: {
    cursor: "pointer",
  },
  listItemTextContainer: {
    width: "100%",
    display: "flex",
    justifyContent: "flex-start",
    alignItems: "center",
  },
});

export default withStyles(styles)(MessageList);
