/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2021 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import * as React from 'react';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Divider from '@mui/material/Divider';
import { LocalizationContext, LocalizationMap, SpecialZoomLevel } from '@react-pdf-viewer/core';
import { RenderZoomProps } from './Zoom';

const LEVELS = [0.5, 0.75, 1, 1.25, 1.5, 2, 3, 4];

const ZoomPopover: React.FC<RenderZoomProps> = ({ scale, onZoom }) => {
    const l10n = React.useContext(LocalizationContext);
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };


    const getSpcialLevelLabel = (level: SpecialZoomLevel): string | LocalizationMap => {
        switch (level) {
            case SpecialZoomLevel.ActualSize:
                return l10n && l10n.zoom ? l10n.zoom.actualSize : 'Actual size';
            case SpecialZoomLevel.PageFit:
                return l10n && l10n.zoom ? l10n.zoom.pageFit : 'Page fit';
            case SpecialZoomLevel.PageWidth:
                return l10n && l10n.zoom ? l10n.zoom.pageWidth : 'Page width';
        }
    };

    return (
        <>
            <button 
                className='rpv-core-button rpv-zoom-popover-target' 
                onClick={handleClick} 
                tabIndex={0}
                aria-label="Apply zoom"
                id="zoom-button"
                aria-controls={open ? 'zoom-menu' : undefined}
                aria-haspopup="true"
                aria-expanded={open ? 'true' : undefined}
            >
                <span className='rpv-zoom-popover-target-scale'>{Math.round(scale * 100)}%</span>
                <span className='rpv-zoom-popover-target-arrow' />
            </button>
             <Menu
                id="basic-menu"
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                dense
                MenuListProps={{
                    'aria-labelledby': 'zoom-button',
                }}
            >
                {
                    Object.keys(SpecialZoomLevel).map((k) => {
                        const level = k as SpecialZoomLevel;
                        const clickMenuItem = (): void => { handleClose(); onZoom(level); };
                        return (
                            <MenuItem key={level} onClick={clickMenuItem}>
                                {getSpcialLevelLabel(level)}
                            </MenuItem>
                        );
                    })
                }
                <Divider />
                {
                    LEVELS.map((level) => {
                        const clickMenuItem = (): void => { handleClose(); onZoom(level); };
                        return (
                            <MenuItem key={level} onClick={clickMenuItem}>
                                {`${Math.round(level * 100)}%`}
                            </MenuItem>
                        );
                    })
                }
            </Menu>
        </>
    );
};

export default ZoomPopover;
