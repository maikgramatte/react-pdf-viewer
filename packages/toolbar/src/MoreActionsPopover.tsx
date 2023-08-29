/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2021 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import * as React from 'react';
import Menu from '@mui/material/Menu';
import Divider from '@mui/material/Divider';

import { LocalizationContext } from '@react-pdf-viewer/core';
import { ScrollMode } from '@react-pdf-viewer/scroll-mode';
import { SelectionMode } from '@react-pdf-viewer/selection-mode';

import MoreIcon from './MoreIcon';
import ToolbarSlot from './ToolbarSlot';

interface MoreActionsPopoverProps {
    toolbarSlot: ToolbarSlot;
}

const MoreActionsPopover: React.FC<MoreActionsPopoverProps> = ({ toolbarSlot }) => {
    const l10n = React.useContext(LocalizationContext);
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const label = l10n && l10n.toolbar ? l10n.toolbar.moreActions : 'More actions';
    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    const {
        GoToFirstPageMenuItem, GoToLastPageMenuItem, RotateBackwardMenuItem, RotateForwardMenuItem, ShowPropertiesMenuItem,
        SwitchScrollModeMenuItem, SwitchSelectionModeMenuItem,
    } = toolbarSlot;

    return (
        <>
            <button 
                id="more-button" 
                onClick={handleClick} 
                className={`rpv-core-button ${open ? 'rpv-core-button-selected' : ''}`}
                aria-label={label}
                aria-controls={open ? 'more-menu' : undefined}
                aria-haspopup="true"
                aria-expanded={open ? 'true' : undefined}
            >
                <MoreIcon />
            </button>
            <Menu
                id="more-menu"
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                MenuListProps={{
                    'aria-labelledby': 'more-button',
                }}
            >
                <GoToFirstPageMenuItem onClick={handleClose} />
                <GoToLastPageMenuItem onClick={handleClose} />
                <Divider />
                <RotateForwardMenuItem onClick={handleClose} />
                <RotateBackwardMenuItem onClick={handleClose} />
                <Divider />
                <SwitchSelectionModeMenuItem mode={SelectionMode.Text} onClick={handleClose} />
                <SwitchSelectionModeMenuItem mode={SelectionMode.Hand} onClick={handleClose} />
                <Divider />
                <SwitchScrollModeMenuItem mode={ScrollMode.Vertical} onClick={handleClose} />
                <SwitchScrollModeMenuItem mode={ScrollMode.Horizontal} onClick={handleClose} />
                <SwitchScrollModeMenuItem mode={ScrollMode.Wrapped} onClick={handleClose} />
                <Divider />
                <ShowPropertiesMenuItem onClick={handleClose} />
            </Menu>
        </>
    );
};

export default MoreActionsPopover;
