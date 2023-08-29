/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2021 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import * as React from 'react';

import MuiMenuItem from '@mui/material/MenuItem';
import CheckIcon from '../icons/CheckIcon';
import { ListItemIcon, Typography, ListItemText } from '@mui/material';

interface MenuItemProps {
    checked?: boolean;
    icon?: React.ReactElement;
    onClick(): void;
}

const MenuItem: React.FC<MenuItemProps> = ({ checked = false, children, icon = null, onClick }) => {
    return (
        <MuiMenuItem onClick={onClick} aria-selected={checked}>
            <ListItemIcon>
                {icon}
            </ListItemIcon>
            <ListItemText>
                {children}
            </ListItemText>
            {checked &&
                <Typography variant="body2">
                    <CheckIcon />
                </Typography>
            }
        </MuiMenuItem>
    );
};

export default MenuItem;
