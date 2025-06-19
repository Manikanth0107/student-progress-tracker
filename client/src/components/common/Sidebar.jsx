import { Link, useLocation } from "react-router-dom";
import {
  Drawer,
  List,
  ListItemButton,
  ListItemText,
  ListItemIcon,
  Toolbar,
  Collapse,
  Box,
  useTheme,
} from "@mui/material";
import {
  Dashboard as DashboardIcon,
  People as PeopleIcon,
  Settings as SettingsIcon,
  ExpandLess,
  ExpandMore,
  Email as EmailIcon,
  Sync as SyncIcon,
  Timer as TimerIcon,
} from "@mui/icons-material";
import { useState } from "react";

const drawerWidth = 240;

function Sidebar() {
  const location = useLocation();
  const theme = useTheme();
  const [openSettings, setOpenSettings] = useState(true);

  const isActive = (path) => location.pathname === path;

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: {
          width: drawerWidth,
          boxSizing: "border-box",
          backgroundColor:
            theme.palette.mode === "dark" ? "#1e293b" : "#f8fafc",
        },
      }}
    >
      <Toolbar />
      <Box sx={{ overflow: "auto", mt: 2 }}>
        <List>
          <ListItemButton
            component={Link}
            to="/"
            selected={isActive("/")}
            sx={{
              mx: 1,
              borderRadius: 1,
              "&.Mui-selected": {
                backgroundColor:
                  theme.palette.mode === "dark"
                    ? "primary.dark"
                    : "primary.light",
                color: theme.palette.primary.contrastText,
              },
            }}
          >
            <ListItemIcon sx={{ color: "inherit" }}>
              <DashboardIcon />
            </ListItemIcon>
            <ListItemText primary="Dashboard" />
          </ListItemButton>

          <ListItemButton
            component={Link}
            to="/students"
            selected={isActive("/students")}
            sx={{
              mx: 1,
              borderRadius: 1,
              "&.Mui-selected": {
                backgroundColor:
                  theme.palette.mode === "dark"
                    ? "primary.dark"
                    : "primary.light",
                color: theme.palette.primary.contrastText,
              },
            }}
          >
            <ListItemIcon sx={{ color: "inherit" }}>
              <PeopleIcon />
            </ListItemIcon>
            <ListItemText primary="Students" />
          </ListItemButton>

          <ListItemButton
            onClick={() => setOpenSettings((prev) => !prev)}
            sx={{ mx: 1, borderRadius: 1 }}
          >
            <ListItemIcon>
              <SettingsIcon />
            </ListItemIcon>
            <ListItemText primary="Settings" />
            {openSettings ? <ExpandLess /> : <ExpandMore />}
          </ListItemButton>

          <Collapse in={openSettings} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              <ListItemButton
                component={Link}
                to="/settings"
                selected={isActive("/settings")}
                sx={{
                  pl: 5,
                  "&.Mui-selected": {
                    backgroundColor:
                      theme.palette.mode === "dark"
                        ? "primary.dark"
                        : "primary.light",
                    color: theme.palette.primary.contrastText,
                  },
                }}
              >
                <ListItemIcon sx={{ color: "inherit" }}>
                  <SettingsIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText primary="General" />
              </ListItemButton>
            </List>
          </Collapse>
        </List>
      </Box>
    </Drawer>
  );
}

export default Sidebar;
