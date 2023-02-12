import { darken, lighten } from "@mui/material/styles";


export const getBackgroundColor = (color, mode) =>
mode === 'dark' ? darken(color, 0.7) : lighten(color, 0.7);

export const getHoverBackgroundColor = (color, mode) =>
mode === 'dark' ? darken(color, 0.6) : lighten(color, 0.6);

export const getSelectedBackgroundColor = (color, mode) =>
mode === 'dark' ? darken(color, 0.5) : lighten(color, 0.5);

export const getSelectedHoverBackgroundColor = (color, mode) =>
mode === 'dark' ? darken(color, 0.4) : lighten(color, 0.4);
