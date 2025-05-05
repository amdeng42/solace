import React from "react";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";

type ButtonIconProps = {
  tooltip: string;
  disabled?: boolean;
  onClick: () => void;
  children: React.ReactNode;
}

const ButtonIcon = ({ tooltip, onClick, children, disabled = false }: ButtonIconProps) => {
  return (
    <Tooltip title={tooltip}>
      <IconButton onClick={onClick} aria-label="reset" color="primary" disabled={disabled}>
        {children}
      </IconButton>
    </Tooltip>
  )
}

export default ButtonIcon;